
let main = document.getElementById("home");
let month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
let colors = ["bg-primary","bg-secondary","bg-success","bg-danger","bg-warning","bg-info"];
let articles = [];
//// Labels 
// JavaScript, random
let colorsMap = new Map([
    ["JavaScript", "#dada0f"],
    ["random", "#6b076b"],
    ["Angular", "#c3102f"],
    ["css",   "#ea9fac"],
    ["Linux",  "#dd4814"],
    ["aws", "#232f3e"],
    ["ionic", "#2b5399"]
    ]);


let popularPost = document.getElementsByClassName("popular-posts");
let list = popularPost[0].getElementsByTagName("ul")[0];
let listItem = list.getElementsByTagName("li");
for(let item of listItem){
    item.classList.add("list-group-item");
}
list.classList.add("list-group", "list-group-flush");
//listItem.classList.add("list-group-item");

function loadArticlesData(url) {
    let loader = `<div class="d-flex justify-content-center">
    <div class="spinner-grow text-primary m-5" role="status">
    <span class="sr-only">Loading...</span>
    </div>
    </div>`;
    main.innerHTML = loader;

    fetch(url).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data.feed.entry);
        articles = (data.feed.entry) ? data.feed.entry : [];
        loadArticles();
    }).catch((err) => {
        console.log(err);
    })
}

function errorMessage() {
    let error = `
    <div class="card text-center">
      <div class="card-header">
       <b>404</b>
      </div>
      <div class="card-body">
        <h5 class="card-title">Error Not Found</h5>
        <p class="card-text">Its seems to be a wrong path</p>
        <a class="btn, btn-primary mx-1" onclick="loadArticlesData('https://www.redthemers.tech/feeds/posts/default?alt=json')"><button type="button" class="btn btn-primary">Go Home</button></a>
      </div>
    </div>`;
    main.innerHTML = error;
    window.history.pushState("", "", '');
}

function noArticlesFound(){
      let message = `<div class="alert alert-warning" role="alert">
      <h4 class="alert-heading">No Matching Article Found</h4>
      <p> Try visiting other page or  <b> <a href="" onclick="loadArticlesData('https://www.redthemers.tech/feeds/posts/default?alt=json')">Go Home</a> </b></p>
    </div>`;
    main.innerHTML = message;
}

function loadArticles() {
    let container = document.createDocumentFragment();
    
    if (!articles){
        return errorMessage();
    }
    if(articles.length <= 0){
      return noArticlesFound();
    }
    for (let article of articles) {
        let div = document.createElement("div");
        div.classList.add("article-item", "w-100", "p-3");
        let time = new Date(Date.parse(article.published.$t));
        let labels = document.createElement("div");
        labels.classList.add("labels", "float-left");
        
        if (article.category.length) {
            for (let label of article.category) {
                let span = document.createElement("span");
                span.innerHTML = label.term;
                
                //let color = colors[Math.floor(Math.random() * colors.length)];
                let color = colorsMap.get(label.term);
                if (!color)
                    color = "red"

                //console.log(color);    
                
                span.classList.add("label", "text-white", "mt-2", "mr-2","px-2","rounded");
                span.style.background = color
                span.addEventListener('click', function () {

                    loadArticlesData(`https://www.redthemers.tech/feeds/posts/default/-/${label.term}?alt=json`);
                    window.history.pushState("", "", `?label=${label.term}`);
               
                });
                labels.appendChild(span);
            }
        }
        let content = `<div class="article-inner">
        <div><a href="${article.link[2].href}"> <h4 class="card-title">${article.title.$t}</h4> </a></div>
        <div><b>${time.getDate()} - ${month[time.getMonth()]} - ${time.getFullYear()}</b></div>
        </div>`;
        //console.log("labels", labels.innerHTML);
        div.innerHTML = content;
        let temp = div.getElementsByClassName("article-inner");
        temp[0].appendChild(labels);
        container.appendChild(div);
    }
    main.innerHTML = "";
    main.appendChild(container);
    let lastArticle = main.getElementsByClassName("article-inner")[main.getElementsByClassName("article-inner").length - 1];
    lastArticle.style.borderBottom = "none";
    console.log(lastArticle);
    

}

window.onload = function () {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search.slice(1));
    if (url.pathname == "/") {
        if (params.has("label") == true) {
            loadArticlesData(`https://www.redthemers.tech/feeds/posts/default/-/${params.get("label")}?alt=json`)
        } else {
            console.log("in root", params.has("label"));
            loadArticlesData("https://www.redthemers.tech/feeds/posts/default?alt=json");
        }
    }

}





