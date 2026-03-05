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
        this.PKs = [];
    }

    addColumn(name, type, isPK = false, isFK = false, isNotNull = false, isUnique = false, isAutoIncrement = false, FKreference = null, defaultValue = null) {
        this.columns.push(new Column(name, type, isPK, isFK, isNotNull, isUnique, isAutoIncrement, FKreference, defaultValue));
    }
}

class Column {
    constructor(name, type, isPK = false, isFK = false, isNotNull = false, isUnique = false, isAutoIncrement = false, FKreference = null, defaultValue = null) {
        this.name = name;
        this.type = type;
        this.isPK = isPK;
        this.isFK = isFK;
        this.isNotNull = isNotNull;
        this.isUnique = isUnique;
        this.isAutoIncrement = isAutoIncrement;
        this.autoIncrementCounter = 1;
        this.FKreference = FKreference;
        this.defaultValue = defaultValue;
    }
}

const types = Object.freeze({
    TEXT: "text",
    INTEGER: "integer",
    FLOAT: "float",
    BOOLEAN: "boolean",
});

// REMOVER ESSA PARTE DEPOIS
let datasbases = [];
let currentDatabase = datasbases[0];
let currentTable = null;
let currentRowIndex = 0;
let contadorColunas = 1;

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
        table.addColumn(column.nome, column.tipo, column.isPK, column.isFK, column.isNotNull, column.isUnique, column.isAutoIncrement, column.FKreference, column.defaultValue);

        if (column.isPK) {
            table.PKs.push(column.nome)
        }
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

function resetSelectedTableUI() {
    document.getElementById("nenhuma-tabela-selecionada").style.display = "flex";
    document.getElementById("tabela-selecionada-tabela").style.display = "none";
    document.getElementById("tabela-selecionada-tabela").innerHTML = "";
    document.getElementById("nome-tabela").textContent = "Crie uma tabela";
    document.getElementById("linhas-colunas").textContent = "0 linhas • 0 colunas";
}

function rebuildTablesList() {
    const tabelasLista = document.getElementById("tabelas-lista");
    tabelasLista.innerHTML = "";

    const tableNames = currentDatabase ? Object.keys(currentDatabase.tables) : [];

    tableNames.forEach((tableName) => {
        const table = currentDatabase.tables[tableName];
        const tableElement = document.createElement("div");
        tableElement.innerHTML = `
            <p>${table.name}</p>
            <p>${table.columns.length}</p>
        `;
        tableElement.classList.add("tabela");

        if (currentTable && currentTable.name === table.name) {
            tableElement.classList.add("tabela-ativa");
        }

        tableElement.addEventListener("click", () => {
            currentTable = currentDatabase.tables[tableName];

            document.querySelectorAll("#tabelas-lista > div").forEach((sibling) => {
                sibling.classList.remove("tabela-ativa");
            });

            tableElement.classList.add("tabela-ativa");
            changeSelectedTable(currentTable);
        });

        tabelasLista.appendChild(tableElement);
    });
}

