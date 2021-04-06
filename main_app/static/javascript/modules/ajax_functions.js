/* get CSRF token for POST requests
    copied from django docs
    
*/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/* 
    This will be a function to get a list of spots from the db,
    I think we need to pass it lat/long, and what is visible to
    the user to reduce our search parameters to only spots which
     are relevant to the user
*/

export async function getSpotList() {
    try{
        
        let url = "/api/spotlist";
        let result = await fetch(url).then(res=>res.json());
        return result
        
    }catch(err){
        console.log(err)
    }
}

/* 
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
*/
export async function addSpot(newSpot) {
    try{
        let csrftoken = getCookie('csrftoken');
        let url = "/api/addspot";
        let options = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(newSpot) // body data type must match "Content-Type" header
          }
        let result = await fetch(url,options).then(res=>res.json());
        console.log(result)
        return result
        
    }catch(err){
        console.log(err)
    }
}