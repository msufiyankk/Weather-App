const weatherData = {

};

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const weatherDisplay = document.getElementById('weatherDisplay');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle search functionality
function handleSearch() {
    const city = cityInput.value.trim().toLowerCase();
    

    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading();
    hideError();
    hideWeatherDisplay();

    // Simulate API delay
    fetchWeatherData(city);
}

// Simulate fetching weather data
function fetchWeatherData(city) {
    hideLoading();
    fetch(`/api/weather/?city=${encodeURIComponent(city)}`)
        .then(response => response.json())
        .then(data => {
            if (data.city) {
                hideError()
                displayWeatherData(data);
                updateBackgroundColor(data.icon);


            
            } 
            else {
                showError(data.error)
            }
        });

    // Check if city exists in our placeholder data
}

// Display weather information
function displayWeatherData(data) {
    cityName.textContent = data.city;

    // Use emoji as alt text fallback if icon is not available
    const iconMap = {
        
        'Drizzle': '🌦️',
        'Rain': '🌧️',
        'Snow': '❄️',
        'Thunderstorm': '⛈️',
        'Clouds': '⛅',
        'Atmosphere': '🌫️',
        'Clear': '☀️',

    };

    const conditionKey = data.condition.toLowerCase();
    weatherIcon.textContent = iconMap[data.icon] ;
    temperature.textContent = `${data.temperature}°C`;
    condition.textContent = data.icon + ' | '+ data.condition;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windSpeed} km/h`;

    showWeatherDisplay();
    updateBackgroundColor(data.icon);
}

// Update background based on weather condition
function updateBackgroundColor(condition) {
    const body = document.body;

    // Normalize to lowercase for consistent matching
    const normalizedCondition = condition.toLowerCase();

    // Remove existing weather classes
    body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy');

    // Add appropriate class based on condition
    if (normalizedCondition.includes('clear')) {
        body.classList.add('sunny');
    } else if (normalizedCondition.includes('cloud')) {
        body.classList.add('cloudy');
    } else if (normalizedCondition.includes('rain')) {
        body.classList.add('rainy');
    } else if (normalizedCondition.includes('snow')) {
        body.classList.add('snowy');
    } else {
        body.classList.add('cloudy'); // default fallback
    }
}

// Utility functions for showing/hiding elements
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

const suggestionBox = document.getElementById('suggestionBox');

// Auto-suggestions using OpenWeatherMap Geo API
cityInput.addEventListener('input', () => {
    const input = cityInput.value.trim();
    const query = cityInput.value.trim();
    if (!query) {
        suggestionBox.style.display = 'none';
        return;
    }

    if (!input) {
        suggestionBox.innerHTML = '';
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=5&appid=0e854c819f48ceb01a980aaad0425e0e`)
        .then(response => response.json())
        .then(data => {
            suggestionBox.innerHTML = '';

            data.forEach(location => {
                const fullCity = `${location.name}, ${location.country}`;
                const li = document.createElement('li');
                li.textContent = fullCity;

                // On click, set input and search
                li.addEventListener('click', () => {
                    cityInput.value = location.name;  // or fullCity if you handle it
                    suggestionBox.innerHTML = '';
                    handleSearch(); // Call your weather fetcher
                });

                suggestionBox.appendChild(li);
            });
        });
});


document.getElementById('searchBtn').addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        suggestionBox.style.display = 'none'; // ⬅ Hide suggestions
        fetchWeather(city); // ⬅ Your existing weather-fetching function
    }
});


