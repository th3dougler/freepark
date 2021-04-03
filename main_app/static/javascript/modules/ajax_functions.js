export async function getSpotList() {
    try{
        let url = "/api/spotlist";
        let result = await fetch(url).then(res=>res.json());
        return result
        
    }catch(err){
        console.log(err)
    }
}