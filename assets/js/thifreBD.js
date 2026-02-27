// #region Interface Terminal

const buttonChangeToGraficalInterface = document.getElementById("button-interface-terminal-interface");
const buttonChangeToTerminalInterface = document.getElementById("button-interface-terminal-terminal");
const interfaceTerminal = document.getElementById("interface-terminal");

function updateInterfaceTerminalIndicator(activeButton) {
    const left = activeButton.offsetLeft;
    const width = activeButton.offsetWidth;
    interfaceTerminal.style.setProperty("--indicator-left", `${left}px`);
    interfaceTerminal.style.setProperty("--indicator-width", `${width}px`);
}


updateInterfaceTerminalIndicator(buttonChangeToGraficalInterface);


buttonChangeToGraficalInterface.addEventListener("click", () => {
    const interfaceGrafica = document.getElementById("interface-grafica");
    const terminal = document.getElementById("terminal");
    interfaceGrafica.style.display = "flex";
    terminal.style.display = "none";
    buttonChangeToGraficalInterface.classList.add("interface-terminal-ativo");
    buttonChangeToTerminalInterface.classList.remove("interface-terminal-ativo");
    updateInterfaceTerminalIndicator(buttonChangeToGraficalInterface);
});

buttonChangeToTerminalInterface.addEventListener("click", () => {
    const interfaceGrafica = document.getElementById("interface-grafica");
    const terminal = document.getElementById("terminal");
    interfaceGrafica.style.display = "none";
    terminal.style.display = "flex";
    buttonChangeToGraficalInterface.classList.remove("interface-terminal-ativo");
    buttonChangeToTerminalInterface.classList.add("interface-terminal-ativo");
    updateInterfaceTerminalIndicator(buttonChangeToTerminalInterface);
});

// #endregion

class Database {
    constructor(name = "thifreBD") {
        this.name = name;
        this.tables = {};
    }
}

class Table {
    constructor(name) {
        this.name = name;
        this.columns = [];
        this.rows = [];
    }

    addColumn(name, type, isPK = false, isFk = false, isNotNull = false, isUnique = false, isAutoIncrement = false, FKreference = null) {
        this.columns.push(new Column(name, type, isPK, isFk, isNotNull, isUnique, isAutoIncrement, FKreference));
    }
}

class Column {
    constructor(name, type, isPK = false, isFk = false, isNotNull = false, isUnique = false, isAutoIncrement = false, FKreference = null) {
        this.name = name;
        this.type = type;
        this.isPK = isPK;
        this.isFk = isFk;
        this.isNotNull = isNotNull;
        this.isUnique = isUnique;
        this.isAutoIncrement = isAutoIncrement;
        this.autoIncrementCounter = 1;
        this.FKreference = FKreference;
    }
}

const types = Object.freeze({
    TEXT: "text",
    INTEGER: "integer",
    FLOAT: "float",
    BOOLEAN: "boolean",
});


// REMOVER ESSA PARTE DEPOIS
let datasbases = [
    new Database("thifreBD")
];
let currentDatabase = datasbases[0];
let currentTable = null;

function createDatabase() {
    const databaseName = document.getElementById("nome-database").value;

    if (databaseName.trim() === "") {
        openNotifications("<p style='color: red;'>O nome da database não pode ser vazio.</p>");
        return;
    } else if (databaseName.includes(" ")) {
        openNotifications("<p style='color: red;'>O nome da database não pode conter espaços.</p>");
        return;
    }

    datasbases.push(new Database(databaseName));
    currentDatabase = datasbases[datasbases.length - 1];
    document.getElementById("nome-database").value = "";
    openNotifications(`<p style="color: green;">Database "${databaseName}" criada com sucesso!</p>`);

    document.querySelector("#databases .custom-dropdown button span").textContent = databaseName;
    if (document.querySelector("#databases .custom-dropdown ul.custom-dropdown-menu").children.length > 0) {
        document.querySelector("#databases .custom-dropdown ul.custom-dropdown-menu").lastElementChild.classList.remove("custom-dropdown-option-selected");
    }
    document.querySelector("#databases .custom-dropdown ul.custom-dropdown-menu").innerHTML += `<li class="custom-dropdown-option">${databaseName}</li>`;
    document.querySelector("#databases .custom-dropdown ul.custom-dropdown-menu").lastElementChild.classList.add("custom-dropdown-option-selected");
    document.querySelectorAll("#databases .custom-dropdown ul.custom-dropdown-menu li").forEach((li, index) => {
        li.addEventListener("click", () => {
            closeAllDropdowns();
            currentDatabase = datasbases[index];
            refreshVisibleReferenceDropdowns();
        });
    });
    updateCustomDropdowns();
}

