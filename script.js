var parameters = new URLSearchParams(window.location.search);
var city = (parameters.get("q")) ? parameters.get("q") : "New York";
var APIKey = "69466bb6e55e7142ed8c817a4a2917b9";

var searchURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIKey}`;
var search5URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;

var displayEl = document.querySelector("#display");
var currentWeatherEl = document.querySelector("#currentWeather");
var forecastEl = document.querySelector("#forecast");
var historyEl = document.querySelector("aside").querySelector("ul");

var today = moment().format("YYYY-MM-DD");

var searchHistory = (localStorage.getItem("searchHistory") != null) ? JSON.parse(localStorage.getItem("searchHistory")) : [];

if(parameters.get("q")){
    if(!searchHistory.includes(city)){
        searchHistory.unshift(city);
        if(searchHistory.length>8){
            searchHistory.pop();
        }
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

}

    //render searchHistory

for(let i=0;i<searchHistory.length;i++){
    console.log("tf")
    let liEl = document.createElement("li");
    liEl.innerHTML = `<a href="./index.html?q=${searchHistory[i]}"><button class="btn-primary btn col-10">${searchHistory[i]}</button></a>`;
    historyEl.append(liEl);
}    

function getWeather(url) {
    fetch(url)
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
        displayWeather(data);
    });
}

function getForecastWeather(url) {
    fetch(url)
    .then(function (response) {
        return response.json();
      })
    .then(function (data) {
        displayForecastWeather(data);
    });
}

function displayWeather(data) {
    currentWeatherEl.querySelector("h2").innerHTML = `${data.name} ${moment().format("M/D/YYYY")} <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>` ;

    let dataQueue = [`Temp: ${data.main.temp}°F`, `Wind: ${data.wind.speed}MPH`, `Humidity: ${data.main.humidity}%`, `UV Index: ${data.main.humidity}%`]

    for(let i=0;i<currentWeatherEl.querySelector("ul").children.length; i++){
        let liEl = currentWeatherEl.querySelector("ul").children[i];
        liEl.textContent = dataQueue[i];
    }
}

function displayForecastWeather(data) {
    let list = data.list;
    let cards = forecastEl.querySelectorAll(".forecastCard");

    let fCastDay = moment(today).add(1, 'days').format("YYYY-MM-DD");

    for(let x=0;x<cards.length; x++){
        for(let y=0;y<list.length; y++){
            if(list[y].dt_txt==`${fCastDay} 15:00:00`){
                cards[x].children[0].textContent = moment(fCastDay).format("M/DD/YY");
                console.log(list[y])
                let dataQueue = [`<img src="http://openweathermap.org/img/wn/${list[y].weather[0].icon}@2x.png" style="width:3em; height:auto;"/>`, `Temp: ${list[y].main.temp}°F`, `Wind: ${list[y].wind.speed}MPH`, `Humidity: ${list[y].main.humidity}%`]

                for(let i=0;i<cards[x].children[1].children.length;i++){
                    let liEl = cards[x].children[1].children[i];
                    liEl.innerHTML = dataQueue[i];

                }
                
            
            }
        }
        fCastDay = moment(fCastDay).add(1, 'days').format("YYYY-MM-DD");
    }
}

getWeather(searchURL);
getForecastWeather(search5URL);