"use strict";
// #region Change interface terminal
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
// #region Others
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
    }
    else if (estado === true) {
        document.getElementById("menus-centrais").style.display = "none";
        elemento.style.display = "none";
    }
}
// #endregion
// #region Custom dropdowns
function openCustomDropdown(dropdownButton) {
    const dropdown = dropdownButton.parentElement;
    if (dropdown.querySelector("ul").children.length === 0)
        return;
    dropdown.classList.toggle("custom-dropdown-open");
}
function choseOption(option) {
    const dropdown = option.closest(".custom-dropdown");
    dropdown.querySelector(".custom-dropdown-trigger").textContent = option.textContent;
    dropdown.classList.remove("custom-dropdown-open");
    dropdown.querySelector(".custom-dropdown-option-selected")?.classList.remove("custom-dropdown-option-selected");
    option.classList.add("custom-dropdown-option-selected");
}
function closeAllCustomDropdowns(event) {
    const target = event.target;
    if (target.closest(".custom-dropdown"))
        return;
    document.querySelectorAll(".custom-dropdown.custom-dropdown-open").forEach((dropdown) => {
        dropdown.classList.remove("custom-dropdown-open");
    });
}
function updateCustomDropdowns() {
    document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
        dropdown.querySelectorAll(".custom-dropdown-option").forEach((option) => {
            option.addEventListener("click", () => choseOption(option));
        });
    });
}
updateCustomDropdowns();
// #endregion
// #region classes and variables
class Database {
    constructor(name) {
        this.name = name;
        this.tables = {};
    }
}
class Table {
    constructor(name) {
        this.name = name;
        this.columns = {};
        this.rows = [];
        this.indexes = {};
    }
}
class Column {
    constructor(name, type, isPrimaryKey = false, isForeignKey = false, isNotNull = false, isUnique = false, isAutoIncrement = false, hasDefault = false, enumValues, reference) {
        this.name = name;
        this.type = type;
        this.isPrimaryKey = isPrimaryKey;
        this.isForeignKey = isForeignKey;
        this.isNotNull = isNotNull;
        this.isUnique = isUnique;
        this.isAutoIncrement = isAutoIncrement;
        this.hasDefault = hasDefault;
        this.enumValues = enumValues;
        this.reference = reference;
    }
}
let databases = {};
let currentDatabase = null;
let currentTable = null;
//#endregion
// #region SGBD functions
function createDatabase(database) {
    databases[database.name] = database;
    currentDatabase = database.name;
    changeDatabaseDropdown();
}
function createTable(table) {
    databases[currentDatabase].tables[table.name] = table;
    currentTable = table.name;
    changeTabelasLista();
    changeTabelaSelecionadaTabela();
}
function addColumn(tableName, column) {
    databases[currentDatabase].tables[tableName].columns[column.name] = column;
    changeTabelaSelecionadaTabela();
}
// #endregion
// #region Interface functions
function createDatabaseInterface() {
    const databaseNameInput = document.getElementById("nome-database-input");
    const databaseName = databaseNameInput.value.trim().toLowerCase();
    if (databaseName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da database não pode ser vazio.</p>");
        return;
    }
    else if (databases[databaseName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma database com esse nome.</p>");
        return;
    }
    createDatabase(new Database(databaseName));
    databaseNameInput.value = "";
    openNotifications(`<p style='color: var(--green4)'>Database "${databaseName}" criada com sucesso!</p>`);
}
function createTableInterface() {
    const tableNameInput = document.getElementById("nome-tabela-input");
    const tableName = tableNameInput.value.trim().toLowerCase();
    if (tableName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não pode ser vazio.</p>");
        return;
    }
    else if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (databases[currentDatabase].tables[tableName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma tabela com esse nome.</p>");
        return;
    }
    const table = new Table(tableName);
    const columnsUl = document.querySelector("#criacao-tabela ul");
    for (const columnDiv of columnsUl.children) {
        const columnNameInput = columnDiv.querySelector("input[type='text']");
        const columnName = columnNameInput.value.trim().toLowerCase();
        if (columnName === "") {
            openNotifications("<p style='color: var(--red5)'>O nome da coluna não pode ser vazio.</p>");
            return;
        }
        else if (table.columns[columnName]) {
            openNotifications("<p style='color: var(--red5)'>Já existe uma coluna com esse nome.</p>");
            return;
        }
        const columnType = columnDiv.querySelector(".custom-dropdown-trigger");
        const isPrimaryKey = columnDiv.querySelector(".primary-key");
        const isForeignKey = columnDiv.querySelector(".foreign-key");
        const isNotNull = columnDiv.querySelector(".not-null");
        const isUnique = columnDiv.querySelector(".unique");
        const hasDefault = columnDiv.querySelector(".default");
        const isAutoIncrement = columnDiv.querySelector(".auto-increment");
        const column = new Column(columnName, columnType.textContent.toLowerCase(), isPrimaryKey.checked, isForeignKey.checked, isNotNull.checked, isUnique.checked, isAutoIncrement.checked, hasDefault.checked);
        table.columns[columnName] = column;
        openNotifications(`<p style='color: var(--green4)'>Coluna "${columnName}" criada com sucesso!</p>`);
    }
    createTable(table);
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl);
    tableNameInput.value = "";
    openNotifications(`<p style='color: var(--green5)'>Tabela "${tableName}" criada com sucesso!</p>`);
}
function addColumnsInterface() {
    const columnsUl = document.querySelector("#editar-colunas ul#criacao-colunas-edit");
    const table = databases[currentDatabase].tables[currentTable];
    for (const columnDiv of columnsUl.children) {
        const columnNameInput = columnDiv.querySelector("input[type='text']");
        const columnName = columnNameInput.value.trim().toLowerCase();
        if (columnName === "") {
            openNotifications("<p style='color: var(--red5)'>O nome da coluna não pode ser vazio.</p>");
            return;
        }
        else if (table.columns[columnName]) {
            openNotifications("<p style='color: var(--red5)'>Já existe uma coluna com esse nome.</p>");
            return;
        }
        const columnType = columnDiv.querySelector(".custom-dropdown-trigger");
        const isPrimaryKey = columnDiv.querySelector(".primary-key");
        const isForeignKey = columnDiv.querySelector(".foreign-key");
        const isNotNull = columnDiv.querySelector(".not-null");
        const isUnique = columnDiv.querySelector(".unique");
        const hasDefault = columnDiv.querySelector(".default");
        const isAutoIncrement = columnDiv.querySelector(".auto-increment");
        const column = new Column(columnName, columnType.textContent.toLowerCase(), isPrimaryKey.checked, isForeignKey.checked, isNotNull.checked, isUnique.checked, isAutoIncrement.checked, hasDefault.checked);
        addColumn(table.name, column);
        openNotifications(`<p style='color: var(--green4)'>Coluna "${columnName}" criada com sucesso!</p>`);
    }
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl);
    changeAlterarColunasMenu();
    openNotifications(`<p style='color: var(--green5)'>Colunas adicionadas com sucesso!</p>`);
}
function addRowInterface() {
}
function createColumnCreationDiv(parent) {
    parent.insertAdjacentHTML("beforeend", `
    <div>
        <input type="text" placeholder="Nome da coluna">

        <div class="custom-dropdown">
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                Text
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option custom-dropdown-option-selected">Text</li>
                <li class="custom-dropdown-option">Integer</li>
                <li class="custom-dropdown-option">Float</li>
                <li class="custom-dropdown-option">Boolean</li>
                <li class="custom-dropdown-option">Date</li>
                <li class="custom-dropdown-option">Enum</li>
            </ul>
            <input type="hidden" name="column-type" value="text">
        </div>

        <div class="caracteristics">
            <div>
                <label>
                    <input type="checkbox" class="primary-key" name="primary-key">
                    Primary key
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" class="foreign-key" name="foreign-key">
                    Foreign key
                </label>
            </div>
            <div>
                <label>
                    <input type="checkbox" class="not-null" name="not-null">
                    Not null
                </label>
            </div>
            <div>                                
                <label>
                    <input type="checkbox" class="unique" name="unique">
                    Unique
                </label>
            </div>
            <div>                                
                <label>
                    <input type="checkbox" class="default" name="default">
                    Default
                </label>
            </div>
            <div style="display: none;">                                
                <label>
                    <input type="checkbox" class="auto-increment" name="auto-increment">
                    Auto increment
                </label>
            </div>
            <div class="delete-column">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>
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
        </div>

        <div class="default-input-text" style="display: none;">
            <p>Default</p>
            <input type="text" placeholder="Valor padrão">
        </div>
    </div>
    `);
    updateCustomDropdowns();
}
function changeDatabaseDropdown() {
    const dropdown = document.querySelector("#databases .custom-dropdown");
    const trigger = dropdown.querySelector(".custom-dropdown-trigger");
    trigger.textContent = currentDatabase ? currentDatabase : "Selecione uma database";
    const menu = dropdown.querySelector(".custom-dropdown-menu");
    menu.innerHTML = "";
    for (let database in databases) {
        const option = document.createElement("li");
        option.classList.add("custom-dropdown-option");
        option.addEventListener("click", () => {
            currentDatabase = database;
            changeTabelasLista();
        });
        if (database === currentDatabase)
            option.classList.add("custom-dropdown-option-selected");
        option.textContent = database;
        menu.appendChild(option);
    }
    updateCustomDropdowns();
}
function changeTabelasLista() {
    if (currentDatabase === null)
        return;
    const tabelasLista = document.getElementById("tabelas-lista");
    tabelasLista.innerHTML = "";
    for (let tabela in databases[currentDatabase].tables) {
        const option = document.createElement("div");
        if (tabela === currentTable) {
            option.classList.add("tabela", "tabela-ativa");
        }
        else {
            option.classList.add("tabela");
        }
        tabelasLista.querySelector(".tabela-ativa")?.classList.remove("tabela-ativa");
        option.addEventListener("click", () => {
            currentTable = tabela;
            tabelasLista.querySelector(".tabela-ativa")?.classList.remove("tabela-ativa");
            option.classList.add("tabela-ativa");
            changeTabelaSelecionadaTabela();
        });
        const name = document.createElement("p");
        name.textContent = tabela;
        option.appendChild(name);
        const size = document.createElement("p");
        size.textContent = `${Object.keys(databases[currentDatabase].tables[tabela].columns).length}`;
        option.appendChild(size);
        tabelasLista.appendChild(option);
    }
}
function changeTabelaSelecionadaTabela() {
    document.getElementById("nenhuma-tabela-selecionada").style.display = "none";
    const selectedTable = document.getElementById("tabela-selecionada-tabela");
    selectedTable.style.display = "flex";
    const table = databases[currentDatabase].tables[currentTable];
    let divLinha = document.createElement("div");
    divLinha.classList.add("linha-tabela");
    Object.values(table.columns).forEach((column, i) => {
        const divColuna = document.createElement("div");
        divColuna.innerHTML = `
            <p>${column.name}</p>
            <p>${column.type.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK → " + column.reference?.table + ", " + column.reference?.column : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO INCREMENT" : ""}</p>
        `;
        divLinha.appendChild(divColuna);
    });
    const headerActions = document.createElement("div");
    headerActions.innerHTML = "<p>Ações</p>";
    divLinha.appendChild(headerActions);
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
        const rowActions = document.createElement("div");
        rowActions.innerHTML = `
            <button onclick="abrirFechar(false, 'editar-linha')">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-pencil"></use></svg>
            </button>
            <button>
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>
            </button>
        `;
        divLinha.appendChild(rowActions);
        document.getElementById("tabela-selecionada-tabela").appendChild(divLinha);
    });
}
// central menus
function changeAlterarColunasMenu() {
    if (currentDatabase === null)
        return;
    const menu = document.getElementById("lista-colunas-existentes");
    menu.innerHTML = "";
    if (currentTable === null) {
        menu.innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        return;
    }
    else if (Object.keys(databases[currentDatabase].tables[currentTable].columns).length === 0) {
        menu.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }
    Object.values(databases[currentDatabase].tables[currentTable].columns).forEach((column) => {
        menu.innerHTML += `
            <div class="item-lista-colunas-existentes">
                <div>
                    <h3>${column.name}</h3>
                    <p>${column.type.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}</p>
                </div>
                <button class="delete-column" onclick="deleteColumnInterface(this)">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>
                </button>
            </div>
        `;
    });
}
//#endregion
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