function createTable(tableName, columnsList) {
    let table = new Table(tableName);

    columnsList.forEach((column) => {
        table.addColumn(column.nome, column.tipo, column.isPK, column.isFk, column.isNotNull, column.isUnique, column.isAutoIncrement, column.FKreference);
    });

    document.querySelector("#criacao-tabela ul").innerHTML = "";
    createColumnInterface(document.querySelector("#criacao-tabela ul"));

    document.getElementById("nome-tabela-input").value = "";
    openNotifications(`<p style="color: green;">Tabela "${tableName}" criada com sucesso!</p>`);

    const tableElement = document.createElement("div");
    tableElement.innerHTML = `
        <p>${tableName}</p>
        <p>${table.columns.length}</p>
    `;
    tableElement.classList.add("tabela", "tabela-ativa");
    document.querySelectorAll("#tabelas-lista > div").forEach((div) => {
        div.classList.remove("tabela-ativa");
    });
    document.getElementById("tabelas-lista").appendChild(tableElement);
    document.querySelectorAll("#tabelas-lista > div").forEach((div, index) => {
        div.addEventListener("click", () => {
            document.querySelectorAll("#tabelas-lista > div").forEach((sibling) => {
                sibling.classList.remove("tabela-ativa");
            });
            div.classList.add("tabela-ativa");
            currentTable = currentDatabase.tables[Object.keys(currentDatabase.tables)[index]];
            changeSelectedTable(currentTable);
        });
    });

    currentTable = table;
    currentDatabase.tables[tableName] = table;

    changeSelectedTable(table);
    refreshVisibleReferenceDropdowns();
}

function deleteColumn(name) {
    if (!currentTable) {
        return;
    }

    currentTable.columns = currentTable.columns.filter(col => col.name !== name);
    changeSelectedTable(currentTable);
    changeAlterarColunasMenu();
}

function insertRow(values) {
    if (!currentTable) {
        return;
    }

    currentTable.rows.push(values);
    changeSelectedTable(currentTable);
}

// #region Interface

let timeout;
function openNotifications(html) {
    clearTimeout(timeout);
    const notificacoes = document.getElementById("notificacoes");
    notificacoes.style.display = "flex";
    notificacoes.innerHTML = html;

    timeout = setTimeout(() => {
        notificacoes.style.display = "none";
    }, 3000);
}

function abrirFechar(estado, id) {
    const elemento = document.getElementById(id);
    if (estado === false) {
        document.getElementById("menus-centrais").style.display = "flex";
        elemento.style.display = "flex";
    } else if (estado === true) {
        document.getElementById("menus-centrais").style.display = "none";
        elemento.style.display = "none";
        document.getElementById("notificacoes").style.display = "none";
    }
}

function createTableInterface() {
    const tableName = document.getElementById("nome-tabela-input").value;
    if (!currentDatabase) {
        openNotifications("<p style='color: red;'>Nenhuma database selecionada.</p>");
        return;
    } else if (tableName.trim() === "") {
        openNotifications("<p style='color: red;'>O nome da tabela não pode ser vazio.</p>");
        return;
    } else if (tableName.includes(" ")) {
        openNotifications("<p style='color: red;'>O nome da tabela não pode conter espaços.</p>");
        return;
    } else if (currentDatabase.tables[tableName]) {
        openNotifications("<p style='color: red;'>Já existe uma tabela com esse nome.</p>");
        return;
    }

    let columnsList = [];
    const colunasList = document.querySelectorAll("#criacao-tabela ul > div");
    colunasList.forEach((coluna) => {
        const nomeColuna = coluna.querySelector("input").value;
        if (nomeColuna.trim() === "") {
            openNotifications("<p style='color: red;'>O nome da coluna não pode ser vazio.</p>");
            return;
        }
        const columnType = coluna.querySelector('.custom-dropdown button span.custom-dropdown-value').textContent;
        const isPK = coluna.querySelector(".primary-key input").checked;
        const isFk = coluna.querySelector(".foreign-key input").checked;
        const isNotNull = coluna.querySelector(".not-null input").checked;
        const isUnique = coluna.querySelector(".unique input").checked;
        const isAutoIncrement = coluna.querySelector(".auto-increment input").checked;
        let FKreference = null;

        if (isFk) {
            const referenceDropdowns = coluna.querySelectorAll(".referencia .custom-dropdown");
            if (referenceDropdowns.length >= 2) {
                const referencedTable = referenceDropdowns[0].querySelector(".custom-dropdown-value")?.textContent.trim();
                const referencedColumn = referenceDropdowns[1].querySelector(".custom-dropdown-value")?.textContent.trim();

                if (referencedTable && referencedColumn) {
                    FKreference = {
                        table: referencedTable,
                        column: referencedColumn
                    };
                }
            }
        }

        columnsList.push({
            nome: nomeColuna,
            tipo: columnType,
            isPK: isPK,
            isFk: isFk,
            isNotNull: isNotNull,
            isUnique: isUnique,
            isAutoIncrement: isAutoIncrement,
            FKreference: FKreference
        });
    });

    createTable(tableName, columnsList);
}

