let getRandomColor = (contrastColor) => {
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