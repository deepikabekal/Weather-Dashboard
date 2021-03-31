var apiKey = "9734ad0baca8a3d2db8c9b1ab54c7751";
var apiUrl = `https://api.openweathermap.org/data/2.5/weather`
var units = "metric";
var currentDate = "";
var cityName = "";
var uvValue = "";

$("#search-btn").click(function(){
    
    cityName = $("#search-city").val().trim();
    currentWeather(cityName);

});

function currentWeather(city){
    
    fetch(apiUrl+`?q=${city}&units=${units}&appid=${apiKey}`)
            .then(function(response){
             return response.json()
            }) 
            .then(function(data){
              console.log(data);
              getWeatherDetails(data);
            })

}

function getWeatherDetails(info){
    
    $(".current-weather").append(
        `
        <p>Date: ${currentDate} </p>        
        <p>Temperature: ${info.main.temp}&#8457</p>
        <p>Humidity: ${info.main.humidity} %</p>
        <p>Wind Speed: ${info.wind.speed} MPH</p>
       

        `
    )
}

 