let contadorColunas = 1;
function createColumnInterface(parentElement) {
    const column = document.createElement("div");
    column.innerHTML = `
        <input type="text" placeholder="Nome da coluna">

        <div class="custom-dropdown">
            <button type="button" class="custom-dropdown-trigger" aria-expanded="false">
                <span class="custom-dropdown-value">Text</span>
            </button>
            <ul class="custom-dropdown-menu" tabindex="-1">
                <li class="custom-dropdown-option custom-dropdown-option-selected" onclick="toggleAutoIncrementButton(false, document.getElementById('auto-increment-${contadorColunas}'))">Text</li>
                <li class="custom-dropdown-option" onclick="toggleAutoIncrementButton(true, document.getElementById('auto-increment-${contadorColunas}'))">Integer</li>
                <li class="custom-dropdown-option" onclick="toggleAutoIncrementButton(false, document.getElementById('auto-increment-${contadorColunas}'))">Float</li>
                <li class="custom-dropdown-option" onclick="toggleAutoIncrementButton(false, document.getElementById('auto-increment-${contadorColunas}'))">Boolean</li>
            </ul>
            <input type="hidden" name="column-type" value="text">
        </div>

        <div class="caracteristics">
            <div class="primary-key">
                <input type="checkbox" id="primary-key-${contadorColunas}" onclick="toggleOnPKButton(this)">
                <label for="primary-key-${contadorColunas}">Primary key</label>
            </div>
            <div class="foreign-key">
                <input type="checkbox" id="foreign-key-${contadorColunas}" onclick="toggleOnFKButton(this)">
                <label for="foreign-key-${contadorColunas}">Foreign key</label>
            </div>
            <div class="not-null">
                <input type="checkbox" id="not-null-${contadorColunas}">
                <label for="not-null-${contadorColunas}">Not null</label>
            </div>
            <div class="unique">
                <input type="checkbox" id="unique-${contadorColunas}">
                <label for="unique-${contadorColunas}">Unique</label>
            </div>
            <div class="auto-increment" style="display: none;">
                <input type="checkbox" id="auto-increment-${contadorColunas}">
                <label for="auto-increment-${contadorColunas}">Auto increment</label>
            </div>
            <div class="delete-column" onclick="deleteColumnCreationInterface(this)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <use href="assets/images/icons-sprite.svg#icon-trash-can"></use>
                </svg>
            </div>
        </div>

        <div class="referencia" style="display: none;">
            <p>Referência</p>
            <div class="custom-dropdown">
                <button type="button" class="custom-dropdown-trigger" aria-expanded="false">
                    <span class="custom-dropdown-value">Crie outra tabela</span>
                </button>
                <ul class="custom-dropdown-menu" tabindex="-1">
                </ul>
                <input type="hidden" name="column-type" value="text">
            </div>
            <div class="custom-dropdown" style="display: none;">
                <button type="button" class="custom-dropdown-trigger" aria-expanded="false">
                    <span class="custom-dropdown-value">Crie uma database</span>
                </button>
                <ul class="custom-dropdown-menu" tabindex="-1">
                </ul>
                <input type="hidden" name="column-type" value="text">
            </div>
        </div>
    `;

    parentElement.appendChild(column);
    updateCustomDropdowns();
    initializeReferenceDropdown(column);
    contadorColunas++;
}

