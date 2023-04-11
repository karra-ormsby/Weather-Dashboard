var APIKey = "41ec94a5b9935bcc3e80370c4943b3d9";
var fetchBtn = document.getElementById("search-btn");
var container = document.getElementById("container");

var currentForecast = [];
var weatherForcast = [];
var storedCityNames = JSON.parse(localStorage.getItem("storedCityNames")) || [];

getBtn();

fetchBtn.addEventListener("click", function() {
    var cityName = (document.querySelector("#user-input").value).toLowerCase();

    getCoordinates(cityName);
    
});

//function gets the coordinates of the city entered by the user
function getCoordinates(cityName) {
    var requestURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIKey;

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
        
            getCurrentWeather(lat, lon);
            getForecast(lat, lon);
            
            //rename variables x and y
            var included = [];
            var y = 0

            //check is the city name has already been searched for. If yes then the button is not added, if no then a button is created
            for (i = 0; i < storedCityNames.length; i++) {
                var storedName = storedCityNames[i].name;

                if(storedName === cityName) {
                    included.push(true)
                } else {
                    included.push(false)
                }
            }

            for(j = 0; j < included.length; j++) {
                var x = included[j];

                if(x === true) {
                    y = 1;
                }
            }
            //there is not already a button for this location, so one will get created
            if (y !== 1) {
                createButton(cityName);
            }
        })
        
}

function getCurrentWeather (lat, lon) {
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            currentForecast = [];

            var name = data.name;
            currentForecast.push(name);
            var temp = data.main.temp;
            currentForecast.push(temp);
            var humidity = data.main.humidity;
            currentForecast.push(humidity);
            var wind = data.wind.speed;
            currentForecast.push(wind);
            var icon = data.weather[0].icon;
            currentForecast.push(icon);

            displayCurrentWeather (currentForecast);

        })
}

//functions gets the required weather data from the API
function getForecast(lat, lon) {
    var requestURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var cityName = data.city.name;

            weatherForcast = [];

            weatherForcast.push({ cityName: cityName });

            for (i = 0; i <= 32; i = i + 8) {
                var humidity = data.list[i].main.humidity;
                var wind = data.list[i].wind.speed;
                var temp = data.list[i].main.temp;
                var weatherIcon = data.list[i].weather[0].icon;

                var dailyForcast = {
                    humidity: humidity,
                    wind: wind,
                    temp: temp,
                    icon: weatherIcon
                }
                weatherForcast.push(dailyForcast);
            }
            displayForecast(weatherForcast);
        })
}

//creating an element to store all weather data in
var weatherData = document.createElement("section");

function displayCurrentWeather(currentForecast) {
    //clear the weatherData setion at each run of displayWeather
    weatherData.textContent = '';

    weatherData.setAttribute("id", "weather-data");
    weatherData.setAttribute("class", "col-lg-9 col-sm-12");

    //creating elements to display todays weather
    var todaysWeather = document.createElement("section");
    todaysWeather.setAttribute("id", "today-weather");

    //adds the city name
    var todaysCity = document.createElement("h4");
    todaysCity.textContent = currentForecast[0];
    todaysCity.setAttribute("id", "city-name");
    todaysWeather.appendChild(todaysCity);

    //adds the weather icon
    var todaysWeatherIcon = document.createElement("img");
    todaysWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + currentForecast[4] + "@2x.png");
    todaysWeather.appendChild(todaysWeatherIcon);

    //adds the temperature
    var todaysTemp = document.createElement("p");
    todaysTemp.textContent = "Temp: " + currentForecast[1] + "\u00B0C";
    todaysWeather.appendChild(todaysTemp);

    //adds the wind speed
    var todaysWind = document.createElement("p");
    todaysWind.textContent = "Wind: " + currentForecast[3] + "m/s";
    todaysWeather.appendChild(todaysWind);

    //adds the humidity
    var todaysHumidity = document.createElement("p");
    todaysHumidity.textContent = "Humidity: " + currentForecast[2] + "%";
    todaysWeather.appendChild(todaysHumidity);

    //writing todaysWeather to the document body
    weatherData.appendChild(todaysWeather);
    container.appendChild(weatherData);
}

