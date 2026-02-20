from rest_framework import serializers

from common.models import Coupon, Customer


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
