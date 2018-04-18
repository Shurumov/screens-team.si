var termsListArray, favoriteArray, session, project, baseUrl;
startLoadingAnimation();



function sessionFromNative(e){
	var userData = JSON.parse(e);
    session = userData.sessionId;
    project = userData.projectName;
    baseUrl = userData.baseUrl;
    getList(session, project, baseUrl)
}

function getList(session, project, base) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', base + project + '/objects/Dictionary?take=-1&order=title', false);
    xhr.setRequestHeader('X-Appercode-Session-Token', session);
    xhr.send();

    if (xhr.status != 200) {

        alert(xhr.status + ': ' + xhr.statusText); 
    } else {
        termsListArray = JSON.parse(xhr.responseText);
        
        createList();
    }
};





var listTermsElements = document.getElementsByClassName('list-terms__elements')[0];

function createList() {
    var groups = document.getElementsByClassName('list-terms__group');
    var groupTitle;
    console.log(termsListArray);
    console.log(termsListArray.length);
    
    termsListArray.forEach(function (item, i, termsListArray) {

        

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
            itemSubtitle.innerHTML = termsListArray[i].html;
            item.appendChild(itemSubtitle);

        }
    });
    stopLoadingAnimation();
}

var listTerms = document.getElementsByClassName('list-terms')[0];


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



function startLoadingAnimation() {
    var imgObj = document.getElementById('floatingBarsG');
    imgObj.style.display = "block";
    imgObj.style.left = (screen.width - imgObj.width) / 2 + "px";
    imgObj.style.top = (screen.height - imgObj.height) / 3 + "px";
};


function stopLoadingAnimation() {
    var imgObj = document.getElementById('floatingBarsG');
    imgObj.style.display = "none";
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

function CreateModal(title, description, id, target) {

    

    var itemModal = document.createElement('div');
    itemModal.className = "list-terms__item-modal";
    target.appendChild(itemModal);

    var itemContent = document.createElement('div');
    itemContent.className = "list-terms__item-modal-content";
    itemModal.appendChild(itemContent);

  

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

        CreateModal(target.getAttribute("data-title"), target.getAttribute("data-description"), target.getAttribute("data-id"), target.parentNode)
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