document.querySelector(".nav-create").addEventListener("mousemove", () => {
    document.querySelector(".nav-home").style.color = "white";
    document.querySelector(".nav-home").style.border = "none";
    document.querySelector(".nav-profile").style.color = "white";
    document.querySelector(".nav-profile").style.border = "none";
    document.querySelector(".nav-create").style.color = "#27b1bf";
    document.querySelector(".nav-create").style.borderBottom = "3px solid #27b1bf";
})

document.querySelector(".nav-create").addEventListener("mouseout", () => {
    document.querySelector(".nav-home").style = "";
    document.querySelector(".nav-home").style = "";
    document.querySelector(".nav-profile").style = "";
    document.querySelector(".nav-profile").style = "";
    document.querySelector(".nav-create").style = "";
    document.querySelector(".nav-create").style = "";
});

document.querySelector(".nav-home").addEventListener("mousemove", () => {
    document.querySelector(".nav-home").style.color = "#27b1bf";
    document.querySelector(".nav-home").style.borderBottom = "3px solid #27b1bf";
    document.querySelector(".nav-profile").style.color = "white";
    document.querySelector(".nav-profile").style.border = "none";
    document.querySelector(".nav-create").style.color = "white";
    document.querySelector(".nav-create").style.border = "none";
})

document.querySelector(".nav-home").addEventListener("mouseout", () => {
    document.querySelector(".nav-home").style = "";
    document.querySelector(".nav-home").style = "";
    document.querySelector(".nav-profile").style = "";
    document.querySelector(".nav-profile").style = "";
    document.querySelector(".nav-create").style = "";
    document.querySelector(".nav-create").style = "";
});

document.querySelector(".nav-profile").addEventListener("mousemove", () => {
    document.querySelector(".nav-home").style.color = "white";
    document.querySelector(".nav-home").style.border = "none";
    document.querySelector(".nav-profile").style.color = "#27b1bf";
    document.querySelector(".nav-profile").style.borderBottom = "3px solid #27b1bf";
    document.querySelector(".nav-create").style.color = "white";
    document.querySelector(".nav-create").style.border = "none";
})

document.querySelector(".nav-profile").addEventListener("mouseout", () => {
    document.querySelector(".nav-home").style = "";
    document.querySelector(".nav-home").style = "";
    document.querySelector(".nav-profile").style = "";
    document.querySelector(".nav-profile").style = "";
    document.querySelector(".nav-create").style = "";
    document.querySelector(".nav-create").style = "";
});