function deleteColumnCreationInterface(element) {
    element.parentElement.parentElement.remove()
}

function deleteColumnInterface(element) {
    element.parentElement.remove();
    deleteColumn(element.parentElement.querySelector("h3").textContent);
}

function alterColumnsInterface() {
    if (!currentTable) {
        openNotifications("<p style='color: red;'>Nenhuma tabela selecionada.</p>");
        return;
    }

    let columnsList = [];
    const colunasList = document.querySelectorAll("#editar-colunas ul#criacao-colunas-edit > div");
    colunasList.forEach((coluna) => {
        const nomeColuna = coluna.querySelector("input").value;
        if (nomeColuna.trim() === "") {
            openNotifications("<p style='color: red;'>O nome da coluna não pode ser vazio.</p>");
            return;
        }
        const columnType = coluna.querySelector('.custom-dropdown button span.custom-dropdown-value').textContent;
        const isPK = coluna.querySelector(".primary-key input").checked;
        const isFk = coluna.querySelector(".foreign-key input").checked;
        const isNotNull = coluna.querySelector(".not-null input").checked;
        const isUnique = coluna.querySelector(".unique input").checked;
        const isAutoIncrement = coluna.querySelector(".auto-increment input").checked;
        columnsList.push({
            nome: nomeColuna,
            tipo: columnType,
            isPK: isPK,
            isFk: isFk,
            isNotNull: isNotNull,
            isUnique: isUnique,
            isAutoIncrement: isAutoIncrement
        });
    });

    columnsList.forEach((column) => {
        currentTable.addColumn(column.nome, column.tipo, column.isPK, column.isFk, column.isNotNull, column.isUnique, column.isAutoIncrement);
        currentTable.rows.forEach((row) => {
            row[column.nome] = column.isAutoIncrement ? column.autoIncrementCounter++ : null;
        });
    });
    openNotifications(`<p style="color: green;">Colunas adicionadas com sucesso!</p>`);
    changeSelectedTable(currentTable);
    changeAlterarColunasMenu();
    document.getElementById("criacao-colunas-edit").innerHTML = "";
    createColumnInterface(document.querySelector('#editar-colunas ul:not(#lista-colunas-existentes)'))
}

function changeAlterarColunasMenu() {
    if (!currentTable) {
        return;
    }
    const menu = document.getElementById("lista-colunas-existentes");
    menu.innerHTML = "";
    currentTable.columns.forEach((column) => {
        menu.innerHTML += `
            <div class="item-lista-colunas-existentes">
                <div>
                    <h3>${column.name}</h3>
                    <p>${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}</p>
                </div>
                <button class="delete-column" onclick="deleteColumnInterface(this)">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <use href="assets/images/icons-sprite.svg#icon-trash-can"></use>
                    </svg>
                </button>
            </div>
        `;
    });
}

function changeInserirLinhaMenu() {
    if (!currentTable) {
        return;
    }

    const inserirLinhasList = document.getElementById("colunas-inserir-linha");
    inserirLinhasList.innerHTML = "";
    currentTable.columns.forEach((column) => {
        if (column.type === "Boolean") {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})</p>
                    <div class="custom-dropdown">
                        <button type="button" class="custom-dropdown-trigger" aria-expanded="false">
                            <span class="custom-dropdown-value">TRUE</span>
                        </button>
                        <ul class="custom-dropdown-menu" tabindex="-1">
                            <li class="custom-dropdown-option custom-dropdown-option-selected">TRUE</li>
                            <li class="custom-dropdown-option">FALSE</li>
                        </ul>
                        <input type="hidden" name="column-type" value="text">
                    </div>
                </div>
            `;
            updateCustomDropdowns();
        } else if (column.isAutoIncrement) {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})</p>
                    <p style="color: var(--gray);">Valor gerado automaticamente</p>
                </div>
            `;
        } else if (column.type === "Integer" || column.type === "Float") {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})</p>
                    <input type="number" step="${column.type === "Integer" ? "1" : "any"}">
                </div>
            `;
        } else {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})</p>
                    <input type="text">
                </div>
            `;
        }
    });

    updateCustomDropdowns();
}

