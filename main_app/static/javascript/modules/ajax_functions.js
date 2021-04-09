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

export async function getSpotList(bounds) {
    try{
        let lat1 = bounds['_northEast']['lat']
        let lon1 = bounds['_northEast']['lng']
        let lat2 = bounds['_southWest']['lat']
        let lon2 = bounds['_southWest']['lng']
        
        let url = `/api/spotlist?lat1=${lat1}&lat2=${lat2}&lon1=${lon1}&lon2=${lon2}`;
        let visibleSpots = await fetch(url).then(res=>res.json());
        return visibleSpots
        
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
        
        return result
        
    }catch(err){
        console.log(err)
    }
}

//geosearch shot caller:
//dir refers to weather it is a 'f'orward geosearch or 'r'everse
//for our purposes, forward geosearch returns just the most relevant item in great detail
//the reverse lookup is for autocomplete, and thus pulls a list of relevant items formatted for
//materialize autocomplete
export async function geoSearch(dir) {
    try{
        let url = ""
        if(dir === 'r'){
            url = `/api/geosearch/${dir}?lat=${arguments[1]}&lon=${arguments[2]}`;
        }else if(dir === 'f'){
            url = `/api/geosearch/${dir}?str=${arguments[1]}`;
        }else if(dir === 'f1'){
            url = `/api/geosearch/r?str=${arguments[1]}`;
        }else{
            return
        }
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
          }
        let result = await fetch(url,options).then(res=>res.json());
        let formattedResult = {}
        if(dir === 'f'){
            let i = 0;
            while(i < 5 && i < result.length){   
                formattedResult[result[i].formatted] = null;
                i++
            }
        }else{
            formattedResult = result[0]
        }
            
        
        return formattedResult
        
    }catch(err){
        console.log(err)
    }
}
