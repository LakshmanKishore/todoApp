window.onload = function () {
    let newTodo = document.querySelector(".inp");
    let submit = document.querySelector(".submit");
    let ul = document.querySelector("ul");
    let listLength, list;
    if (JSON.parse(localStorage.getItem("list")) == null) {
        list = [];
    } else {
        listLength = JSON.parse(localStorage.getItem("list")).length;
        if (listLength == 0) {
            ul.innerHTML = "<h4>Your Todo List is empty!</h4>";
        }
        list = JSON.parse(localStorage.getItem("list"));
    }

    submit.addEventListener("click", function () {
        // alert(newTodo.value);
        if (newTodo.value != "") {
            list.push({ todo: newTodo.value, dash: false });
            localStorage.setItem("list", JSON.stringify(list));
            // console.log(JSON.parse(localStorage.getItem("list"))[0]);
            while (ul.hasChildNodes()) {
                ul.removeChild(ul.firstChild);
            }
            listLength = JSON.parse(localStorage.getItem("list")).length;
            displayTodo();
            newTodo.value = "";
        }
    });

    newTodo.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          submit.click();
        }
      });

    function displayTodo() {
        if (listLength == 0) {
            ul.innerHTML = "<h4>Your Todo List is empty!</h4>";
        } 
        for (let i = 0; i < listLength; i++) {
            let newli = document.createElement("li");
            newli.classList.add("list-group-item");
            newli.innerText = JSON.parse(localStorage.getItem("list"))[i].todo;
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
            // console.log(list[i].dash);
            tick.addEventListener("click", () => done(newli));
            newli.addEventListener("click", () => strike(newli));
        }
    }

    displayTodo();

    function strike(li) {
        // console.log(li.innerText);
        li.classList.toggle("strikeThrough");
        for (let i = 0; i < listLength; i++) {
            if (li.innerText == list[i].todo) {
                if (li.classList.contains("strikeThrough")) {
                    // console.log(li);
                    list[i].dash = true;
                } else {
                    list[i].dash = false;
                }
                break;
            }
        }
        // console.log(list);
        localStorage.setItem("list", JSON.stringify(list));
    }

    function done(li) {
        // console.log("deleted" + li.innerText);
        for (let i = 0; i < listLength; i++) {
            if (li.innerText == list[i].todo) {
                list.splice(i, 1);
                break;
            }
        }
        while (ul.hasChildNodes()) {
            ul.removeChild(ul.firstChild);
        }
        localStorage.setItem("list", JSON.stringify(list));
        listLength = JSON.parse(localStorage.getItem("list")).length;
        displayTodo();
    }


}