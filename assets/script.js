// Weather API Endpoints
// There are four web service endpoints available:

// /timeline – provides continuous weather data from historical observations, weather forecast and future statistical forecast based on previous conditions.
// /forecast – provides access to up to 15-days of weather forecast information
// /history – provides access to hourly and daily historical weather records
// /historysummary – provides access to historical weather reports and processed information

// var weatherBaseURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/";
var weatherAppid = "&key=X2BCVEUMVC22RSDXLPE88U4YL";

var lat;
var long;
var launchDayTemp;
var launchDate = "2022-07-01";

var missions;
var missionsArray = [];
var previousLaunchRequestURL =
  "https://lldev.thespacedevs.com/2.2.0/launch/previous/";
var futureLaunchRequestURL =
  "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/";

function getPreviousLaunches() {
  fetch(previousLaunchRequestURL, {
    method: "GET", //GET is the default.
    credentials: "same-origin", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      missionsArray.push(JSON.stringify(data));
      missions = JSON.parse(missionsArray);
      console.log(missions);

      for (let i = 0; i < 5; i++) {
        lat = missions.results[i].pad.latitude;
        long = missions.results[i].pad.longitude;

        var item = document.createElement("li");
        var img = document.createElement("img");
        img.classList.add("shipImages");
        img.src = missions.results[i].image;
        var text = document.createTextNode(
          missions.results[i].name +
            " | " +
            missions.results[i].launch_service_provider.name +
            " | " +
            missions.results[i].window_start
        );
        item.appendChild(img);
        item.appendChild(text);
        item.setAttribute(
          "style",
          "list-style-type: none; text-decoration: none; text-align: left; margin-left: 20px;"
        );
        img.setAttribute("style", "margin-top: 5px;");
        document.getElementById("lastFiveLaunchesList").append(item);
      }
    });
}
getPreviousLaunches();

function getFutureLaunches() {
  fetch(futureLaunchRequestURL, {
    method: "GET", //GET is the default.
    credentials: "same-origin", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Future:");
      console.log(data);
      missions = data;
      for (let i = 0; i < 5; i++) {
        lat = missions.results[i].pad.latitude;
        long = missions.results[i].pad.longitude;

        var item = document.createElement("li");
        var img = document.createElement("img");
        img.classList.add("shipImages");
        img.src = missions.results[i].image;
        var text = document.createTextNode(
          missions.results[i].name +
            " | " +
            missions.results[i].launch_service_provider.name +
            " | " +
            missions.results[i].window_start
        );
        item.appendChild(img);
        item.appendChild(text);
        item.setAttribute(
          "style",
          "list-style-type: none; text-decoration: none; text-align: left; margin-left: 20px;"
        );
        img.setAttribute("style", "margin-top: 5px;");

        document.getElementById("nextFiveLaunchesList").append(item);
      }
    });
}
getFutureLaunches();

function weatherForecast() {
  var weatherBaseURL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat}%2C%20${long}/${launchDate}?unitGroup=us&include=days&key=X2BCVEUMVC22RSDXLPE88U4YL&contentType=json`;
  fetch(weatherBaseURL, {
    method: "GET", //GET is the default.
    credentials: "same-origin", // include, *same-origin, omit
    redirect: "follow", // manual, *follow, error
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var theWeather = data;
      launchDayTemp = data.days[0].temp;
      console.log("Weather:");
      console.log(launchDayTemp);
    });
}
function cityList() {}

function displayLaunches(response) {
  var results = response.data.results;
  var searchHTML = ``;

  for (i = 0; i < results.length; i++) {
    searchHTML += launchComponent(results[i]);
  }
  //searchHTML = searchHTML + `</span>`;

  document.querySelector("#searchresults").innerHTML = searchHTML;
}

function searchInfo() {
  var apiURL = "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/";
  axios.get(apiURL).then(displayLaunches);
}
//  var searchElement = document.querySelector("#searchresults");
//  searchElement.innerHTML = searchHTML;

// for ...
//    htmlText += launchComponent(array[i])
function launchComponent(launchInfo) {
  var searchHTML = `  
    <div class="row customCard">
      <div class="col s3">
        <img class="agencyImg" src="${launchInfo.image}" /> 
      </div>
      <div class="col s5">
        <p>Company:<span>${launchInfo.launch_service_provider.name}</span></p>
        <p>Name:<span>${launchInfo.name}</span></p>
        <p>Date:<span>${launchInfo.net}</span></p>
        <p>Location:<span>${launchInfo.pad.location.name}</span></p>  
      </div>
      <div class="col s3">
        <p>Weather:<span id="weather"></span></p>
      </div> 
      <div class="col s1">
        <a href="#" class="saveBtn"><i class="material-icons favoriteButtons">add</i></a>
      </div>  
    </div>`;
  return searchHTML;
}
