import * as Auth from "../supabase/auth.js";
import { supabase } from "../supabase/client.js";
// #region Change interface terminal
const buttonChangeToGrafical = document.getElementById("button-header-interface");
const buttonChangeToTerminal = document.getElementById("button-header-terminal");
const buttonChangeToLogical = document.getElementById("button-header-logical");
const buttonChangeToSave = document.getElementById("button-header-save");
const buttonChangeToHelp = document.getElementById("button-header-help");
const interfaceTerminal = document.getElementById("nav-bar");
/**
 * Atualiza a posição e a largura do indicador da interface ativa.
 * @param activeButton - Botão atualmente selecionado.
 */
function updateInterfaceTerminalIndicator(activeButton) {
    const left = activeButton.offsetLeft;
    const width = activeButton.offsetWidth;
    interfaceTerminal.style.setProperty("--indicator-left", `${left}px`);
    interfaceTerminal.style.setProperty("--indicator-width", `${width}px`);
}
/**
 * Troca a interface visível no painel (gráfica, terminal, logical, save ou help).
 * @param id - Identificador da interface a ser exibida.
 */
function changeTo(id) {
    document.getElementById("interface-grafica").style.display = "none";
    document.getElementById("terminal").style.display = "none";
    document.getElementById("logical").style.display = "none";
    document.getElementById("save").style.display = "none";
    document.getElementById("help").style.display = "none";
    document.getElementById(id).style.display = "flex";
    document.querySelector(".nav-bar-ativo")?.classList.remove("nav-bar-ativo");
    switch (id) {
        case "interface-grafica":
            buttonChangeToGrafical.classList.add("nav-bar-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToGrafical);
            break;
        case "terminal":
            buttonChangeToTerminal.classList.add("nav-bar-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToTerminal);
            break;
        case "logical":
            buttonChangeToLogical.classList.add("nav-bar-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToLogical);
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
buttonChangeToGrafical.addEventListener("click", () => {
    changeTo("interface-grafica");
});
buttonChangeToTerminal.addEventListener("click", () => {
    changeTo("terminal");
});
buttonChangeToLogical.addEventListener("click", () => {
    changeTo("logical");
    drawConnectionLines();
});
buttonChangeToSave.addEventListener("click", () => {
    changeTo("save");
});
buttonChangeToHelp.addEventListener("click", () => {
    changeTo("help");
});
// #endregion
// #region Others
let timeout;
/**
 * Verifica se um nome segue o padrão permitido para identificadores SQL.
 * @param name - Nome a ser validado.
 * @returns `true` quando o nome é válido.
 */
function isValidSQLName(name) {
    if (name.length === 0)
        return false;
    if (keyWords.includes(name.toLowerCase()))
        return false;
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}
/**
 * Exibe uma notificação temporária no painel de mensagens.
 * @param html - Conteúdo HTML da notificação.
 */
function openNotifications(html) {
    clearTimeout(timeout);
    const notificacoes = document.getElementById("notificacoes");
    notificacoes.style.display = "flex";
    notificacoes.innerHTML = html;
    timeout = setTimeout(() => {
        notificacoes.style.display = "none";
    }, 3000);
}
/**
 * Abre ou fecha um menu central e oculta o contêiner quando todos estiverem fechados.
 * @param estado - `false` para abrir e `true` para fechar.
 * @param id - Id do painel que deve ser manipulado.
 */
function abrirFechar(estado, id) {
    const elemento = document.getElementById(id);
    if (estado === false) {
        document.getElementById("menus-centrais").style.display = "flex";
        elemento.style.display = "flex";
    }
    else if (estado === true) {
        elemento.style.display = "none";
        const menusCentrais = document.getElementById("menus-centrais");
        const allHidden = Array.from(menusCentrais.children).every((child) => {
            const menu = child;
            if (menu.id === "notificacoes")
                return true;
            return menu.style.display === "none";
        });
        if (allHidden) {
            menusCentrais.style.display = "none";
        }
    }
}
/**
 * Cria ou seleciona a database de exemplo com tabelas e registros pré-carregados.
 */
async function createExempleDatabase() {
    const response = await fetch("/assets/json/exemple_database.json");
    const json = await response.text();
    console.log(json);
    transformFromJson(json);
}
function compareTypes(type1, type2) {
    return type1.constructor === type2.constructor;
}
function valueExists(value) {
    return value !== null && value !== undefined;
}
// #endregion
// #region Custom dropdowns
/**
 * Alterna a abertura de um dropdown customizado.
 * @param dropdownButton - Botão que controla o dropdown.
 */
function openCustomDropdown(dropdownButton) {
    const dropdown = dropdownButton.parentElement;
    if (dropdown.querySelector("ul").children.length === 0)
        return;
    document.querySelectorAll(".custom-dropdown.custom-dropdown-open").forEach((openDropdown) => {
        if (openDropdown !== dropdown) {
            openDropdown.classList.remove("custom-dropdown-open");
        }
    });
    dropdown.classList.toggle("custom-dropdown-open");
}
/**
 * Seleciona uma opção de dropdown e atualiza o estado associado.
 * @param option - Opção clicada.
 */
function choseOption(option) {
    const dropdown = option.closest(".custom-dropdown");
    const trigger = dropdown.querySelector(".custom-dropdown-trigger");
    if (trigger) {
        trigger.textContent = option.textContent;
    }
    dropdown.classList.remove("custom-dropdown-open");
    dropdown.querySelector(".custom-dropdown-option-selected")?.classList.remove("custom-dropdown-option-selected");
    option.classList.add("custom-dropdown-option-selected");
    onDropdownChange(dropdown);
}
/**
 * Fecha todos os dropdowns customizados quando o clique ocorre fora deles.
 * @param event - Evento de clique da página.
 */
function closeAllCustomDropdowns(event) {
    const target = event.target;
    if (target.closest(".custom-dropdown"))
        return;
    document.querySelectorAll(".custom-dropdown.custom-dropdown-open").forEach((dropdown) => {
        dropdown.classList.remove("custom-dropdown-open");
    });
}
/**
 * Reconecta os handlers das opções de todos os dropdowns customizados.
 */
function updateCustomDropdowns() {
    document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
        dropdown.querySelectorAll(".custom-dropdown-option").forEach((option) => {
            option.onclick = () => choseOption(option);
        });
    });
}
/**
 * Aplica os efeitos colaterais de uma mudança em um dropdown customizado.
 * @param dropdown - Dropdown alterado.
 */
function onDropdownChange(dropdown) {
    if (dropdown.querySelector('input[name="column-type"]')) {
        const container = dropdown.closest("div").parentElement;
        updateCharacteristics(container);
        updateDefaultInput(container);
        updateTypeInput(container);
    }
    if (dropdown.querySelector('input[name="reference-schema"]')) {
        const container = dropdown.closest("div").parentElement;
        updateForeignKeyReferenceTableOptions(container);
    }
    if (dropdown.querySelector('input[name="reference-table"]')) {
        const container = dropdown.closest("div").parentElement;
        updateForeignKeyReferenceColumnOptions(container);
    }
    if (dropdown.querySelector('input[name="database-dropdown"]')) {
        const selectedOption = dropdown.querySelector(".custom-dropdown-option-selected");
        if (selectedOption) {
            currentDatabase = selectedOption.textContent || "";
            currentTable = null;
            refreshUI();
        }
    }
}
updateCustomDropdowns();
// #endregion
// #region classes and variables
var DB;
(function (DB) {
    class TreeItem {
        name;
        constructor(name) {
            this.name = name;
        }
        clickBehavior() { }
    }
    DB.TreeItem = TreeItem;
    class Node extends TreeItem {
        parent;
        onConfig;
        constructor(name, parent, onConfig = null) {
            super(name);
            this.onConfig = onConfig;
            this.parent = parent;
        }
        get children() {
            return [];
        }
        get icon() {
            return "";
        }
        buildTree() {
            if (this.children.length === 0) {
                const summary = document.createElement("summary");
                const summaryDiv = document.createElement("div");
                const p = document.createElement("p");
                p.innerHTML = `${this.icon}${this.name}`;
                summaryDiv.appendChild(p);
                if (this.onConfig !== null) {
                    const svgDiv = document.createElement("div");
                    svgDiv.innerHTML = `
                    <svg viewBox="0 -960 960 960" fill="currentColor">
                        <path
                            d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                    </svg>
                    `;
                    svgDiv.onclick = () => {
                        this.onConfig?.();
                    };
                    summaryDiv.appendChild(svgDiv);
                }
                summary.appendChild(summaryDiv);
                return summary;
            }
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            const arrow = document.createElement("span");
            arrow.innerHTML = `
            <svg viewBox="0 -960 960 960" fill="currentColor">
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
            </svg>
            `;
            summary.appendChild(arrow);
            const summaryDiv = document.createElement("div");
            const p = document.createElement("p");
            p.innerHTML = `${this.icon}${this.name}`;
            summaryDiv.appendChild(p);
            if (this.onConfig !== null) {
                const svgDiv = document.createElement("div");
                svgDiv.innerHTML = `
                <svg viewBox="0 -960 960 960" fill="currentColor">
                    <path
                        d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                </svg>
                `;
                svgDiv.onclick = () => {
                    this.onConfig?.();
                };
                summaryDiv.appendChild(svgDiv);
            }
            summary.appendChild(summaryDiv);
            details.appendChild(summary);
            for (let ch of this.children) {
                details.appendChild(ch.buildTree());
            }
            details.onclick = (event) => {
                event.stopPropagation();
                setTimeout(() => this.clickBehavior(), 0);
            };
            return details;
        }
        rebuildParent() {
            for (let ch of this.children) {
                if (ch instanceof Node) {
                    ch.parent = this;
                    ch.rebuildParent();
                }
            }
        }
    }
    DB.Node = Node;
    class NodeGroup extends TreeItem {
        c;
        onPlus;
        constructor(name, children, onPlus = () => { }) {
            super(name);
            this.c = children;
            this.onPlus = onPlus;
        }
        get children() {
            return this.c;
        }
        buildTree() {
            if (this.children.length === 0) {
                const summary = document.createElement("summary");
                const summaryDiv = document.createElement("div");
                const p = document.createElement("p");
                p.classList.add("node-group-summary");
                p.innerHTML = `
                <svg viewBox="0 -960 960 960">
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>
                </svg>
                <svg viewBox="0 -960 960 960">
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z"/>
                </svg>
                ${this.name}
                `;
                summaryDiv.appendChild(p);
                const plusIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                plusIcon.setAttribute("viewBox", "0 -960 960 960");
                plusIcon.setAttribute("aria-hidden", "true");
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z");
                plusIcon.appendChild(path);
                plusIcon.onclick = () => {
                    this.onPlus();
                };
                summaryDiv.appendChild(plusIcon);
                summary.appendChild(summaryDiv);
                return summary;
            }
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            const arrow = document.createElement("span");
            arrow.innerHTML = `
            <svg viewBox="0 -960 960 960" fill="currentColor">
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
            </svg>
            `;
            summary.appendChild(arrow);
            const summaryDiv = document.createElement("div");
            const p = document.createElement("p");
            p.classList.add("node-group-summary");
            p.innerHTML = `
            <svg viewBox="0 -960 960 960">
                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z"/>
            </svg>
            <svg viewBox="0 -960 960 960">
                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z"/>
            </svg>
            ${this.name}
            `;
            summaryDiv.appendChild(p);
            const plusIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            plusIcon.setAttribute("viewBox", "0 -960 960 960");
            plusIcon.setAttribute("fill", "currentColor");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z");
            plusIcon.appendChild(path);
            plusIcon.onclick = () => {
                this.onPlus();
                details.open = !details.open;
            };
            summaryDiv.appendChild(plusIcon);
            summary.appendChild(summaryDiv);
            details.appendChild(summary);
            for (let ch of this.children) {
                details.appendChild(ch.buildTree());
            }
            details.onclick = (event) => {
                event.stopPropagation();
                setTimeout(() => this.clickBehavior(), 0);
            };
            return details;
        }
    }
    DB.NodeGroup = NodeGroup;
    /**
     * Representa uma database em memória com tabelas e relacionamentos.
     */
    class Database extends Node {
        schemas;
        /**
         * Mapa de chaves estrangeiras para cada tabela.
         *
         * Exemplo de estrutura:
         *
         * {
         *
         *      public.usuario.id: [
         *          {
         *              schema: "public",
         *              table: "pedido",
         *              column: "usuario_id"
         *          },
         *          {
         *              schema: "public",
         *              table: "comentario",
         *              column: "usuario_id"
         *          }
         *      ]
         *
         * }
         */
        // foreignKeyMap: Record<string, TReference[]> = {};
        /**
         * Cria uma database vazia com o nome informado.
         * @param name - Nome da database.
         */
        constructor(name) {
            super(name, null, () => {
                this.clickBehavior();
                changeConfigurarDatabaseMenu();
                abrirFechar(false, "configurar-database");
            });
            databaseGroup.c.push(this);
            this.schemas = {};
        }
        // createKey(schemaName: string, tableName: string, columnName: string): string {
        //     return `${schemaName}.${tableName}.${columnName}`;
        // }
        // addForeignKeyReference(schemaName: string, tableName: string, columnName: string, reference: TReference) {
        //     const key = this.createKey(schemaName, tableName, columnName);
        //     if (!this.foreignKeyMap[key]) {
        //         this.foreignKeyMap[key] = [];
        //     }
        //     this.foreignKeyMap[key].push(reference);
        // }
        // /**
        //  * Remove uma entrada do mapa de chaves estrangeiras.
        //  * 
        //  * Usado para remover referências quando uma tabela ou coluna é excluída.
        //  * @param schema Schema da tabela que contém a chave estrangeira.
        //  * @param table Tabela que contém a chave estrangeira.
        //  * @param column Coluna que contém a chave estrangeira.
        //  */
        // removeForeignKeyEntry(schema: string, table: string, column: string) {
        //     delete this.foreignKeyMap[
        //         this.createKey(schema, table, column)
        //     ];
        // }
        // /**
        //  * Remove uma referência de chave estrangeira do mapa.
        //  *
        //  * @param schemaName - Schema da tabela referenciada.
        //  * @param tableName - Tabela referenciada.
        //  * @param columnName - Coluna referenciada.
        //  * @param reference - Referência que deve ser removida.
        //  */
        // removeForeignKeyReference(schemaName: string, tableName: string, columnName: string, reference: TReference) {
        //     const key = this.createKey(schemaName, tableName, columnName);
        //     const references = this.foreignKeyMap[key];
        //     if (!references) return;
        //     this.foreignKeyMap[key] = references.filter(ref =>
        //         !(
        //             ref.schema === reference.schema &&
        //             ref.table === reference.table &&
        //             ref.column === reference.column
        //         )
        //     );
        //     if (this.foreignKeyMap[key].length === 0) {
        //         delete this.foreignKeyMap[key];
        //     }
        // }
        // getReferencesToTable(schemaName: string, tableName: string): TReference[] {
        //     const prefix = `${schemaName}.${tableName}.`;
        //     const references: TReference[] = [];
        //     for (const key in this.foreignKeyMap) {
        //         if (!key.startsWith(prefix))
        //             continue;
        //         references.push(...this.foreignKeyMap[key]);
        //     }
        //     return references;
        // }
        // getReferencesToColumn(schemaName: string, tableName: string, columnName: string): TReference[] {
        //     return this.foreignKeyMap[
        //         this.createKey(schemaName, tableName, columnName)
        //     ] ?? [];
        // }
        get children() {
            return [
                new NodeGroup("Schemas", Object.values(this.schemas), () => {
                    this.clickBehavior();
                    abrirFechar(false, "criacao-schema");
                })
            ];
        }
        get icon() {
            return `
            <svg viewBox="0 -960 960 960" fill="var(--blue5)">
                <path d="M480-120q-151 0-255.5-46.5T120-280v-400q0-66 105.5-113T480-840q149 0 254.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-479q89 0 179-25.5T760-679q-11-29-100.5-55T480-760q-91 0-178.5 25.5T200-679q14 30 101.5 55T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-120q-26 14-57.5 25t-67 18.5Q600-528 561-524t-81 4q-42 0-82-4t-75.5-11.5Q287-543 256-554t-56-25v120q25 14 56 25t66.5 18.5Q358-408 398-404t82 4Zm0 200q46 0 93.5-7t87.5-18.5q40-11.5 67-26t32-29.5v-98q-26 14-57.5 25t-67 18.5Q600-328 561-324t-81 4q-42 0-82-4t-75.5-11.5Q287-343 256-354t-56-25v99q5 15 31.5 29t66.5 25.5q40 11.5 88 18.5t94 7Z"/>
            </svg>
            `;
        }
        clickBehavior() {
            currentDatabase = this.name;
            currentSchema = null;
            currentTable = null;
            refreshUI();
        }
        static fromJSON(json) {
            if (!json.name || !json.schemas) {
                return null;
            }
            const db = new Database(json.name);
            for (const [name, schemaObj] of Object.entries(json.schemas)) {
                db.schemas[name] = Schema.fromJSON(schemaObj, db);
            }
            return db;
        }
    }
    DB.Database = Database;
    /**
     * Representa um esquema em memória com tabelas.
     */
    class Schema extends Node {
        tables;
        /**
         * Cria um esquema vazio com o nome informado.
         * @param name - Nome do esquema.
         * @param parent - Nome do parente do esquema.
         */
        constructor(name, parent) {
            super(name, parent, () => {
                this.clickBehavior();
                changeConfigurarSchemaMenu();
                abrirFechar(false, "configurar-schema");
            });
            this.tables = {};
        }
        get children() {
            return [
                new NodeGroup("Tabelas", Object.values(this.tables), () => {
                    this.clickBehavior();
                    abrirFechar(false, "criacao-tabela");
                })
            ];
        }
        get icon() {
            return `
            <svg viewBox="0 -960 960 960">
                <path d="M160-40v-240h100v-80H160v-240h100v-80H160v-240h280v240H340v80h100v80h120v-80h280v240H560v-80H440v80H340v80h100v240H160Zm80-80h120v-80H240v80Zm0-320h120v-80H240v80Zm400 0h120v-80H640v80ZM240-760h120v-80H240v80Zm60-40Zm0 320Zm400 0ZM300-160Z"/>
            </svg>
            `;
        }
        clickBehavior() {
            currentDatabase = this.parent.name;
            currentSchema = this.name;
            currentTable = null;
            refreshUI();
        }
        static fromJSON(json, parent) {
            const schema = new Schema(json.name, parent);
            for (const [name, tableObj] of Object.entries(json.tables)) {
                schema.tables[name] = Table.fromJSON(tableObj, schema);
            }
            return schema;
        }
    }
    DB.Schema = Schema;
    /**
     * Representa uma tabela em memória com colunas, linhas e índices.
     */
    class Table extends Node {
        columns;
        rows;
        indexes;
        /**
         * Cria uma tabela vazia com o nome informado.
         * @param name - Nome da tabela.
         * @param parent - Nome do parente da tabela.
         */
        constructor(name, parent) {
            super(name, parent, () => {
                this.clickBehavior();
                changeConfigurarTabelaMenu();
                abrirFechar(false, "configurar-tabela");
            });
            this.columns = {};
            this.rows = [];
            this.indexes = {};
        }
        /**
         * Restaura os valores de auto incremento caso a inserção falhe.
        */
        revertAutoIncrementValues(valuesBeforeIncrement) {
            for (const { column, value } of valuesBeforeIncrement) {
                const col = this.columns[column];
                if (col.isAutoIncrement) {
                    col.incrementCounter = value;
                }
            }
        }
        remakeIndexes() {
            this.indexes = {};
            for (const columnName in this.columns) {
                this.indexes[columnName] = new Map();
            }
            for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                const row = this.rows[rowIndex];
                for (const columnName in this.columns) {
                    const value = row.values[columnName];
                    const indexMap = this.indexes[columnName];
                    if (!indexMap.has(value)) {
                        indexMap.set(value, []);
                    }
                    indexMap.get(value).push(rowIndex);
                }
            }
        }
        remakeColumnIndex(columnName) {
            const indexMap = new Map();
            for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                const value = this.rows[rowIndex].values[columnName];
                if (!indexMap.has(value)) {
                    indexMap.set(value, []);
                }
                indexMap.get(value).push(rowIndex);
            }
            this.indexes[columnName] = indexMap;
        }
        get children() {
            return [
                new NodeGroup("Colunas", Object.values(this.columns), () => {
                    this.clickBehavior();
                    abrirFechar(false, "adicionar-colunas");
                }),
                new NodeGroup("Linhas", Object.values(this.rows), () => {
                    this.clickBehavior();
                    changeInsertRowMenu();
                    abrirFechar(false, "inserir-linha");
                })
            ];
        }
        get icon() {
            return `
            <svg viewBox="0 -960 960 960" fill="var(--green5)">
                <path
                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm240-240H200v160h240v-160Zm80 0v160h240v-160H520Zm-80-80v-160H200v160h240Zm80 0h240v-160H520v160ZM200-680h560v-80H200v80Z" />
            </svg>
            `;
        }
        clickBehavior() {
            currentDatabase = this.parent.parent.name;
            currentSchema = this.parent.name;
            currentTable = this.name;
            refreshUI();
        }
        static fromJSON(obj, parent) {
            const table = new Table(obj.name, parent);
            table.columns = {};
            for (const [name, columnObj] of Object.entries(obj.columns)) {
                table.columns[name] = Column.fromJSON(columnObj, table);
            }
            table.rows = obj.rows.map((row) => Row.fromJSON(row, table));
            table.indexes = {};
            for (const [column, index] of Object.entries(obj.indexes)) {
                table.indexes[column] = new Map(index);
            }
            return table;
        }
    }
    DB.Table = Table;
    /**
     * Descreve uma coluna e suas restrições na estrutura da tabela.
     */
    class Column extends Node {
        type;
        isPrimaryKey;
        isForeignKey;
        isNotNull;
        isUnique;
        isAutoIncrement;
        hasDefault;
        isCurrentTimestamp;
        reference;
        defaultValue;
        incrementCounter = 1;
        /**
         * Cria uma coluna com metadados e restrições.
         * @param name - Nome da coluna.
         * @param parent - Nome do parente da coluna.
         * @param type - Tipo lógico da coluna.
         * @param isPrimaryKey - Indica chave primária.
         * @param isForeignKey - Indica chave estrangeira.
         * @param isNotNull - Indica restrição NOT NULL.
         * @param isUnique - Indica restrição UNIQUE.
         * @param isAutoIncrement - Indica incremento automático.
         * @param hasDefault - Indica valor padrão.
         * @param isCurrentTimestamp - Indica timestamp automático.
         * @param reference - Referência usada por FOREIGN KEY.
         */
        constructor(name, parent, type, isPrimaryKey = false, isForeignKey = false, isNotNull = false, isUnique = false, isAutoIncrement = false, hasDefault = false, isCurrentTimestamp = false, reference, defaultValue) {
            super(name, parent);
            this.type = type;
            this.isPrimaryKey = isPrimaryKey;
            this.isForeignKey = isForeignKey;
            this.isNotNull = isNotNull;
            this.isUnique = isUnique;
            this.isAutoIncrement = isAutoIncrement;
            this.hasDefault = hasDefault;
            this.isCurrentTimestamp = isCurrentTimestamp;
            this.reference = reference;
            this.defaultValue = defaultValue;
        }
        /**
         * Retorna o próximo valor da sequência de auto incremento.
         * @returns Próximo número da coluna.
         */
        increment() {
            if (!this.isAutoIncrement) {
                throw new Error("Column is not auto increment");
            }
            return this.incrementCounter++;
        }
        /**
         * Cria uma cópia da coluna.
         * @returns Cópia da coluna.
         */
        clone() {
            const copy = new Column(this.name, this.parent, this.type, this.isPrimaryKey, this.isForeignKey, this.isNotNull, this.isUnique, this.isAutoIncrement, this.hasDefault, this.isCurrentTimestamp, this.reference ? { ...this.reference } : undefined);
            copy.incrementCounter = this.incrementCounter;
            copy.defaultValue = this.defaultValue;
            return copy;
        }
        get icon() {
            if (this.isPrimaryKey) {
                return `
                <svg viewBox="0 -960 960 960" fill="var(--yellow6)">
                    <path d="M223.5-423.5Q200-447 200-480t23.5-56.5Q247-560 280-560t56.5 23.5Q360-513 360-480t-23.5 56.5Q313-400 280-400t-56.5-23.5ZM280-240q-100 0-170-70T40-480q0-100 70-170t170-70q67 0 121.5 33t86.5 87h352l120 120-180 180-80-60-80 60-85-60h-47q-32 54-86.5 87T280-240Zm0-80q56 0 98.5-34t56.5-86h125l58 41 82-61 71 55 75-75-40-40H435q-14-52-56.5-86T280-640q-66 0-113 47t-47 113q0 66 47 113t113 47Z"/>
                </svg>
                `;
            }
            else if (this.isForeignKey) {
                return `
                <svg viewBox="0 -960 960 960" fill="var(--gray5)">
                    <path d="M318-120q-82 0-140-58t-58-140q0-40 15-76t43-64l134-133 56 56-134 134q-17 17-25.5 38.5T200-318q0 49 34.5 83.5T318-200q23 0 45-8.5t39-25.5l133-134 57 57-134 133q-28 28-64 43t-76 15Zm79-220-57-57 223-223 57 57-223 223Zm251-28-56-57 134-133q17-17 25-38t8-44q0-50-34-85t-84-35q-23 0-44.5 8.5T558-726L425-592l-57-56 134-134q28-28 64-43t76-15q82 0 139.5 58T839-641q0 39-14.5 75T782-502L648-368Z"/>
                </svg>
                `;
            }
            switch (this.type.name) {
                case "TEXT":
                    return `
                    <svg viewBox="0 -960 960 960" fill="var(--${this.type.color})">
                        <path d="M280-160v-520H80v-120h520v120H400v520H280Zm360 0v-320H520v-120h360v120H760v320H640Z"/>
                    </svg>
                    `;
                case "INTEGER":
                    return `
                    <svg viewBox="0 -960 960 960" fill="var(--${this.type.color})">
                        <path d="m240-160 40-160H120l20-80h160l40-160H180l20-80h160l40-160h80l-40 160h160l40-160h80l-40 160h160l-20 80H660l-40 160h160l-20 80H600l-40 160h-80l40-160H360l-40 160h-80Zm140-240h160l40-160H420l-40 160Z"/>
                    </svg>
                    `;
                case "FLOAT":
                    return `
                    <svg viewBox="0 -960 960 960" fill="var(--${this.type.color})">
                        <path d="m720-80-56-56 63-64H480v-80h247l-63-64 56-56 160 160L720-80ZM80-440v-120h120v120H80Zm201-41q-41-41-41-99v-160q0-58 41-99t99-41q58 0 99 41t41 99v160q0 58-41 99t-99 41q-58 0-99-41Zm360 0q-41-41-41-99v-160q0-58 41-99t99-41q58 0 99 41t41 99v160q0 58-41 99t-99 41q-58 0-99-41Zm-218.5-56.5Q440-555 440-580v-160q0-25-17.5-42.5T380-800q-25 0-42.5 17.5T320-740v160q0 25 17.5 42.5T380-520q25 0 42.5-17.5Zm360 0Q800-555 800-580v-160q0-25-17.5-42.5T740-800q-25 0-42.5 17.5T680-740v160q0 25 17.5 42.5T740-520q25 0 42.5-17.5Z"/>
                    </svg>
                    `;
                case "BOOLEAN":
                    return `
                    <svg viewBox="0 -960 960 960" fill="var(--${this.type.color})">
                        <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm85-75q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm115-85Z"/>
                    </svg>
                    `;
                case "DATE":
                    return `
                    <svg viewBox="0 -960 960 960" fill="var(--${this.type.color})">
                        <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
                    </svg>
                    `;
                case "TIME":
                    return `
                    <svg viewBox="0 -960 960 960" fill="var(--${this.type.color})">
                        <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                    </svg>
                    `;
                case "ENUM":
                    return `
                    <svg viewBox="0 -960 960 960" fill="var(--${this.type.color})">
                        <path d="M348.5-291.5Q360-303 360-320t-11.5-28.5Q337-360 320-360t-28.5 11.5Q280-337 280-320t11.5 28.5Q303-280 320-280t28.5-11.5Zm0-160Q360-463 360-480t-11.5-28.5Q337-520 320-520t-28.5 11.5Q280-497 280-480t11.5 28.5Q303-440 320-440t28.5-11.5Zm0-160Q360-623 360-640t-11.5-28.5Q337-680 320-680t-28.5 11.5Q280-657 280-640t11.5 28.5Q303-600 320-600t28.5-11.5ZM440-280h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                    </svg>
                    `;
                case "VARCHAR":
                    return `
                    <svg viewBox="0 -960 960 960" fill="var(--${this.type.color})">
                        <path d="M120-120v-120h200q-84-45-132-125t-48-175q0-142 99-241t241-99q142 0 241 99t99 241q0 95-48 175T640-240h200v120H520v-204q78-14 129-75t51-141q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 80 51 141t129 75v204H120Z"/>
                    </svg>
                    `;
            }
        }
        static fromJSON(obj, parent) {
            let type;
            if (obj.type.name === "ENUM") {
                type = types.ENUM(obj.type.allowedValues);
            }
            else if (obj.type.name === "VARCHAR") {
                type = types.VARCHAR(obj.type.maxLength);
            }
            else {
                type = DataTypes.createDataTypeFromString(obj.type.name);
            }
            const column = new Column(obj.name, parent, type, obj.isPrimaryKey, obj.isForeignKey, obj.isNotNull, obj.isUnique, obj.isAutoIncrement, obj.hasDefault, obj.isCurrentTimestamp, obj.reference);
            column.incrementCounter = obj.incrementCounter;
            column.defaultValue = obj.defaultValue;
            return column;
        }
    }
    DB.Column = Column;
    class Row extends Node {
        static counter = 1;
        values;
        constructor(parent, values) {
            super(`Linha ${Row.counter}`, parent);
            this.values = values;
            Row.counter++;
        }
        get icon() {
            return `
            <svg viewBox="0 -960 960 960" fill="var(--yellow5)">
                <path
                    d="M760-200v-120H200v120h560Zm0-200v-160H200v160h560Zm0-240v-120H200v120h560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Z" />
            </svg>
            `;
        }
        static fromJSON(obj, parent) {
            let v = {};
            for (const [columnName, value] of Object.entries(obj.values)) {
                const column = parent.columns[columnName];
                if (column) {
                    v[columnName] = column.type.parse(value);
                }
            }
            const row = new Row(parent, v);
            row.name = obj.name;
            return row;
        }
    }
    DB.Row = Row;
})(DB || (DB = {}));
/**
 * Guarda o histórico e o estado de uma sessão do terminal SQL.
 */
class TerminalSession {
    static sessionCount = 1;
    static historyIndex = 0;
    name;
    history;
    active;
    /**
     * Cria uma nova sessão de terminal.
     * @param name - Nome visível da sessão.
     */
    constructor(name) {
        this.name = name;
        this.history = [];
        this.active = true;
        TerminalSession.sessionCount++;
    }
    /**
     * Adiciona uma entrada ao histórico da sessão.
     * @param command - Comando executado.
     * @param output - Linhas de saída.
     * @param type - Tipo visual da entrada.
     */
    createEntry(command, output, type) {
        this.history.push({ database: currentDatabase, command: command, output, type, timestamp: new Date() });
        this.updateTerminalUI();
    }
    /**
     * Re-renderiza o histórico da sessão na interface.
     */
    updateTerminalUI() {
        const terminalHistoryDiv = document.getElementById("terminal-history");
        terminalHistoryDiv.innerHTML = "";
        this.history.forEach(entry => {
            const entryElement = document.createElement("div");
            entryElement.classList.add("terminal-entry");
            entryElement.innerHTML = `
                <div class="terminal-command terminal-content-green">$ ${entry.command}</div>
                <div class="command-output">
                    ${entry.output.map(line => `<p class="terminal-content-${entry.type === "success" ? "blue" : entry.type === "error" ? "red" : "gray"}">${line}</p>`).join('')}
                </div>
                <p class="command-timestamp terminal-content-gray">${entry.timestamp.toLocaleTimeString()}</p>
            `;
            terminalHistoryDiv.appendChild(entryElement);
        });
    }
}
/**
 * Centraliza as operações de criação, edição e remoção das estruturas do banco.
 */
class SGBDFunctions {
    /**
     * Registra uma database e a torna a selecionada.
     * @param database - Database a ser criada.
     */
    static createDatabase(database) {
        databases[database.name] = database;
        currentDatabase = database.name;
        currentSchema = null;
        currentTable = null;
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    static createSchema(schema) {
        databases[currentDatabase].schemas[schema.name] = schema;
        currentSchema = schema.name;
        currentTable = null;
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    /**
     * Adiciona uma tabela à database atual.
     * @param table - Tabela a ser criada.
     * @param schema - Nome do schema onde a tabela será criada.
     */
    static createTable(table, schema) {
        const db = getCurrentDatabase();
        for (const columnName in table.columns) {
            table.indexes[columnName] = new Map();
            if (!table.columns[columnName].reference)
                continue;
            //db.addForeignKeyReference(currentSchema!, table.name, columnName, table.columns[columnName].reference!);
        }
        db.schemas[schema || currentSchema].tables[table.name] = table;
        currentTable = table.name;
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    /**
     * Adiciona uma coluna a uma tabela existente.
     * @param tableName - Nome da tabela alvo.
     * @param column - Coluna a ser adicionada.
     */
    static addColumn(tableName, column, schema) {
        let table;
        if (schema !== undefined) {
            table = getTable(tableName, schema);
        }
        else {
            table = getTable(tableName);
        }
        table.columns[column.name] = column;
        table.indexes[column.name] = new Map();
        const columnName = column.name;
        if (column.isAutoIncrement) {
            table.rows.forEach((row) => {
                row.values[columnName] = column.increment();
            });
            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row.values[columnName];
                table.indexes[columnName].set(value, [index]);
            });
        }
        else if (column.hasDefault) {
            table.rows.forEach((row) => {
                row.values[columnName] = column.defaultValue;
            });
            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row.values[columnName];
                table.indexes[columnName].set(value, (table.indexes[columnName].get(value) || []).concat(index));
            });
        }
        else if (column.isCurrentTimestamp) {
            table.rows.forEach((row) => {
                if (compareTypes(column.type, types.DATE))
                    row.values[columnName] = SQLDate.now();
                else if (compareTypes(column.type, types.TIME))
                    row.values[columnName] = SQLTime.now();
            });
            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row.values[columnName];
                table.indexes[columnName].set(value, (table.indexes[columnName].get(value) || []).concat(index));
            });
        }
        else {
            table.rows.forEach((row) => {
                row.values[columnName] = null;
            });
            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row.values[columnName];
                table.indexes[columnName].set(value, (table.indexes[columnName].get(value) || []).concat(index));
            });
        }
        if (column.reference) {
            //getCurrentDatabase()!.addForeignKeyReference(currentSchema!, tableName, column.name, column.reference);
        }
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    /**
     * Insere uma linha e atualiza os índices da tabela.
     * @param tableName - Nome da tabela alvo.
     * @param row - Dados da nova linha.
     */
    static insertRow(tableName, row, schemaName) {
        let table;
        if (schemaName !== undefined) {
            table = getTable(tableName, schemaName);
        }
        else {
            table = getTable(tableName);
        }
        const rowIndex = table.rows.length;
        table.rows.push(row);
        for (const col in table.indexes) {
            const value = row.values[col];
            if (!table.indexes[col].has(value)) {
                table.indexes[col].set(value, []);
            }
            table.indexes[col].get(value).push(rowIndex);
        }
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    /**
     * Substitui uma linha existente e reconstrói os índices afetados.
     * @param tableName - Nome da tabela alvo.
     * @param oldRowIndex - Índice da linha antiga.
     * @param newRow - Novo conteúdo da linha.
     */
    static editRow(tableName, oldRowIndex, newRow, schemaName) {
        let table;
        if (schemaName !== undefined) {
            table = getTable(tableName, schemaName);
        }
        else {
            table = getTable(tableName);
        }
        const oldRow = table.rows[oldRowIndex];
        for (const col in table.indexes) {
            const oldValue = oldRow.values[col];
            const indexMap = table.indexes[col];
            if (indexMap.has(oldValue)) {
                const arr = indexMap.get(oldValue);
                const pos = arr.indexOf(oldRowIndex);
                if (pos !== -1)
                    arr.splice(pos, 1);
                if (arr.length === 0) {
                    indexMap.delete(oldValue);
                }
            }
        }
        table.rows[oldRowIndex] = newRow;
        for (const col in table.indexes) {
            const newValue = newRow.values[col];
            const indexMap = table.indexes[col];
            if (!indexMap.has(newValue)) {
                indexMap.set(newValue, []);
            }
            indexMap.get(newValue).push(oldRowIndex);
        }
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    /**
     * Remove uma database do armazenamento em memória.
     * @param databaseName - Nome da database.
     */
    static deleteDatabase(databaseName) {
        delete databases[databaseName];
        if (currentDatabase === databaseName) {
            currentDatabase = null;
            currentSchema = null;
            currentTable = null;
        }
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    static deleteSchema(schemaName) {
        const db = getCurrentDatabase();
        delete db.schemas[schemaName];
        if (currentSchema === schemaName) {
            currentSchema = null;
            currentTable = null;
        }
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    /**
     * Remove uma tabela e desfaz as chaves estrangeiras de saída.
     * @param tableName - Nome da tabela.
     */
    static deleteTable(tableName, schemaName) {
        const db = getCurrentDatabase();
        if (schemaName !== undefined) {
            delete db.schemas[schemaName].tables[tableName];
        }
        else {
            delete db.schemas[currentSchema].tables[tableName];
        }
        if (currentTable === tableName) {
            currentTable = null;
        }
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    /**
     * Remove uma coluna e limpa seus índices e dados.
     * @param tableName - Nome da tabela.
     * @param columnName - Nome da coluna.
     */
    static deleteColumn(tableName, columnName, schemaName) {
        let table;
        if (schemaName !== undefined) {
            table = getTable(tableName, schemaName);
        }
        else {
            table = getTable(tableName);
        }
        table.indexes[columnName]?.clear();
        delete table.indexes[columnName];
        for (const row of table.rows) {
            delete row.values[columnName];
        }
        delete table.columns[columnName];
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    /**
     * Remove uma linha e ajusta os índices remanescentes.
     * @param tableName - Nome da tabela.
     * @param rowIndex - Índice da linha a remover.
     */
    static deleteRow(tableName, rowIndex, schemaName) {
        let table;
        if (schemaName !== undefined) {
            table = getTable(tableName, schemaName);
        }
        else {
            table = getTable(tableName);
        }
        const row = table.rows[rowIndex];
        for (const col in table.indexes) {
            const value = row.values[col];
            const indexMap = table.indexes[col];
            if (!indexMap.has(value))
                continue;
            const arr = indexMap.get(value);
            const pos = arr.indexOf(rowIndex);
            if (pos !== -1)
                arr.splice(pos, 1);
            if (arr.length === 0) {
                indexMap.delete(value);
            }
        }
        table.rows.splice(rowIndex, 1);
        for (const col in table.indexes) {
            const indexMap = table.indexes[col];
            for (const [value, arr] of indexMap.entries()) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] > rowIndex) {
                        arr[i]--;
                    }
                }
            }
        }
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    static renameDatabase(oldName, newName) {
        const db = databases[oldName];
        if (!db)
            return;
        delete databases[oldName];
        db.name = newName;
        databases[newName] = db;
        currentDatabase = newName;
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    static renameSchema(oldName, newName) {
        const db = getCurrentDatabase();
        const s = db.schemas[oldName];
        if (!s)
            return;
        delete db.schemas[oldName];
        s.name = newName;
        db.schemas[newName] = s;
        currentSchema = newName;
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    static renameTable(oldName, newName, schemaName) {
        let schema;
        let t;
        if (schemaName !== undefined) {
            schema = getCurrentDatabase().schemas[schemaName];
            t = getTable(oldName, schemaName);
        }
        else {
            schema = getCurrentSchema();
            t = getTable(oldName);
        }
        if (!t)
            return;
        delete schema.tables[oldName];
        t.name = newName;
        schema.tables[newName] = t;
        currentTable = newName;
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
    static alterColumn(tableName, oldColumnName, newColumn, schemaName) {
        /**
         * Converte um valor de célula para o tipo de coluna informado.
         * Usado ao alterar o tipo de uma coluna existente para adaptar os valores já presentes.
         * @param value - Valor atual da célula.
         * @param newType - Tipo de coluna destino.
         * @returns Valor convertido apropriado para `newType` ou o valor original quando não aplicável.
         */
        function convertRowValue(value, newType) {
            if (!valueExists(value))
                return value;
            return newType.parse(value);
        }
        function transformColumnToJson(column) {
            return JSON.stringify(column, (key, value) => {
                if (key === "parent")
                    return undefined;
                return value;
            });
        }
        let table;
        if (schemaName !== undefined) {
            table = getTable(tableName, schemaName);
        }
        else {
            table = getTable(tableName);
        }
        const oldColumn = table.columns[oldColumnName];
        if (transformColumnToJson(oldColumn) === transformColumnToJson(newColumn))
            return;
        newColumn.incrementCounter = oldColumn.incrementCounter;
        if (!oldColumn.isAutoIncrement && newColumn.isAutoIncrement) {
            newColumn.incrementCounter = table.rows.reduce((max, row) => {
                const value = Number(row.values[oldColumnName]);
                return Number.isFinite(value) ? Math.max(max, value) : max;
            }, 0) + 1;
        }
        if (oldColumnName !== newColumn.name) {
            for (const row of table.rows) {
                row.values[newColumn.name] = row.values[oldColumnName];
                delete row.values[oldColumnName];
            }
            table.indexes[newColumn.name] = table.indexes[oldColumnName];
            delete table.indexes[oldColumnName];
            delete table.columns[oldColumnName];
        }
        table.columns[newColumn.name] = newColumn;
        if (oldColumn.type !== newColumn.type) {
            for (const row of table.rows) {
                row.values[newColumn.name] = convertRowValue(row.values[newColumn.name], newColumn.type);
            }
        }
        if (oldColumn.type !== newColumn.type || oldColumnName !== newColumn.name) {
            table.remakeColumnIndex(newColumn.name);
        }
        refreshUI();
        if (!autoSaveEnabled)
            return;
        saveToLocalStorage();
        saveToSupabase();
    }
}
class SQLTime {
    hours;
    minutes;
    seconds;
    constructor(hours, minutes = 0, seconds = 0) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }
    static fromString(value) {
        const match = value.match(/^(\d{2}):(\d{2}):(\d{2})$/);
        if (!match)
            return null;
        const [, h, m, s] = match.map(Number);
        if (h < 0 || h > 23 ||
            m < 0 || m > 59 ||
            s < 0 || s > 59)
            return null;
        return new SQLTime(h, m, s);
    }
    static fromNumber(value) {
        if (!Number.isFinite(value))
            return null;
        value = Math.floor(value);
        if (value < 0 || value >= 24 * 60 * 60)
            return null;
        const hours = Math.floor(value / 3600);
        value %= 3600;
        const minutes = Math.floor(value / 60);
        const seconds = value % 60;
        return new SQLTime(hours, minutes, seconds);
    }
    static now() {
        const now = new Date();
        return new SQLTime(now.getHours(), now.getMinutes(), now.getSeconds());
    }
    static toString(time) {
        return [
            time.hours.toString().padStart(2, "0"),
            time.minutes.toString().padStart(2, "0"),
            time.seconds.toString().padStart(2, "0")
        ].join(":");
    }
}
class SQLDate {
    year;
    month;
    day;
    constructor(year, month = 1, day = 1) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
    static fromString(value) {
        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match)
            return null;
        const [, y, m, d] = match.map(Number);
        if (y < 0 || m < 1 || m > 12)
            return null;
        const date = new Date(y, m - 1, d);
        if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d)
            return null;
        return new SQLDate(y, m, d);
    }
    static fromDate(value) {
        let y = value.getFullYear();
        let m = value.getMonth();
        let d = value.getDay();
        return new SQLDate(y, m, d);
    }
    static now() {
        const now = new Date();
        return new SQLDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }
    static toString(date) {
        return [
            date.year.toString().padStart(4, "0"),
            date.month.toString().padStart(2, "0"),
            date.day.toString().padStart(2, "0")
        ].join("-");
    }
}
var DataTypes;
(function (DataTypes) {
    class DataType {
    }
    DataTypes.DataType = DataType;
    function createDataTypeFromString(type, enumValues = [], varcharLength = 255) {
        switch (type) {
            case "TEXT":
                return types.TEXT;
            case "INTEGER":
                return types.INTEGER;
            case "FLOAT":
                return types.FLOAT;
            case "BOOLEAN":
                return types.BOOLEAN;
            case "DATE":
                return types.DATE;
            case "TIME":
                return types.TIME;
            case "ENUM":
                return types.ENUM(enumValues);
            case "VARCHAR":
                return new VarcharType(varcharLength);
        }
    }
    DataTypes.createDataTypeFromString = createDataTypeFromString;
    class TextType extends DataType {
        name = "TEXT";
        color = "green5";
        validate(value) {
            return typeof value === "string";
        }
        parse(value) {
            return String(value);
        }
    }
    DataTypes.TextType = TextType;
    class IntegerType extends DataType {
        name = "INTEGER";
        color = "blue3";
        validate(value) {
            return typeof value === "number" && Number.isInteger(value);
        }
        parse(value) {
            return parseInt(value);
        }
    }
    DataTypes.IntegerType = IntegerType;
    class FloatType extends DataType {
        name = "FLOAT";
        color = "cyan6";
        validate(value) {
            return typeof value === "number" && Number.isFinite(value);
        }
        parse(value) {
            return parseFloat(value);
        }
    }
    DataTypes.FloatType = FloatType;
    class BooleanType extends DataType {
        name = "BOOLEAN";
        color = "purple5";
        validate(value) {
            value = typeof value === "string" ? value.trim().toLowerCase() : value;
            return value === true ||
                value === false ||
                value === "true" ||
                value === "false";
        }
        parse(value) {
            value = typeof value === "string" ? value.trim() : value;
            if (value === true || (typeof value === "string" && value.toLowerCase() === "true"))
                return true;
            if (value === false || (typeof value === "string" && value.toLowerCase() === "false"))
                return false;
            return null;
        }
    }
    DataTypes.BooleanType = BooleanType;
    class DateType extends DataType {
        name = "DATE";
        color = "orange5";
        validate(value) {
            return value instanceof SQLDate || (typeof value === "string" && SQLDate.fromString(value) !== null);
        }
        parse(value) {
            if (value && typeof value === "object" && typeof value.year === "number" &&
                typeof value.month === "number" && typeof value.day === "number") {
                return new SQLDate(value.year, value.month, value.day);
            }
            if (typeof value !== "string")
                return null;
            return SQLDate.fromString(value);
        }
    }
    DataTypes.DateType = DateType;
    class TimeType extends DataType {
        name = "TIME";
        color = "yellow4";
        validate(value) {
            return value instanceof SQLTime || (typeof value === "string" && SQLTime.fromString(value) !== null)
                || (typeof value === "number" && SQLTime.fromNumber(value) !== null);
        }
        parse(value) {
            if (value && typeof value === "object" && typeof value.hours === "number" &&
                typeof value.minutes === "number" && typeof value.seconds === "number") {
                return new SQLTime(value.hours, value.minutes, value.seconds);
            }
            if (typeof value === "string")
                return SQLTime.fromString(value);
            else if (typeof value === "number")
                return SQLTime.fromNumber(value);
            return null;
        }
    }
    DataTypes.TimeType = TimeType;
    class EnumType extends DataType {
        name = "ENUM";
        color = "pink5";
        allowedValues;
        constructor(allowedValues) {
            super();
            this.allowedValues = allowedValues;
        }
        validate(value) {
            return typeof value === "string" && this.allowedValues.includes(value);
        }
        parse(value) {
            return String(value);
        }
        getAllowedValues() {
            return this.allowedValues;
        }
        setAllowedValues(newValues) {
            this.allowedValues = newValues;
        }
    }
    DataTypes.EnumType = EnumType;
    class VarcharType extends DataType {
        name = "VARCHAR";
        color = "green2";
        maxLength;
        constructor(maxLength) {
            super();
            this.maxLength = maxLength;
        }
        validate(value) {
            return typeof value === "string" && value.length <= this.maxLength;
        }
        parse(value) {
            return String(value);
        }
        getMaxLength() {
            return this.maxLength;
        }
        setMaxLength(newLength) {
            this.maxLength = newLength;
        }
    }
    DataTypes.VarcharType = VarcharType;
})(DataTypes || (DataTypes = {}));
let databases = {};
const databaseGroup = new DB.NodeGroup("databases", [], () => { abrirFechar(false, "criacao-database"); });
const types = {
    INTEGER: new DataTypes.IntegerType(),
    FLOAT: new DataTypes.FloatType(),
    TEXT: new DataTypes.TextType(),
    BOOLEAN: new DataTypes.BooleanType(),
    DATE: new DataTypes.DateType(),
    TIME: new DataTypes.TimeType(),
    ENUM(values) {
        return new DataTypes.EnumType(values);
    },
    VARCHAR(length) {
        return new DataTypes.VarcharType(length);
    },
};
/**
 * Palavras reservadas SQL.
 */
const keyWords = [
    "primary", "key", "foreign", "not", "null", "unique", "default", "auto_increment", "where", "select", "from", "insert",
    "into", "values", "update", "set", "delete", "create", "table", "database", "use", "drop", "alter", "add", "column", "enum",
    "references", "on", "and", "or", "in", "is", "integer", "float", "text", "date", "time", "boolean", "varchar"
];
let currentDatabase = null;
let currentSchema = null;
let currentTable = null;
let terminalSessions = [];
let currentTerminalSession = 0;
function getCurrentDatabase() {
    return currentDatabase ? databases[currentDatabase] : null;
}
function getCurrentSchema() {
    return currentDatabase && currentSchema ? getCurrentDatabase().schemas[currentSchema] : null;
}
function getCurrentTable() {
    return currentDatabase && currentSchema && currentTable ? getCurrentSchema().tables[currentTable] : null;
}
function getTable(tableName, schemaName) {
    return currentDatabase && (schemaName || currentSchema) ? getCurrentDatabase().schemas[schemaName || currentSchema].tables[tableName] || null : null;
}
//#endregion
// #region Interface functions
/**
 * Cria uma nova database a partir do campo de entrada da interface.
 */
function createDatabaseInterface() {
    const databaseNameInput = document.getElementById("nome-database-input");
    const databaseName = databaseNameInput.value.trim();
    if (databaseName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da database não pode ser vazio.</p>");
        return;
    }
    else if (!isValidSQLName(databaseName)) {
        openNotifications("<p style='color: var(--red5)'>O nome da database não segue o padrão permitido.</p>");
        return;
    }
    else if (databases[databaseName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma database com esse nome.</p>");
        return;
    }
    SGBDFunctions.createDatabase(new DB.Database(databaseName));
    databaseNameInput.value = "";
    openNotifications(`<p style='color: var(--green4)'>Database "${databaseName}" criada com sucesso!</p>`);
}
function createSchemaInterface() {
    const schemaNameInput = document.getElementById("nome-schema-input");
    const schemaName = schemaNameInput.value.trim();
    if (schemaName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da schema não pode ser vazio.</p>");
        return;
    }
    else if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (!isValidSQLName(schemaName)) {
        openNotifications("<p style='color: var(--red5)'>O nome da schema não segue o padrão permitido.</p>");
        return;
    }
    else if (getCurrentDatabase().schemas[schemaName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe um schema com esse nome.</p>");
        return;
    }
    SGBDFunctions.createSchema(new DB.Schema(schemaName, getCurrentDatabase()));
    schemaNameInput.value = "";
    openNotifications(`<p style='color: var(--green4)'>Schema "${schemaName}" criada com sucesso!</p>`);
}
/**
 * Cria uma nova tabela com as colunas definidas na interface.
 */
function createTableInterface() {
    const tableNameInput = document.getElementById("nome-tabela-input");
    const tableName = tableNameInput.value.trim();
    if (tableName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não pode ser vazio.</p>");
        return;
    }
    else if (!isValidSQLName(tableName)) {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não segue o padrão permitido.</p>");
        return;
    }
    else if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (currentSchema === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma schema selecionada.</p>");
        return;
    }
    else if (getTable(tableName)) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma tabela com esse nome.</p>");
        return;
    }
    const table = new DB.Table(tableName, getCurrentSchema());
    const columnsUl = document.querySelector("#criacao-tabela ul");
    const parsedColumns = parseColumnsFromInputs(columnsUl.children, table.columns);
    if (parsedColumns === null)
        return;
    for (const column of parsedColumns) {
        table.columns[column.name] = column;
    }
    SGBDFunctions.createTable(table);
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl);
    tableNameInput.value = "";
    openNotifications(`<p style='color: var(--green5)'>Tabela "${tableName}" criada com sucesso!</p>`);
}
/**
 * Adiciona colunas à tabela atualmente selecionada.
 */
function addColumnsInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    }
    const columnsUl = document.querySelector("#adicionar-colunas ul#criacao-colunas-edit");
    const table = getTable(currentTable);
    const columnsToAdd = parseColumnsFromInputs(columnsUl.children, table.columns);
    if (columnsToAdd === null)
        return;
    for (const column of columnsToAdd) {
        if (column.isNotNull && !column.hasDefault && !column.isAutoIncrement && !column.isCurrentTimestamp) {
            openNotifications(`<p style='color: var(--red5)'>Não é possível adicionar a coluna "${column.name}" com NOT NULL sem valor padrão.</p>`);
            return;
        }
    }
    for (const column of columnsToAdd) {
        SGBDFunctions.addColumn(table.name, column);
    }
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl);
    openNotifications(`<p style='color: var(--green5)'>Colunas adicionadas com sucesso!</p>`);
}
/**
 * Lê os campos do formulário e insere uma nova linha na tabela atual.
 */
function insertRowInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (currentSchema === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma schema selecionada.</p>");
        return;
    }
    else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    }
    else if (Object.keys(getTable(currentTable).columns).length === 0) {
        openNotifications("<p style='color: var(--red5)'>Não há colunas nessa tabela</p>");
        return;
    }
    let valuesBeforeIncrement = [];
    const table = getTable(currentTable);
    const rowUl = document.querySelector("#inserir-linha ul#colunas-inserir-linha");
    const row = new DB.Row(getCurrentTable(), {});
    for (const columnElement of rowUl.children) {
        const columnName = columnElement.querySelector("h3").textContent;
        const column = table.columns[columnName];
        if (column.isAutoIncrement) {
            let valueBeforeIncrement = table.columns[columnName].increment();
            valuesBeforeIncrement.push({ column: columnName, value: valueBeforeIncrement });
            row.values[columnName] = valueBeforeIncrement;
            continue;
        }
        if (column.isCurrentTimestamp) {
            if (compareTypes(column.type, types.DATE)) {
                row.values[columnName] = SQLDate.now();
            }
            else if (compareTypes(column.type, types.TIME)) {
                row.values[columnName] = SQLTime.now();
            }
            continue;
        }
        let rawValue;
        if (compareTypes(column.type, types.BOOLEAN) || compareTypes(column.type, types.ENUM([]))) {
            rawValue = columnElement.querySelector(".custom-dropdown button").textContent;
        }
        else {
            rawValue = columnElement.querySelector("input").value.trim();
        }
        if (rawValue === "") {
            if (column.isNotNull) {
                openNotifications(`<p style='color: var(--red5)'>A coluna "${columnName}" não pode ser nula.</p>`);
                table.revertAutoIncrementValues(valuesBeforeIncrement);
                return;
            }
            row.values[columnName] = column.hasDefault ? column.defaultValue : null;
            continue;
        }
        const value = column.type.parse(rawValue);
        if (value === null) {
            openNotifications(`<p style='color: var(--red5)'>Valor inválido para a coluna "${columnName}".</p>`);
            table.revertAutoIncrementValues(valuesBeforeIncrement);
            return;
        }
        if (table.columns[columnName].isUnique && table.indexes[columnName].has(value)) {
            openNotifications(`<p style='color: var(--red5)'>O valor "${value}" já existe para a coluna "${columnName}".</p>`);
            table.revertAutoIncrementValues(valuesBeforeIncrement);
            return;
        }
        if (!column.type.validate(value)) {
            openNotifications(`<p style='color: var(--red5)'>Valor inválido para a coluna "${columnName}".</p>`);
            table.revertAutoIncrementValues(valuesBeforeIncrement);
            return;
        }
        row.values[columnName] = value;
    }
    SGBDFunctions.insertRow(currentTable, row, currentSchema);
    changeInsertRowMenu();
    openNotifications(`<p style='color: var(--green5)'>Linha inserida com sucesso!</p>`);
}
/**
 * Atualiza uma linha existente a partir do formulário de edição.
 * @param rowIndex - Índice da linha que será alterada.
 */