function changeEditarLinhaMenu() {
    if (!currentTable) {
        return;
    }

    const inserirLinhasList = document.getElementById("colunas-editar-linha");
    inserirLinhasList.innerHTML = "";
    currentTable.columns.forEach((column) => {
        if (column.type === "Boolean") {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})</p>
                    <div class="custom-dropdown">
                        <button type="button" class="custom-dropdown-trigger" aria-expanded="false">
                            <span class="custom-dropdown-value">TRUE</span>
                        </button>
                        <ul class="custom-dropdown-menu" tabindex="-1">
                            <li class="custom-dropdown-option custom-dropdown-option-selected">TRUE</li>
                            <li class="custom-dropdown-option">FALSE</li>
                        </ul>
                        <input type="hidden" name="column-type" value="text">
                    </div>
                </div>
            `;
            updateCustomDropdowns();
        } else if (column.isAutoIncrement) {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})</p>
                    <p style="color: var(--gray);">Valor gerado automaticamente</p>
                </div>
            `;
        } else if (column.type === "Integer" || column.type === "Float") {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})</p>
                    <input type="number" step="${column.type === "Integer" ? "1" : "any"}">
                </div>
            `;
        } else {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})</p>
                    <input type="text">
                </div>
            `;
        }
    });

    updateCustomDropdowns();
}

function insertRowInterface() {
    if (!currentTable) {
        openNotifications("<p style='color: red;'>Nenhuma tabela selecionada.</p>");
        return;
    }

    let row = {};
    const inserirLinhasList = document.querySelectorAll("#colunas-inserir-linha > div")
    inserirLinhasList.forEach((div, index) => {
        const columnName = div.querySelector("h3").textContent;
        if (div.querySelector("p").textContent.includes("BOOLEAN")) {
            const boolValue = div.querySelector(".custom-dropdown button span").textContent;
            row[columnName] = boolValue === "TRUE" ? true : false;
        } else if (div.querySelector("p").textContent.includes("AUTO_INCREMENT")) {
            const value = currentTable.columns[index].autoIncrementCounter;
            currentTable.columns[index].autoIncrementCounter++;
            row[columnName] = value;
        } else {
            const inputValue = div.querySelector("input").value;
            row[columnName] = inputValue;
        }
    });

    insertRow(row);
    openNotifications(`<p style="color: green;">Linha inserida com sucesso!</p>`);
    changeInserirLinhaMenu();
}

function changeSelectedTable(table) {
    document.getElementById("nenhuma-tabela-selecionada").style.display = "none";
    document.getElementById("tabela-selecionada-tabela").style.display = "flex";
    document.getElementById("nome-tabela").textContent = table.name;
    document.getElementById("linhas-colunas").textContent = `${table.rows.length} linhas • ${table.columns.length} colunas`;

    let divLinha = document.createElement("div");
    divLinha.classList.add("linha-tabela");
    table.columns.forEach((column) => {
        const divColuna = document.createElement("div");
        divColuna.innerHTML = `
            <p>${column.name}</p>
            <p>${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFk ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO INCREMENT" : ""}</p>
        `;


        divLinha.appendChild(divColuna);
    });
    divLinha.innerHTML += `
        <div><p>Ações</p></div>
    `;

    document.getElementById("tabela-selecionada-tabela").innerHTML = "";
    document.getElementById("tabela-selecionada-tabela").appendChild(divLinha);

    table.rows.forEach((row) => {
        let divLinha = document.createElement("div");
        divLinha.classList.add("linha-tabela");
        Object.values(row).forEach((value) => {
            const divCelula = document.createElement("div");
            divCelula.innerHTML = `<p>${value}</p>`;
            divLinha.appendChild(divCelula);
        });
        divLinha.innerHTML += `
            <div>
                <button onclick="abrirFechar(false, 'editar-linha'); changeEditarLinhaMenu();">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <use href="assets/images/icons-sprite.svg#icon-pencil"></use>
                    </svg>
                </button>
                <button>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <use href="assets/images/icons-sprite.svg#icon-trash-can"></use>
                    </svg>
                </button>
            </div>
        `;

        document.getElementById("tabela-selecionada-tabela").appendChild(divLinha);
    });
}

