from rest_framework import filters, viewsets

from common.models import Coupon, Customer
from common.serializers import CouponSerializer, CustomerSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nickname', 'phone']


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'code']
