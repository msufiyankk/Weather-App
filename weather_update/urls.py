from django.urls import path


from . import views


urlpatterns = [
    path('',views.home_page,name='home'),
    path('api/weather/', views.get_weather, name='weather_api'),
]
