var provider = new GeoSearch.OpenStreetMapProvider();;
document.addEventListener("DOMContentLoaded", init());


/* Performs geosearch, returns resObject which is a dictionary of the results
because it is the preferred format for Materialize Autocomplete object */
async function geosearch(str) {
    try {
      //get geosearch results, pipe them into object sent to materialize autocomplete
      let results = await provider.search({ query: str });
      let resObject = {};
      results.forEach((val, idx) => {
        resObject[val.label] = null;
      });
      return resObject;
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
    console.log(instance);
    instance.updateData(result);
    instance.open();
  }
  
//get materialize dom object, add event listener to update autocomplete  
async function init(){
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {edge: 'right', passive: true})
    let search = document.getElementById("search");
    elems = document.querySelectorAll(".autocomplete");
    var instances = M.Autocomplete.init(elems, { limit: 5, data: {} });
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