function editRowInterface(rowIndex) {
    if (Object.keys(getTable(currentTable).columns).length === 0) {
        openNotifications("<p style='color: var(--red5)'>Não há colunas nessa tabela</p>");
        return;
    }
    const table = getTable(currentTable);
    const rowUl = document.querySelector("#editar-linha ul#colunas-editar-linha");
    const row = new DB.Row(getCurrentTable(), {});
    for (const columnElement of rowUl.children) {
        const columnName = columnElement.querySelector("h3").textContent;
        const column = table.columns[columnName];
        if (column.isAutoIncrement) {
            row.values[columnName] = table.rows[rowIndex].values[columnName];
            ;
            continue;
        }
        if (column.isCurrentTimestamp) {
            if (compareTypes(column.type, types.DATE)) {
                row.values[columnName] = SQLDate.now();
            }
            else if (compareTypes(column.type, types.TIME)) {
                row.values[columnName] = SQLTime.now();
            }
            continue;
        }
        let rawValue;
        if (compareTypes(column.type, types.BOOLEAN) || compareTypes(column.type, types.ENUM([]))) {
            rawValue = columnElement.querySelector(".custom-dropdown button").textContent;
        }
        else {
            rawValue = columnElement.querySelector("input").value.trim();
        }
        if (rawValue === "") {
            if (column.isNotNull) {
                openNotifications(`<p style='color: var(--red5)'>A coluna "${columnName}" não pode ser nula.</p>`);
                return;
            }
            row.values[columnName] = column.hasDefault ? column.defaultValue : null;
            continue;
        }
        const value = column.type.parse(rawValue);
        if (value === null) {
            openNotifications(`<p style='color: var(--red5)'>Valor inválido para a coluna "${columnName}".</p>`);
            return;
        }
        if (table.columns[columnName].isUnique && table.indexes[columnName].has(value)) {
            openNotifications(`<p style='color: var(--red5)'>O valor "${value}" já existe para a coluna "${columnName}".</p>`);
            return;
        }
        if (!column.type.validate(value)) {
            openNotifications(`<p style='color: var(--red5)'>Valor inválido para a coluna "${columnName}".</p>`);
            return;
        }
        row.values[columnName] = value;
    }
    SGBDFunctions.editRow(currentTable, rowIndex, row);
    changeEditRowMenu(rowIndex);
    openNotifications(`<p style='color: var(--green5)'>Linha editada com sucesso!</p>`);
}
/**
 * Renomeia a database atualmente selecionada.
 */
function renameDatabaseInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (currentTable !== null) {
        openNotifications("<p style='color: var(--red5)'>Feche a tabela selecionada para renomear a database.</p>");
        return;
    }
    const databaseNameInput = document.getElementById("renomear-database-input");
    const newName = databaseNameInput.value.trim();
    if (newName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da database não pode ser vazio.</p>");
    }
    else if (databases[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma database com esse nome.</p>");
    }
    else if (!isValidSQLName(newName)) {
        openNotifications("<p style='color: var(--red5)'>O nome da database não segue o padrão permitido.</p>");
    }
    else {
        SGBDFunctions.renameDatabase(currentDatabase, newName);
        openNotifications("<p style='color: var(--green5)'>Database renomeada com sucesso!</p>");
    }
}
function renameSchemaInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (currentSchema === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma schema selecionada.</p>");
        return;
    }
    const schemaNameInput = document.getElementById("renomear-schema-input");
    const newName = schemaNameInput.value.trim().toLowerCase();
    if (newName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome do schema não pode ser vazio.</p>");
    }
    else if (getCurrentDatabase().schemas[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe um schema com esse nome.</p>");
    }
    else if (!isValidSQLName(newName)) {
        openNotifications("<p style='color: var(--red5)'>O nome do schema não segue o padrão permitido.</p>");
    }
    else {
        SGBDFunctions.renameSchema(currentSchema, newName);
        openNotifications("<p style='color: var(--green5)'>Schema renomeado com sucesso!</p>");
    }
    refreshUI();
}
/**
 * Renomeia a tabela atualmente selecionada.
 */
function renameTableInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    }
    const tableNameInput = document.getElementById("renomear-tabela-input");
    const newName = tableNameInput.value.trim().toLowerCase();
    if (newName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não pode ser vazio.</p>");
    }
    else if (getCurrentSchema().tables[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma tabela com esse nome.</p>");
    }
    else if (!isValidSQLName(newName)) {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não segue o padrão permitido.</p>");
    }
    else {
        SGBDFunctions.renameTable(currentTable, newName);
        openNotifications("<p style='color: var(--green5)'>Tabela renomeada com sucesso!</p>");
    }
    refreshUI();
}
function alterColumnsInterface() {
    const table = getCurrentTable();
    const columnsUl = document.getElementById("lista-colunas-existentes");
    let columnsToAlter = parseColumnsFromInputs(columnsUl.children, {});
    if (columnsToAlter === null)
        return;
    for (let i = 0; i < columnsToAlter.length; i++) {
        const newColumn = columnsToAlter[i];
        const columnDiv = columnsUl.children[i];
        const oldColumnName = columnDiv.getAttribute("column-name");
        if (oldColumnName !== newColumn.name && table.columns[newColumn.name]) {
            openNotifications("<p style='color: var(--red5)'>Já existe uma coluna com o nome " + newColumn.name + ".</p>");
            return;
        }
        else if (!isValidSQLName(newColumn.name)) {
            openNotifications("<p style='color: var(--red5)'>O nome da coluna " + newColumn.name + " não segue o padrão permitido.</p>");
            return;
        }
        if (newColumn.isNotNull) {
            for (const row of table.rows) {
                if (row.values[oldColumnName] === null || row.values[oldColumnName] === undefined) {
                    openNotifications("<p style='color: var(--red5)'>Existem valores nulos nessa coluna.</p>");
                    return;
                }
            }
        }
        if (newColumn.isUnique) {
            const values = new Set();
            for (const row of table.rows) {
                const value = row.values[oldColumnName];
                if (values.has(value)) {
                    openNotifications("<p style='color: var(--red5)'>Existem valores duplicados nessa coluna.</p>");
                    return;
                }
                values.add(value);
            }
        }
        if (newColumn.reference) {
            const refTable = getCurrentSchema().tables[newColumn.reference.table];
            const refIndex = refTable.indexes[newColumn.reference.column];
            for (const row of table.rows) {
                const value = row.values[oldColumnName];
                if (value !== null && value !== undefined && !refIndex.has(value)) {
                    openNotifications("<p style='color: var(--red5)'>Existem valores nessa coluna que não correspondem a nenhuma entrada na tabela referenciada.</p>");
                    return;
                }
            }
        }
        if (compareTypes(newColumn.type, types.VARCHAR(0))) {
            for (const row of table.rows) {
                const value = row.values[oldColumnName];
                if (!newColumn.type.validate(newColumn.type.parse(value))) {
                    openNotifications("<p style='color: var(--red5)'>Existem valores inválidos na coluna \"" + newColumn.name + "\". Tamanho máximo de caracteres: " + newColumn.type.getMaxLength() + "</p>");
                    return;
                }
            }
        }
        if (compareTypes(newColumn.type, table.columns[oldColumnName].type)) {
            for (const row of table.rows) {
                const value = row.values[oldColumnName];
                if (!newColumn.type.validate(newColumn.type.parse(value))) {
                    openNotifications("<p style='color: var(--red5)'>Existem valores inválidos na coluna \"" + newColumn.name + "\".</p>");
                    return;
                }
            }
        }
    }
    for (let i = 0; i < columnsToAlter.length; i++) {
        const columnDiv = columnsUl.children[i];
        const newColumn = columnsToAlter[i];
        SGBDFunctions.alterColumn(currentTable, columnDiv.getAttribute("column-name"), newColumn);
    }
    openNotifications("<p style='color: var(--green5)'>Colunas alteradas com sucesso!</p>");
}
// Other interface 
function changeLeftSide() {
    function getDetailsLabel(details) {
        const summary = details.querySelector("summary");
        const label = summary?.querySelector("div > p")?.textContent?.trim();
        return label || "";
    }
    function buildPath(parentPath, details) {
        const label = getDetailsLabel(details);
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
    databaseGroup.c = Object.values(databases);
    const leftSide = document.getElementById("esquerda");
    const previousTree = leftSide.querySelector("div#tree");
    const opened = new Set();
    if (previousTree) {
        saveExpanded(previousTree, "", opened);
    }
    leftSide.innerHTML = "";
    const div = document.createElement("div");
    div.id = "tree";
    div.appendChild(databaseGroup.buildTree());
    leftSide.appendChild(div);
    restoreExpanded(div, "", opened);
}
/**
 * Re-renderiza a visualização detalhada da tabela selecionada.
 */
function changeTabelaSelecionadaTabela() {
    if (currentDatabase === null) {
        document.getElementById("nenhuma-tabela-selecionada").style.display = "flex";
        document.getElementById("tabela-selecionada-tabela").style.display = "none";
        return;
    }
    else if (currentTable === null) {
        document.getElementById("nenhuma-tabela-selecionada").style.display = "flex";
        document.getElementById("tabela-selecionada-tabela").style.display = "none";
        return;
    }
    document.getElementById("nenhuma-tabela-selecionada").style.display = "none";
    const selectedTable = document.getElementById("tabela-selecionada-tabela");
    selectedTable.style.display = "flex";
    const table = getTable(currentTable);
    let divLinha = document.createElement("div");
    divLinha.classList.add("linha-tabela");
    if (Object.keys(table.columns).length === 0) {
        divLinha.innerHTML = "<p style='color: var(--gray4)'>Nenhuma coluna</p>";
    }
    Object.values(table.columns).forEach((column) => {
        const divColuna = document.createElement("div");
        divColuna.innerHTML = `
            <p>${column.name}</p>
            <p>${column.type.name.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK → " + column.reference?.table + ", " + column.reference?.column : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO INCREMENT" : ""}${column.isCurrentTimestamp ? " • CURRENT_TIMESTAMP" : ""}</p>
        `;
        divColuna.onclick = function () {
            showHideTabelaSelecionadaLinhaColuna(true);
            changeTabelaSelecionadaLinhaColuna("column", undefined, column.name);
        };
        divLinha.appendChild(divColuna);
    });
    const headerActions = document.createElement("div");
    headerActions.innerHTML = "<p>Ações</p>";
    divLinha.appendChild(headerActions);
    document.getElementById("tabela-selecionada-tabela").innerHTML = "";
    document.getElementById("tabela-selecionada-tabela").appendChild(divLinha);
    table.rows.forEach((row, index) => {
        const divLinha = document.createElement("div");
        divLinha.classList.add("linha-tabela");
        Object.values(table.columns).forEach((column) => {
            const divCelula = document.createElement("div");
            let value = row.values[column.name];
            let displayValue = value;
            if (compareTypes(column.type, types.DATE) && valueExists(value)) {
                displayValue = SQLDate.toString(value);
            }
            else if (compareTypes(column.type, types.TIME) && valueExists(value)) {
                displayValue = SQLTime.toString(value);
            }
            divCelula.innerHTML = `<p>${displayValue}</p>`;
            divLinha.appendChild(divCelula);
        });
        const rowActions = document.createElement("div");
        rowActions.innerHTML = `
            <button onclick="thifrebd.abrirFechar(false, 'editar-linha'); thifrebd.changeEditRowMenu(${index})">
                <svg viewBox="0 -960 960 960" fill="currentcolor">
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                </svg>
            </button>
            <button onclick="thifrebd.abrirFechar(false, 'confirmar-deletar'); thifrebd.changeConfirmDeleteMenu('row', ${index}, undefined)">
                <svg viewBox="0 -960 960 960" fill="currentcolor">
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                </svg>
            </button>
        `;
        divLinha.onclick = function () {
            showHideTabelaSelecionadaLinhaColuna(true);
            changeTabelaSelecionadaLinhaColuna("row", index, undefined);
        };
        divLinha.appendChild(rowActions);
        document.getElementById("tabela-selecionada-tabela").appendChild(divLinha);
    });
}
/**
 * Converte os blocos de criação de colunas em instâncias de `Column`.
 * @param columns - Conjunto de blocos da interface.
 * @param existingColumns - Colunas já existentes para validação de nomes duplicados.
 * @returns Lista de colunas válidas ou `null` quando houver erro.
 */
function parseColumnsFromInputs(columns, existingColumns) {
    const parsedColumns = [];
    const knownColumns = new Set(Object.keys(existingColumns));
    for (const columnDiv of columns) {
        const columnInputs = readColumnInputs(columnDiv);
        const column = buildColumnFromInputs(columnInputs, knownColumns);
        if (column === null)
            return null;
        knownColumns.add(columnInputs.columnName);
        parsedColumns.push(column);
    }
    return parsedColumns;
}
/**
 * Lê os valores do formulário de coluna sem aplicar validações.
 * @param columnDiv - Bloco de formulário da coluna.
 * @returns Dados brutos da coluna.
 */
function readColumnInputs(columnDiv) {
    const columnNameInput = columnDiv.querySelector("input[type='text']");
    const columnTypeElement = columnDiv.querySelector(".custom-dropdown-trigger");
    const isPrimaryKey = columnDiv.querySelector(".primary-key");
    const isForeignKey = columnDiv.querySelector(".foreign-key");
    const isNotNull = columnDiv.querySelector(".not-null");
    const isUnique = columnDiv.querySelector(".unique");
    const hasDefault = columnDiv.querySelector(".default");
    const isAutoIncrement = columnDiv.querySelector(".auto-increment");
    const isCurrentTimestamp = columnDiv.querySelector(".auto-date");
    const defaultValueInput = columnDiv.querySelector(".default-input-text input");
    const defaultBooleanButton = columnDiv.querySelector(".default-input-text .custom-dropdown-trigger");
    const typeValuesInput = columnDiv.querySelector(".type-values input");
    const referenceSchemaElement = columnDiv.querySelector(".referencia .custom-dropdown:nth-child(2) .custom-dropdown-trigger");
    const referenceTableElement = columnDiv.querySelector(".referencia .custom-dropdown:nth-child(3) .custom-dropdown-trigger");
    const referenceColumnElement = columnDiv.querySelector(".referencia .custom-dropdown:nth-child(4) .custom-dropdown-trigger");
    return {
        columnName: columnNameInput.value.trim().toLowerCase(),
        columnType: DataTypes.createDataTypeFromString(columnTypeElement.textContent.toUpperCase()),
        isPrimaryKey: isPrimaryKey.checked,
        isForeignKey: isForeignKey.checked,
        isNotNull: isNotNull.checked,
        isUnique: isUnique.checked,
        hasDefault: hasDefault.checked,
        isAutoIncrement: isAutoIncrement.checked,
        isCurrentTimestamp: isCurrentTimestamp.checked,
        defaultValue: defaultValueInput?.value ?? "",
        defaultBooleanValue: defaultBooleanButton?.textContent.toLowerCase().trim() === "true",
        typeValues: typeValuesInput ? typeValuesInput.value.trim() : "",
        referenceSchema: referenceSchemaElement?.textContent ?? "",
        referenceTable: referenceTableElement?.textContent ?? "",
        referenceColumn: referenceColumnElement?.textContent ?? ""
    };
}
/**
 * Valida os dados de uma coluna e converte o resultado em `Column`.
 * @param columnInputs - Dados brutos lidos do formulário.
 * @param knownColumns - Nomes já utilizados no conjunto atual.
 * @returns Instância válida de `Column` ou `null` quando houver erro.
 */
function buildColumnFromInputs(columnInputs, knownColumns) {
    if (columnInputs.columnName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da coluna não pode ser vazio.</p>");
        return null;
    }
    else if (knownColumns.has(columnInputs.columnName)) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma coluna com esse nome.</p>");
        return null;
    }
    const column = new DB.Column(columnInputs.columnName, getCurrentTable(), columnInputs.columnType, columnInputs.isPrimaryKey, columnInputs.isForeignKey, columnInputs.isNotNull, columnInputs.isUnique, columnInputs.isAutoIncrement, columnInputs.hasDefault, columnInputs.isCurrentTimestamp);
    if (compareTypes(column.type, types.ENUM([]))) {
        column.type.setAllowedValues(columnInputs.typeValues.split(",").map((value) => value.trim()));
    }
    if (compareTypes(column.type, types.VARCHAR(0))) {
        const varcharLength = parseInt(columnInputs.typeValues);
        if (isNaN(varcharLength) || varcharLength <= 0) {
            openNotifications("<p style='color: var(--red5)'>O tamanho do VARCHAR deve ser um número positivo.</p>");
            return null;
        }
        column.type.setMaxLength(varcharLength);
    }
    if (column.isForeignKey) {
        if (columnInputs.referenceSchema === "Selecione um schema" || columnInputs.referenceTable === "Selecione uma tabela"
            || columnInputs.referenceColumn === "Selecione uma coluna") {
            openNotifications("<p style='color: var(--red5)'>Selecione o schema, a tabela e a coluna de referência para a chave estrangeira.</p>");
            return null;
        }
        if (getCurrentDatabase().schemas[columnInputs.referenceSchema].tables[columnInputs.referenceTable].columns[columnInputs.referenceColumn].type !== column.type) {
            openNotifications("<p style='color: var(--red5)'>O tipo da coluna de referência não corresponde ao tipo da coluna.</p>");
            return null;
        }
        column.reference = {
            schema: columnInputs.referenceSchema,
            table: columnInputs.referenceTable,
            column: columnInputs.referenceColumn
        };
    }
    if (columnInputs.hasDefault) {
        if (columnInputs.defaultValue.trim() === "" && !compareTypes(columnInputs.columnType, types.BOOLEAN)) {
            openNotifications("<p style='color: var(--red5)'>O valor padrão não pode ser vazio.</p>");
            return null;
        }
        column.defaultValue = columnInputs.columnType.parse(columnInputs.defaultValue);
        if (valueExists(columnInputs.defaultBooleanValue) && compareTypes(columnInputs.columnType, types.BOOLEAN)) {
            column.defaultValue = columnInputs.defaultBooleanValue;
        }
        if (!column.type.validate(column.defaultValue)) {
            openNotifications("<p style='color: var(--red5)'>O valor padrão não é válido para o tipo da coluna.</p>");
            return null;
        }
    }
    return column;
}
/**
 * Mostra ou oculta o painel de detalhe de linha ou coluna.
 * @param shouldShow - Define se o painel deve aparecer.
 */
