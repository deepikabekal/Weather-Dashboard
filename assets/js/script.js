var apiKey = "9734ad0baca8a3d2db8c9b1ab54c7751";
var apiUrl = `https://api.openweathermap.org/data/2.5/weather`
var units = "metric";
var currentDate = "";
var cityName = "";
var uvValue = "";

//search button click
$("#search-btn").click(function(){
    $(".current-weather").empty();
    cityName = $("#search-city").val().trim();
    currentWeather(cityName);

});

//current weather conditions API call
function currentWeather(city){
    
    fetch(apiUrl+`?q=${city}&units=${units}&appid=${apiKey}`)
            .then(function(response){
             return response.json()
            }) 
            .then(function(data){
              console.log(data);
              geoCordinates(city,data);
            })

}


//display current weather conditions
function getWeatherDetails(city,cInfo,gInfo){
    var cityDate = gInfo.date_iso;
    console.log(cityDate);
    currentDate = cityDate.split("T")[0];
    console.log(currentDate);
    var uvIndex = gInfo.value;

    $(".current-weather").append(
        `
        <div class="row name-image"></div>
        `
    )
    
    $(".name-image").append(
        `
        <h3>${cityName}</h3>
        <img src=http://openweathermap.org/img/wn/${cInfo.weather[0].icon}@2x.png>
        `
    )
    
    $(".current-weather").append(
        `
        <p>Date: ${currentDate} </p>        
        <p>Temperature: ${cInfo.main.temp}&#8457</p>
        <p>Humidity: ${cInfo.main.humidity} %</p>
        <p>Wind Speed: ${cInfo.wind.speed} MPH</p>
        <p>UV Index: <span id="uv-color">${uvIndex}</span><p>
        `
    )
        uvIndexColor(uvIndex);
}

function geoCordinates(cityN,cData){
    console.log(cityN);
    var latitude = cData.coord.lat;
    var longitude = cData.coord.lon;
    var api = `http://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${apiKey}`

    fetch(api).then(function(response){
        return response.json()
        })
        .then(function(data){
            console.log("uv",data);
            getWeatherDetails(cityN,cData,data);
        })


}

function uvIndexColor(index){
    console.log("index",index);
    if (index>=0 && index<=3){
        $("#uv-color").attr("class","favourable");
    } else if (index>3 &&  index <=7){
        $("#uv-color").attr("class","moderate")
    } else {
        $("#uv-color").attr("class","severe")

    }
}