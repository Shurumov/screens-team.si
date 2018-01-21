function debounce(f, ms) {
    var timer = null;
    return function (...args) {
        var onComplete = function() {
            f.apply(this, args);
            timer = null;
        }
        
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(onComplete, ms);
    };
};

function searchTerm() {
    var input, filter, search, item, a;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    search = document.getElementsByClassName("js-search");
    item = document.getElementsByClassName("js-show-hide");

    for (var i = 0; i < search.length; i++) {
        a = search[i];

        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            item[i].style.display = "block";
            item[i].parentNode.childNodes[1].style.display = "block";

        } else {
            item[i].style.display = "none";
        };
    }
};

var search = debounce(searchTerm,500);

var list = document.getElementsByClassName("list-terms__elements")[0];

list.onclick = function (event) {
    if (event.target.parentNode.classList.contains("list-terms__item")) {
        event.target.parentNode.parentNode.childNodes[3].style.display = "block";
    }

    if (event.target.parentNode.classList.contains("modal-close") || event.target.classList.contains("modal-close")) {
        event.target.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
    }

    if (event.target.classList.contains("modal-close")) {
        event.target.style.display = "none";
    }
}
