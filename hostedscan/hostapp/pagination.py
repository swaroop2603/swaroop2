from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 10  # Number of items per page
    page_size_query_param = 'page_size'  # Custom query parameter for specifying page size
    max_page_size = 100  # Maximum page size to prevent excessive resource usage
