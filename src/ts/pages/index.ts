interface ImageSequenceData {
    path: string;
    extensions: string[];
}

interface ImageSequences {
    [key: string]: ImageSequenceData;
}

const pathPrefix = 'src/images/links/';

const imageSequences: ImageSequences = {
    batatas: {
        path: 'batatas/batata',
        extensions: ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg']
    },
    codificador: {
        path: 'codificador/cod',
        extensions: ['png', 'jfif', 'jfif', 'png', 'jfif', 'jfif', 'jfif', 'jfif']
    },
    cores: {
        path: 'cores/cores',
        extensions: ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'png', 'jpg', 'png']
    },
    curiosidades: {
        path: 'curiosidades/curi',
        extensions: ['jpg', 'jpg', 'png', 'png', 'png', 'jpg', 'png', 'jpg']
    },
    'editor-html': {
        path: 'editor-html/edi',
        extensions: ['png', 'png', 'png', 'jpg', 'jpg', 'jpg', 'jpg', 'png']
    },
    'mayor-simulator': {
        path: 'mayor-simulator/ms',
        extensions: ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg']
    },
    numeros: {
        path: 'numeros/num',
        extensions: ['png', 'jpg', 'png', 'jpg', 'jpg', 'png', 'jpg', 'png']
    },
    'poder-do-css': {
        path: 'poder-do-css/pcs',
        extensions: ['png', 'png', 'jfif', 'png', 'jfif', 'jfif', 'jfif', 'jfif']
    },
    python: {
        path: 'python/py',
        extensions: ['jpg', 'jpg', 'png', 'jpg', 'jpg', 'jpg', 'png', 'png']
    },
    'quadrado-clicker': {
        path: 'quadrado-clicker/qc',
        extensions: ['png', 'jpg', 'jpg', 'jpg', 'png', 'png', 'png', 'png']
    },
    'review-jogos': {
        path: 'review-jogos/jr',
        extensions: ['jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg', 'jpg']
    },
    thifreBD: {
        path: 'thifreBD/tbd',
        extensions: ['png', 'jpg', 'jpg', 'png', 'jpg', 'png', 'png', 'jpg']
    }
};

function capitalizeID(id: string): string {
    return id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

function generateAnimationCSS(): void {
    let css = '';

    for (const [idName, data] of Object.entries(imageSequences)) {
        const animationName = `mudar${capitalizeID(idName)}`;
        let keyframes = `@keyframes ${animationName} {\n`;

        for (let i = 0; i < 8; i++) {
            const percentage = (i / 8) * 100;
            const frameNum = i + 1;
            const ext = data.extensions[i] || data.extensions[0];
            const imageUrl = `${pathPrefix}${data.path}${frameNum}.${ext}`;

            keyframes += `    ${percentage}% {\n`;
            keyframes += `        background-image: url('${imageUrl}');\n`;
            keyframes += `        background-size: cover;\n`;
            keyframes += `    }\n`;
        }

        keyframes += `    100% {\n`;
        keyframes += `        background-image: url('${pathPrefix}${data.path}1.${data.extensions[0]}');\n`;
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
