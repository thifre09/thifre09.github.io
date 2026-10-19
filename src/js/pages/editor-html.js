import { setupTabNavigation, setupSaveLoadUI } from "../others/global.js";
import * as Auth from "../supabase/auth.js";
import { supabase } from "../supabase/client.js";
import * as monaco from "monaco-editor";
setupTabNavigation({
    menus: ["dashboard", "codigo", "save", "help"],
    initial: "dashboard",
});
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
        <div>
            <svg viewBox="0 -960 960 960" fill="currentcolor">
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
            </svg>
            ${this.tag}${this.attributes.get("id") ? `#${this.attributes.get("id")}` : ""}${this.attributes.get("class") ? `.${this.attributes.get("class")?.split(" ").join(".")}` : ""}
        </div>

        <svg class="add-tag-svg" viewBox="0 -960 960 960" fill="currentcolor">
            <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
        </svg>
        `;
        summary.addEventListener("click", (e) => {
            e.stopPropagation();
            selectedElement = this;
            document.querySelector(".selected-element")?.classList.remove("selected-element");
            summary.classList.add("selected-element");
        });
        summary.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            this.createFloatingWindow();
        });
        if (selectedElement === this) {
            summary.classList.add("selected-element");
        }
        details.appendChild(summary);
        const addTagSvg = summary.querySelector(".add-tag-svg");
        addTagSvg.addEventListener("click", (e) => {
            if (details.open) {
                e.preventDefault();
            }
            selectedElement = this;
            document.getElementById("create-tag").style.display = "block";
            document.querySelector(".selected-element")?.classList.remove("selected-element");
            summary.classList.add("selected-element");
        });
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
    moveChild(fromIndex, toIndex, moveToEnd = false) {
        if (fromIndex === toIndex && !moveToEnd) {
            return;
        }
        const [child] = this.children.splice(fromIndex, 1);
        if (child === undefined) {
            return;
        }
        const targetIndex = moveToEnd
            ? this.children.length
            : fromIndex < toIndex
                ? toIndex - 1
                : toIndex;
        this.children.splice(Math.max(0, Math.min(targetIndex, this.children.length)), 0, child);
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
                const updatedMap = updateMapFromTable(row.parentElement);
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
                        d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                </svg>
                Propriedades
            </div>
        </summary>

        <div>
            <label>
                Tag:
                <input class="tag-input" type="text" value="${this.tag}">
            </label>

            <label>
                Parent:
                <input class="parent-input" type="text" value="${this.parent?.tag || "null"}" disabled>
            </label>
        </div>
        `;
        contentDiv.appendChild(propriedadesDetails);
        const tagInput = propriedadesDetails.querySelector(".tag-input");
        tagInput.addEventListener("input", () => {
            const newTag = tagInput.value.trim();
            if (newTag) {
                this.tag = newTag;
                updateFloatingWindow(floatingWindow);
                rederTrees();
                renderProject(currentProject());
            }
        });
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
                        d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
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
        const isDocumentStructure = this.tag === "html"
            || (this.parent === currentProject().root && (this.tag === "head" || this.tag === "body"));
        deleteWindowButton.addEventListener("click", () => {
            if (isDocumentStructure) {
                return;
            }
            this.parent?.children.splice(this.parent.children.indexOf(this), 1);
            removeFloatingWindow(floatingWindow);
            renderProject(currentProject());
            rederTrees();
        });
        if (!isDocumentStructure) {
            contentDiv.appendChild(deleteWindowButton);
        }
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
        updateFloatingWindow(floatingWindow);
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
        document.getElementById("create-tag").style.display = "none";
        renderProject(currentProject());
        selectedElement = node;
        document.querySelector(".selected-element")?.classList.remove("selected-element");
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
// #region Tudo :)
const cssData = await fetch("/assets/jsons/css-data.json").then(r => r.json());
const htmlData = await fetch("/assets/jsons/html-data.json").then(r => r.json());
monaco.languages.registerCompletionItemProvider("css", {
    triggerCharacters: ["-"],
    provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position);
        const range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
        return {
            suggestions: Object.keys(cssData.properties).map(property => ({
                label: property,
                kind: monaco.languages.CompletionItemKind.Property,
                insertText: property,
                range,
            })),
        };
    },
});
monaco.languages.registerCompletionItemProvider("html", {
    triggerCharacters: ["<", " ", "/"],
    provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position);
        const range = new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn);
        return {
            suggestions: Object.keys(htmlData).map(tag => ({
                label: tag,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: tag,
                range,
            })),
        };
    },
});
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
const closeCreateTagButton = document.getElementById("close-create-tag");
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
    if (project.classes.length > 0) {
        const style = doc.createElement("style");
        style.textContent = project.classes
            .map(cssClass => {
            const properties = Array.from(cssClass.properties)
                .map(([name, value]) => `  ${name}: ${value};`)
                .join("\n");
            return `${cssClass.name} {\n${properties}\n}`;
        })
            .join("\n\n");
        doc.head.appendChild(style);
    }
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
    renderCodePanel();
}
let activeCodeTab = "html";
let codeEditor = null;
function getCodeValue() {
    return codeEditor?.getValue() || "";
}
function setCodeValue(value) {
    if (codeEditor && codeEditor.getValue() !== value) {
        codeEditor.setValue(value);
    }
}
function escapeCode(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function serializeNode(node, level = 0) {
    const indentation = "  ".repeat(level);
    const attributes = Array.from(node.attributes)
        .map(([name, value]) => ` ${name}="${escapeCode(value)}"`)
        .join("");
    const inlineStyle = Array.from(node.style)
        .map(([name, value]) => `${name}: ${value};`)
        .join(" ");
    const styleAttribute = inlineStyle ? ` style="${escapeCode(inlineStyle)}"` : "";
    const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
    if (voidTags.has(node.tag)) {
        return `${indentation}<${node.tag}${attributes}${styleAttribute}>`;
    }
    if (node.children.length === 0) {
        return `${indentation}<${node.tag}${attributes}${styleAttribute}></${node.tag}>`;
    }
    const children = node.children.map(child => {
        if (typeof child === "string") {
            return `${"  ".repeat(level + 1)}${escapeCode(child)}`;
        }
        return serializeNode(child, level + 1);
    }).join("\n");
    return `${indentation}<${node.tag}${attributes}${styleAttribute}>\n${children}\n${indentation}</${node.tag}>`;
}
function getHtmlCode(project) {
    return `<!DOCTYPE html>\n${serializeNode(project.root)}`;
}
function nodeFromElement(element, parent = null) {
    const node = new HTMLElementNode(element.tagName.toLowerCase());
    node.parent = parent;
    for (const attribute of Array.from(element.attributes)) {
        if (attribute.name === "style") {
            for (const declaration of attribute.value.split(";")) {
                const separator = declaration.indexOf(":");
                if (separator === -1)
                    continue;
                const name = declaration.slice(0, separator).trim();
                const value = declaration.slice(separator + 1).trim();
                if (name)
                    node.style.set(name, value);
            }
            continue;
        }
        node.attributes.set(attribute.name, attribute.value);
    }
    for (const child of Array.from(element.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim();
            if (text)
                node.children.push(text);
        }
        else if (child.nodeType === Node.ELEMENT_NODE) {
            node.children.push(nodeFromElement(child, node));
        }
    }
    return node;
}
function parseHtmlCode(value) {
    const parsed = new DOMParser().parseFromString(value, "text/html");
    if (parsed.querySelector("parsererror")) {
        throw new Error("HTML inválido.");
    }
    return nodeFromElement(parsed.documentElement);
}
function parseCssCode(value) {
    const classes = [];
    const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
    let match;
    let consumed = "";
    while ((match = rulePattern.exec(value)) !== null) {
        const selector = match[1].trim();
        if (!selector || selector.startsWith("@"))
            continue;
        const cssClass = new CSSClass(selector);
        for (const declaration of match[2].split(";")) {
            const separator = declaration.indexOf(":");
            if (separator === -1)
                continue;
            const name = declaration.slice(0, separator).trim();
            const propertyValue = declaration.slice(separator + 1).trim();
            if (name && propertyValue)
                cssClass.properties.set(name, propertyValue);
        }
        classes.push(cssClass);
        consumed += match[0];
    }
    if (!classes.length && value.trim())
        throw new Error("CSS inválido ou sem regras.");
    if (value.replace(/\/\*[^]*?\*\//g, "").replace(/\s/g, "") && !consumed.trim()) {
        throw new Error("CSS inválido ou sem regras.");
    }
    return classes;
}
function applyCodeChanges(code) {
    try {
        if (activeCodeTab === "html") {
            const root = parseHtmlCode(code);
            const head = root.children.find(child => typeof child !== "string" && child.tag === "head");
            const body = root.children.find(child => typeof child !== "string" && child.tag === "body");
            if (!head || typeof head === "string" || !body || typeof body === "string") {
                throw new Error("O HTML precisa conter <head> e <body>.");
            }
            currentProject().root = root;
            selectedElement = body;
            rederTrees();
        }
        else {
            currentProject().classes = parseCssCode(code);
            renderCssEditor();
        }
        renderProject(currentProject());
    }
    catch (error) {
        window.alert(error instanceof Error ? error.message : "Não foi possível aplicar o código.");
    }
}
function getCssCode(project) {
    return project.classes.map(cssClass => {
        const properties = Array.from(cssClass.properties)
            .map(([name, value]) => `  ${name}: ${value};`)
            .join("\n");
        return `${cssClass.name} {\n${properties}\n}`;
    }).join("\n\n");
}
function renderCodePanel() {
    const panel = document.getElementById("codigo");
    const codeContainer = document.getElementById("codigo-conteudo");
    const htmlTab = document.getElementById("codigo-tab-html");
    const cssTab = document.getElementById("codigo-tab-css");
    const formatButton = document.getElementById("codigo-formatar");
    const applyButton = document.getElementById("codigo-aplicar");
    const copyButton = document.getElementById("codigo-copy");
    if (!panel || !codeContainer || !htmlTab || !cssTab || !formatButton || !applyButton || !copyButton)
        return;
    if (panel.dataset.initialized !== "true") {
        const htmlModel = monaco.editor.createModel(getHtmlCode(currentProject()), "html");
        const cssModel = monaco.editor.createModel(getCssCode(currentProject()), "css");
        codeEditor = monaco.editor.create(codeContainer, {
            model: activeCodeTab === "html" ? htmlModel : cssModel,
            automaticLayout: true,
            fontSize: 14,
            wordWrap: "on",
            tabSize: 4,
            theme: "vs-dark",
        });
        htmlTab.addEventListener("click", () => {
            activeCodeTab = "html";
            renderCodePanel();
        });
        cssTab.addEventListener("click", () => {
            activeCodeTab = "css";
            renderCodePanel();
        });
        formatButton.addEventListener("click", () => {
            try {
                if (activeCodeTab === "html") {
                    setCodeValue(getHtmlCode({ ...currentProject(), root: parseHtmlCode(getCodeValue()) }));
                }
                else {
                    setCodeValue(getCssCode({ ...currentProject(), classes: parseCssCode(getCodeValue()) }));
                }
            }
            catch (error) {
                window.alert(error instanceof Error ? error.message : "Não foi possível formatar o código.");
            }
        });
        applyButton.addEventListener("click", () => applyCodeChanges(getCodeValue()));
        copyButton.addEventListener("click", async () => {
            await navigator.clipboard.writeText(getCodeValue());
            copyButton.textContent = "Copiado";
            setTimeout(() => copyButton.textContent = "Copiar", 1000);
        });
        panel.dataset.initialized = "true";
    }
    const model = codeEditor.getModel();
    const nextModel = activeCodeTab === "html"
        ? monaco.editor.getModels().find(item => item.getLanguageId() === "html")
        : monaco.editor.getModels().find(item => item.getLanguageId() === "css");
    if (model !== nextModel)
        codeEditor.setModel(nextModel);
    setCodeValue(activeCodeTab === "html" ? getHtmlCode(currentProject()) : getCssCode(currentProject()));
    htmlTab.classList.toggle("codigo-aba-ativa", activeCodeTab === "html");
    cssTab.classList.toggle("codigo-aba-ativa", activeCodeTab === "css");
}
function renderCssEditor() {
    const selectorInput = document.querySelector("#dashboard-direita .css-selector input");
    const rulesContainer = document.querySelector("#dashboard-direita .css-rules");
    rulesContainer.replaceChildren();
    for (const cssClass of currentProject().classes) {
        const rule = document.createElement("div");
        rule.className = "css-rule";
        rule.innerHTML = `
            <div class="css-rule-header">
                <span class="css-rule-selector"></span>
                <button class="css-delete-rule" type="button" title="Deletar seletor">×</button>
            </div>
            <div class="css-properties"></div>
        `;
        rule.querySelector(".css-rule-selector").textContent = cssClass.name;
        rule.querySelector(".css-delete-rule").addEventListener("click", () => {
            const classIndex = currentProject().classes.indexOf(cssClass);
            if (classIndex !== -1) {
                currentProject().classes.splice(classIndex, 1);
            }
            renderCssEditor();
            renderProject(currentProject());
        });
        const properties = rule.querySelector(".css-properties");
        for (const [name, value] of cssClass.properties) {
            appendCssProperty(properties, cssClass, name, value);
        }
        const addButton = document.createElement("button");
        addButton.className = "css-add-property";
        addButton.type = "button";
        addButton.textContent = "+ adicionar propriedade";
        addButton.addEventListener("click", () => {
            const property = appendCssProperty(properties, cssClass);
            property.querySelector(".css-property-name")?.focus();
        });
        properties.appendChild(addButton);
        rulesContainer.appendChild(rule);
    }
    selectorInput.onkeydown = event => {
        if (event.key !== "Enter") {
            return;
        }
        const selector = selectorInput.value.trim();
        if (!selector || currentProject().classes.some(cssClass => cssClass.name === selector)) {
            return;
        }
        currentProject().classes.push(new CSSClass(selector));
        selectorInput.value = "";
        renderCssEditor();
        renderProject(currentProject());
    };
    function appendCssProperty(container, cssClass, name = "", value = "") {
        const property = document.createElement("div");
        property.className = "css-property";
        property.innerHTML = `
            <input class="css-property-name" value="${name}" placeholder="propriedade">
            <input class="css-property-value" value="${value}" placeholder="valor">
            <button class="css-delete-property" type="button" title="Deletar propriedade">×</button>
        `;
        const nameInput = property.querySelector(".css-property-name");
        const valueInput = property.querySelector(".css-property-value");
        const deleteButton = property.querySelector(".css-delete-property");
        let propertyKey = name;
        const updateProperty = () => {
            const propertyName = nameInput.value.trim();
            if (propertyKey && propertyKey !== propertyName) {
                cssClass.properties.delete(propertyKey);
            }
            if (propertyName) {
                cssClass.properties.set(propertyName, valueInput.value.trim());
                propertyKey = propertyName;
            }
            renderProject(currentProject());
        };
        nameInput.addEventListener("input", updateProperty);
        valueInput.addEventListener("input", updateProperty);
        deleteButton.addEventListener("click", () => {
            if (propertyKey) {
                cssClass.properties.delete(propertyKey);
            }
            property.remove();
            renderProject(currentProject());
        });
        const addButton = container.querySelector(".css-add-property");
        container.insertBefore(property, addButton);
        return property;
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
    const leftSide = document.getElementById("dashboard-esquerda");
    const previousTree = leftSide.querySelector("div#tree");
    const opened = new Set();
    if (previousTree) {
        saveExpanded(previousTree, "", opened);
    }
    leftSide.replaceChildren();
    const div = document.createElement("div");
    div.id = "tree";
    div.appendChild(currentRoot().buildTree());
    leftSide.appendChild(div);
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
    let draggedChildIndex = null;
    const refreshFloatingWindow = () => {
        updateFloatingWindow(janela);
        rederTrees();
        renderProject(currentProject());
    };
    filhosContainer.ondragover = (event) => {
        event.preventDefault();
    };
    filhosContainer.ondrop = (event) => {
        event.preventDefault();
        if (draggedChildIndex === null) {
            return;
        }
        const target = event.target;
        if (target.closest("[data-child-index]")) {
            return;
        }
        element.moveChild(draggedChildIndex, element.children.length, true);
        draggedChildIndex = null;
        refreshFloatingWindow();
    };
    for (const [index, child] of element.children.entries()) {
        const div = document.createElement("div");
        div.draggable = true;
        div.dataset.childIndex = index.toString();
        div.innerHTML = `
        <svg viewBox="0 -960 960 960" fill="currentcolor">
            <path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
        </svg>
        ${child instanceof HTMLElementNode ? `&lt;${child.tag}&gt;` : child}
        `;
        div.addEventListener("dragstart", (event) => {
            draggedChildIndex = index;
            div.classList.add("is-dragging");
            event.dataTransfer?.setData("text/plain", index.toString());
            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = "move";
            }
        });
        div.addEventListener("dragend", () => {
            draggedChildIndex = null;
            div.classList.remove("is-dragging");
            filhosContainer.querySelectorAll(".is-drop-target").forEach((item) => item.classList.remove("is-drop-target"));
        });
        div.addEventListener("dragover", (event) => {
            event.preventDefault();
            if (draggedChildIndex === null || draggedChildIndex === index) {
                return;
            }
            div.classList.add("is-drop-target");
        });
        div.addEventListener("dragleave", () => {
            div.classList.remove("is-drop-target");
        });
        div.addEventListener("drop", (event) => {
            event.preventDefault();
            div.classList.remove("is-drop-target");
            if (draggedChildIndex === null || draggedChildIndex === index) {
                return;
            }
            element.moveChild(draggedChildIndex, index);
            draggedChildIndex = null;
            refreshFloatingWindow();
        });
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
        if (selectedElement === null)
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
closeCreateTagButton.addEventListener("click", () => {
    document.getElementById("create-tag").style.display = "none";
});
// #endregion
// #region Save
const { isAutoSaveEnabled, showNotification } = setupSaveLoadUI({
    defaultOption: "salvar-local",
    isUserLoggedIn: () => Auth.isUserLoggedIn(),
    options: {
        "salvar-local": { save: saveToLocalStorage, load: loadFromLocalStorage },
        "salvar-json": { save: saveToJson, load: loadFromJson },
        // "salvar-sql":    { save: saveToSql,          load: loadFromSql },
        "salvar-online": { save: saveToSupabase, load: loadFromSupabase, requiresLogin: true },
    },
});
function transformToJson() {
    const save = {
        html: getHtmlCode(currentProject()),
        css: getCssCode(currentProject()),
    };
    return JSON.stringify(save, null, 4);
}
function transformFromJson(value) {
    if (!value) {
        return;
    }
    try {
        let save;
        try {
            const parsed = JSON.parse(value);
            if (typeof parsed.html !== "string" || typeof parsed.css !== "string") {
                throw new Error("Formato de salvamento inválido.");
            }
            save = parsed;
        }
        catch {
            save = { html: value, css: "" };
        }
        const root = parseHtmlCode(save.html);
        const head = root.children.find(child => typeof child !== "string" && child.tag === "head");
        const body = root.children.find(child => typeof child !== "string" && child.tag === "body");
        if (!head || typeof head === "string" || !body || typeof body === "string") {
            throw new Error("O HTML precisa conter <head> e <body>.");
        }
        currentProject().root = root;
        currentProject().classes = parseCssCode(save.css);
        selectedElement = body;
        renderCssEditor();
        renderProject(currentProject());
        rederTrees();
        showNotification("HTML carregado com sucesso");
    }
    catch (error) {
        showNotification("Erro ao carregar o HTML");
    }
}
function saveToLocalStorage() {
    localStorage.setItem("editor-html", transformToJson());
}
function loadFromLocalStorage() {
    const json = localStorage.getItem("editor-html");
    if (json) {
        transformFromJson(json);
    }
}
function saveToJson() {
    const json = transformToJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "database.json";
    a.click();
    URL.revokeObjectURL(url);
}
function loadFromJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const json = e.target.result;
            transformFromJson(json);
        };
        reader.readAsText(file);
    };
    input.click();
}
async function saveToSupabase() {
    const user = await Auth.getUser();
    const { error } = await supabase.from("profiles")
        .update({
        editor_html_save: JSON.parse(transformToJson())
    }).eq("id", user.id);
    console.log(error);
}
async function loadFromSupabase() {
    const user = await Auth.getUser();
    const { data, error } = await supabase.from("profiles")
        .select("editor_html_save").eq("id", user.id);
    if (error)
        return;
    const json = JSON.stringify(data[0]["editor_html_save"]);
    if (json === "null") {
        showNotification("Nenhum HTML salvo online");
        return;
    }
    transformFromJson(json);
}
// #endregion
widthInput.addEventListener("input", updateIframeSize);
heightInput.addEventListener("input", updateIframeSize);
zoomInput.addEventListener("input", () => {
    zoom = parseFloat(zoomInput.value) / 100;
    renderCamera();
});
const esquerda = document.getElementById("dashboard-esquerda");
const direita = document.getElementById("dashboard-direita");
const dashboard = document.getElementById("dashboard");
const separador1 = document.getElementById("resizer1");
const separador2 = document.getElementById("resizer2");
let resizerAtivo = null;
const iniciarRedimensionamento = (tipo, event) => {
    event.preventDefault();
    resizerAtivo = tipo;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    event.currentTarget.setPointerCapture(event.pointerId);
};
separador1.addEventListener("pointerdown", event => iniciarRedimensionamento("esquerda", event));
separador2.addEventListener("pointerdown", event => iniciarRedimensionamento("direita", event));
const finalizarRedimensionamento = () => {
    resizerAtivo = null;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
};
document.addEventListener("pointerup", finalizarRedimensionamento);
document.addEventListener("pointercancel", finalizarRedimensionamento);
document.addEventListener("pointermove", (e) => {
    if (!resizerAtivo)
        return;
    const dashboardRect = dashboard.getBoundingClientRect();
    const maxPanelWidth = Math.min(600, dashboardRect.width - 150);
    if (resizerAtivo === "esquerda") {
        const novaLargura = e.clientX - dashboardRect.left;
        const larguraLimitada = Math.max(75, Math.min(novaLargura, maxPanelWidth));
        esquerda.style.width = `${larguraLimitada}px`;
    }
    else {
        const novaLargura = dashboardRect.right - e.clientX;
        const larguraLimitada = Math.max(75, Math.min(novaLargura, maxPanelWidth));
        direita.style.width = `${larguraLimitada}px`;
    }
});
async function loadSavedProject() {
    if (await Auth.isUserLoggedIn()) {
        loadFromSupabase();
    }
    else {
        loadFromLocalStorage();
    }
}
if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", loadSavedProject, { once: true });
}
else {
    loadSavedProject();
}
updateIframeSize();
renderCamera();
renderCssEditor();
renderProject(currentProject());
rederTrees();