function deleteCurrentTableInterface() {
    if (!currentTable) {
        openNotifications("<p style='color: red;'>Nenhuma tabela selecionada.</p>");
        return;
    }

    const tableName = currentTable.name;
    delete currentDatabase.tables[tableName];

    const remainingTables = Object.keys(currentDatabase.tables);
    currentTable = remainingTables.length > 0 ? currentDatabase.tables[remainingTables[0]] : null;

    rebuildTablesList();

    if (currentTable) {
        changeSelectedTable(currentTable);
        changeAlterarColunasMenu();
        changeInserirLinhaMenu();
    } else {
        resetSelectedTableUI();
        document.getElementById("lista-colunas-existentes").innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        document.getElementById("colunas-inserir-linha").innerHTML = "<div><h3>Crie uma tabela para começar</h3></div>";
    }

    refreshVisibleReferenceDropdowns();
    openNotifications(`<p style="color: green;">Tabela "${tableName}" deletada com sucesso!</p>`);
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

function normalizePrimaryKeyValue(value) {
    if (value === null || value === undefined) {
        return "__NULL__";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function hasDuplicatePrimaryKey(candidateRow, ignoredRowIndex = null) {
    if (!currentTable || currentTable.PKs.length === 0) {
        return false;
    }

    return currentTable.rows.some((row, index) => {
        if (ignoredRowIndex !== null && index === ignoredRowIndex) {
            return false;
        }

        return currentTable.PKs.every((pkName) => {
            return normalizePrimaryKeyValue(row[pkName]) === normalizePrimaryKeyValue(candidateRow[pkName]);
        });
    });
}

function getDuplicatedUniqueColumnName(candidateRow, ignoredRowIndex = null) {
    if (!currentTable) {
        return null;
    }

    const uniqueColumns = currentTable.columns.filter((column) => column.isUnique);
    if (uniqueColumns.length === 0) {
        return null;
    }

    for (const column of uniqueColumns) {
        const candidateValue = candidateRow[column.name];

        if (candidateValue === null || candidateValue === undefined) {
            continue;
        }

        const hasDuplicate = currentTable.rows.some((row, index) => {
            if (ignoredRowIndex !== null && index === ignoredRowIndex) {
                return false;
            }

            const existingValue = row[column.name];
            if (existingValue === null || existingValue === undefined) {
                return false;
            }

            return normalizePrimaryKeyValue(existingValue) === normalizePrimaryKeyValue(candidateValue);
        });

        if (hasDuplicate) {
            return column.name;
        }
    }

    return null;
}

function deleteRow(rowIndex) {
    if (!currentTable) {
        return;
    }

    if (rowIndex < 0 || rowIndex >= currentTable.rows.length) {
        return;
    }

    currentTable.rows.splice(rowIndex, 1);
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
        let columnType = coluna.querySelector('.custom-dropdown button span.custom-dropdown-value').textContent;
        const isPK = coluna.querySelector(".primary-key input").checked;
        const isFK = coluna.querySelector(".foreign-key input").checked;
        let isNotNull = coluna.querySelector(".not-null input").checked;
        let isUnique = coluna.querySelector(".unique input").checked;
        let isAutoIncrement = coluna.querySelector(".auto-increment input").checked;
        let FKreference = null;
        const hasDefault = coluna.querySelector(".default-option input[type='checkbox']").checked;
        let defaultValue = null;

        if (hasDefault) {
            const defaultInput = coluna.querySelector(".default-option input[type='text']");
            defaultValue = defaultInput ? defaultInput.value : null;
        }

        if (isFK) {
            const referenceDropdowns = coluna.querySelectorAll(".referencia .custom-dropdown");
            if (referenceDropdowns.length === 1) {
                const referencedTable = referenceDropdowns[0].querySelector(".custom-dropdown-value")?.textContent.trim();

                if (referencedTable) {
                    FKreference = referencedTable;
                }
            }

            isAutoIncrement = false;
            isNotNull = true;
            isUnique = false;
            columnType = "Reference";
        }

        if (isPK) {
            isNotNull = true;
        }

        columnsList.push({
            nome: nomeColuna,
            tipo: columnType,
            isPK: isPK,
            isFK: isFK,
            isNotNull: isNotNull,
            isUnique: isUnique,
            isAutoIncrement: isAutoIncrement,
            FKreference: FKreference,
            defaultValue: defaultValue
        });
    });

    createTable(tableName, columnsList);
}

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
            <div class="default-option">
                <input type="checkbox" id="default-${contadorColunas}" onclick="toggleOnDefaultOptionButton(this)">
                <label for="default-${contadorColunas}">Default</label>
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
        </div>

        <div class="default" style="display: none;">
            <p>Default</p>
            <input type="text" placeholder="Valor padrão">
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
    let shouldReturn = false;
    const colunasList = document.querySelectorAll("#editar-colunas ul#criacao-colunas-edit > div");
    colunasList.forEach((coluna) => {
        const nomeColuna = coluna.querySelector("input").value;
        if (nomeColuna.trim() === "") {
            openNotifications("<p style='color: red;'>O nome da coluna não pode ser vazio.</p>");
            shouldReturn = true;
            return;
        }
        const columnType = coluna.querySelector('.custom-dropdown button span.custom-dropdown-value').textContent;
        const isPK = coluna.querySelector(".primary-key input").checked;
        const isFK = coluna.querySelector(".foreign-key input").checked;
        const isNotNull = coluna.querySelector(".not-null input").checked;
        const isUnique = coluna.querySelector(".unique input").checked;
        const isAutoIncrement = coluna.querySelector(".auto-increment input").checked;
        const hasDefault = coluna.querySelector(".default-option input[type='checkbox']").checked;
        const defaultInput = coluna.querySelector(".default input[type='text']");
        const defaultValue = hasDefault && defaultInput ? defaultInput.value : null;
        columnsList.push({
            nome: nomeColuna,
            tipo: columnType,
            isPK: isPK,
            isFK: isFK,
            isNotNull: isNotNull,
            isUnique: isUnique,
            isAutoIncrement: isAutoIncrement,
            defaultValue: defaultValue
        });
    });
    if (shouldReturn) {
        return;
    }

    columnsList.forEach((column) => {
        currentTable.addColumn(column.nome, column.tipo, column.isPK, column.isFK, column.isNotNull, column.isUnique, column.isAutoIncrement, null, column.defaultValue);
        currentTable.rows.forEach((row) => {
            row[column.nome] = column.isAutoIncrement ? currentTable.columns.at(-1).autoIncrementCounter++ : (column.defaultValue !== null && column.defaultValue !== "" ? column.defaultValue : null);
        });
    });
    openNotifications(`<p style="color: green;">Colunas adicionadas com sucesso!</p>`);
    changeSelectedTable(currentTable);
    changeAlterarColunasMenu();
    document.getElementById("criacao-colunas-edit").innerHTML = "";
    createColumnInterface(document.querySelector('#editar-colunas ul:not(#lista-colunas-existentes)'))
}

