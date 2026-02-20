from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)
    sort = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['sort', 'id']

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    STATUS_DRAFT = 'draft'
    STATUS_ON_SALE = 'on_sale'
    STATUS_OFF_SALE = 'off_sale'
    STATUS_CHOICES = [
        (STATUS_DRAFT, '草稿'),
        (STATUS_ON_SALE, '上架'),
        (STATUS_OFF_SALE, '下架')
    ]

    title = models.CharField(max_length=120)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    sales = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    cover_url = models.URLField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']

    def __str__(self) -> str:
        return self.title
