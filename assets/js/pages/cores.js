class Categoria {
    constructor(nome, cores) {
        this.nome = nome;
        this.cores = cores;
    }
}

class Cor {
    constructor(hex=null, rgb=null, hsl=null, hwb=null) {
        this.hex = hex;
        this.rgb = rgb;
        this.hsl = hsl;
        this.hwb = hwb;
    }
}

const categorias = [
    new Categoria("Vermelho", [
        new Cor("#82181a"), new Cor("#9f0712"), new Cor("#c10007"), 
        new Cor("#e7000b"), new Cor("#fb2c36"), new Cor("#ff6467"), 
        new Cor("#ffa2a2"), new Cor("#ffc9c9"), new Cor("#ffe2e2")
    ]),
    new Categoria("Laranja", [
        new Cor("#7e2a0c"), new Cor("#9f2d00"), new Cor("#ca3500"), 
        new Cor("#f54900"), new Cor("#ff6900"), new Cor("#ff8903"), 
        new Cor("#ffb869"), new Cor("#ffd6a7"), new Cor("#ffedd4")
    ]),
    new Categoria("Amarelo", [
        new Cor("#733e0a"), new Cor("#894b00"), new Cor("#a65f00"), 
        new Cor("#d08700"), new Cor("#f0b100"), new Cor("#ffcb03"),
        new Cor("#ffdf20"), new Cor("#fff085"), new Cor("#fef9c2")
    ]),
    new Categoria("Verde", [
        new Cor("#0d542b"), new Cor("#026630"), new Cor("#008235"),
        new Cor("#00a63e"), new Cor("#00c950"), new Cor("#06df72"),
        new Cor("#7bf1a7"), new Cor("#b9f8cf"), new Cor("#dcfce7")
    ]),
    new Categoria("Ciano", [
        new Cor("#104e64"), new Cor("#005f78"), new Cor("#007595"),
        new Cor("#0092b8"), new Cor("#00b8db"), new Cor("#00d3f2"),
        new Cor("#53eafd"), new Cor("#a2f4fd"), new Cor("#cefafe")
    ]),
    new Categoria("Azul", [
        new Cor("#1c398e"), new Cor("#193cb8"), new Cor("#1447e6"),
        new Cor("#155dfb"), new Cor("#2b7fff"), new Cor("#51a2ff"),
        new Cor("#8ec5ff"), new Cor("#bedbff"), new Cor("#dbeafe")
    ]),
    new Categoria("Roxo", [
        new Cor("#4d179a"), new Cor("#5d0ec0"), new Cor("#7008e7"),
        new Cor("#7f22fe"), new Cor("#8e51ff"), new Cor("#a684ff"),
        new Cor("#c4b4ff"), new Cor("#ddd6ff"), new Cor("#ede9fe")
    ]),
    new Categoria("Rosa", [
        new Cor("#721378"), new Cor("#8a0194"), new Cor("#a800b7"),
        new Cor("#c800de"), new Cor("#e12afb"), new Cor("#ed6bff"),
        new Cor("#f4a8ff"), new Cor("#f6cfff"), new Cor("#fae8ff")
    ]),
    new Categoria("Cinza", [
        new Cor("#111111"), new Cor("#222222"), new Cor("#333333"),
        new Cor("#444444"), new Cor("#555555"), new Cor("#666666"),
        new Cor("#777777"), new Cor("#888888"), new Cor("#999999"),
        new Cor("#aaaaaa"), new Cor("#bbbbbb"), new Cor("#cccccc"),
        new Cor("#dddddd"), new Cor("#eeeeee")
    ]),
    new Categoria("Preto e Branco", [
        new Cor("#000000"),
        new Cor("#ffffff")
    ])
];

function criarValoresCores() {
    categorias.forEach(categoria => {
        categoria.cores.forEach(cor => {
            let hex = cor.hex;
            hex = hex.replace(/^#/, '');

            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }

            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);

            cor.rgb = `rgb(${r}, ${g}, ${b})`;

            r /= 255; g /= 255; b /= 255;

            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; 
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            cor.hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
        });
    });
}

let timeoutId;
let ultimoQuadradoClicado = null;

function configurarOrigemGrandeQuadrado(quadradoCor) {
    const grandeQuadrado = document.getElementById("grande-quadrado");
    const main = document.getElementById("main");
    const quadradoRect = quadradoCor.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const mainWidth = Math.max(mainRect.width, 1);
    const mainHeight = Math.max(mainRect.height, 1);
    const deslocamentoX = quadradoRect.left - mainRect.left;
    const deslocamentoY = quadradoRect.top - mainRect.top;
    const escalaX = quadradoRect.width / mainWidth;
    const escalaY = quadradoRect.height / mainHeight;

    grandeQuadrado.style.setProperty("--overlay-start-x", `${deslocamentoX}px`);
    grandeQuadrado.style.setProperty("--overlay-start-y", `${deslocamentoY}px`);
    grandeQuadrado.style.setProperty("--overlay-scale-x", escalaX);
    grandeQuadrado.style.setProperty("--overlay-scale-y", escalaY);
}

