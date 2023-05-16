let open_close_link = (todo) => {
    if (todo.querySelector(".add-link-button").classList[1] == "open") {
        todo.querySelector(".add-link-container").style.animation = "open-link .3s ease forwards";
        todo.querySelector(".add-link-button").classList.remove("open");
        todo.querySelector(".add-link-button").classList.add("close");
        setTimeout(() => {
            todo.querySelector(".add-link-button").childNodes[0].classList = "fas fa-chevron-up";
        }, 300);
    }
    else {
        todo.querySelector(".add-link-container").style.animation = "close-link .3s ease forwards";
        todo.querySelector(".add-link-button").classList.remove("close");
        todo.querySelector(".add-link-button").classList.add("open");
        setTimeout(() => {
            todo.querySelector(".add-link-button").childNodes[0].classList = "fas fa-chevron-down";
        }, 300);
    }
}