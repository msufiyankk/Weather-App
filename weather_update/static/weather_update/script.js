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
const suggestionBox = document.getElementById('suggestionBox');


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
        body.classList.add('clear'); // default fallback
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

// Auto-suggestions using OpenWeatherMap Geo API
cityInput.addEventListener('input', () => {
    const input = cityInput.value.trim();
    const query = cityInput.value.trim();

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

const apiKey = '0e854c819f48ceb01a980aaad0425e0e';
// Fetch weather
function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
   
    addToHistory(city);// ......................................
   
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error("City not found");
            return response.json();
        })      
}

// Autocomplete suggestions
cityInput.addEventListener('input', () => {
    const input = cityInput.value.trim();

    if (!input) {
        suggestionBox.style.display = 'none';
        suggestionBox.innerHTML = '';
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=5&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            suggestionBox.innerHTML = '';

            if (data.length === 0) {
                suggestionBox.style.display = 'none';
                return;
            }

            data.forEach(location => {
                const fullCity = `${location.name}, ${location.country}`;
                const li = document.createElement('li');
                li.textContent = fullCity;

                li.addEventListener('click', () => {
                    cityInput.value = location.name;
                    suggestionBox.innerHTML = '';
                    suggestionBox.style.display = 'none';
                    fetchWeather(location.name);
                });

                suggestionBox.appendChild(li);
            });

            suggestionBox.style.display = 'block';
        });
});

// Handle Enter key
cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none';
            fetchWeather(city);
        }
    }
});

// Manual search button
document.getElementById('searchBtn').addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        suggestionBox.innerHTML = '';
        suggestionBox.style.display = 'none';
        fetchWeather(city);
    }
});

// history........

// const searchHistory = document.getElementById('searchHistory');
// const historyList = []; // holds previously searched cities

// function fetchWeather(city) {
//     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

//     fetch(apiUrl)
//         .then(response => {
//             if (!response.ok) throw new Error("City not found");
//             return response.json();
//         })
//         .then(data => {
//             displayWeather(data);
//             addToHistory(city); // ✅ Add to search history
//         })
//         .catch(error => {
//             console.error('Weather fetch error:', error);
//             weatherOutput.innerHTML = `<p style="color: red;">${error.message}</p>`;
//         });
// }

// function addToHistory(city) {
//     if (historyList.includes(city)) return; // avoid duplicates

//     historyList.push(city);

//     const li = document.createElement('li');
//     li.textContent = city;
//     li.style.cursor = 'pointer';

//     li.addEventListener('click', () => {
//         cityInput.value = city;
//         fetchWeather(city);
//     });

//     searchHistory.appendChild(li);
// }


const searchHistory = document.getElementById('searchHistory');
const historyList = [];

function addToHistory(city) {
    if (historyList.includes(city)) return;
    historyList.push(city);
    updateHistoryUI(); 
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
        removeBtn.style.color = 'red';

        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent triggering city search
            const index = historyList.indexOf(city);
            if (index !== -1) {
                historyList.splice(index, 1);
                updateHistoryUI(filter); // refresh list
            }
        });

        li.appendChild(span);
        li.appendChild(removeBtn);
        searchHistory.appendChild(li);
    });

    searchHistory.style.display = 'block';
}

cityInput.addEventListener('focus', () => {
    updateHistoryUI(); // show full history
});

cityInput.addEventListener('input', () => {
    const input = cityInput.value.trim();
    updateHistoryUI(input); // show filtered history

    // (your existing suggestion logic below)
    if (!input) {
        suggestionBox.style.display = 'none';
        return;
    }

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=5&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            suggestionBox.innerHTML = '';

            if (data.length === 0) {
                suggestionBox.style.display = 'none';
                return;
            }

            data.forEach(location => {
                const fullCity = `${location.name}, ${location.country}`;
                const li = document.createElement('li');
                li.textContent = fullCity;

                li.addEventListener('click', () => {
                    cityInput.value = location.name;
                    suggestionBox.innerHTML = '';
                    suggestionBox.style.display = 'none';
                    fetchWeather(location.name);
                });

                suggestionBox.appendChild(li);
            });

            suggestionBox.style.display = 'block';
        });
});

document.addEventListener('click', (e) => {
    if (!cityInput.contains(e.target) && !searchHistory.contains(e.target)) {
        searchHistory.style.display = 'none';
    }
});

