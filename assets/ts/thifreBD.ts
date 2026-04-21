// #region Change interface terminal

const buttonChangeToGraficalInterface = document.getElementById("button-interface-terminal-interface")!;
const buttonChangeToTerminalInterface = document.getElementById("button-interface-terminal-terminal")!;
const interfaceTerminal = document.getElementById("interface-terminal")!;

function updateInterfaceTerminalIndicator(activeButton: HTMLElement) {
    const left = activeButton.offsetLeft;
    const width = activeButton.offsetWidth;
    interfaceTerminal.style.setProperty("--indicator-left", `${left}px`);
    interfaceTerminal.style.setProperty("--indicator-width", `${width}px`);
}


updateInterfaceTerminalIndicator(buttonChangeToGraficalInterface);


buttonChangeToGraficalInterface.addEventListener("click", () => {
    const interfaceGrafica = document.getElementById("interface-grafica")!;
    const terminal = document.getElementById("terminal")!;
    interfaceGrafica.style.display = "flex";
    terminal.style.display = "none";
    buttonChangeToGraficalInterface.classList.add("interface-terminal-ativo");
    buttonChangeToTerminalInterface.classList.remove("interface-terminal-ativo");
    updateInterfaceTerminalIndicator(buttonChangeToGraficalInterface);
});

buttonChangeToTerminalInterface.addEventListener("click", () => {
    const interfaceGrafica = document.getElementById("interface-grafica")!;
    const terminal = document.getElementById("terminal")!;
    interfaceGrafica.style.display = "none";
    terminal.style.display = "flex";
    buttonChangeToGraficalInterface.classList.remove("interface-terminal-ativo");
    buttonChangeToTerminalInterface.classList.add("interface-terminal-ativo");
    updateInterfaceTerminalIndicator(buttonChangeToTerminalInterface);
});

// #endregion

// #region Others
let timeout: number;

function openNotifications(html: string) {
    clearTimeout(timeout);
    const notificacoes = document.getElementById("notificacoes")!;
    notificacoes.style.display = "flex";
    notificacoes.innerHTML = html;

    timeout = setTimeout(() => {
        notificacoes.style.display = "none";
    }, 3000);
}

function abrirFechar(estado: boolean, id: string) {
    const elemento = document.getElementById(id)!;
    if (estado === false) {
        document.getElementById("menus-centrais")!.style.display = "flex";
        elemento.style.display = "flex";
    } else if (estado === true) {
        document.getElementById("menus-centrais")!.style.display = "none";
        elemento.style.display = "none";
    }
}

function createExempleDatabase() {
    const databaseName = "exemplo_db";

    if (databases[databaseName]) {
        currentDatabase = databaseName;
        currentTable = Object.keys(databases[databaseName].tables)[0] ?? null;
        changeDatabaseDropdown();
        changeTabelasLista();
        changeTabelaSelecionadaTabela();
        changeTabelaInfoVariosBotoes();
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
    usuarios.columns["ativo"] = new Column("ativo", "boolean", false, false, false, false, false, false);
    usuarios.columns["nota"] = new Column("nota", "float", false, false, false, false, false, false);
    usuarios.columns["criado_em"] = new Column("criado_em", "date", false, false, false, false, false, false);
    createTable(usuarios);

    const idColumn = usuarios.columns["id"];
    addRow("usuarios", {
        id: idColumn.increment(),
        nome: "Alice",
        email: "alice@email.com",
        ativo: true,
        nota: 9.5,
        criado_em: "2026-01-10"
    });
    addRow("usuarios", {
        id: idColumn.increment(),
        nome: "Bruno",
        email: "bruno@email.com",
        ativo: false,
        nota: 7.2,
        criado_em: "2026-02-02"
    });
    addRow("usuarios", {
        id: idColumn.increment(),
        nome: "Carla",
        email: "carla@email.com",
        ativo: true,
        nota: 8.8,
        criado_em: "2026-03-15"
    });

    currentTable = "usuarios";
    changeTabelasLista();
    changeTabelaSelecionadaTabela();
    changeTabelaInfoVariosBotoes();
    changeEditColumnsMenu();
    changeAddRowMenu();
    openNotifications("<p style='color: var(--green5)'>Database de exemplo criada com sucesso!</p>");
}

// #endregion

// #region Custom dropdowns

function openCustomDropdown(dropdownButton: HTMLElement) {
    const dropdown = dropdownButton.parentElement! as HTMLElement;
    if (dropdown.querySelector("ul")!.children.length === 0) return;
    dropdown.classList.toggle("custom-dropdown-open");
}

function choseOption(option: HTMLElement) {
    const dropdown = option.closest(".custom-dropdown")! as HTMLElement;
    dropdown.querySelector(".custom-dropdown-trigger")!.textContent = option.textContent;
    dropdown.classList.remove("custom-dropdown-open");
    dropdown.querySelector(".custom-dropdown-option-selected")?.classList.remove("custom-dropdown-option-selected");
    option.classList.add("custom-dropdown-option-selected");

    onDropdownChange(dropdown);
}

function closeAllCustomDropdowns(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest(".custom-dropdown")) return;

    document.querySelectorAll(".custom-dropdown.custom-dropdown-open").forEach((dropdown) => {
        dropdown.classList.remove("custom-dropdown-open");
    });
}

