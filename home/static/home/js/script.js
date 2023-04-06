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

document.querySelectorAll('.todo-body').forEach(linkContainer => {
    linkContainer.childNodes[7].addEventListener("click", function () {
        if (linkContainer.childNodes[7].classList[1] == "open") {
            linkContainer.childNodes[5].style.animation = "open-link .3s linear forwards";
            setTimeout(() => {
                linkContainer.childNodes[7].childNodes[0].classList = "fas fa-chevron-up";
            }, 300);
            linkContainer.childNodes[5].style.height = "4rem";
            linkContainer.childNodes[7].classList.remove("open");
            linkContainer.childNodes[7].classList.add("close");
        }
        else {
            linkContainer.childNodes[5].style.animation = "close-link .3s linear forwards";
            setTimeout(() => {
                linkContainer.childNodes[7].childNodes[0].classList = "fas fa-chevron-down";
            }, 300);
            linkContainer.childNodes[5].style.height = "0";
            linkContainer.childNodes[7].classList.remove("close");
            linkContainer.childNodes[7].classList.add("open");
        }
    })
});

//atribuir cores de background aleatórias que contrastem com a cor #176585 para elementos da classe "todo-link"
const todoLinks = document.querySelectorAll('.todo-link');

// Defina a cor base
const baseColor = '#176585';

// Para cada elemento, defina a cor de background e a cor da fonte
todoLinks.forEach(link => {
    // Gere uma cor de background aleatória com contraste adequado
    const randomColor = getRandomColor(baseColor);
    const contrastColor = getContrastColor(randomColor);

    // Aplique a cor de background e a cor da fonte ao elemento
    link.style.backgroundColor = `rgb(${randomColor.r}, ${randomColor.g}, ${randomColor.b})`;
    link.childNodes[1].style.color = contrastColor;
    link.childNodes[3].style.color = contrastColor;
});

// Função para gerar uma cor aleatória que contrasta com a cor base
function getRandomColor(contrastColor) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const randomColor = { r, g, b };
    const contrastRatio = getContrastRatio(randomColor, contrastColor);
    if (contrastRatio < 4.5) {
        return getRandomColor(contrastColor);
    } else {
        return randomColor;
    }
}

// Função para obter a cor de contraste adequada para uma cor de base
function getContrastColor(baseColor) {
    // const baseRgb = hexToRgb(baseColor);
    const luma = (0.2126 * baseColor.r + 0.7152 * baseColor.g + 0.0722 * baseColor.b) / 255;
    if (luma > 0.4) {
        return '#000000'; // cor preta para cores claras
    } else {
        return '#ffffff'; // cor branca para cores escuras
    }
}


// Função para calcular o contraste de cor WCAG entre duas cores
function getContrastRatio(color1, color2) {
    // const rgb1 = hexToRgb(color1);
    // const rgb2 = hexToRgb(color2);
    const l1 = (0.2126 * color1.r + 0.7152 * color1.g + 0.0722 * color1.b) / 255;
    const l2 = (0.2126 * color2.r + 0.7152 * color2.g + 0.0722 * color2.b) / 255;
    const ratio = (l1 + 0.05) / (l2 + 0.05);
    return Math.max(ratio, 1 / ratio);
}