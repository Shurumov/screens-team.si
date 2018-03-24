var termsListOriginal, termsListArray, termsListArrayIDs = [],
    favoriteArray = [],
    favoriteArrayIDs, session;

startLoadingAnimation();

//Получаем json
axios.post('https://api.sbercode.appercode.com/v1/sbercode_ca/login', {
        "username": "abbreviations",
        "password": "gth7596"
    })
    .then(function (response) {
        session = response.data.sessionId;
        getFavorite();

    })

    .catch(function (error) {
        console.log(error);
    });





function getFavorite() {

    axios({
            method: 'get',
            url: 'https://api.sbercode.appercode.com/v1/sbercode_ca/favorites/Abbreviations',
            headers: {
                'X-Appercode-Session-Token': session
            }
        })
        .then(response => {

            favoriteArrayIDs = response.data;

            return favoriteArrayIDs
        })
        .then(favoriteArrayIDs => {

            favoriteArrayIDs.forEach(function (item, i, arr) {
                axios({
                        method: 'get',
                        url: 'https://api.sbercode.appercode.com/v1/sbercode_ca/objects/Abbreviations/' + item,
                        headers: {
                            'X-Appercode-Session-Token': session
                        }
                    })
                    .then(response => {

                        favoriteArray.push(response.data);

                        if (favoriteArray.length == favoriteArrayIDs.length) {
                            createList();

                            
                            var screenHeight = screen.height,
                                alphabetHeight = document.getElementsByClassName("list-terms__letter-list")[0].offsetHeight;

                            if ((screenHeight*0.8) < alphabetHeight) {
                                document.getElementsByClassName("list-terms__letter-list")[0].remove();
                            }

                            hideArrow();
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            })


        })
        .catch(function (error) {

            console.log(error);
        });

}


// Создание списка

var listTermsElements = document.getElementsByClassName('list-terms__elements')[0];

function createList() {
    
    var letterWidth = getTextWidth("a", "normal 13px sans-serif");
    var lineWidth = screen.width;
    
    var lettersQuantity = Math.round(lineWidth / letterWidth);


    favoriteArray = favoriteArray.slice().sort(function (one, two) {
        if (one.title < two.title) return -1;
        if (one.title > two.title) return 1;
        return 0;
    });



    var groups = document.getElementsByClassName('list-terms__group');
    var groupTitle;
    favoriteArray.forEach(function (item, i, favoriteArray) {

        //создание группы и хедера 

        if (favoriteArray[i].title.charAt(0) != groupTitle) {
            groupTitle = favoriteArray[i].title.charAt(0);

            var group = document.createElement('div');
            group.className = "list-terms__group";
            listTermsElements.appendChild(group);

            var header = document.createElement('div');
            header.className = "list-terms__header-group";
            group.appendChild(header)

            var text = document.createElement('a');
            text.className = "js-group-header";
            text.innerHTML = favoriteArray[i].title.charAt(0);
            header.appendChild(text);
        }

        // создание блоков терминов

        if (favoriteArray[i].title && favoriteArray[i].html) {
            var itemWrapper = document.createElement('div');
            itemWrapper.className = "list-terms__item_wrapper js-show-hide";
            groups[groups.length - 1].appendChild(itemWrapper);

            var item = document.createElement('a');
            item.className = "list-terms__item";
            item.setAttribute("data-title", favoriteArray[i].title);
            item.setAttribute("data-description", favoriteArray[i].html);
            item.setAttribute("data-favorite", "true");
            item.setAttribute("data-id", favoriteArray[i].id);
            itemWrapper.appendChild(item);

            var itemTitle = document.createElement('div');
            itemTitle.className = "list-terms__item-title js-search";
            itemTitle.innerHTML = favoriteArray[i].title;
            item.appendChild(itemTitle);

            var itemSubtitle = document.createElement('div');
            itemSubtitle.className = "list-terms__item-subtitle";
            itemSubtitle.innerHTML = stringTruncation(favoriteArray[i].html, lettersQuantity);
            item.appendChild(itemSubtitle);
        }
    });
    
    stopLoadingAnimation();
}



var listTerms = document.getElementsByClassName('list-terms')[0];



// Удаление и добавленеи стрелок в первом и последнем модальном окне

function hideArrow() {
    var firstArrow = document.getElementsByClassName("list-terms__item_wrapper")[0].firstChild;
    firstArrow.setAttribute("data-first_item", "true");


    var lastArrowArray = document.getElementsByClassName("list-terms__item_wrapper");
    var lastArrow = lastArrowArray[lastArrowArray.length - 1].firstChild;
    lastArrow.setAttribute("data-last_item", "true");

}

function showArrow() {
    var firstArrow = document.getElementsByClassName("list-terms__item")[0];

    firstArrow.removeAttribute("data-first_item");

    var lastArrowArray = document.getElementsByClassName("list-terms__item");
    var lastArrow = lastArrowArray[lastArrowArray.length - 1];
    lastArrow.removeAttribute("data-last_item");

}

//пролистывание списка при наведении на буквы

var toHeader = debounce(goToHeader, 100);

function goToHeader(event) {
    var target = event.target;
    var targetIndex;

    var Headers = document.getElementsByClassName("list-terms__header-group");
    var groupHeaders = [];
    for (var i = 0; i < Headers.length; i++) {
        groupHeaders[i] = Headers[i].firstChild.innerHTML;
    }

    if (target.classList.contains("list-terms__letter-list-item")) {
        targetIndex = groupHeaders.indexOf(target.innerHTML);

    }

    var scroll_el = $('.list-terms__header-group')[targetIndex];
    if ($(scroll_el).length != 0) {
        $('html, body').animate({
            scrollTop: $(scroll_el).offset().top
        }, 100);
    }
    return false;
}

listTerms.addEventListener("mouseover", toHeader);

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

// функция запускающая анимацию

function startLoadingAnimation() 
{
  
  var imgObj = $("#loadImg");
  imgObj.show();
 
  var centerY = $(window).scrollTop() + ($(window).height() + imgObj.height())/2;
  var centerX = $(window).scrollLeft() + ($(window).width() + imgObj.width())/2;

  imgObj.offset({top:centerY,left:centerX});
};

// функция останавливающая анимацию

function stopLoadingAnimation() 
{
  $("#loadImg").hide();
}

// ширина строки

function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

//Поиск и фильтрация из input

function searchTerm() {
    showArrow();

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


    hideArrow();
    stopLoadingAnimation();

};

var search = debounce(searchTerm, 500);

var list = document.getElementsByClassName("list-terms__elements")[0];

function CreateModal(title, description, id, target, favorite, first, last) {

    //Модальное окно

    var itemModal = document.createElement('div');
    itemModal.className = "list-terms__item-modal";
    target.appendChild(itemModal);

    var itemContent = document.createElement('div');
    itemContent.className = "list-terms__item-modal-content";
    itemModal.appendChild(itemContent);

    //Хедер модального окна

    var itemModalTop = document.createElement('div');
    itemModalTop.className = "list-terms__item-modal-top";
    itemContent.appendChild(itemModalTop);

    var itemModalTitle = document.createElement('div');
    itemModalTitle.className = "list-terms__item-modal-title";
    itemModalTitle.innerHTML = title;
    itemModalTop.appendChild(itemModalTitle);

    var itemModalClose = document.createElement('a');
    itemModalClose.className = "modal-close";
    itemModalClose.innerHTML = "<img src=img/close.svg >";
    itemModalTitle.appendChild(itemModalClose);

    //Середина модального окна

    var itemModalMiddle = document.createElement('div');
    itemModalMiddle.className = "list-terms__item-modal-middle";
    itemModalMiddle.innerHTML = description;
    itemContent.appendChild(itemModalMiddle);

    //Футтер модального окна

    var itemModalBottom = document.createElement('div');
    itemModalBottom.className = "list-terms__item-modal-bottom";
    itemContent.appendChild(itemModalBottom);

    var itemModalBottomText = document.createElement('div');
    itemModalBottomText.className = "list-terms__item-modal-bottom-text";
    itemModalBottom.appendChild(itemModalBottomText)



    var prev = document.createElement('div');
    prev.className = "prev";
    prev.innerHTML = "<img class=arrow src=img/arrow.svg>"
    itemModalBottomText.appendChild(prev);

    if (first) {
        prev.style.display = "none"
    }


    if (favorite)

    {
        var favorite = document.createElement('div');
        favorite.classList = "js-favorite favorite";
        favorite.innerHTML = "Убрать из избранного";
        favorite.setAttribute('data-id', id);
        itemModalBottomText.appendChild(favorite);
    } else {
        var favorite = document.createElement('div');
        favorite.classList = "js-favorite favorite";
        favorite.innerHTML = "В избранное";
        favorite.setAttribute('data-id', id);
        itemModalBottomText.appendChild(favorite);
    }

    var next = document.createElement('div');
    next.className = "next";
    next.innerHTML = "<img class=arrow src=img/arrow.svg>"
    itemModalBottomText.appendChild(next);

    if (last) {
        next.style.display = "none"
    }
}

function OpenModal(event) {
    var target = event.target;


    if (target.parentNode.classList.contains("list-terms__item")) {
        target = target.parentNode;
    }

    if (target.classList.contains("list-terms__item")) {

        CreateModal(target.getAttribute("data-title"), target.getAttribute("data-description"), target.getAttribute("data-id"), target.parentNode, target.getAttribute("data-favorite"), target.getAttribute("data-first_item"), target.getAttribute("data-last_item"))
    }
};

function CloseModal(event) {
    var target = event.target;

    if (target.parentNode.classList.contains("modal-close") || target.classList.contains("modal-close")) {
        target.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    }

    if (target.classList.contains("list-terms__item-modal")) {
        target.remove();
    }
};

function PrevModal(eventPrev) {
    var target = eventPrev.target;

    if (target.parentNode.classList.contains("prev")) {

        var origin = target.parentNode.parentNode.parentNode.parentNode.parentNode;

        while (!target.classList.contains("list-terms__item_wrapper")) {
            if (target.classList.contains("list-terms__item_wrapper")) {
                break;
            }
            target = target.parentNode;
        };

        target = target.previousSibling;

        while (!target.classList.contains("list-terms__item_wrapper")) {
            if (target.classList.contains("list-terms__item_wrapper")) {
                break;
            }

            if (target.classList.contains("list-terms__header-group") || target.classList.contains("list-terms__header-group_disable")) {
                target = target.parentNode.previousSibling.lastChild;
                continue
            }

            target = target.previousSibling;
        };

        target = target.firstChild;

        CreateModal(target.getAttribute("data-title"), target.getAttribute("data-description"), target.getAttribute("data-id"), target.parentNode, target.getAttribute("data-favorite"), target.getAttribute("data-first_item"), target.getAttribute("data-last_item"));

        origin.remove();
    }
}

function NextModal(eventNext) {
    var target = eventNext.target;

    if (target.parentNode.classList.contains("next")) {

        var origin = target.parentNode.parentNode.parentNode.parentNode.parentNode;


        while (!target.classList.contains("list-terms__item_wrapper")) {
            if (target.classList.contains("list-terms__item_wrapper")) {
                break;
            }
            target = target.parentNode;
        };

        if (target == target.parentNode.lastChild) {

            target = target.parentNode.nextSibling.firstChild;
        } else {
            target = target.nextSibling;
        }

        while (!target.classList.contains("list-terms__item_wrapper")) {

            if (target.classList.contains("list-terms__item_wrapper")) {
                break;
            }

            if (target == target.parentNode.lastChild) {

                target = target.parentNode.nextSibling.firstChild;
                continue
            }

            target = target.nextSibling;

        };

        target = target.firstChild;

        CreateModal(target.getAttribute("data-title"), target.getAttribute("data-description"), target.getAttribute("data-id"), target.parentNode, target.getAttribute("data-favorite"), target.getAttribute("data-first_item"), target.getAttribute("data-last_item"));

        origin.remove();
    }
}



// Добавление-удаление избранного 

function toggleFavorite(event) {
    var target = event.target;
    var item = target.parentNode.parentNode.parentNode.parentNode.previousElementSibling;

    if (target.classList.contains("js-favorite")) {

        var id = target.getAttribute("data-id");
        var url = "https://api.sbercode.appercode.com/v1/sbercode_ca/favorites/Abbreviations/" + id;
        startLoadingAnimation();

        if (!item.hasAttribute("data-favorite")) {

            axios({
                    method: 'post',
                    url: url,
                    headers: {
                        'X-Appercode-Session-Token': session
                    }
                })
                .then(function (response) {
                    stopLoadingAnimation();
                    item.setAttribute("data-favorite", "true");
                    target.innerHTML = "Убрать из избранного";
                })

        } else {

            axios({
                    method: 'delete',
                    url: url,
                    headers: {
                        'X-Appercode-Session-Token': session
                    }
                })
                .then(function (response) {
                    stopLoadingAnimation();
                    item.removeAttribute("data-favorite");
                    target.innerHTML = "В избранное";
                })
        }



    }
}

var input = document.getElementById("search");
var inputLoader = debounce(startLoadingAnimation, 400);

input.addEventListener("keyup", inputLoader);
list.addEventListener("click", CloseModal);
list.addEventListener("click", OpenModal);
list.addEventListener("click", NextModal);
list.addEventListener("click", PrevModal);
list.addEventListener("click", toggleFavorite)