function updateCustomDropdowns() {
    document.querySelectorAll(".custom-dropdown").forEach((dropdown) => {
        dropdown.querySelectorAll(".custom-dropdown-option").forEach((option) => {
            option.addEventListener("click", () => choseOption(option as HTMLElement));
        });
    });
}

function onDropdownChange(dropdown: HTMLElement) {
    if (dropdown.querySelector('input[name="column-type"]')) {
        const container = dropdown.closest("div")!.parentElement!;

        updateCharacteristics(container);
    }
}

updateCustomDropdowns();

// #endregion

// #region classes and variables

class Database {
    name: string;
    tables: Record<string, Table>;

    constructor(name: string) {
        this.name = name;
        this.tables = {};
    }
}

class Table {
    name: string;
    columns: Record<string, Column>;
    rows: Record<string, any>[];
    indexes: Record<string, Map<any, number[]>>;

    constructor(name: string) {
        this.name = name;
        this.columns = {};
        this.rows = [];
        this.indexes = {};
    }
}

class Column {
    name: string;
    type: columnType;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    isNotNull: boolean;
    isUnique: boolean;
    isAutoIncrement: boolean;
    hasDefault: boolean;
    enumValues?: string[];
    reference?: reference;
    incrementCounter: number = 1;

    constructor(name: string, type: columnType, isPrimaryKey: boolean = false, isForeignKey: boolean = false,
        isNotNull: boolean = false, isUnique: boolean = false, isAutoIncrement: boolean = false,
        hasDefault: boolean = false, enumValues?: string[], reference?: reference) {
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

    increment() {
        if (!this.isAutoIncrement) return;
        return this.incrementCounter++;
    }
}

type columnType = "text" | "integer" | "float" | "boolean" | "date" | "enum";
type reference = { table: string; column: string; };

let databases: Record<string, Database> = {};
let currentDatabase: string | null = null;
let currentTable: string | null = null;

//#endregion

// #region SGBD functions

function createDatabase(database: Database) {
    databases[database.name] = database;
    currentDatabase = database.name;
    currentTable = null;
    changeDatabaseDropdown();
    changeTabelasLista();
    changeTabelaSelecionadaTabela();
    changeTabelaInfoVariosBotoes();
}

function createTable(table: Table) {
    for (const columnName in table.columns) {
        table.indexes[columnName] = new Map();
    }
    databases[currentDatabase!].tables[table.name] = table;
    currentTable = table.name;
    changeTabelasLista();
    changeTabelaSelecionadaTabela();
    changeTabelaInfoVariosBotoes();
}

function addColumn(tableName: string, column: Column) {
    databases[currentDatabase!].tables[tableName].columns[column.name] = column;
    databases[currentDatabase!].tables[tableName].indexes[column.name] = new Map();
    changeTabelaSelecionadaTabela();
    changeTabelasLista();
    changeTabelaInfoVariosBotoes();
}

function addRow(tableName: string, row: Record<string, any>) {
    const table = databases[currentDatabase!].tables[tableName];

    const rowIndex = table.rows.length;
    table.rows.push(row);

    for (const col in table.indexes) {
        const value = row[col];
        if (!table.indexes[col].has(value)) {
            table.indexes[col].set(value, []);
        }
        table.indexes[col].get(value)!.push(rowIndex);
    }
    changeTabelaSelecionadaTabela();
    changeTabelaInfoVariosBotoes();
}

function editRow(tableName: string, oldRowIndex: number, newRow: Record<string, any>) {
    const table = databases[currentDatabase!].tables[tableName];
    const oldRow = table.rows[oldRowIndex];

    for (const col in table.indexes) {
        const oldValue = oldRow[col];
        const indexMap = table.indexes[col];

        if (indexMap.has(oldValue)) {
            const arr = indexMap.get(oldValue)!;

            const pos = arr.indexOf(oldRowIndex);
            if (pos !== -1) arr.splice(pos, 1);

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

        indexMap.get(newValue)!.push(oldRowIndex);
    }

    changeTabelaSelecionadaTabela();
    changeTabelaInfoVariosBotoes();
}

// #endregion

// #region Interface functions

function createDatabaseInterface() {
    const databaseNameInput = document.getElementById("nome-database-input") as HTMLInputElement;
    const databaseName = databaseNameInput.value.trim().toLowerCase();

    if (databaseName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da database não pode ser vazio.</p>");
        return;
    } else if (databases[databaseName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma database com esse nome.</p>");
        return;
    }

    createDatabase(new Database(databaseName));
    databaseNameInput.value = "";
    openNotifications(`<p style='color: var(--green4)'>Database "${databaseName}" criada com sucesso!</p>`);
}

function createTableInterface() {
    const tableNameInput = document.getElementById("nome-tabela-input") as HTMLInputElement;
    const tableName = tableNameInput.value.trim().toLowerCase();

    if (tableName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não pode ser vazio.</p>");
        return;
    } else if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    } else if (databases[currentDatabase!].tables[tableName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma tabela com esse nome.</p>");
        return;
    }

    const table = new Table(tableName);
    const columnsUl = document.querySelector("#criacao-tabela ul")!;

    for (const columnDiv of columnsUl.children) {
        const columnNameInput = columnDiv.querySelector("input[type='text']") as HTMLInputElement;
        const columnName = columnNameInput.value.trim().toLowerCase();
        if (columnName === "") {
            openNotifications("<p style='color: var(--red5)'>O nome da coluna não pode ser vazio.</p>");
            return;
        } else if (table.columns[columnName]) {
            openNotifications("<p style='color: var(--red5)'>Já existe uma coluna com esse nome.</p>");
            return;
        }

        const columnType = columnDiv.querySelector(".custom-dropdown-trigger") as HTMLElement;
        const isPrimaryKey = columnDiv.querySelector(".primary-key") as HTMLInputElement;
        const isForeignKey = columnDiv.querySelector(".foreign-key") as HTMLInputElement;
        const isNotNull = columnDiv.querySelector(".not-null") as HTMLInputElement;
        const isUnique = columnDiv.querySelector(".unique") as HTMLInputElement;
        const hasDefault = columnDiv.querySelector(".default") as HTMLInputElement;
        const isAutoIncrement = columnDiv.querySelector(".auto-increment") as HTMLInputElement;

        const column = new Column(columnName, columnType.textContent!.toLowerCase() as columnType,
            isPrimaryKey.checked, isForeignKey.checked, isNotNull.checked, isUnique.checked,
            isAutoIncrement.checked, hasDefault.checked);

        table.columns[columnName] = column;
        openNotifications(`<p style='color: var(--green4)'>Coluna "${columnName}" criada com sucesso!</p>`);
    }

    createTable(table);
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl as HTMLElement);
    tableNameInput.value = "";
    openNotifications(`<p style='color: var(--green5)'>Tabela "${tableName}" criada com sucesso!</p>`);
}

function addColumnsInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    } else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    }
    const columnsUl = document.querySelector("#editar-colunas ul#criacao-colunas-edit")!;
    const table = databases[currentDatabase!].tables[currentTable!];

    for (const columnDiv of columnsUl.children) {
        const columnNameInput = columnDiv.querySelector("input[type='text']") as HTMLInputElement;
        const columnName = columnNameInput.value.trim().toLowerCase();
        if (columnName === "") {
            openNotifications("<p style='color: var(--red5)'>O nome da coluna não pode ser vazio.</p>");
            return;
        } else if (table.columns[columnName]) {
            openNotifications("<p style='color: var(--red5)'>Já existe uma coluna com esse nome.</p>");
            return;
        }

        const columnType = columnDiv.querySelector(".custom-dropdown-trigger") as HTMLElement;
        const isPrimaryKey = columnDiv.querySelector(".primary-key") as HTMLInputElement;
        const isForeignKey = columnDiv.querySelector(".foreign-key") as HTMLInputElement;
        const isNotNull = columnDiv.querySelector(".not-null") as HTMLInputElement;
        const isUnique = columnDiv.querySelector(".unique") as HTMLInputElement;
        const hasDefault = columnDiv.querySelector(".default") as HTMLInputElement;
        const isAutoIncrement = columnDiv.querySelector(".auto-increment") as HTMLInputElement;

        const column = new Column(columnName, columnType.textContent!.toLowerCase() as columnType,
            isPrimaryKey.checked, isForeignKey.checked, isNotNull.checked, isUnique.checked,
            isAutoIncrement.checked, hasDefault.checked);

        addColumn(table.name, column);
        openNotifications(`<p style='color: var(--green4)'>Coluna "${columnName}" criada com sucesso!</p>`);
    }

    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl as HTMLElement);
    changeEditColumnsMenu();
    openNotifications(`<p style='color: var(--green5)'>Colunas adicionadas com sucesso!</p>`);
}

function insertRowInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    } else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    } else if (Object.keys(databases[currentDatabase!].tables[currentTable!].columns).length === 0) {
        openNotifications("<p style='color: var(--red5)'>Não há colunas nessa tabela</p>");
        return;
    }
    const table = databases[currentDatabase!].tables[currentTable!];
    const rowUl = document.querySelector("#inserir-linha ul#colunas-inserir-linha")!;
    const row: Record<string, any> = {};
    for (const column of rowUl.children) {
        const columnName = column.querySelector("h3")!.textContent!;
        if (table.columns[columnName].isAutoIncrement) {
            row[columnName] = table.columns[columnName].increment();
        } else if (table.columns[columnName].type === "boolean") {
            const value = document.querySelector(".custom-dropdown button")!.textContent!;
            row[columnName] = value === "True";
        } else {
            const input = column.querySelector("input") as HTMLInputElement;
            if (input.value.trim() === "") {
                row[columnName] = null;
                continue;
            }
            if (table.columns[columnName].type === "integer") {
                row[columnName] = parseInt(input.value);
            } else if (table.columns[columnName].type === "float") {
                row[columnName] = parseFloat(input.value);
            } else {
                row[columnName] = input.value;
            }
        }
    }
    addRow(currentTable!, row);
    changeAddRowMenu();
    openNotifications(`<p style='color: var(--green5)'>Linha inserida com sucesso!</p>`);
}

