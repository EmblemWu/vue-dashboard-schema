from rest_framework import filters, viewsets

from common.models import Coupon, Customer, Notice, SiteSetting
from common.serializers import CouponSerializer, CustomerSerializer, NoticeSerializer, SiteSettingSerializer


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


class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']


class SiteSettingViewSet(viewsets.ModelViewSet):
    queryset = SiteSetting.objects.all()
    serializer_class = SiteSettingSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['key', 'description']