function showHideTabelaSelecionadaLinhaColuna(shouldShow) {
    const tabelaSelecionadaLinhaColuna = document.getElementById("tabela-selecionada-linha-coluna");
    tabelaSelecionadaLinhaColuna.style.display = shouldShow ? "flex" : "none";
}
/**
 * Atualiza o painel de detalhes para uma linha ou coluna específica.
 * @param type - Tipo do detalhe a exibir.
 * @param rowIndex - Índice da linha, quando aplicável.
 * @param columnName - Nome da coluna, quando aplicável.
 */
function changeTabelaSelecionadaLinhaColuna(type, rowIndex, columnName) {
    function createDisplayValue(value, columnType) {
        let displayValue;
        if (compareTypes(columnType, types.DATE) && valueExists(value)) {
            displayValue = SQLDate.toString(value);
        }
        else if (compareTypes(columnType, types.TIME) && valueExists(value)) {
            displayValue = SQLTime.toString(value);
        }
        else {
            displayValue = String(value);
        }
        if (displayValue === "")
            displayValue = "null";
        return displayValue;
    }
    const tabelaSelecionadaLinhaColuna = document.getElementById("tabela-selecionada-linha-coluna");
    const header = tabelaSelecionadaLinhaColuna.querySelector("#tabela-selecionada-linha-coluna-header h3");
    header.textContent = type === "row" ? "Linha" : "Coluna";
    const lineColumnsNumber = tabelaSelecionadaLinhaColuna.querySelector("h4");
    lineColumnsNumber.textContent = type === "row" ? `${Object.keys(getTable(currentTable).columns).length} colunas` : `${Object.keys(getTable(currentTable).rows).length} linhas`;
    const ul = tabelaSelecionadaLinhaColuna.querySelector("ul");
    ul.innerHTML = "";
    if (type === "row") {
        for (const columnName in getTable(currentTable).columns) {
            const div = document.createElement("div");
            const value = getTable(currentTable).rows[rowIndex].values[columnName];
            const columnType = getTable(currentTable).columns[columnName].type;
            const displayValue = createDisplayValue(value, columnType);
            div.innerHTML = `
                <h5>${columnName} (${columnType.name})</h5>
                <p>${displayValue}</p>
            `;
            ul.appendChild(div);
        }
    }
    else {
        for (let i = 0; i < getTable(currentTable).rows.length; i++) {
            const div = document.createElement("div");
            const value = getTable(currentTable).rows[i].values[columnName];
            const columnType = getTable(currentTable).columns[columnName].type;
            const displayValue = createDisplayValue(value, columnType);
            div.innerHTML = `
                <h5>Linha ${i + 1}</h5>
                <p>${displayValue}</p>
            `;
            ul.appendChild(div);
        }
    }
}
/**
 * Sincroniza todos os painéis e listas com o estado atual do banco.
 */
function refreshUI() {
    changeTabelaSelecionadaTabela();
    showHideTabelaSelecionadaLinhaColuna(false);
    changeLeftSide();
    refreshLogical();
}
// central menus
/**
 * Cria um bloco de formulário para configuração de uma coluna.
 * @param parent - Elemento pai que receberá o bloco.
 */
function createColumnCreationDiv(parent) {
    const mainDiv = document.createElement("div");
    mainDiv.className = "outlined";
    // Input de nome da coluna
    const columnNameInput = document.createElement("input");
    columnNameInput.className = "menu-central-input";
    columnNameInput.type = "text";
    columnNameInput.placeholder = "Nome da coluna";
    mainDiv.appendChild(columnNameInput);
    // Dropdown customizado
    const customDropdown = document.createElement("div");
    customDropdown.className = "custom-dropdown";
    const dropdownButton = document.createElement("button");
    dropdownButton.className = "custom-dropdown-trigger";
    dropdownButton.textContent = "Text";
    dropdownButton.onclick = function () { openCustomDropdown(dropdownButton); };
    const dropdownMenu = document.createElement("ul");
    dropdownMenu.className = "custom-dropdown-menu";
    const options = ["Text", "Integer", "Float", "Boolean", "Date", "Time", "Enum", "Varchar"];
    options.forEach((option, index) => {
        const li = document.createElement("li");
        li.className = "custom-dropdown-option";
        if (index === 0)
            li.classList.add("custom-dropdown-option-selected");
        li.textContent = option;
        dropdownMenu.appendChild(li);
    });
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "column-type";
    hiddenInput.value = "text";
    customDropdown.appendChild(dropdownButton);
    customDropdown.appendChild(dropdownMenu);
    customDropdown.appendChild(hiddenInput);
    mainDiv.appendChild(customDropdown);
    // Characteristics
    const characteristics = document.createElement("div");
    characteristics.className = "flex-wrap-div";
    const characteristicsList = [
        { className: "primary-key", name: "primary-key", label: "Primary key" },
        { className: "foreign-key", name: "foreign-key", label: "Foreign key" },
        { className: "not-null", name: "not-null", label: "Not null" },
        { className: "unique", name: "unique", label: "Unique" },
        { className: "default", name: "default", label: "Default" },
        { className: "auto-increment", name: "auto-increment", label: "Auto increment", hidden: true },
        { className: "auto-date", name: "auto-date", label: "Current timestamp", hidden: true },
        { className: "auto-time", name: "auto-time", label: "Current timestamp", hidden: true }
    ];
    characteristicsList.forEach((char) => {
        const label = document.createElement("label");
        label.classList.add("checkbox-div");
        if (char.hidden)
            label.style.display = "none";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add(char.className);
        checkbox.name = char.name;
        checkbox.onclick = function () { updateCharacteristics(mainDiv); };
        if (char.name === "default") {
            checkbox.onclick = function () { updateCharacteristics(mainDiv); updateDefaultInput(mainDiv); };
        }
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(char.label));
        characteristics.appendChild(label);
    });
    // Delete column button
    const deleteDiv = document.createElement("div");
    deleteDiv.className = "last-item-flex-wrap-div trash-icon";
    deleteDiv.innerHTML = `
    <svg viewBox="0 -960 960 960" fill="currentcolor">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
    </svg>
    `;
    deleteDiv.onclick = function () { deleteColumnCreationDiv(deleteDiv); };
    characteristics.appendChild(deleteDiv);
    mainDiv.appendChild(characteristics);
    // Referência (FK)
    const referenciaDiv = document.createElement("div");
    referenciaDiv.classList.add("referencia", "post-characteristics");
    referenciaDiv.style.display = "none";
    const referenciaP = document.createElement("p");
    referenciaP.textContent = "Referência";
    referenciaDiv.appendChild(referenciaP);
    // Schema de referência
    const refSchemaCustomDropdown = document.createElement("div");
    refSchemaCustomDropdown.className = "custom-dropdown";
    const refSchemaButton = document.createElement("button");
    refSchemaButton.className = "custom-dropdown-trigger";
    refSchemaButton.textContent = "Selecione um schema";
    refSchemaButton.onclick = function () { openCustomDropdown(refSchemaButton); };
    const refSchemaMenu = document.createElement("ul");
    refSchemaMenu.className = "custom-dropdown-menu";
    const refSchemaHiddenInput = document.createElement("input");
    refSchemaHiddenInput.type = "hidden";
    refSchemaHiddenInput.name = "reference-schema";
    refSchemaHiddenInput.value = "text";
    refSchemaCustomDropdown.appendChild(refSchemaButton);
    refSchemaCustomDropdown.appendChild(refSchemaMenu);
    refSchemaCustomDropdown.appendChild(refSchemaHiddenInput);
    referenciaDiv.appendChild(refSchemaCustomDropdown);
    // Tabela de referência
    const refTableCustomDropdown = document.createElement("div");
    refTableCustomDropdown.className = "custom-dropdown";
    const refTableButton = document.createElement("button");
    refTableButton.className = "custom-dropdown-trigger";
    refTableButton.textContent = "Selecione uma tabela";
    refTableButton.onclick = function () { openCustomDropdown(refTableButton); };
    const refTableMenu = document.createElement("ul");
    refTableMenu.className = "custom-dropdown-menu";
    const refTableHiddenInput = document.createElement("input");
    refTableHiddenInput.type = "hidden";
    refTableHiddenInput.name = "reference-table";
    refTableHiddenInput.value = "text";
    refTableCustomDropdown.appendChild(refTableButton);
    refTableCustomDropdown.appendChild(refTableMenu);
    refTableCustomDropdown.appendChild(refTableHiddenInput);
    referenciaDiv.appendChild(refTableCustomDropdown);
    // Coluna de referência
    const refColumnCustomDropdown = document.createElement("div");
    refColumnCustomDropdown.className = "custom-dropdown";
    const refColumnButton = document.createElement("button");
    refColumnButton.className = "custom-dropdown-trigger";
    refColumnButton.textContent = "Selecione uma coluna";
    refColumnButton.onclick = function () { openCustomDropdown(refColumnButton); };
    const refColumnMenu = document.createElement("ul");
    refColumnMenu.className = "custom-dropdown-menu";
    const refColumnHiddenInput = document.createElement("input");
    refColumnHiddenInput.type = "hidden";
    refColumnHiddenInput.value = "text";
    refColumnCustomDropdown.appendChild(refColumnButton);
    refColumnCustomDropdown.appendChild(refColumnMenu);
    refColumnCustomDropdown.appendChild(refColumnHiddenInput);
    referenciaDiv.appendChild(refColumnCustomDropdown);
    mainDiv.appendChild(referenciaDiv);
    // Default input
    const defaultDiv = document.createElement("div");
    defaultDiv.classList.add("default-input-text", "post-characteristics");
    defaultDiv.style.display = "none";
    const defaultP = document.createElement("p");
    defaultP.textContent = "Default";
    defaultDiv.appendChild(defaultP);
    const defaultInput = document.createElement("input");
    defaultInput.type = "text";
    defaultInput.placeholder = "Valor padrão";
    defaultInput.classList.add("menu-central-input");
    defaultDiv.appendChild(defaultInput);
    mainDiv.appendChild(defaultDiv);
    // Type input
    const typeDiv = document.createElement("div");
    typeDiv.classList.add("type-values", "post-characteristics");
    typeDiv.style.display = "none";
    const typeP = document.createElement("p");
    typeP.textContent = "Valores do enum (separados por vírgula)";
    typeDiv.appendChild(typeP);
    const typeInput = document.createElement("input");
    typeInput.type = "text";
    typeInput.placeholder = "Valores separados por vírgula";
    typeInput.classList.add("menu-central-input");
    typeDiv.appendChild(typeInput);
    mainDiv.appendChild(typeDiv);
    parent.appendChild(mainDiv);
    updateCustomDropdowns();
}
/**
 * Remove um bloco de criação de coluna da interface.
 * @param button - Botão de remoção do bloco.
 */
function deleteColumnCreationDiv(button) {
    const div = button.parentElement.parentElement;
    div.remove();
}
/**
 * Cria um bloco visual para montar uma condição de busca.
 */
function createWhereConditionDiv() {
    const whereConditionsContainer = document.getElementById("where-conditions");
    const mainDiv = document.createElement("div");
    mainDiv.className = "outlined";
    whereConditionsContainer.appendChild(mainDiv);
    const topDiv = document.createElement("div");
    topDiv.className = "menu-central-justify-between";
    mainDiv.appendChild(topDiv);
    const columnsDropdown = document.createElement("div");
    columnsDropdown.className = "custom-dropdown";
    topDiv.appendChild(columnsDropdown);
    const columnsDropdownButton = document.createElement("button");
    columnsDropdownButton.className = "custom-dropdown-trigger";
    columnsDropdownButton.textContent = "Text";
    columnsDropdownButton.onclick = function () { openCustomDropdown(columnsDropdownButton); };
    columnsDropdown.appendChild(columnsDropdownButton);
    const columnsDropdownMenu = document.createElement("ul");
    columnsDropdownMenu.className = "custom-dropdown-menu";
    //adicionar as colunas
    columnsDropdown.appendChild(columnsDropdownMenu);
    const columnsHiddenInput = document.createElement("input");
    columnsHiddenInput.type = "hidden";
    columnsHiddenInput.name = "column";
    columnsDropdown.appendChild(columnsHiddenInput);
    const operatorDropdown = document.createElement("div");
    operatorDropdown.className = "custom-dropdown";
    topDiv.appendChild(operatorDropdown);
    const operatorDropdownButton = document.createElement("button");
    operatorDropdownButton.className = "custom-dropdown-trigger";
    operatorDropdownButton.textContent = "=";
    operatorDropdownButton.onclick = function () { openCustomDropdown(operatorDropdownButton); };
    operatorDropdown.appendChild(operatorDropdownButton);
    const operatorDropdownMenu = document.createElement("ul");
    operatorDropdownMenu.className = "custom-dropdown-menu";
    const options = ["=", "!=", ">", "<", ">=", "<="];
    options.forEach((option, index) => {
        const li = document.createElement("li");
        li.className = "custom-dropdown-option";
        if (index === 0)
            li.classList.add("custom-dropdown-option-selected");
        li.textContent = option;
        operatorDropdownMenu.appendChild(li);
    });
    operatorDropdown.appendChild(operatorDropdownMenu);
    const operatorHiddenInput = document.createElement("input");
    operatorHiddenInput.type = "hidden";
    operatorHiddenInput.name = "operator";
    operatorDropdown.appendChild(operatorHiddenInput);
    const bottomDiv = document.createElement("div");
    bottomDiv.className = "menu-central-justify-between";
    mainDiv.appendChild(bottomDiv);
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.placeholder = "Valor da condição";
    valueInput.className = "menu-central-input";
    bottomDiv.appendChild(valueInput);
    const deleteDiv = document.createElement("div");
    deleteDiv.className = "flex-wrap-div";
    deleteDiv.innerHTML = `
    <svg viewBox="0 -960 960 960" fill="currentcolor">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
    </svg>
    `;
    deleteDiv.onclick = function () { mainDiv.remove(); };
    bottomDiv.appendChild(deleteDiv);
    updateCustomDropdowns();
}
/**
 * Atualiza o campo do menu de configuração de database.
 */
function changeConfigurarDatabaseMenu() {
    const menu = document.getElementById("configurar-database");
    if (currentDatabase === null) {
        menu.querySelector("input").value = "";
        return;
    }
    menu.querySelector("input").value = currentDatabase;
}
function changeConfigurarSchemaMenu() {
    const menu = document.getElementById("configurar-schema");
    if (currentDatabase === null || currentSchema === null) {
        menu.querySelector("input").value = "";
        return;
    }
    menu.querySelector("input").value = currentSchema;
}
/**
 * Atualiza o campo do menu de configuração de tabela.
 */
function changeConfigurarTabelaMenu() {
    const menu = document.getElementById("configurar-tabela");
    if (currentDatabase === null || currentSchema === null || currentTable === null) {
        menu.querySelector("input").value = "";
        return;
    }
    menu.querySelector("input").value = currentTable;
}
/**
 * Recria o menu de edição de colunas da tabela atual.
 */
function changeEditColumnsMenu() {
    if (currentDatabase === null)
        return;
    const menu = document.getElementById("lista-colunas-existentes");
    menu.innerHTML = "";
    if (currentTable === null) {
        menu.innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        return;
    }
    else if (Object.keys(getTable(currentTable).columns).length === 0) {
        menu.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }
    Object.values(getTable(currentTable).columns).forEach((column) => {
        const mainDiv = document.createElement("div");
        mainDiv.className = "outlined";
        mainDiv.setAttribute("column-name", column.name);
        // Input de nome da coluna
        const columnNameInput = document.createElement("input");
        columnNameInput.className = "menu-central-input";
        columnNameInput.type = "text";
        columnNameInput.placeholder = "Nome da coluna";
        columnNameInput.value = column.name;
        mainDiv.appendChild(columnNameInput);
        // Dropdown customizado
        const customDropdown = document.createElement("div");
        customDropdown.className = "custom-dropdown";
        const dropdownButton = document.createElement("button");
        dropdownButton.className = "custom-dropdown-trigger";
        dropdownButton.textContent = column.type.name;
        dropdownButton.onclick = function () { openCustomDropdown(dropdownButton); };
        const dropdownMenu = document.createElement("ul");
        dropdownMenu.className = "custom-dropdown-menu";
        const allowedConversions = {
            "TEXT": ["Text", "Integer", "Float", "Boolean", "Date", "Time", "Varchar"],
            "INTEGER": ["Text", "Integer", "Float", "Boolean", "Date", "Time", "Varchar"],
            "FLOAT": ["Text", "Integer", "Float", "Boolean", "Date", "Time", "Varchar"],
            "BOOLEAN": ["Text", "Integer", "Float", "Boolean", "Varchar"],
            "DATE": ["Text", "Date", "Varchar"],
            "TIME": ["Text", "Integer", "Float", "Time", "Varchar"],
            "ENUM": ["text", "Enum", "Varchar"],
            "VARCHAR": ["Text", "Integer", "Float", "Boolean", "Date", "Time", "Varchar"]
        };
        let options = allowedConversions[column.type.name];
        options.forEach((option) => {
            const li = document.createElement("li");
            li.className = "custom-dropdown-option";
            if (option.toLowerCase() === column.type.name.toLowerCase())
                li.classList.add("custom-dropdown-option-selected");
            li.textContent = option;
            dropdownMenu.appendChild(li);
        });
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "column-type";
        hiddenInput.value = "text";
        customDropdown.appendChild(dropdownButton);
        customDropdown.appendChild(dropdownMenu);
        customDropdown.appendChild(hiddenInput);
        mainDiv.appendChild(customDropdown);
        // Characteristics
        const characteristics = document.createElement("div");
        characteristics.className = "flex-wrap-div";
        const characteristicsList = [
            { className: "primary-key", name: "primary-key", label: "Primary key" },
            { className: "foreign-key", name: "foreign-key", label: "Foreign key" },
            { className: "not-null", name: "not-null", label: "Not null" },
            { className: "unique", name: "unique", label: "Unique" },
            { className: "default", name: "default", label: "Default" },
            { className: "auto-increment", name: "auto-increment", label: "Auto increment", hidden: true },
            { className: "auto-date", name: "auto-date", label: "Current timestamp", hidden: true },
            { className: "auto-time", name: "auto-time", label: "Current timestamp", hidden: true }
        ];
        characteristicsList.forEach((char) => {
            const label = document.createElement("label");
            label.classList.add("checkbox-div");
            if (char.hidden)
                label.style.display = "none";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add(char.className);
            checkbox.name = char.name;
            checkbox.onclick = function () { updateCharacteristics(mainDiv); };
            if (char.name === "default") {
                checkbox.onclick = function () { updateCharacteristics(mainDiv); updateDefaultInput(mainDiv); };
            }
            checkbox.checked =
                (char.className === "primary-key" && column.isPrimaryKey) ||
                    (char.className === "foreign-key" && column.isForeignKey) ||
                    (char.className === "not-null" && column.isNotNull) ||
                    (char.className === "unique" && column.isUnique) ||
                    (char.className === "default" && column.hasDefault) ||
                    (char.className === "auto-increment" && column.isAutoIncrement) ||
                    ((char.className === "auto-date" || char.className === "auto-time") && column.isCurrentTimestamp);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(char.label));
            characteristics.appendChild(label);
        });
        // Delete column button
        const deleteDiv = document.createElement("div");
        deleteDiv.className = "last-item-flex-wrap-div trash-icon";
        deleteDiv.innerHTML = `
        <svg viewBox="0 -960 960 960"fill="currentcolor">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
        </svg>
        `;
        deleteDiv.onclick = function () {
            abrirFechar(false, 'confirmar-deletar');
            changeConfirmDeleteMenu('column', undefined, column.name);
        };
        characteristics.appendChild(deleteDiv);
        mainDiv.appendChild(characteristics);
        // Referência (FK)
        const referenciaDiv = document.createElement("div");
        referenciaDiv.classList.add("referencia", "post-characteristics");
        referenciaDiv.style.display = "none";
        const referenciaP = document.createElement("p");
        referenciaP.textContent = "Referência";
        referenciaDiv.appendChild(referenciaP);
        // Schema de referência
        const refSchemaCustomDropdown = document.createElement("div");
        refSchemaCustomDropdown.className = "custom-dropdown";
        const refSchemaButton = document.createElement("button");
        refSchemaButton.className = "custom-dropdown-trigger";
        refSchemaButton.textContent = "Selecione um schema";
        refSchemaButton.onclick = function () { openCustomDropdown(refSchemaButton); };
        const refSchemaMenu = document.createElement("ul");
        refSchemaMenu.className = "custom-dropdown-menu";
        const refSchemaHiddenInput = document.createElement("input");
        refSchemaHiddenInput.type = "hidden";
        refSchemaHiddenInput.name = "reference-schema";
        refSchemaHiddenInput.value = "text";
        refSchemaCustomDropdown.appendChild(refSchemaButton);
        refSchemaCustomDropdown.appendChild(refSchemaMenu);
        refSchemaCustomDropdown.appendChild(refSchemaHiddenInput);
        referenciaDiv.appendChild(refSchemaCustomDropdown);
        // Tabela de referência
        const refTableCustomDropdown = document.createElement("div");
        refTableCustomDropdown.className = "custom-dropdown";
        const refTableButton = document.createElement("button");
        refTableButton.className = "custom-dropdown-trigger";
        refTableButton.textContent = "Selecione uma tabela";
        refTableButton.onclick = function () { openCustomDropdown(refTableButton); };
        const refTableMenu = document.createElement("ul");
        refTableMenu.className = "custom-dropdown-menu";
        const refTableHiddenInput = document.createElement("input");
        refTableHiddenInput.type = "hidden";
        refTableHiddenInput.name = "reference-table";
        refTableHiddenInput.value = "text";
        refTableCustomDropdown.appendChild(refTableButton);
        refTableCustomDropdown.appendChild(refTableMenu);
        refTableCustomDropdown.appendChild(refTableHiddenInput);
        referenciaDiv.appendChild(refTableCustomDropdown);
        // Coluna de referência
        const refColumnCustomDropdown = document.createElement("div");
        refColumnCustomDropdown.className = "custom-dropdown";
        const refColumnButton = document.createElement("button");
        refColumnButton.className = "custom-dropdown-trigger";
        refColumnButton.textContent = "Selecione uma coluna";
        refColumnButton.onclick = function () { openCustomDropdown(refColumnButton); };
        const refColumnMenu = document.createElement("ul");
        refColumnMenu.className = "custom-dropdown-menu";
        const refColumnHiddenInput = document.createElement("input");
        refColumnHiddenInput.type = "hidden";
        refColumnHiddenInput.value = "text";
        refColumnCustomDropdown.appendChild(refColumnButton);
        refColumnCustomDropdown.appendChild(refColumnMenu);
        refColumnCustomDropdown.appendChild(refColumnHiddenInput);
        referenciaDiv.appendChild(refColumnCustomDropdown);
        mainDiv.appendChild(referenciaDiv);
        // Default input
        const defaultDiv = document.createElement("div");
        defaultDiv.classList.add("default-input-text", "post-characteristics");
        defaultDiv.style.display = "none";
        const defaultP = document.createElement("p");
        defaultP.textContent = "Default";
        defaultDiv.appendChild(defaultP);
        mainDiv.appendChild(defaultDiv);
        updateDefaultInput(mainDiv, column.defaultValue);
        // Type values input
        const typeDiv = document.createElement("div");
        typeDiv.classList.add("type-values", "post-characteristics");
        typeDiv.style.display = "none";
        const typeP = document.createElement("p");
        typeP.textContent = "Valores do enum (separados por vírgula)";
        typeDiv.appendChild(typeP);
        const typeInput = document.createElement("input");
        typeInput.type = "text";
        typeInput.placeholder = "Valores separados por vírgula";
        typeInput.classList.add("menu-central-input");
        typeInput.value = compareTypes(column.type, types.ENUM([])) ? column.type.getAllowedValues().join(", ")
            : compareTypes(column.type, types.VARCHAR(0)) ? column.type.getMaxLength().toString() : "";
        typeDiv.appendChild(typeInput);
        mainDiv.appendChild(typeDiv);
        menu.appendChild(mainDiv);
        updateCharacteristics(mainDiv);
        updateCustomDropdowns();
        updateTypeInput(mainDiv);
    });
    const criacaoColunasEdit = document.getElementById("criacao-colunas-edit");
    criacaoColunasEdit.innerHTML = "";
    createColumnCreationDiv(criacaoColunasEdit);
    updateCustomDropdowns();
}
/**
 * Recria o menu de inserção de linhas da tabela atual.
 */
