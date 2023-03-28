var APIKey = "41ec94a5b9935bcc3e80370c4943b3d9";
var fetchBtn = document.getElementById("fetch-data");

var weatherForcast = [];
var storedCityNames = JSON.parse(localStorage.getItem("storedCityNames")) || [];

// getBtn();

fetchBtn.addEventListener("click", function() {
    var cityName = (document.querySelector("#user-input").value).toLowerCase();

    getCoordinates(cityName);
});

function getCoordinates(cityName) {
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
            
            //rename variables x and y
            var included = [];
            var y = 0

            for (i = 0; i < storedCityNames.length; i++) {
                var storedName = storedCityNames[i].name;

                if(storedName === cityName) {
                    included.push(true)
                } else {
                    included.push(false)
                }
            }
            console.log(included);
            for(j = 0; j < included.length-1; j++) {
                var x = included[j];

                if(x === true) {
                    console.log("button already exists");
                    y = 1;
                }
            }
            if (y !== 1) {
                createButton(cityName);
            }



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
            console.log(weatherForcast);

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

    var todaysCity = document.createElement("p");
    todaysCity.textContent = weatherForcast[0].cityName;
    todaysWeather.appendChild(todaysCity);

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

//eventListener doesn't work until the page is reloaded
// var cityBtn = document.querySelectorAll(".cityBtn");
// console.log(cityBtn);
// for(i = 0; i < storedCityNames.length; i++) {
//     cityBtn[i].addEventListener("click", function (event){
//         console.log("in button");
//         var element = event.target;
//         var city = element.getAttribute("data-city");
//         getCoordinates(city);
//     });
// }

function createButton(cityName) {
    var section = document.getElementById("user");
    var cityButton = document.createElement("button");
    

    cityButton.setAttribute("data-city", cityName);
    cityButton.setAttribute("class", "cityBtn");
    
    var firstLetter = cityName.charAt(0);
    var firstLetterCap = firstLetter.toUpperCase();
    var remainingLetters = cityName.slice(1);
    var capitalWord = firstLetterCap + remainingLetters;

    cityButton.textContent = capitalWord;

    section.appendChild(cityButton);
    document.body.appendChild(cityButton);

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
        cityButton.setAttribute("class", "cityBtn");

        var firstLetter = name.charAt(0);
        var firstLetterCap = firstLetter.toUpperCase();
        var remainingLetters = name.slice(1);
        var capitalWord = firstLetterCap + remainingLetters;

        cityButton.textContent = capitalWord;

        section.appendChild(cityButton);
        document.body.appendChild(cityButton);
    }

}




