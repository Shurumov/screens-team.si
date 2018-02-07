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

    //создание группы и хедера 

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

    // создание блоков терминов

    if (termsListArray[i].title && termsListArray[i].html) {

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

        //Модальное окно

        var itemModal = document.createElement('div');
        itemModal.className = "list-terms__item-modal";
        itemWrapper.appendChild(itemModal);

        var itemContent = document.createElement('div');
        itemContent.className = "list-terms__item-modal-content";
        itemModal.appendChild(itemContent);

        //Хедер модального окна

        var itemModalTop = document.createElement('div');
        itemModalTop.className = "list-terms__item-modal-top";
        itemContent.appendChild(itemModalTop);

        var itemModalTitle = document.createElement('div');
        itemModalTitle.className = "list-terms__item-modal-title";
        itemModalTitle.innerHTML = termsListArray[i].title;
        itemModalTop.appendChild(itemModalTitle);

        var itemModalClose = document.createElement('a');
        itemModalClose.className = "modal-close";
        itemModalClose.innerHTML = "<img src=img/close.svg >";
        itemModalTitle.appendChild(itemModalClose);

        //Середина модального окна

        var itemModalMiddle = document.createElement('div');
        itemModalMiddle.className = "list-terms__item-modal-middle";
        itemModalMiddle.innerHTML = termsListArray[i].html;
        itemContent.appendChild(itemModalMiddle);

        //Футтер модального окна

        var itemModalBottom = document.createElement('div');
        itemModalBottom.className = "list-terms__item-modal-bottom";
        itemContent.appendChild(itemModalBottom);

        var itemModalBottomText = document.createElement('div');
        itemModalBottomText.className = "list-terms__item-modal-bottom-text";
        itemModalBottomText.innerHTML = "<div class=prev><img class=arrow src=img/arrow.svg></div>В избранное<div class=next><img class=arrow src=img/arrow.svg ></div>";
        itemModalBottom.appendChild(itemModalBottomText);

    }
});

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

function stringTruncation(str) {
    if (str.length > 30) {
        return str.slice(0, 27) + '...';
    }
    return str;
}

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
            item[i].parentNode.childNodes[0].classList.remove('disable');

        } else {
            item[i].classList.add('disable');
        };
    }
};

var search = debounce(searchTerm, 500);

var list = document.getElementsByClassName("list-terms__elements")[0];

function OpenModal(event) {
    var target = event.target;
    
    if (target.parentNode.classList.contains("modal-close") || target.classList.contains("modal-close")) {
        return
    }

    while (!target.classList.contains("list-terms__item")) {
        if (target.classList.contains("list-terms__item") || target.tagName == "p") {
            break;
        }
        target = target.parentNode;
    };

    if (target.classList.contains("list-terms__item")) {
        target.parentNode.childNodes[1].style.display = "block";
    }
}

function CloseModal(event) {
    var target = event.target;

    if (target.parentNode.classList.contains("modal-close") || target.classList.contains("modal-close")) {
        target.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
    }

    if (target.classList.contains("list-terms__item-modal")) {
        target.style.display = "none";
    }
};

list.addEventListener("click", CloseModal);
list.addEventListener("click", OpenModal);