// Initialize cities from local storage or start with an empty array
let cities = JSON.parse(localStorage.getItem('search-history')) || [];

// Add a city, fetch weather data, and update local storage
const addCity = city => {
    const APIKey = "cd881b34484180e1564e3a1f6ed56fc0";
    const cityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

    fetch(cityUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
            saveCity(city);
        })
        .catch(error => console.error("Error fetching data:", error));
};

// Save city to local storage and update the list
const saveCity = cityName => {
    cities.unshift({ city: cityName });
    cities = cities.slice(0, 10);
    localStorage.setItem("cities", JSON.stringify(cities));
    updateCityList();
};

// Load cities from local storage and refresh the list
const loadCities = () => {
    const savedCities = localStorage.getItem("cities");
    if (savedCities) {
        cities = JSON.parse(savedCities);
        updateCityList();
    }
};

// Display current weather for the selected city
const displayCurrentWeather = data => {
    const currentWeather = document.getElementById('current-weather');
    currentWeather.innerHTML = '';

    if (!data || !data.list || !data.list[0]) return;

    const { name: cityName } = data.city;
    const { dt_txt, main, weather, wind } = data.list[0];

    currentWeather.innerHTML = `
        <h2>${cityName} (${new Date(dt_txt).toLocaleDateString()})</h2>
        <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" alt="${weather[0].description}" />
        <p>Temp: ${((main.temp - 273.15) * 1.8 + 32).toFixed(2)}°F</p>
        <p>Wind: ${wind.speed} MPH</p>
        <p>Humidity: ${main.humidity}%</p>
    `;
};

// Display the 5-day weather forecast
const displayForecast = data => {
    const forecastContainer = document.getElementById("forecast");
    forecastContainer.innerHTML = "<h3>5-Day Forecast:</h3>";

    if (!data || !data.list) return;

    data.list.slice(2, 35).filter((_, index) => index % 8 === 0).forEach(day => {
        forecastContainer.innerHTML += `
            <div class="forecast-item">
                <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
                <img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="${day.weather[0].description}" />
                <p>Temp: ${((day.main.temp - 273.15) * 1.8 + 32).toFixed(2)}°F</p>
                <p>Wind: ${day.wind.speed} MPH</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
    });
};

// Update the list of cities displayed on the page
const updateCityList = () => {
    const cityList = document.getElementById("search-history");
    cityList.innerHTML = cities.map(city => `
        <button class="city-button">${city.city}</button>
    `).join('');

    document.querySelectorAll('.city-button').forEach(button => {
        button.addEventListener('click', () => addCity(button.innerText));
    });
};

// Set up event listeners for search and input
const initListeners = () => {
    document.getElementById("search-btn").addEventListener("click", () => {
        const city = document.getElementById("city-input").value.trim() || "Miami Beach";
        addCity(city);
        document.getElementById("city-input").value = ''; 
    });

    document.getElementById("city-input").addEventListener("keyup", event => {
        if (event.key === 'Enter') {
            const city = event.target.value.trim() || "Miami Beach";
            addCity(city);
            event.target.value = ''; 
        }
    });
};

// Initialize the app on page load
document.addEventListener('DOMContentLoaded', () => {
    initListeners();
    loadCities();
});
