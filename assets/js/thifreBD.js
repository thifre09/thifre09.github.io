"use strict";
// #region Change interface terminal
const buttonChangeToGrafical = document.getElementById("button-header-interface");
const buttonChangeToTerminal = document.getElementById("button-header-terminal");
const buttonChangeToLogical = document.getElementById("button-header-logical");
const buttonChangeToSave = document.getElementById("button-header-save");
const buttonChangeToHelp = document.getElementById("button-header-help");
const interfaceTerminal = document.getElementById("interface-terminal");
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
function changeTo(id) {
    document.getElementById("interface-grafica").style.display = "none";
    document.getElementById("terminal").style.display = "none";
    document.getElementById("logical").style.display = "none";
    document.getElementById("save").style.display = "none";
    document.getElementById("help").style.display = "none";
    document.getElementById(id).style.display = "flex";
    document.querySelector(".interface-terminal-ativo")?.classList.remove("interface-terminal-ativo");
    switch (id) {
        case "interface-grafica":
            buttonChangeToGrafical.classList.add("interface-terminal-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToGrafical);
            break;
        case "terminal":
            buttonChangeToTerminal.classList.add("interface-terminal-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToTerminal);
            break;
        case "logical":
            buttonChangeToLogical.classList.add("interface-terminal-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToLogical);
            break;
        case "save":
            buttonChangeToSave.classList.add("interface-terminal-ativo");
            updateInterfaceTerminalIndicator(buttonChangeToSave);
            break;
        case "help":
            buttonChangeToHelp.classList.add("interface-terminal-ativo");
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
});
buttonChangeToSave.addEventListener("click", () => {
    changeTo("save");
});
buttonChangeToHelp.addEventListener("click", () => {
    changeTo("help");
});
window.addEventListener('load', () => updateInterfaceTerminalIndicator(buttonChangeToGrafical));
// #endregion
// #region Others
let timeout;
/**
 * Verifica se um nome segue o padrão permitido para identificadores SQL.
 * @param name - Nome a ser validado.
 * @returns `true` quando o nome é válido.
 */
function isValidSQLName(name) {
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
 * Cria uma `Date` usando apenas o componente de hora.
 * @param hours - Hora.
 * @param minutes - Minutos opcionais.
 * @param seconds - Segundos opcionais.
 * @returns Data ajustada para o horário informado.
 */
function createTimeValue(hours, minutes = 0, seconds = 0) {
    const d = new Date();
    d.setHours(hours, minutes, seconds, 0);
    return d;
}
/**
 * Garante que um valor seja uma instância válida de Date
 * @param value - Valor a ser convertido (Date, string, number ou null)
 * @returns Instância de Date válida ou null
 */
function ensureDate(value) {
    if (value === null || value === undefined)
        return null;
    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
    }
    if (typeof value === 'string') {
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }
    if (typeof value === 'number') {
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
}
function ensureTime(value) {
    if (typeof value !== "string")
        return null;
    const match = value.match(/^(\d{2}):(\d{2}):(\d{2})$/);
    if (!match)
        return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    const seconds = Number(match[3]);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return null;
    }
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
}
/**
 * Formata uma Date para exibição de data (DD/MM/YYYY)
 * @param value - Valor a ser formatado
 * @returns String formatada ou valor original
 */
function formatDateForDisplay(value) {
    const date = ensureDate(value);
    if (!date)
        return String(value || '');
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
/**
 * Formata uma Date para exibição de hora (HH:MM:SS)
 * @param value - Valor a ser formatado
 * @returns String formatada ou valor original
 */
function formatTimeForDisplay(value) {
    const date = ensureDate(value);
    if (!date)
        return String(value || '');
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}
/**
 * Formata uma Date para input HTML (YYYY-MM-DD)
 * @param value - Valor a ser formatado
 * @returns String formatada para input date ou string vazia
 */
function formatDateForInput(value) {
    const date = ensureDate(value);
    if (!date)
        return '';
    const year = String(date.getFullYear()).padStart(4, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
/**
 * Formata uma Date para input HTML (HH:MM)
 * @param value - Valor a ser formatado
 * @returns String formatada para input time ou string vazia
 */
function formatTimeForInput(value) {
    const date = ensureDate(value);
    if (!date)
        return '';
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}
/**
 * Cria ou seleciona a database de exemplo com tabelas e registros pré-carregados.
 */
function createExempleDatabase() {
    const originalLocalStorage = localStorage.getItem("thifre_db");
    const databaseName = "thifre_db";
    if (databases[databaseName]) {
        currentDatabase = databaseName;
        currentTable = Object.keys(databases[databaseName].tables)[0] ?? null;
        refreshUI();
        changeEditColumnsMenu();
        changeInsertRowMenu();
        openNotifications("<p style='color: var(--yellow5)'>A database de exemplo ja existe e foi selecionada.</p>");
        return;
    }
    SGBDFunctions.createDatabase(new Database(databaseName));
    const usuarios = new Table("usuarios");
    usuarios.columns["id"] = new Column("id", "integer", true, false, true, true, true, false);
    usuarios.columns["nome"] = new Column("nome", "text", false, false, true, false, false, false);
    usuarios.columns["email"] = new Column("email", "text", false, false, true, true, false, false);
    usuarios.columns["ativo"] = new Column("ativo", "boolean", false, false, false, false, false, true);
    usuarios.columns["ativo"].defaultValue = true;
    usuarios.columns["nota"] = new Column("nota", "float", false, false, false, false, false, true);
    usuarios.columns["nota"].defaultValue = 0;
    usuarios.columns["criado_em"] = new Column("criado_em", "date", false, false, true, false, false, false, true);
    usuarios.columns["hora_entrada"] = new Column("hora_entrada", "time", false, false, false, false, false, true, false);
    usuarios.columns["hora_entrada"].defaultValue = "09:00";
    usuarios.columns["perfil"] = new Column("perfil", "enum", false, false, true, false, false, true, false, ["admin", "editor", "leitor"]);
    usuarios.columns["perfil"].defaultValue = "leitor";
    SGBDFunctions.createTable(usuarios);
    const idColumn = usuarios.columns["id"];
    SGBDFunctions.insertRow("usuarios", {
        id: idColumn.increment(),
        nome: "Alice",
        email: "alice@email.com",
        ativo: true,
        nota: 9.5,
        criado_em: new Date("2026-01-10"),
        hora_entrada: createTimeValue(8, 30),
        perfil: "admin"
    });
    SGBDFunctions.insertRow("usuarios", {
        id: idColumn.increment(),
        nome: "Bruno",
        email: "bruno@email.com",
        ativo: false,
        nota: 7.2,
        criado_em: new Date("2026-02-02"),
        hora_entrada: createTimeValue(9, 15),
        perfil: "editor"
    });
    SGBDFunctions.insertRow("usuarios", {
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
    posts.columns["usuario_id"] = new Column("usuario_id", "integer", false, true, true, false, false, false, false, undefined, { table: "usuarios", column: "id" });
    posts.columns["titulo"] = new Column("titulo", "text", false, false, true, false, false, false);
    posts.columns["conteudo"] = new Column("conteudo", "text", false, false, false, false, false, false);
    posts.columns["publicado"] = new Column("publicado", "boolean", false, false, false, false, false, true);
    posts.columns["publicado"].defaultValue = false;
    posts.columns["avaliacao"] = new Column("avaliacao", "float", false, false, false, false, false, true);
    posts.columns["avaliacao"].defaultValue = 0;
    posts.columns["status"] = new Column("status", "enum", false, false, true, false, false, true, false, ["rascunho", "publicado", "arquivado"]);
    posts.columns["status"].defaultValue = "rascunho";
    posts.columns["publicado_em"] = new Column("publicado_em", "date", false, false, false, false, false, false, false);
    SGBDFunctions.createTable(posts);
    const postIdColumn = posts.columns["id"];
    SGBDFunctions.insertRow("posts", {
        id: postIdColumn.increment(),
        usuario_id: 1,
        titulo: "Primeiro post",
        conteudo: "Exemplo de conteudo com todos os tipos.",
        publicado: true,
        avaliacao: 8.9,
        status: "publicado",
        publicado_em: new Date("2026-04-01")
    });
    SGBDFunctions.insertRow("posts", {
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
    auditoria.columns["acao"] = new Column("acao", "enum", false, false, true, false, false, false, false, ["INSERT", "UPDATE", "DELETE"]);
    auditoria.columns["sucesso"] = new Column("sucesso", "boolean", false, false, true, false, false, true);
    auditoria.columns["sucesso"].defaultValue = true;
    auditoria.columns["feito_em"] = new Column("feito_em", "date", false, false, true, false, false, false, true);
    SGBDFunctions.createTable(auditoria);
    const auditIdColumn = auditoria.columns["id"];
    SGBDFunctions.insertRow("auditoria", {
        id: auditIdColumn.increment(),
        entidade: "usuarios",
        entidade_id: 1,
        acao: "INSERT",
        sucesso: true,
        feito_em: new Date("2026-04-20")
    });
    SGBDFunctions.insertRow("auditoria", {
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
    SGBDFunctions.createTable(tarefas);
    const tarefaIdColumn = tarefas.columns["id"];
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Arrumar a mesa", concluida: true });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Responder mensagens", concluida: false });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Revisar o código", concluida: true });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Fazer backup", concluida: false });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Atualizar a documentação", concluida: true });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Testar o build", concluida: true });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Organizar imagens", concluida: false });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Separar ideias novas", concluida: false });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Revisar layout", concluida: true });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Limpar rascunhos", concluida: false });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Publicar atualização", concluida: false });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Conferir links", concluida: true });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Escrever resumo", concluida: false });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Rever cores", concluida: true });
    SGBDFunctions.insertRow("tarefas", { id: tarefaIdColumn.increment(), titulo: "Fechar pendências", concluida: false });
    currentTable = null;
    refreshUI();
    changeEditColumnsMenu();
    changeInsertRowMenu();
    openNotifications("<p style='color: var(--green5)'>Database de exemplo criada com sucesso!</p>");
    localStorage.setItem("thifre_db", originalLocalStorage || "");
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
/**
 * Representa uma database em memória com tabelas e relacionamentos.
 */
