// Javascript
// First thing is to put our Key from openweathermap.

const API_KEY = "9d5dfbe83494f7a8091376c453d71c32";
const city = document.getElementById('searchInput').value;
const searchedCities = [];



console.log(city);
// Our first thing that needs attention is our search box, with both the button and the text entry field.
// Here's our first function. We called it citySearch, and we declared a variable and set it to the value that will be input on the index page. We also called another function to take the data we pass it.
function searchCity() {
    var searchInput = $("#searchInput").val();
    fetchWeatherAPI(searchInput);
    // Need to add 5day forecast fetch
    fetchFiveday(searchInput);

    $('#searchInput').val("");

    searchedCities.push(searchInput);

    updateSearchhistory();
}
// We want our function to run upon the button being pressed.
$("#searchBtn").click(searchCity);

// This is the function for searching the API.  
function fetchWeatherAPI(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
;

    $.get(apiURL)
        .done(function (data) {
            // We want to make sure the openweather api is able to send us the data.  If they are not, then we need to give an error.
            if (data.cod === 200) {
                console.log(data);
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
        .fail(function (error) {
            console.error("Error:", error);
        })
}
// This is where we display our current weather.
function updateWeatherUI(data, formattedDate, weatherIconcode) {
    const todayCityname = document.getElementById('todayCityname');
    const todayCitytemp = document.getElementById('todayCitytemp');
    const todayCitywind = document.getElementById('todayCitywind');
    const todayCityhumidity = document.getElementById('todayCityhumidity');

    todayCityname.textContent = `${data.name} (${formattedDate})`;
    todayCitytemp.textContent = `Temperature: ${convertKelvinToFahrenheit(data.main.temp)} °F`;  //Had to build a converter function as the initial value was in Kelvin and thats not helpful.
    const windMPH = convertMPStoMPH(data.wind.speed);
    todayCitywind.textContent = `Wind: ${data.wind.speed} MPH`;  // Also had to build a converter function, as the intitial value was in meters per second, and it'd be much more helpful to have mph.
    todayCityhumidity.textContent = `Humidity: ${data.main.humidity}%`;

    const iconURL = `https://openweathermap.org/img/wn/${weatherIconcode}.png`;
    const weatherIcon = document.getElementById('weatherIcon');
    weatherIcon.src = iconURL;

    weatherIcon.style.display = "inline-block";

}


// Whgen I initially was running the above function I was getting temperature ratings in like the 300's so I looked for a function to convert the temperature they were giving us with the API and
// converted it from Kelvin to Fahrenheit and then I just needed to plug it into the previous function
function convertKelvinToFahrenheit(kelvin) {
    return ((kelvin - 273.15) * 9 / 5 + 32).toFixed(2); // 
}


// Similiar to the Kelvin to Farhrenheit. Want our wind speed to be relatable.  And meters per second isn't the traditional method I am used to.
function convertMPStoMPH(mps) {
    // Conversion factor from m/s to mph
    const conversionFactor = 2.23694;
    // Calculate the wind speed in mph
    const mph = mps * conversionFactor;
    return mph.toFixed(2); // up to 2 decimal places
}

// We want to keep a list of the cities we searched so users can just click them and see the info again.
function updateSearchhistory() {
    const historyContainer = $("#citiesSearched");
    historyContainer.empty();

    searchedCities.forEach((city) => {
        const button = $('<button>').text(city);
        button.click(() => {
            fetchWeatherAPI(city);
        });
        historyContainer.append(button);
    })


}

// https://openweathermap.org/weather-conditions
// Needed to establish some icons provided by the API, so that we can attribute them to not only our current city, but also to the 5 day forecast.
// Each weather has two potential icons based on wether it's day or night.  While some of the images don't change.  Figured it was important to just keep all the possibilities.
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

function fetchFiveday(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;
    $.ajax({
        url: apiURL,
        method: "GET",
        dataType: "json",
        success: function (data) {
            updateFiveday(data);
        },
        error: function (error) {
            console.error("Error fetching forecast:", error);
        },
    })
}

function updateFiveday(data) {
    const forecastContainer = document.getElementById("fiveDayforecast");

    for (let i = 0; i < 5; i++) {
        const day = data.list[i * 8 + 4];
        const date = formatDate(day.dt_txt)
        console.log(day.dt_txt);
        const weatherIcon= day.weather[0].icon;
        const temperature = `Temperature: ${day.main.temp} °F`;
        const wind = `Wind: ${convertMPStoMPH(day.wind.speed)} MPH`;
        const humidity = `Humidity: ${day.main.humidity}%`;

        console.log("Date:", date);
        console.log("Weather Icon:", weatherIcon);
        console.log("Temperature:", temperature);
        console.log("Wind:", wind);
        console.log("Humidity:", humidity);


        const dayElement = $("<section>")
            .attr("id", `day${i + 1}`)
            .append(
                $("<h4>")
                    .addClass("currentDayforecast")
                    .text(date),
                $("<img>")
                .attr("src", `https://openweathermap.org/img/wn/${weatherIcon}.png`),
                $("<p>").addClass("temperature").text(temperature),
                $("<p>").addClass("wind").text(wind),
                $("<p>").addClass("humidity").text(humidity)
            );
        forecastContainer.append(dayElement);
            }
    }

function formatDate(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}


