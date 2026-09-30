"use strict";
// #region Change navbar
const buttonChangeToGame = document.getElementById("button-header-game");
const buttonChangeToOthers = document.getElementById("button-header-others");
const buttonChangeToSave = document.getElementById("button-header-save");
const buttonChangeToHelp = document.getElementById("button-header-help");
const navBar = document.getElementById("nav-bar");
/**
 * Atualiza a posição e a largura do indicador da interface ativa.
 * @param activeButton - Botão atualmente selecionado.
 */
function updateNavBarIndicator(activeButton) {
    const left = activeButton.offsetLeft;
    const width = activeButton.offsetWidth;
    navBar.style.setProperty("--indicator-left", `${left}px`);
    navBar.style.setProperty("--indicator-width", `${width}px`);
}
/**
 * Troca a interface visível no painel (gráfica, terminal, logical, save ou help).
 * @param id - Identificador da interface a ser exibida.
 */
function changeTo(id) {
    document.getElementById("game").style.display = "none";
    document.getElementById("others").style.display = "none";
    document.getElementById("save").style.display = "none";
    document.getElementById("help").style.display = "none";
    document.getElementById(id).style.display = "flex";
    document.querySelector(".nav-bar-ativo")?.classList.remove("nav-bar-ativo");
    switch (id) {
        case "game":
            buttonChangeToGame.classList.add("nav-bar-ativo");
            updateNavBarIndicator(buttonChangeToGame);
            break;
        case "others":
            buttonChangeToOthers.classList.add("nav-bar-ativo");
            updateNavBarIndicator(buttonChangeToOthers);
            break;
        case "save":
            buttonChangeToSave.classList.add("nav-bar-ativo");
            updateNavBarIndicator(buttonChangeToSave);
            break;
        case "help":
            buttonChangeToHelp.classList.add("nav-bar-ativo");
            updateNavBarIndicator(buttonChangeToHelp);
            break;
    }
}
buttonChangeToGame.addEventListener("click", () => {
    changeTo("game");
});
buttonChangeToOthers.addEventListener("click", () => {
    changeTo("others");
});
buttonChangeToSave.addEventListener("click", () => {
    changeTo("save");
});
buttonChangeToHelp.addEventListener("click", () => {
    changeTo("help");
});
// #endregion
// #region classes
class Gerador {
    static PRICE_MULTIPLIER = 1.15;
    name;
    basePrice;
    production;
    quantity;
    constructor(name, basePrice, production) {
        this.name = name;
        this.basePrice = basePrice;
        this.production = production;
        this.quantity = 0;
    }
    createHTML() {
        const container = document.createElement("div");
        container.classList.add("gerador");
        container.addEventListener("click", () => this.buy());
        const divTexts = document.createElement("div");
        divTexts.classList.add("gerador-texts");
        container.appendChild(divTexts);
        const divAmount = document.createElement("div");
        divAmount.classList.add("gerador-amount");
        divAmount.textContent = this.quantity.toString();
        container.appendChild(divAmount);
        const h2Name = document.createElement("h2");
        h2Name.textContent = this.name;
        divTexts.appendChild(h2Name);
        const divPriceProduction = document.createElement("div");
        divPriceProduction.classList.add("gerador-price-production");
        divTexts.appendChild(divPriceProduction);
        const pPrice = document.createElement("p");
        pPrice.textContent = "Preço: " + formatNumber(this.price);
        divPriceProduction.appendChild(pPrice);
        const pProduction = document.createElement("p");
        pProduction.textContent = "Produção: " + formatNumber(this.production);
        divPriceProduction.appendChild(pProduction);
        return container;
    }
    buy() {
        if (quadrados < this.price)
            return;
        quadrados -= this.price;
        this.quantity++;
        updateQuadradosPorSegundoValue();
        updateUI();
    }
    get price() {
        return Math.floor(this.basePrice * Math.pow(Gerador.PRICE_MULTIPLIER, this.quantity));
    }
}
class Melhoria {
    name;
    description;
    price;
    bought;
    affectedGenerator;
    productionIncrease;
    otherEffects;
    constructor(name, description, price, affectedGenerator, productionIncrease, otherEffects) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.affectedGenerator = affectedGenerator;
        this.productionIncrease = productionIncrease;
        this.bought = false;
        this.otherEffects = otherEffects || (() => { });
    }
    createHTML() {
        const container = document.createElement("div");
        container.classList.add("melhoria");
        container.addEventListener("click", () => {
            this.buy();
            updateUI();
        });
        const h2Name = document.createElement("h2");
        h2Name.textContent = this.name;
        container.appendChild(h2Name);
        const pDescription = document.createElement("p");
        pDescription.textContent = this.description;
        container.appendChild(pDescription);
        const pPrice = document.createElement("p");
        pPrice.textContent = "Preço: " + formatNumber(this.price);
        container.appendChild(pPrice);
        return container;
    }
    buy() {
        if (this.bought)
            return;
        if (quadrados < this.price)
            return;
        quadrados -= this.price;
        this.bought = true;
        this.otherEffects();
        this.affectedGenerator.production *= this.productionIncrease;
        updateUI();
    }
}
class MelhoriaTriangulo {
    name;
    description;
    price;
    bought;
    effect;
    constructor(name, description, price, effect) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.effect = effect;
        this.bought = false;
    }
    createHTML() {
        const container = document.createElement("div");
        container.classList.add("melhoria");
        container.addEventListener("click", () => {
            this.buy();
            updateUI();
        });
        const h2Name = document.createElement("h2");
        h2Name.textContent = this.name;
        container.appendChild(h2Name);
        const pDescription = document.createElement("p");
        pDescription.textContent = this.description;
        container.appendChild(pDescription);
        const pPrice = document.createElement("p");
        pPrice.textContent = "Preço: " + formatNumber(this.price);
        container.appendChild(pPrice);
        return container;
    }
    buy() {
        if (this.bought)
            return;
        if (triangulos < this.price)
            return;
        triangulos -= this.price;
        this.bought = true;
        this.effect();
        updateUI();
    }
}
const geradores = [
    new Gerador("Cursores", 10e1, 1),
    new Gerador("Professores", 3e3, 10),
    new Gerador("Matemáticos", 1.3e5, 44),
    new Gerador("Quadros", 0.9e7, 305),
    new Gerador("Impressoras", 1.5e9, 5070),
    new Gerador("Fábricas", 2e11, 674e2),
    new Gerador("Engenheiros", 2.5e13, 8425e2),
    new Gerador("Programadores", 3.7e15, 1246e4),
    // new Gerador("Computadores", 10, 1),
    // new Gerador("Cubos", 100, 5),
];
const melhorias = [
    new Melhoria("Cursores duplos", "Dobra a produção dos cursores", 500, geradores[0], 2),
    new Melhoria("Professores duplos", "Dobra a produção dos professores", 15e3, geradores[1], 2),
    new Melhoria("Matemáticos duplos", "Dobra a produção dos matemáticos", 6.5e5, geradores[2], 2),
    new Melhoria("Quadros duplos", "Dobra a produção dos quadros", 4.5e7, geradores[3], 2),
    new Melhoria("Impressoras duplas", "Dobra a produção das impressoras", 7.5e9, geradores[4], 2),
    new Melhoria("Fábricas duplas", "Dobra a produção das fábricas", 10e11, geradores[5], 2),
    new Melhoria("Engenheiros duplos", "Dobra a produção dos engenheiros", 12.5e13, geradores[6], 2),
    new Melhoria("Programadores duplos", "Dobra a produção dos programadores", 18.5e15, geradores[7], 2),
    // new Melhoria("Computadores duplos", "Dobra a produção dos computadores", 50000000000, geradores[8], 2),
    // new Melhoria("Cubos duplos", "Dobra a produção dos cubos", 500000000000, geradores[9], 2),
    new Melhoria("Múltiplos cursores", "Multiplica a produção dos cursores por 5", 35e3, geradores[0], 5),
    new Melhoria("Múltiplos professores", "Multiplica a produção dos professores por 5", 10.5e5, geradores[1], 5),
    new Melhoria("Múltiplos matemáticos", "Multiplica a produção dos matemáticos por 5", 4.55e7, geradores[2], 5),
    new Melhoria("Múltiplos quadros", "Multiplica a produção dos quadros por 5", 3.15e9, geradores[3], 5),
    new Melhoria("Múltiplos impressoras", "Multiplica a produção das impressoras por 5", 5.25e11, geradores[4], 5),
    new Melhoria("Múltiplos fábricas", "Multiplica a produção das fábricas por 5", 7e13, geradores[5], 5),
    new Melhoria("Múltiplos engenheiros", "Multiplica a produção dos engenheiros por 5", 8.75e15, geradores[6], 5),
    new Melhoria("Múltiplos programadores", "Multiplica a produção dos programadores por 5", 12.95e17, geradores[7], 5),
    // new Melhoria("Múltiplos computadores", "Multiplica a produção dos computadores por 5", 50000000000, geradores[8], 5),
    // new Melhoria("Múltiplos cubos", "Multiplica a produção dos cubos por 5", 5000000000, geradores[9], 5),
    new Melhoria("Super cursores", "Multiplica a produção dos cursores por 20", 28e5, geradores[0], 20),
    new Melhoria("Super professores", "Multiplica a produção dos professores por 20", 8.4e7, geradores[1], 20),
    new Melhoria("Super matemáticos", "Multiplica a produção dos matemáticos por 20", 3.64e9, geradores[2], 20),
    new Melhoria("Super quadros", "Multiplica a produção dos quadros por 20", 2.52e11, geradores[3], 20),
    new Melhoria("Super impressoras", "Multiplica a produção das impressoras por 20", 4.2e13, geradores[4], 20),
    new Melhoria("Super fábricas", "Multiplica a produção das fábricas por 20", 5.6e15, geradores[5], 20),
    new Melhoria("Super engenheiros", "Multiplica a produção dos engenheiros por 20", 7e17, geradores[6], 20),
    new Melhoria("Super programadores", "Multiplica a produção dos programadores por 20", 10.36e19, geradores[7], 20),
    // new Melhoria("Super computadores", "Multiplica a produção dos computadores por 20", 50000000000, geradores[8], 20),
    // new Melhoria("Super cubos", "Multiplica a produção dos cubos por 20", 50000000000, geradores[9], 20),
];
const melhoriasTriangulo = [
// new MelhoriaTriangulo("Melhoria Triângulo 1", "Descrição da melhoria triângulo 1", 10, () => { triangulos += 1; }),
// new MelhoriaTriangulo("Melhoria Triângulo 2", "Descrição da melhoria triângulo 2", 100, () => { triangulos += 5; }),
// new MelhoriaTriangulo("Melhoria Triângulo 3", "Descrição da melhoria triângulo 3", 1000, () => { triangulos += 10; }),
];
// #endregion
// #region main
let quadrados = 0;
let quadradosPorClique = 1;
let quadradosPorSegundo = 0;
let triangulos = 0;
let triangulosExpoenteIndex = 1;
let quadradosAscendentes = 0;
let quadradosAscendentesDesseRenascimento = 0;
let totalQuadrados = 0;
let clickAnimationTimeout = null;
function updateQuadradosValue(newValue) {
    if (newValue > quadrados) {
        totalQuadrados += newValue - quadrados;
    }
    quadrados = newValue;
    if (quadrados > 1000 ** triangulosExpoenteIndex) {
        triangulosExpoenteIndex++;
        triangulos++;
    }
    if (totalQuadrados >= getNextQuadradosAscendentesCost()) {
        quadradosAscendentes++;
    }
    updateUI();
}
function updateQuadradosPorSegundoValue() {
    quadradosPorSegundo = geradores.reduce((acc, gerador) => acc + (gerador.production * gerador.quantity), 0);
    quadradosPorSegundo *= (1 + (0.1 * quadradosAscendentesDesseRenascimento));
    updateUI();
}
function click() {
    updateQuadradosValue(quadrados + quadradosPorClique);
    quadrado.classList.add("click-animation");
    clearTimeout(clickAnimationTimeout ? clickAnimationTimeout : undefined);
    clickAnimationTimeout = setTimeout(() => {
        quadrado.classList.remove("click-animation");
    }, 150);
    updateUI();
}
function updateUI() {
    document.getElementById("quadrados").textContent = "Quadrados: " + formatNumber(quadrados);
    document.getElementById("quadradosPorClick").textContent = formatNumber(quadradosPorClique);
    document.getElementById("quadradosPorSegundo").textContent = formatNumber(quadradosPorSegundo);
    document.getElementById("triangulos").textContent = formatNumber(triangulos);
    document.getElementById("quadrados-ascendentes").textContent = formatNumber(quadradosAscendentes);
    document.getElementById("quadrados-ascendentes-faltantes").textContent = formatNumber(getNextQuadradosAscendentesCost() - totalQuadrados);
    updateGeradoresUI();
    updateMelhoriasUI();
    updateMelhoriasTrianguloUI();
}
function formatNumber(num) {
    if (num == 0) {
        return "0";
    }
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixIndex = Math.floor(Math.log10(num) / 3);
    if (suffixIndex < 0 || suffixIndex >= suffixes.length) {
        return Math.round(num / Math.pow(10, suffixIndex * 3) * 100) / 100 + suffixes[suffixes.length - 1]; // Use the last suffix if the number is too large
    }
    return Math.round(num / Math.pow(10, suffixIndex * 3) * 100) / 100 + suffixes[suffixIndex];
}
function updateMelhoriasUI() {
    const melhoriasContainer = document.getElementById("melhorias-div");
    melhoriasContainer.innerHTML = "";
    const sortedMelhorias = [...melhorias].sort((a, b) => a.price - b.price); // Sort by price
    for (const melhoria of sortedMelhorias) {
        if (melhoria.bought)
            continue; // Skip bought upgrades
        melhoriasContainer.appendChild(melhoria.createHTML());
    }
}
function updateGeradoresUI() {
    const generatorsContainer = document.getElementById("geradores-div");
    generatorsContainer.innerHTML = "";
    for (const gerador of geradores) {
        generatorsContainer.appendChild(gerador.createHTML());
    }
}
function updateMelhoriasTrianguloUI() {
    const melhoriasContainer = document.getElementById("melhorias-triangulos-div");
    melhoriasContainer.innerHTML = "";
    for (const melhoria of melhoriasTriangulo) {
        if (melhoria.bought)
            continue; // Skip bought upgrades
        melhoriasContainer.appendChild(melhoria.createHTML());
    }
}
function mudarMenu(id) {
    const menu = document.getElementById(id);
    for (const child of document.getElementById("menus").children) {
        child.style.display = "none";
    }
    if (!menu) {
        document.getElementById("botoesOutros").style.display = "flex";
        document.getElementById("botao-voltar-others").style.display = "none";
    }
    if (menu) {
        document.getElementById("botoesOutros").style.display = "none";
        document.getElementById("botao-voltar-others").style.display = "flex";
        menu.style.display = "flex";
    }
    updateUI();
}
function renascer() {
    quadrados = 0;
    quadradosPorClique = 1 * (1 + (0.1 * quadradosAscendentes));
    quadradosAscendentesDesseRenascimento = quadradosAscendentes;
    geradores.forEach(gerador => gerador.quantity = 0);
    melhorias.forEach(melhoria => melhoria.bought = false);
    document.getElementById("confirmarRenascer").style.display = "none";
    updateQuadradosPorSegundoValue();
    updateUI();
}
function getNextQuadradosAscendentesCost() {
    let valor = 100000;
    for (let i = 1; i <= quadradosAscendentes; i++) {
        valor += 100000 * (1.10 ** i);
    }
    return Math.round(valor);
}
const quadrado = document.getElementById("quadrado");
quadrado.addEventListener("click", click);
updateUI();
setInterval(() => {
    updateQuadradosValue(quadrados + quadradosPorSegundo);
    document.getElementById("quadrados").textContent = "Quadrados: " + formatNumber(quadrados);
}, 1000);
setTimeout(() => {
    changeTo("game");
}, 1000);
window.mudarMenu = mudarMenu;
window.renascer = renascer;
// #endregion
