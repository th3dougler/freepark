let map = L.map("main-map").fitWorld();
let results;
//input ajax calls from module
import * as ajaxFunc from "./modules/ajax_functions.js";
//geosearch init
const provider = new GeoSearch.OpenStreetMapProvider();

document.addEventListener("DOMContentLoaded", init());

//event handler for when you try to find your own locationg
function onLocationFound(e) {
  var radius = e.accuracy;
  L.marker(e.latlng).addTo(map).bindPopup("You are here (ish)!").openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

async function onClick(e) {
  let resObject = await geosearch(`${e.latlng["lat"]}, ${e.latlng["lng"]}`);
  let addMarker = new L.marker(e.latlng)
    .addTo(map)
    .bindPopup(
      `Lat: ${e.latlng["lat"]} Lng: ${e.latlng["lng"]} Addr: ${
        Object.keys(resObject)[0]
      }`
    );

  let newSpot = {
    type: "Feature",
    properties: {
      name: Object.keys(resObject)[0],
      popupContent: `${Object.keys(resObject)[0]} <br/>
        <a href="#">Link To Detail?</a><br/>
        <a href="#">Link To Directions?</a><br/>`,
    },
    geometry: {
      type: "Point",
      coordinates: [e.latlng["lat"], e.latlng["lng"]],
    },
  };
  ajaxFunc.addSpot(newSpot);
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
async function geosearch(str) {
  try {
    //get geosearch results, pipe them into object sent to materialize autocomplete
    results = await provider.search({ query: str });
    let resObject = {};
    results.forEach((val, idx) => {
      resObject[val.label] = null;
    });
    return resObject;
  } catch (err) {
    console.log(err);
  }
}

/* perform geosearch, take parsed data and replace materialize autocomplete data object
    then open the autocomplete dropdown box
*/
async function updateAutocomplete(search) {
  let result = await geosearch(search.value);
  let instance = M.Autocomplete.getInstance(search);
  console.log(instance);
  instance.updateData(result);
  instance.open();
}

async function init() {
  //initialize leaflet map, set default view to be the whole world
  try {
    //set a half second timeout every time the user types, to avoid wasting
    //time on geo polling
    let search = document.getElementById("search");
    var elems = document.querySelectorAll(".autocomplete");
    var instances = M.Autocomplete.init(elems, { limit: 5, data: {} });

    let searchTimeout;
    search.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        updateAutocomplete(search);
      }, 300);
    });

    //initialize leaflet raster tile layer, using OSM free tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: ["a", "b", "c"],
    }).addTo(map);

    //get user location
    map.locate({ setView: true, maxZoom: 16 });

    //EventListeners for map:
    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);
    map.on("click", onClick);

    //AJAX call to pull list of relevant spots

    let r = await ajaxFunc.getSpotList();
    console.log(r);
  } catch (err) {
    console.log(err);
  }
}
