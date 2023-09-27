// Javascript
// First thing is to put our Key from openweathermap.

const API_KEY = "9d5dfbe83494f7a8091376c453d71c32";
const city = document.getElementById('searchInput').value;



console.log(city);
// Our first thing that needs attention is our search box, with both the button and the text entry field.
// Here's our first function. We called it citySearch, and we declared a variable and set it to the value that will be input on the index page. We also called another function to take the data we pass it.
function searchCity() {
    var searchInput = $("#searchInput").val();
    fetchWeatherAPI(searchInput);
    $('#searchInput').val("");
}
// We want our function to run upon the button being pressed.
$("#searchBtn").click(searchCity);

// This is the function for searching the API.  
function fetchWeatherAPI(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

    $.get(apiURL)
        .done(function (data) {
            // We want to make sure the openweather api is able to send us the data.  If they are not, then we need to give an error.
            if (data.cod === 200) {
                console.log(data);   //Testing to see if we get data
            } else {
                console.error("Error", data.message);
            }
        })
        .fail(function (error) {
            console.error("Error:", error);
        });
}