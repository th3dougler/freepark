var provider = new GeoSearch.OpenStreetMapProvider();
let results = [];
let isMapView = false;
document.addEventListener("DOMContentLoaded", init());


/* Performs geosearch, returns resObject which is a dictionary of the results
because it is the preferred format for Materialize Autocomplete object */
async function geosearch(str, getFirstOnly = false) {
    try {
      //get geosearch results, pipe them into object sent to materialize autocomplete
      results = await provider.search({ query: str });
      if(getFirstOnly){
        return results[0];
      }else{
        let resObject = {};
        let i = 0;
        while(i < 5 && i < results.length){
          resObject[results[i].label] = null;
          i++
        }
        return resObject;
      }
    } catch (err) {
      console.log(err);
    }
  }
  
/* Performs Materialize DOM manipulation of autocomplete data,
Does not do well with precise location data, due to sketchy fuzzy search logic
TO DO: rewrite autocomplete code from scratch, sell for profit
 */
async function updateAutocomplete(search) {
    let result = await geosearch(search.value);
    
    let instance = M.Autocomplete.getInstance(search);
    instance.updateData(result);
    instance.open();
  }

async function onSubmit(e){
  if(typeof e == 'object')
    e.preventDefault();
  let formData = new FormData(searchForm);
  let finalResult;
  for(let i = 0; i < results.length; i++){
    if(results[i].label == formData.get('search'))
      finalResult = results[i];
  }
  if (!finalResult){
    finalResult = await geosearch(formData.get('search'), true)
  }
  
  console.log(finalResult)
  if(isMapView){
    let map = document.getElementById('main-map')._leaflet_map
    map.panTo([finalResult.y, finalResult.x],{animate: true, duration: 1})
    console.log([finalResult.y, finalResult.x])
  }else{
    
  }
}
  
//get materialize dom object, add event listener to update autocomplete  
async function init(){
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {edge: 'right', passive: true})
    let search = document.getElementById("search");
    elems = document.querySelectorAll(".autocomplete");
    var instances = M.Autocomplete.init(elems, { limit: 5, data: {}, onAutocomplete: onSubmit });
    
    searchForm = document.getElementById('search-form');
    searchForm.onsubmit = (e)=>onSubmit(e);
    
    // check if map container exists, to determine if we are on the main map view or not
    // determines weather geosearch will redirect to map page or simply fly to location
    isMapView = (document.getElementById('map-container') !== null ) ? true: false;
    
    let searchTimeout;
        //set a half second timeout every time the user types, to avoid wasting
    //time on geo polling
    search.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        updateAutocomplete(search);
      }, 300);
    });
}