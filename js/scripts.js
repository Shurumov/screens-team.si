var termsListOriginal, termsListArray, session;

//Получаем json
axios.post('https://api.sbercode.appercode.com/v1/sbercode_ca/login', {
        "username": "admin",
        "password": "pa3m8ix5ew"
    })
    .then(function (response) {
        session = response.data.sessionId;
        getList();
    })
    .catch(function (error) {
        console.log(error);
    });

function getList() {
    axios({
            method: 'get',
            url: 'https://api.sbercode.appercode.com/v1/sbercode_ca/objects/Abbreviations',
            headers: {
                'X-Appercode-Session-Token': session
            }
        })
        .then(function (response) {

            termsListOriginal = response.data;
            createList();
            createLettersList()
        })
        .catch(function (error) {

            console.log(error);
        });
}

// Создание списка

var listTermsElements = document.getElementsByClassName('list-terms__elements')[0];

function createList() {
    //сортируем массив

    termsListArray = termsListOriginal.slice().sort(function (one, two) {
        if (one.title < two.title) return -1;
        if (one.title > two.title) return 1;
        return 0;
    });


    var groups = document.getElementsByClassName('list-terms__group');
    var groupTitle;
    termsListArray.forEach(function (item, i, termsListArray) {

        //создание группы и хедера 

        if (termsListArray[i].title.charAt(0) != groupTitle) {
            groupTitle = termsListArray[i].title.charAt(0);

            var group = document.createElement('div');
            group.className = "list-terms__group";
            listTermsElements.appendChild(group);

            var header = document.createElement('div');
            header.className = "list-terms__header-group";
            group.appendChild(header)

            var text = document.createElement('a');
            text.className = "js-group-header";
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
            itemSubtitle.innerHTML = stringTruncation(termsListArray[i].html, 30);
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
            itemModalTitle.innerHTML = stringTruncation(termsListArray[i].title, 25);
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
}

//Создание алфавита справа 

var listTerms = document.getElementsByClassName('list-terms')[0];

function createLettersList() {
    var Headers = document.getElementsByClassName("js-group-header");
    var groupHeaders = [];
    for (var i = 0; i < Headers.length; i++) {
        groupHeaders[i] = Headers[i].innerHTML;
    }

    var letterListWrapper = document.createElement('div');
    letterListWrapper.className = "list-terms__letter-list_wrapper";
    listTerms.appendChild(letterListWrapper);
    listTerms.insertBefore(letterListWrapper, listTerms.firstChild);

    var letterList = document.createElement('div');
    letterList.className = "list-terms__letter-list";
    letterListWrapper.appendChild(letterList);

    groupHeaders.forEach(function (item, i, groupHeaders) {
        var itemLettersList = document.createElement('div');
        itemLettersList.className = "list-terms__letter-list-item";
        itemLettersList.innerHTML = groupHeaders[i];
        letterList.appendChild(itemLettersList);
    });
}

//пролистывание списка при наведении на буквы

function goToHeader(event) {
    var target = event.target;
    var targetIndex;
    
    var Headers = document.getElementsByClassName("js-group-header");
    var groupHeaders = [];
    for (var i = 0; i < Headers.length; i++) {
        groupHeaders[i] = Headers[i].innerHTML;
    }

    if (target.classList.contains("list-terms__letter-list-item")) {
        targetIndex = groupHeaders.indexOf(target.innerHTML);
    }
    
    
}

listTerms.addEventListener("mouseover", goToHeader);

// Вспомогательные функции

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

function stringTruncation(str, maxLength) {
    if (str.length > maxLength) {
        return str.slice(0, maxLength - 3) + '...';
    }
    return str;
}

//Поиск и вильтрация из input

function searchTerm() {
    var input, filter, search, item, a;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    search = document.getElementsByClassName("js-search");
    item = document.getElementsByClassName("js-show-hide");

    for (var i = 0; i < search.length; i++) {
        a = search[i];

        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            item[i].classList.remove('list-terms__item_wrapper_disable');
            item[i].classList.add('list-terms__item_wrapper');


        } else {
            item[i].classList.add('list-terms__item_wrapper_disable');
            item[i].classList.remove('list-terms__item_wrapper');
            
        };
        
        item[i].parentNode.childNodes[0].classList.add('list-terms__header-group_disable');
        item[i].parentNode.childNodes[0].classList.remove('list-terms__header-group');
    }

    var activeTerms = document.getElementsByClassName("list-terms__item_wrapper");

    for (var j = 0; j < activeTerms.length; j++) {
         
        activeTerms[j].parentNode.childNodes[0].classList.remove('list-terms__header-group_disable');
        activeTerms[j].parentNode.childNodes[0].classList.add('list-terms__header-group');
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