function insertRowInterface() {
    if (!currentTable) {
        openNotifications("<p style='color: red;'>Nenhuma tabela selecionada.</p>");
        return;
    }

    let rowInsert = {};
    let shouldReturn = false;
    const inserirLinhasList = document.querySelectorAll("#colunas-inserir-linha > div")
    inserirLinhasList.forEach((div, index) => {
        const columnName = div.querySelector("h3").textContent;
        if (div.querySelector("p").textContent.includes("BOOLEAN")) {
            const boolValue = div.querySelector(".custom-dropdown button span").textContent;
            rowInsert[columnName] = boolValue === "TRUE" ? true : false;
        } else if (div.querySelector("p").textContent.includes("AUTO_INCREMENT")) {
            const value = currentTable.columns[index].autoIncrementCounter;
            currentTable.columns[index].autoIncrementCounter++;
            rowInsert[columnName] = value;
        } else if (div.querySelector("p").textContent.includes("FK")) {
            const inputsList = div.querySelectorAll("input");
            const inputsValues = [...inputsList].map((i) => { return i.value; });
            let interseccao = currentDatabase.tables[currentTable.columns[index].FKreference].rows;
            inputsValues.forEach((input, i) => {
                const lista2 = currentDatabase.tables[currentTable.columns[index].FKreference].rows.filter((r) => {
                    return r[currentDatabase.tables[currentTable.columns[index].FKreference].PKs[i]] === parseInt(input);
                });
                interseccao = interseccao.filter(item => lista2.includes(item));
            });
            if (interseccao.length === 0) {
                shouldReturn = true;
                openNotifications(`<p style="color: red;">Valores invalidos para FK</p>`);
                return;
            } else {
                rowInsert[columnName] = interseccao;
            }
        } else {
            const inputValue = div.querySelector("input").value;
            if (inputValue.trim() === "") {
                const defaultValue = currentTable.columns[index].defaultValue;
                rowInsert[columnName] = defaultValue !== null && defaultValue !== "" ? defaultValue : null;
                if (currentTable.columns[index].isNotNull) {
                    shouldReturn = true;
                    openNotifications(`<p style="color: red;">Campo obrigatório não preenchido.</p>`);
                }
            } else {
                rowInsert[columnName] = inputValue;
            }
        }
    });

    if (shouldReturn) {
        return;
    }

    if (hasDuplicatePrimaryKey(rowInsert)) {
        openNotifications("<p style='color: red;'>Valor de PK já existe.</p>");
        return;
    }

    const duplicateUniqueColumn = getDuplicatedUniqueColumnName(rowInsert);
    if (duplicateUniqueColumn) {
        openNotifications(`<p style='color: red;'>Valor duplicado em UNIQUE: ${duplicateUniqueColumn}</p>`);
        return;
    }

    insertRow(rowInsert);
    openNotifications(`<p style="color: green;">Linha inserida com sucesso!</p>`);
    changeInserirLinhaMenu();
}