function toggleOnPKButton(element) {
    const estado = element.checked;
    console.log(estado);
    if (estado) {
        element.parentElement.parentElement.querySelectorAll("div").forEach((div, index) => {
            if (index >= 2 && index < 4) {
                div.style.display = "none";
            }
        });

    } else {
        element.parentElement.parentElement.querySelectorAll("div").forEach((div, index) => {
            if (index >= 2 && index < 4 && !element.parentElement.parentElement.querySelector("div input[onclick='toggleOnFKButton(this)']").checked) {
                div.style.display = "flex";
            }
        });
    }
}

function toggleAutoIncrementButton(estado, element) {
    if (estado) {
        element.parentElement.style.display = "flex";
    } else {
        element.parentElement.style.display = "none";
    }
}

function toggleOnFKButton(element) {
    const estado = element.checked;
    const columnElement = element.parentElement.parentElement.parentElement;
    const referencia = columnElement.querySelector(".referencia");

    referencia.style.display = estado ? "block" : "none";

    if (estado) {
        initializeReferenceDropdown(columnElement);
        updateReferenceTablesDropdown(columnElement);

        element.parentElement.parentElement.querySelectorAll("div").forEach((div, index) => {
            if (index === 4) {
                div.style.display = "none";
            }
            if (index >= 2 && index < 4) {
                div.style.display = "none";
            }
        });
    } else {
        element.parentElement.parentElement.querySelectorAll("div").forEach((div, index) => {
            if (index === 4 && element.parentElement.parentElement.parentElement.querySelector(".custom-dropdown button span").textContent === "Integer") {
                div.style.display = "flex";
            }
            if (index >= 2 && index < 4 && !element.parentElement.parentElement.querySelector("div input").checked) {
                div.style.display = "flex";
            }
        });
    }
}

function initializeReferenceDropdown(columnElement) {
    const referencia = columnElement.querySelector(".referencia");
    if (!referencia || referencia.dataset.referenceInitialized === "true") {
        return;
    }

    const dropdowns = referencia.querySelectorAll(".custom-dropdown");
    if (dropdowns.length < 2) {
        return;
    }

    const tableMenu = dropdowns[0].querySelector(".custom-dropdown-menu");

    if (!tableMenu) {
        return;
    }

    tableMenu.addEventListener("click", (event) => {
        const option = event.target.closest(".custom-dropdown-option");
        if (!option) {
            return;
        }

        setTimeout(() => {
            updateReferenceColumnsDropdown(columnElement);
        }, 0);
    });

    referencia.dataset.referenceInitialized = "true";
}

function updateReferenceTablesDropdown(columnElement) {
    const referencia = columnElement.querySelector(".referencia");
    if (!referencia) {
        return;
    }

    const dropdowns = referencia.querySelectorAll(".custom-dropdown");
    if (dropdowns.length < 2) {
        return;
    }

    const tableDropdown = dropdowns[0];
    const tableValue = tableDropdown.querySelector(".custom-dropdown-value");
    const tableMenu = tableDropdown.querySelector(".custom-dropdown-menu");
    const tableInput = tableDropdown.querySelector('input[name="column-type"]');
    const columnDropdown = dropdowns[1];
    const tableNames = currentDatabase ? Object.keys(currentDatabase.tables) : [];

    if (!tableValue || !tableMenu || !tableInput) {
        return;
    }

    if (tableNames.length === 0) {
        tableMenu.innerHTML = "";
        tableValue.textContent = "Crie outra tabela";
        tableInput.value = "";
        columnDropdown.style.display = "none";
        return;
    }

    const previousSelectedTable = tableValue.textContent.trim();
    const selectedTable = tableNames.includes(previousSelectedTable) ? previousSelectedTable : tableNames[0];

    tableMenu.innerHTML = tableNames
        .map((name) => `<li class="custom-dropdown-option${name === selectedTable ? " custom-dropdown-option-selected" : ""}">${name}</li>`)
        .join("");

    tableValue.textContent = selectedTable;
    tableInput.value = selectedTable;

    updateReferenceColumnsDropdown(columnElement);
}

