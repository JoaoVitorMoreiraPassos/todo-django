const button = document.querySelector(".hamburguer-button button");
button.addEventListener("click", () => {
    if (button.classList.contains("open") || button.classList == "") {
        document.querySelector("nav").style.display = "flex";
        document.querySelector("nav").style.animation = "open-menu 0.5s ease forwards";
        try {
            button.classList.remove("open");
        } catch { }
        button.classList.add("close");
        button.querySelector("i").classList.remove("fa-bars");
        button.querySelector("i").classList.add("fa-times");
        const right_distance = button.parentNode.style.right;
        console.log("its here " + right_distance);
        button.parentNode.style.position = "fixed";
        button.parentNode.style.right = `${2}rem`;
    }
    else {
        document.querySelector("nav").style.animation = "close-menu 0.5s ease forwards";
        button.classList.remove("close");
        button.classList.add("open");
        button.querySelector("i").classList.remove("fa-times");
        button.querySelector("i").classList.add("fa-bars");
        button.parentNode.style.position = "relative";
        button.parentNode.style.top = "auto";
        button.parentNode.style.right = "auto";
        setTimeout(() => {
            document.querySelector("nav").style.display = "none";
        }, 200);
    }
});
