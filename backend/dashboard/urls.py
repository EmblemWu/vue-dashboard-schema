from django.urls import path

from dashboard.views import OverviewView

urlpatterns = [
    path('overview', OverviewView.as_view(), name='dashboard_overview')
]
