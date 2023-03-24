var APIKey = "41ec94a5b9935bcc3e80370c4943b3d9";
var fetchBtn = document.getElementById("fetch-data");
var weatherForcast = [];




function getCoordinates () {
    var cityName = document.querySelector("#user-input").value
    console.log(cityName);
    var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + APIKey;
    console.log(requestURL);

    fetch(requestURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var lat = data[0].lat;
        var lon = data[0].lon;
        console.log(lat);
        console.log(lon);
        getWeather(lat, lon);
    })
    

}

function getWeather (lat, lon) {
    var requestURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon="+ lon + "&appid=" + APIKey + "&units=metric";
    

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var cityName = data.city.name;

            weatherForcast.push({ cityName: cityName });

            for(i = 0; i <=32; i=i+8) {
                var humidity = data.list[i].main.humidity;
                var wind = data.list[i].wind.speed;
                var temp = data.list[i].main.temp;

                var dailyForcast = {
                humidity: humidity,
                wind: wind,
                temp: temp
                }

                weatherForcast.push(dailyForcast);
            }
            console.log(weatherForcast[1].wind);
            displayWeather(weatherForcast);
        })
}


function displayWeather (weatherForcast) {
    

    //creating elements to display todays weather
    var todaysWeather = document.createElement("section");
    
    todaysWeather.innerHTML = "";

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
    document.body.appendChild(todaysWeather);

     //create  an element to store next 4 days of weather
    var futureForcast = document.createElement("section");
    //creating a card to store each days forcast in
    for(i = 2; i <= 5; i++) {
        var weatherCard = document.createElement("div");

        var todaysTemp = document.createElement("p");
        todaysTemp.textContent = "Temp: " + weatherForcast[i].temp + "\u00B0C";
        weatherCard.appendChild(todaysTemp);

        var todaysWind = document.createElement("p");
        todaysWind.textContent = "Wind: " + weatherForcast[i].wind + "m/s";
        weatherCard.appendChild(todaysWind);

        var todaysHumidity = document.createElement("p");
        todaysHumidity.textContent = "Humidity: " + weatherForcast[i].humidity + "%";
        weatherCard.appendChild(todaysHumidity);

        document.body.appendChild(weatherCard);

    }

    
    
}

fetchBtn.addEventListener("click", getCoordinates);

