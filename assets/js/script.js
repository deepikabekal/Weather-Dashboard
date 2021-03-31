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

function geoCordinates(cityN,currentData){
    console.log(cityN);
    var latitude = currentData.coord.lat;
    var longitude = currentData.coord.lon;
    var api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${units}&exclude=minutely,hourly&appid=${apiKey}`

    fetch(api).then(function(response){
        return response.json()
        })
        .then(function(data){
            console.log("uv",data);
            getWeatherDetails(cityN,data);
        })


}


//display current weather conditions
function getWeatherDetails(city,info){
    var unixTimeStamp = info.current.dt;
    var fullDate = new Date(unixTimeStamp*1000)
    var currentDate = dayjs(fullDate).format("DD/MM/YYYY") ;
    console.log(currentDate);
    var uvIndex = info.current.uvi;

    $(".current-weather").append(
        `
        <div class="row name-image"></div>
        `
    )
    
    $(".name-image").append(
        `
        <h3>${city}</h3>
        <img src=http://openweathermap.org/img/wn/${info.current.weather[0].icon}@2x.png>
        `
    )
    
    $(".current-weather").append(
        `
        <p>Date: ${currentDate} </p>        
        <p>Temperature: ${info.current.temp}&#8457</p>
        <p>Humidity: ${info.current.humidity} %</p>
        <p>Wind Speed: ${info.current.wind_speed} MPH</p>
        <p>UV Index: <span id="uv-color">${uvIndex}</span><p>
        `
    )
        uvIndexColor(uvIndex);
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