function editRowInterface() {
    let rowInsert = {};
    let shouldReturn = false;
    const inserirLinhasList = document.querySelectorAll("#colunas-editar-linha > div")
    inserirLinhasList.forEach((div, index) => {
        const columnName = div.querySelector("h3").textContent;
        if (div.querySelector("p").textContent.includes("BOOLEAN")) {
            const boolValue = div.querySelector(".custom-dropdown button span").textContent;
            rowInsert[columnName] = boolValue === "TRUE" ? true : false;
        } else if (div.querySelector("p").textContent.includes("AUTO_INCREMENT")) {
            rowInsert[columnName] = currentTable.rows[currentRowIndex][columnName];
        } else if (div.querySelector("p").textContent.includes("FK")) {
            const inputValue = div.querySelector("input").value;
            currentDatabase.tables[currentTable.columns[index].FKreference].rows.forEach((row) => {
                if (row[currentTable.columns[index].FKreference] == inputValue) {
                    rowInsert[columnName] = inputValue;
                    return;
                }
            });
            if (!rowInsert[columnName]) {
                openNotifications("<p style='color: red;'>Valor inválido para a coluna FK.</p>");
                shouldReturn = true;
                return;
            }
        } else {
            const inputValue = div.querySelector("input").value;
            if (inputValue.trim() === "") {
                const defaultValue = currentTable.columns[index].defaultValue;
                rowInsert[columnName] = defaultValue !== null && defaultValue !== "" ? defaultValue : null;
                if (currentTable.columns[index].isNotNull) {
                    shouldReturn = true;
                    openNotifications(`<p style="color: red;">Campo obrigatório não preenchido.</p>`);
                }
            } else {
                rowInsert[columnName] = inputValue;
            }
        }
    });

    if (shouldReturn) {
        return;
    }

    if (hasDuplicatePrimaryKey(rowInsert, currentRowIndex)) {
        openNotifications("<p style='color: red;'>Valor de PK já existe.</p>");
        return;
    }

    const duplicateUniqueColumn = getDuplicatedUniqueColumnName(rowInsert, currentRowIndex);
    if (duplicateUniqueColumn) {
        openNotifications(`<p style='color: red;'>Valor duplicado em UNIQUE: ${duplicateUniqueColumn}</p>`);
        return;
    }

    currentTable.rows[currentRowIndex] = rowInsert;
    openNotifications(`<p style="color: green;">Linha editada com sucesso!</p>`);
    changeEditarLinhaMenu(currentRowIndex);
    changeSelectedTable(currentTable);
}

