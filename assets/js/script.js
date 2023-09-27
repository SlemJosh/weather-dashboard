// Javascript
// First thing is to put our Key from openweathermap.

const API_KEY = "9d5dfbe83494f7a8091376c453d71c32";

// Our first thing that needs attention is our search box, with both the button and the text entry field.
// Here's our first function. We called it citySearch, and we declared a variable and set it to the value that will be input on the index page. We also called another function to take the data we pass it.
function searchCity(){
    var searchInput = $("#searchInput").val();
    fetchWeatherAPI(searchInput);
    $('#searchInput').val("");
}
