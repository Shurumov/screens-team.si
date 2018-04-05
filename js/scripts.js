

var termsListArray, favoriteArray, session, project;
startLoadingAnimation();

//Получаем json
//axios.post('https://api.sbercode.appercode.com/v1/sbercode_ca/login', {
//        "username": "abbreviations",
//        "password": "gth7596"
//    })
//    .then(function (response) {
//        session = response.data.sessionId;
//        getList();
//
//    })
//    .catch(function (error) {
//        console.log(error);
//    });

function sessionFromNative(e){
	var userData = JSON.parse(e);
    session = userData.sessionId;
    project = userData.projectName;
    getList(session, project)
}

function getList(session, project) {
    axios({
            method: 'get',
            url: 'https://api.sbercode.appercode.com/v1/'+ project +'/objects/Abbreviations?take=800&order=title',
            headers: {
                'X-Appercode-Session-Token': session
            }
        })
        .then(function (response) {
            termsListArray = response.data;
            
            createList();
            var screenHeight = screen.height,
                alphabetHeight = document.getElementsByClassName("list-terms__letter-list")[0].offsetHeight;

            if ((screenHeight*0.8) < alphabetHeight) {
               document.getElementsByClassName("list-terms__letter-list")[0].remove();
            }
            

        })
        .catch(function (error) {

            console.log(error);
        })
}






// Создание списка

var listTermsElements = document.getElementsByClassName('list-terms__elements')[0];

function createList() {
    
    var letterWidth = getTextWidth("a", "normal 13px sans-serif");
    var lineWidth = screen.width;
    
    var lettersQuantity = Math.round(lineWidth / letterWidth);

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
            item.setAttribute("data-title", termsListArray[i].title);
            item.setAttribute("data-description", termsListArray[i].html);
            item.setAttribute("data-id", termsListArray[i].id);
            itemWrapper.appendChild(item);

            var itemTitle = document.createElement('div');
            itemTitle.className = "list-terms__item-title js-search";
            itemTitle.innerHTML = termsListArray[i].title;
            item.appendChild(itemTitle);

            var itemSubtitle = document.createElement('div');
            itemSubtitle.className = "list-terms__item-subtitle";
            itemSubtitle.innerHTML = stringTruncation(termsListArray[i].html, lettersQuantity);
            item.appendChild(itemSubtitle);

        }
    });
    
    stopLoadingAnimation();
}



var listTerms = document.getElementsByClassName('list-terms')[0];







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

    
}

function OpenModal(event) {
    var target = event.target;


    if (target.parentNode.classList.contains("list-terms__item")) {
        target = target.parentNode;
    }

    if (target.classList.contains("list-terms__item")) {

        CreateModal(target.getAttribute("data-title"), target.getAttribute("data-description"), target.getAttribute("data-id"), target.parentNode, target.getAttribute("data-favorite"), target.getAttribute("data-first_item"), target.getAttribute("data-last_item"))
    }
}

function CloseModal(event) {
    var target = event.target;

    if (target.parentNode.classList.contains("modal-close") || target.classList.contains("modal-close")) {
        target.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    }

    if (target.classList.contains("list-terms__item-modal")) {
        target.remove();
    }
};



var input = document.getElementById("search");
var inputLoader = debounce(startLoadingAnimation, 400);

input.addEventListener("keyup", inputLoader);
list.addEventListener("click", CloseModal);
list.addEventListener("click", OpenModal);

