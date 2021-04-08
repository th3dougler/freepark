document.addEventListener('DOMContentLoaded', init);

var collapsibles;

function init() {
    var elems = document.querySelectorAll('.collapsible');
    let options= {}
    collapsibles = M.Collapsible.init(elems, options);
    elems = document.querySelectorAll('.fixed-action-btn');
    M.FloatingActionButton.init(elems, {
      hoverEnabled: false
    });
    elems = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(elems, options);
    elems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(elems, options);
  }
  
function openCollapsible(idx){
    collapsibles[0].open(idx)
    location.hash = "#"+idx.toString();
}