var APIKey = "41ec94a5b9935bcc3e80370c4943b3d9";
var fetchBtn = document.getElementById("search-btn");
var container = document.getElementById("container");

var weatherForcast = [];
var storedCityNames = JSON.parse(localStorage.getItem("storedCityNames")) || [];

getBtn();

fetchBtn.addEventListener("click", function() {
    var cityName = (document.querySelector("#user-input").value).toLowerCase();

    getCoordinates(cityName);
});

//function gets the coordinates of the city entered by the user
function getCoordinates(cityName) {
    var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIKey;

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
        
            getWeather(lat, lon);
            
            //rename variables x and y
            var included = [];
            var y = 0

            //check is the city name has already been searched for. If yes then the button is not added, if no then a button is created
            if(storedCityNames.length === 1) {
                if (storedCityNames[0] === cityName) {
                    included.push(true)
                } else {
                    included.push(false)
                }
            } else {
                for (i = 0; i < storedCityNames.length; i++) {
                    var storedName = storedCityNames[i].name;

                    if(storedName === cityName) {
                        included.push(true)
                    } else {
                        included.push(false)
                    }
                }
             }
            console.log(included);
            for(j = 0; j < included.length-1; j++) {
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

//functions gets the required weather data from the API
function getWeather(lat, lon) {
    var requestURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";

    fetch(requestURL)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
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
            displayWeather(weatherForcast);
        })
}

//creating an element to store all weather data in
var weatherData = document.createElement("section");

//functions displays the weather on the webpage
function displayWeather(weatherForcast) {
    //clear the weatherData setion at each run of displayWeather
    weatherData.textContent = '';

    weatherData.setAttribute("id", "weather-data");
    weatherData.setAttribute("class", "col-9");

    //creating elements to display todays weather
    var todaysWeather = document.createElement("section");
    todaysWeather.setAttribute("id", "today-weather");

    //adds the city name
    var todaysCity = document.createElement("h4");
    todaysCity.textContent = weatherForcast[0].cityName;
    todaysCity.setAttribute("id", "city-name");
    todaysWeather.appendChild(todaysCity);

    //adds todays date
    var todaysDate = document.createElement("p");
    todaysDate.textContent = dayjs().format("MM-DD-YYYY");
    todaysDate.setAttribute("class", "date");
    todaysWeather.appendChild(todaysDate);
    
    //adds the weather icon
    var todaysWeatherIcon = document.createElement("img");
    todaysWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForcast[1].icon + "@2x.png");
    todaysWeather.appendChild(todaysWeatherIcon);

    //adds the temperature
    var todaysTemp = document.createElement("p");
    todaysTemp.textContent = "Temp: " + weatherForcast[1].temp + "\u00B0C";
    todaysWeather.appendChild(todaysTemp);

    //adds the wind speed
    var todaysWind = document.createElement("p");
    todaysWind.textContent = "Wind: " + weatherForcast[1].wind + "m/s";
    todaysWeather.appendChild(todaysWind);

    //adds the humidity
    var todaysHumidity = document.createElement("p");
    todaysHumidity.textContent = "Humidity: " + weatherForcast[1].humidity + "%";
    todaysWeather.appendChild(todaysHumidity);

    //writing todaysWeather to the document body
    weatherData.appendChild(todaysWeather);
    container.appendChild(weatherData);

    //creating a div to store the next 5 days of weather in
    var furtureWeatherDiv = document.createElement("section");
    furtureWeatherDiv.setAttribute("id", "future-weather");
    furtureWeatherDiv.setAttribute("class", "row");

    var futureWeatherHeading = document.createElement("h3");
    futureWeatherHeading.setAttribute("id", "future-heading")
    futureWeatherHeading.textContent = "5 Day Forecast:";
    furtureWeatherDiv.appendChild(futureWeatherHeading);

    for (i = 2; i <= 5; i++) {
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

//eventListener doesn't work until the page is reloaded
var cityBtn = document.querySelectorAll(".cityBtn");
for(i = 0; i < storedCityNames.length; i++) {
    cityBtn[i].addEventListener("click", function (event){
        console.log("in button");
        var element = event.target;
        var city = element.getAttribute("data-city");
        getCoordinates(city);
    });
}

function createButton(cityName) {
    var section = document.getElementById("user");
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
    
    localStorage.setItem("storedCityNames", JSON.stringify(storedCityNames));
}

function getBtn () {
    for (i=0; i < storedCityNames.length; i++) {
        var name = storedCityNames[i].name;
        var section = document.getElementById("user");
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




