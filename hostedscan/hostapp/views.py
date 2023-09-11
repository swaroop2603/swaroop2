from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Target,Scan,pdf,Risk
from .Serializers import Targetserializer,Scanserializer,pdfserializer,Riskserializer
from rest_framework import viewsets
import subprocess
from django.core.files.base import ContentFile
from django.conf import settings
from rest_framework.parsers import FileUploadParser
from django.http import FileResponse,HttpResponse
from rest_framework.response import Response
from django.http import FileResponse
from .pagination import CustomPagination
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import GenericAPIView

class TargetAPI(viewsets.ModelViewSet):       # add this
  serializer_class = Targetserializer         # add this
  queryset = Target.objects.all()
class ApiView(GenericAPIView):
    pagination_class = PageNumberPagination  # Use the PageNumberPagination class
    page_size = 10
    serializer_class = Targetserializer  # Define the serializer class
    queryset = Target.objects.all()
    pagination_class = CustomPagination
    def post(self, request):
        serializer=Targetserializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
           serializer.save()
           return Response(serializer.data)
      # Use the custom pagination class

    def get_object(self, id):
        try:
            return Target.objects.get(pk=id)
        except Target.DoesNotExist:
            return None

    def get(self, request, id=None):
        if id is not None:
            target = self.get_object(id)
            if target is not None:
                serializer = Targetserializer(target)
                return Response(serializer.data)
            return Response({"detail": "Target not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = Targetserializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            # If there is no pagination, return all data
            targets = Target.objects.all()
            serializer = Targetserializer(targets, many=True)
            return Response(serializer.data)

    def put(self, request,id=None):  # Change 'id' to 'pk'
        if id is not None:
            try:
                target = Target.objects.get(pk=id)
            except Target.DoesNotExist:
                return Response({"detail": "Target not found."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = Targetserializer(target, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, id=None):
            if id is not None:
                try:
                    target = Target.objects.get(pk=id)
                    target.delete()  # Delete the target
                    return Response({"detail": "Target deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
                except Target.DoesNotExist:
                    return Response({"detail": "Target not found."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
class ApiView_s(GenericAPIView):
    pagination_class = PageNumberPagination  # Use the PageNumberPagination class
    page_size = 10 
    serializer_class = Scanserializer  # Define the serializer class
    queryset = Scan.objects.all()
    pagination_class = CustomPagination
    def post(self, request):

        target_url = "google.com"
        #target_url = request.data.get('target')
        
        #if not target_url:
        #   return JsonResponse({'detail': 'Target URL is required in the request data'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            all_scan_requests = [
                ServerScanRequest(server_location=ServerNetworkLocation(hostname=target_url)),
            ]
        except ServerHostnameCouldNotBeResolved:
            return JsonResponse({'detail': 'Error resolving the supplied hostname'}, status=status.HTTP_400_BAD_REQUEST)

        scanner = Scanner()
        scanner.queue_scans(all_scan_requests)

        all_server_scan_results = []
        for server_scan_result in scanner.get_results():
            all_server_scan_results.append(server_scan_result)
            print(f"\n\n****Results for {server_scan_result.server_location.hostname}****")

            if server_scan_result.scan_status == ServerScanStatusEnum.ERROR_NO_CONNECTIVITY:
                print(
                    f"\nError: Could not connect to {server_scan_result.server_location.hostname}:"
                    f" {server_scan_result.connectivity_error_trace}"
                )
                continue

            assert server_scan_result.scan_result

            ssl2_attempt = server_scan_result.scan_result.ssl_2_0_cipher_suites
            if ssl2_attempt.status == ScanCommandAttemptStatusEnum.ERROR:
                _print_failed_scan_command_attempt(ssl2_attempt)
            elif ssl2_attempt.status == ScanCommandAttemptStatusEnum.COMPLETED:
                ssl2_result = ssl2_attempt.result
                assert ssl2_result
                print("\nAccepted cipher suites for SSL 2.0:")
                for accepted_cipher_suite in ssl2_result.accepted_cipher_suites:
                    print(f"* {accepted_cipher_suite.cipher_suite.name}")

            # Process other scan results as needed (e.g., TLS 1.3, certificate info)

        # Lastly, save all the results to a JSON file
        json_file_out = Path("api_sample_results.json")
        
        print(f"\n\n=> Saving scan results to {json_file_out}")
        json_output_as_str=self.example_json_result_output(json_file_out, all_server_scan_results, datetime.utcnow(), datetime.utcnow())
        with open(json_file_out, 'w') as json_file:
            json_file.write(json_output_as_str)

        # Create a ContentFile with the JSON data
        json_content_file = ContentFile(json_output_as_str, name='report.json')
        pdf_content = self.create_pdf(json_output_as_str)
        print(f"\n\n=> Saving scan results to out infun")
        # Return a JSON response with the scan results or a success message
        pdf_content_file = ContentFile(pdf_content, name='report.pdf')
        serializer = Scanserializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            
            target = request.data.get('target')
            label = request.data.get('label')
            
        else:
            return Response({'detail': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a dictionary to hold all data
        scan = Scan(
            target=target,
            pdf_file=pdf_content_file,
            json_file=json_content_file,
            label=label,
            
        )
        scan.save()
        return JsonResponse({'detail': 'Scan completed successfully'}, status=status.HTTP_201_CREATED)

    def example_json_result_output(self, json_file_out, all_server_scan_results, date_scans_started, date_scans_completed):
        json_output = SslyzeOutputAsJson(
            server_scan_results=[ServerScanResultAsJson.from_orm(result) for result in all_server_scan_results],
            invalid_server_strings=[],  # Not needed here - specific to the CLI interface
            date_scans_started=date_scans_started,
            date_scans_completed=date_scans_completed,
        )
        json_output_as_str = json_output.json(sort_keys=True, indent=4, ensure_ascii=True)

        # Save the JSON data to a file
        

        # Create a Scan object and save it
        return json_output_as_str

    def create_pdf(self, json_data):
        # Create a PDF buffer
        buffer = BytesIO()
        print(f"\n\n=> Saving scan results to infun")

        # Create a new PDF document
        doc = SimpleDocTemplate(buffer, pagesize=letter)

        # Create a list of flowable elements to add to the PDF
        elements = []

        # Define a custom style for the JSON content
        styles = getSampleStyleSheet()
        style = styles["Normal"]
        style.textColor = colors.black

        # Convert the JSON data to a formatted string
        json_str = json.dumps(json_data, indent=4)

        # Create a Paragraph with the JSON content and add it to the elements list
        elements.append(Paragraph(json_str, style))

        # Build the PDF document
        doc.build(elements)

        # File buffer needs to be reset for reading.
        buffer.seek(0)
        pdf_content = buffer.getvalue()
        buffer.close()
        print(f"\n\n=> Saving scan results to last infun")
        return pdf_content
    def get_object(self, id):
        try:
            return Scan.objects.get(pk=id)
        except Scan.DoesNotExist:
            return None
    def get(self, request,id=None):
        if id is not None:
            try:
                target = Scan.objects.get(pk=id)
                serializer = Scanserializer(target)
                return Response(serializer.data)
            except Scan.DoesNotExist:
                return Response({"detail": "Target not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = Scanserializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            # If there is no pagination, return all data
            targets = Scan.objects.all()
            serializer = Scanserializer(targets, many=True)
            return Response(serializer.data)
    def delete(self, request, id=None):
            if id is not None:
                try:
                    target = Scan.objects.get(pk=id)
                    target.delete()  # Delete the target
                    return Response({"detail": "Target deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
                except Scan.DoesNotExist:
                    return Response({"detail": "Target not found."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
            
class ApiView_Risk(GenericAPIView):
    pagination_class = PageNumberPagination  # Use the PageNumberPagination class
    page_size = 10
    serializer_class = Riskserializer # Define the serializer class
    queryset = Risk.objects.all()
    pagination_class = CustomPagination
    def post(self, request):
        serializer=Riskserializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
           serializer.save()
           return Response(serializer.data)
    def get_object(self, id):
        try:
            return Risk.objects.get(pk=id)
        except Risk.DoesNotExist:
            return None
    def get(self, request,id=None):
        if id is not None:
            try:
                target = Risk.objects.get(pk=id)
                serializer = Riskserializer(target)
                return Response(serializer.data)
            except Scan.DoesNotExist:
                return Response({"detail": "Target not found."}, status=status.HTTP_404_NOT_FOUND)
        else:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)

            if page is not None:
                serializer = Riskserializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            # If there is no pagination, return all data
            targets = Risk.objects.all()
            serializer = Riskserializer(targets, many=True)
            return Response(serializer.data)
            
# views.py

# views.py

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from sslyze import (
    Scanner,
    ServerScanRequest,
    ServerNetworkLocation,
    SslyzeOutputAsJson,
    ServerScanResult,
    ServerScanStatusEnum,
    ServerScanResultAsJson,
)
from sslyze.errors import ServerHostnameCouldNotBeResolved
from sslyze.scanner.scan_command_attempt import ScanCommandAttemptStatusEnum
from datetime import datetime
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import json
def _print_failed_scan_command_attempt(scan_command_attempt):
    print(
        f"\nError when running ssl_2_0_cipher_suites: {scan_command_attempt.error_reason}:\n"
        f"{scan_command_attempt.error_trace}"
    )

class SSLyzeScanAPI(APIView):
    def post(self, request):
        target_url = "google.com"
        try:
            all_scan_requests = [
                ServerScanRequest(server_location=ServerNetworkLocation(hostname=target_url)),
            ]
        except ServerHostnameCouldNotBeResolved:
            return JsonResponse({'detail': 'Error resolving the supplied hostname'}, status=status.HTTP_400_BAD_REQUEST)

        scanner = Scanner()
        scanner.queue_scans(all_scan_requests)

        all_server_scan_results = []
        for server_scan_result in scanner.get_results():
            all_server_scan_results.append(server_scan_result)
            print(f"\n\n****Results for {server_scan_result.server_location.hostname}****")

            if server_scan_result.scan_status == ServerScanStatusEnum.ERROR_NO_CONNECTIVITY:
                print(
                    f"\nError: Could not connect to {server_scan_result.server_location.hostname}:"
                    f" {server_scan_result.connectivity_error_trace}"
                )
                continue

            assert server_scan_result.scan_result

            ssl2_attempt = server_scan_result.scan_result.ssl_2_0_cipher_suites
            if ssl2_attempt.status == ScanCommandAttemptStatusEnum.ERROR:
                _print_failed_scan_command_attempt(ssl2_attempt)
            elif ssl2_attempt.status == ScanCommandAttemptStatusEnum.COMPLETED:
                ssl2_result = ssl2_attempt.result
                assert ssl2_result
                print("\nAccepted cipher suites for SSL 2.0:")
                for accepted_cipher_suite in ssl2_result.accepted_cipher_suites:
                    print(f"* {accepted_cipher_suite.cipher_suite.name}")

            # Process other scan results as needed (e.g., TLS 1.3, certificate info)

        # Lastly, save all the results to a JSON file
        json_file_out = Path("api_sample_results.json")
        
        print(f"\n\n=> Saving scan results to {json_file_out}")
        self.example_json_result_output(json_file_out, all_server_scan_results, datetime.utcnow(), datetime.utcnow())

        # Return a JSON response with the scan results or a success message
        return JsonResponse({'detail': 'Scan completed successfully'}, status=status.HTTP_201_CREATED)

    def example_json_result_output(self, json_file_out, all_server_scan_results, date_scans_started, date_scans_completed):
        json_output = SslyzeOutputAsJson(
            server_scan_results=[ServerScanResultAsJson.from_orm(result) for result in all_server_scan_results],
            invalid_server_strings=[],  # Not needed here - specific to the CLI interface
            date_scans_started=date_scans_started,
            date_scans_completed=date_scans_completed,
        )
        json_output_as_str = json_output.json(sort_keys=True, indent=4, ensure_ascii=True)

        # Save the JSON data to a file
        with open(json_file_out, 'w') as json_file:
            json_file.write(json_output_as_str)

        # Create a ContentFile with the JSON data
        json_content_file = ContentFile(json_output_as_str, name='report.json')

        # Create a Scan object and save it
        scan = Scan(json_file=json_content_file)
        scan.save()
                # Retrieve the specific Scan object that has a 'json_file'
    
        # Read the JSON data from the 'json_file' field
       
        # Create a PDF report from the JSON data
        pdf_content = self.create_pdf(json_output_as_str)
        print(f"\n\n=> Saving scan results to outfun")
        # Optionally save the PDF content as a file in the Scan model
        
        pdf_content_file = ContentFile(pdf_content, name='report.pdf')

        # Create a Scan object and save it
        scan.pdf_file= pdf_content_file
        scan.save()
        print(f"\n\n=> Saving scan results to odf")
        # Return a response indicating success or providing data about the saved PDF
        response_data = {
            'message': 'PDF report generated and saved successfully.',
            'pdf_file_id': scan.id,  # Optionally return the ID of the saved PDF
        }
        
        return JsonResponse(response_data, status=201)

    def create_pdf(self, json_data):
        # Create a PDF buffer
        buffer = BytesIO()
        print(f"\n\n=> Saving scan results to infun")

        # Create a new PDF document
        doc = SimpleDocTemplate(buffer, pagesize=letter)

        # Create a list of flowable elements to add to the PDF
        elements = []

        # Define a custom style for the JSON content
        styles = getSampleStyleSheet()
        style = styles["Normal"]
        style.textColor = colors.black

        # Convert the JSON data to a formatted string
        json_str = json.dumps(json_data, indent=4)

        # Create a Paragraph with the JSON content and add it to the elements list
        elements.append(Paragraph(json_str, style))

        # Build the PDF document
        doc.build(elements)

        # File buffer needs to be reset for reading.
        buffer.seek(0)
        pdf_content = buffer.getvalue()
        buffer.close()
        

        return pdf_content
def example_json_result_parsing(self, results_as_json_file):
    results_as_json = results_as_json_file.read_text()
    parsed_results = SslyzeOutputAsJson.parse_raw(results_as_json)
    print("The following servers were scanned:")
    for server_scan_result in parsed_results.server_scan_results:
        print(f"\n****{server_scan_result.server_location.hostname}:{server_scan_result.server_location.port}****")
        if server_scan_result.scan_status == ServerScanStatusEnum.ERROR_NO_CONNECTIVITY:
            print(f"That scan failed with the following error:\n{server_scan_result.connectivity_error_trace}")
            continue

        assert server_scan_result.scan_result
        certinfo_attempt = server_scan_result.scan_result.certificate_info
        if certinfo_attempt.status == ScanCommandAttemptStatusEnum.ERROR:
            _print_failed_scan_command_attempt(certinfo_attempt)
        else:
            certinfo_result = server_scan_result.scan_result.certificate_info.result
            assert certinfo_result
            for cert_deployment in certinfo_result.certificate_deployments:
                print(f"    SHA1 of leaf certificate: {cert_deployment.received_certificate_chain[0].fingerprint_sha1}")
            print("")
import json
from django.http import JsonResponse

 # Replace 'myapp' with your app name
from django.core.files.base import ContentFile
from io import BytesIO
from reportlab.lib.pagesizes import letter


from reportlab.platypus import Paragraph,SimpleDocTemplate
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

class JSONToPDF(APIView):

    def post(self, request):
        # Retrieve the specific Scan object that has a 'json_file'
        try:
            scan = Scan.objects.get(json_file__isnull=False)
        except Scan.DoesNotExist:
            return JsonResponse({'message': 'No Scan object with a JSON file found'}, status=404)

        # Read the JSON data from the 'json_file' field
        try:
            json_data = json.loads(scan.json_file.read())
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON data in the file'}, status=400)

        # Create a PDF report from the JSON data
        pdf_content = self.create_pdf(json_data)

        # Optionally save the PDF content as a file in the Scan model
        scan.pdf_file.save('report.pdf', ContentFile(pdf_content))

        # Return a response indicating success or providing data about the saved PDF
        response_data = {
            'message': 'PDF report generated and saved successfully.',
            'pdf_file_id': scan.id,  # Optionally return the ID of the saved PDF
        }
        return JsonResponse(response_data, status=201)

    def create_pdf(self, json_data):
        # Create a PDF buffer
        buffer = BytesIO()

        # Create a new PDF document
        doc = SimpleDocTemplate(buffer, pagesize=letter)

        # Create a list of flowable elements to add to the PDF
        elements = []

        # Define a custom style for the JSON content
        styles = getSampleStyleSheet()
        style = styles["Normal"]
        style.textColor = colors.black

        # Convert the JSON data to a formatted string
        json_str = json.dumps(json_data, indent=4)

        # Create a Paragraph with the JSON content and add it to the elements list
        elements.append(Paragraph(json_str, style))

        # Build the PDF document
        doc.build(elements)

        # File buffer needs to be reset for reading.
        buffer.seek(0)
        pdf_content = buffer.getvalue()
        buffer.close()

        return pdf_content
####
    # Your other methods
from django.shortcuts import render
from django import forms
from .models import pdf

class UploadPdfForm(forms.Form):
    pdf_file = forms.FileField(label='Select a PDF file')

def upload_pdf(request):
    if request.method == 'POST':
        form = UploadPdfForm(request.POST, request.FILES)
        if form.is_valid():
            pdf_file = form.cleaned_data['pdf_file']
            pdf_obj = pdf(pdf_file=pdf_file)
            pdf_obj.save()
            return render(request, 'success.html')  # Redirect to success page
    else:
        form = UploadPdfForm()
    return render(request, 'upload_pdf.html', {'form': form})
