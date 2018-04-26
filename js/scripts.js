var termsListArray, favoriteArray, session, project, baseUrl, refreshT;
startLoadingAnimation();



function sessionFromNative(e) {
    var userData = JSON.parse(e);
    session = userData.sessionId;
    project = userData.projectName;
    baseUrl = userData.baseUrl;
    refreshT = userData.refreshToken;
    getList(session, project, baseUrl)
}

function loginByToken(){
    var xhr = new XMLHttpRequest();
    var url = baseUrl + project + "/login/byToken";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) 
          return;
      if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            var response = JSON.parse(xhr.responseText)
            session = response.sessionId;
            getList(session, project, baseUrl)
        }
    };

    
    xhr.send('"'+refreshT+'"');
}

function getList(session, project, base) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', base + project + "/objects/Dictionary?take=-1&order=title&include=['title','html']");
    xhr.setRequestHeader('X-Appercode-Session-Token', session);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState != 4) 
            return;
        if (xhr.status == 401){
            loginByToken();
        } else 
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            termsListArray = JSON.parse(xhr.responseText);
            createList();
        }
    }
};





var listTermsElements = document.querySelector('.list-terms__elements');

function createList() {
    var groups = document.getElementsByClassName('list-terms__group');
    var groupTitle = '';

    termsListArray.forEach(function (item, i) {

        if (item.title[0].toUpperCase() !== groupTitle.toUpperCase()) {
            groupTitle = item.title[0];

            var group = document.createElement('div');
            group.className = "list-terms__group";
            listTermsElements.appendChild(group);

            var header = document.createElement('div');
            header.className = "list-terms__header-group";
            header.innerHTML = item.title[0];
            group.appendChild(header)

        }



        if (item.title && item.html) {

            var itemWrapper = document.createElement('div');
            itemWrapper.className = "list-terms__item_wrapper js-show-hide";
            groups[groups.length - 1].appendChild(itemWrapper);

            var term = document.createElement('a');
            term.className = "list-terms__item";
            term.setAttribute("data-title", item.title);
            term.setAttribute("data-description", item.html);
            itemWrapper.appendChild(term);

            var itemTitle = document.createElement('div');
            itemTitle.className = "list-terms__item-title js-search";
            itemTitle.innerHTML = item.title;
            term.appendChild(itemTitle);

            var itemSubtitle = document.createElement('div');
            itemSubtitle.className = "list-terms__item-subtitle";
            itemSubtitle.innerHTML = item.html;
            term.appendChild(itemSubtitle);

        }
    });
    stopLoadingAnimation();
}

var listTerms = document.querySelector('.list-terms');


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
};


function stopLoadingAnimation() {
    var imgObj = document.getElementById('floatingBarsG');
    imgObj.style.display = "none";
}



function searchTerm() {
    startLoadingAnimation();
    var input, filter, search, item, a;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    search = document.getElementsByClassName("js-search");
    item = document.getElementsByClassName("js-show-hide");
    headers = document.getElementsByClassName("list-terms__header-group");

    Array.prototype.forEach.call(headers, function (item, i) {
        item.classList.add('disable');
    })

    for (var i = 0; i < search.length; i++) {
        a = search[i];

        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            item[i].classList.remove('disable');
        } else {
            item[i].classList.add('disable');
        };

    }

    var activeTerms = document.querySelectorAll(".list-terms__item_wrapper:not(.disable)");

    for (var j = 0; j < activeTerms.length; j++) {
        activeTerms[j].parentNode.childNodes[0].classList.remove('disable');
    }

    stopLoadingAnimation();
};

var search = debounce(searchTerm, 300);

var list = document.querySelector(".list-terms__elements");

var modal = document.querySelector(".list-terms__item-modal");

var modalTitle = document.querySelector(".list-terms__item-modal-title");

var modalDesription = document.querySelector(".list-terms__item-modal-middle");


function openModal(event) {
    var target = event.target;


    if (target.parentNode.classList.contains("list-terms__item")) {
        target = target.parentNode;
    }

    if (target.classList.contains("list-terms__item")) {

        modal.classList.remove("disable")

        modalTitle.innerHTML = target.getAttribute("data-title") + '<a class="modal-close"><img src="img/close.svg"></a>';

        modalDesription.innerHTML = target.getAttribute("data-description");
    }
}

function closeModal(event) {
    var target = event.target;

    if (target.parentNode.classList.contains("modal-close") || target.classList.contains("modal-close")) {
        modal.classList.add("disable")
    }

    if (target.classList.contains("list-terms__item-modal")) {
        modal.classList.add("disable")
    }
};

var input = document.getElementById("search");

list.addEventListener("click", closeModal);
list.addEventListener("click", openModal);
