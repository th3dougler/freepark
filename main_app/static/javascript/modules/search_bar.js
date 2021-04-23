import * as ajaxFunc from "./ajax_functions.js";
let results = [];
let isMapView = false;
let searchForm;
let map;
document.addEventListener("DOMContentLoaded", init());

/* Performs Materialize DOM manipulation of autocomplete data,
Does not do well with precise location data, due to sketchy fuzzy search logic
TO DO: rewrite autocomplete code from scratch, sell for profit
 */
async function updateAutocomplete(search) {
  results = await ajaxFunc.geoSearch("f", search.value);
  console.log("foo");
  let instance = M.Autocomplete.getInstance(search);
  instance.updateData(results);
  instance.open();
}

async function onSubmit(e) {
  if (typeof e == "object") e.preventDefault();

  document.body.classList.add("loading");

  let formData = new FormData(searchForm);
  let finalResult;
  for (let i = 0; i < results.length; i++) {
    if (results[i].label == formData.get("search"))
      finalResult = await ajaxFunc.geoSearch("f1", formData.get(results[i]));
  }
  if (!finalResult) {
    finalResult = await ajaxFunc.geoSearch("f1", formData.get("search"));
  }
  let lat = finalResult.geometry["lat"];
  let lon = finalResult.geometry["lng"];

  if (isMapView) {
    map.panTo([lat, lon], { animate: true, duration: 1 });
  } else {
    window.location.replace(`/latlng?lat=${lat}&lon=${lon}`);
  }
  document.body.classList.remove("loading");
}

//get materialize dom object, add event listener to update autocomplete
async function init() {
  console.log("init");
  isMapView = document.getElementById("map-container") !== null ? true : false;
  if (isMapView) map = document.getElementById("main-map")._leaflet_map;
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems, { edge: "right", passive: true });
  let search = document.getElementById("search");
  elems = document.querySelectorAll(".autocomplete");
  console.log("init");
  var instances = M.Autocomplete.init(elems, {
    limit: 5,
    data: {},
    onAutocomplete: onSubmit,
  });

  searchForm = document.getElementById("search-form");
  searchForm.onsubmit = (e) => onSubmit(e);

  // check if map container exists, to determine if we are on the main map view or not
  // determines weather geosearch will redirect to map page or simply fly to location

  let searchTimeout;
  console.log(isMapView);
  //set a half second timeout every time the user types, to avoid wasting
  //time on geo polling
  search.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      updateAutocomplete(search);
    }, 300);
  });
}
