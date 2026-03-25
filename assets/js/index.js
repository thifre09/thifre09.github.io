"use strict";
const imageSequences = {
    batatas: {
        path: 'assets/images/links/batatas/batata',
        extensions: ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg']
    },
    codificador: {
        path: 'assets/images/links/codificador/cod',
        extensions: ['png', 'jfif', 'jfif', 'png', 'jfif', 'jfif', 'jfif', 'jfif']
    },
    cores: {
        path: 'assets/images/links/cores/cores',
        extensions: ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'png', 'jpg', 'png']
    },
    curiosidades: {
        path: 'assets/images/links/curiosidades/curi',
        extensions: ['jpg', 'jpg', 'png', 'png', 'png', 'jpg', 'png', 'jpg']
    },
    'mayor-simulator': {
        path: 'assets/images/links/mayor-simulator/ms',
        extensions: ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg']
    },
    numeros: {
        path: 'assets/images/links/numeros/num',
        extensions: ['png', 'jpg', 'png', 'jpg', 'jpg', 'png', 'jpg', 'png']
    },
    'poder-do-css': {
        path: 'assets/images/links/poder-do-css/pcs',
        extensions: ['png', 'png', 'jfif', 'png', 'jfif', 'jfif', 'jfif', 'jfif']
    },
    python: {
        path: 'assets/images/links/python/py',
        extensions: ['jpg', 'jpg', 'png', 'jpg', 'jpg', 'jpg', 'png', 'png']
    },
    'quadrado-clicker': {
        path: 'assets/images/links/quadrado-clicker/qc',
        extensions: ['png', 'jpg', 'jpg', 'jpg', 'png', 'png', 'png', 'png']
    },
    'review-jogos': {
        path: 'assets/images/links/review-jogos/jr',
        extensions: ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg']
    },
    thifreBD: {
        path: 'assets/images/links/thifreBD/tbd',
        extensions: ['png', 'jpg', 'jpg', 'png', 'jpg', 'png', 'png', 'jpg']
    }
};
function capitalizeID(id) {
    return id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}
function generateAnimationCSS() {
    let css = '';
    for (const [idName, data] of Object.entries(imageSequences)) {
        const animationName = `mudar${capitalizeID(idName)}`;
        let keyframes = `@keyframes ${animationName} {\n`;
        for (let i = 0; i < 8; i++) {
            const percentage = (i / 8) * 100;
            const frameNum = i + 1;
            const ext = data.extensions[i] || data.extensions[0];
            const imageUrl = `${data.path}${frameNum}.${ext}`;
            keyframes += `    ${percentage}% {\n`;
            keyframes += `        background-image: url('${imageUrl}');\n`;
            keyframes += `        background-size: cover;\n`;
            keyframes += `    }\n`;
        }
        keyframes += `    100% {\n`;
        keyframes += `        background-image: url('${data.path}1.${data.extensions[0]}');\n`;
        keyframes += `        background-size: cover;\n`;
        keyframes += `    }\n`;
        keyframes += `}\n\n`;
        css += keyframes;
    }
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}
// Gera as animações quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', generateAnimationCSS);
