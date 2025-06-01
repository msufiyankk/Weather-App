 const weatherData = {
            // 'new york': {
            //     city: 'New York City',
            //     temperature: 22,
            //     condition: 'sunny',
            //     humidity: 65,
            //     windSpeed: 12,
            //     icon: '☀️'
            // },
            // 'london': {
            //     city: 'London',
            //     temperature: 15,
            //     condition: 'cloudy',
            //     humidity: 78,
            //     windSpeed: 8,
            //     icon: '☁️'
            // },
            // 'tokyo': {
            //     city: 'Tokyo',
            //     temperature: 28,
            //     condition: 'sunny',
            //     humidity: 60,
            //     windSpeed: 6,
            //     icon: '☀️'
            // },
            // 'paris': {
            //     city: 'Paris',
            //     temperature: 18,
            //     condition: 'rainy',
            //     humidity: 85,
            //     windSpeed: 15,
            //     icon: '🌧️'
            // },
            // 'sydney': {
            //     city: 'Sydney',
            //     temperature: 25,
            //     condition: 'partly cloudy',
            //     humidity: 70,
            //     windSpeed: 10,
            //     icon: '⛅'
            // },
            // 'moscow': {
            //     city: 'Moscow',
            //     temperature: -5,
            //     condition: 'snowy',
            //     humidity: 90,
            //     windSpeed: 20,
            //     icon: '❄️'
            // }
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
        cityInput.addEventListener('keypress', function(e) {
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
            setTimeout(() => {
                fetchWeatherData(city);
            }, 1000);
        }

        // Simulate fetching weather data
        function fetchWeatherData(city) {
            hideLoading();

            // Check if city exists in our placeholder data
            if (weatherData[city]) {
                displayWeatherData(weatherData[city]);
                updateBackgroundColor(weatherData[city].condition);
            } else {
                showError(`Weather data not found for "${city}". Try: New York, London, Tokyo, Paris, Sydney, or Moscow`);
            }
        }

        // Display weather information
        function displayWeatherData(data) {
            cityName.textContent = data.city;
            weatherIcon.textContent = data.icon;
            temperature.textContent = `${data.temperature}°C`;
            condition.textContent = data.condition;
            humidity.textContent = `${data.humidity}%`;
            windSpeed.textContent = `${data.windSpeed} km/h`;
            
            showWeatherDisplay();
        }

        // Update background based on weather condition
        function updateBackgroundColor(condition) {
            const body = document.body;
            
            // Remove existing weather classes
            body.classList.remove('sunny', 'cloudy', 'rainy', 'snowy');
            
            // Add appropriate class based on condition
            if (condition.includes('sunny')) {
                body.classList.add('sunny');
            } else if (condition.includes('cloudy')) {
                body.classList.add('cloudy');
            } else if (condition.includes('rain')) {
                body.classList.add('rainy');
            } else if (condition.includes('snow')) {
                body.classList.add('snowy');
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

        // Initialize with default data
        window.addEventListener('load', function() {
            displayWeatherData(weatherData['new york']);
            updateBackgroundColor('sunny');
        });