class Database {
    /**
     * Cria uma database vazia com o nome informado.
     * @param name - Nome da database.
     */
    constructor(name) {
        this.name = name;
        this.tables = {};
        this.foreignKeyMap = {};
    }
    /**
     * Lista as chaves estrangeiras que saem de uma tabela.
     * @param tableName - Nome da tabela de origem.
     * @returns Relações de saída da tabela.
     */
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
    /**
     * Retorna as referências recebidas por uma tabela.
     * @param tableName - Nome da tabela alvo.
     * @returns Mapa de colunas referenciadas.
     */
    getReferencesToTable(tableName) {
        return this.foreignKeyMap[tableName] || {};
    }
    /**
     * Resume os relacionamentos de uma tabela em entrada e saída.
     * @param tableName - Nome da tabela consultada.
     */
    getTableRelationships(tableName) {
        return {
            outgoing: this.getTableForeignKeys(tableName),
            incoming: this.getReferencesToTable(tableName)
        };
    }
    /**
     * Registra uma chave estrangeira apontando para outra tabela.
     * @param fromTable - Tabela de origem.
     * @param fromColumn - Coluna de origem.
     * @param toTable - Tabela referenciada.
     * @param toColumn - Coluna referenciada.
     */
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
    /**
     * Remove o vínculo de uma chave estrangeira registrada.
     * @param fromTable - Tabela de origem.
     * @param fromColumn - Coluna de origem.
     * @param toTable - Tabela referenciada.
     * @param toColumn - Coluna referenciada.
     */
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
}
/**
 * Representa uma tabela em memória com colunas, linhas e índices.
 */