function changeInsertRowMenu() {
    if (currentDatabase === null)
        return;
    const menuUl = document.querySelector("#colunas-inserir-linha");
    menuUl.innerHTML = "";
    if (currentTable === null) {
        menuUl.innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        return;
    }
    else if (Object.keys(getTable(currentTable).columns).length === 0) {
        menuUl.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }
    Object.values(getTable(currentTable).columns).forEach((column) => {
        const div = document.createElement("div");
        menuUl.appendChild(div);
        const h3 = document.createElement("h3");
        h3.textContent = column.name;
        div.appendChild(h3);
        const p = document.createElement("p");
        p.textContent = `(${column.type.name.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.isCurrentTimestamp ? " • CURRENT_TIMESTAMP" : ""})`;
        div.appendChild(p);
        if (column.isAutoIncrement) {
            const p = document.createElement("p");
            p.textContent = "Valor gerado automaticamente";
            div.appendChild(p);
        }
        else if (compareTypes(column.type, types.INTEGER) || compareTypes(column.type, types.FLOAT)) {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "number";
            input.step = "any";
            div.appendChild(input);
        }
        else if (compareTypes(column.type, types.BOOLEAN)) {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            const dropdownValue = column.hasDefault ? column.defaultValue : false;
            dropdown.innerHTML = `
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                ${dropdownValue}
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option custom-dropdown-option-selected">false</li>
                <li class="custom-dropdown-option">true</li>
            </ul>
            <input type="hidden" value="text">
            `;
            div.appendChild(dropdown);
            updateCustomDropdowns();
        }
        else if (compareTypes(column.type, types.DATE)) {
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            }
            else {
                const input = document.createElement("input");
                input.type = "date";
                input.classList.add("menu-central-input");
                div.appendChild(input);
            }
        }
        else if (compareTypes(column.type, types.TIME)) {
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            }
            else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "time";
                input.step = "1";
                div.appendChild(input);
            }
        }
        else if (compareTypes(column.type, types.ENUM([]))) {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            const button = document.createElement("button");
            button.className = "custom-dropdown-trigger";
            button.textContent = compareTypes(column.type, types.ENUM([])) ? column.type.getAllowedValues()[0] : "Selecione um valor";
            button.onclick = function () { openCustomDropdown(button); };
            dropdown.appendChild(button);
            const menu = document.createElement("ul");
            menu.className = "custom-dropdown-menu";
            column.type.getAllowedValues().forEach((value, index) => {
                const li = document.createElement("li");
                li.className = "custom-dropdown-option";
                if (index === 0)
                    li.classList.add("custom-dropdown-option-selected");
                li.textContent = value;
                menu.appendChild(li);
            });
            dropdown.appendChild(menu);
            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "enum-value";
            hiddenInput.value = column.type.getAllowedValues()[0];
            dropdown.appendChild(hiddenInput);
            div.appendChild(dropdown);
            updateCustomDropdowns();
        }
        else if (compareTypes(column.type, types.VARCHAR(0))) {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "text";
            input.maxLength = column.type.getMaxLength();
            div.appendChild(input);
        }
        else {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "text";
            div.appendChild(input);
        }
    });
}
/**
 * Recria o menu de edição de uma linha específica.
 * @param rowIndex - Índice da linha que será editada.
 */
function changeEditRowMenu(rowIndex) {
    if (currentDatabase === null)
        return;
    const menuUl = document.getElementById("colunas-editar-linha");
    menuUl.innerHTML = "";
    if (Object.keys(getTable(currentTable).columns).length === 0) {
        menuUl.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }
    const editButton = menuUl.parentElement.querySelector("button#editar-linha-button");
    editButton.onclick = function () { editRowInterface(rowIndex); };
    Object.values(getTable(currentTable).columns).forEach((column) => {
        const div = document.createElement("div");
        menuUl.appendChild(div);
        const h3 = document.createElement("h3");
        h3.textContent = column.name;
        div.appendChild(h3);
        const p = document.createElement("p");
        p.textContent = `(${column.type.name.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.isCurrentTimestamp ? " • CURRENT_TIMESTAMP" : ""})`;
        div.appendChild(p);
        if (column.isAutoIncrement) {
            const p = document.createElement("p");
            p.textContent = "Valor gerado automaticamente";
            div.appendChild(p);
        }
        else if (compareTypes(column.type, types.INTEGER) || compareTypes(column.type, types.FLOAT)) {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "number";
            input.step = "any";
            input.value = getTable(currentTable).rows[rowIndex].values[column.name];
            div.appendChild(input);
        }
        else if (compareTypes(column.type, types.BOOLEAN)) {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            dropdown.innerHTML = `
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                ${getTable(currentTable).rows[rowIndex].values[column.name] ? "frue" : "false"}
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option ${getTable(currentTable).rows[rowIndex].values[column.name] ? '' : 'custom-dropdown-option-selected'}">false</li>
                <li class="custom-dropdown-option ${getTable(currentTable).rows[rowIndex].values[column.name] ? 'custom-dropdown-option-selected' : ''}">true</li>
            </ul>
            <input type="hidden" value="text">
            `;
            div.appendChild(dropdown);
            updateCustomDropdowns();
        }
        else if (compareTypes(column.type, types.DATE)) {
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            }
            else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "date";
                const value = getTable(currentTable).rows[rowIndex].values[column.name];
                input.value = SQLDate.toString(value);
                div.appendChild(input);
            }
        }
        else if (compareTypes(column.type, types.TIME)) {
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            }
            else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "time";
                input.step = "1";
                const value = getTable(currentTable).rows[rowIndex].values[column.name];
                input.value = SQLTime.toString(value);
                div.appendChild(input);
            }
        }
        else if (compareTypes(column.type, types.ENUM([]))) {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            const currentValue = getTable(currentTable).rows[rowIndex].values[column.name];
            const enumValues = column.type.getAllowedValues() ?? [];
            const selectedValue = enumValues.includes(currentValue) ? currentValue : (enumValues[0] ?? "");
            const button = document.createElement("button");
            button.className = "custom-dropdown-trigger";
            button.textContent = selectedValue || "Selecione um valor";
            button.onclick = function () { openCustomDropdown(button); };
            dropdown.appendChild(button);
            const menu = document.createElement("ul");
            menu.className = "custom-dropdown-menu";
            enumValues.forEach((value) => {
                const li = document.createElement("li");
                li.className = "custom-dropdown-option";
                if (value === selectedValue) {
                    li.classList.add("custom-dropdown-option-selected");
                }
                li.textContent = value;
                menu.appendChild(li);
            });
            dropdown.appendChild(menu);
            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "enum-value";
            hiddenInput.value = selectedValue;
            dropdown.appendChild(hiddenInput);
            div.appendChild(dropdown);
            updateCustomDropdowns();
        }
        else {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            const value = getTable(currentTable).rows[rowIndex].values[column.name];
            input.value = value;
            div.appendChild(input);
        }
    });
}
/**
 * Recria o menu de pesquisa e suas opções de join.
 */
function changeSearchMenu() {
    const searchColumnsDiv = document.getElementById("colunas-pesquisa");
    searchColumnsDiv.innerHTML = "";
    const currentTableObj = getTable(currentTable);
    if (currentDatabase === null) {
        searchColumnsDiv.innerHTML = "<p>Selecione uma tabela para mostrar as colunas existentes</p>";
        return;
    }
    else if (currentTable === null) {
        searchColumnsDiv.innerHTML = "<p>Selecione uma tabela para mostrar as colunas existentes</p>";
        return;
    }
    else if (Object.keys(currentTableObj.columns).length === 0) {
        searchColumnsDiv.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }
    const label = document.createElement("label");
    label.classList.add("checkbox-div");
    label.innerHTML += `
    <input type="checkbox" name="search-column" value="todas-as-colunas" checked>
    Todas as colunas (*)
    `;
    searchColumnsDiv.appendChild(label);
    Object.values(getTable(currentTable).columns).forEach((column) => {
        const label = document.createElement("label");
        label.classList.add("checkbox-div");
        label.innerHTML += `
        <input type="checkbox" name="search-column" value="${column.name}">
        ${column.name} (${column.type.name.toUpperCase()})
        `;
        searchColumnsDiv.appendChild(label);
    });
}
/**
 * Prepara a confirmação de exclusão para database, tabela, coluna ou linha.
 * @param type - Tipo do item que será removido.
 * @param rowIndex - Índice da linha, quando aplicável.
 * @param columnName - Nome da coluna, quando aplicável.
 */
function changeConfirmDeleteMenu(type, rowIndex, columnName) {
    const menuUl = document.getElementById("confirmar-deletar-lista");
    menuUl.innerHTML = "";
    if (currentDatabase === null) {
        menuUl.innerHTML = "<p>Nenhuma database selecionada.</p>";
        return;
    }
    else if (currentSchema === null && (type === "schema" || type === "table" || type === "column" || type === "row")) {
        menuUl.innerHTML = "<p>Nenhum schema selecionado.</p>";
        return;
    }
    else if (currentTable === null && (type === "table" || type === "column" || type === "row")) {
        menuUl.innerHTML = "<p>Nenhuma tabela selecionada.</p>";
        return;
    }
    if (type === "database" || type === "schema" || type === "table" || type === "column" || type === "row") {
        menuUl.innerHTML += `
        <div class="outlined">
            <h4 class="text2">Database</h4>
            <div>
                <p class="text3">${currentDatabase}</p>
                <p class="text3">Schemas: ${Object.keys(getCurrentDatabase().schemas).length}</p>
            </div>
        </div>
        `;
    }
    if (type === "schema" || type === "table" || type === "column" || type === "row") {
        menuUl.innerHTML += `
        <div class="outlined">
            <h4 class="text2">Schema</h4>
            <div>
                <p class="text3">${currentSchema}</p>
                <p class="text3">Tabelas: ${Object.keys(getCurrentSchema().tables).length}</p>
            </div>
        </div>
        `;
    }
    if (type === "table" || type === "column" || type === "row") {
        menuUl.innerHTML += `
        <div class="outlined">
            <h4 class="text2">Tabela</h4>
            <div>
                <p class="text3">${currentTable}</p>
                <p class="text3">Colunas: ${Object.keys(getTable(currentTable).columns).length}</p>
            </div>
        </div>
        `;
    }
    if (type === "column") {
        if (!columnName)
            return;
        menuUl.innerHTML += `
        <div class="outlined">
            <h4 class="text2">Coluna</h4>
            <div>
                <p class="text3">${getTable(currentTable).columns[columnName].name}</p>
                <p class="text3">${getTable(currentTable).columns[columnName].type.name.toLocaleUpperCase()}</p>
            </div>
        </div>
        `;
    }
    if (type === "row") {
        const row = getTable(currentTable).rows[rowIndex];
        const formattedEntries = Object.entries(row.values).map(([key, value]) => {
            const column = getTable(currentTable).columns[key];
            let displayValue = value;
            if (column) {
                if (compareTypes(column.type, types.DATE)) {
                    displayValue = SQLDate.toString(value);
                }
                else if (compareTypes(column.type, types.TIME)) {
                    displayValue = SQLTime.toString(value);
                }
            }
            return `<p class="text3">${key}: ${displayValue}</p>`;
        }).join("");
        menuUl.innerHTML += `
        <div class="outlined">
            <h4 class="text2">Linha</h4>
            <div >
                ${formattedEntries}
            </div>
        </div>
        `;
    }
    const deleteButton = document.getElementById("confirmar-deletar-button");
    deleteButton.onclick = () => {
        if (type === "database") {
            SGBDFunctions.deleteDatabase(currentDatabase);
            openNotifications("<p style='color: var(--green5)'>Database deletada com sucesso!</p>");
        }
        else if (type === "schema") {
            SGBDFunctions.deleteSchema(currentSchema);
            openNotifications("<p style='color: var(--green5)'>Schema deletado com sucesso!</p>");
        }
        else if (type === "table") {
            SGBDFunctions.deleteTable(currentTable);
            openNotifications("<p style='color: var(--green5)'>Tabela deletada com sucesso!</p>");
        }
        else if (type === "column") {
            SGBDFunctions.deleteColumn(currentTable, columnName);
            openNotifications("<p style='color: var(--green5)'>Coluna deletada com sucesso!</p>");
        }
        else if (type === "row") {
            SGBDFunctions.deleteRow(currentTable, rowIndex);
            openNotifications("<p style='color: var(--green5)'>Linha deletada com sucesso!</p>");
        }
        document.getElementById("menus-centrais").style.display = "none";
        document.querySelectorAll("#menus-centrais > div").forEach((m) => {
            const menu = m;
            menu.style.display = "none";
        });
    };
}
/**
 * Atualiza a exibição e as restrições dos campos de características da coluna.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateCharacteristics(parentDiv) {
    // pegar inputs
    const pkInput = parentDiv.querySelector("input.primary-key");
    const fkInput = parentDiv.querySelector("input.foreign-key");
    const notNullInput = parentDiv.querySelector("input.not-null");
    const uniqueInput = parentDiv.querySelector("input.unique");
    const defaultInput = parentDiv.querySelector("input.default");
    const autoIncInput = parentDiv.querySelector("input.auto-increment");
    const currentTimestampInput = parentDiv.querySelector("input.auto-date");
    const typeDropdown = parentDiv.querySelector(".custom-dropdown button");
    const autoIncLabel = autoIncInput.parentElement;
    const currentTimestampLabel = currentTimestampInput.parentElement;
    const state = {
        pk: pkInput.checked,
        fk: fkInput.checked,
        notNull: notNullInput.checked,
        unique: uniqueInput.checked,
        default: defaultInput.checked,
        autoIncrement: autoIncInput.checked,
        currentTimestamp: currentTimestampInput.checked,
        type: typeDropdown.textContent.toUpperCase()
    };
    const forcedTrue = {
        notNull: state.pk || state.autoIncrement || state.currentTimestamp,
        unique: state.autoIncrement || state.pk,
    };
    const forcedFalse = {
        fk: state.autoIncrement || state.currentTimestamp || state.currentTimestamp,
        default: state.autoIncrement || state.currentTimestamp || state.currentTimestamp,
        autoIncrement: state.fk || state.default || state.type !== "INTEGER",
        currentTimestamp: state.fk || state.default || state.type !== "DATE" && state.type !== "TIME",
    };
    const hidden = {
        autoIncrement: state.type !== "INTEGER",
        currentTimestamp: state.type !== "DATE" && state.type !== "TIME",
    };
    const disabled = {
        notNull: state.pk || state.autoIncrement || state.currentTimestamp,
        unique: state.autoIncrement || state.pk,
        autoIncrement: state.fk || state.default || state.type !== "INTEGER",
        currentTimestamp: state.fk || state.default || state.type !== "DATE" && state.type !== "TIME",
        default: state.autoIncrement || state.currentTimestamp || state.currentTimestamp,
        fk: state.autoIncrement || state.currentTimestamp || state.currentTimestamp
    };
    // NOT NULL
    notNullInput.checked = state.notNull || forcedTrue.notNull;
    notNullInput.disabled = disabled.notNull;
    // UNIQUE
    uniqueInput.checked = state.unique || forcedTrue.unique;
    uniqueInput.disabled = disabled.unique;
    // AUTO INCREMENT
    autoIncLabel.style.display = hidden.autoIncrement ? "none" : "flex";
    autoIncInput.checked = state.autoIncrement && !forcedFalse.autoIncrement;
    autoIncInput.disabled = disabled.autoIncrement;
    // AUTO DATE
    currentTimestampLabel.style.display = hidden.currentTimestamp ? "none" : "flex";
    currentTimestampInput.checked = state.currentTimestamp && !forcedFalse.currentTimestamp;
    currentTimestampInput.disabled = disabled.currentTimestamp;
    // DEFAULT
    defaultInput.disabled = disabled.default;
    defaultInput.checked = state.default && !forcedFalse.default;
    const defaultDiv = parentDiv.querySelector("div.default-input-text");
    defaultDiv.style.display = state.default ? "block" : "none";
    // FK
    fkInput.disabled = disabled.fk;
    fkInput.checked = state.fk && !forcedFalse.fk;
    // REFERÊNCIA (FK)
    const referenciaDiv = parentDiv.querySelector("div.referencia");
    referenciaDiv.style.display = fkInput.checked ? "block" : "none";
    updateForeignKeyReferenceSchemaOptions(parentDiv);
    updateForeignKeyReferenceTableOptions(parentDiv);
    updateForeignKeyReferenceColumnOptions(parentDiv);
    // TYPE
    const typeDiv = parentDiv.querySelector("div.type-values");
    typeDiv.style.display = state.type === "ENUM" || state.type === "VARCHAR" ? "block" : "none";
}
/**
 * Troca o tipo do campo de valor padrão conforme o tipo da coluna.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateDefaultInput(parentDiv, initialValue) {
    const type = parentDiv.querySelector(".custom-dropdown button").textContent.toLowerCase();
    if (type == "boolean") {
        const defaultDiv = parentDiv.querySelector("div.default-input-text");
        const isTrue = valueExists(initialValue) && String(initialValue).toLowerCase() === "true";
        defaultDiv.innerHTML = `
        <p>Default</p>
        <div class="custom-dropdown">
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                ${isTrue ? "true" : "false"}
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option ${isTrue ? "" : "custom-dropdown-option-selected"}">false</li>
                <li class="custom-dropdown-option ${isTrue ? "custom-dropdown-option-selected" : ""}">true</li>
            </ul>
            <input type="hidden" value="text">
        </div>
        `;
        updateCustomDropdowns();
        return;
    }
    const defaultDiv = parentDiv.querySelector("div.default-input-text");
    if (type === "integer") {
        defaultDiv.innerHTML = `
        <p>Default</p>
        <input class="menu-central-input" type="number" placeholder="Valor padrão">
        `;
    }
    else if (type === "date") {
        defaultDiv.innerHTML = `
        <p>Default</p>
        <input class="menu-central-input" type="date" placeholder="Valor padrão">
        `;
    }
    else if (type === "time") {
        defaultDiv.innerHTML = `
        <p>Default</p>
        <input class="menu-central-input" type="time" placeholder="Valor padrão">
        `;
    }
    else {
        defaultDiv.innerHTML = `
        <p>Default</p>
        <input class="menu-central-input" type="text" placeholder="Valor padrão">
        `;
    }
    const input = defaultDiv.querySelector("input");
    if (input && valueExists(initialValue)) {
        input.value = String(initialValue);
    }
    if (type === "date" && valueExists(initialValue)) {
        const input = defaultDiv.querySelector("input");
        input.value = SQLDate.toString(initialValue);
    }
    if (type === "time" && valueExists(initialValue)) {
        const input = defaultDiv.querySelector("input");
        input.value = SQLTime.toString(initialValue);
    }
}
function updateTypeInput(parentDiv) {
    const type = parentDiv.querySelector(".custom-dropdown button").textContent.toLowerCase();
    const typeDiv = parentDiv.querySelector("div.type-values");
    if (type === "enum") {
        typeDiv.querySelector("p").textContent = "Valores do enum (separados por vírgula)";
        typeDiv.querySelector("input").placeholder = "Valores separados por vírgula";
    }
    else if (type === "varchar") {
        typeDiv.querySelector("p").textContent = "Tamanho máximo do varchar";
        typeDiv.querySelector("input").placeholder = "Tamanho máximo";
        typeDiv.querySelector("input").type = "number";
    }
}
/**
 * Atualiza os schemas disponíveis para referência de chave estrangeira.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateForeignKeyReferenceSchemaOptions(parentDiv) {
    const database = getCurrentDatabase();
    const availableTables = Object.keys(database.schemas);
    const tableSelect = parentDiv.querySelector(".referencia .custom-dropdown-menu");
    tableSelect.innerHTML = "";
    availableTables.forEach((tableName, i) => {
        tableSelect.innerHTML += `
            <li class="custom-dropdown-option ${i === 0 ? "custom-dropdown-option-selected" : ""}">${tableName}</li>
        `;
    });
    const refButton = parentDiv.querySelector(".referencia .custom-dropdown-trigger");
    if (availableTables.length === 0) {
        refButton.textContent = "Selecione uma tabela";
    }
    else {
        refButton.textContent = availableTables[0];
    }
    updateCustomDropdowns();
}
/**
 * Atualiza as tabelas disponíveis para referência de chave estrangeira.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateForeignKeyReferenceTableOptions(parentDiv) {
    const database = getCurrentDatabase();
    const tableSelect = parentDiv.querySelector(".referencia :nth-child(3) .custom-dropdown-menu");
    const refSchemaButton = parentDiv.querySelector(".referencia :nth-child(2) .custom-dropdown-trigger");
    const refButton = parentDiv.querySelector(".referencia :nth-child(3) .custom-dropdown-trigger");
    tableSelect.innerHTML = "";
    const referencedSchema = database.schemas[refSchemaButton.textContent];
    if (!referencedSchema) {
        refButton.textContent = "Selecione um schema";
        updateCustomDropdowns();
        return;
    }
    let i = 0;
    for (let tableName in referencedSchema.tables) {
        tableSelect.innerHTML += `
            <li class="custom-dropdown-option ${i === 0 ? "custom-dropdown-option-selected" : ""}">${tableName}</li>
        `;
        i++;
    }
    if (Object.keys(referencedSchema.tables).length === 0) {
        refButton.textContent = "Selecione uma tabela";
    }
    else {
        refButton.textContent = Object.keys(referencedSchema.tables)[0];
    }
    updateCustomDropdowns();
}
/**
 * Atualiza as colunas disponíveis na tabela de referência selecionada.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateForeignKeyReferenceColumnOptions(parentDiv) {
    const schema = getCurrentSchema();
    const columnSelect = parentDiv.querySelector(".referencia :nth-child(4) .custom-dropdown-menu");
    const refTableButton = parentDiv.querySelector(".referencia :nth-child(3) .custom-dropdown-trigger");
    const refButton = parentDiv.querySelector(".referencia :nth-child(4) .custom-dropdown-trigger");
    columnSelect.innerHTML = "";
    const referencedTable = schema.tables[refTableButton.textContent];
    if (!referencedTable) {
        refButton.textContent = "Selecione uma coluna";
        updateCustomDropdowns();
        return;
    }
    let i = 0;
    for (let columnName in referencedTable.columns) {
        if (referencedTable.columns[columnName].isPrimaryKey || referencedTable.columns[columnName].isUnique) {
            columnSelect.innerHTML += `
                <li class="custom-dropdown-option ${i === 0 ? "custom-dropdown-option-selected" : ""}">${columnName}</li>
            `;
        }
        i++;
    }
    if (Object.keys(referencedTable.columns).length === 0) {
        refButton.textContent = "Selecione uma coluna";
    }
    else {
        refButton.textContent = Object.keys(referencedTable.columns)[0];
    }
    updateCustomDropdowns();
}
//#endregion
// #region Terminal
/**
 * Retorna a sessão de terminal atualmente ativa.
 * @returns Sessão selecionada.
 */
