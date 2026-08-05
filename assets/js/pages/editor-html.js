"use strict";
// #region Change interface terminal
const buttonChangeToDashboard = document.getElementById("button-header-dashboard");
const buttonChangeToCodigo = document.getElementById("button-header-codigo");
const buttonChangeToSave = document.getElementById("button-header-save");
const buttonChangeToHelp = document.getElementById("button-header-help");
const navBar = document.getElementById("nav-bar");
/**
 * Atualiza a posição e a largura do indicador da interface ativa.
 * @param activeButton - Botão atualmente selecionado.
 */
function updateInterfaceTerminalIndicator(activeButton) {
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
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("codigo").style.display = "none";
    document.getElementById("save").style.display = "none";
    document.getElementById("help").style.display = "none";
    document.getElementById(id).style.display = "flex";
    document.querySelector(".nav-bar-ativo")?.classList.remove("nav-bar-ativo");
    switch (id) {
        case "dashboard":
            buttonChangeToDashboard.classList.add("nav-bar-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToDashboard);
            break;
        case "codigo":
            buttonChangeToCodigo.classList.add("nav-bar-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToCodigo);
            break;
        case "save":
            buttonChangeToSave.classList.add("nav-bar-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToSave);
            break;
        case "help":
            buttonChangeToHelp.classList.add("nav-bar-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToHelp);
            break;
    }
}
buttonChangeToDashboard.addEventListener("click", () => {
    changeTo("dashboard");
});
buttonChangeToCodigo.addEventListener("click", () => {
    changeTo("codigo");
});
buttonChangeToSave.addEventListener("click", () => {
    changeTo("save");
});
buttonChangeToHelp.addEventListener("click", () => {
    changeTo("help");
});
// #endregion
// #region Classes
class HTMLProject {
    constructor() {
        this.root = new HTMLElementNode("html");
        this.classes = [];
    }
}
class HTMLElementNode {
    constructor(tag) {
        this.id = HTMLElementNode.nextId++;
        this.tag = tag;
        this.attributes = new Map();
        this.style = new Map();
        this.classes = [];
        this.children = [];
        this.parent = null;
    }
}
HTMLElementNode.nextId = 1;
class CSSClass {
    constructor(name) {
        this.name = name;
        this.properties = new Map();
    }
}
// #endregion
setTimeout(() => {
    changeTo("dashboard");
}, 200);
