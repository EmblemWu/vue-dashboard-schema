from rest_framework import serializers

from common.models import Coupon, Customer, Notice, SiteSetting


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            'id',
            'nickname',
            'phone',
            'level',
            'total_spent',
            'order_count',
            'status',
            'created_at',
            'updated_at'
        ]


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            'id',
            'title',
            'code',
            'discount_amount',
            'min_spend',
            'stock',
            'claimed',
            'status',
            'valid_from',
            'valid_to',
            'created_at',
            'updated_at'
        ]


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'status', 'created_at', 'updated_at']


class SiteSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSetting
        fields = ['id', 'key', 'value', 'description', 'updated_at']