function getCurrentTerminalSession() {
    return terminalSessions[currentTerminalSession];
}
const commandTextarea = document.querySelector("#terminal-input-field");
/**
 * Executa o comando digitado no terminal SQL.
 */
function executeCommand() {
    const command = commandTextarea.value.trim();
    SQL.execute(command);
}
/**
 * Cria uma nova aba de terminal e a torna ativa.
 */
function createTerminalSession() {
    const terminalSession = new TerminalSession(`Terminal ${TerminalSession.sessionCount}`);
    terminalSessions.push(terminalSession);
    currentTerminalSession = terminalSessions.length - 1;
    const terminalSessionsContainer = document.getElementById("terminal-sessions");
    terminalSessionsContainer.querySelector(".terminal-session-active")?.classList.remove("terminal-session-active");
    const sessionDiv = document.createElement("div");
    sessionDiv.classList.add("terminal-session", "terminal-session-active");
    terminalSessionsContainer.appendChild(sessionDiv);
    const p = document.createElement("p");
    p.textContent = terminalSession.name;
    sessionDiv.appendChild(p);
    const closeButton = document.createElement("button");
    closeButton.innerHTML = `
    <svg viewBox="0 -960 960 960" fill="currentcolor">
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
    </svg>`;
    closeButton.onclick = function () {
        if (terminalSessions.length === 1)
            return; // não permite fechar a última sessão
        terminalSessionsContainer.removeChild(sessionDiv);
        currentTerminalSession = 0;
    };
    sessionDiv.appendChild(closeButton);
}
// #endregion
// #region SQL namespace
/**
 * Processa comandos SQL digitados no terminal.
 */
