var map;
import * as ajaxFunc from './modules/ajax_functions.js'
/* L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(map);

 */
function onLocationFound(e) {
    var radius = e.accuracy;
    console.log('lat:',e.latitude,'|long: ',e.longitude)
    L.marker(e.latlng).addTo(map)
        .bindPopup("You are here (ish)!").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

async function init(){
    //initialize leaflet map, set default view to be the whole world
    map = L.map("main-map").fitWorld()
    //initialize leaflet raster tile layer, using OSM free tiles
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ["a", "b", "c"],
    }).addTo(map);
    
    //get user location
    map.locate({setView: true, maxZoom: 16});
    
    //EventListeners for map:
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    
    //AJAX call to pull list of relevant spots
    try{
        let r = await ajaxFunc.getSpotList()
        console.log(r)
        
    }catch(err){
        console.log(err)
    }
    
}


init()