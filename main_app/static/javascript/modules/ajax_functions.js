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