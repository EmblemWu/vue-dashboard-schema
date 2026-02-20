from rest_framework.routers import DefaultRouter

from common.views import CouponViewSet, CustomerViewSet, NoticeViewSet, SiteSettingViewSet

router = DefaultRouter()
router.register('customers', CustomerViewSet, basename='customer')
router.register('coupons', CouponViewSet, basename='coupon')
router.register('notices', NoticeViewSet, basename='notice')
router.register('settings', SiteSettingViewSet, basename='setting')

urlpatterns = router.urls