function abrirGrandeQuadrado(quadradoCor, cor) {
    const grandeQuadrado = document.getElementById("grande-quadrado");

    ultimoQuadradoClicado = quadradoCor;
    grandeQuadrado.classList.add("sem-transicao");
    grandeQuadrado.classList.remove("visivel");
    configurarOrigemGrandeQuadrado(quadradoCor);
    grandeQuadrado.style.backgroundColor = cor.hex;

    // Forca o estado inicial sem transicao antes de expandir.
    void grandeQuadrado.offsetWidth;
    grandeQuadrado.classList.remove("sem-transicao");

    requestAnimationFrame(() => {
        grandeQuadrado.classList.add("visivel");
    });
}

function fecharGrandeQuadrado() {
    const grandeQuadrado = document.getElementById("grande-quadrado");

    if (ultimoQuadradoClicado) {
        configurarOrigemGrandeQuadrado(ultimoQuadradoClicado);
    }

    grandeQuadrado.classList.remove("visivel");
}

function criarCategorias() {
    categorias.forEach(categoria => {
        const categoriaDiv = document.createElement("div");
        categoriaDiv.classList.add("categoria");
        document.getElementById("main").appendChild(categoriaDiv);

        const titulo = document.createElement("h1");
        titulo.textContent = categoria.nome;
        categoriaDiv.appendChild(titulo);

        const divCores = document.createElement("div");
        divCores.classList.add("cores");
        categoriaDiv.appendChild(divCores);

        categoria.cores.forEach(cor => {
            const corDiv = document.createElement("div");
            corDiv.classList.add("cor");
            divCores.appendChild(corDiv);

            const quadradoCor = document.createElement("div");
            quadradoCor.classList.add("quadrado-cor");
            quadradoCor.style.backgroundColor = cor.hex;
            quadradoCor.addEventListener("click", () => {
                abrirGrandeQuadrado(quadradoCor, cor);
            });
            corDiv.appendChild(quadradoCor);

            const textoExemplo = document.createElement("p");
            textoExemplo.classList.add("texto-exemplo-cor");
            textoExemplo.textContent = "Exemplo texto 123 .@#-";
            textoExemplo.style.color = cor.hex;
            textoExemplo.style.borderColor = cor.hex;
            corDiv.appendChild(textoExemplo);

            const textosCorDiv = document.createElement("div");
            textosCorDiv.classList.add("textos-cor");
            corDiv.appendChild(textosCorDiv);

            const hexDiv = document.createElement("div");
            const hexTitulo = document.createElement("h6");
            hexTitulo.textContent = "HEX:";
            hexTitulo.addEventListener("click", () => {
                navigator.clipboard.writeText(cor.hex).then(() => {
                    document.getElementById("notificacao").style.display = "block";
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        document.getElementById("notificacao").style.display = "none";
                    }, 2000);
                });
            });
            hexDiv.appendChild(hexTitulo);

            const hexValor = document.createElement("p");
            hexValor.textContent = cor.hex;
            hexValor.addEventListener("click", () => {
                navigator.clipboard.writeText(cor.hex).then(() => {
                    document.getElementById("notificacao").style.display = "block";
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        document.getElementById("notificacao").style.display = "none";
                    }, 2000);
                });
            });
            hexDiv.appendChild(hexValor);
            textosCorDiv.appendChild(hexDiv);

            const rgbDiv = document.createElement("div");
            const rgbTitulo = document.createElement("h6");
            rgbTitulo.textContent = "RGB:";
            rgbTitulo.addEventListener("click", () => {
                navigator.clipboard.writeText(cor.rgb).then(() => {
                    document.getElementById("notificacao").style.display = "block";
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        document.getElementById("notificacao").style.display = "none";
                    }, 2000);
                });
            });
            rgbDiv.appendChild(rgbTitulo);

            const rgbValor = document.createElement("p");
            rgbValor.textContent = cor.rgb;
            rgbValor.addEventListener("click", () => {
                navigator.clipboard.writeText(cor.rgb).then(() => {
                    document.getElementById("notificacao").style.display = "block";
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        document.getElementById("notificacao").style.display = "none";
                    }, 2000);
                });
            });
            rgbDiv.appendChild(rgbValor);
            textosCorDiv.appendChild(rgbDiv);

            const hslDiv = document.createElement("div");
            const hslTitulo = document.createElement("h6");
            hslTitulo.textContent = "HSL:";
            hslTitulo.addEventListener("click", () => {
                navigator.clipboard.writeText(cor.hsl).then(() => {
                    document.getElementById("notificacao").style.display = "block";
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        document.getElementById("notificacao").style.display = "none";
                    }, 2000);
                });
            });
            hslDiv.appendChild(hslTitulo);

            const hslValor = document.createElement("p");
            hslValor.textContent = cor.hsl;
            hslValor.addEventListener("click", () => {
                navigator.clipboard.writeText(cor.hsl).then(() => {
                    document.getElementById("notificacao").style.display = "block";
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        document.getElementById("notificacao").style.display = "none";
                    }, 2000);
                });
            });
            hslDiv.appendChild(hslValor);
            textosCorDiv.appendChild(hslDiv);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    criarValoresCores();
    criarCategorias();

    document.getElementById("grande-quadrado").addEventListener("click", () => {
        fecharGrandeQuadrado();
    });
});