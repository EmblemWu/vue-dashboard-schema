from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product
from orders.models import Order


class OverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        product_count = Product.objects.count()
        on_sale_count = Product.objects.filter(status=Product.STATUS_ON_SALE).count()
        pending_orders = Order.objects.filter(status=Order.STATUS_PENDING).count()
        paid_orders = Order.objects.filter(status=Order.STATUS_PAID).count()
        revenue = Order.objects.exclude(status=Order.STATUS_CANCELLED).aggregate(total=Sum('total_amount'))['total'] or 0

        return Response(
            {
                'product_count': product_count,
                'on_sale_count': on_sale_count,
                'pending_orders': pending_orders,
                'paid_orders': paid_orders,
                'revenue': revenue
            }
        )
