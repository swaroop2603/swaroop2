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
from rest_framework.generics import GenericAPIView,RetrieveAPIView
from uuid import uuid4
import re
from urllib.parse import urlparse
from django.db.models import F, Value
from reportlab.platypus.flowables import Spacer
from reportlab.platypus import SimpleDocTemplate, Table, PageBreak
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from .localsettings import table,font,Output
from .header import headertable
from reportlab.lib.pagesizes import A4
from .Appendix import appendix
from .footer import footertable
import math

from reportlab.platypus import Table,Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
import json
from datetime import datetime
class TargetAPI(viewsets.ModelViewSet):       # add this
  serializer_class = Targetserializer         # add this
  queryset = Target.objects.all()
def is_valid_target(value):
    # Define regular expressions for IPv4, domain, and public CIDR formats
    ipv4_pattern = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$')
    domain_pattern = re.compile(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    public_cidr_pattern = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/\d{1,2}$')

    # Check if the value matches any of the patterns
    if ipv4_pattern.match(value) or public_cidr_pattern.match(value):
        return True
    parsed_url = urlparse(value)
    domain = parsed_url.netloc
    if domain_pattern.match(domain):
        return True

    return False
class ApiView(GenericAPIView):
    pagination_class = PageNumberPagination  # Use the PageNumberPagination class
    page_size = 10
    serializer_class = Targetserializer  # Define the serializer class
    queryset = Target.objects.all()
    pagination_class = CustomPagination
    def post(self, request):
        target_url=request.data.get("target")
        print(f"{target_url}")
        if not is_valid_target(target_url):
            print(f"Invalid target format: {target_url}")
            return Response({"error": "Invalid target format"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = Targetserializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
            sort_field = request.query_params.get('sortField', 'date')
            sort_order = request.query_params.get('sortOrder', 'desc')
            print(f"{sort_field}")

        if sort_order == 'desc':
            queryset = Target.objects.all().order_by(F(sort_field).desc())
        else:
            queryset = Target.objects.all().order_by(F(sort_field).desc())

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = Targetserializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer =Targetserializer(page, many=True)
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
        print(f"\n\n****post****")
        #target_url = "google.com"
        target_url = request.data.get('target')
        target_url_main=target_url
        labels=request.data.get('label')
        print(f"\n\n****{target_url}****")
        ipv4_pattern = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$')
        domain_pattern = re.compile(r'^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        public_cidr_pattern = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/\d{1,2}$')

        # Check if the value matches any of the patterns
        if ipv4_pattern.match(target_url) or public_cidr_pattern.match(target_url):
            target_url=target_url
        parsed_url = urlparse(target_url)
        domain = parsed_url.netloc
        if domain_pattern.match(domain):
            target_url=domain
        print(f"\n\n****{target_url}****")
        if not target_url:
            print(f"\n\n****if post****")
            return JsonResponse({'detail': 'Target URL is required in the request data'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            print(f"\n\n****try post****")
            all_scan_requests = [
                ServerScanRequest(server_location=ServerNetworkLocation(hostname=target_url)),
            ]
        except ServerHostnameCouldNotBeResolved:
            print(f"\n\n****expect post****")
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
        pdf_content_list = self.create_pdf(json_output_as_str)
        pdf_content=pdf_content_list[0]
        pdf_content_raw=pdf_content_list[1]
        print(f"\n\n=> Saving scan results to out infun")
        # Return a JSON response with the scan results or a success message
        
        print(f"\n\n=> if1")

        serializer = Scanserializer(data=request.data)
        print(f"\n\n=> if2")
        unique_filename = f"{uuid4()}.pdf"

        # Save the PDF content with the unique filename
        pdf_file = ContentFile(pdf_content,name='report.pdf')
        pdf_file_raw = ContentFile(pdf_content_raw,name='report_raw.pdf')


        # Create a dictionary to hold all data
        scan = Scan(
            target=target_url_main,
            pdf_file=pdf_file,
            pdf_file_raw=pdf_file_raw,
            json_file=json_content_file,
            label=labels,
            
        )
        scan.save()
        def get_risks(scan_results,json_data):
            def create_pdf_risk(json_data):
                data=json.loads(json_data)
                server_scan_results = data.get("server_scan_results", [])  # Get the array, default to empty list if not present
                date_scans_started=data.get("date_scans_started")
                date_obj = datetime.strptime(date_scans_started, "%Y-%m-%dT%H:%M:%S.%f")


                date_scans_started = date_obj.strftime("%B %d, %Y")
                for idx, result in enumerate(server_scan_results):
                    connectivity_result = result.get("connectivity_result",
                                                    {})  # Get the connectivity_result, default to empty dictionary if not present
                    cipher_suite_supported = connectivity_result.get("cipher_suite_supported")
                    connectivity_status=result.get("connectivity_status")
                    tls_version = connectivity_result.get("highest_tls_version_supported")
                    supports_ecdh_key_exchange=connectivity_result.get("supports_ecdh_key_exchange")

                    ecdh_key_exchange="Rejected"
                    if supports_ecdh_key_exchange is True:
                        ecdh_key_exchange="accepted"

                    server_location=result.get("server_location",{})
                    host=server_location.get("hostname")
                    ip_address=server_location.get("ip_address")
                    port=server_location.get("port")

                def bodytable(widths,heights,i):
                    print(f"body table risk")
                    widthlist=[
                        widths*5/100,
                        widths*90/100,
                        widths*5/100,
                    ]
                    if i==1:
                        res=page1(widthlist[1],heights)
                        return res
                    elif i==2:
                        res=appendix(widthlist[1],heights)
                        return res
                    elif i==3:
                        res=page2(widthlist[1],heights)
                        return res
                    
                def page1(widths,heights):
                    widthlist=[
                        widths*5/100,
                        widths*90/100,
                        widths*5/100
                    ]
                    heightlist=[
                        heights*2/100,
                        heights*33/100,
                        heights*4/100,
                        heights*8/100,
                        heights*8/100,
                        heights*16/100,
                        heights*9/100,
                        heights*15/100,
                        heights*2.5/100,
                        heights*2.5/100
                    ]
                    res=Table([
                        [''],
                        [''],
                        [page1text1(widthlist[1],heightlist[1])],
                        [''],
                        [page1text2(widthlist[1],heightlist[3])],
                        [''],
                        [''],
                        [''],
                        [''],
                        ['']
                        
                    ],widthlist[1],heightlist)
                    color=colors.HexColor('#87CEEB')
                    res.setStyle([
                        #('GRID',(0,0),(-1,-1),1,'red'),
                        #('TEXTCOLOR',(0,1),(-1,-1),'white'),
                        ('FONTNAME',(0,1),(0,1),'caliber-bold'),
                        ('FONTSIZE',(0,1),(0,1),30),
                        ('BOTTOMPADDING',(0,1),(0,1),30),
                        ('BACKGROUND',(0,1),(-1,-2),color),
                        ('LEFTPADDING',(0,0),(-1,-1),20),
                        ('LINEBELOW',(0,-1),(-1,-1),1,'black')
                    ])
                    return res
                def page1text1(widths,heights):

                    text=f"Risk Report on {host}"
                    
                    res=Table([
                        [text],
                    ],widths,heights)
                    res.setStyle([
                        ('TEXTCOLOR',(0,0),(-1,-1),'white'),
                        ('FONTNAME',(0,0),(-1,-1),'caliber-bold'),
                        ('FONTSIZE',(0,0),(-1,-1),30),
                    ])
                    return res
                def page1text2(widths,heights):
                    text1="S3 Infotech"
                    text2=f"{date_scans_started}"
                    heightlist=[
                        heights*20/100,
                        heights*50/100,
                    ]
                    res=Table([
                        [text1],
                        [text2]
                    ],widths,heightlist)
                    res.setStyle([
                        ('TEXTCOLOR',(0,0),(-1,-1),'white'),
                        ('FONTNAME',(0,0),(-1,-1),'caliber'),
                        ('FONTSIZE',(0,0),(-1,-1),20),
                    ])
                    return res


                def page2(widths,heights):
                    widthlist=[
                        widths*5/100,
                        widths*90/100,
                        widths*5/100
                    ]
                    heightlist=[
                        heights*8/100,
                        heights*3/100,
                        heights*3/100,
                        heights*3/100,
                        heights*6/100,
                        heights*1.5/100,
                        heights*30/100,

                        heights*40/100,
                    ]
                    res=Table([
                        [page2text1(widthlist[1],heightlist[0])],
                        [''],
                        [page2text2(widthlist[1],heightlist[2])],
                        [''],
                        [page2text3(widthlist[1],heightlist[4])],
                        [''],
                        [page2text4(widthlist[1],heightlist[6])],
                        

                        [''],
                    ],widthlist[1],heightlist)
                    res.setStyle([
                        #('GRID',(0,0),(-1,-1),1,'red'),
                        ('LINEBELOW',(0,-1),(-1,-1),1,'black')
                    ])
                    return res
                def page2text1(widths,heights):
                    text="Vulnerability Summary"
                    res=Table([
                        [text]
                    ],widths,heights)
                    color=colors.HexColor('#87CEEB')
                    res.setStyle([
                        ('TEXTCOLOR',(0,0),(-1,-1),'white'),
                        ('FONTNAME',(0,0),(-1,-1),'Helvetica'),
                        ('FONTSIZE',(0,0),(-1,-1),20),
                        ('BACKGROUND',(0,0),(0,0),color),
                        ('BOTTOMPADDING',(0,0),(-1,-1),30)

                    ])
                    return res
                def page2text2(widths,heights):
                    text="Quick View"
                    res=Table([
                        [text]
                    ],widths,heights)
                    color=colors.HexColor("#89CFF0")
                    res.setStyle([
                        ('TEXTCOLOR',(0,0),(-1,-1),color),
                        ('FONTNAME',(0,0),(-1,-1),'caliber'),
                        ('FONTSIZE',(0,0),(-1,-1),20),
                    ])
                    return res
                def page2text3(widths,heights):

                    text1="The table below is designed to provide a quick view of all the identified findings and their respective risk ratings. Please see the following section for a detailed listing of the identified findings."

                    para1style = ParagraphStyle('st')
                    para1style.fontName = 'caliber'
                    para1style.fontSize = 12
                    para1style.spaceAfter = 10
                    para1=Paragraph(text1,para1style)
                    res=Table([
                        [para1],
                        ],widths,heights)
                    res.setStyle([
                        #('GRID',(0,0),(-1,-1),1,'red'),
                        ('FONTNAME',(0,0),(-1,-1),'caliber'),
                        ('FONTSIZE',(0,0),(-1,-1),10),
                    ])
                    return res
                def page2text4(widths,heights):
                    heightlist = []
                    for i in range(0, 5):
                        heightlist.append(heights * 20 / 100)
                    widthlist = [
                        widths*2/100,
                        widths * 48 / 100,
                        widths * 25 / 100,
                        widths * 25 / 100,
                    ]
                    res=Table([
                        ["#","Finding Title","Instances","Rating"],
                        ["1", "Shared Local Administrator Password", "1", "Critical"],
                        ["2", "SMB Signing Not Enabled", "9", "High"],
                        ["3", "DNS Cache Snooping", "3", "Medium"],
                        ["4", "Apache mod_negotiation (Apache MultiViews)", "1", " Low"],

                    ],widthlist,heightlist)

                    res.setStyle([
                        #('GRID',(0,0),(-1,-1),1,'red'),

                        ('FONTNAME',(0,0),(-1,-1),'caliber'),
                        ('FONTSIZE', (0, 0), (-1, -1), 10),
                        ('FONTSIZE',(0,0),(-1,0),14),
                    ])
                    return res
                def main_table():
                    print(f"inside pdf1 main")
                    widths,heights,size=table()
                    widths+=100
                    heights+=100
                    buffer = BytesIO()
                    
                    pdf=canvas.Canvas(buffer,pagesize=A4)
                    pdf.setAuthor("Your Author Name")
                    pdf.setTitle("Your Title")
                    pdf.setSubject("Your Subject")
                    pdf.setKeywords("Keyword1, Keyword2, Keyword3")
                    heightList=[
                        heights*0.005,
                        heights*0.08,
                        heights*0.7,
                        heights*0.05,
                        heights*0.0025,
                    ]
                    widthlist=[
                        widths*5/100,
                        widths*90/100,
                        widths*5/100,
                    ]
                    #a=pdf.getAvailableFonts()
                    #print(a)
                    font()
                    for i in range(1,4):
                        mainTable=Table([
                            ['','',''],
                            ['',headertable(widthlist[1],heightList[1],i),''],
                            ['',bodytable(widthlist[1],heightList[2],i),''],
                            ['',footertable(widthlist[1],heightList[3],i),''],
                            ['','','']
                            ],colWidths=widthlist,rowHeights=heightList)
                        #mainTable.setStyle([
                        #('GRID',(0,0),(-1,-1),1,'red')])
                        mainTable.wrapOn(pdf,0,0)
                        mainTable.drawOn(pdf,0,0)
                        pdf.showPage()
                    pdf.save()
                    # Add a page break between sections
                    pdf_content = buffer.getvalue()
                    buffer.close()
                    

                    return pdf_content
                

                pdf_content=main_table()
                return pdf_content
            first_scan_result = scan_results[0].scan_result
            
            risks_list = [["Name", "Description", "Severity", "Status"]]
            title=[]
            threadlvl=[]
            status=[]
            url=[]
            scantype=[]
            risktls13name = "%s -> %s" % (first_scan_result.tls_1_3_cipher_suites.result.tls_version_used.name, 
                                        first_scan_result.tls_1_3_cipher_suites.result.is_tls_version_supported)
            risks_list.append([risktls13name, "TLS 1.3 vulnerability", "Critical", "Open"])
            
            #print(f"{title}")
            title.append(risks_list[1][1])
            threadlvl.append(risks_list[1][2])
            status.append(risks_list[1][3])
            url.append(target_url)
            scantype.append("ssylze")
                
            risktls12name = "%s -> %s" % (first_scan_result.tls_1_2_cipher_suites.result.tls_version_used.name, 
                                        first_scan_result.tls_1_2_cipher_suites.result.is_tls_version_supported)
            risks_list.append([risktls12name, "TLS 1.2 generic", "High", "Open"])
        
            #print(f"{title}")
            title.append(risks_list[2][1])
            threadlvl.append(risks_list[2][2])
            status.append(risks_list[2][3])
            url.append(target_url)
            scantype.append("ssylze")
                
            risktls11name = "%s -> %s" % (first_scan_result.tls_1_1_cipher_suites.result.tls_version_used.name, 
                                        first_scan_result.tls_1_1_cipher_suites.result.is_tls_version_supported)
            risks_list.append([risktls11name, "TLS 1.1 support", "Medium", "Open"])
            
            #print(f"{title}")
            title.append(risks_list[3][1])
            threadlvl.append(risks_list[3][2])
            status.append(risks_list[3][3])
            url.append(target_url)
            scantype.append("ssylze")
                
            risktls10name = "%s -> %s" % (first_scan_result.tls_1_0_cipher_suites.result.tls_version_used.name, 
                                        first_scan_result.tls_1_0_cipher_suites.result.is_tls_version_supported)
            risks_list.append([risktls10name, "TLS 1.0 related", "Low", "Open"])
            
            #print(f"{title}")
            title.append(risks_list[4][1])
            threadlvl.append(risks_list[4][2])
            status.append(risks_list[4][3])
            url.append(target_url)
            scantype.append("ssylze")
            rejected_cipher_suitessslv3 = first_scan_result.ssl_3_0_cipher_suites.result.rejected_cipher_suites
            for i in rejected_cipher_suitessslv3:
                sslv3risk_name = "%s->%s" %(i.cipher_suite.name,i.cipher_suite.openssl_name)
                risks_list.append([sslv3risk_name, "SSL V3 detail", "Info", "N/A"])
                break
            title.append(risks_list[5][1])
            threadlvl.append(risks_list[5][2])
            status.append(risks_list[5][3])
            url.append(target_url)
            scantype.append("ssylze")
            target_as_string = json.dumps(url)
            pdf_risk=create_pdf_risk(json_data)
            pdf_risk_content = ContentFile(pdf_risk,name='report_risk.pdf')
            
            print(f"{id}")

            print(f"{target_as_string[1]}")
            latest_scan = Scan.objects.latest('id')


            latest_scan_id = latest_scan.id
            try:
                risk_instance = Risk.objects.get(target=target_url)
                
                risk_instance.Title = title
                risk_instance.id_risk=latest_scan_id
                risk_instance.Scantype = scantype
                risk_instance.Thread_Level = threadlvl
                risk_instance.STatus = status
                risk_instance.pdf_file_risk=pdf_risk_content
                
                risk_instance.save()
            except Risk.DoesNotExist:
                
                risk5=Risk(
                        Title=title,
                        id_risk=latest_scan_id,
                        Scantype=scantype,
                        target =target_url,
                        Thread_Level=threadlvl,
                        STatus=status,
                        pdf_file_risk=pdf_risk_content,
                    )
                risk5.save()
            #print(f"{title}")
            #print(f"{risks_list}")
            return risks_list
       
     
        risks_list = get_risks(all_server_scan_results,json_output_as_str)
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
        print(f"inside pdf1")
        data=json.loads(json_data)

        # Access "connectivity_result" within each object in the "server_scan_results" array
        server_scan_results = data.get("server_scan_results", [])  # Get the array, default to empty list if not present
        date_scans_started=data.get("date_scans_started")
        date_obj = datetime.strptime(date_scans_started, "%Y-%m-%dT%H:%M:%S.%f")


        date_scans_started = date_obj.strftime("%B %d, %Y")
        for idx, result in enumerate(server_scan_results):
            connectivity_result = result.get("connectivity_result",
                                            {})  # Get the connectivity_result, default to empty dictionary if not present
            cipher_suite_supported = connectivity_result.get("cipher_suite_supported")
            connectivity_status=result.get("connectivity_status")
            tls_version = connectivity_result.get("highest_tls_version_supported")
            supports_ecdh_key_exchange=connectivity_result.get("supports_ecdh_key_exchange")

            ecdh_key_exchange="Rejected"
            if supports_ecdh_key_exchange is True:
                ecdh_key_exchange="accepted"

            server_location=result.get("server_location",{})
            host=server_location.get("hostname")
            ip_address=server_location.get("ip_address")
            port=server_location.get("port")
            scan_result=result.get("scan_result",{})
            #print(scan_result)
            certificate_info=scan_result.get("certificate_info",{})
            certificate_result=certificate_info.get("result",{})
            certificate_deployments=certificate_result.get("certificate_deployments",[])
            #print(len(certificate_deployments))
            elliptic_curves=scan_result.get("elliptic_curves",{})
            #print(elliptic_curves)
            result=elliptic_curves.get("result",{})
            #print(result)
            elliptic_rejected_curves=result.get("rejected_curves",[])
            elliptic_supported_curves=result.get("supported_curves",[])
            supported_elliptic_list=[]
            rejected_elliptic_list=[]
            for curve in elliptic_supported_curves:
                name=curve.get("name")
                supported_elliptic_list.append(name)
                #print("supported curve name",name)
            for curve in elliptic_rejected_curves:
                name = curve.get("name")
                rejected_elliptic_list.append(name)
                #print("Rejected Curve Name:", name)
            #print(supported_elliptic_list)
            tls_fallback_scsv=scan_result.get("tls_fallback_scsv")
            result_tls=tls_fallback_scsv.get("result")
            supports_fallback_scsv=result_tls.get("supports_fallback_scsv")
            #print(supports_fallback_scsv)
            heartbleed=scan_result.get("heartbleed")
            result_heart=heartbleed.get("result")
            is_vulnerable_to_heartbleed=result_heart.get("is_vulnerable_to_heartbleed")
            status_heart=heartbleed.get("status")
            if is_vulnerable_to_heartbleed is True:
                is_vulnerable_to_heartbleed="Not Vunerable to heart bleed"
            else:
                is_vulnerable_to_heartbleed="Vunerable to heart bleed"
            #print(is_vulnerable_to_heartbleed)
            #print(status_heart)
            ssl_2_0_cipher_cuites=scan_result.get("ssl_2_0_cipher_suites")
            result_ssl_2_0=ssl_2_0_cipher_cuites.get("result")
            accepted_cipher_suites_ssl_2_0=result_ssl_2_0.get("accepted_cipher_suites",[])
            #print(accepted_cipher_suites_ssl_2_0)
            for curve in accepted_cipher_suites_ssl_2_0:
                cipher_suite = curve.get("cipher_suite")
                ephemeral_key=curve.get("ephemeral_key")
                if ephemeral_key != None:
                    size=ephemeral_key.get("size")
                    curve_name=ephemeral_key.get("curve_name")
                    type_name=ephemeral_key.get("type_name")
                    #print(size)
                    #print(type_name)
                    #print(curve_name)
                name = cipher_suite.get("name")
                #print("accepted ssl_2_0 Curve Name:", name)
            rejected_cipher_suites_ssl_2_0=result_ssl_2_0.get("rejected_cipher_suites",[])
            # Print the values for each result
            #print(rejected_cipher_suites_ssl_2_0)
            for curve in rejected_cipher_suites_ssl_2_0:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                #print("Rejected ssl_2_0 Curve Name:", name)
            ssl_2_0_cipher_cuites=scan_result.get("ssl_2_0_cipher_suites")
            result_ssl_2_0=ssl_2_0_cipher_cuites.get("result")
            accepted_cipher_suites_ssl_2_0=result_ssl_2_0.get("accepted_cipher_suites",[])
            #print(accepted_cipher_suites_ssl_2_0)
            for curve in accepted_cipher_suites_ssl_2_0:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                ephemeral_key = curve.get("ephemeral_key")
                if ephemeral_key != None:
                    size=ephemeral_key.get("size")
                    curve_name=ephemeral_key.get("curve_name")
                    type_name=ephemeral_key.get("type_name")
                    #print(size)
                    #print(type_name)
                    #print(curve_name)
            #print("Rejected ssl_2_0 Curve Name:", name)
            ssl_3_0_cipher_cuites=scan_result.get("ssl_3_0_cipher_suites")
            result_ssl_3_0=ssl_3_0_cipher_cuites.get("result")
            accepted_cipher_suites_ssl_3_0=result_ssl_3_0.get("accepted_cipher_suites",[])
            #print(accepted_cipher_suites_ssl_2_0)
            for curve in accepted_cipher_suites_ssl_3_0:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                ephemeral_key = curve.get("ephemeral_key")
                if ephemeral_key != None:
                    size=ephemeral_key.get("size")
                    curve_name=ephemeral_key.get("curve_name")
                    type_name=ephemeral_key.get("type_name")
                    #print(size)
                    #print(type_name)
                    #print(curve_name)
                #print("accepted ssl_3_0 Curve Name:", name)
            rejected_cipher_suites_ssl_3_0=result_ssl_3_0.get("rejected_cipher_suites",[])
            # Print the values for each result
            #print(rejected_cipher_suites_ssl_3_0)
            for curve in rejected_cipher_suites_ssl_3_0:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                #print("Rejected ssl_2_0 Curve Name:", name)
            tls_1_0_cipher_cuites=scan_result.get("tls_1_0_cipher_suites")
            result_tls_1_0=tls_1_0_cipher_cuites.get("result")
            accepted_cipher_suites_tls_1_0=result_tls_1_0.get("accepted_cipher_suites",[])
            #print(accepted_cipher_suites_ssl_2_0)
            for curve in accepted_cipher_suites_tls_1_0:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                ephemeral_key = curve.get("ephemeral_key")
                if ephemeral_key != None:
                    size=ephemeral_key.get("size")
                    curve_name=ephemeral_key.get("curve_name")
                    type_name=ephemeral_key.get("type_name")
                    #print(size)
                    #print(type_name)
                    #print(curve_name)
                #print("accepted tls_1_0 Curve Name:", name)
            rejected_cipher_suites_tls_1_0=result_tls_1_0.get("rejected_cipher_suites",[])
            # Print the values for each result
            #print(rejected_cipher_suites_tls_1_0)
            for curve in rejected_cipher_suites_tls_1_0:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                #print("Rejected tls_1_0 Curve Name:", name)
            tls_1_1_cipher_cuites = scan_result.get("tls_1_1_cipher_suites")
            result_tls_1_1 = tls_1_1_cipher_cuites.get("result")
            accepted_cipher_suites_tls_1_1 = result_tls_1_1.get("accepted_cipher_suites", [])
            # print(accepted_cipher_suites_ssl_2_0)
            for curve in accepted_cipher_suites_tls_1_1:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                ephemeral_key = curve.get("ephemeral_key")
                if ephemeral_key != None:
                    size=ephemeral_key.get("size")
                    curve_name=ephemeral_key.get("curve_name")
                    type_name=ephemeral_key.get("type_name")
                    #print(size)
                    #print(type_name)
                    #print(curve_name)
                #print("accepted tls_1_1 Curve Name:", name)
            rejected_cipher_suites_tls_1_1 = result_tls_1_1.get("rejected_cipher_suites", [])
            # Print the values for each result
            #print(rejected_cipher_suites_tls_1_1)
            for curve in rejected_cipher_suites_tls_1_1:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                #print("Rejected tls_1_1 Curve Name:", name)
            tls_1_2_cipher_cuites = scan_result.get("tls_1_2_cipher_suites")
            result_tls_1_2 = tls_1_2_cipher_cuites.get("result")
            accepted_cipher_suites_tls_1_2 = result_tls_1_2.get("accepted_cipher_suites", [])
            # print(accepted_cipher_suites_ssl_2_0)
            for curve in accepted_cipher_suites_tls_1_2:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                ephemeral_key = curve.get("ephemeral_key")
                if ephemeral_key != None:
                    size=ephemeral_key.get("size")
                    curve_name=ephemeral_key.get("curve_name")
                    type_name=ephemeral_key.get("type_name")
                    #print(size)
                    #print(type_name)
                    #print(curve_name)
                #print("accepted tls_1_2 Curve Name:", name)
            rejected_cipher_suites_tls_1_2 = result_tls_1_2.get("rejected_cipher_suites", [])
            # Print the values for each result
            #print(rejected_cipher_suites_tls_1_2)
            for curve in rejected_cipher_suites_tls_1_2:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                #print("Rejected tls_1_2 Curve Name:", name)
            tls_1_3_cipher_cuites = scan_result.get("tls_1_3_cipher_suites")
            result_tls_1_3 = tls_1_3_cipher_cuites.get("result")
            accepted_cipher_suites_tls_1_3 = result_tls_1_3.get("accepted_cipher_suites", [])
            # print(accepted_cipher_suites_ssl_2_0)
            for curve in accepted_cipher_suites_tls_1_3:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                ephemeral_key = curve.get("ephemeral_key")
                if ephemeral_key != None:
                    size=ephemeral_key.get("size")
                    curve_name=ephemeral_key.get("curve_name")
                    type_name=ephemeral_key.get("type_name")
                    #print(size)
                    #print(type_name)
                    #print(curve_name)
                #print("accepted tls_1_3 Curve Name:", name)
            rejected_cipher_suites_tls_1_3 = result_tls_1_3.get("rejected_cipher_suites", [])
            # Print the values for each result
            #print(rejected_cipher_suites_tls_1_3)
            for curve in rejected_cipher_suites_tls_1_3:
                cipher_suite = curve.get("cipher_suite")
                name = cipher_suite.get("name")
                #print("Rejected tls_1_3 Curve Name:", name)
            robot=scan_result.get("robot")
            status_robot=robot.get("status")
            result_robot=robot.get("result")
            result_robot=result_robot.get("robot_result")
            session_renegotiation=scan_result.get('session_renegotiation',{})
            result_session_renegotiation=session_renegotiation.get('result',{})
            is_vulnerable_to_client_renegotiation_dos_renegotiation=result_session_renegotiation.get("is_vulnerable_to_client_renegotiation_dos")
            supports_secure_renegotiation_renegotiation=result_session_renegotiation.get("supports_secure_renegotiation")
            tls_compression=scan_result.get("tls_compression")
            status_tls_compression=tls_compression.get("status")
            result_tls_compression=tls_compression.get("result")
            result_tls_compression=result_tls_compression.get("supports_compression")
            session_renegotiation_status=session_renegotiation.get("status")
            #print(result_tls_compression)
            #print(status_tls_compression)

            #print(result_robot)
            #print(status_robot)
            tls_1_3_early_data = scan_result.get("tls_1_3_early_data")
            result_tls_1_3_early_data = tls_1_3_early_data.get("result")
            #print(port)
            #print(ip_address)
            #print(f"Result {idx + 1}:")
            #print("Cipher Suite Supported:", cipher_suite)
            #print("Highest TLS Version Supported:", tls_version)
        def bodytable(widths,heights,i):
            print(f"inside pdf1 body")
            widthlist=[
                widths*5/100,
                widths*90/100,
                widths*5/100,
            ]
            if i==1:
                res=page1(widthlist[1],heights)
                
                return res
            elif i==2:
                res=appendix(widthlist[1],heights)
                return res
            elif i==3:
                res=page2(widthlist[1],heights)
                return res
            elif i == 4:
                res = page3(widthlist[1], heights)
                return res
            elif i == 5:
                res = page4(widthlist[1], heights)
                return res
        def page1(widths,heights):
            widthlist=[
                widths*5/100,
                widths*90/100,
                widths*5/100
            ]
            heightlist=[
                heights*2/100,
                heights*33/100,
                heights*4/100,
                heights*8/100,
                heights*8/100,
                heights*16/100,
                heights*9/100,
                heights*15/100,
                heights*2.5/100,
                heights*2.5/100
            ]
            res=Table([
                [''],
                [''],
                [page1text1(widthlist[1],heightlist[1])],
                [''],
                [page1text2(widthlist[1],heightlist[3])],
                [''],
                [''],
                [''],
                [''],
                ['']
                
            ],widthlist[1],heightlist)
            color=colors.HexColor('#87CEEB')
            res.setStyle([
                #('GRID',(0,0),(-1,-1),1,'red'),
                #('TEXTCOLOR',(0,1),(-1,-1),'white'),
                ('FONTNAME',(0,1),(0,1),'caliber-bold'),
                ('FONTSIZE',(0,1),(0,1),30),
                ('BOTTOMPADDING',(0,1),(0,1),30),
                ('BACKGROUND',(0,1),(-1,-2),color),
                ('LEFTPADDING',(0,0),(-1,-1),20),
                ('LINEBELOW',(0,-1),(-1,-1),1,'black')
            ])
            return res
        def page1text1(widths,heights):

            text=f"Report on {host}"
            
            res=Table([
                [text],
            ],widths,heights)
            res.setStyle([
                ('TEXTCOLOR',(0,0),(-1,-1),'white'),
                ('FONTNAME',(0,0),(-1,-1),'caliber-bold'),
                ('FONTSIZE',(0,0),(-1,-1),30),
            ])
            return res
        def page1text2(widths,heights):
            text1="S3 Infotech"
            text2=f"{date_scans_started}"
            heightlist=[
                heights*20/100,
                heights*50/100,
            ]
            res=Table([
                [text1],
                [text2]
            ],widths,heightlist)
            res.setStyle([
                ('TEXTCOLOR',(0,0),(-1,-1),'white'),
                ('FONTNAME',(0,0),(-1,-1),'caliber'),
                ('FONTSIZE',(0,0),(-1,-1),20),
            ])
            return res


        def page2(widths,heights):
            widthlist=[
                widths*5/100,
                widths*90/100,
                widths*5/100
            ]
            heightlist=[
                heights*8/100,
                heights*3/100,
                heights*3/100,
                heights*3/100,
                heights*12/100,
                heights*1.5/100,
                heights*3/100,
                heights*9.5/100,
                heights*1.5/100,
                heights*3/100,
                heights*12/100,
                heights*40/100,
            ]
            res=Table([
                [page2text1(widthlist[1],heightlist[0])],
                [''],
                [page2text2(widthlist[1],heightlist[2])],
                [''],
                [page2text3(widthlist[1],heightlist[4])],
                [''],
                [''],
                
                [''],
                [''],
                [''],
                [''],
                [''],
            ],widthlist[1],heightlist)
            res.setStyle([
                #('GRID',(0,0),(-1,-1),1,'red'),
                ('LINEBELOW',(0,-1),(-1,-1),1,'black')
            ])
            return res
        def page2text1(widths,heights):
            text="Server Information"
            res=Table([
                [text]
            ],widths,heights)
            color=colors.HexColor('#87CEEB')
            res.setStyle([
                ('TEXTCOLOR',(0,0),(-1,-1),'white'),
                ('FONTNAME',(0,0),(-1,-1),'Helvetica'),
                ('FONTSIZE',(0,0),(-1,-1),20),
                ('BACKGROUND',(0,0),(0,0),color),
                ('BOTTOMPADDING',(0,0),(-1,-1),30)

            ])
            return res
        def page2text2(widths,heights):
            text="Target(s)"
            res=Table([
                [text]
            ],widths,heights)
            color=colors.HexColor("#89CFF0")
            res.setStyle([
                ('TEXTCOLOR',(0,0),(-1,-1),color),
                ('FONTNAME',(0,0),(-1,-1),'caliber'),
                ('FONTSIZE',(0,0),(-1,-1),20),
            ])
            return res
        def page2text3(widths,heights):
            heightlist=[
                heights*15/100,
                heights*10/100,
                heights*15/100,
                heights*15/100,
                heights*15/100,
                heights*15/100,
            ]
            text1="The Scanned information for the website is as follows"
            text2=f"Host Name: {host}"
            text3=f"IP_address: {ip_address}"
            text4=f"Port: {port}"

            res=Table([
                [text1],[''],[text2],[text3],[text4],['']
                ],widths,heightlist)
            res.setStyle([
                #('GRID',(0,0),(-1,-1),1,'red'),
                ('FONTNAME',(0,0),(-1,-1),'caliber'),
                ('FONTSIZE',(0,0),(-1,-1),10),
            ])
            return res
     


        def page3(widths, heights):
            widthlist = [
                widths * 5 / 100,
                widths * 90 / 100,
                widths * 5 / 100
            ]
            heightlist = [
                heights * 5 / 100,
                heights * 20 / 100,
                heights * 70 / 100,
                heights * 5/ 100,
            ]
            res = Table([
                [page3text1(widthlist[1], heightlist[0])],
                [page3text2(widthlist[1], heightlist[1])],
                [page3text3(widthlist[1], heightlist[2])],
                [''],
            ], widthlist[1], heightlist)
            res.setStyle([
                # ('GRID',(0,0),(-1,-1),1,'red')
                ('LINEBELOW', (0, -1), (-1, -1), 1, 'black')
            ])
            return res


        def page3text1(widths, heights):
            text = "Scaning Information"
            """
            heightlist=[
                heights*60/100,
                #heights*40/100,
            ]"""
            res = Table([
                [text]
            ], widths, heights)
            color = colors.HexColor('#87CEEB')
            res.setStyle([
                ('TEXTCOLOR', (0, 0), (-1, -1), 'white'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 20),
                ('BACKGROUND', (0, 0), (0, 0), color),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 20)

            ])
            return res


        def page3text2(weights, heights):
            text = "Connectivity Result"
            para1 = f"Support cipher suite is {cipher_suite_supported}"
            para1style = ParagraphStyle('st')
            para1style.fontName = 'caliber'
            para1style.fontSize = 12
            para1style.spaceAfter = 10
            para2 = f"Highest supported tls version is {tls_version}"
            para3 =f"ecdh key exchange is {ecdh_key_exchange}"
            para4=f"Connectivity status: {connectivity_status}"
            para1 = Paragraph(para1, para1style)
            para2 = Paragraph(para2, para1style)
            para3 = Paragraph(para3, para1style)
            para4=Paragraph(para4,para1style)
            heightlist = [
                heights * 10 / 100,
                heights * 90 / 100
            ]
            paralist = []
            paralist.append(para1)
            paralist.append(para2)
            paralist.append(para3)
            paralist.append(para4)
            color = colors.HexColor('#87CEEB')
            res = Table([
                [text],
                [paralist]
            ], weights, heightlist)
            res.setStyle([
                # ('GRID',(0,0),(-1,-1),1,'red'),
                ('TEXTCOLOR', (0, 0), (0, 0), color),
                ('FONTNAME', (0, 0), (0, 0), 'Helvetica'),
                ('FONTSIZE', (0, 0), (0, 0), 16),
                ('BOTTOMPADDING', (0, 0), (0, 0), -15),
                ('BOTTOMPADDING', (0, 1), (0, 1), 5),
            ])
            return res


        def page3text3(weights, heights):
            text = "Summary On Scan result"
            para1 = f"Number of Certificate deployements {len(certificate_deployments)}"
            para1style = ParagraphStyle('st')
            para1style.fontName = 'caliber'
            para1style.fontSize = 12

            info1 = "Elliptic Curves: \n"
            para2="accepted elliptic curves"
            accepted_curve_count = len(supported_elliptic_list)
            rejected_curve_count = len(rejected_elliptic_list)

            for curve in supported_elliptic_list:
                para2+=f" {curve},\n"

            para3 = "rejected elliptic curves"

            for curve in rejected_elliptic_list:
                para3 += f" {curve},\n"
            para4 = f"Heart bleed:      {status_heart} - {is_vulnerable_to_heartbleed}"
            para1 = Paragraph(para1, para1style)
            para2 = Paragraph(para2, para1style)
            para3 = Paragraph(para3, para1style)
            para4 = Paragraph(para4, para1style)
            #print(  math.ceil(accepted_curve_count/10))
            heightlist = [
                heights * 10 / 100,
                heights*5/100,
                heights * 8 / 100,
                heights *math.ceil(accepted_curve_count/10)* 4 / 100,
                heights *math.ceil(rejected_curve_count/10)* 4 / 100,
                heights * 5/ 100,
                heights*50/100,

            ]
            paralist = []
            #paralist.append(info1)
            paralist.append(para1)
            paralist.append(para2)
            paralist.append(para3)
            paralist.append(para4)
            color = colors.HexColor('#87CEEB')
            res = Table([
                [text],
                [para1],
                [info1],

                [para2],
                [para3],
                [para4],
                [''],
            ], weights, heightlist)
            res.setStyle([
                # ('GRID',(0,0),(-1,-1),1,'red'),
                ('TEXTCOLOR', (0, 0), (0, 0), color),
                ('FONTNAME', (0, 0), (0, 0), 'Helvetica'),
                ('FONTSIZE', (0, 0), (0, 0), 16),
                ('FONTSIZE', (0, 1), (0, 1), 12),
            ])
            return res


        def page4(widths, heights):
            widthlist = [
                widths * 5 / 100,
                widths * 90 / 100,
                widths * 5 / 100
            ]
            heightlist = [
                heights * 5 / 100,
                heights * 2.5 / 100,
                heights * 70 / 100,
                heights * 22.5 / 100,
            ]
            res = Table([
                [page4text1(widthlist[1], heightlist[0])],
                [''],
                [page4text2(widthlist[1], heightlist[2])],
                [''],
            ], widthlist[1], heightlist)
            res.setStyle([
                ('LINEBELOW', (0, -1), (-1, -1), 1, 'black')
            ])
            return res


        def page4text1(widths, heights):
            text = "Cipher Suites"

            res = Table([
                [text]
            ], widths, heights)
            color = colors.HexColor('#87CEEB')
            res.setStyle([
                ('TEXTCOLOR', (0, 0), (-1, -1), 'white'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 20),
                ('BACKGROUND', (0, 0), (0, 0), color),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 20)

            ])
            return res


        def page4text2(widths, heights):
            heightlist = [
                heights * 32 / 100,
                heights * 32 / 100,
                heights * 36 / 100,

            ]

            text1 = "ssl_2_0_cipher_suites"
            length_ssl_2_0=len(accepted_cipher_suites_ssl_2_0)+len(rejected_cipher_suites_ssl_2_0)
            text2=""


            if len(accepted_cipher_suites_ssl_2_0)==0:
                text2 = f"Attemted to connect {(length_ssl_2_0)} cipher suites ,the server rejected all cipher suites"
            elif len(accepted_cipher_suites_ssl_2_0)>0 and len(rejected_cipher_suites_ssl_2_0) != 0:
                text2=f"Attemted to connect {(length_ssl_2_0)} cipher suites The server Accepted the following {len(accepted_cipher_suites_ssl_2_0)} cipher suites"

            text3 = "ssl_3_0_cipher_suites"
            length_ssl_3_0 = len(accepted_cipher_suites_ssl_3_0) + len(rejected_cipher_suites_ssl_3_0)
            text4 = ""


            if len(accepted_cipher_suites_ssl_3_0) == 0:
                text4 = f"Attemted to connect {(length_ssl_3_0)} cipher suites ,the server rejected all cipher suites"
            elif len(accepted_cipher_suites_ssl_3_0) > 0 and len(rejected_cipher_suites_ssl_3_0) != 0:
                text4 = f"Attemted to connect {(length_ssl_3_0)} cipher suites The server Accepted {len(accepted_cipher_suites_ssl_3_0)} cipher suites"
            text5 = "tls_1_0_cipher_suites"
            length_tls_1_0 = len(accepted_cipher_suites_tls_1_0) + len(rejected_cipher_suites_tls_1_0)
            text6 = ""


            if len(accepted_cipher_suites_tls_1_0) == 0:
                text6 = f"Attemted to connect {(length_tls_1_0)} cipher suites ,the server rejected all cipher suites"
            elif len(accepted_cipher_suites_tls_1_0) > 0 and len(rejected_cipher_suites_tls_1_0) != 0:
                text6 = f"Attemted to connect {(length_tls_1_0)} cipher suites The server Accepted  {len(accepted_cipher_suites_tls_1_0)} cipher suites"
            text7 = "tls_1_1_cipher_suites"
            length_tls_1_1 = len(accepted_cipher_suites_tls_1_1) + len(rejected_cipher_suites_tls_1_1)
            text8 = ""

            if len(accepted_cipher_suites_tls_1_1) == 0:
                text8 = f"Attemted to connect {(length_tls_1_1)} cipher suites ,the server rejected all cipher suites"
            elif len(accepted_cipher_suites_tls_1_1) > 0 and len(rejected_cipher_suites_tls_1_1) != 0:
                text8 = f"Attemted to connect {(length_tls_1_1)} cipher suites The server Accepted  {len(accepted_cipher_suites_tls_1_1)} cipher suites"
            text9 = "tls_1_2_cipher_suites"
            length_tls_1_2 = len(accepted_cipher_suites_tls_1_2) + len(rejected_cipher_suites_tls_1_2)
            text10 = ""

            if len(accepted_cipher_suites_tls_1_2) == 0:
                text10 = f"Attemted to connect {(length_tls_1_2)} cipher suites ,the server rejected all cipher suites"
            elif len(accepted_cipher_suites_tls_1_2) > 0 and len(rejected_cipher_suites_tls_1_2) != 0:
                text10 = f"Attemted to connect {(length_tls_1_2)} cipher suites The server Accepted  {len(accepted_cipher_suites_tls_1_2)} cipher suites"
            text11 = "tls_1_3_cipher_suites"
            length_tls_1_3 = len(accepted_cipher_suites_tls_1_3) + len(rejected_cipher_suites_tls_1_3)
            text12 = ""

            if len(accepted_cipher_suites_tls_1_3) == 0:
                text12 = f"Attemted to connect {(length_tls_1_3)} cipher suites ,the server rejected all cipher suites"
            elif len(accepted_cipher_suites_tls_1_3) > 0 and len(rejected_cipher_suites_tls_1_3) != 0:
                text12 = f"Attemted to connect {(length_tls_1_3)} cipher suites The server Accepted  {len(accepted_cipher_suites_tls_1_3)} cipher suites"
            text13="Robot Attack"
            text14=""
            if status_robot =="COMPLETED":
                text14+="OK -"
            else:
                text14+="failed"
            if result_robot =="NOT_VULNERABLE_NO_ORACLE":
                text14+=" Not vulnerable"
            else:
                text14+=" Vulnerable"
            text15="Session Renegotiation"
            text16=""
            text17=""
            s=''
            if session_renegotiation_status =="COMPLETED":
                s="OK"
            else:
                s="failed"
            if is_vulnerable_to_client_renegotiation_dos_renegotiation:
                text16+=f"client renegotiation_dos {s} - vulnerable"
            else:
                text16+=f"client renegotiation_dos {s} - Not vulnerable"
            if supports_secure_renegotiation_renegotiation:
                text17+=f"Secure Renegotiation {s} - Supported"
            else:
                text17+=f"Secure Renegotiation {s} - Not supported"
            para1style = ParagraphStyle('st')
            para1style.fontName = 'caliber-bold'
            para1style.fontSize = 12
            para1style.spaceAfter = 10
            para2style = ParagraphStyle('sc')
            para2style.fontName = 'caliber'
            para2style.fontSize = 12
            para2style.spaceAfter = 10
            para1 = Paragraph(text1, para1style)
            para2 = Paragraph(text2, para2style)
            para3=Paragraph(text3,para1style)
            para4 = Paragraph(text4, para2style)
            para5 = Paragraph(text5, para1style)
            para6=Paragraph(text6,para2style)
            para7 = Paragraph(text7, para1style)
            para8 = Paragraph(text8, para2style)
            para9=Paragraph(text9,para1style)
            para10 = Paragraph(text10, para2style)
            para11= Paragraph(text11, para1style)
            para12 = Paragraph(text12, para2style)
            para13 = Paragraph(text13, para1style)
            para14 = Paragraph(text14, para2style)
            para15 = Paragraph(text15, para1style)
            para16 = Paragraph(text16, para2style)
            para17 = Paragraph(text17, para2style)


            para1list = []
            para1list.append(para1)
            para1list.append(para2)
            para1list.append(para3)
            para1list.append(para4)
            para1list.append(para5)
            para1list.append(para6)

            para2list = []


            para2list.append(para7)
            para2list.append(para8)
            para2list.append(para9)
            para2list.append(para10)

            para3list = []
            para3list.append(para11)
            para3list.append(para12)
            para3list.append(para13)
            para3list.append(para14)
            para3list.append(para15)
            para3list.append(para16)
            para3list.append(para17)


            res = Table([
                [para1list],
                [para2list],
                [para3list],

            ], widths, heightlist)
            return res


        def fun_ciper_suites():
            return ""

        def main_table():
            print(f"inside pdf1 main")
            widths,heights,size=table()
            widths+=100
            heights+=100
            buffer = BytesIO()
            
            pdf=canvas.Canvas(buffer,pagesize=A4)
            pdf.setAuthor("Your Author Name")
            pdf.setTitle("Your Title")
            pdf.setSubject("Your Subject")
            pdf.setKeywords("Keyword1, Keyword2, Keyword3")
            heightList=[
                heights*0.005,
                heights*0.08,
                heights*0.7,
                heights*0.05,
                heights*0.0025,
            ]
            widthlist=[
                widths*5/100,
                widths*90/100,
                widths*5/100,
            ]
            #a=pdf.getAvailableFonts()
            #print(a)
            font()
            for i in range(1,6):
                mainTable=Table([
                    ['','',''],
                    ['',headertable(widthlist[1],heightList[1],i),''],
                    ['',bodytable(widthlist[1],heightList[2],i),''],
                    ['',footertable(widthlist[1],heightList[3],i),''],
                    ['','','']
                    ],colWidths=widthlist,rowHeights=heightList)
                #mainTable.setStyle([
                #('GRID',(0,0),(-1,-1),1,'red')])
                mainTable.wrapOn(pdf,0,0)
                mainTable.drawOn(pdf,0,0)
                pdf.showPage()
            pdf.save()
            # Add a page break between sections
            pdf_content = buffer.getvalue()
            buffer.close()
            

            return pdf_content
        
        def rawtable():
            def add_variable_to_pdf(variable_name, variable_value):
                variable_text = f"<b>{variable_name}:</b> {variable_value}"
                pdf_content.append(Paragraph(variable_text, styles['Normal']))
                pdf_content.append(Spacer(1, 6))  # Add some space between variables
            def funciphersuites(a,b):

                if len(a)==0:
                    return f"Attempted to connect {len(b)} cipher suites, the server rejected all the cipher cuites"
                elif len(b)==0:
                    return f"Attempted to connect {len(a)} cipher suites, the server, accepted all the cipher cuites"
                else:

                    l=[]
                    for curve in a:
                        cipher_suite = curve.get("cipher_suite")
                        name = cipher_suite.get("name")
                        l.append(name)
                    str = ", ".join(l)

                    return f"""attemted to connect {len(a)+len(b)} cipher suites, the server accepted {len(a)} cipher cuites,
                            the accepted suites are {str}
                            """
            buffer=BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=A4)
            pdf_content = []
            styles = getSampleStyleSheet()
            pdf_content.append(Paragraph("Scan Report", styles['Title']))
            pdf_content.append(Spacer(1, 12))
            add_variable_to_pdf("Connection Type", server_location.get("connection_type"))
            add_variable_to_pdf("Hostname", host)
            add_variable_to_pdf("Ip Address",ip_address)
            add_variable_to_pdf("Port",port )
            add_variable_to_pdf("Number of certificate deployments",len(certificate_deployments) )
            add_variable_to_pdf("Cipher Suite Supported", cipher_suite_supported)
            add_variable_to_pdf("Connectivity Status", connectivity_status)
            add_variable_to_pdf("TLS Version", tls_version)
            add_variable_to_pdf("Supports ECDH Key Exchange", supports_ecdh_key_exchange)
            add_variable_to_pdf("Elliptic curves",len(supported_elliptic_list)+len(rejected_elliptic_list))
            ac_ell = ", ".join(supported_elliptic_list)
            add_variable_to_pdf(f"Accepted Elliptic Curves({len(supported_elliptic_list)})", ac_ell)
            rc_ell=", ".join(rejected_elliptic_list)
            add_variable_to_pdf(f"Rejected Elliptic curves({len(rejected_elliptic_list)})",rc_ell)
            add_variable_to_pdf("Tls Fall back SCSV",result_tls)
            add_variable_to_pdf("supports fallback SCSV",supports_fallback_scsv )
            str=""
            str=status_heart+" - "+ is_vulnerable_to_heartbleed
            add_variable_to_pdf("Heartbleed",str )
            add_variable_to_pdf("SSL_2_0 Cipher Cuites",funciphersuites(accepted_cipher_suites_ssl_2_0,rejected_cipher_suites_ssl_2_0) )
            add_variable_to_pdf("SSL_3_0 Cipher Cuites",
                                funciphersuites(accepted_cipher_suites_ssl_3_0, rejected_cipher_suites_ssl_3_0))
            add_variable_to_pdf("TLS_1_0 Cipher Cuites",
                                funciphersuites(accepted_cipher_suites_tls_1_0, rejected_cipher_suites_tls_1_0))
            add_variable_to_pdf("TLS_1_1 Cipher Cuites",
                                funciphersuites(accepted_cipher_suites_tls_1_1, rejected_cipher_suites_tls_1_1))
            add_variable_to_pdf("TLS_1_2 Cipher Cuites",
                                funciphersuites(accepted_cipher_suites_tls_1_2, rejected_cipher_suites_tls_1_2))
            add_variable_to_pdf("TLS_1_3 Cipher Cuites",
                                funciphersuites(accepted_cipher_suites_tls_1_3, rejected_cipher_suites_tls_1_3))
            add_variable_to_pdf("Robot Status",f"{status_robot} - {result_robot}")
            add_variable_to_pdf("Session renogation",f"{session_renegotiation_status}")
            doc.build(pdf_content)
            buffer.seek(0)
            pdf_content = buffer.getvalue()
            buffer.close()
            return pdf_content
        print(f"inside pdf2")
        pdf_content=main_table()
        pdf_list=[]
        pdf_list.append(pdf_content)
        print(f"inside pdf3")
        # Create a PDF buffer
        pdf_content_raw=rawtable()
        pdf_list.append(pdf_content_raw)
        return pdf_list
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
            
            sort_field = request.query_params.get('sortField', 'date')
            sort_order = request.query_params.get('sortOrder', 'desc')
            #print(f"{sort_field}")

        if sort_order == 'desc':
            queryset = Scan.objects.all().order_by(F(sort_field).desc())
        else:
            queryset = Scan.objects.all().order_by(F(sort_field).desc())

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = Scanserializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = Scanserializer(page, many=True)
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
class she(GenericAPIView):
    print(f"\n\n=> scheduling")
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.jobstores.base import JobLookupError

scheduler = BackgroundScheduler()
scheduler.start()

class Apiview_scan_schedule(GenericAPIView):
    def post(self,request):
        target_url = request.data.get('target')
        labels = request.data.get('label')
        scan_frequency=3600*24
        if not target_url:
            return JsonResponse({'detail': 'Target URL is required in the request data'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a unique job ID based on the target_url
        job_id = f'scan_{target_url.replace("/", "_")}' 
        try:
            # Check if a job with the same ID exists
            existing_job = scheduler.get_job(job_id)
            if existing_job:
                # Reschedule the existing job with the new parameters
                existing_job.modify(trigger=IntervalTrigger(seconds=scan_frequency), args=[target_url, labels])
            else:
                # Create a new job with the unique job ID
                scheduler.add_job(
                    self.schedule_scan,
                    IntervalTrigger(seconds=scan_frequency),  # Schedule the scan at the specified frequency
                    args=[target_url, labels],
                    id=job_id,  # Use the unique job ID
                )
        except JobLookupError:
            return JsonResponse({'detail': 'Error looking up the job'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return JsonResponse({'detail': 'Scan scheduled successfully'}, status=status.HTTP_202_ACCEPTED)


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
            sort_field = request.query_params.get('sortField', 'date')
            sort_order = request.query_params.get('sortOrder', 'desc')
            print(f"{sort_field}")

        if sort_order == 'desc':
            queryset = Risk.objects.all().order_by(F(sort_field).desc())
        else:
            queryset = Risk.objects.all().order_by(F(sort_field).desc())

            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = Riskserializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = Riskserializer(page, many=True)
            return Response(serializer.data)
    def delete(self, request, id=None):
            if id is not None:
                try:
                    target = Risk.objects.get(pk=id)
                    target.delete()  # Delete the target
                    return Response({"detail": "Target deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
                except Scan.DoesNotExist:
                    return Response({"detail": "Target not found."}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
class Viewpdf(RetrieveAPIView):
    def get_object(self, id):
        try:
            return Scan.objects.get(pk=id)
        except Scan.DoesNotExist:
            return None
    def get(self, request, id=None):
        if id is not None:
            scan = Scan.objects.get(pk=id)
            pdf_file = scan.pdf_file
            response = FileResponse(pdf_file, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{pdf_file.name}"'
            return response
class Viewpdf_raw(RetrieveAPIView):
    def get_object(self, id):
        try:
            return Scan.objects.get(pk=id)
        except Scan.DoesNotExist:
            return None
    def get(self, request, id=None):
        if id is not None:
            scan = Scan.objects.get(pk=id)
            pdf_file = scan.pdf_file_raw
            response = FileResponse(pdf_file, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{pdf_file.name}"'
            return response
class Viewjson(RetrieveAPIView):
    def get_object(self, id):
        try:
            return Scan.objects.get(pk=id)
        except Scan.DoesNotExist:
            return None
    def get(self, request, id=None):
        if id is not None:
            scan = Scan.objects.get(pk=id)
            json_file = scan.json_file
            response = FileResponse(json_file, content_type='application/json')
            response['Content-Disposition'] = f'attachment; filename="{json_file.name}"'
            return response
class Viewpdf_Risk(RetrieveAPIView):
    def get_object(self, id):
        try:
            return Risk.objects.get(pk=id)
        except Risk.DoesNotExist:
            return None
    def get(self, request, id=None):
        if id is not None:
            risk = Risk.objects.get(pk=id)
            pdf_file = risk.pdf_file_risk
            response = FileResponse(pdf_file, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{pdf_file.name}"'
            return response



    
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
