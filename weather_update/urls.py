from django.urls import path


from . import views


urlpatterns = [
    path('',views.home_page,name='home'),
    path('api/weather/', views.get_weather, name='weather_api'),
    path('api/save_search/', views.save_search, name='save_search'),
    path('api/get_history/', views.get_history, name='get_history'),
]
