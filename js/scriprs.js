function debounce(f, ms) {
    var timer = null;
    return function (...args) {
        var onComplete = function () {
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
            item[i].classList.remove('disable');
            item[i].parentNode.childNodes[1].classList.remove('disable');

        } else {
            item[i].classList.add('disable');
        };
    }
};

var search = debounce(searchTerm, 500);

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
};

//Получаем json

var termsListOriginal, termsListArray;

var xhr = new XMLHttpRequest();
xhr.open('GET', 'terms-list.json', false);
xhr.onreadystatechange = function (e) {
    if (this.readyState == 4) {
        if (this.status == 200) {
            termsListOriginal = JSON.parse(this.responseText);
        } else {
            alert('Что-то пошло не так');
        }
    }
}
xhr.send();

//сортируем массив

termsListArray = termsListOriginal.slice().sort(function (one, two) {
    if (one.title < two.title) return -1;
    if (one.title > two.title) return 1;
    return 0;
});

var listTerms = document.getElementsByClassName('list-terms__elements')[0];
var groups = document.getElementsByClassName('list-terms__group');
var groupTitle;
termsListArray.forEach(function (itam, i, termsListArray) {

    if (termsListArray[i].title.charAt(0) != groupTitle) {
        groupTitle = termsListArray[i].title.charAt(0);

        var group = document.createElement('div');
        group.className = "list-terms__group";
        listTerms.appendChild(group);

        var header = document.createElement('div');
        header.className = "list-terms__header-group js-show-hide";
        group.appendChild(header)

        var text = document.createElement('a');
        text.className = "js-search";
        text.innerHTML = termsListArray[i].title.charAt(0);
        header.appendChild(text);
    }

    var itemWrapper = document.createElement('div');
    itemWrapper.className = "list-terms__item_wrapper js-show-hide";
    groups[groups.length - 1].appendChild(itemWrapper);

    var item = document.createElement('a');
    item.className = "list-terms__item";
    itemWrapper.appendChild(item);

    var itemTitle = document.createElement('div');
    itemTitle.className = "list-terms__item-title js-search";
    itemTitle.innerHTML = termsListArray[i].title;
    item.appendChild(itemTitle);

    var itemSubtitle = document.createElement('div');
    itemSubtitle.className = "list-terms__item-subtitle";
    itemSubtitle.innerHTML = stringTruncation(termsListArray[i].html);
    item.appendChild(itemSubtitle);

});

function stringTruncation(str) {
    if (str.length > 30) {
        return str.slice(0, 27) + '...';
    }
    return str;
}


//var listTermsGroup = document.createElement('div');
//listTermsGroup.className = "list-terms__group";
//listTermsGroup.innerHTML = termsListArray[0].title;
//listTerms.appendChild(listTermsGroup);
