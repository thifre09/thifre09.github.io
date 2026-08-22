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
    constructor(name, description, price, affectedGenerator, productionIncrease) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.affectedGenerator = affectedGenerator;
        this.productionIncrease = productionIncrease;
        this.bought = false;
    }
    createHTML() {
        const container = document.createElement("div");
        container.classList.add("melhoria");
        container.addEventListener("click", () => this.buy());
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
        this.affectedGenerator.production *= this.productionIncrease;
        updateUI();
    }
}
const geradores = [
    new Gerador("Gerador 1", 10, 1),
    new Gerador("Gerador 2", 100, 5),
    new Gerador("Gerador 1", 10, 1),
    new Gerador("Gerador 2", 100, 5),
    new Gerador("Gerador 1", 10, 1),
    new Gerador("Gerador 2", 100, 5),
    new Gerador("Gerador 1", 10, 1),
    new Gerador("Gerador 2", 100, 5),
    new Gerador("Gerador 1", 10, 1),
    new Gerador("Gerador 2", 100, 5),
    new Gerador("Gerador 1", 10, 1),
    new Gerador("Gerador 2", 100, 5),
];
const melhorias = [
    new Melhoria("Melhoria 1", "Descrição da melhoria 1", 10, geradores[0], 1),
    new Melhoria("Melhoria 2", "Descrição da melhoria 2", 100, geradores[1], 2),
    new Melhoria("Melhoria 3", "Descrição da melhoria 3", 1000, geradores[2], 3),
];
// #endregion
// #region main
let quadrados = 0;
let quadradosPorClique = 1;
let quadradosPorSegundo = 1;
let triangulos = 0;
let clickAnimationTimeout = null;
function click() {
    quadrados += quadradosPorClique;
    quadrado.classList.add("click-animation");
    clearTimeout(clickAnimationTimeout ? clickAnimationTimeout : undefined);
    clickAnimationTimeout = setTimeout(() => {
        quadrado.classList.remove("click-animation");
    }, 150);
    updateUI();
}
function updateUI() {
    document.getElementById("quadrados").textContent = "Quadrados: " + formatNumber(quadrados);
    updateGeradoresUI();
    updateMelhoriasUI();
    document.getElementById("quadradosPorClick").textContent = formatNumber(quadradosPorClique);
    document.getElementById("quadradosPorSegundo").textContent = formatNumber(quadradosPorSegundo);
    document.getElementById("triangulos").textContent = formatNumber(triangulos);
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
    for (const melhoria of melhorias) {
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
const quadrado = document.getElementById("quadrado");
quadrado.addEventListener("click", click);
updateUI();
setInterval(() => {
    quadrados += quadradosPorSegundo;
    updateUI();
}, 1000);
setTimeout(() => {
    changeTo("game");
}, 200);
// #endregion
