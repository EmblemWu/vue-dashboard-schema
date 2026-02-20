from datetime import date, timedelta
from decimal import Decimal
import random

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from catalog.models import Category, Product
from common.models import Coupon, Customer, Notice, SiteSetting
from orders.models import Order, OrderItem


class Command(BaseCommand):
    help = 'Create admin user and rich mall demo data.'

    def handle(self, *args, **options):
        random.seed(42)

        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(username='admin', password='admin123', email='admin@example.com')
            self.stdout.write(self.style.SUCCESS('Created admin user: admin / admin123'))

        categories = [
            ('数码配件', 1),
            ('服饰箱包', 2),
            ('家居生活', 3),
            ('运动户外', 4),
            ('食品饮料', 5)
        ]

        category_objs = []
        for name, sort in categories:
            obj, _ = Category.objects.get_or_create(name=name, defaults={'sort': sort, 'is_active': True})
            category_objs.append(obj)

        sample_products = [
            ('无线降噪耳机 Pro', Decimal('699.00')),
            ('城市通勤双肩包', Decimal('259.00')),
            ('便携咖啡杯', Decimal('89.00')),
            ('速干运动T恤', Decimal('129.00')),
            ('坚果礼盒装', Decimal('159.00')),
            ('蓝牙机械键盘', Decimal('399.00')),
            ('轻量跑鞋', Decimal('469.00')),
            ('智能台灯', Decimal('199.00'))
        ]

        products = []
        for index, (title, price) in enumerate(sample_products):
            category = category_objs[index % len(category_objs)]
            product, _ = Product.objects.get_or_create(
                title=title,
                defaults={
                    'category': category,
                    'price': price,
                    'stock': random.randint(30, 300),
                    'sales': random.randint(30, 900),
                    'status': Product.STATUS_ON_SALE if index % 3 != 0 else Product.STATUS_DRAFT
                }
            )
            products.append(product)

        customers = []
        for i in range(1, 21):
            customer, _ = Customer.objects.get_or_create(
                phone=f'1380000{i:04d}',
                defaults={
                    'nickname': f'用户{i:02d}',
                    'level': 'VIP会员' if i % 5 == 0 else '普通会员',
                    'total_spent': Decimal(str(random.randint(200, 12000))),
                    'order_count': random.randint(1, 30),
                    'status': Customer.STATUS_ACTIVE if i % 8 != 0 else Customer.STATUS_DISABLED
                }
            )
            customers.append(customer)

        status_pool = [Order.STATUS_PENDING, Order.STATUS_PAID, Order.STATUS_SHIPPED, Order.STATUS_COMPLETED]

        for i in range(1, 31):
            customer = customers[(i - 1) % len(customers)]
            status = status_pool[i % len(status_pool)]
            order_no = f'SO20260221{i:04d}'
            order, created = Order.objects.get_or_create(
                order_no=order_no,
                defaults={
                    'customer_name': customer.nickname,
                    'customer_phone': customer.phone,
                    'status': status,
                    'total_amount': Decimal('0'),
                    'shipping_company': '顺丰速运' if status in [Order.STATUS_SHIPPED, Order.STATUS_COMPLETED] else '',
                    'tracking_no': f'SF{random.randint(100000000, 999999999)}' if status in [Order.STATUS_SHIPPED, Order.STATUS_COMPLETED] else '',
                    'shipped_at': timezone.now() if status in [Order.STATUS_SHIPPED, Order.STATUS_COMPLETED] else None
                }
            )

            if created:
                count = random.randint(1, 3)
                selected = random.sample(products, k=count)
                total = Decimal('0')

                for product in selected:
                    quantity = random.randint(1, 3)
                    amount = product.price * quantity
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        product_title=product.title,
                        unit_price=product.price,
                        quantity=quantity,
                        amount=amount
                    )
                    total += amount

                order.total_amount = total
                order.save(update_fields=['total_amount'])

        today = date.today()
        for i in range(1, 11):
            Coupon.objects.get_or_create(
                code=f'COUPON{i:03d}',
                defaults={
                    'title': f'满减券{i:03d}',
                    'discount_amount': Decimal(str(5 * i)),
                    'min_spend': Decimal(str(50 * i)),
                    'stock': random.randint(100, 1000),
                    'claimed': random.randint(20, 500),
                    'status': Coupon.STATUS_ACTIVE if i % 3 != 0 else Coupon.STATUS_DRAFT,
                    'valid_from': today,
                    'valid_to': today + timedelta(days=30 + i)
                }
            )

        notices = [
            ('系统维护通知', '本周六凌晨将进行系统维护，预计30分钟。', Notice.STATUS_PUBLISHED),
            ('春节营销活动', '春节满减活动已上线，请及时配置首页资源位。', Notice.STATUS_PUBLISHED),
            ('仓储提醒', '华东仓库存偏低，请补货。', Notice.STATUS_DRAFT)
        ]

        for title, content, status in notices:
            Notice.objects.get_or_create(title=title, defaults={'content': content, 'status': status})

        setting_items = [
            ('site_name', 'Mall Admin', '站点名称'),
            ('service_phone', '400-800-1234', '客服电话'),
            ('default_express', '顺丰速运', '默认物流公司'),
            ('order_auto_cancel_minutes', '30', '未支付订单自动取消分钟数')
        ]

        for key, value, description in setting_items:
            SiteSetting.objects.get_or_create(key=key, defaults={'value': value, 'description': description})

        self.stdout.write(self.style.SUCCESS('Rich demo data ready.'))
