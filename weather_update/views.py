from django.shortcuts import render
from django.http import JsonResponse
import requests
import json
from .models import SearchHistory
from django.views.decorators.csrf import csrf_exempt


def home_page(request):
    return render(request, 'home.html')

def get_weather(request):
    city = request.GET.get("city")
    if not city:
        return JsonResponse({"error": "City is required"}, status=400)

    api_key = "0e854c819f48ceb01a980aaad0425e0e"
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
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
        "icon": data['weather'][0]['main']
    })

@csrf_exempt
def save_search(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            city = data.get('city')
            if not city:
                return JsonResponse({'error': 'No city provided'}, status=400)

            SearchHistory.objects.create(city=city)  # Save to DB

            return JsonResponse({'message': 'Search saved'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=405)

def get_history(request):
    history = SearchHistory.objects.order_by('-searched_at').values_list('city', flat=True).distinct()[:10]
    return JsonResponse({'history': list(history)})