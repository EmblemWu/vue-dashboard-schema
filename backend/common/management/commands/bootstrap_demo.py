from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from catalog.models import Category, Product
from orders.models import Order, OrderItem


class Command(BaseCommand):
    help = 'Create demo admin user and mall demo data.'

    def handle(self, *args, **options):
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(username='admin', password='admin123', email='admin@example.com')
            self.stdout.write(self.style.SUCCESS('Created admin user: admin / admin123'))

        digital, _ = Category.objects.get_or_create(name='数码配件', defaults={'sort': 1})
        apparel, _ = Category.objects.get_or_create(name='服饰箱包', defaults={'sort': 2})

        p1, _ = Product.objects.get_or_create(
            title='无线降噪耳机 Pro',
            defaults={
                'category': digital,
                'price': Decimal('699.00'),
                'stock': 120,
                'sales': 560,
                'status': Product.STATUS_ON_SALE
            }
        )
        p2, _ = Product.objects.get_or_create(
            title='城市通勤双肩包',
            defaults={
                'category': apparel,
                'price': Decimal('259.00'),
                'stock': 86,
                'sales': 214,
                'status': Product.STATUS_ON_SALE
            }
        )

        o1, _ = Order.objects.get_or_create(
            order_no='SO202602200001',
            defaults={
                'customer_name': '张三',
                'customer_phone': '13800000001',
                'status': Order.STATUS_PAID,
                'total_amount': Decimal('958.00')
            }
        )
        OrderItem.objects.get_or_create(
            order=o1,
            product=p1,
            product_title=p1.title,
            defaults={
                'unit_price': Decimal('699.00'),
                'quantity': 1,
                'amount': Decimal('699.00')
            }
        )

        o2, _ = Order.objects.get_or_create(
            order_no='SO202602200002',
            defaults={
                'customer_name': '李四',
                'customer_phone': '13800000002',
                'status': Order.STATUS_PENDING,
                'total_amount': Decimal('518.00')
            }
        )
        OrderItem.objects.get_or_create(
            order=o2,
            product=p2,
            product_title=p2.title,
            defaults={
                'unit_price': Decimal('259.00'),
                'quantity': 2,
                'amount': Decimal('518.00')
            }
        )

        self.stdout.write(self.style.SUCCESS('Demo data ready.'))
