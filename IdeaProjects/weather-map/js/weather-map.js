"use strict";


// decided to make these global variables to easily access
var longitude = -95.37111551036642;
var latitude = 29.76325090045542;
var userInput = $('#userInput');
weatherInfo();


// -------------------Declaring Map--------------------------
mapboxgl.accessToken = MAPBOX_API_TOKEN;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 9,
    center: [longitude, latitude],
});


// Adding draggable marker
var marker = new mapboxgl.Marker({draggable: true})
    .setLngLat([longitude, latitude])
    .addTo(map);

marker.on('dragend', onDragEnd)

// Adding functionality to marker?
function onDragEnd(e) {
    console.log(e)
    longitude = e.target._lngLat.lng;
    latitude = e.target._lngLat.lat;
    reverseGeocode({lng: longitude, lat: latitude}, MAPBOX_API_TOKEN).then(function(result) {
        console.log(result);
        weatherInfo(result);
        $('#currentCity').html(result);
    });
}




// --------------Weather Map API DATA (Houston)----------------
function weatherInfo() {
    $.get('https://api.openweathermap.org/data/2.5/onecall', {
        appid: WEATHER_MAP_KEY,
        lat: latitude,
        lon: longitude,
        units: 'imperial',
        exclude: 'minutely,hourly'
    }).done(function(data) {
        console.log(data);
        displayInfo(data);
    });
}


function displayInfo(data) {
    var html = "";
    for (var i = 0; i < 5; i++) {
        // var date = data.daily[i].dt;
        // var actualDate = new Date(date * 1000);
        let date = new Date(data.daily[i].dt * 1000).toLocaleDateString();
        var wind = windCardinalDirection(data.daily[i].wind_deg);
        html += "<div class='card'>"
        html += '<div class="card-header">' + date + '</div>'
        html += '<ul class="list-group">'
        html += '<li class="list-group-item">' + data.daily[i].temp.min + ' °F' + ' / ' + data.daily[i].temp.max + ' °F' + '</li>'
        html += '<li class="list-group-item">' + 'Description: ' + data.daily[i].weather[0].description + '</li>'
        html += '<li class="list-group-item">' + 'Humidity: ' + data.daily[i].humidity + '</li>'
        html += '<li class="list-group-item">' + 'Wind: ' + data.daily[i].wind_speed + ' ' + wind + '</li>'
        html += '<li class="list-group-item">' + 'Pressure: ' + data.daily[i].pressure + '</li>'
        html += '</div>'
    }
    $('#weatherCards').html(html);
}


function windCardinalDirection(degrees){
    let cardinalDirection = '';
    if ((degrees > 348.75 && degrees <= 360) || (degrees >=0 && degrees <= 11.25)){
        cardinalDirection = "N";
    } else if (degrees > 11.25 && degrees  <= 33.75) {
        cardinalDirection = "NNE";
    } else if (degrees > 33.75 && degrees <= 56.25) {
        cardinalDirection = "NE";
    } else if (degrees > 56.25 && degrees <= 78.75) {
        cardinalDirection = "ENE";
    } else if (degrees > 78.75 && degrees <= 101.25) {
        cardinalDirection = "E";
    } else if (degrees > 101.25 && degrees <= 123.75) {
        cardinalDirection = "ESE";
    } else if (degrees > 123.75 && degrees <= 146.25) {
        cardinalDirection = "SE";
    } else if (degrees > 146.25 && degrees <= 168.75) {
        cardinalDirection = "SSE";
    } else if (degrees > 168.75 && degrees <= 191.25) {
        cardinalDirection = "S";
    } else  if (degrees > 191.25 && degrees <= 213.75) {
        cardinalDirection = "SSW";
    } else if (degrees > 213.75 && degrees <= 236.25)  {
        cardinalDirection = "SW";
    } else if (degrees > 236.25 && degrees <= 258.75) {
        cardinalDirection = "WSW";
    } else if (degrees > 258.75 && degrees <= 281.25) {
        cardinalDirection = "W";
    } else if (degrees > 281.25 && degrees <= 303.75) {
        cardinalDirection = "WNW";
    } else if (degrees > 303.75 && degrees <= 326.25) {
        cardinalDirection = "NW";
    } else if (degrees > 326.75 && degrees <= 348.75) {
        cardinalDirection = "NNW";
    }
    return cardinalDirection;
}


//---------------Searching by Geocode------------------
$('#button').click(function(e) {
    e.preventDefault();
    searchInput();
});


function searchInput() {
    geocode(userInput.val(), MAPBOX_API_TOKEN).then(function (result) {
        console.log(result);
        longitude = result[0];
        latitude = result[1];
        var marker = new mapboxgl.Marker({draggable: true})
            .setLngLat([longitude, latitude])
            .addTo(map);
        marker.on('dragend', onDragEnd);
        $('#currentCity').html(userInput.val());
        map.flyTo({
            center: [longitude, latitude],
            zoom: 9
        });

        weatherInfo();
    });

}