var SQL;
(function (SQL) {
    /**
     * Executa o comando SQL completo após tokenização.
     * @param fullCommand - Texto original digitado.
     */
    function execute(fullCommand) {
        const commands = fullCommand.split(";").map(command => command.trim()).filter(command => command.length > 0);
        for (const commandText of commands) {
            const tokens = tokenizeSQL(commandText);
            if (tokens.length === 0)
                return;
            const command = tokens[0]?.toLowerCase();
            switch (command) {
                case "alter":
                    new SQLAlter(commandText, tokens).execute();
                    break;
                case "create":
                    new SQLCreate(commandText, tokens).execute();
                    break;
                case "delete":
                    break;
                case "drop":
                    break;
                case "insert":
                    new SQLInsert(commandText, tokens).insert();
                    break;
                case "select":
                    break;
                case "update":
                    break;
                case "use":
                    new SystemCommands(commandText, tokens).use();
                    break;
                default:
                    getCurrentTerminalSession().createEntry(commandText, ["Comando não reconhecido"], "error");
            }
        }
    }
    SQL.execute = execute;
    class SQLAlter {
        fullCommand;
        tokens;
        constructor(fullCommand, tokens) {
            this.fullCommand = fullCommand;
            this.tokens = tokens;
        }
        execute() {
            if (this.tokens.length < 6) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            const target = this.tokens[1]?.toLowerCase();
            switch (target) {
                case "database":
                    this.database();
                    break;
                case "table":
                    this.table();
                    break;
                default:
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER incorreto"], "error");
            }
        }
        database() {
            if (this.tokens.length < 6 || this.tokens.length > 6) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER DATABASE incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            if (!isValidSQLName(this.tokens[5])) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da database inválido"], "error");
                return;
            }
            if (databases[this.tokens[5]]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma database com o nome "${this.tokens[5]}"`], "error");
                return;
            }
            if (databases[this.tokens[2]] === undefined) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Database "${this.tokens[2]}" não existe`], "error");
                return;
            }
            if (this.tokens[3]?.toLowerCase() !== "rename" || this.tokens[4]?.toLowerCase() !== "to") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER DATABASE incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            SGBDFunctions.renameDatabase(this.tokens[2], this.tokens[5]);
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Database "${this.tokens[2]}" renomeada para "${this.tokens[5]}" com sucesso!`], "success");
        }
        schema() {
            if (currentDatabase === null) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nenhuma database selecionada"], "error");
                return;
            }
            if (this.tokens.length < 6 || this.tokens.length > 6) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER SCHEMA incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            if (!isValidSQLName(this.tokens[5])) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome do schema inválido"], "error");
                return;
            }
            if (getCurrentDatabase()?.schemas[this.tokens[5]]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe um schema com o nome "${this.tokens[5]}"`], "error");
                return;
            }
            if (getCurrentDatabase()?.schemas[this.tokens[2]] === undefined) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Schema "${this.tokens[2]}" não existe`], "error");
                return;
            }
            if (this.tokens[3]?.toLowerCase() !== "rename" || this.tokens[4]?.toLowerCase() !== "to") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER SCHEMA incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            SGBDFunctions.renameSchema(this.tokens[2], this.tokens[5]);
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Schema "${this.tokens[2]}" renomeado para "${this.tokens[5]}" com sucesso!`], "success");
        }
        table() {
            const name = this.tokens[2];
            const { schemaName, tableName, error } = verifySchemaTableName(name);
            if (error) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [error], "error");
            }
            if (!schemaName || !tableName)
                return;
            const action = this.tokens[3]?.toLowerCase();
            switch (action) {
                case "rename":
                    this.rename();
                    break;
                case "set":
                    this.setSchema();
                    break;
                case "add":
                    this.addColumn();
                    break;
                case "drop":
                    this.dropColumn();
                    break;
                case "alter":
                    this.alterColumn();
                    break;
                default:
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Ação não reconhecida"], "error");
            }
        }
        rename() {
            const word5 = this.tokens[4]?.toLowerCase();
            const name = this.tokens[2];
            const { schemaName, tableName, error } = verifySchemaTableName(name);
            if (error) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [error], "error");
                return;
            }
            if (!schemaName || !tableName)
                return;
            if (word5 === "to") {
                if (this.tokens.length !== 6) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                    return;
                }
                const newName = this.tokens[5];
                if (!isValidSQLName(newName)) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da tabela inválido"], "error");
                    return;
                }
                if (getCurrentSchema().tables[newName]) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma tabela com o nome "${newName}" nesse schema`], "error");
                    return;
                }
                SGBDFunctions.renameTable(tableName, newName, schemaName);
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Tabela "${tableName}" renomeado para "${newName}" com sucesso!`], "success");
            }
            else if (word5 === "column") {
                if (this.tokens.length !== 8) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                    return;
                }
                const columnName = this.tokens[5];
                if (getTable(tableName, schemaName).columns[columnName] === undefined) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, [`Coluna "${columnName}" não existe na tabela "${this.tokens[2]}"`], "error");
                    return;
                }
                if (this.tokens[6]?.toLowerCase() !== "to") {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                    return;
                }
                const newName = this.tokens[7];
                if (!isValidSQLName(newName)) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da coluna inválido"], "error");
                    return;
                }
                if (getTable(this.tokens[2]).columns[newName] !== undefined) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma coluna com o nome "${newName}" na tabela "${this.tokens[2]}"`], "error");
                    return;
                }
                const newColumn = getTable(this.tokens[2]).columns[columnName].clone();
                newColumn.name = newName;
                SGBDFunctions.alterColumn(tableName, columnName, newColumn, schemaName);
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Coluna "${columnName}" renomeado para "${newName}" com sucesso!`], "success");
            }
            else {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
            }
        }
        setSchema() {
            const name = this.tokens[2];
            const { schemaName, tableName, error } = verifySchemaTableName(name);
            if (error) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [error], "error");
                return;
            }
            if (!schemaName || !tableName)
                return;
            const word5 = this.tokens[4]?.toLowerCase();
            if (word5 !== "schema") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "SET deve ser seguido de SCHEMA"], "error");
                return;
            }
            if (this.tokens.length !== 6) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            const newSchemaName = this.tokens[5];
            if (!getCurrentDatabase().schemas[newSchemaName]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Schema "${newSchemaName}" não existe`], "error");
                return;
            }
            if (getCurrentDatabase().schemas[newSchemaName].tables[tableName]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma tabela com o nome "${tableName}" no schema "${newSchemaName}"`], "error");
                return;
            }
            const table = getTable(tableName, schemaName);
            table.parent = getCurrentDatabase().schemas[newSchemaName];
            SGBDFunctions.deleteTable(tableName, schemaName);
            SGBDFunctions.createTable(table, newSchemaName);
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Tabela "${tableName}" movida para o schema "${newSchemaName}" com sucesso!`], "success");
            refreshUI();
        }
        addColumn() {
            const name = this.tokens[2];
            const { schemaName, tableName, error } = verifySchemaTableName(name);
            if (error) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [error], "error");
                return;
            }
            if (!schemaName || !tableName)
                return;
            const word5 = this.tokens[4]?.toLowerCase();
            if (word5 !== "column") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "ADD deve ser seguido de COLUMN"], "error");
                return;
            }
            if (this.tokens.length < 7) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            const result = parseColumn(this.tokens.slice(5));
            if (result.error) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE TABLE incorreto", result.error], "error");
                return;
            }
            if (!result.column)
                return;
            if (getTable(tableName, schemaName).columns[result.column.name]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma coluna com o nome "${result.column.name}" na tabela "${tableName}"`], "error");
                return;
            }
            SGBDFunctions.addColumn(tableName, result.column, schemaName);
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Coluna "${result.column.name}" adicionada com sucesso`], "success");
        }
        dropColumn() {
            const name = this.tokens[2];
            const { schemaName, tableName, error } = verifySchemaTableName(name);
            if (error) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [error], "error");
                return;
            }
            if (!schemaName || !tableName)
                return;
            const word5 = this.tokens[4]?.toLowerCase();
            if (word5 !== "column") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "ADD deve ser seguido de COLUMN"], "error");
                return;
            }
            if (this.tokens.length < 6) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            const columnName = this.tokens[5];
            if (!getTable(tableName, schemaName).columns[columnName]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Coluna "${columnName}" não existe na tabela "${tableName}"`], "error");
                return;
            }
            SGBDFunctions.deleteColumn(tableName, columnName, schemaName);
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Coluna "${columnName}" removida com sucesso`], "success");
        }
        alterColumn() {
            const name = this.tokens[2];
            const { schemaName, tableName, error } = verifySchemaTableName(name);
            if (error) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [error], "error");
                return;
            }
            if (!schemaName || !tableName)
                return;
            const word5 = this.tokens[4]?.toLowerCase();
            if (word5 !== "column") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "ADD deve ser seguido de COLUMN"], "error");
                return;
            }
            if (this.tokens.length < 6) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            const columnName = this.tokens[5];
            if (!getTable(tableName, schemaName).columns[columnName]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Coluna "${columnName}" não existe na tabela "${tableName}"`], "error");
                return;
            }
            const word7 = this.tokens[6]?.toLowerCase();
            const column = getTable(tableName, schemaName).columns[columnName];
            const newColumn = column.clone();
            if (this.tokens.length < 8) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            if (word7 === "type") {
                const rawColumnType = this.tokens[7].toLowerCase();
                let columnType;
                if (rawColumnType === "int") {
                    columnType = types.INTEGER;
                }
                else {
                    columnType = DataTypes.createDataTypeFromString(rawColumnType.toUpperCase());
                }
                if (!valueExists(columnType)) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", `Tipo de coluna inválido: "${this.tokens[7]}"`], "error");
                    return;
                }
                newColumn.type = columnType;
                if (compareTypes(columnType, types.ENUM([]))) {
                    const enumStartIndex = this.tokens.findIndex(token => token === "(");
                    if (enumStartIndex === -1) {
                        return { column: null, error: "ENUM inválido: falta parêntese de abertura" };
                    }
                    const enumEndIndex = this.tokens.findIndex(token => token === ")");
                    if (enumEndIndex === -1) {
                        return { column: null, error: "ENUM inválido: falta parêntese de fechamento" };
                    }
                    const enumValues = this.tokens.slice(enumStartIndex + 1, enumEndIndex);
                    if (enumValues.length === 0) {
                        return { column: null, error: "ENUM deve possuir pelo menos um valor" };
                    }
                    for (let i = 0; i < enumValues.length; i++) {
                        const token = enumValues[i];
                        if (i % 2 === 0) {
                            if (token === ",") {
                                return { column: null, error: "Valor ENUM inválido" };
                            }
                            if (!token.startsWith('"') || !token.endsWith('"')) {
                                return { column: null, error: "Valores ENUM devem estar entre aspas" };
                            }
                        }
                        else {
                            if (token !== ",") {
                                return { column: null, error: "Valores ENUM devem ser separados por vírgula" };
                            }
                        }
                    }
                    column.type.setAllowedValues(enumValues.filter(token => token !== ",").map(token => {
                        if (token.startsWith('"') && token.endsWith('"')) {
                            return token.slice(1, -1);
                        }
                        return token;
                    }));
                }
                else if (compareTypes(columnType, types.VARCHAR(0))) {
                    const varcharStartIndex = this.tokens.findIndex(token => token === "(");
                    if (varcharStartIndex === -1) {
                        return { column: null, error: "VARCHAR inválido: falta parêntese de abertura" };
                    }
                    const varcharEndIndex = this.tokens.findIndex(token => token === ")");
                    if (varcharEndIndex === -1) {
                        return { column: null, error: "VARCHAR inválido: falta parêntese de fechamento" };
                    }
                    const varcharValues = this.tokens.slice(varcharStartIndex + 1, varcharEndIndex);
                    if (varcharValues.length === 0) {
                        return { column: null, error: "VARCHAR deve possuir um valor máximo" };
                    }
                    if (varcharValues.length !== 1) {
                        return { column: null, error: "VARCHAR deve possuir apenas um valor máximo" };
                    }
                    const varcharValue = varcharValues[0];
                    if (!/^\d+$/.test(varcharValue)) {
                        return { column: null, error: "Valor máximo de VARCHAR deve ser um número" };
                    }
                    const varcharMaxLength = parseInt(varcharValue);
                    if (isNaN(varcharMaxLength) || varcharMaxLength <= 0) {
                        return { column: null, error: "Valor máximo de VARCHAR inválido" };
                    }
                    column.type.setMaxLength(varcharMaxLength);
                }
                if (this.tokens.length > 8 && !compareTypes(columnType, types.ENUM([])) && !compareTypes(columnType, types.VARCHAR(0))) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                    return;
                }
                else if (this.tokens.length > 10 && (compareTypes(columnType, types.ENUM([])) || compareTypes(columnType, types.VARCHAR(0)))) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                    return;
                }
                for (let row of getCurrentSchema().tables[tableName].rows) {
                    if (!columnType.validate(row.values[columnName])) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, [`Não é possível alterar o tipo da coluna "${columnName}" para "${columnType.name}" porque existem valores incompatíveis na tabela`], "error");
                        return;
                    }
                }
                SGBDFunctions.alterColumn(tableName, columnName, newColumn, schemaName);
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Coluna "${columnName}" alterada com sucesso`], "success");
            }
            else if (word7 === "set") {
                let words = this.tokens.slice(7).map(token => token.toLowerCase());
                if (words.length < 1) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                    return;
                }
                const primaryValidation = validateCompoundKeyword("primary", "key", "PRIMARY KEY", words);
                if (typeof primaryValidation === "string") {
                    return { column: null, error: primaryValidation };
                }
                newColumn.isPrimaryKey = primaryValidation === 1;
                const foreignValidation = validateCompoundKeyword("foreign", "key", "FOREIGN KEY", words);
                if (typeof foreignValidation === "string") {
                    return { column: null, error: foreignValidation };
                }
                newColumn.isForeignKey = foreignValidation === 1;
                const notNullValidation = validateCompoundKeyword("not", "null", "NOT NULL", words);
                if (typeof notNullValidation === "string") {
                    return { column: null, error: notNullValidation };
                }
                newColumn.isNotNull = notNullValidation === 1;
                const uniqueValidation = validateSingleKeyword("unique", "UNIQUE", words);
                if (typeof uniqueValidation === "string") {
                    return { column: null, error: uniqueValidation };
                }
                newColumn.isUnique = uniqueValidation === 1;
                const autoIncrementValidation = validateSingleKeyword("auto_increment", "AUTO_INCREMENT", words);
                if (typeof autoIncrementValidation === "string") {
                    return { column: null, error: autoIncrementValidation };
                }
                newColumn.isAutoIncrement = autoIncrementValidation === 1;
                const defaultValidation = validateSingleKeyword("default", "DEFAULT", words);
                if (typeof defaultValidation === "string") {
                    return { column: null, error: defaultValidation };
                }
                newColumn.hasDefault = defaultValidation === 1;
                const currentTimestampValidation = validateSingleKeyword("current_timestamp", "CURRENT_TIMESTAMP", words);
                if (typeof currentTimestampValidation === "string") {
                    return { column: null, error: currentTimestampValidation };
                }
                newColumn.isCurrentTimestamp = currentTimestampValidation === 1;
                if (newColumn.hasDefault) {
                    const defaultIndex = words.findIndex(token => token.toLowerCase() === "default");
                    if (defaultIndex === -1 || defaultIndex === words.length - 1) {
                        return { column: null, error: "DEFAULT deve ser seguido de um valor" };
                    }
                    const defaultValue = words[defaultIndex + 1];
                    if (compareTypes(column.type, types.TEXT) || compareTypes(column.type, types.DATE) || compareTypes(column.type, types.TIME)) {
                        if (!(defaultValue.startsWith("'") && defaultValue.endsWith("'") || defaultValue.startsWith('"') && defaultValue.endsWith('"'))) {
                            return { column: null, error: "Tipo deve começar e acabar com \" ou \'" };
                        }
                    }
                    const parsedDefaultValue = column.type.parse(defaultValue);
                    if (!valueExists(parsedDefaultValue) || isNaN(parsedDefaultValue)) {
                        return { column: null, error: `Valor DEFAULT inválido para ${column.type.name}` };
                    }
                    column.defaultValue = parsedDefaultValue;
                }
                const hasReferences = words.some(token => token.toLowerCase() === "references");
                if (hasReferences && !column.isForeignKey) {
                    return { column: null, error: "REFERENCES só pode ser usado com FOREIGN KEY" };
                }
                if (column.isForeignKey) {
                    const referencesCount = words.filter(token => token.toLowerCase() === "references").length;
                    if (referencesCount > 1) {
                        return { column: null, error: "Apenas um REFERENCES é permitido" };
                    }
                    const referencesIndex = words.findIndex(token => token.toLowerCase() === "references");
                    if (referencesIndex <= 0 || words[referencesIndex - 1].toLowerCase() !== "key") {
                        return { column: null, error: "FOREIGN KEY deve ser seguido de REFERENCES" };
                    }
                    if (referencesIndex + 4 >= words.length || words[referencesIndex + 2] !== "(" ||
                        words[referencesIndex + 4] !== ")") {
                        return { column: null, error: "REFERENCES inválido" };
                    }
                    const name = words[referencesIndex + 1];
                    const { schemaName, tableName, error } = verifySchemaTableName(name);
                    if (error) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, [error], "error");
                    }
                    if (!schemaName || !tableName)
                        return;
                    const refTable = getCurrentDatabase().schemas[schemaName].tables[tableName];
                    if (refTable === null) {
                        return { column: null, error: `Tabela de referência "${tableName}" não existe no schema "${schemaName}"` };
                    }
                    const refColumn = refTable.columns[words[referencesIndex + 3]];
                    if (refColumn === undefined) {
                        return { column: null, error: `Coluna de referência "${words[referencesIndex + 3]}" não existe na tabela "${words[referencesIndex + 1]}"` };
                    }
                    if (refColumn.type !== column.type) {
                        return { column: null, error: `Tipo da coluna de referência "${words[referencesIndex + 3]}" na tabela "${words[referencesIndex + 1]}" não corresponde ao tipo da coluna atual` };
                    }
                    if (!refColumn.isUnique && !refColumn.isPrimaryKey) {
                        return { column: null, error: `Coluna de referência "${words[referencesIndex + 3]}" na tabela "${words[referencesIndex + 1]}" não é UNIQUE` };
                    }
                    column.reference = {
                        schema: schemaName,
                        table: tableName,
                        column: refColumn.name
                    };
                }
                // Verificação da integridade com outras características da coluna
                // PRIMARY KEY implica NOT NULL
                if (column.isPrimaryKey) {
                    column.isNotNull = true;
                    column.isUnique = true;
                }
                // AUTO_INCREMENT
                if (column.isAutoIncrement) {
                    if (!compareTypes(column.type, types.INTEGER)) {
                        return { column: null, error: "AUTO_INCREMENT só pode ser usado em colunas INTEGER" };
                    }
                    if (column.isForeignKey) {
                        return { column: null, error: "AUTO_INCREMENT não pode ser usado com FOREIGN KEY" };
                    }
                    if (column.hasDefault) {
                        return { column: null, error: "AUTO_INCREMENT não pode ser usado com DEFAULT" };
                    }
                    if (column.isCurrentTimestamp) {
                        return { column: null, error: "AUTO_INCREMENT não pode ser usado com CURRENT_TIMESTAMP" };
                    }
                    column.isNotNull = true;
                }
                // CURRENT_TIMESTAMP
                if (column.isCurrentTimestamp) {
                    if (!compareTypes(column.type, types.DATE) && !compareTypes(column.type, types.TIME)) {
                        return { column: null, error: "CURRENT_TIMESTAMP só pode ser usado em colunas DATE ou TIME" };
                    }
                    if (column.isForeignKey) {
                        return { column: null, error: "CURRENT_TIMESTAMP não pode ser usado com FOREIGN KEY" };
                    }
                    if (column.hasDefault) {
                        return { column: null, error: "CURRENT_TIMESTAMP não pode ser usado com DEFAULT" };
                    }
                }
                // FOREIGN KEY
                if (column.isForeignKey) {
                    if (column.isAutoIncrement) {
                        return { column: null, error: "FOREIGN KEY não pode ser usado com AUTO_INCREMENT" };
                    }
                    if (column.isCurrentTimestamp) {
                        return { column: null, error: "FOREIGN KEY não pode ser usado com CURRENT_TIMESTAMP" };
                    }
                }
            }
            else if (word7 === "drop") {
            }
            else {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Ação não reconhecida"], "error");
            }
        }
    }
    SQL.SQLAlter = SQLAlter;
    /**
     * Implementa o comando SQL CREATE.
     */
    class SQLCreate {
        fullCommand;
        tokens;
        constructor(fullCommand, tokens) {
            this.fullCommand = fullCommand;
            this.tokens = tokens;
        }
        /**
         * Direciona o comando CREATE para database ou table.
         */
        execute() {
            const target = this.tokens[1]?.toLowerCase();
            switch (target) {
                case "database":
                    this.database();
                    break;
                case "schema":
                    this.schema();
                    break;
                case "table":
                    this.table();
                    break;
                default:
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE incorreto"], "error");
            }
        }
        /**
         * Executa CREATE DATABASE.
         */
        database() {
            if (this.tokens.length < 3) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE DATABASE incorreto", "Nome da database é obrigatório"], "error");
                return;
            }
            if (this.tokens.length > 3) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE DATABASE incorreto", "Nome da database deve ser uma única palavra"], "error");
                return;
            }
            if (databases[this.tokens[2]]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma database com o nome "${this.tokens[2]}"`], "error");
                return;
            }
            if (!isValidSQLName(this.tokens[2])) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da database inválido"], "error");
                return;
            }
            if (databases[this.tokens[2]]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma database com o nome "${this.tokens[2]}"`], "error");
                return;
            }
            const databaseName = this.tokens[2];
            SGBDFunctions.createDatabase(new DB.Database(databaseName));
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Database "${databaseName}" criada com sucesso!`], "success");
        }
        /**
         * Executa CREATE SCHEMA.
         */
        schema() {
            if (currentDatabase === null) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nenhuma database selecionada"], "error");
                return;
            }
            if (this.tokens.length < 3) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE SCHEMA incorreto", "Nome do SCHEMA é obrigatório"], "error");
                return;
            }
            if (this.tokens.length > 3) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE SCHEMA incorreto", "Nome do SCHEMA deve ser uma única palavra"], "error");
                return;
            }
            if (databases[currentDatabase].schemas[this.tokens[2]]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe um schema com o nome "${this.tokens[2]}"`], "error");
                return;
            }
            if (!isValidSQLName(this.tokens[2])) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome do SCHEMA inválido"], "error");
                return;
            }
            const schemaName = this.tokens[2];
            SGBDFunctions.createSchema(new DB.Schema(schemaName, getCurrentDatabase()));
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Schema "${schemaName}" criado com sucesso!`], "success");
        }
        /**
         * Executa CREATE TABLE.
         */
        table() {
            const tableName = this.tokens[2];
            if (currentDatabase == null) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nenhuma database selecionada"], "error");
                return;
            }
            if (currentSchema == null) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nenhum schema selecionado"], "error");
                return;
            }
            if (tableName.includes(".")) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da tabela inválido"], "error");
                return;
            }
            if (!isValidSQLName(tableName)) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da tabela inválido"], "error");
                return;
            }
            if (this.tokens[3] !== "(" || this.tokens[this.tokens.length - 1] !== ")") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE TABLE incorreto", "Sintaxe inválida para a definição da tabela"], "error");
                return;
            }
            if (keyWords.includes(tableName.toLowerCase())) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da tabela é uma palavra-chave reservada"], "error");
                return;
            }
            let table = new DB.Table(tableName, getCurrentSchema());
            const columnDefs = splitColumnDefinitions(this.tokens.slice(4, -1));
            for (const columnDef of columnDefs) {
                const { column, error } = parseColumn(columnDef);
                if (error) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE TABLE incorreto", error], "error");
                    return;
                }
                table.columns[column.name] = column;
            }
            SGBDFunctions.createTable(table);
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Tabela "${tableName}" criada com sucesso!`], "success");
        }
    }
    SQL.SQLCreate = SQLCreate;
    class SQLInsert {
        fullCommand;
        tokens;
        constructor(fullCommand, tokens) {
            this.fullCommand = fullCommand;
            this.tokens = tokens;
        }
        insert() {
            const t = this.tokens;
            if (t.length < 7 || t[1]?.toLowerCase() !== "into") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Sintaxe inválida"], "error");
                return;
            }
            const name = this.tokens[2];
            const { schemaName, tableName, error } = verifySchemaTableName(name);
            if (error) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [error], "error");
            }
            if (!schemaName || !tableName)
                return;
            const table = getCurrentDatabase().schemas[schemaName].tables[tableName];
            let columnsToBeInserted = [];
            if (t[3] === "(") {
                const endValuesIndex = t.findIndex(token => token === ")");
                if (endValuesIndex === -1) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Sintaxe inválida: falta parêntese de fechamento para lista de colunas"], "error");
                    return;
                }
                const columnValues = t.slice(3 + 1, endValuesIndex);
                if (columnValues.length === 0) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Valores inválidos: nenhum valor fornecido"], "error");
                    return;
                }
                for (let i = 0; i < columnValues.length; i++) {
                    const token = columnValues[i];
                    if (i % 2 === 0 && token === ",") {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Valor inválido"], "error");
                        return;
                    }
                    else if (i % 2 === 1 && token !== ",") {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Valores devem ser separados por vírgula"], "error");
                        return;
                    }
                }
                columnsToBeInserted = columnValues.filter(token => token !== ",");
                if (columnsToBeInserted.length === 0) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Nenhuma coluna fornecida para inserção"], "error");
                    return;
                }
                if (columnsToBeInserted.some(columnName => !table.columns[columnName])) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Coluna(s) inválida(s)"], "error");
                    return;
                }
                if (columnsToBeInserted.length !== new Set(columnsToBeInserted).size) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Coluna(s) duplicada(s)"], "error");
                    return;
                }
                if (t[endValuesIndex + 1]?.toLowerCase() !== "values") {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Sintaxe inválida: valores devem ser especificados após a lista de colunas"], "error");
                    return;
                }
                this.getRowValuesAndInsert(endValuesIndex + 2, schemaName, tableName, columnsToBeInserted);
                return;
            }
            for (const column in table.columns) {
                columnsToBeInserted.push(column);
            }
            if (columnsToBeInserted.length === 0) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Nenhuma coluna fornecida para inserção"], "error");
                return;
            }
            if (t[3]?.toLowerCase() !== "values") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Sintaxe inválida: valores devem ser especificados após a lista de colunas"], "error");
                return;
            }
            this.getRowValuesAndInsert(4, schemaName, tableName, columnsToBeInserted);
        }
        getRowValuesAndInsert(startIndex, schemaName, tableName, columnsToBeInserted) {
            const t = this.tokens;
            const table = getCurrentDatabase().schemas[schemaName].tables[tableName];
            let depth = 0;
            let columnIndex = 0;
            const rowsToBeInserted = [];
            let row = null;
            let value = "";
            for (let i = startIndex; i < t.length; i++) {
                const token = t[i];
                if (token === "(") {
                    depth++;
                    if (depth === 1) {
                        row = new DB.Row(getCurrentTable(), {});
                        columnIndex = 0;
                        value = "";
                    }
                    continue;
                }
                if (token === ")") {
                    if (depth !== 1) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Sintaxe inválida"], "error");
                        return;
                    }
                    row.values[columnsToBeInserted[columnIndex]] = value;
                    depth--;
                    if (columnIndex + 1 !== columnsToBeInserted.length) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Quantidade de valores diferente da quantidade de colunas"], "error");
                        return;
                    }
                    rowsToBeInserted.push(row);
                    row = null;
                    columnIndex = 0;
                    value = "";
                    continue;
                }
                if (token === "," && depth === 1) {
                    row.values[columnsToBeInserted[columnIndex]] = value;
                    value = "";
                    columnIndex++;
                    if (columnIndex >= columnsToBeInserted.length) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Valores em excesso"], "error");
                        return;
                    }
                    continue;
                }
                if (token === "," && depth === 0) {
                    continue;
                }
                value += token;
            }
            if (depth !== 0) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Sintaxe inválida: parênteses desbalanceados"], "error");
                return;
            }
            if (row !== null) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Sintaxe inválida"], "error");
                return;
            }
            if (rowsToBeInserted.length === 0) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Nenhuma linha fornecida"], "error");
                return;
            }
            const validatedRows = this.validateRowsTypes(rowsToBeInserted, table);
            if (typeof validatedRows === "string") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", validatedRows], "error");
                return;
            }
            let valuesBeforeIncrement = [];
            for (let i = 0; i < validatedRows.length; i++) {
                for (const columnName in table.columns) {
                    let col = table.columns[columnName];
                    if (!columnsToBeInserted.includes(columnName)) {
                        if (col.isNotNull) {
                            if (col.defaultValue !== undefined) {
                                validatedRows[i].values[columnName] = col.defaultValue;
                                continue;
                            }
                            else if (col.isAutoIncrement) {
                                valuesBeforeIncrement.push({ column: columnName, value: col.incrementCounter });
                                validatedRows[i].values[columnName] = col.increment();
                                continue;
                            }
                            else {
                                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é NOT NULL e não foi fornecido valor ou valor padrão`], "error");
                                table.revertAutoIncrementValues(valuesBeforeIncrement);
                                return;
                            }
                        }
                        if (col.isAutoIncrement) {
                            valuesBeforeIncrement.push({ column: columnName, value: col.incrementCounter });
                            validatedRows[i].values[columnName] = col.increment();
                            continue;
                        }
                        if (col.isCurrentTimestamp) {
                            if (compareTypes(col.type, types.DATE))
                                validatedRows[i].values[columnName] = SQLDate.now();
                            if (compareTypes(col.type, types.TIME))
                                validatedRows[i].values[columnName] = SQLTime.now();
                            continue;
                        }
                        if (col.defaultValue !== undefined) {
                            validatedRows[i].values[columnName] = col.defaultValue;
                            continue;
                        }
                        validatedRows[i].values[columnName] = null;
                    }
                    else {
                        if (col.isNotNull) {
                            if (validatedRows[i].values[columnName] === null || validatedRows[i].values[columnName] === undefined) {
                                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é NOT NULL e foi fornecido valor nulo`], "error");
                                table.revertAutoIncrementValues(valuesBeforeIncrement);
                                return;
                            }
                            if (col.isAutoIncrement) {
                                if (!(col.incrementCounter > validatedRows[i].values[columnName])) {
                                    col.incrementCounter = validatedRows[i].values[columnName] + 1;
                                }
                            }
                        }
                    }
                }
            }
            for (const columnName in table.columns) {
                if (table.columns[columnName].isUnique) {
                    const existingValues = new Set(table.rows.map(r => r.values[columnName]));
                    const insertedValues = new Set();
                    for (const row of validatedRows) {
                        const value = row.values[columnName];
                        if (value === null)
                            continue;
                        if (existingValues.has(value)) {
                            getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é UNIQUE e o valor fornecido já existe`], "error");
                            table.revertAutoIncrementValues(valuesBeforeIncrement);
                            return;
                        }
                        if (insertedValues.has(value)) {
                            getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é UNIQUE e o valor fornecido se repete em outra linha a ser inserida`], "error");
                            table.revertAutoIncrementValues(valuesBeforeIncrement);
                            return;
                        }
                        insertedValues.add(value);
                    }
                }
                if (table.columns[columnName].isForeignKey) {
                    const referencedTable = getTable(table.columns[columnName].reference.table);
                    const referencedColumn = table.columns[columnName].reference.column;
                    if (!referencedTable) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é FOREIGN KEY e a tabela referenciada "${table.columns[columnName].reference.table}" não existe`], "error");
                        table.revertAutoIncrementValues(valuesBeforeIncrement);
                        return;
                    }
                    if (!referencedTable.columns[referencedColumn]) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é FOREIGN KEY e a coluna referenciada "${table.columns[columnName].reference.column}" não existe na tabela "${table.columns[columnName].reference.table}"`], "error");
                        table.revertAutoIncrementValues(valuesBeforeIncrement);
                        return;
                    }
                    for (const row of validatedRows) {
                        const value = row.values[columnName];
                        if (value === null)
                            continue;
                        const exists = referencedTable.rows.some(ro => ro.values[referencedColumn] === value);
                        if (!exists) {
                            getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é FOREIGN KEY e o valor fornecido não existe na tabela referenciada`], "error");
                            table.revertAutoIncrementValues(valuesBeforeIncrement);
                            return;
                        }
                    }
                }
            }
            for (const row of validatedRows) {
                SGBDFunctions.insertRow(tableName, row, schemaName);
            }
            getCurrentTerminalSession().createEntry(this.fullCommand, [`${validatedRows.length} linha(s) inserida(s) na tabela "${tableName}"`], "success");
        }
        validateRowsTypes(rows, table) {
            const newRows = [];
            for (const row of rows) {
                const newRow = new DB.Row(getCurrentTable(), {});
                for (const columnName in row.values) {
                    if (typeof row.values[columnName] === "string" && row.values[columnName].toUpperCase() === "NULL") {
                        newRow.values[columnName] = null;
                        continue;
                    }
                    const colType = table.columns[columnName].type;
                    let parsed = row.values[columnName];
                    if (compareTypes(colType, types.TEXT) || compareTypes(colType, types.DATE)
                        || compareTypes(colType, types.TIME) || compareTypes(colType, types.VARCHAR(0))) {
                        if (!(parsed.startsWith("'") && parsed.endsWith("'") || parsed.startsWith('"') && parsed.endsWith('"'))) {
                            return "Tipo deve começar e acabar com \" ou \'";
                        }
                        parsed = parsed.slice(1, parsed.length - 1);
                    }
                    if (!table.columns[columnName].type.validate(parsed)) {
                        return `Valor inválido para a coluna "${columnName}"`;
                    }
                    parsed = colType.parse(parsed);
                    if (!valueExists(parsed)) {
                        return `Valor inválido para a coluna "${columnName}"`;
                    }
                    if (!table.columns[columnName].type.validate(parsed)) {
                        return `Valor inválido para a coluna "${columnName}"`;
                    }
                    newRow.values[columnName] = parsed;
                }
                newRows.push(newRow);
            }
            return newRows;
        }
    }
    SQL.SQLInsert = SQLInsert;
    /**
     * Agrupa comandos de sistema como USE.
     */
    class SystemCommands {
        fullCommand;
        tokens;
        /**
         * Cria um executor para comandos de sistema tokenizados.
         * @param fullCommand - Texto original do comando.
         * @param tokens - Tokens gerados a partir do comando.
         */
        constructor(fullCommand, tokens) {
            this.fullCommand = fullCommand;
            this.tokens = tokens;
        }
        /**
         * Executa o comando USE para trocar a database ativa.
         */
        use() {
            const type = this.tokens[1]?.toLowerCase();
            const target = this.tokens[2]?.toLowerCase();
            if (type !== "database" && type !== "schema") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando USE incorreto", "Tipo de objeto inválido. Use 'DATABASE' ou 'SCHEMA'."], "error");
                return;
            }
            if (!target) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando USE incorreto", "Nome é obrigatório"], "error");
                return;
            }
            if (type === "schema") {
                if (this.tokens.length > 3) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando USE incorreto", "Nome do SCHEMA deve ser uma única palavra"], "error");
                    return;
                }
                if (!valueExists(getCurrentDatabase()?.schemas[target])) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, [`SCHEMA "${target}" não existe`], "error");
                    return;
                }
                currentSchema = target;
                currentTable = null;
                refreshUI();
                getCurrentTerminalSession().createEntry(this.fullCommand, [`SCHEMA "${target}" selecionado`], "success");
                return;
            }
            if (this.tokens.length > 3) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando USE incorreto", "Nome da DATABASE deve ser uma única palavra"], "error");
                return;
            }
            if (!databases[target]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Database "${target}" não existe`], "error");
                return;
            }
            currentDatabase = target;
            currentSchema = null;
            currentTable = null;
            refreshUI();
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Database "${target}" selecionada`], "success");
        }
    }
    SQL.SystemCommands = SystemCommands;
    function verifySchemaTableName(name) {
        let schemaName;
        let tableName;
        if (currentDatabase == null) {
            return { schemaName: null, tableName: null, error: "Nenhuma database selecionada" };
        }
        if (name.includes(".")) {
            schemaName = name.split(".")[0]?.toLowerCase();
            tableName = name.split(".")[1]?.toLowerCase();
            if (!getCurrentDatabase().schemas[schemaName]) {
                return { schemaName: null, tableName: null, error: `Schema "${schemaName}" não existe na database "${currentDatabase}"` };
            }
        }
        else {
            if (currentSchema === null) {
                return { schemaName: null, tableName: null, error: "Nenhum schema selecionado" };
            }
            schemaName = currentSchema;
            tableName = name.toLowerCase();
        }
        if (!getCurrentDatabase().schemas[schemaName].tables[tableName]) {
            return { schemaName: null, tableName: null, error: `Tabela "${tableName}" não existe no schema "${currentSchema}"` };
        }
        return { schemaName: schemaName, tableName: tableName, error: null };
    }
    SQL.verifySchemaTableName = verifySchemaTableName;
    /**
     * Analisa uma definição de coluna do SQL e cria a instância correspondente.
     * @param columnDef - Tokens que compõem a definição da coluna.
     * @returns Coluna parseada ou mensagem de erro.
     */
    function parseColumn(columnDef) {
        if (columnDef.length < 2) {
            return { column: null, error: "Definição de coluna inválida" };
        }
        if (!isValidSQLName(columnDef[0])) {
            return { column: null, error: `Nome de coluna inválido: "${columnDef[0]}"` };
        }
        if (keyWords.includes(columnDef[0].toLowerCase())) {
            return { column: null, error: `Nome de coluna não pode ser uma palavra-chave reservada: "${columnDef[0]}"` };
        }
        const columnName = columnDef[0];
        const rawColumnType = columnDef[1].toLowerCase();
        let columnType;
        if (rawColumnType === "int") {
            columnType = types.INTEGER;
        }
        else {
            columnType = DataTypes.createDataTypeFromString(rawColumnType.toUpperCase());
        }
        if (!valueExists(columnType)) {
            return { column: null, error: `Tipo de coluna inválido: "${columnDef[1]}"` };
        }
        const column = new DB.Column(columnName, getCurrentTable(), columnType);
        if (compareTypes(columnType, types.ENUM([]))) {
            const enumStartIndex = columnDef.findIndex(token => token === "(");
            if (enumStartIndex === -1) {
                return { column: null, error: "ENUM inválido: falta parêntese de abertura" };
            }
            const enumEndIndex = columnDef.findIndex(token => token === ")");
            if (enumEndIndex === -1) {
                return { column: null, error: "ENUM inválido: falta parêntese de fechamento" };
            }
            const enumValues = columnDef.slice(enumStartIndex + 1, enumEndIndex);
            if (enumValues.length === 0) {
                return { column: null, error: "ENUM deve possuir pelo menos um valor" };
            }
            for (let i = 0; i < enumValues.length; i++) {
                const token = enumValues[i];
                if (i % 2 === 0) {
                    if (token === ",") {
                        return { column: null, error: "Valor ENUM inválido" };
                    }
                    if (!token.startsWith('"') || !token.endsWith('"')) {
                        return { column: null, error: "Valores ENUM devem estar entre aspas" };
                    }
                }
                else {
                    if (token !== ",") {
                        return { column: null, error: "Valores ENUM devem ser separados por vírgula" };
                    }
                }
            }
            column.type.setAllowedValues(enumValues.filter(token => token !== ",").map(token => {
                if (token.startsWith('"') && token.endsWith('"')) {
                    return token.slice(1, -1);
                }
                return token;
            }));
        }
        if (compareTypes(columnType, types.VARCHAR(0))) {
            const varcharStartIndex = columnDef.findIndex(token => token === "(");
            if (varcharStartIndex === -1) {
                return { column: null, error: "VARCHAR inválido: falta parêntese de abertura" };
            }
            const varcharEndIndex = columnDef.findIndex(token => token === ")");
            if (varcharEndIndex === -1) {
                return { column: null, error: "VARCHAR inválido: falta parêntese de fechamento" };
            }
            const varcharValues = columnDef.slice(varcharStartIndex + 1, varcharEndIndex);
            if (varcharValues.length === 0) {
                return { column: null, error: "VARCHAR deve possuir um valor máximo" };
            }
            if (varcharValues.length !== 1) {
                return { column: null, error: "VARCHAR deve possuir apenas um valor máximo" };
            }
            const varcharValue = varcharValues[0];
            if (!/^\d+$/.test(varcharValue)) {
                return { column: null, error: "Valor máximo de VARCHAR deve ser um número" };
            }
            const varcharMaxLength = parseInt(varcharValue);
            if (isNaN(varcharMaxLength) || varcharMaxLength <= 0) {
                return { column: null, error: "Valor máximo de VARCHAR inválido" };
            }
            column.type.setMaxLength(varcharMaxLength);
        }
        const primaryValidation = validateCompoundKeyword("primary", "key", "PRIMARY KEY", columnDef);
        if (typeof primaryValidation === "string") {
            return { column: null, error: primaryValidation };
        }
        column.isPrimaryKey = primaryValidation === 1;
        const foreignValidation = validateCompoundKeyword("foreign", "key", "FOREIGN KEY", columnDef);
        if (typeof foreignValidation === "string") {
            return { column: null, error: foreignValidation };
        }
        column.isForeignKey = foreignValidation === 1;
        const notNullValidation = validateCompoundKeyword("not", "null", "NOT NULL", columnDef);
        if (typeof notNullValidation === "string") {
            return { column: null, error: notNullValidation };
        }
        column.isNotNull = notNullValidation === 1;
        const uniqueValidation = validateSingleKeyword("unique", "UNIQUE", columnDef);
        if (typeof uniqueValidation === "string") {
            return { column: null, error: uniqueValidation };
        }
        column.isUnique = uniqueValidation === 1;
        const autoIncrementValidation = validateSingleKeyword("auto_increment", "AUTO_INCREMENT", columnDef);
        if (typeof autoIncrementValidation === "string") {
            return { column: null, error: autoIncrementValidation };
        }
        column.isAutoIncrement = autoIncrementValidation === 1;
        const defaultValidation = validateSingleKeyword("default", "DEFAULT", columnDef);
        if (typeof defaultValidation === "string") {
            return { column: null, error: defaultValidation };
        }
        column.hasDefault = defaultValidation === 1;
        const currentTimestampValidation = validateSingleKeyword("current_timestamp", "CURRENT_TIMESTAMP", columnDef);
        if (typeof currentTimestampValidation === "string") {
            return { column: null, error: currentTimestampValidation };
        }
        column.isCurrentTimestamp = currentTimestampValidation === 1;
        if (column.hasDefault) {
            const defaultIndex = columnDef.findIndex(token => token.toLowerCase() === "default");
            if (defaultIndex === -1 || defaultIndex === columnDef.length - 1) {
                return { column: null, error: "DEFAULT deve ser seguido de um valor" };
            }
            const defaultValue = columnDef[defaultIndex + 1];
            if (compareTypes(columnType, types.TEXT) || compareTypes(columnType, types.DATE) || compareTypes(columnType, types.TIME)) {
                if (!(defaultValue.startsWith("'") && defaultValue.endsWith("'") || defaultValue.startsWith('"') && defaultValue.endsWith('"'))) {
                    return { column: null, error: "Tipo deve começar e acabar com \" ou \'" };
                }
            }
            const parsedDefaultValue = columnType.parse(defaultValue);
            if (!valueExists(parsedDefaultValue) || isNaN(parsedDefaultValue)) {
                return { column: null, error: `Valor DEFAULT inválido para ${columnType.name}` };
            }
            column.defaultValue = parsedDefaultValue;
        }
        const hasReferences = columnDef.some(token => token.toLowerCase() === "references");
        if (hasReferences && !column.isForeignKey) {
            return { column: null, error: "REFERENCES só pode ser usado com FOREIGN KEY" };
        }
        if (column.isForeignKey) {
            const referencesCount = columnDef.filter(token => token.toLowerCase() === "references").length;
            if (referencesCount > 1) {
                return { column: null, error: "Apenas um REFERENCES é permitido" };
            }
            const referencesIndex = columnDef.findIndex(token => token.toLowerCase() === "references");
            if (referencesIndex <= 0 || columnDef[referencesIndex - 1].toLowerCase() !== "key") {
                return { column: null, error: "FOREIGN KEY deve ser seguido de REFERENCES" };
            }
            if (referencesIndex + 4 >= columnDef.length || columnDef[referencesIndex + 2] !== "(" ||
                columnDef[referencesIndex + 4] !== ")") {
                return { column: null, error: "REFERENCES inválido" };
            }
            const name = columnDef[referencesIndex + 1];
            const { schemaName, tableName, error } = verifySchemaTableName(name);
            if (error) {
                return { column: null, error: error };
            }
            if (!schemaName || !tableName)
                return { column: null, error: "Algo deu terrivelmente errado" };
            const refTable = getCurrentDatabase().schemas[schemaName].tables[tableName];
            if (refTable === null) {
                return { column: null, error: `Tabela de referência "${tableName}" não existe no schema "${schemaName}"` };
            }
            const refColumn = refTable.columns[columnDef[referencesIndex + 3]];
            if (refColumn === undefined) {
                return { column: null, error: `Coluna de referência "${columnDef[referencesIndex + 3]}" não existe na tabela "${columnDef[referencesIndex + 1]}"` };
            }
            if (refColumn.type !== columnType) {
                return { column: null, error: `Tipo da coluna de referência "${columnDef[referencesIndex + 3]}" na tabela "${columnDef[referencesIndex + 1]}" não corresponde ao tipo da coluna atual` };
            }
            if (!refColumn.isUnique && !refColumn.isPrimaryKey) {
                return { column: null, error: `Coluna de referência "${columnDef[referencesIndex + 3]}" na tabela "${columnDef[referencesIndex + 1]}" não é UNIQUE` };
            }
            column.reference = {
                schema: schemaName,
                table: tableName,
                column: refColumn.name
            };
        }
        // Verificação da integridade com outras características da coluna
        // PRIMARY KEY implica NOT NULL
        if (column.isPrimaryKey) {
            column.isNotNull = true;
            column.isUnique = true;
        }
        // AUTO_INCREMENT
        if (column.isAutoIncrement) {
            if (!compareTypes(columnType, types.INTEGER)) {
                return { column: null, error: "AUTO_INCREMENT só pode ser usado em colunas INTEGER" };
            }
            if (column.isForeignKey) {
                return { column: null, error: "AUTO_INCREMENT não pode ser usado com FOREIGN KEY" };
            }
            if (column.hasDefault) {
                return { column: null, error: "AUTO_INCREMENT não pode ser usado com DEFAULT" };
            }
            if (column.isCurrentTimestamp) {
                return { column: null, error: "AUTO_INCREMENT não pode ser usado com CURRENT_TIMESTAMP" };
            }
            column.isNotNull = true;
        }
        // CURRENT_TIMESTAMP
        if (column.isCurrentTimestamp) {
            if (!compareTypes(columnType, types.DATE) && !compareTypes(columnType, types.TIME)) {
                return { column: null, error: "CURRENT_TIMESTAMP só pode ser usado em colunas DATE ou TIME" };
            }
            if (column.isForeignKey) {
                return { column: null, error: "CURRENT_TIMESTAMP não pode ser usado com FOREIGN KEY" };
            }
            if (column.hasDefault) {
                return { column: null, error: "CURRENT_TIMESTAMP não pode ser usado com DEFAULT" };
            }
        }
        // FOREIGN KEY
        if (column.isForeignKey) {
            if (column.isAutoIncrement) {
                return { column: null, error: "FOREIGN KEY não pode ser usado com AUTO_INCREMENT" };
            }
            if (column.isCurrentTimestamp) {
                return { column: null, error: "FOREIGN KEY não pode ser usado com CURRENT_TIMESTAMP" };
            }
        }
        return { column: column, error: null };
    }
    SQL.parseColumn = parseColumn;
    /**
     * Valida palavras-chave compostas, como PRIMARY KEY ou NOT NULL.
     */
    function validateCompoundKeyword(first, second, name, words) {
        const firstCount = countTokenSequence(words, first);
        const compoundCount = countTokenSequence(words, first, second);
        if (firstCount !== compoundCount) {
            return `${name}: ${first.toUpperCase()} deve ser seguido de ${second.toUpperCase()}`;
        }
        if (compoundCount > 1) {
            return `${name}: definido mais de uma vez`;
        }
        return compoundCount;
    }
    SQL.validateCompoundKeyword = validateCompoundKeyword;
    /**
     * Valida palavras-chave simples, como UNIQUE ou DEFAULT.
     */
    function validateSingleKeyword(keyword, name, words) {
        const count = countTokenSequence(words, keyword);
        if (count > 1) {
            return `${name} definido mais de uma vez`;
        }
        return count;
    }
    SQL.validateSingleKeyword = validateSingleKeyword;
    /**
     * Conta quantas vezes uma sequência de tokens aparece.
     * @param tokens - Lista de tokens de entrada.
     * @param sequence - Sequência a ser procurada.
     * @returns Número de ocorrências encontradas.
     */
    function countTokenSequence(tokens, ...sequence) {
        const lowerTokens = tokens.map(token => token.toLowerCase());
        const lowerSequence = sequence.map(token => token.toLowerCase());
        let count = 0;
        for (let i = 0; i <= lowerTokens.length - lowerSequence.length; i++) {
            let matches = true;
            for (let j = 0; j < lowerSequence.length; j++) {
                if (lowerTokens[i + j] !== lowerSequence[j]) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                count++;
            }
        }
        return count;
    }
    SQL.countTokenSequence = countTokenSequence;
    /**
     * Divide a lista de tokens em definições de colunas separadas por vírgula.
     * @param tokens - Tokens da cláusula de colunas.
     * @returns Lista de definições de coluna.
     */
    function splitColumnDefinitions(tokens) {
        const columns = [];
        let current = [];
        let depth = 0;
        for (const token of tokens) {
            if (token === "(") {
                depth++;
            }
            if (token === ")") {
                depth--;
            }
            if (token === "," && depth === 0) {
                columns.push(current);
                current = [];
                continue;
            }
            current.push(token);
        }
        if (current.length > 0) {
            columns.push(current);
        }
        return columns;
    }
    SQL.splitColumnDefinitions = splitColumnDefinitions;
    /**
     * Tokeniza uma string SQL em palavras e símbolos relevantes.
     * @param sql - Texto SQL original.
     * @returns Lista de tokens resultantes.
     */
    function tokenizeSQL(sql) {
        const tokens = [];
        let current = "";
        for (let i = 0; i < sql.length; i++) {
            const char = sql[i];
            if (/\s/.test(char)) {
                if (current) {
                    tokens.push(current);
                    current = "";
                }
                continue;
            }
            if ("(),;".includes(char)) {
                if (current) {
                    tokens.push(current);
                    current = "";
                }
                tokens.push(char);
                continue;
            }
            current += char;
        }
        if (current) {
            tokens.push(current);
        }
        return tokens;
    }
    SQL.tokenizeSQL = tokenizeSQL;
})(SQL || (SQL = {}));
// #endregion
// #region Logical
const logical = document.getElementById("logical");
const camera = document.getElementById("camera");
let connectionsSvg = document.getElementById("logical-connections");
let draggingCamera = false;
let cameraX = 0;
let cameraY = 0;
let zoom = 1;
let lastMouseX = 0;
let lastMouseY = 0;
let draggingTable = null;
let tableX = 0;
let tableY = 0;
let moved = false;
let tablesLogical = {};
const logicalConnections = [];
function refreshLogical() {
    camera.innerHTML = "";
    connectionsSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    connectionsSvg.id = "logical-connections";
    camera.appendChild(connectionsSvg);
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "arrow");
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "10");
    marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "8");
    marker.setAttribute("markerHeight", "8");
    marker.setAttribute("orient", "auto");
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 Z");
    arrow.setAttribute("fill", "var(--blue6)");
    marker.appendChild(arrow);
    defs.appendChild(marker);
    connectionsSvg.appendChild(defs);
    const GAP_X = 450;
    const GAP_Y = 400;
    let nCol = 0;
    let nRow = 0;
    for (const schema of Object.values(getCurrentDatabase()?.schemas ?? {})) {
        for (const table of Object.values(schema.tables)) {
            const divTabelaLogical = document.createElement("div");
            divTabelaLogical.classList.add("tabela-logical");
            divTabelaLogical.dataset.x = GAP_X * nCol + "";
            divTabelaLogical.dataset.y = GAP_Y * nRow + "";
            divTabelaLogical.addEventListener("mousedown", (event) => {
                moved = false;
                event.stopPropagation();
                draggingTable = divTabelaLogical;
                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            });
            divTabelaLogical.style.transform = `translate(${GAP_X * nCol}px, ${GAP_Y * nRow}px)`;
            nCol++;
            if (nCol == 3) {
                nCol = 0;
                nRow++;
            }
            camera.appendChild(divTabelaLogical);
            const details = document.createElement("details");
            details.open = true;
            details.addEventListener("toggle", () => {
                requestAnimationFrame(drawConnectionLines);
            });
            divTabelaLogical.appendChild(details);
            const summary = document.createElement("summary");
            summary.innerHTML = `
            <div>
                <svg viewBox="0 -960 960 960" fill="currentColor">
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
                </svg>
                <p>${schema.name}.${table.name}</p>
            </div>
            `;
            summary.addEventListener("click", (event) => {
                if (moved) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            details.appendChild(summary);
            const configDiv = document.createElement("div");
            summary.appendChild(configDiv);
            const configSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            configSVG.setAttribute("viewBox", "0 -960 960 960");
            configSVG.setAttribute("fill", "currentColor");
            configSVG.addEventListener("click", (event) => {
                event.stopPropagation();
                table.onConfig?.();
            });
            configDiv.appendChild(configSVG);
            const configPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            configPath.setAttribute("d", "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z");
            configSVG.appendChild(configPath);
            const divColumns = document.createElement("div");
            details.appendChild(divColumns);
            const divHeader = document.createElement("div");
            divHeader.innerHTML = `
            <p>Coluna</p>
            <p>Tipo</p>
            <p>PK</p>
            <p>FK</p>
            <p>NN</p>
            <p>UQ</p>
            `;
            divColumns.appendChild(divHeader);
            tablesLogical[table.name] = {
                table: table,
                element: divTabelaLogical,
                columns: {}
            };
            let r = 1;
            for (let c of Object.values(table.columns)) {
                const divColumn = document.createElement("div");
                divColumn.innerHTML = `
                <p>${c.icon}${c.name}</p>
                <p style="color: var(--${c.type.color});">${c.type.name}</p>
                `;
                if (c.isPrimaryKey) {
                    divColumn.innerHTML += `
                    <p>
                        <svg style="--bg: var(--green9); --c: var(--green4);" viewBox="0 -960 960 960" fill="currentColor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg>
                    </p>
                    `;
                }
                else {
                    divColumn.innerHTML += `
                    <p>
                        <svg style="--bg: var(--red9); --c: var(--red4);" viewBox="0 -960 960 960" fill="currentcolor">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </p>
                    `;
                }
                if (c.isForeignKey) {
                    divColumn.innerHTML += `
                    <p>
                        <svg style="--bg: var(--green9); --c: var(--green4);" viewBox="0 -960 960 960" fill="currentColor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg>
                    </p>
                    `;
                }
                else {
                    divColumn.innerHTML += `
                    <p>
                        <svg style="--bg: var(--red9); --c: var(--red4);" viewBox="0 -960 960 960" fill="currentcolor">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </p>
                    `;
                }
                if (c.isNotNull) {
                    divColumn.innerHTML += `
                    <p>
                        <svg style="--bg: var(--green9); --c: var(--green4);" viewBox="0 -960 960 960" fill="currentColor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg>
                    </p>
                    `;
                }
                else {
                    divColumn.innerHTML += `
                    <p>
                        <svg style="--bg: var(--red9); --c: var(--red4);" viewBox="0 -960 960 960" fill="currentcolor">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </p>
                    `;
                }
                if (c.isUnique) {
                    divColumn.innerHTML += `
                    <p>
                        <svg style="--bg: var(--green9); --c: var(--green4);" viewBox="0 -960 960 960" fill="currentColor">
                            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg>
                    </p>
                    `;
                }
                else {
                    divColumn.innerHTML += `
                    <p>
                        <svg style="--bg: var(--red9); --c: var(--red4);" viewBox="0 -960 960 960" fill="currentcolor">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </p>
                    `;
                }
                divColumns.appendChild(divColumn);
                tablesLogical[table.name].columns[c.name] = {
                    column: c,
                    element: divColumn,
                    row: r
                };
                r++;
            }
        }
    }
    logicalConnections.length = 0;
    for (const schema of Object.values(getCurrentDatabase()?.schemas ?? {})) {
        for (const table of Object.values(schema.tables)) {
            for (const column of Object.values(table.columns)) {
                if (!column.reference)
                    continue;
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("fill", "none");
                path.setAttribute("stroke", "var(--blue6)");
                path.setAttribute("stroke-width", "2");
                path.setAttribute("stroke-linecap", "round");
                path.setAttribute("marker-end", "url(#arrow)");
                connectionsSvg.appendChild(path);
                logicalConnections.push({
                    from: {
                        table: table.name,
                        column: column.name
                    },
                    to: {
                        table: column.reference.table,
                        column: column.reference.column
                    },
                    path: path,
                    fromSide: "right",
                    toSide: "left",
                });
            }
        }
    }
    requestAnimationFrame(() => {
        drawConnectionLines();
    });
}
function drawConnectionLines() {
    for (const connection of logicalConnections) {
        const fromTable = tablesLogical[connection.from.table];
        const toTable = tablesLogical[connection.to.table];
        if (!fromTable || !toTable)
            continue;
        const fromColumn = fromTable.columns[connection.from.column];
        const toColumn = toTable.columns[connection.to.column];
        if (!fromColumn || !toColumn)
            continue;
        const fromWidth = fromTable.element.offsetWidth;
        const toWidth = toTable.element.offsetWidth;
        const fromDetails = fromTable.element.querySelector("details");
        const toDetails = toTable.element.querySelector("details");
        const headerHeight = fromTable.element.querySelector("details > div > div").offsetHeight;
        const rowHeight = fromColumn.element.offsetHeight;
        const fromX = Number(fromTable.element.dataset.x);
        const fromY = Number(fromTable.element.dataset.y);
        const toX = Number(toTable.element.dataset.x);
        const toY = Number(toTable.element.dataset.y);
        let y1;
        let y2;
        if (fromDetails.open) {
            y1 = fromY + headerHeight + fromColumn.row * rowHeight + rowHeight / 2;
        }
        else {
            const summary = fromTable.element.querySelector("summary");
            y1 = fromY + summary.offsetHeight / 2;
        }
        if (toDetails.open) {
            y2 = toY + headerHeight + toColumn.row * rowHeight + rowHeight / 2;
        }
        else {
            const summary = toTable.element.querySelector("summary");
            y2 = toY + summary.offsetHeight / 2;
        }
        const candidates = [
            {
                fromSide: "right",
                toSide: "left",
                x1: fromX + fromWidth,
                x2: toX,
            },
            {
                fromSide: "right",
                toSide: "right",
                x1: fromX + fromWidth,
                x2: toX + toWidth,
            },
            {
                fromSide: "left",
                toSide: "left",
                x1: fromX,
                x2: toX,
            },
            {
                fromSide: "left",
                toSide: "right",
                x1: fromX,
                x2: toX + toWidth,
            }
        ];
        let best = candidates[0];
        let bestCost = Infinity;
        for (const c of candidates) {
            const dx = c.x2 - c.x1;
            const dy = y2 - y1;
            let cost = dx * dx + dy * dy * 2;
            if (c.fromSide !== connection.fromSide)
                cost += 200;
            if (c.toSide !== connection.toSide)
                cost += 200;
            if (c.fromSide === "right" && c.x2 < c.x1)
                cost += 200;
            if (c.fromSide === "left" && c.x2 > c.x1)
                cost += 200;
            if (cost < bestCost) {
                best = c;
                bestCost = cost;
            }
        }
        const x1 = best.x1;
        const x2 = best.x2;
        const fromSide = best.fromSide;
        const toSide = best.toSide;
        const offset = Math.min(150, Math.max(50, Math.abs(x2 - x1) * 0.35));
        const c1x = fromSide === "right" ? x1 + offset : x1 - offset;
        const c2x = toSide === "right" ? x2 + offset : x2 - offset;
        connection.path.setAttribute("d", `M ${x1} ${y1}
            C ${c1x} ${y1},
            ${c2x} ${y2},
            ${x2} ${y2}`);
    }
}
document.addEventListener("mousemove", (event) => {
    if (!draggingTable)
        return;
    moved = true;
    let x = Number(draggingTable.dataset.x);
    let y = Number(draggingTable.dataset.y);
    x += (event.clientX - lastMouseX) / zoom;
    y += (event.clientY - lastMouseY) / zoom;
    draggingTable.dataset.x = String(x);
    draggingTable.dataset.y = String(y);
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    draggingTable.style.transform = `translate(${x}px, ${y}px)`;
    drawConnectionLines();
});
function renderCamera() {
    camera.style.transformOrigin = "0 0";
    camera.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${cameraX}, ${cameraY})`;
    drawConnectionLines();
}
logical.addEventListener("mousedown", (event) => {
    if (event.target.closest(".tabela-logical")) {
        return;
    }
    draggingCamera = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
});
logical.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = logical.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const worldX = (mouseX - cameraX) / zoom;
    const worldY = (mouseY - cameraY) / zoom;
    const factor = event.deltaY < 0 ? 1.1 : 1 / 1.1;
    zoom *= factor;
    zoom = Math.max(0.2, Math.min(zoom, 5));
    zoom = Math.round(zoom * 1000) / 1000;
    cameraX = mouseX - worldX * zoom;
    cameraY = mouseY - worldY * zoom;
    renderCamera();
});
document.addEventListener("mousemove", (event) => {
    if (!draggingCamera)
        return;
    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;
    cameraX += dx;
    cameraY += dy;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    renderCamera();
});
document.addEventListener("mouseup", () => {
    draggingCamera = false;
    draggingTable = null;
});
// #endregion
// #region Save
let autoSaveEnabled = true;
document.getElementById("auto-save-checkbox")?.addEventListener("click", () => {
    autoSaveEnabled = !autoSaveEnabled;
});
/**
 * Marca visualmente a ação de salvar/carregar selecionada pela UI.
 * @param div - Elemento que representa a ação clicada.
 */
function selectAction(div) {
    document.querySelector(".acao-escolhida")?.classList.remove("acao-escolhida");
    div.classList.add("acao-escolhida");
}
/**
 * Marca visualmente a opção (local/json/sql) selecionada pela UI.
 * @param div - Elemento que representa a opção clicada.
 */
function selectOption(div) {
    document.querySelector(".opcao-escolhida")?.classList.remove("opcao-escolhida");
    div.classList.add("opcao-escolhida");
}
let timeoutSaveOrLoad;
/**
 * Executa a ação de salvar ou carregar baseada nas seleções atuais na interface.
 * Decide entre salvar/carregar localmente, em JSON ou em SQL.
 */
function confirmSaveOrLoad() {
    const selectedAction = document.querySelector(".acao-escolhida");
    const selectedOption = document.querySelector(".opcao-escolhida");
    if (!selectedAction || !selectedOption) {
        alert("Por favor, selecione uma ação e uma opção.");
        return;
    }
    const notification = document.querySelector("#save-notification");
    const action = selectedAction.id;
    const option = selectedOption.id;
    if (action === "save-action") {
        if (option === "salvar-local") {
            saveToLocalStorage();
        }
        else if (option === "salvar-json") {
            saveToJson();
        }
        else if (option === "salvar-sql") {
            saveToSql();
        }
        notification.querySelector("p").innerText = "Dados salvos com sucesso!";
        notification.style.display = "block";
        timeoutSaveOrLoad = setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }
    else if (action === "load-action") {
        if (option === "salvar-local") {
            loadFromLocalStorage();
        }
        else if (option === "salvar-json") {
            loadFromJson();
        }
        else if (option === "salvar-sql") {
            loadFromSql();
        }
        notification.querySelector("p").innerText = "Dados carregados com sucesso!";
        notification.style.display = "block";
        timeoutSaveOrLoad = setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }
}
function transformToJson() {
    return JSON.stringify(databases, (key, value) => {
        if (key === "parent")
            return undefined;
        if (value instanceof Map) {
            return [...value.entries()];
        }
        return value;
    });
}
function transformFromJson(json) {
    if (json == null) {
        databases = {};
        return;
    }
    try {
        const data = JSON.parse(json);
        databases = {};
        for (const [name, db] of Object.entries(data)) {
            const d = DB.Database.fromJSON(db);
            if (!d)
                return;
            databases[name] = d;
        }
        refreshUI();
    }
    catch (err) {
        console.error("Erro ao carregar databases:", err);
        databases = {};
    }
}
/**
 * Persiste o estado atual de `databases` no `localStorage` do navegador.
 */
function saveToLocalStorage() {
    localStorage.setItem("databases", transformToJson());
}
/**
 * Restaura o estado de `databases` a partir do `localStorage`.
 */
function loadFromLocalStorage() {
    const json = localStorage.getItem("databases");
    transformFromJson(json);
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
/**
 * Abre um seletor de arquivo para carregar um arquivo JSON com o estado das databases
 * e aplica os dados carregados ao estado em memória.
 */
function loadFromJson() {
}
/**
 * Exporta os dados atuais para SQL (não implementado atualmente).
 */
function saveToSql() {
    alert("Função de exportação para SQL ainda não implementada.");
}
/**
 * Importa dados a partir de um arquivo SQL (não implementado atualmente).
 */
function loadFromSql() {
    alert("Função de importação de SQL ainda não implementada.");
}
async function saveToSupabase() {
    const user = await Auth.getUser();
    const { error } = await supabase.from("profiles")
        .update({
        thifreBD_databases: JSON.parse(transformToJson())
    }).eq("id", user.id);
    console.log(error);
}
async function loadFromSupabase() {
    const user = await Auth.getUser();
    const { data, error } = await supabase.from("profiles")
        .select("thifreBD_databases").eq("id", user.id);
    if (error)
        return;
    const json = JSON.stringify(data[0]["thifreBD_databases"]);
    transformFromJson(json);
}
// #endregion
// #region Help
function createHelpButtons() {
    const helpButtons = document.querySelectorAll("#help-left > div");
    helpButtons.forEach((button, index) => {
        button.addEventListener("click", () => showHelp(index));
    });
}
function showHelp(index) {
    const helpRight = document.getElementById("help-right");
    const helpButtons = document.querySelectorAll("#help-left > div");
    const helpLeft = document.getElementById("help-left");
    for (let i = 0; i < helpButtons.length; i++) {
        const child = helpRight.children[i];
        child.style.display = (i === index) ? "block" : "none";
    }
    helpLeft.querySelector(".help-active")?.classList.remove("help-active");
    helpButtons[index].classList.add("help-active");
}
showHelp(0);
// #endregion
createTerminalSession();
commandTextarea.addEventListener("input", () => {
    commandTextarea.style.height = "auto";
    commandTextarea.style.height = commandTextarea.scrollHeight + "px";
});
commandTextarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // impede quebra de linha
        executeCommand();
        commandTextarea.value = "";
        commandTextarea.style.height = "auto";
        commandTextarea.style.height = commandTextarea.scrollHeight + "px";
    }
    if (event.key === "ArrowUp") {
        const session = getCurrentTerminalSession();
        if (session.history.length === 0)
            return;
        if (TerminalSession.historyIndex === session.history.length)
            return;
        event.preventDefault();
        TerminalSession.historyIndex++;
        commandTextarea.value = session.history[session.history.length - TerminalSession.historyIndex].command;
        commandTextarea.style.height = "auto";
        commandTextarea.style.height = commandTextarea.scrollHeight + "px";
    }
    else if (event.key === "ArrowDown") {
        const session = getCurrentTerminalSession();
        if (session.history.length === 0)
            return;
        if (TerminalSession.historyIndex === 0)
            return;
        if (TerminalSession.historyIndex === 1) {
            commandTextarea.value = "";
            TerminalSession.historyIndex = 0;
            commandTextarea.style.height = "auto";
            commandTextarea.style.height = commandTextarea.scrollHeight + "px";
            event.preventDefault();
            return;
        }
        TerminalSession.historyIndex--;
        commandTextarea.value = session.history[session.history.length - TerminalSession.historyIndex].command;
        commandTextarea.style.height = "auto";
        commandTextarea.style.height = commandTextarea.scrollHeight + "px";
        event.preventDefault();
    }
    else {
        TerminalSession.historyIndex = 0;
    }
});
document.addEventListener("click", closeAllCustomDropdowns);
document.getElementById("menus-centrais").addEventListener("click", (event) => {
    if (event.target !== event.currentTarget)
        return;
    document.querySelectorAll("#menus-centrais > div").forEach((m) => {
        const menu = m;
        menu.style.display = "none";
    });
    document.getElementById("menus-centrais").style.display = "none";
});
window.addEventListener('load', () => updateInterfaceTerminalIndicator(buttonChangeToGrafical));
window.addEventListener("DOMContentLoaded", async () => {
    if (await Auth.isUserLoggedIn()) {
        loadFromSupabase();
    }
    else {
        loadFromLocalStorage();
    }
});
createColumnCreationDiv(document.querySelector("#criacao-tabela ul"));
createColumnCreationDiv(document.getElementById("criacao-colunas-edit"));
createHelpButtons();
const esquerda = document.getElementById("esquerda");
const separador = document.querySelector(".separador-vertical");
let redimensionando = false;
separador.addEventListener("mousedown", () => {
    redimensionando = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
});
document.addEventListener("mouseup", () => {
    redimensionando = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
});
document.addEventListener("mousemove", (e) => {
    if (!redimensionando)
        return;
    const novaLargura = e.clientX;
    if (novaLargura >= 75 && novaLargura <= 600) {
        esquerda.style.width = `${novaLargura}px`;
    }
});
setTimeout(() => {
    changeTo("interface-grafica");
}, 200);
changeLeftSide();
//@ts-ignore
window.thifrebd = {
    showHideTabelaSelecionadaLinhaColuna,
    abrirFechar,
    createDatabaseInterface,
    renameDatabaseInterface,
    changeConfirmDeleteMenu,
    createSchemaInterface,
    renameSchemaInterface,
    createColumnCreationDiv,
    createTableInterface,
    renameTableInterface,
    changeEditColumnsMenu,
    alterColumnsInterface,
    addColumnsInterface,
    insertRowInterface,
    createWhereConditionDiv,
    createTerminalSession,
    selectAction,
    selectOption,
    confirmSaveOrLoad,
    changeEditRowMenu
};
// To Do
// -Aba de ajuda
// -ver () dentro de strings no insert
// -Terminal
// -Salvar e carregar em SQL
// -Pesquisar(Dashboard)
// -Permitir sincronização com banco real
// -Adicionar mais tipos de dados (JSON, BLOB, decimal, etc)