function editRowInterface(rowIndex: number) {
    if (Object.keys(databases[currentDatabase!].tables[currentTable!].columns).length === 0) {
        openNotifications("<p style='color: var(--red5)'>Não há colunas nessa tabela</p>");
        return;
    }

    const table = databases[currentDatabase!].tables[currentTable!];
    const rowUl = document.querySelector("#editar-linha ul#colunas-editar-linha")!;
    const row: Record<string, any> = {};
    for (const column of rowUl.children) {
        const columnName = column.querySelector("h3")!.textContent!;
        if (table.columns[columnName].isAutoIncrement) {
            row[columnName] = table.rows[rowIndex][columnName];
        } else if (table.columns[columnName].type === "boolean") {
            const value = document.querySelector(".custom-dropdown button")!.textContent!;
            row[columnName] = value === "True";
        } else {
            const input = column.querySelector("input") as HTMLInputElement;
            if (input.value.trim() === "") {
                row[columnName] = null;
                continue;
            }
            if (table.columns[columnName].type === "integer") {
                row[columnName] = parseInt(input.value);
            } else if (table.columns[columnName].type === "float") {
                row[columnName] = parseFloat(input.value);
            } else {
                row[columnName] = input.value;
            }
        }
    }

    editRow(currentTable!, rowIndex, row);
    changeEditRowMenu(rowIndex);
    openNotifications(`<p style='color: var(--green5)'>Linha editada com sucesso!</p>`);
}

