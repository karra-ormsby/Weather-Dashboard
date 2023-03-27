

var APIKey = "41ec94a5b9935bcc3e80370c4943b3d9";
var fetchBtn = document.getElementById("fetch-data");
var weatherForcast = [];
var storedData = JSON.parse(localStorage.getItem("storedData")) || [];


fetchBtn.addEventListener("click", getCoordinates);

function getCoordinates() {
    // console.log(storedData);
    var cityName = document.querySelector("#user-input").value
    console.log(cityName);
    var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIKey;

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            var lat = data[0].lat;
            var lon = data[0].lon;
        
            getWeather(lat, lon);
            // createButton(cityName);
        
            // console.log(cityName);
        })
        
}

function getWeather(lat, lon) {
    var requestURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";

    // console.log(lat);
    // console.log(lon);


    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var cityName = data.city.name;
            var includesArry = [];

            for (j = 0; j < storedData.length; j++) {
                var data = storedData[j];
                var included;
                if (cityName === data[0].cityName) {
                    console.log("in if");
                    console.log(cityName);
                    console.log(data[0].cityName);
                    // included = true;
                    
                } else {
                    // console.log("name doesn't exist");
                    // included = false;
                    console.log("in else");
                    console.log(cityName);
                    console.log(data[0].cityName);
                }
                console.log(includesArry);

            }
            // if (!includesArry.includes(true)) {
            //     console.log("no match found");
            // }


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
            console.log(weatherForcast);
            storedData.push(weatherForcast);
            // //store data to local storage
            localStorage.setItem("storedData", JSON.stringify(storedData));
            console.log(storedData);

            displayWeather(weatherForcast);
        })
}

//creating an element to store all weather data in
var weatherData = document.createElement("section");

function displayWeather(weatherForcast) {
    //clear the weatherData setion at each run of displayWeather
    weatherData.textContent = '';

    weatherData.setAttribute("id", "weather-data");

    //creating elements to display todays weather
    var todaysWeather = document.createElement("section");
    todaysWeather.setAttribute("id", "today-weather");
    

    todaysWeather.innerHTML = "";

    var todaysDate = document.createElement("p");
    todaysDate.textContent = dayjs().format("MM-DD-YYYY");
    todaysWeather.appendChild(todaysDate);
    
    var todaysWeatherIcon = document.createElement("img");
    todaysWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForcast[1].icon + "@2x.png");
    todaysWeather.appendChild(todaysWeatherIcon);

    var todaysTemp = document.createElement("p");
    todaysTemp.textContent = "Temp: " + weatherForcast[1].temp + "\u00B0C";
    todaysWeather.appendChild(todaysTemp);

    var todaysWind = document.createElement("p");
    todaysWind.textContent = "Wind: " + weatherForcast[1].wind + "m/s";
    todaysWeather.appendChild(todaysWind);

    var todaysHumidity = document.createElement("p");
    todaysHumidity.textContent = "Humidity: " + weatherForcast[1].humidity + "%";
    todaysWeather.appendChild(todaysHumidity);

    //writing todaysWeather to the document body
    weatherData.appendChild(todaysWeather);
    document.body.appendChild(weatherData);

    //create  an element to store next 4 days of weather
    var futureForcast = document.createElement("section");
    //creating a card to store each days forcast in
    var furtureWeatherDiv = document.createElement("section");
    furtureWeatherDiv.setAttribute("id", "future-weather");
    for (i = 2; i <= 5; i++) {
        var weatherCard = document.createElement("div");
        weatherCard.setAttribute("class", "weather-card");

        var todaysDate = document.createElement("p");
        todaysDate.textContent = dayjs().add(i-1, 'day').format("MM-DD-YYYY");
        weatherCard.appendChild(todaysDate);

        var todaysWeatherIcon = document.createElement("img");
        todaysWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherForcast[i].icon + "@2x.png");
        weatherCard.appendChild(todaysWeatherIcon);

        var todaysTemp = document.createElement("p");
        todaysTemp.textContent = "Temp: " + weatherForcast[i].temp + "\u00B0C";
        weatherCard.appendChild(todaysTemp);

        var todaysWind = document.createElement("p");
        todaysWind.textContent = "Wind: " + weatherForcast[i].wind + "m/s";
        weatherCard.appendChild(todaysWind);

        var todaysHumidity = document.createElement("p");
        todaysHumidity.textContent = "Humidity: " + weatherForcast[i].humidity + "%";
        weatherCard.appendChild(todaysHumidity);

        furtureWeatherDiv.appendChild(weatherCard);
        weatherData.appendChild(furtureWeatherDiv);
        document.body.appendChild(weatherData);

    }
}

var section = document.getElementById("user");

function createButton(cityName) {
    var cityButton = document.createElement("button");

    cityButton.setAttribute("data", "hi");

    cityButton.textContent = cityName;

    section.appendChild(cityButton);
    document.body.appendChild(cityButton);

}

