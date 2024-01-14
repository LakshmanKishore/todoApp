let newTodo = document.querySelector(".inp");
let infoButton = document.querySelector(".infoButton");

let submit = document.querySelector(".submit");
let ul = document.querySelector("ul");
let list;
const url = "https://script.google.com/macros/s/AKfycbwYvYtFQvf0eqP8ybtvjurQOhtOxAddO-W_7Eu0v1i1d-TP42j5bGUGmoFV52fiLTXvkg/exec";


if (JSON.parse(localStorage.getItem("list")) == null) {
    list = [];
    ul.innerHTML = "<h4>Your Todo List is empty!</h4>";
} else {
    list = JSON.parse(localStorage.getItem("list"));
    if (list.length == 0) {
        ul.innerHTML = "<h4>Your Todo List is empty!</h4>";
    }
}

submit.addEventListener("click", function () {
    // alert(newTodo.value);
    if (newTodo.value != "") {
        if(localStorage.getItem("password")){
            fetch(url+`?password=${localStorage.getItem("password")}&type=post&todo=${newTodo.value}&dash=false`)
                .then((response) => {
                    return response.json();
                })
                .then((todoData) => {
                    newTodo.value = "";
                    list = [];
                    displayTodo();
                    setTodoSavedFromGoogleSheetsToList();
                });
            return;
        }
        list.push({ todo: newTodo.value, dash: false });
        localStorage.setItem("list", JSON.stringify(list));
        while (ul.hasChildNodes()) {
            ul.removeChild(ul.firstChild);
        }
        displayTodo();
        newTodo.value = "";
    }
});

newTodo.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        submit.click();
    }
});

function displayTodo() {
    if (list.length == 0) {
        ul.innerHTML = "<h4>Your Todo List is empty!</h4>";
    } else {
        ul.innerHTML = "";
    }
    for (let i = 0; i < list.length; i++) {
        let newli = document.createElement("li");
        newli.classList.add("list-group-item");
        if ("hash" in list[i]){
            newli.id = list[i].hash;
        }
        newli.innerText = list[i].todo;
        let tick = document.createElement("span");
        tick.innerHTML = "<button type='button' class='btn btn-outline-primary space '> <svg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-check2' fill='currentColor' xmlns='http://www.w3.org/2000/svg'> <path fill-rule='evenodd' d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z'></path></svg></button>"
        newli.classList.add("separate");
        newli.appendChild(tick);
        ul.appendChild(newli);
        if (list[i].dash) {
            newli.classList.add("strikeThrough");
        } else {
            newli.classList.remove("strikeThrough");
        }
        tick.addEventListener("click", () => done(newli));
        newli.addEventListener("click", () => strike(newli));
    }
}

function strike(li) {
    li.classList.toggle("strikeThrough");
    for (let i = 0; i < list.length; i++) {
        if (li.innerText == list[i].todo) {
            if (li.classList.contains("strikeThrough")) {
                list[i].dash = true;
            } else {
                list[i].dash = false;
            }
            break;
        }
    }
    localStorage.setItem("list", JSON.stringify(list));
}

function done(li) {
    for (let i = 0; i < list.length; i++) {
        if (li.innerText == list[i].todo) {
            list.splice(i, 1);
            break;
        }
    }
    while (ul.hasChildNodes()) {
        ul.removeChild(ul.firstChild);
    }
    localStorage.setItem("list", JSON.stringify(list));
    displayTodo();
}


infoButton.addEventListener("click", function(){
    let password = prompt("Please Enter password, d to delete:");
    localStorage.setItem("password", password);
    if (password == "d"){
        localStorage.removeItem("password");
        list = JSON.parse(localStorage.getItem("list"));
        displayTodo();
        return;
    }

    setTodoSavedFromGoogleSheetsToList();
})

if (localStorage.getItem("password")){
    setTodoSavedFromGoogleSheetsToList();
} else {
    // display localStorage todo's only if password not present
    displayTodo();
}

async function setTodoSavedFromGoogleSheetsToList(){
    fetch(url+`?password=${localStorage.getItem("password")}&type=get`)
        .then((response) => {
            return response.json();
        })
        .then((todoData) => {
            list = todoData.data;
            displayTodo();
        });
}

