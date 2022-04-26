from django.urls import path

from .views import TableAPIView


urlpatterns = [
    path('table/', TableAPIView.as_view(), name='get_table'),
]