function updateReferenceColumnsDropdown(columnElement) {
    const referencia = columnElement.querySelector(".referencia");
    if (!referencia) {
        return;
    }

    const dropdowns = referencia.querySelectorAll(".custom-dropdown");
    if (dropdowns.length < 2) {
        return;
    }

    const tableDropdown = dropdowns[0];
    const tableName = tableDropdown.querySelector(".custom-dropdown-value")?.textContent.trim();
    const referencedTable = currentDatabase?.tables?.[tableName];

    const columnDropdown = dropdowns[1];
    const columnValue = columnDropdown.querySelector(".custom-dropdown-value");
    const columnMenu = columnDropdown.querySelector(".custom-dropdown-menu");
    const columnInput = columnDropdown.querySelector('input[name="column-type"]');

    if (!columnValue || !columnMenu || !columnInput) {
        return;
    }

    const columnNames = referencedTable ? referencedTable.columns.map((column) => column.name) : [];

    if (columnNames.length === 0) {
        columnMenu.innerHTML = "";
        columnValue.textContent = "";
        columnInput.value = "";
        columnDropdown.style.display = "none";
        return;
    }

    columnDropdown.style.display = "block";

    const previousSelectedColumn = columnValue.textContent.trim();
    const selectedColumn = columnNames.includes(previousSelectedColumn) ? previousSelectedColumn : columnNames[0];

    columnMenu.innerHTML = columnNames
        .map((name) => `<li class="custom-dropdown-option${name === selectedColumn ? " custom-dropdown-option-selected" : ""}">${name}</li>`)
        .join("");

    columnValue.textContent = selectedColumn;
    columnInput.value = selectedColumn;
}

function refreshVisibleReferenceDropdowns() {
    document.querySelectorAll(".referencia").forEach((referencia) => {
        const columnElement = referencia.parentElement;
        if (!columnElement) {
            return;
        }

        initializeReferenceDropdown(columnElement);

        if (referencia.style.display !== "none") {
            updateReferenceTablesDropdown(columnElement);
        }
    });
}

// #endregion

// #region Custom dropdowns

const initializedDropdowns = new WeakSet();

function closeAllDropdowns() {
    document.querySelectorAll(".custom-dropdown.custom-dropdown-open").forEach((dropdown) => {
        dropdown.classList.remove("custom-dropdown-open");
        const trigger = dropdown.querySelector(".custom-dropdown-trigger");
        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
        }
    });
}

function updateCustomDropdowns() {
    const dropdowns = document.querySelectorAll(".custom-dropdown");

    dropdowns.forEach((dropdown) => {
        if (initializedDropdowns.has(dropdown)) {
            return;
        }

        const trigger = dropdown.querySelector(".custom-dropdown-trigger");
        const valueLabel = dropdown.querySelector(".custom-dropdown-value");
        const hiddenInput = dropdown.querySelector('input[name="column-type"]');
        const menu = dropdown.querySelector(".custom-dropdown-menu");

        if (!trigger || !valueLabel || !hiddenInput || !menu) {
            return;
        }

        trigger.addEventListener("click", (event) => {
            event.stopPropagation();
            const hasOptions = menu.querySelectorAll(".custom-dropdown-option").length > 0;
            if (!hasOptions) {
                dropdown.classList.remove("custom-dropdown-open");
                trigger.setAttribute("aria-expanded", "false");
                return;
            }

            const isOpen = dropdown.classList.contains("custom-dropdown-open");
            closeAllDropdowns();
            if (!isOpen) {
                dropdown.classList.add("custom-dropdown-open");
                trigger.setAttribute("aria-expanded", "true");
            }
        });

        menu.addEventListener("click", (event) => {
            const option = event.target.closest(".custom-dropdown-option");
            if (!option || !menu.contains(option)) {
                return;
            }

            event.stopPropagation();
            const newLabel = (option.textContent || "").trim();
            const newValue = newLabel.toLowerCase();

            hiddenInput.value = newValue;
            valueLabel.textContent = newLabel;

            menu.querySelectorAll(".custom-dropdown-option").forEach((item) => {
                item.classList.remove("custom-dropdown-option-selected");
            });

            option.classList.add("custom-dropdown-option-selected");

            dropdown.classList.remove("custom-dropdown-open");
            trigger.setAttribute("aria-expanded", "false");
        });

        initializedDropdowns.add(dropdown);
    });
}

updateCustomDropdowns();
document.addEventListener("click", () => {
    closeAllDropdowns();
});

document.getElementById("menus-centrais").addEventListener("click", (event) => {
    if (event.target !== event.currentTarget) {
        return;
    }

    document.querySelectorAll("#menus-centrais > div").forEach((menu) => {
        menu.style.display = "none";
    });
    document.getElementById("menus-centrais").style.display = "none";
});
// #endregion