// Javascript
// First thing is to put our Key from openweathermap.
// On future projects we will look at hiding our keys, so just noting here that we know we shouldn't in practice have the API key right on a public gitHub repo page.

const API_KEY = "9d5dfbe83494f7a8091376c453d71c32";
const searchedCities = [];

// Our first thing that needs attention is our search box, with both the button and the text entry field.
// Here's our first function. We called it citySearch, and we declared a variable and set it to the value that will be input on the index page. We also called another function to take the data we pass it.
function searchCity() {
    var searchInput = document.getElementById("searchInput").value;
    // Putting a check in to make sure we have a value
    if (searchInput.trim() === "") {
        alert("Please enter a city name before searching.");
        return;
    }

    // Getting our current Weather
    fetchWeatherAPI(searchInput);
    // Also getting the 5 day Weather
    fetchFiveday(searchInput);

    document.getElementById('searchInput').value = "";
    // Adding our city to the list of searched cities.
    searchedCities.push(searchInput);

    updateSearchhistory();
}


// This is the function for searching the API.  
function fetchWeatherAPI(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            // We want to make sure the openweather api is able to send us the data.  If they are not, then we need to give an error.
            if (data.cod === 200) {

                // Within the function we are also looking to display the date.   So we need to call a new variable and set some parameters.

                const currentDate = new Date();
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };  // We want the year in numeric, the month spelled out, and the day also in numeric.  We can change this later to a different format.
                const formattedDate = currentDate.toLocaleDateString(undefined, options);   //Here we are going to define a value that we can plug into the fields below.
                const weatherIconcode = data.weather[0].icon;

                updateWeatherUI(data, formattedDate, weatherIconcode);
            }
            else {
                console.error("Error", data.message);
            }
        })
        .catch(function (error) {
            console.error("Error:", error);
        })
}

// This is where we display our current weather.  Basically taking the information from the fetch and plugging it into our HTML.
function updateWeatherUI(data, formattedDate, weatherIconcode) {
    const todayCityname = document.getElementById('todayCityname');
    const todayCitytemp = document.getElementById('todayCitytemp');
    const todayCitywind = document.getElementById('todayCitywind');
    const todayCityhumidity = document.getElementById('todayCityhumidity');

    todayCityname.textContent = `${data.name} (${formattedDate})`;
    todayCitytemp.textContent = `Temperature: ${(data.main.temp)} °F`;  //Had to build a converter function as the initial value was in Kelvin and thats not helpful.
    const windMPH = (data.wind.speed);
    todayCitywind.textContent = `Wind: ${data.wind.speed} MPH`;  // Also had to build a converter function, as the intitial value was in meters per second, and it'd be much more helpful to have mph.
    todayCityhumidity.textContent = `Humidity: ${data.main.humidity}%`;

    // We want to display a weather icon, provided by the API.  
    const iconURL = `https://openweathermap.org/img/wn/${weatherIconcode}.png`;
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.src = iconURL;
    weatherIcon.style.display = "inline-block";

    todayCitytemp.style.display = "block";
    todayCitywind.style.display = "block";
    todayCityhumidity.style.display = "block";
}

// We want to keep a list of the cities we searched so users can just click them and see the info again.
function updateSearchhistory() {
    const historyContainer = document.getElementById("citiesSearched");
    historyContainer.innerHTML = "";

    searchedCities.forEach((city) => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener(`click`, () => {
            fetchWeatherAPI(city);
        });
        historyContainer.append(button);
    });
}

// https://openweathermap.org/weather-conditions
// Needed to establish some icons provided by the API, so that we can attribute them to not only our current city, but also to the 5 day forecast.
// Each weather has two potential icons based on wether it's day or night.  While some of the images don't change.  Figured it was important to just keep all the possibilities.
// I did make it so that the 5 day forecast will try to always pull at 12pm noon, so the night ones should only be present in the current day window.
const weatherIconimages = {
    '01d': '01d.png',  // clear sky (day)
    '01n': '01n.png',  // clear sky (night)
    '02d': '02d.png',  // few clouds (day)
    '02n': '02n.png',  // few clouds (night)
    '03d': '03d.png',  // scattered clouds (day)
    '03n': '03n.png',  // scattered clouds (night)
    '04d': '04d.png',  // broken clouds (day)
    '04n': '04n.png',  // broken clouds (night)
    '09d': '09d.png',  // shower rain (day)
    '09n': '09n.png',  // shower rain (night)
    '10d': '10d.png',  // rain (day)
    '10n': '10n.png',  // rain (night)
    '11d': '11d.png',  // thunderstorm (day)
    '11n': '11n.png',  // thunderstorm (night)
    '13d': '13d.png',  // snow (day)
    '13n': '13n.png',  // snow (night)
    '50d': '50d.png',  // mist (day)
    '50n': '50n.png'   // mist (night)
};

// Begining of 5 day functions
// Here we are going to fetch the weather from the fivedayforceast api, which is a different link.  We are given things in a JSON type, so we can specifiy to be sent that way. We also neededt to setup our error functions so that
// can't pull the data we requested we aren't stuck in a loop of it just trying and trying. 
function fetchFiveday(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`;  // Simliar to above we add the parameter for it to keep things in imperial units
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            updateFiveday(data);
        })
        .catch(error => {
            console.error("Error fetching forecast:", error);
        })
}

// Now that we have the data for our five day we need to start plugging it into our html in our 5 different boxes.  We need to alter the HTML by using querySelectors and changing those values to what we just received from our fetch.

function updateFiveday(data) {
    const forecastContainer = document.getElementById("fiveDayforecast");

    for (let i = 0; i < 5; i++) {    // We need to increment each day.
        const day = data.list[i * 8 + 5];  // Changes our fetch time to 12pm each day
        const date = formatDate(day.dt_txt)

        const weatherIcon = day.weather[0].icon;
        const temperature = `Temperature: ${(day.main.temp)} °F`;
        const wind = `Wind: ${(day.wind.speed)} MPH`;
        const humidity = `Humidity: ${day.main.humidity}%`;

        console.log(day.dt_txt)

        const dayElement = document.getElementById(`day${i + 1}`);
        dayElement.querySelector(".currentDayforecast").textContent = date;
        dayElement.querySelector("img").src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        dayElement.querySelector(".temperature").textContent = temperature;
        dayElement.querySelector(".wind").textContent = wind;
        dayElement.querySelector(".humidity").textContent = humidity;

        dayElement.classList.remove("forecast-hidden");

        forecastContainer.append(dayElement);
    }
    forecastContainer.style.display = "flex";  // Here we tell the HTML to now display our boxes, where we actually hid them in the CSS to begin with.
}

// Here's is where we can get the time and display it for our five day.

function formatDate(dateTime) {
    const date = new Date(dateTime);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${month}/${day}/${year}`;
}

// These are our basics for having our button or a keydown event to start the whole process.
document.getElementById("searchBtn").addEventListener(`click`, searchCity);
document.getElementById("searchInput").addEventListener(`keydown`, function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        searchCity();
    }
});
