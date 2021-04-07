document.addEventListener('DOMContentLoaded', init);
var collapsibles;
let favorites = false, spots = false, comments = false;

function init() {
    var elems = document.querySelectorAll('.collapsible');
    let options= {}
    collapsibles = M.Collapsible.init(elems, options);
  }
  
function openCollapsible(idx){
    console.log(collapsibles[idx])
    collapsibles[0].open(idx)
}