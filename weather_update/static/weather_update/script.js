// ========== CONFIG ========== //
const apiKey = '0e854c819f48ceb01a980aaad0425e0e';
let historyList = [];

// ========== DOM ELEMENTS ========== //
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const searchHistory = document.getElementById('searchHistory');
const suggestionBox = document.getElementById('suggestionBox');

const weatherDisplay = document.getElementById('weatherDisplay');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const loading = document.getElementById('loading');
const error = document.getElementById('error');


// ========== EVENT LISTENERS ========== //
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        searchHistory.style.display = 'none';
        fetchWeather(city);
    }
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            searchHistory.style.display = 'none';
            fetchWeather(city);
        }
    }
});

cityInput.addEventListener('focus', () => {
    updateHistoryUI();
});

cityInput.addEventListener('focus', () => {
    updateHistoryUI();  // show all history
});

cityInput.addEventListener('input', () => {
    searchHistory.style.display = 'none';
});

document.addEventListener('click', (e) => {
    if (!cityInput.contains(e.target) && !searchHistory.contains(e.target)) {
        searchHistory.style.display = 'none';
    }
});


// ========== FUNCTIONS ========== //
function fetchWeather(city) {
    showLoading();
    hideError();
    hideWeatherDisplay();

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })
        .then(data => {
            displayWeatherData({
                city: data.name,
                temperature: data.main.temp,
                condition: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                icon: data.weather[0].main
            });
            addToHistory(city);
        })
        .catch(error => {
            showError(error.message);
        })
        .finally(() => {
            hideLoading();
        });
}

function displayWeatherData(data) {
    cityName.textContent = data.city;

    const iconMap = {
        'Drizzle': '🌦️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️',
        'Clouds': '⛅',
        'Clear': '☀️',
        'Atmosphere': '🌫️'
    };

    weatherIcon.textContent = iconMap[data.icon] || '❔';
    temperature.textContent = `${data.temperature}°C`;
    condition.textContent = `${data.icon} | ${data.condition}`;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windSpeed} km/h`;

    showWeatherDisplay();
    updateBackgroundColor(data.icon);
}

function updateBackgroundColor(condition) {
    const body = document.body;
    const normalized = condition.toLowerCase();
    body.className = ''; // reset classes

    if (normalized.includes('clear')) body.classList.add('sunny');
    else if (normalized.includes('cloud')) body.classList.add('cloudy');
    else if (normalized.includes('rain')) body.classList.add('rainy');
    else if (normalized.includes('snow')) body.classList.add('snowy');
    else body.classList.add('default');
}

function addToHistory(city) {
    if (!historyList.includes(city)) {
        historyList.unshift(city);
        updateHistoryUI();

        fetch('/api/save_search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ city })
        }).catch(err => console.error('DB error:', err));
    }
}

function updateHistoryUI(filter = '') {
    searchHistory.innerHTML = '';
    const filtered = historyList.filter(city =>
        city.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        searchHistory.style.display = 'none';
        return;
    }

    filtered.forEach(city => {
        const li = document.createElement('li');
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';

        const span = document.createElement('span');
        span.textContent = city;
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => {
            cityInput.value = city;
            fetchWeather(city);
            searchHistory.style.display = 'none';
        });

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '❌';
        removeBtn.style.border = 'none';
        removeBtn.style.background = 'transparent';
        removeBtn.style.cursor = 'pointer';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            historyList = historyList.filter(item => item !== city);
            updateHistoryUI(filter);
        });

        li.appendChild(span);
        li.appendChild(removeBtn);
        searchHistory.appendChild(li);
    });

    searchHistory.style.display = 'block';
}

function addToHistory(city) {
    if (!historyList.includes(city)) {
        historyList.unshift(city);
        updateHistoryUI();

        fetch('/api/save_search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            credentials: 'include',
            body: JSON.stringify({ city })
        }).catch(err => console.error('DB error:', err));
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.slice(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function loadHistoryFromDB() {
    fetch('/api/get_history/')
        .then(res => res.json())
        .then(data => {
            historyList = data.history || [];
            updateHistoryUI();
        });
}

function showLoading() {
    loading.classList.add('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

function showError(message) {
    error.textContent = message;
    error.classList.add('show');
}

function hideError() {
    error.classList.remove('show');
}

function showWeatherDisplay() {
    weatherDisplay.classList.add('show');
}

function hideWeatherDisplay() {
    weatherDisplay.classList.remove('show');
}

// ========== INIT ========== //
loadHistoryFromDB();
