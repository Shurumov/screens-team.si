

function searchTerm() {
    var input, filter, search, item, a;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    search = document.getElementsByClassName("js-search");
    item = document.getElementsByClassName("js-show-hide");

    for (var i = 0; i < search.length; i++) {
        a = search[i];
        
        if(a.innerHTML.toUpperCase().indexOf(filter) == 0){
            item[i].style.display="";
            item[i].parentNode.childNodes[1].style.display="block";
            
        } else {
            item[i].style.display="none";
        };
    }
};



var list = document.getElementsByClassName("list-terms__elements")[0];
var modal = document.getElementsByClassName("list-terms__item-modal");
var item = document.getElementsByClassName("list-terms__item");
var title = document.getElementsByClassName("list-terms__item-title");
var subtitle = document.getElementsByClassName("list-terms__item-subtitle");
var close = document.getElementsByClassName("modal-close");

list.onclick = function(event){
    
    for (var i = 0; i < item.length; i++){
        if(event.target.parentNode == item[i] ){
        modal[i].style.display="block";
        }
    }
    
    
}


function closeModals(){
    for (var j = 0; j < close.length; j++){
        modal[j].style.display="none";
        
    }
}



window.onclick = function(event) {
    for (var i = 0; i < item.length; i++){
        if (event.target == modal[i] ){
            modal[i].style.display="none";
            break
        }
    }
}