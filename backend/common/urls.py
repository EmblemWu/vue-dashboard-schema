from rest_framework.routers import DefaultRouter

from common.views import CouponViewSet, CustomerViewSet

router = DefaultRouter()
router.register('customers', CustomerViewSet, basename='customer')
router.register('coupons', CouponViewSet, basename='coupon')

urlpatterns = router.urls