//functions displays the weather on the webpage
function displayForecast(weatherForcast) {
    //creating a div to store the next 5 days of weather in
    var furtureWeatherDiv = document.createElement("section");
    furtureWeatherDiv.setAttribute("id", "future-weather");
    furtureWeatherDiv.setAttribute("class", "row");

    var futureWeatherHeading = document.createElement("h3");
    futureWeatherHeading.setAttribute("id", "future-heading")
    futureWeatherHeading.textContent = "5 Day Forecast:";
    furtureWeatherDiv.appendChild(futureWeatherHeading);

    for (i = 1; i <= 5; i++) {
        //creating a card to store each days forcast in
        var weatherCard = document.createElement("div");
        weatherCard.setAttribute("class", "col weather-card");

        //adds the date
        var todaysDate = document.createElement("p");
        todaysDate.textContent = dayjs().add(i-1, 'day').format("MM-DD-YYYY");
        todaysDate.setAttribute("class", "date");
        weatherCard.appendChild(todaysDate);

        //adds the weather icon
        var todaysWeatherIcon = document.createElement("img");
        todaysWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForcast[i].icon + "@2x.png");
        weatherCard.appendChild(todaysWeatherIcon);

        //adds the temperature
        var todaysTemp = document.createElement("p");
        todaysTemp.textContent = "Temp: " + weatherForcast[i].temp + "\u00B0C";
        weatherCard.appendChild(todaysTemp);

        //adds the wind speed
        var todaysWind = document.createElement("p");
        todaysWind.textContent = "Wind: " + weatherForcast[i].wind + "m/s";
        weatherCard.appendChild(todaysWind);

        //adds the humididty
        var todaysHumidity = document.createElement("p");
        todaysHumidity.textContent = "Humidity: " + weatherForcast[i].humidity + "%";
        weatherCard.appendChild(todaysHumidity);

        //writting each card to the future weather div
        furtureWeatherDiv.appendChild(weatherCard);
        //writting the future weather div to the weather data div
        weatherData.appendChild(furtureWeatherDiv);
        //writting everything to the document
        container.appendChild(weatherData);
    }
}

//creates a button when a city is searched
function createButton(cityName) {
    var section = document.getElementById("search-history");
    var cityButton = document.createElement("button");

    cityButton.setAttribute("data-city", cityName);
    cityButton.setAttribute("type", "button");
    cityButton.setAttribute("class", "cityBtn btn btn-secondary");
    
    var firstLetter = cityName.charAt(0);
    var firstLetterCap = firstLetter.toUpperCase();
    var remainingLetters = cityName.slice(1);
    var capitalWord = firstLetterCap + remainingLetters;

    cityButton.textContent = capitalWord;

    section.appendChild(cityButton);

    var cityObject = {
        name: cityName
    }

    storedCityNames.push(cityObject);
    console.log(storedCityNames);
    console.log(storedCityNames.length);
    
    localStorage.setItem("storedCityNames", JSON.stringify(storedCityNames));
}

//writes past searches button to the page upon page load/reload
function getBtn () {
    for (i=0; i < storedCityNames.length; i++) {
        var name = storedCityNames[i].name;
        var section = document.getElementById("search-history");
        var cityButton = document.createElement("button"); 

        cityButton.setAttribute("data-city", name);
        cityButton.setAttribute("type", "button");
        cityButton.setAttribute("class", "cityBtn btn btn-secondary");

        var firstLetter = name.charAt(0);
        var firstLetterCap = firstLetter.toUpperCase();
        var remainingLetters = name.slice(1);
        var capitalWord = firstLetterCap + remainingLetters;

        cityButton.textContent = capitalWord;

        section.appendChild(cityButton);
    }

}

function searchHistory (event) {
    var element = event.target;
    var city = element.getAttribute("data-city");
    getCoordinates(city);
}

var searchHistorySection = document.getElementById("search-history");
searchHistorySection.addEventListener("click", searchHistory);

