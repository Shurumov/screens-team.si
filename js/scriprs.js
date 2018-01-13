
function searchTerm() {
    var input, filter, title, item, a;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    title = document.getElementsByClassName("list-terms__item-title");
    item = document.getElementsByClassName("list-terms__item");

    for (var i = 0; i < title.length; i++) {
        a = title[i];
        
        if(a.innerHTML.toUpperCase().indexOf(filter) > -1){
            item[i].style.display="";
        } else {
            item[i].style.display="none";
        }
    }
};

var modal = document.getElementsByClassName("list-terms__item-modal");
var item = document.getElementsByClassName("list-terms__item");
var close = document.getElementsByClassName("modal-close");


item[0].onclick = function() {  
    modal[0].style.display="block";
}

close[0].onclick = function(event) {
    modal[0].style.display="none";
    
}


window.onclick = function(event) {
    if (event.target == modal[0] ){
        modal[0].style.display="none";
    }
}