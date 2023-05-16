document.querySelectorAll('.todo-body').forEach(linkContainer => {
    linkContainer.querySelector(".add-link-button").addEventListener('click', () => { open_close_link(linkContainer) });
});

//atribuir cores de background aleatórias que contrastem com a cor #176585 para elementos da classe "todo-link"
const todoLinks = document.querySelectorAll('.todo-link');
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

