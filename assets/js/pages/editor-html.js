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
// #region Classes, Interfaces and Types
class HTMLProject {
    root;
    classes;
    constructor() {
        this.root = new HTMLElementNode("html");
        this.classes = [];
    }
}
class HTMLElementNode {
    id;
    tag;
    attributes;
    style;
    children;
    parent;
    constructor(tag) {
        this.id = crypto.randomUUID();
        this.tag = tag;
        this.attributes = new Map();
        this.style = new Map();
        this.children = [];
        this.parent = null;
    }
    createHTMLElement() {
        const element = doc.createElement(this.tag);
        // atributos
        for (const [name, value] of this.attributes) {
            element.setAttribute(name, value);
        }
        // classes
        element.className = this.attributes.get("class") || "";
        // css inline
        for (const [name, value] of this.style) {
            element.style.setProperty(name, value);
        }
        // filhos
        for (const child of this.children) {
            if (typeof child === "string") {
                element.appendChild(doc.createTextNode(child));
                continue;
            }
            element.appendChild(child.createHTMLElement());
        }
        return element;
    }
    buildTree() {
        let details = document.createElement("details");
        details.setAttribute("data-id", this.id);
        let summary = document.createElement("summary");
        summary.innerHTML = `
        <svg viewBox="0 -960 960 960" fill="currentcolor">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
        </svg>
        ${this.tag}${this.attributes.get("id") ? `#${this.attributes.get("id")}` : ""}${this.attributes.get("class") ? `.${this.attributes.get("class")?.split(" ").join(".")}` : ""}
        `;
        summary.addEventListener("click", (e) => {
            e.stopPropagation();
            selectedElement = this;
        });
        summary.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.createFloatingWindow();
        });
        details.appendChild(summary);
        for (const child of this.children) {
            if (typeof child === "string") {
                const textNode = document.createElement("div");
                textNode.textContent = child;
                details.appendChild(textNode);
                continue;
            }
            details.appendChild(child.buildTree());
        }
        return details;
    }
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
    createFloatingWindow() {
        const removeFloatingWindow = (window) => { window.remove(); };
        const createAttributeRow = (type, name = "", value = "") => {
            const row = document.createElement("div");
            row.className = `${type}-row`;
            row.innerHTML = `
            <input class="${type}-name" type="text" placeholder="Nome" value="${name}">

            <span class="${type}-separator">:</span>

            <input class="${type}-value" type="text" placeholder="Valor" value="${value}">

            <svg class="delete-row" viewBox="0 -960 960 960" fill="currentcolor">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
            `;
            const inputs = row.querySelectorAll("input");
            for (const input of inputs) {
                input.addEventListener("input", () => {
                    const updatedMap = updateMapFromTable(type === "attribute" ? row.parentElement : row.parentElement);
                    if (type === "attribute") {
                        console.log("Updated attributes:", updatedMap);
                        this.attributes = updatedMap;
                        console.log("Current attributes:", this);
                    }
                    else {
                        this.style = updatedMap;
                    }
                    renderProject(currentProject());
                });
            }
            const deleteButton = row.querySelector(".delete-row");
            deleteButton.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                row.remove();
                const updatedMap = updateMapFromTable(type === "attribute" ? row.parentElement : row.parentElement);
                if (type === "attribute") {
                    console.log("Updated attributes:", updatedMap);
                    this.attributes = updatedMap;
                    console.log("Current attributes:", this);
                }
                else {
                    this.style = updatedMap;
                }
                renderProject(currentProject());
            });
            return row;
        };
        const updateMapFromTable = (container) => {
            let map = new Map();
            const rows = container.querySelectorAll(".attribute-row, .css-row");
            for (const row of rows) {
                const inputs = row.querySelectorAll("input");
                if (inputs.length < 2) {
                    continue;
                }
                const name = inputs[0].value.trim();
                const value = inputs[1].value.trim();
                if (!name) {
                    continue;
                }
                map.set(name, value);
            }
            return map;
        };
        const setupTable = (details, container, map, type) => {
            const addButton = details.querySelector(".add-attribute, .add-css");
            addButton?.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                container.appendChild(createAttributeRow(type));
            });
        };
        const floatingWindowsDiv = document.getElementById("janelas-flutuantes");
        const floatingWindow = document.createElement("div");
        floatingWindow.className = "janela-flutuante";
        floatingWindow.innerHTML = `
        <div class="floating-input">
            <div>
                <p>Texto</p>

                <svg viewBox="0 -960 960 960" fill="currentcolor">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
            </div>

            <textarea placeholder="Digite o texto aqui..."></textarea>

            <button>Adicionar</button>
        </div>

        <div class="janela-flutuante-header">
            <div>
                <svg viewBox="0 -960 960 960" fill="currentcolor">
                    <path
                        d="M240-280 40-480l200-200 56 56-143 144 143 144-56 56Zm178 132-76-24 200-640 76 24-200 640Zm302-132-56-56 143-144-143-144 56-56 200 200-200 200Z"/>
                </svg>

                &lt;${this.tag}&gt;
            </div>

            <svg class="close-button" viewBox="0 -960 960 960" fill="currentcolor">
                <path
                    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
        </div>

        <div class="separador-horizontal"></div>
        `;
        windowsElementMap.set(floatingWindow, this);
        floatingWindowsDiv.appendChild(floatingWindow);
        const floatingInput = floatingWindow.querySelector(".floating-input");
        const closeButton = floatingWindow.querySelector(".close-button");
        const closeTextInputButton = floatingWindow.querySelector(".floating-input svg");
        const addTextButton = floatingWindow.querySelector(".floating-input button");
        closeButton.addEventListener("click", () => { removeFloatingWindow(floatingWindow); });
        closeTextInputButton.addEventListener("click", () => { floatingInput.style.display = "none"; });
        addTextButton.addEventListener("click", () => {
            const textarea = floatingWindow.querySelector(".floating-input textarea");
            const text = textarea.value;
            if (!text) {
                return;
            }
            this.children.push(text);
            textarea.value = "";
            floatingInput.style.display = "none";
            updateFloatingWindow(floatingWindow);
            rederTrees();
            renderProject(currentProject());
        });
        const scrollDiv = document.createElement("div");
        scrollDiv.classList.add("janela-flutuante-scroll");
        floatingWindow.appendChild(scrollDiv);
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("janela-flutuante-conteudo");
        scrollDiv.appendChild(contentDiv);
        const propriedadesDetails = document.createElement("details");
        propriedadesDetails.innerHTML = `
        <summary>
            <div>
                <svg viewBox="0 -960 960 960" fill="currentcolor">
                    <path
                        d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"
                    />
                </svg>

                Propriedades
            </div>
        </summary>

        <div>
            <label>
                Tag:
                <input type="text" value="${this.tag}">
            </label>

            <label>
                Parent:
                <input
                    type="text"
                    value="${this.parent?.tag || "null"}"
                    disabled
                >
            </label>
        </div>
        `;
        contentDiv.appendChild(propriedadesDetails);
        const conteudoDetails = document.createElement("details");
        conteudoDetails.innerHTML = `
        <summary>
            <div>
                <svg viewBox="0 -960 960 960" fill="currentcolor">
                    <path
                        d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"
                    />
                </svg>

                Conteúdo
            </div>
        </summary>

        <div>
            <div class="filhos-container"></div>

            <button class="adicionar-texto">
                <svg viewBox="0 -960 960 960" fill="currentcolor">
                    <path
                        d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
                    />
                </svg>

                Adicionar texto
            </button>
        </div>
        `;
        contentDiv.appendChild(conteudoDetails);
        const filhosContainer = conteudoDetails.querySelector(".filhos-container");
        for (const child of this.children) {
            const div = document.createElement("div");
            div.innerHTML = `
            <svg viewBox="0 -960 960 960" fill="currentcolor">
                <path
                    d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
            </svg>

            ${child instanceof HTMLElementNode ? `&lt;${child.tag}&gt;` : child}
            `;
            filhosContainer.appendChild(div);
        }
        const adicionarTextoButton = conteudoDetails.querySelector(".adicionar-texto");
        adicionarTextoButton.addEventListener("click", () => { floatingInput.style.display = "block"; });
        const atributosDetails = document.createElement("details");
        atributosDetails.innerHTML = `
        <summary>
            <div class="details-title">
                <svg class="details-arrow" viewBox="0 -960 960 960" fill="currentcolor">
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                </svg>

                <span>Atributos</span>
            </div>
        </summary>

        <div class="attributes-list"></div>

        <button class="add-attribute" type="button">
            <svg viewBox="0 -960 960 960" fill="currentcolor">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>

            Adicionar atributo
        </button>
        `;
        contentDiv.appendChild(atributosDetails);
        const atributosContainer = atributosDetails.querySelector(".attributes-list");
        for (const [name, value] of this.attributes) {
            atributosContainer.appendChild(createAttributeRow("attribute", name, value));
        }
        setupTable(atributosDetails, atributosContainer, this.attributes, "attribute");
        const cssDetails = document.createElement("details");
        cssDetails.innerHTML = `
        <summary>
            <div class="details-title">
                <svg class="details-arrow" viewBox="0 -960 960 960" fill="currentcolor">
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                </svg>

                <span>Estilos CSS</span>
            </div>
        </summary>

        <div class="css-list"></div>

        <button class="add-css" type="button">
            <svg viewBox="0 -960 960 960" fill="currentcolor">
                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>

            Adicionar atributo
        </button>
        `;
        contentDiv.appendChild(cssDetails);
        const cssContainer = cssDetails.querySelector(".css-list");
        for (const [name, value] of this.style) {
            cssContainer.appendChild(createAttributeRow("css", name, value));
        }
        setupTable(cssDetails, cssContainer, this.style, "css");
        const deleteWindowButton = document.createElement("button");
        deleteWindowButton.className = "delete-window";
        deleteWindowButton.innerHTML = `
        <svg class="delete-icon" viewBox="0 -960 960 960" fill="currentcolor">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
        Deletar componente
        `;
        deleteWindowButton.addEventListener("click", () => {
            this.parent?.children.splice(this.parent.children.indexOf(this), 1);
            removeFloatingWindow(floatingWindow);
            renderProject(currentProject());
            rederTrees();
        });
        contentDiv.appendChild(deleteWindowButton);
        const header = floatingWindow.querySelector(".janela-flutuante-header");
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        header.addEventListener("pointerdown", (event) => {
            const target = event.target;
            if (target.closest(".close-button")) {
                return;
            }
            const rect = floatingWindow.getBoundingClientRect();
            const x = rect.left;
            const y = rect.top;
            floatingWindow.style.transform = "none";
            floatingWindow.style.left = `${x}px`;
            floatingWindow.style.top = `${y}px`;
            offsetX = event.clientX - x;
            offsetY = event.clientY - y;
            isDragging = true;
            header.setPointerCapture(event.pointerId);
        });
        header.addEventListener("pointermove", (event) => {
            if (!isDragging) {
                return;
            }
            floatingWindow.style.left = `${event.clientX - offsetX}px`;
            floatingWindow.style.top = `${event.clientY - offsetY}px`;
        });
        const stopDragging = (event) => {
            if (!isDragging) {
                return;
            }
            isDragging = false;
            if (header.hasPointerCapture(event.pointerId)) {
                header.releasePointerCapture(event.pointerId);
            }
        };
        header.addEventListener("pointerup", stopDragging);
        header.addEventListener("pointercancel", () => {
            isDragging = false;
        });
        floatingWindow.tabIndex = -1;
        floatingWindow.focus();
        floatingWindow.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "Backspace") {
                event.preventDefault();
                floatingWindow.remove();
            }
        });
    }
    static addElementToSelectedElement(tag) {
        const node = new HTMLElementNode(tag);
        selectedElement?.addChild(node);
        node.parent = selectedElement;
        search.value = "";
        renderProject(currentProject());
        selectedElement = node;
    }
}
class CSSClass {
    name;
    properties;
    constructor(name) {
        this.name = name;
        this.properties = new Map();
    }
}
const projects = [new HTMLProject()];
let currentProjectIndex = 0;
currentRoot().addChild(new HTMLElementNode("head"));
currentRoot().addChild(new HTMLElementNode("body"));
let selectedElement = currentRoot().children[1]; // Seleciona o <body> por padrão
function currentProject() {
    return projects[currentProjectIndex];
}
function currentRoot() {
    return currentProject().root;
}
// #endregion
// #region Dashboard
const cssData = await fetch("/assets/jsons/css-data.json").then(r => r.json());
const htmlData = await fetch("/assets/jsons/html-data.json").then(r => r.json());
const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const tooltip = document.getElementById("tooltip");
const iframeContainer = document.getElementById("iframe-camera");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const zoomInput = document.getElementById("zoom");
const iframeArea = document.getElementById("iframe-area");
const camera = document.getElementById("iframe-camera");
const iframe = document.getElementById("visualizacao");
const windowsElementMap = new WeakMap();
const doc = iframe.contentDocument;
doc.body.innerHTML = ``;
let draggingCamera = false;
let cameraX = 0;
let cameraY = 0;
let zoom = 0.3;
let lastMouseX = 0;
let lastMouseY = 0;
let pointerId = null;
function renderSuggestions(tags) {
    suggestions.replaceChildren();
    for (const tag of tags) {
        const div = document.createElement("div");
        div.className = "suggestion";
        div.innerHTML = `
            <span class="tag">&lt;${tag}&gt;</span>
        `;
        div.onclick = () => {
            suggestions.replaceChildren();
            search.value = "";
            tooltip.style.display = "none";
            HTMLElementNode.addElementToSelectedElement(tag);
            rederTrees();
        };
        div.addEventListener("mouseenter", e => {
            tooltip.textContent = htmlData[tag].description || "Sem descrição disponível.";
            tooltip.style.display = "block";
        });
        div.addEventListener("mousemove", e => {
            const rect = div.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            tooltip.style.display = "block";
            let left = rect.right + 8;
            let top = rect.top + (rect.height - tooltipRect.height) / 2;
            if (left + tooltipRect.width > window.innerWidth) {
                left = rect.left - tooltipRect.width - 8;
            }
            if (top + tooltipRect.height > window.innerHeight) {
                top = window.innerHeight - tooltipRect.height - 8;
            }
            if (top < 8) {
                top = 8;
            }
            top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8));
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        });
        div.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
        suggestions.appendChild(div);
    }
}
function renderProject(project) {
    doc.head.replaceChildren();
    doc.body.replaceChildren();
    for (const child of project.root.children) {
        if (typeof child === "string")
            continue;
        if (child.tag === "head") {
            for (const headChild of child.children) {
                if (typeof headChild === "string") {
                    doc.head.appendChild(doc.createTextNode(headChild));
                }
                else {
                    doc.head.appendChild(headChild.createHTMLElement());
                }
            }
            continue;
        }
        if (child.tag === "body") {
            for (const bodyChild of child.children) {
                if (typeof bodyChild === "string") {
                    doc.body.appendChild(doc.createTextNode(bodyChild));
                }
                else {
                    doc.body.appendChild(bodyChild.createHTMLElement());
                }
            }
        }
    }
}
function rederTrees() {
    function getDetailsId(details) {
        const id = details.getAttribute("data-id");
        return id || "";
    }
    function buildPath(parentPath, details) {
        const label = getDetailsId(details);
        return parentPath ? `${parentPath}/${label}` : label;
    }
    function saveExpanded(root, parentPath, opened) {
        for (const child of Array.from(root.children)) {
            if (child.tagName !== "DETAILS")
                continue;
            const details = child;
            const childPath = buildPath(parentPath, details);
            if (details.open) {
                opened.add(childPath);
            }
            saveExpanded(details, childPath, opened);
        }
    }
    function restoreExpanded(root, parentPath, opened) {
        for (const child of Array.from(root.children)) {
            if (child.tagName !== "DETAILS")
                continue;
            const details = child;
            const childPath = buildPath(parentPath, details);
            if (opened.has(childPath)) {
                details.open = true;
            }
            restoreExpanded(details, childPath, opened);
        }
    }
    const rightSide = document.getElementById("dashboard-direita");
    const previousTree = rightSide.querySelector("div#tree");
    const opened = new Set();
    if (previousTree) {
        saveExpanded(previousTree, "", opened);
    }
    rightSide.replaceChildren();
    previousTree.appendChild(currentProject().root.buildTree());
    const div = document.createElement("div");
    div.id = "tree";
    div.appendChild(currentRoot().buildTree());
    rightSide.appendChild(div);
    restoreExpanded(div, "", opened);
    const janelas = document.getElementById("janelas-flutuantes");
    janelas.querySelectorAll(".janela-flutuante").forEach(updateFloatingWindow);
}
function updateFloatingWindow(janela) {
    const element = windowsElementMap.get(janela);
    if (!element)
        return;
    const filhosContainer = janela.querySelector(".filhos-container");
    if (!filhosContainer)
        return;
    filhosContainer.replaceChildren();
    for (const child of element.children) {
        const div = document.createElement("div");
        div.innerHTML = `
        <svg viewBox="0 -960 960 960" fill="currentcolor">
            <path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
        </svg>
        ${child instanceof HTMLElementNode ? `&lt;${child.tag}&gt;` : child}
        `;
        filhosContainer.appendChild(div);
    }
}
function updateIframeSize() {
    iframeContainer.style.width = `${widthInput.value}px`;
    iframeContainer.style.height = `${heightInput.value}px`;
}
function renderCamera() {
    camera.style.transformOrigin = "0 0";
    camera.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${cameraX}, ${cameraY})`;
}
function zoomCamera(event, mouseX, mouseY) {
    event.preventDefault();
    const worldX = (mouseX - cameraX) / zoom;
    const worldY = (mouseY - cameraY) / zoom;
    const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1;
    zoom *= factor;
    zoom = Math.max(0.01, Math.min(zoom, 10));
    zoom = Math.round(zoom * 1000) / 1000;
    cameraX = mouseX - worldX * zoom;
    cameraY = mouseY - worldY * zoom;
    zoomInput.value = (zoom * 100).toString();
    renderCamera();
}
search.addEventListener("input", () => {
    const text = search.value.trim().toLowerCase();
    if (text === "") {
        suggestions.replaceChildren();
        return;
    }
    const results = Object.keys(htmlData).filter(tag => tag.startsWith(text)).slice(0, 20);
    renderSuggestions(results);
});
search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        if (search.value.trim() === "")
            return;
        const tag = search.value.trim().toLowerCase();
        search.value = "";
        suggestions.replaceChildren();
        tooltip.style.display = "none";
        HTMLElementNode.addElementToSelectedElement(tag);
        rederTrees();
    }
});
iframeArea.addEventListener("pointerdown", (event) => {
    if (event.button !== 0)
        return;
    draggingCamera = true;
    pointerId = event.pointerId;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    iframeArea.setPointerCapture(event.pointerId);
});
iframeArea.addEventListener("pointermove", (event) => {
    if (!draggingCamera)
        return;
    if (event.pointerId !== pointerId)
        return;
    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;
    cameraX += dx;
    cameraY += dy;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    renderCamera();
});
iframeArea.addEventListener("pointerup", (event) => {
    if (event.pointerId !== pointerId)
        return;
    draggingCamera = false;
    pointerId = null;
    iframeArea.releasePointerCapture(event.pointerId);
});
iframeArea.addEventListener("pointercancel", () => {
    draggingCamera = false;
    pointerId = null;
});
iframe.addEventListener("load", () => {
    const iframeDocument = iframe.contentDocument;
    iframeDocument.addEventListener("pointerdown", (event) => {
        if (event.button !== 0)
            return;
        draggingCamera = true;
        pointerId = event.pointerId;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        iframeDocument.documentElement.setPointerCapture(event.pointerId);
    });
});
iframeArea.addEventListener("wheel", (event) => {
    const rect = iframeArea.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    zoomCamera(event, mouseX, mouseY);
}, { passive: false });
iframe.addEventListener("load", () => {
    const iframeDocument = iframe.contentDocument;
    iframeDocument.addEventListener("wheel", (event) => {
        const iframeRect = iframe.getBoundingClientRect();
        const areaRect = iframeArea.getBoundingClientRect();
        const mouseX = iframeRect.left + event.clientX - areaRect.left;
        const mouseY = iframeRect.top + event.clientY - areaRect.top;
        zoomCamera(event, mouseX, mouseY);
    }, { passive: false });
});
// #endregion
setTimeout(() => {
    changeTo("dashboard");
}, 200);
widthInput.addEventListener("input", updateIframeSize);
heightInput.addEventListener("input", updateIframeSize);
zoomInput.addEventListener("input", () => {
    zoom = parseFloat(zoomInput.value) / 100;
    renderCamera();
});
const esquerda = document.getElementById("dashboard-esquerda");
const direita = document.getElementById("dashboard-direita");
const separador1 = document.querySelector(".separador-vertical");
const separador2 = document.getElementById("resizer2");
let redimensionando1 = false;
let redimensionando2 = false;
separador1.addEventListener("mousedown", () => {
    redimensionando1 = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
});
separador2.addEventListener("mousedown", () => {
    redimensionando2 = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
});
document.addEventListener("mouseup", () => {
    redimensionando1 = false;
    redimensionando2 = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
});
document.addEventListener("mousemove", (e) => {
    if (!redimensionando1 && !redimensionando2)
        return;
    const novaLargura = e.clientX;
    if (novaLargura >= 75 && novaLargura <= 600 && redimensionando1) {
        esquerda.style.width = `${novaLargura}px`;
    }
    else if (novaLargura >= 75 && novaLargura <= 600 && redimensionando2) {
        direita.style.width = `${window.innerWidth - novaLargura}px`;
    }
});
updateIframeSize();
renderCamera();
rederTrees();
export {};
