from django.shortcuts import render
from django.http import JsonResponse
import requests


API_KEY = "0e854c819f48ceb01a980aaad0425e0e"

def home_page(request):
    return render(request, 'home.html')

def get_weather(request):
    city = request.GET.get("city")
    if not city:
        return JsonResponse({"error": "City name required"}, status=400)

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)

    if response.status_code != 200:
        return JsonResponse({"error": "City not found"}, status=404)

    data = response.json()
    return JsonResponse({
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "condition": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"],
        "windSpeed": data["wind"]["speed"],
        "icon": data["weather"][0]["icon"]
    })