function deleteRowInterface(rowIndex) {
    if (!currentTable) {
        openNotifications("<p style='color: red;'>Nenhuma tabela selecionada.</p>");
        return;
    }

    if (rowIndex < 0 || rowIndex >= currentTable.rows.length) {
        openNotifications("<p style='color: red;'>Linha inválida.</p>");
        return;
    }

    deleteRow(rowIndex);
    openNotifications("<p style='color: green;'>Linha deletada com sucesso!</p>");
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
                    <p>${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""}</p>
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
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})</p>
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
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})</p>
                    <p style="color: var(--gray);">Valor gerado automaticamente</p>
                </div>
            `;
        } else if (column.isFK) {
            const div = document.createElement("div");
            const h3name = document.createElement("h3");
            h3name.textContent = column.name;
            div.appendChild(h3name);
            const pCharacteristics = document.createElement("p");
            pCharacteristics.textContent = `(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})`;
            div.appendChild(pCharacteristics)

            currentDatabase.tables[column.FKreference].PKs.forEach((pk) => {
                const columnPK = currentDatabase.tables[column.FKreference].columns.filter((item) => {
                    return item.name === pk;
                })[0];
                const inputName = document.createElement("p");
                inputName.textContent = pk;
                div.appendChild(inputName);

                if (columnPK.type === "Integer" || columnPK.type === "Float") {
                    const inputPK = document.createElement("input");
                    inputPK.type = "number";
                    inputPK.placeholder = `(${columnPK.type.toUpperCase()}${columnPK.isPK ? " • PK" : ""}${columnPK.isFK ? " • FK" : ""}${columnPK.isNotNull ? " • NOT NULL" : ""}${columnPK.isUnique ? " • UNIQUE" : ""}${columnPK.isAutoIncrement ? " • AUTO_INCREMENT" : ""})`;
                    div.appendChild(inputPK);
                } else if (columnPK.type === "Boolean") {
                    const inputPK = document.createElement("div");
                    inputPK.innerHTML = `
                        <button type="button" class="custom-dropdown-trigger" aria-expanded="false">
                            <span class="custom-dropdown-value">TRUE</span>
                        </button>
                        <ul class="custom-dropdown-menu" tabindex="-1">
                            <li class="custom-dropdown-option custom-dropdown-option-selected">TRUE</li>
                            <li class="custom-dropdown-option">FALSE</li>
                        </ul>
                        <input type="hidden" name="column-type" value="text">
                    `;
                    div.appendChild(inputPK);
                } else {
                    const inputPK = document.createElement("input");
                    inputPK.type = "text";
                    inputPK.placeholder = `(${columnPK.type.toUpperCase()}${columnPK.isPK ? " • PK" : ""}${columnPK.isFK ? " • FK" : ""}${columnPK.isNotNull ? " • NOT NULL" : ""}${columnPK.isUnique ? " • UNIQUE" : ""}${columnPK.isAutoIncrement ? " • AUTO_INCREMENT" : ""})`;
                    div.appendChild(inputPK);
                }
                inserirLinhasList.appendChild(div);
            });
        } else if (column.type === "Integer" || column.type === "Float") {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})</p>
                    <input type="number" step="${column.type === "Integer" ? "1" : "any"}">
                </div>
            `;
        } else {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})</p>
                    <input type="text">
                </div>
            `;
        }
    });

    updateCustomDropdowns();
}

function changeEditarLinhaMenu(rowIndex) {
    if (!currentTable) {
        return;
    }

    currentRowIndex = rowIndex;

    const inserirLinhasList = document.getElementById("colunas-editar-linha");
    inserirLinhasList.innerHTML = "";
    currentTable.columns.forEach((column) => {
        if (column.type === "Boolean") {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})</p>
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
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})</p>
                    <p style="color: var(--gray);">Valor gerado automaticamente</p>
                </div>
            `;
        } else if (column.isFK) {
            const div = document.createElement("div");
            const h3name = document.createElement("h3");
            h3name.textContent = column.name;
            div.appendChild(h3name);
            const pCharacteristics = document.createElement("p");
            pCharacteristics.textContent = `(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})`;
            div.appendChild(pCharacteristics)

            currentDatabase.tables[column.FKreference].PKs.forEach((pk) => {
                const columnPK = currentDatabase.tables[column.FKreference].columns.filter((item) => {
                    return item.name === pk;
                })[0];
                const inputName = document.createElement("p");
                inputName.textContent = pk;
                div.appendChild(inputName);

                if (columnPK.type === "Integer" || columnPK.type === "Float") {
                    const inputPK = document.createElement("input");
                    inputPK.type = "number";
                    inputPK.placeholder = `(${columnPK.type.toUpperCase()}${columnPK.isPK ? " • PK" : ""}${columnPK.isFK ? " • FK" : ""}${columnPK.isNotNull ? " • NOT NULL" : ""}${columnPK.isUnique ? " • UNIQUE" : ""}${columnPK.isAutoIncrement ? " • AUTO_INCREMENT" : ""})`;
                    div.appendChild(inputPK);
                } else if (columnPK.type === "Boolean") {
                    const inputPK = document.createElement("div");
                    inputPK.innerHTML = `
                        <button type="button" class="custom-dropdown-trigger" aria-expanded="false">
                            <span class="custom-dropdown-value">TRUE</span>
                        </button>
                        <ul class="custom-dropdown-menu" tabindex="-1">
                            <li class="custom-dropdown-option custom-dropdown-option-selected">TRUE</li>
                            <li class="custom-dropdown-option">FALSE</li>
                        </ul>
                        <input type="hidden" name="column-type" value="text">
                    `;
                    div.appendChild(inputPK);
                } else {
                    const inputPK = document.createElement("input");
                    inputPK.type = "text";
                    inputPK.placeholder = `(${columnPK.type.toUpperCase()}${columnPK.isPK ? " • PK" : ""}${columnPK.isFK ? " • FK" : ""}${columnPK.isNotNull ? " • NOT NULL" : ""}${columnPK.isUnique ? " • UNIQUE" : ""}${columnPK.isAutoIncrement ? " • AUTO_INCREMENT" : ""})`;
                    div.appendChild(inputPK);
                }
                inserirLinhasList.appendChild(div);
            });
        } else if (column.type === "Integer" || column.type === "Float") {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})</p>
                    <input type="number" step="${column.type === "Integer" ? "1" : "any"}">
                </div>
            `;
        } else {
            inserirLinhasList.innerHTML += `
                <div>
                    <h3>${column.name}</h3>
                    <p>(${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""})</p>
                    <input type="text">
                </div>
            `;
        }
    });

    updateCustomDropdowns();
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
            <p>${column.type.toUpperCase()}${column.isPK ? " • PK" : ""}${column.isFK ? " • FK → " + column.FKreference : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO INCREMENT" : ""}${column.defaultValue !== null && column.defaultValue !== "" ? " • DEFAULT " + column.defaultValue : ""}</p>
        `;


        divLinha.appendChild(divColuna);
    });
    divLinha.innerHTML += `
        <div><p>Ações</p></div>
    `;

    document.getElementById("tabela-selecionada-tabela").innerHTML = "";
    document.getElementById("tabela-selecionada-tabela").appendChild(divLinha);

    table.rows.forEach((row, index) => {
        let divLinha = document.createElement("div");
        divLinha.classList.add("linha-tabela");
        Object.values(row).forEach((value) => {
            const divCelula = document.createElement("div");
            divCelula.innerHTML = `<p>${value}</p>`;
            divLinha.appendChild(divCelula);
        });
        divLinha.innerHTML += `
            <div>
                <button onclick="abrirFechar(false, 'editar-linha'); changeEditarLinhaMenu(${index});">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <use href="assets/images/icons-sprite.svg#icon-pencil"></use>
                    </svg>
                </button>
                <button onclick="deleteRowInterface(${index})">
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
    if (estado) {
        element.parentElement.parentElement.querySelectorAll("div").forEach((div, index) => {
            if (index === 2) {
                div.style.display = "none";
            }
        });
    } else {
        element.parentElement.parentElement.querySelectorAll("div").forEach((div, index) => {
            if (index === 2 && !element.parentElement.parentElement.querySelector("div input[onclick='toggleOnFKButton(this)']").checked) {
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
            if (index === 2) {
                div.style.display = "none";
            }
        });
        element.parentElement.parentElement.parentElement.querySelector(".custom-dropdown").style.display = "none";
    } else {
        element.parentElement.parentElement.querySelectorAll("div").forEach((div, index) => {
            if (index === 4 && element.parentElement.parentElement.parentElement.querySelector(".custom-dropdown button span").textContent === "Integer") {
                div.style.display = "flex";
            }
            if (index === 2 && !element.parentElement.parentElement.querySelector("div input").checked) {
                div.style.display = "flex";
            }
        });
        element.parentElement.parentElement.parentElement.querySelector(".custom-dropdown").style.display = "flex";
    }
}

function toggleOnDefaultOptionButton(element) {
    const columnElement = element.parentElement.parentElement.parentElement;
    const defaultContainer = columnElement.querySelector(".default");

    if (!defaultContainer) {
        return;
    }

    if (element.checked) {
        defaultContainer.style.display = "block";
    } else {
        defaultContainer.style.display = "none";
        const defaultInput = defaultContainer.querySelector("input");
        if (defaultInput) {
            defaultInput.value = "";
        }
    }
}

function initializeReferenceDropdown(columnElement) {
    const referencia = columnElement.querySelector(".referencia");
    if (!referencia || referencia.dataset.referenceInitialized === "true") {
        return;
    }

    const dropdowns = referencia.querySelectorAll(".custom-dropdown");
    if (dropdowns.length < 1) {
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
    });

    referencia.dataset.referenceInitialized = "true";
}

function updateReferenceTablesDropdown(columnElement) {
    const referencia = columnElement.querySelector(".referencia");
    if (!referencia) {
        return;
    }

    const dropdowns = referencia.querySelectorAll(".custom-dropdown");
    if (dropdowns.length < 1) {
        return;
    }

    const tableDropdown = dropdowns[0];
    const tableValue = tableDropdown.querySelector(".custom-dropdown-value");
    const tableMenu = tableDropdown.querySelector(".custom-dropdown-menu");
    const tableInput = tableDropdown.querySelector('input[name="column-type"]');
    const tableNames = currentDatabase ? Object.keys(currentDatabase.tables) : [];

    if (!tableValue || !tableMenu || !tableInput) {
        return;
    }

    if (tableNames.length === 0) {
        tableMenu.innerHTML = "";
        tableValue.textContent = "Crie outra tabela";
        tableInput.value = "";
        return;
    }

    const previousSelectedTable = tableValue.textContent.trim();
    const selectedTable = tableNames.includes(previousSelectedTable) ? previousSelectedTable : tableNames[0];

    tableMenu.innerHTML = tableNames
        .map((name) => !currentTable || name !== currentTable.name ? `<li class="custom-dropdown-option${name === selectedTable ? " custom-dropdown-option-selected" : ""}">${name}</li>` : "")
        .join("");

    tableValue.textContent = selectedTable;
    tableInput.value = selectedTable;
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

document.getElementById("delete-table").addEventListener("click", () => {
    deleteCurrentTableInterface();
});
// #endregion