function createColumnCreationDiv(parent: HTMLElement) {
    const mainDiv = document.createElement("div");

    // Input de nome da coluna
    const columnNameInput = document.createElement("input");
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

    const options = ["Text", "Integer", "Float", "Boolean", "Date", "Enum"];
    options.forEach((option, index) => {
        const li = document.createElement("li");
        li.className = "custom-dropdown-option";
        if (index === 0) li.classList.add("custom-dropdown-option-selected");
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
    characteristics.className = "characteristics";

    const characteristicsList = [
        { className: "primary-key", name: "primary-key", label: "Primary key" },
        { className: "foreign-key", name: "foreign-key", label: "Foreign key" },
        { className: "not-null", name: "not-null", label: "Not null" },
        { className: "unique", name: "unique", label: "Unique" },
        { className: "default", name: "default", label: "Default" },
        { className: "auto-increment", name: "auto-increment", label: "Auto increment", hidden: true }
    ];

    characteristicsList.forEach((char) => {
        const div = document.createElement("div");

        const label = document.createElement("label");
        if (char.hidden) label.style.display = "none";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = char.className;
        checkbox.name = char.name;
        checkbox.onclick = function () { updateCharacteristics(mainDiv); };

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(char.label));
        div.appendChild(label);
        characteristics.appendChild(div);
    });

    // Delete column button
    const deleteDiv = document.createElement("div");
    deleteDiv.className = "delete-column";
    deleteDiv.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>';
    deleteDiv.onclick = function () { deleteColumnCreationDiv(deleteDiv); };
    characteristics.appendChild(deleteDiv);

    mainDiv.appendChild(characteristics);

    // Referência (FK)
    const referenciaDiv = document.createElement("div");
    referenciaDiv.className = "referencia";
    referenciaDiv.style.display = "none";

    const referenciaP = document.createElement("p");
    referenciaP.textContent = "Referência";
    referenciaDiv.appendChild(referenciaP);

    const refCustomDropdown = document.createElement("div");
    refCustomDropdown.className = "custom-dropdown";

    const refButton = document.createElement("button");
    refButton.type = "button";
    refButton.className = "custom-dropdown-trigger";

    const refSpan = document.createElement("span");
    refSpan.className = "custom-dropdown-value";
    refSpan.textContent = "Crie outra tabela";
    refButton.appendChild(refSpan);

    const refMenu = document.createElement("ul");
    refMenu.className = "custom-dropdown-menu";

    const refHiddenInput = document.createElement("input");
    refHiddenInput.type = "hidden";
    refHiddenInput.name = "column-type";
    refHiddenInput.value = "text";

    refCustomDropdown.appendChild(refButton);
    refCustomDropdown.appendChild(refMenu);
    refCustomDropdown.appendChild(refHiddenInput);
    referenciaDiv.appendChild(refCustomDropdown);

    mainDiv.appendChild(referenciaDiv);

    // Default input
    const defaultDiv = document.createElement("div");
    defaultDiv.className = "default-input-text";
    defaultDiv.style.display = "none";

    const defaultP = document.createElement("p");
    defaultP.textContent = "Default";
    defaultDiv.appendChild(defaultP);

    const defaultInput = document.createElement("input");
    defaultInput.type = "text";
    defaultInput.placeholder = "Valor padrão";
    defaultDiv.appendChild(defaultInput);

    mainDiv.appendChild(defaultDiv);

    parent.appendChild(mainDiv);
    updateCustomDropdowns();
}

function deleteColumnCreationDiv(button: HTMLElement) {
    const div = button.parentElement!.parentElement!;
    div.remove();
}

function changeDatabaseDropdown() {
    const dropdown = document.querySelector("#databases .custom-dropdown") as HTMLElement;
    const trigger = dropdown.querySelector(".custom-dropdown-trigger") as HTMLElement;
    trigger.textContent = currentDatabase ? currentDatabase : "Selecione uma database";
    const menu = dropdown.querySelector(".custom-dropdown-menu") as HTMLElement;
    menu.innerHTML = "";
    for (let database in databases) {
        const option = document.createElement("li");
        option.classList.add("custom-dropdown-option");
        option.addEventListener("click", () => {
            currentDatabase = database;
            currentTable = null;
            changeTabelasLista();
            changeTabelaSelecionadaTabela();
            changeTabelaInfoVariosBotoes();
        });
        if (database === currentDatabase) option.classList.add("custom-dropdown-option-selected");
        option.textContent = database;
        menu.appendChild(option);
    }

    updateCustomDropdowns();
}

function changeTabelasLista() {
    if (currentDatabase === null) return;
    const tabelasLista = document.getElementById("tabelas-lista")!;
    tabelasLista.innerHTML = "";
    for (let tabela in databases[currentDatabase!].tables) {
        const option = document.createElement("div");
        if (tabela === currentTable) {
            option.classList.add("tabela", "tabela-ativa");
        } else {
            option.classList.add("tabela");
        }
        tabelasLista.querySelector(".tabela-ativa")?.classList.remove("tabela-ativa");

        option.addEventListener("click", () => {
            currentTable = tabela;
            tabelasLista.querySelector(".tabela-ativa")?.classList.remove("tabela-ativa");
            option.classList.add("tabela-ativa");
            changeTabelaSelecionadaTabela();
            changeTabelaInfoVariosBotoes();
        });

        const name = document.createElement("p");
        name.textContent = tabela;
        option.appendChild(name);

        const size = document.createElement("p");
        size.textContent = `${Object.keys(databases[currentDatabase!].tables[tabela].columns).length}`;
        option.appendChild(size);

        tabelasLista.appendChild(option);
    }
}

function changeTabelaSelecionadaTabela() {
    if (currentDatabase === null) {
        return;
    } else if (currentTable === null) {
        document.getElementById("nenhuma-tabela-selecionada")!.style.display = "flex";
        document.getElementById("tabela-selecionada-tabela")!.style.display = "none";
        return;
    }
    document.getElementById("nenhuma-tabela-selecionada")!.style.display = "none";
    const selectedTable = document.getElementById("tabela-selecionada-tabela")!;
    selectedTable.style.display = "flex";

    const table = databases[currentDatabase!].tables[currentTable!];

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

    document.getElementById("tabela-selecionada-tabela")!.innerHTML = "";
    document.getElementById("tabela-selecionada-tabela")!.appendChild(divLinha);

    table.rows.forEach((row, index) => {
        let divLinha = document.createElement("div");
        divLinha.classList.add("linha-tabela");
        Object.values(row).forEach((value) => {
            const divCelula = document.createElement("div");
            divCelula.innerHTML = `<p>${value}</p>`;
            divLinha.appendChild(divCelula);
        });
        const rowActions = document.createElement("div");
        rowActions.innerHTML = `
            <button onclick="abrirFechar(false, 'editar-linha'); changeEditRowMenu(${index})">
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-pencil"></use></svg>
            </button>
            <button>
                <svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>
            </button>
        `;
        divLinha.appendChild(rowActions);

        document.getElementById("tabela-selecionada-tabela")!.appendChild(divLinha);
    });
}

function changeTabelaInfoVariosBotoes() {
    if (currentDatabase === null) {
        return;
    } else if (currentTable === null) {
        const tabelaInfo = document.getElementById("tabela-info-varios-botoes")!;
        tabelaInfo.querySelector("#nome-tabela")!.textContent = "Nenhuma tabela selecionada";
        tabelaInfo.querySelector("#linhas-colunas")!.textContent = "0 linhas • 0 colunas";
    } else {
        const tabelaInfo = document.getElementById("tabela-info-varios-botoes")!;
        tabelaInfo.querySelector("#nome-tabela")!.textContent = currentTable;
        tabelaInfo.querySelector("#linhas-colunas")!.textContent = `${Object.keys(databases[currentDatabase!].tables[currentTable!].rows).length} linhas • ${Object.keys(databases[currentDatabase!].tables[currentTable!].columns).length} colunas`;
    }
}

// central menus
function changeEditColumnsMenu() {
    if (currentDatabase === null) return;
    const menu = document.getElementById("lista-colunas-existentes")!;
    menu.innerHTML = "";
    if (currentTable === null) {
        menu.innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        return;
    } else if (Object.keys(databases[currentDatabase!].tables[currentTable!].columns).length === 0) {
        menu.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }
    Object.values(databases[currentDatabase!].tables[currentTable!].columns).forEach((column) => {
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

function changeAddRowMenu() {
    if (currentDatabase === null) return;
    const menuUl = document.querySelector("#colunas-inserir-linha")!;
    menuUl.innerHTML = "";
    if (currentTable === null) {
        menuUl.innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        return;
    } else if (Object.keys(databases[currentDatabase!].tables[currentTable!].columns).length === 0) {
        menuUl.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }

    Object.values(databases[currentDatabase!].tables[currentTable!].columns).forEach((column) => {
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
        } else if (column.type === "integer" || column.type === "float") {
            const input = document.createElement("input");
            input.type = "number";
            input.step = "any";
            div.appendChild(input);
        } else if (column.type === "boolean") {
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
        } else {
            const input = document.createElement("input");
            input.type = "text";
            div.appendChild(input);
        }
    });
}

function updateCharacteristics(parentDiv: Element) {
    // pegar inputs
    const pkInput = parentDiv.querySelector("input.primary-key") as HTMLInputElement;
    const fkInput = parentDiv.querySelector("input.foreign-key") as HTMLInputElement;
    const notNullInput = parentDiv.querySelector("input.not-null") as HTMLInputElement;
    const uniqueInput = parentDiv.querySelector("input.unique") as HTMLInputElement;
    const autoIncInput = parentDiv.querySelector("input.auto-increment") as HTMLInputElement;
    const defaultInput = parentDiv.querySelector("input.default") as HTMLInputElement;

    const typeDropdown = parentDiv.querySelector(".custom-dropdown button") as HTMLElement;

    const notNullLabel = notNullInput.parentElement as HTMLElement;
    const autoIncLabel = autoIncInput.parentElement as HTMLElement;

    const state = {
        pk: pkInput.checked,
        fk: fkInput.checked,
        notNull: notNullInput.checked,
        unique: uniqueInput.checked,
        autoIncrement: autoIncInput.checked,
        default: defaultInput.checked,
        type: typeDropdown.textContent!.toLowerCase() as columnType
    };

    const forced = {
        notNull: state.pk || state.autoIncrement
    };

    const hidden = {
        notNull: state.pk || state.autoIncrement,
        autoIncrement: state.type !== "integer"
    };

    const disabled = {
        autoIncrement: state.fk || state.default || state.type !== "integer",
        default: state.autoIncrement,
        fk: state.autoIncrement
    };

    // NOT NULL
    notNullInput.checked = state.notNull || forced.notNull;
    notNullLabel.style.display = hidden.notNull ? "none" : "block";

    // AUTO INCREMENT
    autoIncLabel.style.display = hidden.autoIncrement ? "none" : "block";

    // DEFAULT
    defaultInput.disabled = disabled.default;

    // FK
    fkInput.disabled = disabled.fk;

    // REFERÊNCIA (FK)
    const referenciaDiv = parentDiv.parentElement!.querySelector("div.referencia") as HTMLElement;
    referenciaDiv.style.display = fkInput.checked ? "block" : "none";
}

function changeEditRowMenu(rowIndex: number) {
    if (currentDatabase === null) return;
    const menuUl = document.getElementById("colunas-editar-linha")!;
    menuUl.innerHTML = "";
    if (Object.keys(databases[currentDatabase!].tables[currentTable!].columns).length === 0) {
        menuUl.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }

    const editButton = menuUl.parentElement!.querySelector("button#editar-linha-button")! as HTMLButtonElement;
    editButton.onclick = function () { editRowInterface(rowIndex); };

    Object.values(databases[currentDatabase!].tables[currentTable!].columns).forEach((column) => {
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
        } else if (column.type === "integer" || column.type === "float") {
            const input = document.createElement("input");
            input.type = "number";
            input.step = "any";
            input.value = databases[currentDatabase!].tables[currentTable!].rows[rowIndex][column.name];
            div.appendChild(input);
        } else if (column.type === "boolean") {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            dropdown.innerHTML = `
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                ${databases[currentDatabase!].tables[currentTable!].rows[rowIndex][column.name] ? "True" : "False"}
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option ${databases[currentDatabase!].tables[currentTable!].rows[rowIndex][column.name] ? '' : 'custom-dropdown-option-selected'}">False</li>
                <li class="custom-dropdown-option ${databases[currentDatabase!].tables[currentTable!].rows[rowIndex][column.name] ? 'custom-dropdown-option-selected' : ''}">True</li>
            </ul>
            <input type="hidden" value="text">
            `;
            div.appendChild(dropdown);
            updateCustomDropdowns();
        } else {
            const input = document.createElement("input");
            input.type = "text";
            input.value = databases[currentDatabase!].tables[currentTable!].rows[rowIndex][column.name];
            div.appendChild(input);
        }
    });
}

//#endregion

document.addEventListener("click", closeAllCustomDropdowns);
document.getElementById("menus-centrais")!.addEventListener("click", (event) => {
    if (event.target !== event.currentTarget) return;

    document.querySelectorAll("#menus-centrais > div").forEach((m) => {
        const menu = m as HTMLElement;
        menu.style.display = "none";
    });
    document.getElementById("menus-centrais")!.style.display = "none";
});

createExempleDatabase();