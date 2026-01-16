from rest_framework.pagination import PageNumberPagination

class DefaultTwoPerPagePagination(PageNumberPagination):
    page_size = 2
    page_size_query_param = None
    max_page_size = 2
