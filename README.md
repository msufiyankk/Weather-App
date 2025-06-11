# 🌤️ Weather App

A simple weather forecast web application using Django (backend) and JavaScript (frontend), powered by OpenWeatherMap API.

---

## 🚀 Features

- Real-time weather data by city name
- Search history with delete option
- Weather-based background themes
- Fully responsive UI

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/msufiyankk/weather-app.git
cd weather-app
```

---

## Create a virtual environment

```
python -m venv venv
```

## Activate virtual environment

- For Linux/macOS
  
```
source venv/bin/activate
```

- For Windows
  
```
venv\Scripts\activate 
```

## Install dependencies

```
pip install -r requirements.txt
```

## Make migrations for the app

```
python manage.py makemigrations weather_update
```

## Apply the migrations to the database

```
python manage.py migrate
```

## Run Server

```
python manage.py runserver
```
