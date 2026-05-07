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
window.addEventListener('load', () => updateInterfaceTerminalIndicator(buttonChangeToGraficalInterface));
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
function createTimeValue(hours, minutes = 0, seconds = 0) {
    const d = new Date();
    d.setHours(hours, minutes, seconds, 0);
    return d;
}
function createExempleDatabase() {
    const databaseName = "thifre_db";
    if (databases[databaseName]) {
        currentDatabase = databaseName;
        currentTable = Object.keys(databases[databaseName].tables)[0] ?? null;
        refreshUI();
        changeEditColumnsMenu();
        changeAddRowMenu();
        openNotifications("<p style='color: var(--yellow5)'>A database de exemplo ja existe e foi selecionada.</p>");
        return;
    }
    createDatabase(new Database(databaseName));
    const usuarios = new Table("usuarios");
    usuarios.columns["id"] = new Column("id", "integer", true, false, true, true, true, false);
    usuarios.columns["nome"] = new Column("nome", "text", false, false, true, false, false, false);
    usuarios.columns["email"] = new Column("email", "text", false, false, true, true, false, false);
    usuarios.columns["ativo"] = new Column("ativo", "boolean", false, false, false, false, false, true);
    usuarios.columns["ativo"].defaultValue = true;
    usuarios.columns["nota"] = new Column("nota", "float", false, false, false, false, false, true);
    usuarios.columns["nota"].defaultValue = 0;
    usuarios.columns["criado_em"] = new Column("criado_em", "date", false, false, true, false, false, false, true, false);
    usuarios.columns["hora_entrada"] = new Column("hora_entrada", "time", false, false, false, false, false, true, false, false);
    usuarios.columns["hora_entrada"].defaultValue = "09:00";
    usuarios.columns["perfil"] = new Column("perfil", "enum", false, false, true, false, false, true, false, false, ["admin", "editor", "leitor"]);
    usuarios.columns["perfil"].defaultValue = "leitor";
    createTable(usuarios);
    const idColumn = usuarios.columns["id"];
    addRow("usuarios", {
        id: idColumn.increment(),
        nome: "Alice",
        email: "alice@email.com",
        ativo: true,
        nota: 9.5,
        criado_em: new Date("2026-01-10"),
        hora_entrada: createTimeValue(8, 30),
        perfil: "admin"
    });
    addRow("usuarios", {
        id: idColumn.increment(),
        nome: "Bruno",
        email: "bruno@email.com",
        ativo: false,
        nota: 7.2,
        criado_em: new Date("2026-02-02"),
        hora_entrada: createTimeValue(9, 15),
        perfil: "editor"
    });
    addRow("usuarios", {
        id: idColumn.increment(),
        nome: "Carla",
        email: "carla@email.com",
        ativo: true,
        nota: 8.8,
        criado_em: new Date("2026-03-15"),
        hora_entrada: createTimeValue(10, 0),
        perfil: "leitor"
    });
    const posts = new Table("posts");
    posts.columns["id"] = new Column("id", "integer", true, false, true, true, true, false);
    posts.columns["usuario_id"] = new Column("usuario_id", "integer", false, true, true, false, false, false, false, false, undefined, { table: "usuarios", column: "id" });
    posts.columns["titulo"] = new Column("titulo", "text", false, false, true, false, false, false);
    posts.columns["conteudo"] = new Column("conteudo", "text", false, false, false, false, false, false);
    posts.columns["publicado"] = new Column("publicado", "boolean", false, false, false, false, false, true);
    posts.columns["publicado"].defaultValue = false;
    posts.columns["avaliacao"] = new Column("avaliacao", "float", false, false, false, false, false, true);
    posts.columns["avaliacao"].defaultValue = 0;
    posts.columns["status"] = new Column("status", "enum", false, false, true, false, false, true, false, false, ["rascunho", "publicado", "arquivado"]);
    posts.columns["status"].defaultValue = "rascunho";
    posts.columns["publicado_em"] = new Column("publicado_em", "date", false, false, false, false, false, false, false, false);
    createTable(posts);
    const postIdColumn = posts.columns["id"];
    addRow("posts", {
        id: postIdColumn.increment(),
        usuario_id: 1,
        titulo: "Primeiro post",
        conteudo: "Exemplo de conteudo com todos os tipos.",
        publicado: true,
        avaliacao: 8.9,
        status: "publicado",
        publicado_em: new Date("2026-04-01")
    });
    addRow("posts", {
        id: postIdColumn.increment(),
        usuario_id: 2,
        titulo: "Rascunho do Bruno",
        conteudo: "Ainda em andamento.",
        publicado: false,
        avaliacao: 0,
        status: "rascunho",
        publicado_em: null
    });
    const auditoria = new Table("auditoria");
    auditoria.columns["id"] = new Column("id", "integer", true, false, true, true, true, false);
    auditoria.columns["entidade"] = new Column("entidade", "text", false, false, true, false, false, false);
    auditoria.columns["entidade_id"] = new Column("entidade_id", "integer", false, false, true, false, false, false);
    auditoria.columns["acao"] = new Column("acao", "enum", false, false, true, false, false, false, false, false, ["INSERT", "UPDATE", "DELETE"]);
    auditoria.columns["sucesso"] = new Column("sucesso", "boolean", false, false, true, false, false, true);
    auditoria.columns["sucesso"].defaultValue = true;
    auditoria.columns["feito_em"] = new Column("feito_em", "date", false, false, true, false, false, false, true, false);
    createTable(auditoria);
    const auditIdColumn = auditoria.columns["id"];
    addRow("auditoria", {
        id: auditIdColumn.increment(),
        entidade: "usuarios",
        entidade_id: 1,
        acao: "INSERT",
        sucesso: true,
        feito_em: new Date("2026-04-20")
    });
    addRow("auditoria", {
        id: auditIdColumn.increment(),
        entidade: "posts",
        entidade_id: 1,
        acao: "UPDATE",
        sucesso: true,
        feito_em: new Date("2026-04-22")
    });
    const tarefas = new Table("tarefas");
    tarefas.columns["id"] = new Column("id", "integer", true, false, true, true, true, false);
    tarefas.columns["titulo"] = new Column("titulo", "text", false, false, true, false, false, false);
    tarefas.columns["concluida"] = new Column("concluida", "boolean", false, false, false, false, false, true);
    tarefas.columns["concluida"].defaultValue = false;
    createTable(tarefas);
    const tarefaIdColumn = tarefas.columns["id"];
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Arrumar a mesa", concluida: true });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Responder mensagens", concluida: false });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Revisar o código", concluida: true });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Fazer backup", concluida: false });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Atualizar a documentação", concluida: true });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Testar o build", concluida: true });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Organizar imagens", concluida: false });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Separar ideias novas", concluida: false });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Revisar layout", concluida: true });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Limpar rascunhos", concluida: false });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Publicar atualização", concluida: false });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Conferir links", concluida: true });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Escrever resumo", concluida: false });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Rever cores", concluida: true });
    addRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Fechar pendências", concluida: false });
    currentTable = null;
    refreshUI();
    changeEditColumnsMenu();
    changeAddRowMenu();
    openNotifications("<p style='color: var(--green5)'>Database de exemplo criada com sucesso!</p>");
}
// #endregion
// #region Custom dropdowns
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
function onDropdownChange(dropdown) {
    if (dropdown.querySelector('input[name="column-type"]')) {
        const container = dropdown.closest("div").parentElement;
        updateCharacteristics(container);
        updateDefaultInput(container);
    }
    if (dropdown.querySelector('input[name="reference-table"]')) {
        const container = dropdown.closest("div").parentElement;
        updateForeignKeyReferenceColumnOptions(container);
    }
}
updateCustomDropdowns();
// #endregion
// #region classes and variables
class Database {
    constructor(name) {
        this.name = name;
        this.tables = {};
        this.foreignKeyMap = {};
    }
    getTableForeignKeys(tableName) {
        const table = this.tables[tableName];
        const foreignKeys = [];
        if (!table)
            return foreignKeys;
        for (const columnName in table.columns) {
            const column = table.columns[columnName];
            if (!column.reference)
                continue;
            foreignKeys.push({
                column: columnName,
                referenceTable: column.reference.table,
                referenceColumn: column.reference.column
            });
        }
        return foreignKeys;
    }
    getReferencesToTable(tableName) {
        return this.foreignKeyMap[tableName] || {};
    }
    registerForeignKey(fromTable, fromColumn, toTable, toColumn) {
        if (!this.foreignKeyMap[toTable]) {
            this.foreignKeyMap[toTable] = {};
        }
        if (!this.foreignKeyMap[toTable][toColumn]) {
            this.foreignKeyMap[toTable][toColumn] = [];
        }
        this.foreignKeyMap[toTable][toColumn].push({
            table: fromTable,
            column: fromColumn
        });
    }
    unregisterForeignKey(fromTable, fromColumn, toTable, toColumn) {
        const refs = this.foreignKeyMap[toTable]?.[toColumn];
        if (!refs)
            return;
        this.foreignKeyMap[toTable][toColumn] = refs.filter(ref => !(ref.table === fromTable && ref.column === fromColumn));
        if (this.foreignKeyMap[toTable][toColumn].length === 0) {
            delete this.foreignKeyMap[toTable][toColumn];
        }
        if (Object.keys(this.foreignKeyMap[toTable]).length === 0) {
            delete this.foreignKeyMap[toTable];
        }
    }
    getTableRelationships(tableName) {
        return {
            outgoing: this.getTableForeignKeys(tableName),
            incoming: this.getReferencesToTable(tableName)
        };
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
    constructor(name, type, isPrimaryKey = false, isForeignKey = false, isNotNull = false, isUnique = false, isAutoIncrement = false, hasDefault = false, isAutoDate = false, isAutoTime = false, enumValues, reference) {
        this.incrementCounter = 1;
        this.name = name;
        this.type = type;
        this.isPrimaryKey = isPrimaryKey;
        this.isForeignKey = isForeignKey;
        this.isNotNull = isNotNull;
        this.isUnique = isUnique;
        this.isAutoIncrement = isAutoIncrement;
        this.hasDefault = hasDefault;
        this.isAutoDate = isAutoDate;
        this.isAutoTime = isAutoTime;
        this.enumValues = enumValues;
        this.reference = reference;
    }
    increment() {
        if (!this.isAutoIncrement) {
            throw new Error("Column is not auto increment");
        }
        return this.incrementCounter++;
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
    currentTable = null;
    refreshUI();
}
function createTable(table) {
    const db = databases[currentDatabase];
    for (const columnName in table.columns) {
        table.indexes[columnName] = new Map();
    }
    for (const columnName in table.columns) {
        const column = table.columns[columnName];
        if (!column.reference)
            continue;
        db.registerForeignKey(table.name, columnName, column.reference.table, column.reference.column);
    }
    db.tables[table.name] = table;
    currentTable = table.name;
    refreshUI();
}
function addColumn(tableName, column) {
    databases[currentDatabase].tables[tableName].columns[column.name] = column;
    databases[currentDatabase].tables[tableName].indexes[column.name] = new Map();
    if (column.reference) {
        databases[currentDatabase].registerForeignKey(tableName, column.name, column.reference.table, column.reference.column);
    }
    refreshUI();
}
function addRow(tableName, row) {
    const table = databases[currentDatabase].tables[tableName];
    const rowIndex = table.rows.length;
    table.rows.push(row);
    for (const col in table.indexes) {
        const value = row[col];
        if (!table.indexes[col].has(value)) {
            table.indexes[col].set(value, []);
        }
        table.indexes[col].get(value).push(rowIndex);
    }
    refreshUI();
}
function editRow(tableName, oldRowIndex, newRow) {
    const table = databases[currentDatabase].tables[tableName];
    const oldRow = table.rows[oldRowIndex];
    for (const col in table.indexes) {
        const oldValue = oldRow[col];
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
        const newValue = newRow[col];
        const indexMap = table.indexes[col];
        if (!indexMap.has(newValue)) {
            indexMap.set(newValue, []);
        }
        indexMap.get(newValue).push(oldRowIndex);
    }
    refreshUI();
}
function deleteDatabase(databaseName) {
    delete databases[databaseName];
    if (currentDatabase === databaseName) {
        currentDatabase = null;
        currentTable = null;
    }
    refreshUI();
}
function deleteTable(tableName) {
    const db = databases[currentDatabase];
    const table = db.tables[tableName];
    // 🧹 remove todas as FKs QUE SAEM dessa tabela
    for (const column of Object.values(table.columns)) {
        if (!column.reference)
            continue;
        db.unregisterForeignKey(tableName, column.name, column.reference.table, column.reference.column);
    }
    delete db.tables[tableName];
    if (currentTable === tableName) {
        currentTable = null;
    }
    refreshUI();
}
function deleteColumn(tableName, columnName) {
    const db = databases[currentDatabase];
    const table = db.tables[tableName];
    const column = table.columns[columnName];
    if (column.reference) {
        db.unregisterForeignKey(tableName, columnName, column.reference.table, column.reference.column);
    }
    table.indexes[columnName]?.clear();
    delete table.indexes[columnName];
    for (const row of table.rows) {
        delete row[columnName];
    }
    delete table.columns[columnName];
    refreshUI();
}
function deleteRow(tableName, rowIndex) {
    const table = databases[currentDatabase].tables[tableName];
    const row = table.rows[rowIndex];
    for (const col in table.indexes) {
        const value = row[col];
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
    const parsedColumns = parseColumnsFromInputs(columnsUl.children, table.columns);
    if (parsedColumns === null)
        return;
    for (const column of parsedColumns) {
        table.columns[column.name] = column;
    }
    createTable(table);
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl);
    tableNameInput.value = "";
    openNotifications(`<p style='color: var(--green5)'>Tabela "${tableName}" criada com sucesso!</p>`);
}
function addColumnsInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    }
    const columnsUl = document.querySelector("#editar-colunas ul#criacao-colunas-edit");
    const table = databases[currentDatabase].tables[currentTable];
    const columnsToAdd = parseColumnsFromInputs(columnsUl.children, table.columns);
    if (columnsToAdd === null)
        return;
    for (const column of columnsToAdd) {
        const columnName = column.name;
        if (column.isAutoIncrement) {
            table.rows.forEach((row) => {
                row[columnName] = column.increment();
            });
            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row[columnName];
                table.indexes[columnName].set(value, [index]);
            });
        }
        else if (column.hasDefault) {
            table.rows.forEach((row) => {
                row[columnName] = column.defaultValue;
            });
            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row[columnName];
                table.indexes[columnName].set(value, (table.indexes[columnName].get(value) || []).concat(index));
            });
        }
        else if (column.isAutoDate || column.isAutoTime) {
            table.rows.forEach((row) => {
                row[columnName] = new Date();
            });
            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row[columnName];
                table.indexes[columnName].set(value, (table.indexes[columnName].get(value) || []).concat(index));
            });
        }
        else {
            table.rows.forEach((row) => {
                row[columnName] = null;
            });
            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row[columnName];
                table.indexes[columnName].set(value, (table.indexes[columnName].get(value) || []).concat(index));
            });
        }
    }
    for (const column of columnsToAdd) {
        addColumn(table.name, column);
    }
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl);
    changeEditColumnsMenu();
    openNotifications(`<p style='color: var(--green5)'>Colunas adicionadas com sucesso!</p>`);
}
function insertRowInterface() {
    function revertAutoIncrementValues() {
        for (const { column, value } of valuesBeforeIncrement) {
            const col = table.columns[column];
            if (col.isAutoIncrement) {
                col.incrementCounter = value;
            }
        }
    }
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    }
    else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    }
    else if (Object.keys(databases[currentDatabase].tables[currentTable].columns).length === 0) {
        openNotifications("<p style='color: var(--red5)'>Não há colunas nessa tabela</p>");
        return;
    }
    let valuesBeforeIncrement = [];
    const table = databases[currentDatabase].tables[currentTable];
    const rowUl = document.querySelector("#inserir-linha ul#colunas-inserir-linha");
    const row = {};
    for (const column of rowUl.children) {
        const columnName = column.querySelector("h3").textContent;
        if (table.columns[columnName].isAutoIncrement) {
            let valueBeforeIncrement = table.columns[columnName].increment();
            valuesBeforeIncrement.push({ column: columnName, value: valueBeforeIncrement });
            row[columnName] = valueBeforeIncrement;
            continue;
        }
        if (table.columns[columnName].type === "boolean") {
            const value = column.querySelector(".custom-dropdown button").textContent;
            if (table.columns[columnName].isUnique && table.indexes[columnName].has(value === "True")) {
                openNotifications(`<p style='color: var(--red5)'>O valor "${value}" já existe para a coluna "${columnName}".</p>`);
                revertAutoIncrementValues();
                return;
            }
            row[columnName] = value === "True";
            continue;
        }
        if (table.columns[columnName].isAutoDate || table.columns[columnName].isAutoTime) {
            row[columnName] = new Date();
            continue;
        }
        const input = column.querySelector("input");
        if (table.columns[columnName].isUnique && table.indexes[columnName].has(input.value)) {
            openNotifications(`<p style='color: var(--red5)'>O valor "${input.value}" já existe para a coluna "${columnName}".</p>`);
            revertAutoIncrementValues();
            return;
        }
        if (input.value.trim() === "") {
            if (table.columns[columnName].isNotNull) {
                openNotifications(`<p style='color: var(--red5)'>A coluna "${columnName}" não pode ser nula.</p>`);
                revertAutoIncrementValues();
                return;
            }
            if (table.columns[columnName].hasDefault) {
                row[columnName] = table.columns[columnName].defaultValue;
            }
            else {
                row[columnName] = null;
            }
            continue;
        }
        if (table.columns[columnName].type === "integer") {
            row[columnName] = parseInt(input.value);
        }
        else if (table.columns[columnName].type === "float") {
            row[columnName] = parseFloat(input.value);
        }
        else if (table.columns[columnName].type === "date") {
            row[columnName] = new Date(input.value + "T00:00:00");
        }
        else if (table.columns[columnName].type === "time") {
            const [hora, minuto, segundo] = input.value.split(":").map(Number);
            const data = new Date();
            data.setHours(hora, minuto, segundo, 0);
            row[columnName] = data;
        }
        else {
            row[columnName] = input.value;
        }
    }
    addRow(currentTable, row);
    changeAddRowMenu();
    openNotifications(`<p style='color: var(--green5)'>Linha inserida com sucesso!</p>`);
}
function editRowInterface(rowIndex) {
    if (Object.keys(databases[currentDatabase].tables[currentTable].columns).length === 0) {
        openNotifications("<p style='color: var(--red5)'>Não há colunas nessa tabela</p>");
        return;
    }
    const table = databases[currentDatabase].tables[currentTable];
    const rowUl = document.querySelector("#editar-linha ul#colunas-editar-linha");
    const row = {};
    for (const column of rowUl.children) {
        const columnName = column.querySelector("h3").textContent;
        if (table.columns[columnName].isAutoIncrement) {
            row[columnName] = table.rows[rowIndex][columnName];
        }
        else if (table.columns[columnName].isAutoDate || table.columns[columnName].isAutoTime) {
            row[columnName] = table.rows[rowIndex][columnName];
        }
        else if (table.columns[columnName].type === "boolean") {
            const value = document.querySelector(".custom-dropdown button").textContent;
            row[columnName] = value === "True";
        }
        else {
            const input = column.querySelector("input");
            if (input.value.trim() === "") {
                row[columnName] = null;
                continue;
            }
            if (table.columns[columnName].type === "integer") {
                row[columnName] = parseInt(input.value);
            }
            else if (table.columns[columnName].type === "float") {
                row[columnName] = parseFloat(input.value);
            }
            else if (table.columns[columnName].type === "date") {
                row[columnName] = new Date(input.value + "T00:00:00");
            }
            else if (table.columns[columnName].type === "time") {
                const [hora, minuto, segundo] = input.value.split(":").map(Number);
                const data = new Date();
                data.setHours(hora, minuto, segundo, 0);
                row[columnName] = data;
            }
            else {
                row[columnName] = input.value;
            }
        }
    }
    editRow(currentTable, rowIndex, row);
    changeEditRowMenu(rowIndex);
    openNotifications(`<p style='color: var(--green5)'>Linha editada com sucesso!</p>`);
}
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
    const db = databases[currentDatabase];
    const newName = databaseNameInput.value.trim().toLowerCase();
    if (newName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da database não pode ser vazio.</p>");
    }
    else if (databases[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma database com esse nome.</p>");
    }
    else {
        delete databases[currentDatabase];
        db.name = newName;
        databases[newName] = db;
        currentDatabase = newName;
        openNotifications("<p style='color: var(--green5)'>Database renomeada com sucesso!</p>");
    }
    updateCustomDropdowns();
    changeDatabaseDropdown();
}
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
    const table = databases[currentDatabase].tables[currentTable];
    const newName = tableNameInput.value.trim().toLowerCase();
    if (newName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não pode ser vazio.</p>");
    }
    else if (databases[currentDatabase].tables[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma tabela com esse nome.</p>");
    }
    else {
        delete databases[currentDatabase].tables[currentTable];
        table.name = newName;
        databases[currentDatabase].tables[newName] = table;
        currentTable = newName;
        openNotifications("<p style='color: var(--green5)'>Tabela renomeada com sucesso!</p>");
    }
    refreshUI();
}
// Other interface functions
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
    const options = ["Text", "Integer", "Float", "Boolean", "Date", "Time", "Enum"];
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
        { className: "auto-date", name: "auto-date", label: "Auto date", hidden: true },
        { className: "auto-time", name: "auto-time", label: "Auto time", hidden: true }
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
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(char.label));
        characteristics.appendChild(label);
    });
    // Delete column button
    const deleteDiv = document.createElement("div");
    deleteDiv.className = "last-item-flex-wrap-div trash-icon";
    deleteDiv.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>';
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
    // Tabela de referência
    const refTableCustomDropdown = document.createElement("div");
    refTableCustomDropdown.className = "custom-dropdown";
    const refTableButton = document.createElement("button");
    refTableButton.className = "custom-dropdown-trigger";
    refTableButton.textContent = "Crie outra tabela";
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
    refColumnButton.textContent = "Crie outra coluna";
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
    // Enum values input
    const enumDiv = document.createElement("div");
    enumDiv.classList.add("enum-values", "post-characteristics");
    enumDiv.style.display = "none";
    const enumP = document.createElement("p");
    enumP.textContent = "Valores do enum (separados por vírgula)";
    enumDiv.appendChild(enumP);
    const enumInput = document.createElement("input");
    enumInput.type = "text";
    enumInput.placeholder = "Valores separados por vírgula";
    enumInput.classList.add("menu-central-input");
    enumDiv.appendChild(enumInput);
    mainDiv.appendChild(enumDiv);
    parent.appendChild(mainDiv);
    updateCustomDropdowns();
}
function deleteColumnCreationDiv(button) {
    const div = button.parentElement.parentElement;
    div.remove();
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
        if (database === currentDatabase)
            option.classList.add("custom-dropdown-option-selected");
        option.textContent = database;
        menu.appendChild(option);
    }
    updateCustomDropdowns();
}
function changeTabelasLista() {
    const tabelasLista = document.getElementById("tabelas-lista");
    tabelasLista.innerHTML = "";
    if (currentDatabase === null)
        return;
    for (let tabela in databases[currentDatabase].tables) {
        const option = document.createElement("div");
        if (tabela === currentTable) {
            option.classList.add("tabela", "tabela-ativa");
        }
        else {
            option.classList.add("tabela");
        }
        option.addEventListener("click", () => {
            currentTable = tabela;
            tabelasLista.querySelector(".tabela-ativa")?.classList.remove("tabela-ativa");
            option.classList.add("tabela-ativa");
            refreshUI();
            showHideTabelaSelecionadaLinhaColuna(false);
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
    const table = databases[currentDatabase].tables[currentTable];
    let divLinha = document.createElement("div");
    divLinha.classList.add("linha-tabela");
    Object.values(table.columns).forEach((column) => {
        const divColuna = document.createElement("div");
        divColuna.innerHTML = `
            <p>${column.name}</p>
            <p>${column.type.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK → " + column.reference?.table + ", " + column.reference?.column : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO INCREMENT" : ""}</p>
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
        Object.entries(row).forEach(([colName, value]) => {
            const divCelula = document.createElement("div");
            let displayValue = value;
            const column = table.columns[colName];
            if (column && column.type === "date" && value !== null) {
                let d = null;
                if (value instanceof Date)
                    d = value;
                else if (typeof value === "number")
                    d = new Date(value);
                else if (typeof value === "string")
                    d = new Date(value);
                if (d && !isNaN(d.getTime())) {
                    const day = String(d.getDate()).padStart(2, "0");
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const year = d.getFullYear();
                    displayValue = `${day}/${month}/${year}`;
                }
            }
            else if (column && column.type === "time" && value !== null) {
                if (value instanceof Date || typeof value === "number") {
                    const d = value instanceof Date ? value : new Date(value);
                    const hours = String(d.getHours()).padStart(2, "0");
                    const minutes = String(d.getMinutes()).padStart(2, "0");
                    const seconds = String(d.getSeconds()).padStart(2, "0");
                    displayValue = `${hours}:${minutes}:${seconds}`;
                }
                else if (typeof value === "string") {
                    displayValue = value;
                }
            }
            else if (value instanceof Date) {
                const day = String(value.getDate()).padStart(2, "0");
                const month = String(value.getMonth() + 1).padStart(2, "0");
                const year = value.getFullYear();
                displayValue = `${day}/${month}/${year}`;
            }
            divCelula.innerHTML = `<p>${displayValue}</p>`;
            divLinha.appendChild(divCelula);
        });
        const rowActions = document.createElement("div");
        rowActions.innerHTML = `
            <button onclick="abrirFechar(false, 'editar-linha'); changeEditRowMenu(${index})">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-pencil"></use></svg>
            </button>
            <button onclick="abrirFechar(false, 'confirmar-deletar'); changeConfirmDeleteMenu('row', ${index}, undefined)">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>
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
function changeTabelaInfoVariosBotoes() {
    if (currentDatabase === null) {
        const tabelaInfo = document.getElementById("tabela-info-varios-botoes");
        tabelaInfo.querySelector("#nome-tabela").textContent = "Nenhuma tabela selecionada";
        tabelaInfo.querySelector("#linhas-colunas").textContent = "0 linhas • 0 colunas";
    }
    else if (currentTable === null) {
        const tabelaInfo = document.getElementById("tabela-info-varios-botoes");
        tabelaInfo.querySelector("#nome-tabela").textContent = "Nenhuma tabela selecionada";
        tabelaInfo.querySelector("#linhas-colunas").textContent = "0 linhas • 0 colunas";
    }
    else {
        const tabelaInfo = document.getElementById("tabela-info-varios-botoes");
        tabelaInfo.querySelector("#nome-tabela").textContent = currentTable;
        tabelaInfo.querySelector("#linhas-colunas").textContent = `${Object.keys(databases[currentDatabase].tables[currentTable].rows).length} linhas • ${Object.keys(databases[currentDatabase].tables[currentTable].columns).length} colunas`;
    }
}
function parseColumnsFromInputs(columns, existingColumns) {
    const parsedColumns = [];
    const knownColumns = new Set(Object.keys(existingColumns));
    for (const columnDiv of columns) {
        const columnNameInput = columnDiv.querySelector("input[type='text']");
        const columnName = columnNameInput.value.trim().toLowerCase();
        if (columnName === "") {
            openNotifications("<p style='color: var(--red5)'>O nome da coluna não pode ser vazio.</p>");
            return null;
        }
        else if (knownColumns.has(columnName)) {
            openNotifications("<p style='color: var(--red5)'>Já existe uma coluna com esse nome.</p>");
            return null;
        }
        const columnTypeElement = columnDiv.querySelector(".custom-dropdown-trigger");
        const isPrimaryKey = columnDiv.querySelector(".primary-key");
        const isForeignKey = columnDiv.querySelector(".foreign-key");
        const isNotNull = columnDiv.querySelector(".not-null");
        const isUnique = columnDiv.querySelector(".unique");
        const hasDefault = columnDiv.querySelector(".default");
        const isAutoIncrement = columnDiv.querySelector(".auto-increment");
        const isAutoDate = columnDiv.querySelector(".auto-date");
        const isAutoTime = columnDiv.querySelector(".auto-time");
        const column = new Column(columnName, columnTypeElement.textContent.toLowerCase(), isPrimaryKey.checked, isForeignKey.checked, isNotNull.checked, isUnique.checked, isAutoIncrement.checked, hasDefault.checked, isAutoDate.checked, isAutoTime.checked);
        if (hasDefault.checked) {
            const defaultValue = columnDiv.querySelector(".default-input-text input");
            if (defaultValue.value.trim() === "") {
                openNotifications("<p style='color: var(--red5)'>O valor padrão não pode ser vazio.</p>");
                return null;
            }
            if (column.type === "integer") {
                column.defaultValue = parseInt(defaultValue.value);
            }
            else if (column.type === "float") {
                column.defaultValue = parseFloat(defaultValue.value);
            }
            else if (column.type === "boolean") {
                const boolValue = columnDiv.querySelector(".default-input-text .custom-dropdown-trigger");
                column.defaultValue = boolValue.textContent === "True";
            }
            else if (column.type === "date") {
                column.defaultValue = new Date(defaultValue.value);
            }
            else if (column.type === "time") {
                const [hours, minutes, seconds] = defaultValue.value.split(":").map(Number);
                column.defaultValue = createTimeValue(hours, minutes || 0, seconds || 0);
            }
            else {
                column.defaultValue = defaultValue.value;
            }
        }
        if (columnTypeElement.textContent === "Enum") {
            const enumValuesInput = columnDiv.querySelector(".enum-values input");
            column.enumValues = [...new Set(enumValuesInput.value.split(",").map((v) => v.trim()))];
        }
        if (column.isForeignKey) {
            const referenceTableElement = columnDiv.querySelector(".referencia .custom-dropdown:nth-child(2) .custom-dropdown-trigger");
            const referenceColumnElement = columnDiv.querySelector(".referencia .custom-dropdown:nth-child(3) .custom-dropdown-trigger");
            if (referenceTableElement.textContent === "Crie outra tabela" || referenceColumnElement.textContent === "Crie outra coluna") {
                openNotifications("<p style='color: var(--red5)'>Selecione a tabela e coluna de referência para a chave estrangeira.</p>");
                return null;
            }
            column.reference = {
                table: referenceTableElement.textContent,
                column: referenceColumnElement.textContent
            };
        }
        knownColumns.add(columnName);
        parsedColumns.push(column);
    }
    return parsedColumns;
}
function showHideTabelaSelecionadaLinhaColuna(shouldShow) {
    const tabelaSelecionadaLinhaColuna = document.getElementById("tabela-selecionada-linha-coluna");
    tabelaSelecionadaLinhaColuna.style.display = shouldShow ? "flex" : "none";
}
function changeTabelaSelecionadaLinhaColuna(type, rowIndex, columnName) {
    const tabelaSelecionadaLinhaColuna = document.getElementById("tabela-selecionada-linha-coluna");
    const header = tabelaSelecionadaLinhaColuna.querySelector("#tabela-selecionada-linha-coluna-header h3");
    header.textContent = type === "row" ? "Linha" : "Coluna";
    const lineColumnsNumber = tabelaSelecionadaLinhaColuna.querySelector("h4");
    lineColumnsNumber.textContent = type === "row" ? `${Object.keys(databases[currentDatabase].tables[currentTable].columns).length} colunas` : `${Object.keys(databases[currentDatabase].tables[currentTable].rows).length} linhas`;
    const ul = tabelaSelecionadaLinhaColuna.querySelector("ul");
    ul.innerHTML = "";
    if (type === "row") {
        for (const columnName in databases[currentDatabase].tables[currentTable].columns) {
            const div = document.createElement("div");
            const columnType = databases[currentDatabase].tables[currentTable].columns[columnName].type;
            const value = databases[currentDatabase].tables[currentTable].rows[rowIndex][columnName];
            div.innerHTML = `
                <h5>${columnName} (${columnType})</h5>
                <p>${columnType === "date" ? new Date(value).toLocaleDateString() : columnType === "time" ? new Date(value).toLocaleTimeString() : value}</p>
            `;
            ul.appendChild(div);
        }
    }
    else {
        for (let i = 0; i < databases[currentDatabase].tables[currentTable].rows.length; i++) {
            const div = document.createElement("div");
            const value = databases[currentDatabase].tables[currentTable].rows[i][columnName];
            const columnType = databases[currentDatabase].tables[currentTable].columns[columnName].type.toLocaleLowerCase();
            div.innerHTML = `
                <h5>Linha ${i + 1}</h5>
                <p>${columnType === "date" ? new Date(value).toLocaleDateString() : columnType === "time" ? new Date(value).toLocaleTimeString() : value}</p>
            `;
            ul.appendChild(div);
        }
    }
}
function refreshUI() {
    changeDatabaseDropdown();
    changeTabelasLista();
    changeTabelaSelecionadaTabela();
    changeTabelaInfoVariosBotoes();
}
// central menus
function changeConfigurarDatabaseMenu() {
    const menu = document.getElementById("configurar-database");
    if (currentDatabase === null) {
        menu.querySelector("input").value = "";
        return;
    }
    menu.querySelector("input").value = currentDatabase;
}
function changeConfigurarTabelaMenu() {
    const menu = document.getElementById("configurar-tabela");
    if (currentDatabase === null || currentTable === null) {
        menu.querySelector("input").value = "";
        return;
    }
    menu.querySelector("input").value = currentTable;
}
function changeEditColumnsMenu() {
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
        const mainDiv = document.createElement("div");
        mainDiv.className = "outlined menu-central-justify-between";
        const secondaryDiv = document.createElement("div");
        mainDiv.appendChild(secondaryDiv);
        // Input de nome da coluna
        const columnNameH3 = document.createElement("h3");
        columnNameH3.classList.add("text2");
        columnNameH3.textContent = column.name;
        secondaryDiv.appendChild(columnNameH3);
        // Dropdown customizado
        const columnTypeH4 = document.createElement("h4");
        columnTypeH4.classList.add("text2");
        columnTypeH4.textContent = column.type.charAt(0).toUpperCase() + column.type.slice(1);
        secondaryDiv.appendChild(columnTypeH4);
        // Characteristics
        const characteristics = document.createElement("div");
        const characteristicsList = [
            { key: "isPrimaryKey", label: "Primary key" },
            { key: "isForeignKey", label: "Foreign key" },
            { key: "isNotNull", label: "Not null" },
            { key: "isUnique", label: "Unique" },
            { key: "hasDefault", label: "Default" },
            { key: "isAutoIncrement", label: "Auto increment" },
            { key: "isAutoDate", label: "Auto date" },
            { key: "isAutoTime", label: "Auto time" }
        ];
        const p = document.createElement("p");
        p.classList.add("text3");
        p.style.color = "var(--gray6)";
        characteristicsList.forEach((char) => {
            if (Boolean(column[char.key])) {
                if (char.key === "isForeignKey") {
                    p.textContent += "FK → " + column.reference?.table + ", " + column.reference?.column + " • ";
                }
                else if (char.key === "isPrimaryKey") {
                    p.textContent += "PK • ";
                }
                else {
                    p.textContent += char.label.toUpperCase() + " • ";
                }
                characteristics.appendChild(p);
            }
        });
        p.textContent = p.textContent.slice(0, -3);
        secondaryDiv.appendChild(characteristics);
        // Delete column button
        const deleteDiv = document.createElement("div");
        deleteDiv.className = "last-item-flex-wrap-div trash-icon";
        deleteDiv.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>';
        deleteDiv.onclick = function () { abrirFechar(false, "confirmar-deletar"); changeConfirmDeleteMenu("column", undefined, column.name); };
        mainDiv.appendChild(deleteDiv);
        menu.appendChild(mainDiv);
        updateCustomDropdowns();
    });
    updateCustomDropdowns();
}
function changeAddRowMenu() {
    if (currentDatabase === null)
        return;
    const menuUl = document.querySelector("#colunas-inserir-linha");
    menuUl.innerHTML = "";
    if (currentTable === null) {
        menuUl.innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        return;
    }
    else if (Object.keys(databases[currentDatabase].tables[currentTable].columns).length === 0) {
        menuUl.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }
    Object.values(databases[currentDatabase].tables[currentTable].columns).forEach((column) => {
        const div = document.createElement("div");
        menuUl.appendChild(div);
        const h3 = document.createElement("h3");
        h3.textContent = column.name;
        div.appendChild(h3);
        const p = document.createElement("p");
        p.textContent = `(${column.type.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})`;
        div.appendChild(p);
        if (column.isAutoIncrement) {
            const p = document.createElement("p");
            p.textContent = "Valor gerado automaticamente";
            div.appendChild(p);
        }
        else if (column.type === "integer" || column.type === "float") {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "number";
            input.step = "any";
            div.appendChild(input);
        }
        else if (column.type === "boolean") {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            dropdown.innerHTML = `
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                False
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option custom-dropdown-option-selected">False</li>
                <li class="custom-dropdown-option">True</li>
            </ul>
            <input type="hidden" value="text">
            `;
            div.appendChild(dropdown);
            updateCustomDropdowns();
        }
        else if (column.type === "date") {
            if (column.isAutoDate) {
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
        else if (column.type === "time") {
            if (column.isAutoTime) {
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
        else if (column.type === "enum") {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            const button = document.createElement("button");
            button.className = "custom-dropdown-trigger";
            button.textContent = column.enumValues ? column.enumValues[0] : "Selecione um valor";
            button.onclick = function () { openCustomDropdown(button); };
            dropdown.appendChild(button);
            const menu = document.createElement("ul");
            menu.className = "custom-dropdown-menu";
            column.enumValues.forEach((value, index) => {
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
            hiddenInput.value = column.enumValues[0];
            dropdown.appendChild(hiddenInput);
            div.appendChild(dropdown);
            updateCustomDropdowns();
        }
        else {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "text";
            div.appendChild(input);
        }
    });
}
function changeEditRowMenu(rowIndex) {
    if (currentDatabase === null)
        return;
    const menuUl = document.getElementById("colunas-editar-linha");
    menuUl.innerHTML = "";
    if (Object.keys(databases[currentDatabase].tables[currentTable].columns).length === 0) {
        menuUl.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }
    const editButton = menuUl.parentElement.querySelector("button#editar-linha-button");
    editButton.onclick = function () { editRowInterface(rowIndex); };
    Object.values(databases[currentDatabase].tables[currentTable].columns).forEach((column) => {
        const div = document.createElement("div");
        menuUl.appendChild(div);
        const h3 = document.createElement("h3");
        h3.textContent = column.name;
        div.appendChild(h3);
        const p = document.createElement("p");
        p.textContent = `(${column.type.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})`;
        div.appendChild(p);
        if (column.isAutoIncrement) {
            const p = document.createElement("p");
            p.textContent = "Valor gerado automaticamente";
            div.appendChild(p);
        }
        else if (column.type === "integer" || column.type === "float") {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "number";
            input.step = "any";
            input.value = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
            div.appendChild(input);
        }
        else if (column.type === "boolean") {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            dropdown.innerHTML = `
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                ${databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name] ? "True" : "False"}
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option ${databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name] ? '' : 'custom-dropdown-option-selected'}">False</li>
                <li class="custom-dropdown-option ${databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name] ? 'custom-dropdown-option-selected' : ''}">True</li>
            </ul>
            <input type="hidden" value="text">
            `;
            div.appendChild(dropdown);
            updateCustomDropdowns();
        }
        else if (column.type === "date") {
            if (column.isAutoDate) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            }
            else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "date";
                const value = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
                input.value = value instanceof Date ? `${String(value.getFullYear()).padStart(4, "0")}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}` : "";
                div.appendChild(input);
            }
        }
        else if (column.type === "time") {
            if (column.isAutoTime) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            }
            else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "time";
                input.step = "1";
                const value = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
                input.value = value instanceof Date ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}` : "";
                div.appendChild(input);
            }
        }
        else if (column.type === "enum") {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            const button = document.createElement("button");
            button.className = "custom-dropdown-trigger";
            button.textContent = column.enumValues ? databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name] : "Selecione um valor";
            button.onclick = function () { openCustomDropdown(button); };
            dropdown.appendChild(button);
            const menu = document.createElement("ul");
            menu.className = "custom-dropdown-menu";
            column.enumValues.forEach((value, index) => {
                const li = document.createElement("li");
                li.className = "custom-dropdown-option";
                if (index === column.enumValues?.indexOf(databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name])) {
                    li.classList.add("custom-dropdown-option-selected");
                }
                li.textContent = value;
                menu.appendChild(li);
            });
            dropdown.appendChild(menu);
            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "enum-value";
            hiddenInput.value = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
            dropdown.appendChild(hiddenInput);
            div.appendChild(dropdown);
            updateCustomDropdowns();
        }
        else {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            const value = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
            input.value = value;
            div.appendChild(input);
        }
    });
}
function changeSearchMenu() {
    const searchColumnsDiv = document.getElementById("colunas-pesquisa");
    searchColumnsDiv.innerHTML = "";
    const currentTableObj = databases[currentDatabase].tables[currentTable];
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
    Object.values(databases[currentDatabase].tables[currentTable].columns).forEach((column) => {
        const label = document.createElement("label");
        label.classList.add("checkbox-div");
        label.innerHTML += `
        <input type="checkbox" name="search-column" value="${column.name}">
        ${column.name} (${column.type.toUpperCase()})
        `;
        searchColumnsDiv.appendChild(label);
    });
    // Joins
    const referencesDiv = document.querySelector("#references-search");
    referencesDiv.innerHTML = "";
    const currentTableReferences = [];
    for (const columnName in currentTableObj.columns) {
        const column = currentTableObj.columns[columnName];
        if (column.isForeignKey && column.reference) {
            currentTableReferences.push({ columnName, reference: column.reference });
        }
    }
    if (currentTableReferences.length === 0) {
        referencesDiv.innerHTML = "<p>Não há chaves estrangeiras nessa tabela para realizar joins</p>";
    }
    else {
        currentTableReferences.forEach((ref) => {
            const buttonRef = document.createElement("button");
            buttonRef.classList.add("outlined");
            buttonRef.innerHTML = `
            <p class="text2">${ref.columnName} → ${ref.reference.table}, ${ref.reference.column}</p>
            `;
            referencesDiv.appendChild(buttonRef);
        });
    }
    const isReferenceByDiv = document.querySelector("#is-referenced-by-search");
    const referencedBy = [];
    if (referencedBy.length === 0) {
        isReferenceByDiv.innerHTML = "<p>Essa tabela não é referenciada por nenhuma chave estrangeira para realizar joins</p>";
    }
}
function changeConfirmDeleteMenu(type, rowIndex, columnName) {
    const menuUl = document.getElementById("confirmar-deletar-lista");
    menuUl.innerHTML = "";
    if (currentDatabase === null) {
        menuUl.innerHTML = "<p>Nenhuma database selecionada.</p>";
        return;
    }
    else if (currentTable === null && (type === "table" || type === "column" || type === "row")) {
        menuUl.innerHTML = "<p>Nenhuma tabela selecionada.</p>";
        return;
    }
    if (type === "database" || type === "table" || type === "column" || type === "row") {
        menuUl.innerHTML += `
        <div class="outlined">
            <h4 class="text2">Database</h4>
            <div>
                <p class="text3">${currentDatabase}</p>
                <p class="text3">Tabelas: ${Object.keys(databases[currentDatabase].tables).length}</p>
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
                <p class="text3">Colunas: ${Object.keys(databases[currentDatabase].tables[currentTable].columns).length}</p>
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
                <p class="text3">${databases[currentDatabase].tables[currentTable].columns[columnName].name}</p>
                <p class="text3">${databases[currentDatabase].tables[currentTable].columns[columnName].type.toLocaleUpperCase()}</p>
            </div>
        </div>
        `;
    }
    if (type === "row") {
        const row = databases[currentDatabase].tables[currentTable].rows[rowIndex];
        const formattedEntries = Object.entries(row).map(([key, value]) => {
            const column = databases[currentDatabase].tables[currentTable].columns[key];
            let display = value;
            if (column) {
                if (column.type === "date" && value !== null) {
                    let d = null;
                    if (value instanceof Date)
                        d = value;
                    else if (typeof value === "number")
                        d = new Date(value);
                    else if (typeof value === "string")
                        d = new Date(value);
                    if (d && !isNaN(d.getTime())) {
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const year = d.getFullYear();
                        display = `${day}/${month}/${year}`;
                    }
                }
                else if (column.type === "time" && value !== null) {
                    if (value instanceof Date || typeof value === "number") {
                        const d = value instanceof Date ? value : new Date(value);
                        const hours = String(d.getHours()).padStart(2, "0");
                        const minutes = String(d.getMinutes()).padStart(2, "0");
                        const seconds = String(d.getSeconds()).padStart(2, "0");
                        display = `${hours}:${minutes}:${seconds}`;
                    }
                    else if (typeof value === "string") {
                        display = value;
                    }
                }
                else if (value instanceof Date) {
                    const day = String(value.getDate()).padStart(2, "0");
                    const month = String(value.getMonth() + 1).padStart(2, "0");
                    const year = value.getFullYear();
                    display = `${day}/${month}/${year}`;
                }
            }
            else if (value instanceof Date) {
                const day = String(value.getDate()).padStart(2, "0");
                const month = String(value.getMonth() + 1).padStart(2, "0");
                const year = value.getFullYear();
                display = `${day}/${month}/${year}`;
            }
            return `<p class="text3">${key}: ${display}</p>`;
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
            deleteDatabase(currentDatabase);
            openNotifications("<p style='color: var(--green5)'>Database deletada com sucesso!</p>");
        }
        else if (type === "table") {
            const refs = databases[currentDatabase].foreignKeyMap[currentTable];
            if (refs && Object.keys(refs).length > 0) {
                const mensagens = [];
                for (const column in refs) {
                    for (const ref of refs[column]) {
                        mensagens.push(`${ref.table}.${ref.column}`);
                    }
                }
                openNotifications(`<p style='color: var(--red5)'>Não é possível deletar a tabela. Referenciada por:<br>
                    ${mensagens.join("<br>")}
                    </p>`);
                return;
            }
            deleteTable(currentTable);
            openNotifications("<p style='color: var(--green5)'>Tabela deletada com sucesso!</p>");
        }
        else if (type === "column") {
            const refs = databases[currentDatabase].foreignKeyMap[currentTable]?.[columnName];
            if (refs && refs.length > 0) {
                openNotifications(`<p style='color: var(--red5)'>Não é possível deletar a coluna. Referenciada por:<br>
                    ${refs.map(r => `${r.table}.${r.column}`).join("<br>")}
                    </p>`);
                return;
            }
            deleteColumn(currentTable, columnName);
            openNotifications("<p style='color: var(--green5)'>Coluna deletada com sucesso!</p>");
        }
        else if (type === "row") {
            deleteRow(currentTable, rowIndex);
            openNotifications("<p style='color: var(--green5)'>Linha deletada com sucesso!</p>");
        }
        document.getElementById("menus-centrais").style.display = "none";
        document.querySelectorAll("#menus-centrais > div").forEach((m) => {
            const menu = m;
            menu.style.display = "none";
        });
    };
}
function updateCharacteristics(parentDiv) {
    // pegar inputs
    const pkInput = parentDiv.querySelector("input.primary-key");
    const fkInput = parentDiv.querySelector("input.foreign-key");
    const notNullInput = parentDiv.querySelector("input.not-null");
    const uniqueInput = parentDiv.querySelector("input.unique");
    const defaultInput = parentDiv.querySelector("input.default");
    const autoIncInput = parentDiv.querySelector("input.auto-increment");
    const autoDateInput = parentDiv.querySelector("input.auto-date");
    const autoTimeInput = parentDiv.querySelector("input.auto-time");
    const typeDropdown = parentDiv.querySelector(".custom-dropdown button");
    const autoIncLabel = autoIncInput.parentElement;
    const autoDateLabel = autoDateInput.parentElement;
    const autoTimeLabel = autoTimeInput.parentElement;
    const defaultLabel = defaultInput.parentElement;
    const state = {
        pk: pkInput.checked,
        fk: fkInput.checked,
        notNull: notNullInput.checked,
        unique: uniqueInput.checked,
        default: defaultInput.checked,
        autoIncrement: autoIncInput.checked,
        autoDate: autoDateInput.checked,
        autoTime: autoTimeInput.checked,
        type: typeDropdown.textContent.toLowerCase()
    };
    const forcedTrue = {
        notNull: state.pk || state.autoIncrement
    };
    const forcedFalse = {
        fk: state.autoIncrement || state.autoDate || state.autoTime,
        default: state.autoIncrement || state.autoDate || state.autoTime || state.type === "boolean",
        autoIncrement: state.fk || state.default || state.type !== "integer",
        autoDate: state.fk || state.default || state.type !== "date",
        autoTime: state.fk || state.default || state.type !== "time",
    };
    const hidden = {
        autoIncrement: state.type !== "integer",
        autoDate: state.type !== "date",
        autoTime: state.type !== "time",
        default: state.type === "boolean",
    };
    const disabled = {
        notNull: state.pk || state.autoIncrement,
        autoIncrement: state.fk || state.default || state.type !== "integer",
        autoDate: state.fk || state.default || state.type !== "date",
        autoTime: state.fk || state.default || state.type !== "time",
        default: state.autoIncrement || state.autoDate || state.autoTime || state.type === "boolean",
        fk: state.autoIncrement || state.autoDate || state.autoTime
    };
    // NOT NULL
    notNullInput.checked = state.notNull || forcedTrue.notNull;
    notNullInput.disabled = disabled.notNull;
    // AUTO INCREMENT
    autoIncLabel.style.display = hidden.autoIncrement ? "none" : "flex";
    autoIncInput.checked = state.autoIncrement && !forcedFalse.autoIncrement;
    autoIncInput.disabled = disabled.autoIncrement;
    // AUTO DATE
    autoDateLabel.style.display = hidden.autoDate ? "none" : "flex";
    autoDateInput.checked = state.autoDate && !forcedFalse.autoDate;
    autoDateInput.disabled = disabled.autoDate;
    // AUTO TIME
    autoTimeLabel.style.display = hidden.autoTime ? "none" : "flex";
    autoTimeInput.checked = state.autoTime && !forcedFalse.autoTime;
    autoTimeInput.disabled = disabled.autoTime;
    // DEFAULT
    defaultInput.disabled = disabled.default;
    defaultInput.checked = state.default && !forcedFalse.default;
    defaultLabel.style.display = hidden.default ? "none" : "flex";
    // FK
    fkInput.disabled = disabled.fk;
    fkInput.checked = state.fk && !forcedFalse.fk;
    // REFERÊNCIA (FK)
    const referenciaDiv = parentDiv.querySelector("div.referencia");
    referenciaDiv.style.display = fkInput.checked ? "block" : "none";
    updateForeignKeyReferenceTableOptions(parentDiv);
    updateForeignKeyReferenceColumnOptions(parentDiv);
    // DEFAULT
    const defaultDiv = parentDiv.querySelector("div.default-input-text");
    defaultDiv.style.display = state.default ? "block" : "none";
    // ENUM
    const enumDiv = parentDiv.querySelector("div.enum-values");
    enumDiv.style.display = state.type === "enum" ? "block" : "none";
}
function updateDefaultInput(parentDiv) {
    const type = parentDiv.querySelector(".custom-dropdown button").textContent.toLowerCase();
    if (type == "boolean") {
        const defaultDiv = parentDiv.querySelector("div.default-input-text");
        defaultDiv.innerHTML = `
        <p>Default</p>
        <div class="custom-dropdown">
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                False
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option custom-dropdown-option-selected">False</li>
                <li class="custom-dropdown-option">True</li>
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
}
function updateForeignKeyReferenceTableOptions(parentDiv) {
    const database = databases[currentDatabase];
    const shouldFilterCurrentTable = currentTable && database.tables[currentTable];
    const availableTables = Object.keys(database.tables).filter(tableName => !shouldFilterCurrentTable || tableName !== currentTable);
    const tableSelect = parentDiv.querySelector(".referencia .custom-dropdown-menu");
    tableSelect.innerHTML = "";
    availableTables.forEach((tableName, i) => {
        tableSelect.innerHTML += `
            <li class="custom-dropdown-option ${i === 0 ? "custom-dropdown-option-selected" : ""}">${tableName}</li>
        `;
    });
    const refButton = parentDiv.querySelector(".referencia .custom-dropdown-trigger");
    if (availableTables.length === 0) {
        refButton.textContent = "Crie outra tabela";
    }
    else {
        refButton.textContent = availableTables[0];
    }
    updateCustomDropdowns();
}
function updateForeignKeyReferenceColumnOptions(parentDiv) {
    const database = databases[currentDatabase];
    const columnSelect = parentDiv.querySelector(".referencia :nth-child(3) .custom-dropdown-menu");
    const refTableButton = parentDiv.querySelector(".referencia .custom-dropdown-trigger");
    const refButton = parentDiv.querySelector(".referencia :nth-child(3) .custom-dropdown-trigger");
    columnSelect.innerHTML = "";
    const referencedTable = database.tables[refTableButton.textContent];
    if (!referencedTable) {
        refButton.textContent = "Crie outra tabela";
        updateCustomDropdowns();
        return;
    }
    let i = 0;
    for (let columnName in referencedTable.columns) {
        columnSelect.innerHTML += `
            <li class="custom-dropdown-option ${i === 0 ? "custom-dropdown-option-selected" : ""}">${columnName}</li>
        `;
        i++;
    }
    if (Object.keys(referencedTable.columns).length === 0) {
        refButton.textContent = "Crie outra coluna";
    }
    else {
        refButton.textContent = Object.keys(referencedTable.columns)[0];
    }
    updateCustomDropdowns();
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
createExempleDatabase();
createColumnCreationDiv(document.querySelector("#criacao-tabela ul"));
createColumnCreationDiv(document.getElementById("criacao-colunas-edit"));