class Table {
    /**
     * Cria uma tabela vazia com o nome informado.
     * @param name - Nome da tabela.
     */
    constructor(name) {
        this.name = name;
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
}
/**
 * Descreve uma coluna e suas restrições na estrutura da tabela.
 */
class Column {
    /**
     * Cria uma coluna com metadados e restrições.
     * @param name - Nome da coluna.
     * @param type - Tipo lógico da coluna.
     * @param isPrimaryKey - Indica chave primária.
     * @param isForeignKey - Indica chave estrangeira.
     * @param isNotNull - Indica restrição NOT NULL.
     * @param isUnique - Indica restrição UNIQUE.
     * @param isAutoIncrement - Indica incremento automático.
     * @param hasDefault - Indica valor padrão.
     * @param isCurrentTimestamp - Indica timestamp automático.
     * @param enumValues - Valores permitidos para ENUM.
     * @param reference - Referência usada por FOREIGN KEY.
     */
    constructor(name, type, isPrimaryKey = false, isForeignKey = false, isNotNull = false, isUnique = false, isAutoIncrement = false, hasDefault = false, isCurrentTimestamp = false, enumValues, reference) {
        this.incrementCounter = 1;
        this.name = name;
        this.type = type;
        this.isPrimaryKey = isPrimaryKey;
        this.isForeignKey = isForeignKey;
        this.isNotNull = isNotNull;
        this.isUnique = isUnique;
        this.isAutoIncrement = isAutoIncrement;
        this.hasDefault = hasDefault;
        this.isCurrentTimestamp = isCurrentTimestamp;
        this.isCurrentTimestamp = isCurrentTimestamp;
        this.enumValues = enumValues;
        this.reference = reference;
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
}
/**
 * Guarda o histórico e o estado de uma sessão do terminal SQL.
 */
class TerminalSession {
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
TerminalSession.sessionCount = 1;
TerminalSession.historyIndex = 0;
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
        currentTable = null;
        refreshUI();
        saveToLocalStorage();
    }
    /**
     * Adiciona uma tabela à database atual.
     * @param table - Tabela a ser criada.
     */
    static createTable(table) {
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
        saveToLocalStorage();
    }
    /**
     * Adiciona uma coluna a uma tabela existente.
     * @param tableName - Nome da tabela alvo.
     * @param column - Coluna a ser adicionada.
     */
    static addColumn(tableName, column) {
        databases[currentDatabase].tables[tableName].columns[column.name] = column;
        databases[currentDatabase].tables[tableName].indexes[column.name] = new Map();
        if (column.reference) {
            databases[currentDatabase].registerForeignKey(tableName, column.name, column.reference.table, column.reference.column);
        }
        refreshUI();
        saveToLocalStorage();
    }
    /**
     * Insere uma linha e atualiza os índices da tabela.
     * @param tableName - Nome da tabela alvo.
     * @param row - Dados da nova linha.
     */
    static insertRow(tableName, row) {
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
        saveToLocalStorage();
    }
    /**
     * Substitui uma linha existente e reconstrói os índices afetados.
     * @param tableName - Nome da tabela alvo.
     * @param oldRowIndex - Índice da linha antiga.
     * @param newRow - Novo conteúdo da linha.
     */
    static editRow(tableName, oldRowIndex, newRow) {
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
        saveToLocalStorage();
    }
    /**
     * Remove uma database do armazenamento em memória.
     * @param databaseName - Nome da database.
     */
    static deleteDatabase(databaseName) {
        delete databases[databaseName];
        if (currentDatabase === databaseName) {
            currentDatabase = null;
            currentTable = null;
        }
        refreshUI();
        saveToLocalStorage();
    }
    /**
     * Remove uma tabela e desfaz as chaves estrangeiras de saída.
     * @param tableName - Nome da tabela.
     */
    static deleteTable(tableName) {
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
        saveToLocalStorage();
    }
    /**
     * Remove uma coluna e limpa seus índices e dados.
     * @param tableName - Nome da tabela.
     * @param columnName - Nome da coluna.
     */
    static deleteColumn(tableName, columnName) {
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
        saveToLocalStorage();
    }
    /**
     * Remove uma linha e ajusta os índices remanescentes.
     * @param tableName - Nome da tabela.
     * @param rowIndex - Índice da linha a remover.
     */
    static deleteRow(tableName, rowIndex) {
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
        saveToLocalStorage();
    }
    static renameDatabase(oldName, newName) {
        const db = databases[oldName];
        if (!db)
            return;
        delete databases[currentDatabase];
        db.name = newName;
        databases[newName] = db;
        currentDatabase = newName;
        refreshUI();
        saveToLocalStorage();
    }
    static renameTable(oldName, newName) {
        const t = databases[currentDatabase].tables[oldName];
        if (!t)
            return;
        delete databases[currentDatabase].tables[oldName];
        t.name = newName;
        databases[currentDatabase].tables[newName] = t;
        currentTable = newName;
        refreshUI();
        saveToLocalStorage();
    }
}
let databases = {};
let currentDatabase = null;
let currentTable = null;
let terminalSessions = [];
let currentTerminalSession = 0;
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
    SGBDFunctions.createDatabase(new Database(databaseName));
    databaseNameInput.value = "";
    openNotifications(`<p style='color: var(--green4)'>Database "${databaseName}" criada com sucesso!</p>`);
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
        else if (column.isCurrentTimestamp || column.isCurrentTimestamp) {
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
        SGBDFunctions.addColumn(table.name, column);
    }
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl);
    changeEditColumnsMenu();
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
                table.revertAutoIncrementValues(valuesBeforeIncrement);
                return;
            }
            row[columnName] = value === "True";
            continue;
        }
        if (table.columns[columnName].isCurrentTimestamp || table.columns[columnName].isCurrentTimestamp) {
            row[columnName] = new Date();
            continue;
        }
        const input = column.querySelector("input");
        if (table.columns[columnName].isUnique && table.indexes[columnName].has(input.value)) {
            openNotifications(`<p style='color: var(--red5)'>O valor "${input.value}" já existe para a coluna "${columnName}".</p>`);
            table.revertAutoIncrementValues(valuesBeforeIncrement);
            return;
        }
        if (input.value.trim() === "") {
            if (table.columns[columnName].isNotNull) {
                openNotifications(`<p style='color: var(--red5)'>A coluna "${columnName}" não pode ser nula.</p>`);
                table.revertAutoIncrementValues(valuesBeforeIncrement);
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
            // Garante que sempre é uma instância de Date
            const dateValue = new Date(input.value + "T00:00:00");
            row[columnName] = !isNaN(dateValue.getTime()) ? dateValue : null;
        }
        else if (table.columns[columnName].type === "time") {
            // Garante que sempre é uma instância de Date
            const [hora, minuto, segundo] = input.value.split(":").map(Number);
            const timeValue = new Date();
            timeValue.setHours(hora, minuto, segundo || 0, 0);
            row[columnName] = !isNaN(timeValue.getTime()) ? timeValue : null;
        }
        else {
            row[columnName] = input.value;
        }
    }
    SGBDFunctions.insertRow(currentTable, row);
    changeInsertRowMenu();
    openNotifications(`<p style='color: var(--green5)'>Linha inserida com sucesso!</p>`);
}
/**
 * Atualiza uma linha existente a partir do formulário de edição.
 * @param rowIndex - Índice da linha que será alterada.
 */
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
            ;
            continue;
        }
        if (table.columns[columnName].type === "boolean") {
            const value = column.querySelector(".custom-dropdown button").textContent;
            if (table.columns[columnName].isUnique && table.indexes[columnName].has(value === "True")) {
                if (value === "True" && table.rows[rowIndex][columnName] !== true) {
                    openNotifications(`<p style='color: var(--red5)'>O valor "${value}" já existe para a coluna "${columnName}".</p>`);
                    return;
                }
            }
            row[columnName] = value === "True";
            continue;
        }
        if (table.columns[columnName].type === "enum") {
            const value = column.querySelector(".custom-dropdown button").textContent.trim();
            if (table.columns[columnName].isUnique && table.indexes[columnName].has(value)) {
                if (value !== table.rows[rowIndex][columnName]) {
                    openNotifications(`<p style='color: var(--red5)'>O valor "${value}" já existe para a coluna "${columnName}".</p>`);
                    return;
                }
            }
            row[columnName] = value;
            continue;
        }
        if (table.columns[columnName].isCurrentTimestamp || table.columns[columnName].isCurrentTimestamp) {
            row[columnName] = new Date();
            continue;
        }
        const input = column.querySelector("input");
        if (table.columns[columnName].isUnique && table.indexes[columnName].has(input.value)) {
            if (input.value !== table.rows[rowIndex][columnName]) {
                openNotifications(`<p style='color: var(--red5)'>O valor "${input.value}" já existe para a coluna "${columnName}".</p>`);
                return;
            }
        }
        if (input.value.trim() === "") {
            if (table.columns[columnName].isNotNull) {
                openNotifications(`<p style='color: var(--red5)'>A coluna "${columnName}" não pode ser nula.</p>`);
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
            // Garante que sempre é uma instância de Date
            const dateValue = new Date(input.value + "T00:00:00");
            row[columnName] = !isNaN(dateValue.getTime()) ? dateValue : null;
        }
        else if (table.columns[columnName].type === "time") {
            // Garante que sempre é uma instância de Date
            const [hora, minuto, segundo] = input.value.split(":").map(Number);
            const timeValue = new Date();
            timeValue.setHours(hora, minuto, segundo || 0, 0);
            row[columnName] = !isNaN(timeValue.getTime()) ? timeValue : null;
        }
        else {
            row[columnName] = input.value;
        }
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
    const newName = databaseNameInput.value.trim().toLowerCase();
    if (newName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da database não pode ser vazio.</p>");
    }
    else if (databases[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma database com esse nome.</p>");
    }
    else {
        SGBDFunctions.renameDatabase(currentDatabase, newName);
        openNotifications("<p style='color: var(--green5)'>Database renomeada com sucesso!</p>");
    }
    updateCustomDropdowns();
    changeDatabaseDropdown();
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
    else if (databases[currentDatabase].tables[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma tabela com esse nome.</p>");
    }
    else {
        SGBDFunctions.renameTable(currentTable, newName);
        openNotifications("<p style='color: var(--green5)'>Tabela renomeada com sucesso!</p>");
    }
    refreshUI();
}
// Other interface functions
/**
 * Recria as opções do seletor de databases.
 */
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
/**
 * Recria a lista lateral com as tabelas da database selecionada.
 */
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
        Object.values(table.columns).forEach((column) => {
            const divCelula = document.createElement("div");
            let value = row[column.name];
            let displayValue = value;
            if (column && column.type === "date" && value !== null) {
                displayValue = formatDateForDisplay(value);
            }
            else if (column && column.type === "time" && value !== null) {
                displayValue = formatTimeForDisplay(value);
            }
            else if (value instanceof Date) {
                displayValue = formatDateForDisplay(value);
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
/**
 * Atualiza o resumo exibido no painel de ações da tabela.
 */
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
        const isCurrentTimestamp = columnDiv.querySelector(".auto-date");
        const column = new Column(columnName, columnTypeElement.textContent.toLowerCase(), isPrimaryKey.checked, isForeignKey.checked, isNotNull.checked, isUnique.checked, isAutoIncrement.checked, hasDefault.checked, isCurrentTimestamp.checked);
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
            if (databases[currentDatabase].tables[referenceTableElement.textContent].columns[referenceColumnElement.textContent].type !== column.type) {
                openNotifications("<p style='color: var(--red5)'>O tipo da coluna de referência não corresponde ao tipo da coluna.</p>");
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
            let displayValue;
            if (columnType === "date") {
                displayValue = formatDateForDisplay(value);
                if (displayValue === "")
                    displayValue = "null";
            }
            else if (columnType === "time") {
                displayValue = formatTimeForDisplay(value);
                if (displayValue === "")
                    displayValue = "null";
            }
            else {
                displayValue = String(value);
                if (displayValue === "")
                    displayValue = "null";
            }
            div.innerHTML = `
                <h5>${columnName} (${columnType})</h5>
                <p>${displayValue}</p>
            `;
            ul.appendChild(div);
        }
    }
    else {
        for (let i = 0; i < databases[currentDatabase].tables[currentTable].rows.length; i++) {
            const div = document.createElement("div");
            const value = databases[currentDatabase].tables[currentTable].rows[i][columnName];
            const columnType = databases[currentDatabase].tables[currentTable].columns[columnName].type.toLocaleLowerCase();
            let displayValue;
            if (columnType === "date") {
                displayValue = formatDateForDisplay(value);
                if (displayValue === "")
                    displayValue = "null";
            }
            else if (columnType === "time") {
                displayValue = formatTimeForDisplay(value);
                if (displayValue === "")
                    displayValue = "null";
            }
            else {
                displayValue = String(value);
                if (displayValue === "")
                    displayValue = "null";
            }
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
    changeDatabaseDropdown();
    changeTabelasLista();
    changeTabelaSelecionadaTabela();
    changeTabelaInfoVariosBotoes();
    showHideTabelaSelecionadaLinhaColuna(false);
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
    deleteDiv.innerHTML = '<svg class="trash-icon last-item-flex-wrap-div" height="24" width="24" viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>';
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
/**
 * Atualiza o campo do menu de configuração de tabela.
 */
function changeConfigurarTabelaMenu() {
    const menu = document.getElementById("configurar-tabela");
    if (currentDatabase === null || currentTable === null) {
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
            { key: "isCurrentTimestamp", label: "Current timestamp" },
            { key: "isCurrentTimestamp", label: "Current timestamp" }
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
        else if (column.type === "time") {
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
/**
 * Recria o menu de edição de uma linha específica.
 * @param rowIndex - Índice da linha que será editada.
 */
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
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            }
            else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "date";
                const value = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
                input.value = formatDateForInput(value);
                div.appendChild(input);
            }
        }
        else if (column.type === "time") {
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
                const value = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
                input.value = formatTimeForInput(value);
                div.appendChild(input);
            }
        }
        else if (column.type === "enum") {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            const currentValue = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
            const enumValues = column.enumValues ?? [];
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
            const value = databases[currentDatabase].tables[currentTable].rows[rowIndex][column.name];
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
    const isReferenceByDiv = document.querySelector("#is-referenced-by-search");
    isReferenceByDiv.innerHTML = "";
    const relationships = databases[currentDatabase].getTableRelationships(currentTable);
    const currentTableReferences = relationships.outgoing;
    const referencedBy = relationships.incoming;
    // OUTGOING
    if (currentTableReferences.length === 0) {
        referencesDiv.innerHTML =
            "<p>Não há chaves estrangeiras nessa tabela para realizar joins</p>";
    }
    else {
        currentTableReferences.forEach((ref) => {
            const buttonRef = document.createElement("button");
            buttonRef.classList.add("reference-button");
            buttonRef.innerHTML = `
                <p class="text2">
                    ${ref.column}
                    → ${ref.referenceTable}.${ref.referenceColumn}
                </p>
            `;
            buttonRef.onclick = function () {
                buttonRef.classList.toggle("reference-button-active");
            };
            referencesDiv.appendChild(buttonRef);
        });
    }
    // INCOMING
    if (Object.keys(referencedBy).length === 0) {
        isReferenceByDiv.innerHTML = "<p>Essa tabela não é referenciada por nenhuma chave estrangeira para realizar joins</p>";
    }
    else {
        Object.entries(referencedBy).forEach(([columnName, refs]) => {
            refs.forEach((ref) => {
                const buttonRef = document.createElement("button");
                buttonRef.classList.add("reference-button");
                buttonRef.innerHTML = `
                    <p class="text2">
                        ${ref.table}.${ref.column}
                        → ${columnName}
                    </p>
                `;
                buttonRef.onclick = function () {
                    buttonRef.classList.toggle("reference-button-active");
                };
                isReferenceByDiv.appendChild(buttonRef);
            });
        });
    }
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
                    display = formatDateForDisplay(value);
                }
                else if (column.type === "time" && value !== null) {
                    display = formatTimeForDisplay(value);
                }
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
            SGBDFunctions.deleteDatabase(currentDatabase);
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
            SGBDFunctions.deleteTable(currentTable);
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
    const defaultLabel = defaultInput.parentElement;
    const state = {
        pk: pkInput.checked,
        fk: fkInput.checked,
        notNull: notNullInput.checked,
        unique: uniqueInput.checked,
        default: defaultInput.checked,
        autoIncrement: autoIncInput.checked,
        currentTimestamp: currentTimestampInput.checked,
        type: typeDropdown.textContent.toLowerCase()
    };
    const forcedTrue = {
        notNull: state.pk || state.autoIncrement,
        unique: state.autoIncrement
    };
    const forcedFalse = {
        fk: state.autoIncrement || state.currentTimestamp || state.currentTimestamp,
        default: state.autoIncrement || state.currentTimestamp || state.currentTimestamp || state.type === "boolean",
        autoIncrement: state.fk || state.default || state.type !== "integer",
        currentTimestamp: state.fk || state.default || state.type !== "date" && state.type !== "time",
    };
    const hidden = {
        autoIncrement: state.type !== "integer",
        currentTimestamp: state.type !== "date" && state.type !== "time",
        default: state.type === "boolean",
    };
    const disabled = {
        notNull: state.pk || state.autoIncrement,
        unique: state.autoIncrement,
        autoIncrement: state.fk || state.default || state.type !== "integer",
        currentTimestamp: state.fk || state.default || state.type !== "date" && state.type !== "time",
        default: state.autoIncrement || state.currentTimestamp || state.currentTimestamp || state.type === "boolean",
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
    // AUTO TIME
    currentTimestampLabel.style.display = hidden.currentTimestamp ? "none" : "flex";
    currentTimestampInput.checked = state.currentTimestamp && !forcedFalse.currentTimestamp;
    currentTimestampInput.disabled = disabled.currentTimestamp;
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
/**
 * Troca o tipo do campo de valor padrão conforme o tipo da coluna.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
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
/**
 * Atualiza as tabelas disponíveis para referência de chave estrangeira.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
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
/**
 * Atualiza as colunas disponíveis na tabela de referência selecionada.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
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
        if (referencedTable.columns[columnName].isPrimaryKey || referencedTable.columns[columnName].isUnique) {
            columnSelect.innerHTML += `
                <li class="custom-dropdown-option ${i === 0 ? "custom-dropdown-option-selected" : ""}">${columnName}</li>
            `;
        }
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
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <use href="assets/images/icons-sprite.svg#icon-close"></use>
    </svg>`;
    closeButton.onclick = function () {
        if (terminalSessions.length === 1)
            return; // não permite fechar a última sessão
        terminalSessionsContainer.removeChild(sessionDiv);
        currentTerminalSession = 0;
    };
    sessionDiv.appendChild(closeButton);
}
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
// #endregion
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
// To Do
// -Pesquisar(Dashboard)
// -Editar colunas (Dashboard)
// -Terminal
// -Salvar e carregar em SQL
// -Modelo lógico (diagrama de entidade relacionamento)
// -Aba de ajuda
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
        constructor(fullCommand, tokens) {
            this.fullCommand = fullCommand;
            this.tokens = tokens;
        }
        execute() {
            const target = this.tokens[1]?.toLowerCase();
            switch (target) {
                case "database":
                    this.database();
                    break;
                case "table":
                    this.table();
                    break;
                default:
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE incorreto"], "error");
            }
        }
        database() {
            if (this.tokens.length < 6 || this.tokens.length > 6) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE DATABASE incorreto", "Sintaxe incorreta"], "error");
                return;
            }
            if (databases[this.tokens[5]]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma database com o nome "${this.tokens[2]}"`], "error");
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
        table() {
        }
    }
    SQL.SQLAlter = SQLAlter;
    /**
     * Implementa o comando SQL CREATE.
     */
    class SQLCreate {
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
            SGBDFunctions.createDatabase(new Database(databaseName));
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Database "${databaseName}" criada com sucesso!`], "success");
        }
        /**
         * Executa CREATE TABLE.
         */
        table() {
            const tableName = this.tokens[2];
            if (currentDatabase === null) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE TABLE incorreto", "Nenhuma database selecionada"], "error");
                return;
            }
            if (!isValidSQLName(tableName)) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da tabela inválido"], "error");
                return;
            }
            if (databases[currentDatabase].tables[tableName]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma tabela com o nome "${tableName}" nessa database`], "error");
                return;
            }
            if (this.tokens[3] !== "(" || this.tokens[this.tokens.length - 1] !== ")") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE TABLE incorreto", "Sintaxe inválida para a definição da tabela"], "error");
                return;
            }
            if (SQL.keyWords.includes(this.tokens[2].toLowerCase())) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da tabela é uma palavra-chave reservada"], "error");
                return;
            }
            let table = new Table(tableName);
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
        constructor(fullCommand, tokens) {
            this.fullCommand = fullCommand;
            this.tokens = tokens;
        }
        // ver () dentro de strings
        insert() {
            const t = this.tokens;
            if (currentDatabase === null) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nenhuma database selecionada"], "error");
                return;
            }
            if (t.length < 7 || t[1]?.toLowerCase() !== "into") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Sintaxe inválida"], "error");
                return;
            }
            const tableName = t[2];
            if (!databases[currentDatabase].tables[tableName]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Tabela "${tableName}" não existe na database "${currentDatabase}"`], "error");
                return;
            }
            const table = databases[currentDatabase].tables[tableName];
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
                this.getRowValuesAndInsert(endValuesIndex + 2, tableName, columnsToBeInserted);
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
            this.getRowValuesAndInsert(4, tableName, columnsToBeInserted);
        }
        getRowValuesAndInsert(startIndex, tableName, columnsToBeInserted) {
            const t = this.tokens;
            const table = databases[currentDatabase].tables[tableName];
            let depth = 0;
            let columnIndex = 0;
            const rowsToBeInserted = [];
            let row = {};
            let value = "";
            for (let i = startIndex; i < t.length; i++) {
                const token = t[i];
                if (token === "(") {
                    depth++;
                    if (depth === 1) {
                        row = {};
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
                    row[columnsToBeInserted[columnIndex]] = value;
                    depth--;
                    if (columnIndex + 1 !== columnsToBeInserted.length) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Quantidade de valores diferente da quantidade de colunas"], "error");
                        return;
                    }
                    rowsToBeInserted.push({ ...row });
                    row = {};
                    columnIndex = 0;
                    value = "";
                    continue;
                }
                if (token === "," && depth === 1) {
                    row[columnsToBeInserted[columnIndex]] = value;
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
                    if (!columnsToBeInserted.includes(columnName)) {
                        if (table.columns[columnName].isNotNull) {
                            if (table.columns[columnName].defaultValue !== undefined) {
                                validatedRows[i][columnName] = table.columns[columnName].defaultValue;
                                continue;
                            }
                            else if (table.columns[columnName].isAutoIncrement) {
                                valuesBeforeIncrement.push({ column: columnName, value: table.columns[columnName].incrementCounter });
                                validatedRows[i][columnName] = table.columns[columnName].increment();
                                continue;
                            }
                            else {
                                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é NOT NULL e não foi fornecido valor ou valor padrão`], "error");
                                table.revertAutoIncrementValues(valuesBeforeIncrement);
                                return;
                            }
                        }
                        if (table.columns[columnName].isAutoIncrement) {
                            valuesBeforeIncrement.push({ column: columnName, value: table.columns[columnName].incrementCounter });
                            validatedRows[i][columnName] = table.columns[columnName].increment();
                            continue;
                        }
                        if (table.columns[columnName].isCurrentTimestamp) {
                            validatedRows[i][columnName] = new Date();
                            continue;
                        }
                        if (table.columns[columnName].defaultValue !== undefined) {
                            validatedRows[i][columnName] = table.columns[columnName].defaultValue;
                            continue;
                        }
                        validatedRows[i][columnName] = null;
                    }
                    else {
                        if (table.columns[columnName].isNotNull) {
                            if (validatedRows[i][columnName] === null || validatedRows[i][columnName] === undefined) {
                                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é NOT NULL e foi fornecido valor nulo`], "error");
                                table.revertAutoIncrementValues(valuesBeforeIncrement);
                                return;
                            }
                            if (table.columns[columnName].isAutoIncrement) {
                                if (!(table.columns[columnName].incrementCounter > validatedRows[i][columnName])) {
                                    table.columns[columnName].incrementCounter = validatedRows[i][columnName] + 1;
                                }
                            }
                        }
                    }
                }
            }
            for (const columnName in table.columns) {
                if (table.columns[columnName].isUnique) {
                    const existingValues = new Set(table.rows.map(r => r[columnName]));
                    const insertedValues = new Set();
                    for (const row of validatedRows) {
                        const value = row[columnName];
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
                    const referencedTable = databases[currentDatabase].tables[table.columns[columnName].reference.table];
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
                        const value = row[columnName];
                        if (value === null)
                            continue;
                        const exists = referencedTable.rows.some(ro => ro[referencedColumn] === value);
                        if (!exists) {
                            getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é FOREIGN KEY e o valor fornecido não existe na tabela referenciada`], "error");
                            table.revertAutoIncrementValues(valuesBeforeIncrement);
                            return;
                        }
                    }
                }
            }
            for (const row of validatedRows) {
                SGBDFunctions.insertRow(tableName, row);
            }
            getCurrentTerminalSession().createEntry(this.fullCommand, [`${validatedRows.length} linha(s) inserida(s) na tabela "${tableName}"`], "success");
        }
        validateRowsTypes(rows, table) {
            const newRows = [];
            for (const row of rows) {
                const newRow = {};
                for (const columnName in row) {
                    if (typeof row[columnName] === "string" && row[columnName].toUpperCase() === "NULL") {
                        newRow[columnName] = null;
                        continue;
                    }
                    switch (table.columns[columnName].type) {
                        case "integer":
                            const intValue = parseInt(row[columnName]);
                            if (isNaN(intValue)) {
                                return "Valor inválido para coluna do tipo INTEGER";
                            }
                            newRow[columnName] = intValue;
                            break;
                        case "boolean":
                            if (row[columnName].toLowerCase() === "true") {
                                newRow[columnName] = true;
                            }
                            else if (row[columnName].toLowerCase() === "false") {
                                newRow[columnName] = false;
                            }
                            else {
                                return "Valor inválido para coluna do tipo BOOLEAN";
                            }
                            break;
                        case "float":
                            const floatValue = parseFloat(row[columnName]);
                            if (isNaN(floatValue)) {
                                return "Valor inválido para coluna do tipo FLOAT";
                            }
                            newRow[columnName] = floatValue;
                            break;
                        case "text":
                            let text = row[columnName];
                            if ((text.startsWith("'") && text.endsWith("'")) || (text.startsWith('"') && text.endsWith('"'))) {
                                text = text.substring(1, text.length - 1);
                                newRow[columnName] = text;
                            }
                            else {
                                return "Valor inválido para coluna do tipo TEXT";
                            }
                            break;
                        case "date":
                            let date = row[columnName];
                            if ((date.startsWith("'") && date.endsWith("'")) || (date.startsWith('"') && date.endsWith('"'))) {
                                date = date.substring(1, date.length - 1);
                                const parsedDate = ensureDate(date);
                                if (!parsedDate)
                                    return "Valor inválido para coluna do tipo DATE";
                                newRow[columnName] = parsedDate;
                            }
                            else {
                                return "Valor inválido para coluna do tipo DATE";
                            }
                            break;
                        case "time":
                            let time = row[columnName];
                            if ((time.startsWith("'") && time.endsWith("'")) || (time.startsWith('"') && time.endsWith('"'))) {
                                time = time.substring(1, time.length - 1);
                                const parsedTime = ensureTime(time);
                                if (!parsedTime)
                                    return "Valor inválido para coluna do tipo TIME";
                                newRow[columnName] = parsedTime;
                            }
                            else {
                                return "Valor inválido para coluna do tipo TIME";
                            }
                            break;
                        case "enum":
                            let enumValue = row[columnName];
                            if ((enumValue.startsWith("'") && enumValue.endsWith("'")) || (enumValue.startsWith('"') && enumValue.endsWith('"'))) {
                                enumValue = enumValue.substring(1, enumValue.length - 1);
                                if (table.columns[columnName].enumValues?.includes(enumValue)) {
                                    newRow[columnName] = enumValue;
                                }
                                else {
                                    return "Valor inválido para coluna do tipo ENUM";
                                }
                            }
                            else {
                                return "Valor inválido para coluna do tipo ENUM";
                            }
                            break;
                    }
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
            const target = this.tokens[1]?.toLowerCase();
            if (!target) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando USE incorreto", "Nome da database é obrigatório"], "error");
                return;
            }
            if (this.tokens.length > 2) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando USE incorreto", "Nome da database deve ser uma única palavra"], "error");
                return;
            }
            if (!databases[target]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Database "${target}" não existe`], "error");
                return;
            }
            currentDatabase = target;
            currentTable = null;
            refreshUI();
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Database "${target}" selecionada`], "success");
        }
    }
    SQL.SystemCommands = SystemCommands;
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
        if (SQL.keyWords.includes(columnDef[0].toLowerCase())) {
            return { column: null, error: `Nome de coluna não pode ser uma palavra-chave reservada: "${columnDef[0]}"` };
        }
        const columnName = columnDef[0];
        const rawColumnType = columnDef[1].toLowerCase();
        const columnType = (rawColumnType === "int" ? "integer" : rawColumnType);
        if (!(["integer", "float", "text", "date", "time", "boolean", "enum"].includes(columnType))) {
            return { column: null, error: `Tipo de coluna inválido: "${columnDef[1]}"` };
        }
        const column = new Column(columnName, columnType, false, false, false, false, false, false, false);
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
        if (column.hasDefault) {
            const defaultIndex = columnDef.findIndex(token => token.toLowerCase() === "default");
            if (defaultIndex === -1 || defaultIndex === columnDef.length - 1) {
                return { column: null, error: "DEFAULT deve ser seguido de um valor" };
            }
            const defaultValue = columnDef[defaultIndex + 1];
            switch (columnType) {
                case "integer":
                    if (!/^-?\d+$/.test(defaultValue)) {
                        return { column: null, error: "Valor DEFAULT inválido para INTEGER" };
                    }
                    break;
                case "float":
                    if (!/^-?\d+(\.\d+)?$/.test(defaultValue)) {
                        return { column: null, error: "Valor DEFAULT inválido para FLOAT" };
                    }
                    break;
                case "boolean":
                    if (defaultValue.toLowerCase() !== "true" && defaultValue.toLowerCase() !== "false") {
                        return { column: null, error: "Valor DEFAULT inválido para BOOLEAN" };
                    }
                    break;
                case "text":
                    if (!(defaultValue.startsWith("'") && defaultValue.endsWith("'") ||
                        defaultValue.startsWith('"') && defaultValue.endsWith('"'))) {
                        return { column: null, error: "Texto DEFAULT deve estar entre aspas" };
                    }
                    break;
                case "date":
                    const isCurrentDate = defaultValue.toUpperCase() === "CURRENT_TIMESTAMP";
                    const cleanValue = defaultValue.slice(1, -1);
                    const parsedDate = ensureDate(cleanValue);
                    if (!(isCurrentDate || parsedDate)) {
                        return { column: null, error: "Valor DEFAULT inválido para DATE" };
                    }
                    if (isCurrentDate) {
                        column.hasDefault = false;
                        column.isCurrentTimestamp = true;
                    }
                    break;
                case "time":
                    const isCurrentTime = defaultValue.toUpperCase() === "CURRENT_TIMESTAMP";
                    const cleanTimeValue = defaultValue.slice(1, -1);
                    const [hours, minutes, seconds] = cleanTimeValue.split(":").map(Number);
                    const validTime = hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59;
                    if (!(isCurrentTime || validTime)) {
                        return { column: null, error: "Valor DEFAULT inválido para TIME" };
                    }
                    if (isCurrentTime) {
                        column.hasDefault = false;
                        column.isCurrentTimestamp = true;
                    }
                    break;
            }
            column.defaultValue = defaultValue;
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
            const refTable = databases[currentDatabase].tables[columnDef[referencesIndex + 1]];
            if (refTable === undefined) {
                return { column: null, error: `Tabela de referência "${columnDef[referencesIndex + 1]}" não existe` };
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
                table: columnDef[referencesIndex + 1],
                column: columnDef[referencesIndex + 3]
            };
        }
        if (columnType === "enum") {
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
            column.enumValues = enumValues.filter(token => token !== ",").map(token => {
                if (token.startsWith('"') && token.endsWith('"')) {
                    return token.slice(1, -1);
                }
                return token;
            });
        }
        // Verificação da integridade com outras características da coluna
        // PRIMARY KEY implica NOT NULL
        if (column.isPrimaryKey) {
            column.isNotNull = true;
        }
        // AUTO_INCREMENT
        if (column.isAutoIncrement) {
            if (columnType !== "integer") {
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
            if (columnType !== "date" && columnType !== "time") {
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
    /**
     * Palavras reservadas reconhecidas pelo parser SQL.
     */
    SQL.keyWords = [
        "primary", "key", "foreign", "not", "null", "unique", "default", "auto_increment", "where",
        "select", "from", "insert", "into", "values", "update", "set", "delete", "create", "table",
        "database", "use", "drop", "alter", "add", "column", "enum", "references", "on", "and", "or",
        "in", "is", "integer", "float", "text", "date", "time", "boolean"
    ];
})(SQL || (SQL = {}));
// #endregion
// #region save and load
function selectAction(div) {
    document.querySelector(".acao-escolhida")?.classList.remove("acao-escolhida");
    div.classList.add("acao-escolhida");
}
function selectOption(div) {
    document.querySelector(".opcao-escolhida")?.classList.remove("opcao-escolhida");
    div.classList.add("opcao-escolhida");
}
let timeoutSaveOrLoad;
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
function saveToLocalStorage() {
    localStorage.setItem("databases", JSON.stringify(databases));
}
function loadFromLocalStorage() {
    const databasesJson = localStorage.getItem("databases");
    if (!databasesJson)
        return;
    const parsedDatabases = JSON.parse(databasesJson);
    databases = {};
    for (const dbName in parsedDatabases) {
        const dbData = parsedDatabases[dbName];
        const db = new Database(dbData.name);
        db.foreignKeyMap = dbData.foreignKeyMap || {};
        for (const tableName in dbData.tables) {
            const tableData = dbData.tables[tableName];
            const table = new Table(tableData.name);
            // Colunas
            for (const columnName in tableData.columns) {
                const colData = tableData.columns[columnName];
                const column = new Column(colData.name, colData.type, colData.isPrimaryKey, colData.isForeignKey, colData.isNotNull, colData.isUnique, colData.isAutoIncrement, colData.hasDefault, colData.isCurrentTimestamp, colData.enumValues, colData.reference);
                column.incrementCounter = colData.incrementCounter;
                column.defaultValue = colData.defaultValue;
                table.columns[columnName] = column;
            }
            // Linhas
            table.rows = tableData.rows || [];
            // Reconstruir índices
            for (const columnName in table.columns) {
                table.indexes[columnName] = new Map();
            }
            table.rows.forEach((row, rowIndex) => {
                for (const columnName in table.indexes) {
                    const value = row[columnName];
                    if (!table.indexes[columnName].has(value)) {
                        table.indexes[columnName].set(value, []);
                    }
                    table.indexes[columnName].get(value).push(rowIndex);
                }
            });
            db.tables[tableName] = table;
        }
        databases[dbName] = db;
    }
    if (currentDatabase === "")
        currentDatabase = null;
    if (currentTable === "")
        currentTable = null;
    refreshUI();
}
function saveToJson() {
    const data = {
        databases
    };
    const json = JSON.stringify(data, null, 4);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "thifreBD.json";
    a.click();
    URL.revokeObjectURL(url);
}
function loadFromJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                if (data.databases === undefined || typeof data.databases !== "object") {
                    throw new Error("Formato de arquivo inválido: propriedade 'databases' ausente ou incorreta");
                }
                const previousDatabase = currentDatabase;
                const previousTable = currentTable;
                let databasesCopy = {};
                for (const dbName in data.databases) {
                    const dbData = data.databases[dbName];
                    const db = new Database(dbData.name);
                    db.foreignKeyMap = dbData.foreignKeyMap || {};
                    for (const tableName in dbData.tables) {
                        const tableData = dbData.tables[tableName];
                        const table = new Table(tableData.name);
                        // Colunas
                        for (const columnName in tableData.columns) {
                            const colData = tableData.columns[columnName];
                            const column = new Column(colData.name, colData.type, colData.isPrimaryKey, colData.isForeignKey, colData.isNotNull, colData.isUnique, colData.isAutoIncrement, colData.hasDefault, colData.isCurrentTimestamp, colData.enumValues, colData.reference);
                            column.incrementCounter = colData.incrementCounter;
                            column.defaultValue = colData.defaultValue;
                            table.columns[columnName] = column;
                        }
                        // Linhas
                        table.rows = tableData.rows || [];
                        // Reconstruir índices
                        for (const columnName in table.columns) {
                            table.indexes[columnName] = new Map();
                        }
                        table.rows.forEach((row, rowIndex) => {
                            for (const columnName in table.indexes) {
                                const value = row[columnName];
                                if (!table.indexes[columnName].has(value)) {
                                    table.indexes[columnName].set(value, []);
                                }
                                table.indexes[columnName].get(value).push(rowIndex);
                            }
                        });
                        db.tables[tableName] = table;
                    }
                    databasesCopy[dbName] = db;
                }
                databases = databasesCopy;
                currentDatabase = previousDatabase && databases[previousDatabase] ? previousDatabase : Object.keys(databases)[0] ?? null;
                if (currentDatabase !== null) {
                    const currentDb = databases[currentDatabase];
                    currentTable = previousTable && currentDb.tables[previousTable] ? previousTable : Object.keys(currentDb.tables)[0] ?? null;
                }
                else {
                    currentTable = null;
                }
                refreshUI();
            }
            catch (error) {
                console.error(error);
                alert("Arquivo JSON inválido.");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
function saveToSql() {
    alert("Função de exportação para SQL ainda não implementada.");
}
function loadFromSql() {
    alert("Função de importação de SQL ainda não implementada.");
}
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
});
// #endregion
