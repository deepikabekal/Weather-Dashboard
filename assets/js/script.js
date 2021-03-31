var apiKey = "8534a9d4f88c86dec2955f7c2fa24a0f";
var apiUrl = `https://api.openweathermap.org/data/2.5/weather`
var currentDate = "";
var cityName = "";
var uvValue = "";

$("#search-btn").click(function(){
    
    cityName = $("#search-city").val().trim();
    

      fetch(apiUrl+`?q=${cityName}&appid=${apiKey}`)
          .then(function(response){
              response.json().then(function(data){
              console.log(data);
              geoCordinates(data);
              //currentWeather(data);
      })
  })


});





 