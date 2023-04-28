document.querySelectorAll('.todo-body').forEach(linkContainer => {
    linkContainer.querySelector(".add-link-button").addEventListener("click", () => {
        if (linkContainer.querySelector(".add-link-button").classList[1] == "open") {
            linkContainer.querySelector(".add-link-container").style.animation = "open-link .3s ease forwards";
            linkContainer.querySelector(".add-link-button").classList.remove("open");
            linkContainer.querySelector(".add-link-button").classList.add("close");
            setTimeout(() => {
                linkContainer.querySelector(".add-link-button").childNodes[0].classList = "fas fa-chevron-up";
                // linkContainer.querySelector(".add-link-container").style.padding = ".5rem";
            }, 300);
        }
        else {
            linkContainer.querySelector(".add-link-container").style.animation = "close-link .3s ease forwards";
            linkContainer.querySelector(".add-link-button").classList.remove("close");
            linkContainer.querySelector(".add-link-button").classList.add("open");
            setTimeout(() => {
                linkContainer.querySelector(".add-link-button").childNodes[0].classList = "fas fa-chevron-down";
                // linkContainer.querySelector(".add-link-container").style.padding = "0";
            }, 300);
        }
    })
});

let getRandomColor = (contrastColor) => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const randomColor = { r, g, b };
    const contrastRatio = getContrastRatio(randomColor, contrastColor);
    if (contrastRatio < 5) {
        return getRandomColor(contrastColor);
    } else {
        return randomColor;
    }
}

// Função para obter a cor de contraste adequada para uma cor de base
let getContrastColor = (baseColor) => {
    // const baseRgb = hexToRgb(baseColor);
    const luma = (0.2126 * baseColor.r + 0.7152 * baseColor.g + 0.0722 * baseColor.b) / 255;
    if (luma > 0.5) {
        return '#000000'; // cor preta para cores claras
    } else {
        return '#ffffff'; // cor branca para cores escuras
    }
}


// Função para calcular o contraste de cor WCAG entre duas cores
let getContrastRatio = (color1, color2) => {
    const l1 = (0.2126 * color1.r + 0.7152 * color1.g + 0.0722 * color1.b) / 255;
    const l2 = (0.2126 * color2.r + 0.7152 * color2.g + 0.0722 * color2.b) / 255;
    const ratio = (l1 + 0.05) / (l2 + 0.05);
    return Math.max(ratio, 1 / ratio);
}


//atribuir cores de background aleatórias que contrastem com a cor #176585 para elementos da classe "todo-link"
const todoLinks = document.querySelectorAll('.todo-link');

// Defina a cor base

// Para cada elemento, defina a cor de background e a cor da fonte
todoLinks.forEach(link => {
    // Gere uma cor de background aleatória com contraste adequado
    let pai = link.parentNode.parentNode.parentNode;
    const baseColor = window.getComputedStyle(pai).backgroundColor || '#176585';
    const randomColor = getRandomColor(baseColor);
    const contrastColor = getContrastColor(randomColor);

    // Aplique a cor de background e a cor da fonte ao elemento
    link.style.backgroundColor = `rgb(${randomColor.r}, ${randomColor.g}, ${randomColor.b})`;
    link.childNodes[1].style.color = contrastColor;
    link.childNodes[3].style.color = contrastColor;
});

// Função para gerar uma cor aleatória que contrasta com a cor base

