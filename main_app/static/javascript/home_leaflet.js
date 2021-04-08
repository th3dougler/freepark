L.Map.addInitHook(function () {
  // Store a reference of the Leaflet map object on the map container,
  // so that it could be retrieved from DOM selection.
  // https://leafletjs.com/reference-1.3.4.html#map-getcontainer
  this.getContainer()._leaflet_map = this;
});
let map = L.map("main-map").fitWorld();
var myLayer = L.geoJSON([],{
    onEachFeature: (feature, layer)=>{
            layer.bindPopup(feature.properties.popupContent);
    }
    }).addTo(map);
let tempLayer = new L.LayerGroup();
let results;
//input ajax calls from module
import * as ajaxFunc from "./modules/ajax_functions.js";
//geosearch and autocomplete init


document.addEventListener("DOMContentLoaded", init());


var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//event handler for when you try to find your own locationg
function onLocationFound(e) {
  onClick(e)
}

function onLocationError(e) {
  alert(e.message);
}

async function onClick(e) {
  map.getContainer().classList.add("loading")
  tempLayer.clearLayers()
  
  let resObject = await geosearch(`${e.latlng["lat"]}, ${e.latlng["lng"]}`);
  
  let tempMarker = L.marker(e.latlng,{icon: greenIcon}).addTo(tempLayer)
    .bindPopup(`${Object.keys(resObject)[0]} <br/>
    <form action="/addspot/" method="GET">
    <input type="hidden" name="lat" value="${e.latlng["lat"]}">
    <input type="hidden" name="lon" value="${e.latlng["lng"]}">
    <input type="hidden" name="addr" value="${Object.keys(resObject)[0]}">
    <button class="btn blue lighten-3">Add Spot</button><br/>
    </form>
    <a href="#" class="btn-flat">Cancel</a><br/>`).openPopup()
    tempLayer.addTo(map)
    map.getContainer().classList.remove("loading")
}

/* whenever the user moves/zooms/otherwise does something to the map
fetch the list of spots within the confines of the boundaries of the map
populate the map with said spots
 */
async function onMoveEnd(e){
    let bounds = map.getBounds();
    let spotList = await ajaxFunc.getSpotList(bounds);
    myLayer.addData(spotList);
    
}

async function init() {
  //initialize leaflet map, set default view to be the whole world
  try {
    //set a half second timeout every time the user types, to avoid wasting
    //time on geo polling
    //initialize leaflet raster tile layer, using OSM free tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ["a", "b", "c"],
    }).addTo(map);
    
    //grab initial spot id, if being passed from a detail view
    let initSpot = JSON.parse(JSON.parse(document.getElementById('spot').textContent));
    
    if(initSpot === null)
      map.locate({ setView: true, maxZoom: 16 });
    else{
      let latlng = L.latLng(initSpot.geometry.coordinates[1],initSpot.geometry.coordinates[0]);
      map.setView(latlng, 15)
      onMoveEnd(null)
    }
    //EventListeners for map:
    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);
    map.on("moveend", onMoveEnd);
    map.on("click", onClick);

  } catch (err) {
    console.log(err);
  }
}
