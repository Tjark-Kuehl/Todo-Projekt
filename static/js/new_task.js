window.addEventListener("load",function(){

    let newtask = document.querySelector(".btn--new_task")
    let rowTaskNew = document.querySelector(".row--task--new")


    newtask.addEventListener("click",function(){
        newtask.style.display = "none";

        if (newtask.style.display === 'none'){

            let saveButton = document.createElement("button");
            saveButton.classList.add("btn");
            saveButton.classList.add("btn-save");
            saveButton.innerText = "Erstellen";

            let inputNewTask = document.createElement("input");
            inputNewTask.classList.add("new_task_input");
            inputNewTask.placeholder = "Gib einen neuen Task ein!";

            rowTaskNew.appendChild(inputNewTask);
            rowTaskNew.appendChild(saveButton);
        }
    }, false);



}, false);