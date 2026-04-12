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

    constructor(name: string) {
        this.name = name;
        this.columns = {};
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
}

function createTable(table: Table) {
    databases[currentDatabase!].tables[table.name] = table;
    currentTable = table.name;
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
    changeDatabaseDropdown();
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

    for (const columnDiv of Array.from(columnsUl.querySelectorAll(":scope > div"))) {
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
    changeTabelasLista();
    openNotifications(`<p style='color: var(--green5)'>Tabela "${tableName}" criada com sucesso!</p>`);
}

function createColumnCreationDiv(parent: HTMLElement) {
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