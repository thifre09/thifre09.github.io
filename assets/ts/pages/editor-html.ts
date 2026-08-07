// #region Change interface terminal

const buttonChangeToDashboard = document.getElementById("button-header-dashboard")!;
const buttonChangeToCodigo = document.getElementById("button-header-codigo")!;
const buttonChangeToSave = document.getElementById("button-header-save")!;
const buttonChangeToHelp = document.getElementById("button-header-help")!;
const navBar = document.getElementById("nav-bar")!;

/**
 * Atualiza a posição e a largura do indicador da interface ativa.
 * @param activeButton - Botão atualmente selecionado.
 */
function updateInterfaceTerminalIndicator(activeButton: HTMLElement) {
    const left = activeButton.offsetLeft;
    const width = activeButton.offsetWidth;
    navBar.style.setProperty("--indicator-left", `${left}px`);
    navBar.style.setProperty("--indicator-width", `${width}px`);
}

/**
 * Troca a interface visível no painel (gráfica, terminal, logical, save ou help).
 * @param id - Identificador da interface a ser exibida.
 */
function changeTo(id: "dashboard" | "codigo" | "save" | "help") {
    document.getElementById("dashboard")!.style.display = "none";
    document.getElementById("codigo")!.style.display = "none";
    document.getElementById("save")!.style.display = "none";
    document.getElementById("help")!.style.display = "none";
    document.getElementById(id)!.style.display = "flex";
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
    root: HTMLElementNode;
    classes: CSSClass[];

    constructor() {
        this.root = new HTMLElementNode("html");
        this.classes = [];
    }
}

class HTMLElementNode {
    static nextId = 1;
    id: number;
    tag: string;
    attributes: Map<string, string>;
    style: Map<string, string>;
    classes: string[];
    children: HTMLElementNode[];
    parent: HTMLElementNode | null;

    constructor(tag: string) {
        this.id = HTMLElementNode.nextId++;
        this.tag = tag;
        this.attributes = new Map();
        this.style = new Map();
        this.classes = [];
        this.children = [];
        this.parent = null;
    }

    createHTMLElement(): HTMLElement {
        const element = doc.createElement(this.tag);

        // atributos
        for (const [name, value] of this.attributes) {
            element.setAttribute(name, value);
        }

        // classes
        element.className = this.classes.join(" ");

        // css inline
        for (const [name, value] of this.style) {
            element.style.setProperty(name, value);
        }

        // filhos
        for (const child of this.children) {
            element.appendChild(child.createHTMLElement());
        }

    return element;

}
}

class CSSClass {
    name: string;
    properties: Map<string, string>;

    constructor(name: string) {
        this.name = name;
        this.properties = new Map();
    }
}

const projects: HTMLProject[] = [new HTMLProject()];
let currentProjectIndex = 0;

function currentProject() {
    return projects[currentProjectIndex];
}

// #endregion

// #region Interfaces and types

interface CSSValue {
    description?: string;
}

interface CSSEntry {
    description?: string;
    restriction?: string;
    syntax?: string;
    values: Record<string, CSSValue>;
}

interface CSSDatabase {
    properties: Record<string, CSSEntry>;
    atDirectives: Record<string, CSSEntry>;
    pseudoClasses: Record<string, CSSEntry>;
    pseudoElements: Record<string, CSSEntry>;
}

interface HTMLAttribute {
    description?: string;
}

interface HTMLTag {
    description?: string;
    attributes: Record<string, HTMLAttribute>;
}

type HTMLDatabase = Record<string, HTMLTag>;

// #endregion

// #region Search and load data

const cssData: CSSDatabase = await fetch("/assets/jsons/css-data.json").then(r => r.json());
const htmlData: HTMLDatabase = await fetch("/assets/jsons/html-data.json").then(r => r.json());

const search = document.getElementById("search") as HTMLInputElement;
const suggestions = document.getElementById("suggestions")!;
const tooltip = document.getElementById("tooltip")!;

function renderSuggestions(tags: string[]) {
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
            addElementToProject(tag);
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

        const tag = search.value.trim().toLowerCase();
        search.value = "";
        addElementToProject(tag);
    }
});

function addElementToProject(tag: string) {
    const node = new HTMLElementNode(tag);
    currentProject().root.children.push(node);
    node.parent = currentProject().root;

    search.value = "";

    renderProject(currentProject());
}

function renderProject(project: HTMLProject) {
    doc.body.replaceChildren();

    for (const child of project.root.children) {
        doc.body.appendChild(child.createHTMLElement());
    }

}

//#endregion

// #region Iframe

const iframe = document.getElementById("visualizacao") as HTMLIFrameElement;

const doc = iframe.contentDocument!;
doc.body.innerHTML = `
    <p>ola</p>
`;

// #endregion

setTimeout(() => {
    changeTo("dashboard");
}, 200);

export { }