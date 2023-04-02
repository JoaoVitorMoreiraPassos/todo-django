document.getElementById("open-close-category-button").addEventListener("click", () => {
    const button = document.getElementById("open-close-category-button");
    let cat_register = document.getElementById("category-register")

    if (button.classList == "open") {
        button.classList.remove("open");
        button.classList.add("close");
        let i = document.createElement("i");
        i.classList = "fas fa-chevron-up";
        button.removeChild(button.childNodes[0])
        button.appendChild(i);
        document.querySelector(".category-form").childNodes.forEach((child) => {
            try {
                child.style.display = "flex";
            }
            catch { }
        })
        cat_register.style.animation = "open-register 0.2s ease-in-out";
        cat_register.style.height = "100%";
        cat_register.style.width = "100%";
        document.querySelector(".category-form").style.display = "block"
    }
    else {
        button.classList.remove("close");
        button.classList.add("open");
        let i = document.createElement("i");
        i.classList = "fas fa-chevron-down";
        button.removeChild(button.childNodes[0])
        button.appendChild(i);
        cat_register.style.animation = "close-register 0.2s ease-in-out";
        cat_register.style.height = "0";
        cat_register.style.width = "0";
        document.querySelector(".category-form").childNodes.forEach((child) => {
            try {
                child.style.display = "none";
            }
            catch { }
        })
    }
})
document.getElementById("open-close-todo-button").addEventListener("click", () => {
    let button = document.getElementById("open-close-todo-button");
    let todo_reg = document.querySelector(".todo-register");
    if (button.classList == "open") {
        button.classList.remove("open");
        button.classList.add("close");
        let i = document.createElement("i");
        i.classList = "fas fa-chevron-up";
        button.removeChild(button.childNodes[0])
        button.appendChild(i);

        document.querySelector(".todo-form").childNodes.forEach((child) => {
            try {
                child.style.display = "flex";
            }
            catch { }
        })
        todo_reg.style.animation = "open-register 0.2s ease-in-out";
        todo_reg.style.width = "100%";
        todo_reg.style.height = "100%";
        document.querySelector(".todo-form").style.display = "block";
    }
    else {
        button.classList.remove("close");
        button.classList.add("open");
        let i = document.createElement("i");
        i.classList = "fas fa-chevron-down";
        button.removeChild(button.childNodes[0])
        button.appendChild(i);
        todo_reg.style.animation = "close-register 0.2s ease-in-out";
        document.querySelector(".todo-form").childNodes.forEach((child) => {
            try {
                child.style.display = "none";
            }
            catch { }
        })
        todo_reg.style.width = "0";
        todo_reg.style.height = "0";
    }
}) 