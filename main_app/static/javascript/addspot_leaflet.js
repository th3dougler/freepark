//pull data from template
const lat = JSON.parse(document.getElementById('lat').textContent);
const lon = JSON.parse(document.getElementById('lon').textContent);
const addr = JSON.parse(document.getElementById('addr').textContent);
const latLng = new L.LatLng(lat, lon);
let map = L.map("main-map-sm",{
  dragging: false,
  zoomControl: false
}).setView([lat,lon],50)
let tempMarker;
//input ajax calls from module
import * as ajaxFunc from "./modules/ajax_functions.js";
import * as searchBar from "./modules/search_bar.js";



document.addEventListener("DOMContentLoaded", init());

async function onClick(e) {
    if (tempMarker)
        map.removeLayer(tempMarker)
  let resObject = await searchBar.geosearch(`${e.latlng["lat"]}, ${e.latlng["lng"]}`);
  
  tempMarker = L.marker(e.latlng).addTo(map)
}

/* whenever the user moves/zooms/otherwise does something to the map
fetch the list of spots within the confines of the boundaries of the map
populate the map with said spots
 */
function onMoveEnd(e){
  let mapCenter = map.getCenter();
  if(mapCenter['lat'] != latLng['lat'] && mapCenter['lng'] != latLng['lng'] )
    map.panTo(latLng,{
      animate: true,
  });
}
/* req's leaflet-geosearch pkg (CDN in base.html)
    does a fuzzy search based on string provided to find a geographic location
    free use of OSM Api 
    Format: 
    results [{
            x: number; // lon
            y: number; // lat
            label: string; // formatted address
            bounds: [
                [number, number], // south, west - lat, lon
                [number, number], // north, east - lat, lon
            ];
            raw: any; // raw provider result
            }]
*/

async function init() {
  let latlng = new L.LatLng(lat,lon)
  console.log(map.getCenter())
  //initialize leaflet map, set default view to be the whole world
  try {
    //initialize leaflet raster tile layer, using OSM free tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ["a", "b", "c"],
    }).addTo(map);
    L.marker([lat,lon]).addTo(map)
    map.on("zoomend", onMoveEnd);

  } catch (err) {
    console.log(err);
  }
}