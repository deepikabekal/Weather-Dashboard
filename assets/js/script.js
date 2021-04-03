var apiKey = "9734ad0baca8a3d2db8c9b1ab54c7751"; //apikey
var apiUrl = `https://api.openweathermap.org/data/2.5/weather` //api url
var units = "metric"; // to get the data in desired unit 
var saveWeather = []; //array to save the searched city and its geo coordinates.

//search button click
$("#search-btn").click(function(){
    $(".current-weather").empty();
    $(".forecast-container").empty();
    $(".search-history").empty();
    $("#error-display").empty();
    var cName = $("#search-city").val().trim();
    var cityName = cName[0].toUpperCase()+cName.slice(1,cName.length).toLowerCase();
    console.log(cityName);
    currentWeather(cityName);

});

//function to create an api call to get city name.
function currentWeather(city){
    
    fetch(apiUrl+`?q=${city}&units=${units}&appid=${apiKey}`)
            .then(function(response){
             return response.json()
            }) 
            .then(function(data){
              console.log(data);
              geoCordinates(city,data);
            })
            .catch (function (error){
                $("#error-display").text("Sorry! There is no data for the city you entered. Please try again with a different city name.");
            })

}

//function to create an api call to get the weather datails
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
            fiveDayForecast(cityN,data);
            searchHistory(cityN,latitude,longitude);
        })
         .catch (function(error){
            $("#error-display").text("Something went wrong. Refresh your page and try again");
         })


}


//display current weather conditions
function getWeatherDetails(city,info){
    //get the unix time stamp from the api data and convert it date format
    var unixTimeStamp = info.current.dt;
    // var fullDate = new Date(unixTimeStamp*1000)
    // var currentDate = dayjs(fullDate).format("DD/MM/YYYY") ;
    var currentDate = dayjs.unix(unixTimeStamp).format("DD/MM/YYYY")
    console.log(currentDate);

    //get the uv index value
    var uvIndex = info.current.uvi;

    //create a div to display city name and icon
    $(".current-weather").append(
        `
        <div class="row name-image"></div>
        `
    )
    
    $(".name-image").append(
        `
        <h4>${city}</h4>
        <img src=http://openweathermap.org/img/wn/${info.current.weather[0].icon}@2x.png>
        `
    )
    
    //display the other weather details on the page
    $(".current-weather").append(
        `
        <p>Date: ${currentDate} </p>        
        <p>Temperature: ${info.current.temp}&#8451</p>
        <p>Humidity: ${info.current.humidity}%</p>
        <p>Wind Speed: ${info.current.wind_speed} MPH</p>
        <p>UV Index: <span id="uv-color">${uvIndex}</span><p>
        `
    )   
    //call the function to display the color the uv index
    uvIndexColor(uvIndex);
}


//color the uv index based on the weather conditions
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

//function to display the 5 day weather forecast
function fiveDayForecast(city, info){
   //get and display the weather data for a 5 day period
    for(var i=1;i<6;i++){
        
        var unixTime = info.daily[i].dt; //get the unix time stamp from the api data
        var dailyDate = dayjs.unix(unixTime).format("DD/MM/YYYY"); //change the unix time stamp to date format
        console.log(dailyDate);
        var dailyIcon = info.daily[i].weather[0].icon;//get the waether condition icon
        var dailyTemp = info.daily[i].temp.day; //get the temperature of the day
        var dailyHumidity = info.daily[i].humidity; //get the humidity of the day

        //create container for each day and append to the main container
        $(".forecast-container").append(
            `
            <div class="col-sm-2 daily-container ${i}"></div>
                       
            `
        )
        //display the stored weather data
        $(`.${i}`).append(
            `
            <h6>${dailyDate}</h6>
            <img src=http://openweathermap.org/img/wn/${dailyIcon}@2x.png>
            <p>Temp: ${dailyTemp}</p>
            <p>Humidity: ${dailyHumidity} 
            `
        )
    }
}

function searchHistory(city,lat,lon){
    
    //console.log("hello");
    //get the stored values
    saveWeather = JSON.parse(localStorage.getItem("weatherDashboard"))||[];
    console.log("save weather",saveWeather);

    //save the data in object variable
    var savedObject = {cityName:city, latitude:lat, longitude:lon};
    console.log("savedobject", savedObject);   
    
    //check if the city already exists. If yes then remove it from the array
    if(saveWeather!==[]){
        for (var i=0;i<saveWeather.length;i++){
            if (city.toLowerCase()===saveWeather[i].cityName.toLowerCase()){
                
                saveWeather.splice(i,1);
            }
        }

    }
    
    
    //push the object to the array
    saveWeather.push(savedObject);
    console.log("last save weather",saveWeather);

    //save the array in local storage
    localStorage.setItem("weatherDashboard",JSON.stringify(saveWeather));
    
    displaySearchCity(saveWeather);
    
}

//display each city name
function displaySearchCity(savedData){
    //saveWeather = JSON.parse(localStorage.getItem("weatherDashboard"))||[];
    //debugger;
    
    for(var i=0;i<savedData.length;i++){
        $(".search-history").append(
            `
            <button>${savedData[i].cityName}</button>
            `
        )

    }
    
}

//event listener to get the name of the city of the button clicked and then display the weather info
$(".search-history").on("click", "button", function(){
    $(".current-weather").empty();
    $(".forecast-container").empty();
    $(".search-history").empty();
    $("#error-display").empty();
    $("#search-city").val("");
    var savedCity = $(this).text().trim();
    console.log("clicked city= ",savedCity);
    currentWeather(savedCity);
});

$("#clear-btn").click(function(){
    $(".search-history").empty();
    $("#error-display").empty();
    $("#search-city").val("");
    localStorage.clear();
})