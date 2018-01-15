
function searchTerm() {
    var input, filter, title, item, a;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    title = document.getElementsByClassName("list-terms__item-title");
    item = document.getElementsByClassName("list-terms__item_wrapper");

    for (var i = 0; i < title.length; i++) {
        a = title[i];
        
        if(a.innerHTML.toUpperCase().indexOf(filter) > -1){
            item[i].style.display="";
        } else {
            item[i].style.display="none";
        }
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
        if(event.target == item[i] ){
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
        }
    }
}