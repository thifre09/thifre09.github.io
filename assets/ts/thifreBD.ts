// #region Change interface terminal

const buttonChangeToGrafical = document.getElementById("button-header-interface")!;
const buttonChangeToTerminal = document.getElementById("button-header-terminal")!;
const buttonChangeToLogical = document.getElementById("button-header-logical")!;
const buttonChangeToSave = document.getElementById("button-header-save")!;
const buttonChangeToHelp = document.getElementById("button-header-help")!;
const interfaceTerminal = document.getElementById("interface-terminal")!;

/**
 * Atualiza a posição e a largura do indicador da interface ativa.
 * @param activeButton - Botão atualmente selecionado.
 */
function updateInterfaceTerminalIndicator(activeButton: HTMLElement) {
    const left = activeButton.offsetLeft;
    const width = activeButton.offsetWidth;
    interfaceTerminal.style.setProperty("--indicator-left", `${left}px`);
    interfaceTerminal.style.setProperty("--indicator-width", `${width}px`);
}

/**
 * Troca a interface visível no painel (gráfica, terminal, logical, save ou help).
 * @param id - Identificador da interface a ser exibida.
 */
function changeTo(id: "interface-grafica" | "terminal" | "logical" | "save" | "help") {
    document.getElementById("interface-grafica")!.style.display = "none";
    document.getElementById("terminal")!.style.display = "none";
    document.getElementById("logical")!.style.display = "none";
    document.getElementById("save")!.style.display = "none";
    document.getElementById("help")!.style.display = "none";
    document.getElementById(id)!.style.display = "flex";
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



// #endregion

// #region Others
let timeout: number;

/**
 * Verifica se um nome segue o padrão permitido para identificadores SQL.
 * @param name - Nome a ser validado.
 * @returns `true` quando o nome é válido.
 */
function isValidSQLName(name: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

/**
 * Exibe uma notificação temporária no painel de mensagens.
 * @param html - Conteúdo HTML da notificação.
 */
function openNotifications(html: string) {
    clearTimeout(timeout);
    const notificacoes = document.getElementById("notificacoes")!;
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
function abrirFechar(estado: boolean, id: string) {
    const elemento = document.getElementById(id)!;
    if (estado === false) {
        document.getElementById("menus-centrais")!.style.display = "flex";
        elemento.style.display = "flex";
    } else if (estado === true) {
        elemento.style.display = "none";
        const menusCentrais = document.getElementById("menus-centrais")!;
        const allHidden = Array.from(menusCentrais.children).every((child) => {
            const menu = child as HTMLElement;
            if (menu.id === "notificacoes") return true;
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
function createExempleDatabase() {
    const databaseName = "thifre_db";

    if (databases[databaseName]) {
        currentDatabase = databaseName;
        currentTable = Object.keys(databases[databaseName].tables)[0] ?? null;
        refreshUI();
        openNotifications("<p style='color: var(--yellow5)'>A database de exemplo ja existe e foi selecionada.</p>");
        return;
    }

    SGBDFunctions.createDatabase(new DB.Database(databaseName));

    const usuarios = new DB.Table("usuarios");
    usuarios.columns["id"] = new DB.Column("id", types.INTEGER, true, false, true, true, true, false);
    usuarios.columns["nome"] = new DB.Column("nome", types.TEXT, false, false, true, false, false, false);
    usuarios.columns["email"] = new DB.Column("email", types.TEXT, false, false, true, true, false, false);
    usuarios.columns["ativo"] = new DB.Column("ativo", types.BOOLEAN, false, false, false, false, false, true);
    usuarios.columns["ativo"].defaultValue = true;
    usuarios.columns["nota"] = new DB.Column("nota", types.FLOAT, false, false, false, false, false, true);
    usuarios.columns["nota"].defaultValue = 0;
    usuarios.columns["criado_em"] = new DB.Column("criado_em", types.DATE, false, false, true, false, false, false, true);
    usuarios.columns["hora_entrada"] = new DB.Column("hora_entrada", types.TIME, false, false, false, false, false, true, false);
    usuarios.columns["hora_entrada"].defaultValue = new SQLTime(9);
    usuarios.columns["perfil"] = new DB.Column("perfil", types.ENUM(["admin", "editor", "leitor"]), false, false, true, false, false, true, false);
    usuarios.columns["perfil"].defaultValue = "leitor";
    SGBDFunctions.createTable(usuarios);

    const idColumn = usuarios.columns["id"];
    SGBDFunctions.insertRow("usuarios", new DB.Row({
        id: idColumn.increment(),
        nome: "Alice",
        email: "alice@email.com",
        ativo: true,
        nota: 9.5,
        criado_em: new SQLDate(2026, 1, 10),
        hora_entrada: new SQLTime(8, 30),
        perfil: "admin"
    }));
    SGBDFunctions.insertRow("usuarios", new DB.Row({
        id: idColumn.increment(),
        nome: "Bruno",
        email: "bruno@email.com",
        ativo: false,
        nota: 7.2,
        criado_em: new SQLDate(2026),
        hora_entrada: new SQLTime(9, 15),
        perfil: "editor"
    }));
    SGBDFunctions.insertRow("usuarios", new DB.Row({
        id: idColumn.increment(),
        nome: "Carla",
        email: "carla@email.com",
        ativo: true,
        nota: 8.8,
        criado_em: new SQLDate(2),
        hora_entrada: new SQLTime(10),
        perfil: "leitor"
    }));

    const posts = new DB.Table("posts");
    posts.columns["id"] = new DB.Column("id", types.INTEGER, true, false, true, true, true, false);
    posts.columns["usuario_id"] = new DB.Column("usuario_id", types.INTEGER, false, true, true, false, false, false, false, { table: "usuarios", column: "id" });
    posts.columns["titulo"] = new DB.Column("titulo", types.TEXT, false, false, true, false, false, false);
    posts.columns["conteudo"] = new DB.Column("conteudo", types.TEXT, false, false, false, false, false, false);
    posts.columns["publicado"] = new DB.Column("publicado", types.TEXT, false, false, false, false, false, true);
    posts.columns["publicado"].defaultValue = false;
    posts.columns["avaliacao"] = new DB.Column("avaliacao", types.FLOAT, false, false, false, false, false, true);
    posts.columns["avaliacao"].defaultValue = 0;
    posts.columns["status"] = new DB.Column("status", types.ENUM(["rascunho", "publicado", "arquivado"]), false, false, true, false, false, true, false);
    posts.columns["status"].defaultValue = "rascunho";
    posts.columns["publicado_em"] = new DB.Column("publicado_em", types.DATE, false, false, false, false, false, false, false);
    SGBDFunctions.createTable(posts);

    const postIdColumn = posts.columns["id"];
    SGBDFunctions.insertRow("posts", new DB.Row({
        id: postIdColumn.increment(),
        usuario_id: 1,
        titulo: "Primeiro post",
        conteudo: "Exemplo de conteudo com todos os tipos.",
        publicado: true,
        avaliacao: 8.9,
        status: "publicado",
        publicado_em: new SQLDate(2026, 4, 1)
    }));
    SGBDFunctions.insertRow("posts", new DB.Row({
        id: postIdColumn.increment(),
        usuario_id: 2,
        titulo: "Rascunho do Bruno",
        conteudo: "Ainda em andamento.",
        publicado: false,
        avaliacao: 0,
        status: "rascunho",
        publicado_em: null
    }));

    const auditoria = new DB.Table("auditoria");
    auditoria.columns["id"] = new DB.Column("id", types.INTEGER, true, false, true, true, true, false);
    auditoria.columns["entidade"] = new DB.Column("entidade", types.TEXT, false, false, true, false, false, false);
    auditoria.columns["entidade_id"] = new DB.Column("entidade_id", types.INTEGER, false, false, true, false, false, false);
    auditoria.columns["acao"] = new DB.Column("acao", types.ENUM(["INSERT", "UPDATE", "DELETE"]), false, false, true, false, false, false, false);
    auditoria.columns["sucesso"] = new DB.Column("sucesso", types.BOOLEAN, false, false, true, false, false, true);
    auditoria.columns["sucesso"].defaultValue = true;
    auditoria.columns["feito_em"] = new DB.Column("feito_em", types.DATE, false, false, true, false, false, false, true);
    SGBDFunctions.createTable(auditoria);

    const auditIdColumn = auditoria.columns["id"];
    SGBDFunctions.insertRow("auditoria", new DB.Row({
        id: auditIdColumn.increment(),
        entidade: "usuarios",
        entidade_id: 1,
        acao: "INSERT",
        sucesso: true,
        feito_em: new SQLDate(2026, 4, 20)
    }));
    SGBDFunctions.insertRow("auditoria", new DB.Row({
        id: auditIdColumn.increment(),
        entidade: "posts",
        entidade_id: 1,
        acao: "UPDATE",
        sucesso: true,
        feito_em: new SQLDate(2026, 3, 24)
    }));

    const tarefas = new DB.Table("tarefas");
    tarefas.columns["id"] = new DB.Column("id", types.INTEGER, true, false, true, true, true, false);
    tarefas.columns["titulo"] = new DB.Column("titulo", types.TEXT, false, false, true, false, false, false);
    tarefas.columns["concluida"] = new DB.Column("concluida", types.BOOLEAN, false, false, false, false, false, true);
    tarefas.columns["concluida"].defaultValue = false;
    SGBDFunctions.createTable(tarefas);

    const tarefaIdColumn = tarefas.columns["id"];
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Arrumar a mesa", concluida: true }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Responder mensagens", concluida: false }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Revisar o código", concluida: true }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Fazer backup", concluida: false }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Atualizar a documentação", concluida: true }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Testar o build", concluida: true }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Organizar imagens", concluida: false }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Separar ideias novas", concluida: false }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Revisar layout", concluida: true }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Limpar rascunhos", concluida: false }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Publicar atualização", concluida: false }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Conferir links", concluida: true }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Escrever resumo", concluida: false }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Rever cores", concluida: true }));
    SGBDFunctions.insertRow("tarefas", new DB.Row({ id: tarefaIdColumn.increment(), titulo: "Fechar pendências", concluida: false }));

    currentTable = null;
    refreshUI();
    openNotifications("<p style='color: var(--green5)'>Database de exemplo criada com sucesso!</p>");
}

function compareTypes(type1: DataTypes.DataType, type2: DataTypes.DataType): boolean {
    return type1.constructor === type2.constructor;
}

function valueExists(value: any) {
    return value !== null && value !== undefined;
}

// #endregion

// #region Custom dropdowns

/**
 * Alterna a abertura de um dropdown customizado.
 * @param dropdownButton - Botão que controla o dropdown.
 */
function openCustomDropdown(dropdownButton: HTMLElement) {
    const dropdown = dropdownButton.parentElement! as HTMLElement;
    if (dropdown.querySelector("ul")!.children.length === 0) return;

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
function choseOption(option: HTMLElement) {
    const dropdown = option.closest(".custom-dropdown")! as HTMLElement;
    const trigger = dropdown.querySelector(".custom-dropdown-trigger") as HTMLElement | null;

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
function closeAllCustomDropdowns(event: Event) {
    const target = event.target as HTMLElement;
    if (target.closest(".custom-dropdown")) return;

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
            (option as HTMLElement).onclick = () => choseOption(option as HTMLElement);
        });
    });
}

/**
 * Aplica os efeitos colaterais de uma mudança em um dropdown customizado.
 * @param dropdown - Dropdown alterado.
 */
function onDropdownChange(dropdown: HTMLElement) {
    if (dropdown.querySelector('input[name="column-type"]')) {
        const container = dropdown.closest("div")!.parentElement!;
        updateCharacteristics(container);
        updateDefaultInput(container);
    }

    if (dropdown.querySelector('input[name="reference-table"]')) {
        const container = dropdown.closest("div")!.parentElement!;
        updateForeignKeyReferenceColumnOptions(container);
    }

    if (dropdown.querySelector('input[name="database-dropdown"]')) {
        const selectedOption = dropdown.querySelector(".custom-dropdown-option-selected") as HTMLElement | null;
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

namespace DB {
    export abstract class TreeItem {
        private static idCounter = 1;
        readonly id: number;
        name: string;

        constructor (name: string) {
            this.name = name;
            this.id = TreeItem.idCounter;
            TreeItem.idCounter++;
        }

        abstract get children(): TreeItem[];

        buildTree(): HTMLElement {
            if (this.children.length === 0) {
                const p = document.createElement("p");
                p.textContent = this.name;
                return p
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
            p.textContent = this.name;
            summaryDiv.appendChild(p);
            summary.appendChild(summaryDiv);

            details.appendChild(summary);
            for (let ch of this.children) {
                details.appendChild(ch.buildTree())
            }
            details.onclick = (event) => {
                event.stopPropagation();
                document.querySelector(".summary-active")?.classList.remove("summary-active")
                summary.classList.add("summary-active")
                this.clickBehavior();
            };

            return details;
        }

        clickBehavior(): void {}
    }

    export abstract class Node extends TreeItem {
        constructor(name: string) {
            super(name);
        }
        get children(): TreeItem[] {
            return []
        }
    }

    export class NodeGroup extends TreeItem {
        c: DB.Node[];
        onPlus: () => void;

        constructor(name: string, children: DB.Node[], onPlus: () => void = () => {}) {
            super(name);
            this.c = children;
            this.onPlus = onPlus;
        }

        get children(): TreeItem[] {
            return this.c;
        }

        buildTree(): HTMLElement {
            if (this.children.length === 0) {
                const p = document.createElement("p");
                p.textContent = this.name;
                return p
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
            p.textContent = this.name;
            summaryDiv.appendChild(p);
            const plusIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            plusIcon.setAttribute("viewBox", "0 0 24 24");
            plusIcon.setAttribute("aria-hidden", "true");

            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute("href", "assets/images/icons-sprite.svg#icon-square-plus");
            plusIcon.appendChild(use);

            plusIcon.onclick = () => { this.onPlus(); details.open = !details.open }
            summaryDiv.appendChild(plusIcon);

            summary.appendChild(summaryDiv);

            details.appendChild(summary);
            for (let ch of this.children) {
                details.appendChild(ch.buildTree())
            }
            details.onclick = (event) => {
                event.stopPropagation();
                document.querySelector(".summary-active")?.classList.remove("summary-active")
                summary.classList.add("summary-active");
                this.clickBehavior();
            };

            return details;
        }
    }

    /**
     * Representa uma database em memória com tabelas e relacionamentos.
     */
    export class Database extends Node {
        tables: Record<string, Table>;

        /**
         * Mapa reverso de chaves estrangeiras.
         *
         * Em vez de armazenar apenas "para onde cada coluna aponta",
         * este mapa armazena "quem aponta para cada tabela/coluna".
         *
         * A informação normal da FK já existe dentro das colunas:
         *
         * usuarios.id
         *
         * pedidos.usuario_id -> usuarios.id
         *
         * Nesse exemplo, a coluna "usuario_id" da tabela "pedidos"
         * possui uma propriedade:
         *
         * {
         *     table: "usuarios",
         *     column: "id"
         * }
         *
         * Isso permite descobrir facilmente:
         *
         * "Para onde esta coluna aponta?"
         *
         * Porém, responder a pergunta inversa:
         *
         * "Quem aponta para usuarios.id?"
         *
         * exigiria percorrer TODAS as tabelas e TODAS as colunas da
         * database procurando referências.
         *
         * Para evitar isso existe o foreignKeyMap.
         *
         * ------------------------------------------------------------------
         * ESTRUTURA
         * ------------------------------------------------------------------
         *
         * foreignKeyMap[
         *     tabelaReferenciada
         * ][
         *     colunaReferenciada
         * ] = [
         *     {
         *         table: tabelaOrigem,
         *         column: colunaOrigem
         *     }
         * ]
         *
         * Ou seja:
         *
         * foreignKeyMap["usuarios"]["id"]
         *
         * retorna todas as colunas que apontam para:
         *
         * usuarios.id
         *
         * ------------------------------------------------------------------
         * EXEMPLO 1
         * ------------------------------------------------------------------
         *
         * usuarios
         * └─ id
         *
         * pedidos
         * └─ usuario_id -> usuarios.id
         *
         * Resultado:
         *
         * {
         *     usuarios: {
         *         id: [
         *             {
         *                 table: "pedidos",
         *                 column: "usuario_id"
         *             }
         *         ]
         *     }
         * }
         *
         * ------------------------------------------------------------------
         * EXEMPLO 2
         * ------------------------------------------------------------------
         *
         * usuarios
         * └─ id
         *
         * pedidos
         * └─ usuario_id -> usuarios.id
         *
         * comentarios
         * └─ autor_id -> usuarios.id
         *
         * Resultado:
         *
         * {
         *     usuarios: {
         *         id: [
         *             {
         *                 table: "pedidos",
         *                 column: "usuario_id"
         *             },
         *             {
         *                 table: "comentarios",
         *                 column: "autor_id"
         *             }
         *         ]
         *     }
         * }
         *
         * ------------------------------------------------------------------
         * EXEMPLO 3
         * ------------------------------------------------------------------
         *
         * usuarios
         * ├─ id
         * └─ cargo_id
         *
         * pedidos
         * └─ usuario_id -> usuarios.id
         *
         * funcionarios
         * └─ cargo_usuario -> usuarios.cargo_id
         *
         * Resultado:
         *
         * {
         *     usuarios: {
         *         id: [
         *             {
         *                 table: "pedidos",
         *                 column: "usuario_id"
         *             }
         *         ],
         *
         *         cargo_id: [
         *             {
         *                 table: "funcionarios",
         *                 column: "cargo_usuario"
         *             }
         *         ]
         *     }
         * }
         *
         * ------------------------------------------------------------------
         * PARA QUE SERVE
         * ------------------------------------------------------------------
         *
         * O foreignKeyMap permite descobrir instantaneamente quais
         * colunas dependem de determinada tabela ou coluna.
         *
         * Isso é extremamente útil em operações como:
         *
         * - DELETE TABLE
         * - DELETE COLUMN
         * - RENAME TABLE
         * - RENAME COLUMN
         * - ALTER COLUMN
         *
         * Exemplo:
         *
         * Se o usuário renomear:
         *
         * usuarios.id
         *
         * para:
         *
         * usuarios.codigo
         *
         * basta consultar:
         *
         * foreignKeyMap["usuarios"]["id"]
         *
         * para obter todas as colunas que apontam para ela e atualizar
         * suas referências automaticamente.
         *
         * Sem este mapa seria necessário percorrer todas as tabelas da
         * database procurando FKs manualmente.
         *
         * ------------------------------------------------------------------
         * RELAÇÃO COM registerForeignKey()
         * ------------------------------------------------------------------
         *
         * Sempre que uma FK é criada:
         *
         * pedidos.usuario_id -> usuarios.id
         *
         * é executado:
         *
         * registerForeignKey(
         *     "pedidos",
         *     "usuario_id",
         *     "usuarios",
         *     "id"
         * );
         *
         * que produz:
         *
         * foreignKeyMap["usuarios"]["id"].push({
         *     table: "pedidos",
         *     column: "usuario_id"
         * });
         *
         * ------------------------------------------------------------------
         * RELAÇÃO COM unregisterForeignKey()
         * ------------------------------------------------------------------
         *
         * Quando a FK é removida:
         *
         * pedidos.usuario_id
         *
         * deixa de apontar para:
         *
         * usuarios.id
         *
         * o método unregisterForeignKey remove o registro correspondente
         * do foreignKeyMap.
         *
         * Caso uma coluna não receba mais referências, ela é removida do
         * mapa.
         *
         * Caso uma tabela não receba mais referências em nenhuma coluna,
         * ela também é removida do mapa.
         */
        foreignKeyMap: Record<
            string,
            Record<
                string,
                Array<{ table: string; column: string }>
            >
        >;

        /**
         * Cria uma database vazia com o nome informado.
         * @param name - Nome da database.
         */
        constructor(name: string) {
            super(name);
            databaseGroup.c.push(this);
            this.tables = {};
            this.foreignKeyMap = {};
        }

        /**
         * Lista as chaves estrangeiras que saem de uma tabela.
         * @param tableName - Nome da tabela de origem.
         * @returns Relações de saída da tabela.
         */
        getTableForeignKeys(tableName: string): {
            column: string; referenceTable: string;
            referenceColumn: string
        }[] {
            const table = this.tables[tableName];

            const foreignKeys: {
                column: string;
                referenceTable: string;
                referenceColumn: string;
            }[] = [];

            if (!table) return foreignKeys;

            for (const columnName in table.columns) {
                const column = table.columns[columnName];

                if (!column.reference) continue;

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
         *
         * Estrutura do retorno:
         *
         * {
         *     colunaReferenciada: [
         *         {
         *             table: tabelaOrigem,
         *             column: colunaOrigem
         *         }
         *     ]
         * }
         *
         * Cada chave representa uma coluna da tabela informada e seu valor
         * contém todas as colunas de outras tabelas que possuem uma chave
         * estrangeira apontando para ela.
         *
         * @param tableName - Nome da tabela alvo.
         * @returns Mapa de referências agrupadas por coluna referenciada.
         */
        getReferencesToTable(tableName: string): Record<string, Array<{ table: string; column: string }>> {
            return this.foreignKeyMap[tableName] || {};
        }

        /**
         * Resume os relacionamentos de uma tabela em entrada e saída.
         * @param tableName - Nome da tabela consultada.
         */
        getTableRelationships(tableName: string) {
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
        registerForeignKey(fromTable: string, fromColumn: string, toTable: string, toColumn: string) {
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
        unregisterForeignKey(fromTable: string, fromColumn: string, toTable: string, toColumn: string) {
            const refs = this.foreignKeyMap[toTable]?.[toColumn];

            if (!refs) return;

            this.foreignKeyMap[toTable][toColumn] = refs.filter(ref =>
                !(ref.table === fromTable && ref.column === fromColumn)
            );

            if (this.foreignKeyMap[toTable][toColumn].length === 0) {
                delete this.foreignKeyMap[toTable][toColumn];
            }

            if (Object.keys(this.foreignKeyMap[toTable]).length === 0) {
                delete this.foreignKeyMap[toTable];
            }
        }

        /**
         * Atualiza o nome de uma coluna referenciada dentro do foreignKeyMap
         * e em todas as FKs que apontam para ela.
         *
         * @param tableName - Tabela que contém a coluna renomeada.
         * @param oldColumnName - Nome antigo da coluna.
         * @param newColumnName - Novo nome da coluna.
         */
        updateColumnForeignKeyMap(tableName: string, oldColumnName: string, newColumnName: string) {
            const refs = this.foreignKeyMap[tableName]?.[oldColumnName] ?? [];

            for (const ref of refs) {
                this.tables[ref.table].columns[ref.column].reference!.column = newColumnName;
            }

            if (this.foreignKeyMap[tableName]?.[oldColumnName]) {
                this.foreignKeyMap[tableName][newColumnName] = this.foreignKeyMap[tableName][oldColumnName];
                delete this.foreignKeyMap[tableName][oldColumnName];
            }
        }

        get children(): DB.NodeGroup[] {
            return [
                new NodeGroup("Tabelas", Object.values(this.tables), () => {
                    abrirFechar(false, "criacao-tabela");
                })
            ];
        }

        clickBehavior(): void {
            currentDatabase = this.name;
            currentTable = null;
            refreshUI();
        }
    }

    /**
     * Representa uma tabela em memória com colunas, linhas e índices.
     */
    export class Table extends Node {
        columns: Record<string, Column>;
        rows: Row[];
        indexes: Record<string, Map<any, number[]>>;
        constraints: Constraint[];

        /**
         * Cria uma tabela vazia com o nome informado.
         * @param name - Nome da tabela.
         */
        constructor(name: string) {
            super(name);
            this.columns = {};
            this.rows = [];
            this.indexes = {};
            this.constraints = [];
        }

        /**
         * Restaura os valores de auto incremento caso a inserção falhe.
        */
        revertAutoIncrementValues(valuesBeforeIncrement: { column: string, value: number }[]) {
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

                    indexMap.get(value)!.push(rowIndex);
                }
            }
        }

        remakeColumnIndex(columnName: string) {
            const indexMap = new Map<any, number[]>();

            for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
                const value = this.rows[rowIndex].values[columnName];

                if (!indexMap.has(value)) {
                    indexMap.set(value, []);
                }

                indexMap.get(value)!.push(rowIndex);
            }

            this.indexes[columnName] = indexMap;
        }

        get children(): DB.Node[] {
            return [
                new NodeGroup("Colunas", Object.values(this.columns)),
                new NodeGroup("Linhas", Object.values(this.rows))
            ]
        }

        clickBehavior(): void {
            currentTable = this.name;
            refreshUI();
        }
    }

    /**
     * Descreve uma coluna e suas restrições na estrutura da tabela.
     */
    export class Column extends Node {
        type: DataTypes.DataType;
        isPrimaryKey: boolean;
        isForeignKey: boolean;
        isNotNull: boolean;
        isUnique: boolean;
        isAutoIncrement: boolean;
        hasDefault: boolean;
        isCurrentTimestamp: boolean;
        reference?: TReference;
        incrementCounter: number = 1;
        defaultValue: any;

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
         * @param reference - Referência usada por FOREIGN KEY.
         */
        constructor(name: string, type: DataTypes.DataType, isPrimaryKey: boolean = false, isForeignKey: boolean = false,
        isNotNull: boolean = false, isUnique: boolean = false, isAutoIncrement: boolean = false, hasDefault: boolean = false, 
        isCurrentTimestamp: boolean = false, reference?: TReference) {
            super(name);
            this.type = type;
            this.isPrimaryKey = isPrimaryKey;
            this.isForeignKey = isForeignKey;
            this.isNotNull = isNotNull;
            this.isUnique = isUnique;
            this.isAutoIncrement = isAutoIncrement;
            this.hasDefault = hasDefault;
            this.isCurrentTimestamp = isCurrentTimestamp;
            this.reference = reference;
        }

        /**
         * Retorna o próximo valor da sequência de auto incremento.
         * @returns Próximo número da coluna.
         */
        increment(): number {
            if (!this.isAutoIncrement) {
                throw new Error("Column is not auto increment");
            }
            return this.incrementCounter++;
        }

        clone(): Column {
            const copy = new Column(this.name, this.type, this.isPrimaryKey, this.isForeignKey, this.isNotNull,
                this.isUnique, this.isAutoIncrement, this.hasDefault, this.isCurrentTimestamp,
                this.reference ? { ...this.reference } : undefined
            );
            copy.incrementCounter = this.incrementCounter;
            copy.defaultValue = this.defaultValue;
            return copy;
        }
    }

    export class Row extends Node {
        static counter = 1;
        values: Record<string, any>;

        constructor(values: Record<string, any>) {
            super(`Linha ${Row.counter}`);
            this.values = values;
            Row.counter++;
        }
    }

    export class Constraint extends Node {
        
    }
}

/**
 * Guarda o histórico e o estado de uma sessão do terminal SQL.
 */
class TerminalSession {
    static sessionCount = 1;
    static historyIndex = 0;
    name: string;
    history: ITerminalEntry[];
    active: boolean;

    /**
     * Cria uma nova sessão de terminal.
     * @param name - Nome visível da sessão.
     */
    constructor(name: string) {
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
    createEntry(command: string, output: string[], type: "success" | "error" | "info") {
        this.history.push({ database: currentDatabase, command: command, output, type, timestamp: new Date() });
        this.updateTerminalUI();
    }

    /**
     * Re-renderiza o histórico da sessão na interface.
     */
    updateTerminalUI() {
        const terminalHistoryDiv = document.getElementById("terminal-history")!;
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
    static createDatabase(database: DB.Database) {
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
    static createTable(table: DB.Table) {
        const db = getCurrentDatabase()!;
        for (const columnName in table.columns) {
            table.indexes[columnName] = new Map();
        }
        for (const columnName in table.columns) {
            const column = table.columns[columnName];

            if (!column.reference) continue;

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
    static addColumn(tableName: string, column: DB.Column) {
        getTable(tableName)!.columns[column.name] = column;
        getTable(tableName)!.indexes[column.name] = new Map();

        if (column.reference) {
            getCurrentDatabase()!.registerForeignKey(tableName, column.name, column.reference.table, column.reference.column);
        }

        refreshUI();
        saveToLocalStorage();
    }

    /**
     * Insere uma linha e atualiza os índices da tabela.
     * @param tableName - Nome da tabela alvo.
     * @param row - Dados da nova linha.
     */
    static insertRow(tableName: string, row: DB.Row) {
        const table = getTable(tableName)!;

        const rowIndex = table.rows.length;
        table.rows.push(row);

        for (const col in table.indexes) {
            const value = row.values[col];
            if (!table.indexes[col].has(value)) {
                table.indexes[col].set(value, []);
            }
            table.indexes[col].get(value)!.push(rowIndex);
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
    static editRow(tableName: string, oldRowIndex: number, newRow: DB.Row) {
        const table = getTable(tableName)!;
        const oldRow = table.rows[oldRowIndex];

        for (const col in table.indexes) {
            const oldValue = oldRow.values[col];
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
            const newValue = newRow.values[col];
            const indexMap = table.indexes[col];

            if (!indexMap.has(newValue)) {
                indexMap.set(newValue, []);
            }

            indexMap.get(newValue)!.push(oldRowIndex);
        }

        refreshUI();
        saveToLocalStorage();
    }

    /**
     * Remove uma database do armazenamento em memória.
     * @param databaseName - Nome da database.
     */
    static deleteDatabase(databaseName: string) {
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
    static deleteTable(tableName: string) {
        const db = getCurrentDatabase()!;
        const table = getTable(tableName)!;

        // 🧹 remove todas as FKs QUE SAEM dessa tabela
        for (const column of Object.values(table.columns)) {
            if (!column.reference) continue;

            db.unregisterForeignKey(
                tableName,
                column.name,
                column.reference.table,
                column.reference.column
            );
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
    static deleteColumn(tableName: string, columnName: string) {
        const db = getCurrentDatabase()!;
        const table = getTable(tableName)!;

        const column = table.columns[columnName];

        if (column.reference) {
            db.unregisterForeignKey(
                tableName,
                columnName,
                column.reference.table,
                column.reference.column
            );
        }

        table.indexes[columnName]?.clear();
        delete table.indexes[columnName];

        for (const row of table.rows) {
            delete row.values[columnName];
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
    static deleteRow(tableName: string, rowIndex: number) {
        const table = getTable(tableName)!;
        const row = table.rows[rowIndex];

        for (const col in table.indexes) {
            const value = row.values[col];
            const indexMap = table.indexes[col];

            if (!indexMap.has(value)) continue;

            const arr = indexMap.get(value)!;

            const pos = arr.indexOf(rowIndex);
            if (pos !== -1) arr.splice(pos, 1);

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

    static renameDatabase(oldName: string, newName: string) {
        const db = databases[oldName];
        if (!db) return;
        delete databases[oldName];
        db.name = newName;
        databases[newName] = db;
        currentDatabase = newName;

        refreshUI();
        saveToLocalStorage();
    }

    static renameTable(oldName: string, newName: string) {
        const db = getCurrentDatabase()!;
        const t = db.tables[oldName];
        if (!t) return;
        delete db.tables[oldName];
        t.name = newName;
        db.tables[newName] = t;
        currentTable = newName;

        const incomingRefs = db.getReferencesToTable(oldName);

        for (const columnRefs of Object.values(incomingRefs)) {
            for (const ref of columnRefs) {
                db.tables[ref.table].columns[ref.column].reference!.table = newName;
            }
        }

        if (db.foreignKeyMap[oldName]) {
            db.foreignKeyMap[newName] = db.foreignKeyMap[oldName];
            delete db.foreignKeyMap[oldName];
        }

        refreshUI();
        saveToLocalStorage();
    }

    static alterColumn(tableName: string, oldColumnName: string, newColumn: DB.Column) {
        /**
         * Converte um valor de célula para o tipo de coluna informado.
         * Usado ao alterar o tipo de uma coluna existente para adaptar os valores já presentes.
         * @param value - Valor atual da célula.
         * @param newType - Tipo de coluna destino.
         * @returns Valor convertido apropriado para `newType` ou o valor original quando não aplicável.
         */
        function convertRowValue(value: any, newType: DataTypes.DataType): any {
            if (valueExists(value))
                return value;

            return newType.parse(value);
        }

        const db = getCurrentDatabase()!;
        const table = db.tables[tableName];
        const oldColumn = table.columns[oldColumnName];

        if (JSON.stringify(oldColumn) === JSON.stringify(newColumn)) return;

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

            db.updateColumnForeignKeyMap(tableName, oldColumnName, newColumn.name);

            if (oldColumn.reference) {
                db.unregisterForeignKey(
                    tableName,
                    oldColumnName,
                    oldColumn.reference.table,
                    oldColumn.reference.column
                );
            }

            if (newColumn.reference) {
                db.registerForeignKey(
                    tableName,
                    newColumn.name,
                    newColumn.reference.table,
                    newColumn.reference.column
                );
            }
        }

        table.columns[newColumn.name] = newColumn;

        if (JSON.stringify(oldColumn.reference) !== JSON.stringify(newColumn.reference)) {
            if (oldColumn.reference) {
                db.unregisterForeignKey(
                    tableName,
                    oldColumnName,
                    oldColumn.reference.table,
                    oldColumn.reference.column
                );
            }

            if (newColumn.reference) {
                db.registerForeignKey(
                    tableName,
                    newColumn.name,
                    newColumn.reference.table,
                    newColumn.reference.column
                );
            }
        }

        if (oldColumn.type !== newColumn.type) {
            for (const row of table.rows) {
                row.values[newColumn.name] = convertRowValue(row.values[newColumn.name], newColumn.type);
            }
        }

        if (oldColumn.type !== newColumn.type || oldColumnName !== newColumn.name) {
            table.remakeColumnIndex(newColumn.name);
        }

        refreshUI();
        saveToLocalStorage();
    }
}

class SQLTime {
    hours: number;
    minutes: number;
    seconds: number;

    constructor(hours: number, minutes: number = 0, seconds: number = 0) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    static fromString(value: string): SQLTime | null {

        const match = value.match(/^(\d{2}):(\d{2}):(\d{2})$/);

        if (!match)
            return null;

        const [, h, m, s] = match.map(Number);

        if (
            h < 0 || h > 23 ||
            m < 0 || m > 59 ||
            s < 0 || s > 59
        )
            return null;

        return new SQLTime(h, m, s);

    }

    static fromNumber(value: number): SQLTime | null {
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

    static now(): SQLTime {
        const now = new Date();
        return new SQLTime(now.getHours(), now.getMinutes(), now.getSeconds());
    }

    static toString(time: SQLTime): string {
        return [
            time.hours.toString().padStart(2, "0"),
            time.minutes.toString().padStart(2, "0"),
            time.seconds.toString().padStart(2, "0")
        ].join(":");
    }
}

class SQLDate {
    year: number;
    month: number;
    day: number;

    constructor(year: number, month: number = 1, day: number = 1) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    static fromString(value: string): SQLDate | null {

        const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (!match)
            return null;

        const [, y, m, d] = match.map(Number);

        if (
            y < 0 ||
            m < 1 || m > 12 ||
            d < 1 || d > 31
        )
            return null;

        return new SQLDate(y, m, d);
    }

    static fromDate(value: Date): SQLDate | null {
        let y = value.getFullYear();
        let m = value.getMonth();
        let d = value.getDay();

        return new SQLDate(y, m, d);
    }

    static now(): SQLDate {
        const now = new Date();
        return new SQLDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    }

    static toString(date: SQLDate): string {
        return [
            date.year.toString().padStart(4, "0"),
            date.month.toString().padStart(2, "0"),
            date.day.toString().padStart(2, "0")
        ].join("-");
    }
}

namespace DataTypes {
    export type TDataTypeAsString = "TEXT" | "INTEGER" | "FLOAT" | "BOOLEAN" | "DATE" | "TIME" | "ENUM";
    export abstract class DataType {
        abstract readonly name: TDataTypeAsString;
        abstract validate(value: any): boolean;
        abstract parse(value: any): any;
    }

    export function createDataTypeFromString(type: TDataTypeAsString, enumValues: string[] = []): DataType {
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
        }
    }

    export class TextType extends DataType {
        readonly name = "TEXT";

        validate(value: any): boolean {
            return typeof value === "string";
        }

        parse(value: any): string {
            return String(value);
        }
    }

    export class IntegerType extends DataType {
        readonly name = "INTEGER";

        validate(value: any): boolean {
            return typeof value === "number" && Number.isInteger(value);
        }

        parse(value: any): number {
            return parseInt(value);
        }
    }

    export class FloatType extends DataType {
        readonly name = "FLOAT";

        validate(value: any): boolean {
            return typeof value === "number" && !Number.isFinite(value);
        }

        parse(value: any): number {
            return parseFloat(value);
        }
    }

    export class BooleanType extends DataType {
        readonly name = "BOOLEAN";

        validate(value: any): boolean {
            value = typeof value === "string" ? value.trim().toLowerCase() : value;
            return value === true ||
                value === false ||
                value === "true" ||
                value === "false";
        }

        parse(value: any): boolean | null {
            value = typeof value === "string" ? value.trim() : value;
            if (value === true || value.toLowerCase() === "true")
                return true;

            if (value === false || value.toLowerCase() === "false")
                return false;

            return null;
        }
    }

    export class DateType extends DataType {

        readonly name = "DATE";

        validate(value: any): boolean {
            return value instanceof SQLDate;
        }

        parse(value: any): SQLDate | null {
            if (value instanceof SQLDate)
                return value;

            if (typeof value !== "string")
                return null;

            return SQLDate.fromString(value);
        }
    }

    export class TimeType extends DataType {

        readonly name = "TIME";

        validate(value: any): boolean {
            return value instanceof SQLTime;
        }

        parse(value: any): SQLTime | null {

            if (value instanceof SQLTime)
                return value;

            if (typeof value === "string")
                return SQLTime.fromString(value);
            else if (typeof value === "number")
                return SQLTime.fromNumber(value);

            return null;

        }

    }

    export class EnumType extends DataType {
        readonly name = "ENUM";
        private allowedValues: string[];

        constructor(allowedValues: string[]) {
            super();
            this.allowedValues = allowedValues;
        }

        validate(value: any): boolean {
            return typeof value === "string" && this.allowedValues.includes(value);
        }

        parse(value: any): string {
            return String(value);
        }

        getAllowedValues(): string[] {
            return this.allowedValues;
        }

        setAllowedValues(newValues: string[]): void {
            this.allowedValues = newValues;
        }
    }
}

/**
 * Representa uma entrada registrada no histórico do terminal.
 */
interface ITerminalEntry {
    database: string | null;
    command: string;
    output: string[];
    type: "success" | "error" | "info";
    timestamp: Date;
}

interface IColumnInputs {
    columnName: string;
    columnType: DataTypes.DataType;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    isNotNull: boolean;
    isUnique: boolean;
    hasDefault: boolean;
    isAutoIncrement: boolean;
    isCurrentTimestamp: boolean;
    defaultValue: string;
    defaultBooleanValue: boolean;
    enumValues: string[];
    referenceTable: string;
    referenceColumn: string;
}

type TReference = { table: string; column: string; };

let databases: Record<string, DB.Database> = {};
const databaseGroup = new DB.NodeGroup("databases", []);

const types = {
    INTEGER: new DataTypes.IntegerType(),
    FLOAT: new DataTypes.FloatType(),
    TEXT: new DataTypes.TextType(),
    BOOLEAN: new DataTypes.BooleanType(),
    DATE: new DataTypes.DateType(),
    TIME: new DataTypes.TimeType(),

    ENUM(values: string[]) {
        return new DataTypes.EnumType(values);
    }
};

let currentDatabase: string | null = null;
let currentTable: string | null = null;
let terminalSessions: TerminalSession[] = [];
let currentTerminalSession: number = 0;

function getCurrentDatabase(): DB.Database | null {
    return currentDatabase ? databases[currentDatabase] : null;
}

function getCurrentTable(): DB.Table | null {
    return currentDatabase && currentTable ? getCurrentDatabase()!.tables[currentTable] : null;
}

function getTable(tableName: string): DB.Table | null {
    return currentDatabase ? getCurrentDatabase()!.tables[tableName] || null : null;
}

//#endregion

// #region Interface functions



/**
 * Cria uma nova database a partir do campo de entrada da interface.
 */
function createDatabaseInterface() {
    const databaseNameInput = document.getElementById("nome-database-input") as HTMLInputElement;
    const databaseName = databaseNameInput.value.trim();

    if (databaseName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da database não pode ser vazio.</p>");
        return;
    } else if (!isValidSQLName(databaseName)) {
        openNotifications("<p style='color: var(--red5)'>O nome da database não segue o padrão permitido.</p>");
        return;
    } else if (databases[databaseName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma database com esse nome.</p>");
        return;
    }

    SGBDFunctions.createDatabase(new DB.Database(databaseName));
    databaseNameInput.value = "";
    openNotifications(`<p style='color: var(--green4)'>Database "${databaseName}" criada com sucesso!</p>`);
}

/**
 * Cria uma nova tabela com as colunas definidas na interface.
 */
function createTableInterface() {
    const tableNameInput = document.getElementById("nome-tabela-input") as HTMLInputElement;
    const tableName = tableNameInput.value.trim();

    if (tableName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não pode ser vazio.</p>");
        return;
    }
    else if (!isValidSQLName(tableName)) {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não segue o padrão permitido.</p>");
        return;
    } else if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    } else if (getTable(tableName)) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma tabela com esse nome.</p>");
        return;
    }

    const table = new DB.Table(tableName);
    const columnsUl = document.querySelector("#criacao-tabela ul")!;
    const parsedColumns = parseColumnsFromInputs(columnsUl.children, table.columns);
    if (parsedColumns === null) return;

    for (const column of parsedColumns) {
        table.columns[column.name] = column;
    }

    SGBDFunctions.createTable(table);
    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl as HTMLElement);
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
    } else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    }
    const columnsUl = document.querySelector("#adicionar-colunas ul#criacao-colunas-edit")!;
    const table = getTable(currentTable!)!;

    const columnsToAdd = parseColumnsFromInputs(columnsUl.children, table.columns);
    if (columnsToAdd === null) return;

    for (const column of columnsToAdd) {
        if (column.isNotNull && !column.hasDefault && !column.isAutoIncrement && !column.isCurrentTimestamp) {
            openNotifications(`<p style='color: var(--red5)'>Não é possível adicionar a coluna "${column.name}" com NOT NULL sem valor padrão.</p>`);
            return;
        }
    }

    for (const column of columnsToAdd) {
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
        } else if (column.hasDefault) {
            table.rows.forEach((row) => {
                row.values[columnName] = column.defaultValue;
            });

            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row.values[columnName];
                table.indexes[columnName].set(value, (table.indexes[columnName].get(value) || []).concat(index));
            });
        } else if (column.isCurrentTimestamp) {
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
        } else {
            table.rows.forEach((row) => {
                row.values[columnName] = null;
            });

            table.indexes[columnName] = new Map();
            table.rows.forEach((row, index) => {
                const value = row.values[columnName];
                table.indexes[columnName].set(value, (table.indexes[columnName].get(value) || []).concat(index));
            });
        }
    }

    for (const column of columnsToAdd) {
        SGBDFunctions.addColumn(table.name, column);
    }

    columnsUl.innerHTML = "";
    createColumnCreationDiv(columnsUl as HTMLElement);
    openNotifications(`<p style='color: var(--green5)'>Colunas adicionadas com sucesso!</p>`);
}

/**
 * Lê os campos do formulário e insere uma nova linha na tabela atual.
 */
function insertRowInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    } else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    } else if (Object.keys(getTable(currentTable!)!.columns).length === 0) {
        openNotifications("<p style='color: var(--red5)'>Não há colunas nessa tabela</p>");
        return;
    }
    let valuesBeforeIncrement: { column: string, value: number }[] = [];
    const table = getTable(currentTable!)!;
    const rowUl = document.querySelector("#inserir-linha ul#colunas-inserir-linha")!;
    const row: DB.Row = new DB.Row({});
    for (const columnElement of rowUl.children) {
        const columnName = columnElement.querySelector("h3")!.textContent!;
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
            } else if (compareTypes(column.type, types.TIME)) {
                row.values[columnName] = SQLTime.now();
            }
            continue;
        }

        let rawValue: string;
        if (compareTypes(column.type, types.BOOLEAN)) {
            rawValue = columnElement.querySelector(".custom-dropdown button")!.textContent!;
        } else {
            rawValue = (columnElement.querySelector("input") as HTMLInputElement).value.trim();
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
            openNotifications(
                `<p style='color: var(--red5)'>Valor inválido para a coluna "${columnName}".</p>`
            );

            table.revertAutoIncrementValues(valuesBeforeIncrement);
            return;
        }
        if (table.columns[columnName].isUnique && table.indexes[columnName].has(value)) {
            openNotifications(`<p style='color: var(--red5)'>O valor "${value}" já existe para a coluna "${columnName}".</p>`);
            table.revertAutoIncrementValues(valuesBeforeIncrement);
            return;
        }

        row.values[columnName] = value;
    }
    SGBDFunctions.insertRow(currentTable!, row);
    changeInsertRowMenu();
    openNotifications(`<p style='color: var(--green5)'>Linha inserida com sucesso!</p>`);
}

/**
 * Atualiza uma linha existente a partir do formulário de edição.
 * @param rowIndex - Índice da linha que será alterada.
 */
function editRowInterface(rowIndex: number) {
    if (Object.keys(getTable(currentTable!)!.columns).length === 0) {
        openNotifications("<p style='color: var(--red5)'>Não há colunas nessa tabela</p>");
        return;
    }

    const table = getTable(currentTable!)!;
    const rowUl = document.querySelector("#editar-linha ul#colunas-editar-linha")!;
    const row: DB.Row = new DB.Row({});
    for (const columnElement of rowUl.children) {
        const columnName = columnElement.querySelector("h3")!.textContent!;
        const column = table.columns[columnName];

        if (column.isAutoIncrement) {
            row.values[columnName] = table.rows[rowIndex].values[columnName];;
            continue;
        }
        if (column.isCurrentTimestamp) {
            if (compareTypes(column.type, types.DATE)) {
                row.values[columnName] = SQLDate.now();
            } else if (compareTypes(column.type, types.TIME)) {
                row.values[columnName] = SQLTime.now();
            }
            continue;
        }

        let rawValue: string;
        if (compareTypes(column.type, types.BOOLEAN)) {
            rawValue = columnElement.querySelector(".custom-dropdown button")!.textContent!;
        } else {
            rawValue = (columnElement.querySelector("input") as HTMLInputElement).value.trim();
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

        row.values[columnName] = value;
    }

    SGBDFunctions.editRow(currentTable!, rowIndex, row);
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
    } else if (currentTable !== null) {
        openNotifications("<p style='color: var(--red5)'>Feche a tabela selecionada para renomear a database.</p>");
        return;
    }
    const databaseNameInput = document.getElementById("renomear-database-input") as HTMLInputElement;
    const newName = databaseNameInput.value.trim().toLowerCase();
    if (newName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da database não pode ser vazio.</p>");
    } else if (databases[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma database com esse nome.</p>");
    } else {
        SGBDFunctions.renameDatabase(currentDatabase!, newName);
        openNotifications("<p style='color: var(--green5)'>Database renomeada com sucesso!</p>");
    }

    updateCustomDropdowns();
}

/**
 * Renomeia a tabela atualmente selecionada.
 */
function renameTableInterface() {
    if (currentDatabase === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma database selecionada.</p>");
        return;
    } else if (currentTable === null) {
        openNotifications("<p style='color: var(--red5)'>Nenhuma tabela selecionada.</p>");
        return;
    }
    const tableNameInput = document.getElementById("renomear-tabela-input") as HTMLInputElement;
    const newName = tableNameInput.value.trim().toLowerCase();
    if (newName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da tabela não pode ser vazio.</p>");
    } else if (getCurrentDatabase()!.tables[newName]) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma tabela com esse nome.</p>");
    } else {
        SGBDFunctions.renameTable(currentTable!, newName);
        openNotifications("<p style='color: var(--green5)'>Tabela renomeada com sucesso!</p>");
    }

    refreshUI();
}

function alterColumnsInterface() {
    const table = getCurrentTable()!;
    const columnsUl = document.getElementById("lista-colunas-existentes")!;
    let columnsToAlter = parseColumnsFromInputs(columnsUl.children, {});
    if (columnsToAlter === null) return;

    for (let i = 0; i < columnsToAlter.length; i++) {
        const newColumn = columnsToAlter[i];
        const columnDiv = columnsUl.children[i];
        const oldColumnName = columnDiv.getAttribute("column-name")!;

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
            const refTable = getCurrentDatabase()!.tables[newColumn.reference.table];

            const refIndex = refTable.indexes[newColumn.reference.column];

            for (const row of table.rows) {
                const value = row.values[oldColumnName];

                if (value !== null && value !== undefined && !refIndex.has(value)) {
                    openNotifications("<p style='color: var(--red5)'>Existem valores nessa coluna que não correspondem a nenhuma entrada na tabela referenciada.</p>");
                    return;
                }
            }
        }
    }

    for (let i = 0; i < columnsToAlter.length; i++) {
        const columnDiv = columnsUl.children[i];
        const newColumn = columnsToAlter[i];
        SGBDFunctions.alterColumn(currentTable!, columnDiv.getAttribute("column-name")!, newColumn);
    }
    openNotifications("<p style='color: var(--green5)'>Colunas alteradas com sucesso!</p>");
}

// Other interface 

function changeLeftSide() {
    const leftSide = document.getElementById("esquerda")!;
    leftSide.innerHTML = "";
    const div = document.createElement("div");
    div.append(databaseGroup.buildTree());
    leftSide.appendChild(div);
}

/**
 * Re-renderiza a visualização detalhada da tabela selecionada.
 */
function changeTabelaSelecionadaTabela() {
    if (currentDatabase === null) {
        document.getElementById("nenhuma-tabela-selecionada")!.style.display = "flex";
        document.getElementById("tabela-selecionada-tabela")!.style.display = "none";
        return;
    } else if (currentTable === null) {
        document.getElementById("nenhuma-tabela-selecionada")!.style.display = "flex";
        document.getElementById("tabela-selecionada-tabela")!.style.display = "none";
        return;
    }
    document.getElementById("nenhuma-tabela-selecionada")!.style.display = "none";
    const selectedTable = document.getElementById("tabela-selecionada-tabela")!;
    selectedTable.style.display = "flex";

    const table = getTable(currentTable!)!;

    let divLinha = document.createElement("div");
    divLinha.classList.add("linha-tabela");
    Object.values(table.columns).forEach((column) => {
        const divColuna = document.createElement("div");
        divColuna.innerHTML = `
            <p>${column.name}</p>
            <p>${column.type.name.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK → " + column.reference?.table + ", " + column.reference?.column : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO INCREMENT" : ""}</p>
        `;

        divColuna.onclick = function () {
            showHideTabelaSelecionadaLinhaColuna(true);
            changeTabelaSelecionadaLinhaColuna("column", undefined, column.name);
        }

        divLinha.appendChild(divColuna);
    });
    const headerActions = document.createElement("div");
    headerActions.innerHTML = "<p>Ações</p>";
    divLinha.appendChild(headerActions);

    document.getElementById("tabela-selecionada-tabela")!.innerHTML = "";
    document.getElementById("tabela-selecionada-tabela")!.appendChild(divLinha);


    table.rows.forEach((row, index) => {
        const divLinha = document.createElement("div");
        divLinha.classList.add("linha-tabela");
        Object.values(table.columns).forEach((column) => {
            const divCelula = document.createElement("div");
            let value: any = row.values[column.name];
            let displayValue: string = value;
            if (compareTypes(column.type, types.DATE) && valueExists(value)) {
                displayValue = SQLDate.toString(value);
            } else if (compareTypes(column.type, types.TIME) && valueExists(value)) {
                displayValue = SQLTime.toString(value);
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
        }
        divLinha.appendChild(rowActions);

        document.getElementById("tabela-selecionada-tabela")!.appendChild(divLinha);
    });
}

/**
 * Atualiza o resumo exibido no painel de ações da tabela.
 */
function changeTabelaInfoVariosBotoes() {
    if (currentDatabase === null) {
        const tabelaInfo = document.getElementById("tabela-info-varios-botoes")!;
        tabelaInfo.querySelector("#nome-tabela")!.textContent = "Nenhuma tabela selecionada";
        tabelaInfo.querySelector("#linhas-colunas")!.textContent = "0 linhas • 0 colunas";
    } else if (currentTable === null) {
        const tabelaInfo = document.getElementById("tabela-info-varios-botoes")!;
        tabelaInfo.querySelector("#nome-tabela")!.textContent = "Nenhuma tabela selecionada";
        tabelaInfo.querySelector("#linhas-colunas")!.textContent = "0 linhas • 0 colunas";
    } else {
        const tabelaInfo = document.getElementById("tabela-info-varios-botoes")!;
        tabelaInfo.querySelector("#nome-tabela")!.textContent = currentTable;
        tabelaInfo.querySelector("#linhas-colunas")!.textContent = `${Object.keys(getTable(currentTable!)!.rows).length} linhas • ${Object.keys(getTable(currentTable!)!.columns).length} colunas`;
    }
}

/**
 * Converte os blocos de criação de colunas em instâncias de `Column`.
 * @param columns - Conjunto de blocos da interface.
 * @param existingColumns - Colunas já existentes para validação de nomes duplicados.
 * @returns Lista de colunas válidas ou `null` quando houver erro.
 */
function parseColumnsFromInputs(columns: HTMLCollection, existingColumns: Record<string, DB.Column>): DB.Column[] | null {
    const parsedColumns: DB.Column[] = [];
    const knownColumns = new Set(Object.keys(existingColumns));

    for (const columnDiv of columns) {
        const columnInputs = readColumnInputs(columnDiv as HTMLElement);
        const column = buildColumnFromInputs(columnInputs, knownColumns);
        if (column === null) return null;

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
function readColumnInputs(columnDiv: HTMLElement): IColumnInputs {
    const columnNameInput = columnDiv.querySelector("input[type='text']") as HTMLInputElement;
    const columnTypeElement = columnDiv.querySelector(".custom-dropdown-trigger") as HTMLElement;
    const isPrimaryKey = columnDiv.querySelector(".primary-key") as HTMLInputElement;
    const isForeignKey = columnDiv.querySelector(".foreign-key") as HTMLInputElement;
    const isNotNull = columnDiv.querySelector(".not-null") as HTMLInputElement;
    const isUnique = columnDiv.querySelector(".unique") as HTMLInputElement;
    const hasDefault = columnDiv.querySelector(".default") as HTMLInputElement;
    const isAutoIncrement = columnDiv.querySelector(".auto-increment") as HTMLInputElement;
    const isCurrentTimestamp = columnDiv.querySelector(".auto-date") as HTMLInputElement;
    const defaultValueInput = columnDiv.querySelector(".default-input-text input") as HTMLInputElement | null;
    const defaultBooleanButton = columnDiv.querySelector(".default-input-text .custom-dropdown-trigger") as HTMLElement | null;
    const enumValuesInput = columnDiv.querySelector(".enum-values input") as HTMLInputElement | null;
    const referenceTableElement = columnDiv.querySelector(".referencia .custom-dropdown:nth-child(2) .custom-dropdown-trigger") as HTMLElement | null;
    const referenceColumnElement = columnDiv.querySelector(".referencia .custom-dropdown:nth-child(3) .custom-dropdown-trigger") as HTMLElement | null;

    return {
        columnName: columnNameInput.value.trim().toLowerCase(),
        columnType: DataTypes.createDataTypeFromString((columnTypeElement.textContent!.toUpperCase() as DataTypes.TDataTypeAsString)),
        isPrimaryKey: isPrimaryKey.checked,
        isForeignKey: isForeignKey.checked,
        isNotNull: isNotNull.checked,
        isUnique: isUnique.checked,
        hasDefault: hasDefault.checked,
        isAutoIncrement: isAutoIncrement.checked,
        isCurrentTimestamp: isCurrentTimestamp.checked,
        defaultValue: defaultValueInput?.value ?? "",
        defaultBooleanValue: defaultBooleanButton?.textContent.toLowerCase().trim() === "true",
        enumValues: enumValuesInput ? [...new Set(enumValuesInput.value.split(",").map((value) => value.trim()))] : [],
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
function buildColumnFromInputs(columnInputs: IColumnInputs, knownColumns: Set<string>): DB.Column | null {
    if (columnInputs.columnName === "") {
        openNotifications("<p style='color: var(--red5)'>O nome da coluna não pode ser vazio.</p>");
        return null;
    } else if (knownColumns.has(columnInputs.columnName)) {
        openNotifications("<p style='color: var(--red5)'>Já existe uma coluna com esse nome.</p>");
        return null;
    }

    const column = new DB.Column(columnInputs.columnName, columnInputs.columnType,
        columnInputs.isPrimaryKey, columnInputs.isForeignKey, columnInputs.isNotNull,
        columnInputs.isUnique, columnInputs.isAutoIncrement, columnInputs.hasDefault,
        columnInputs.isCurrentTimestamp);

    if (columnInputs.hasDefault) {
        if (columnInputs.defaultValue.trim() === "" && !compareTypes(columnInputs.columnType, types.BOOLEAN)) {
            openNotifications("<p style='color: var(--red5)'>O valor padrão não pode ser vazio.</p>");
            return null;
        }

        column.defaultValue = columnInputs.columnType.parse(columnInputs.defaultValue);
        if (valueExists(columnInputs.defaultBooleanValue) && compareTypes(columnInputs.columnType, types.BOOLEAN)) {
            column.defaultValue = columnInputs.defaultBooleanValue;
        }
    }

    if (compareTypes(column.type, types.ENUM([]))) {
        (column.type as DataTypes.EnumType).setAllowedValues(columnInputs.enumValues);
    }

    if (column.isForeignKey) {
        if (columnInputs.referenceTable === "Crie outra tabela" || columnInputs.referenceColumn === "Crie outra coluna") {
            openNotifications("<p style='color: var(--red5)'>Selecione a tabela e coluna de referência para a chave estrangeira.</p>");
            return null;
        }

        if (getCurrentDatabase()!.tables[columnInputs.referenceTable].columns[columnInputs.referenceColumn].type !== column.type) {
            openNotifications("<p style='color: var(--red5)'>O tipo da coluna de referência não corresponde ao tipo da coluna.</p>");
            return null;
        }

        column.reference = {
            table: columnInputs.referenceTable,
            column: columnInputs.referenceColumn
        };
    }

    return column;
}

/**
 * Mostra ou oculta o painel de detalhe de linha ou coluna.
 * @param shouldShow - Define se o painel deve aparecer.
 */
function showHideTabelaSelecionadaLinhaColuna(shouldShow: boolean) {
    const tabelaSelecionadaLinhaColuna = document.getElementById("tabela-selecionada-linha-coluna")!;
    tabelaSelecionadaLinhaColuna.style.display = shouldShow ? "flex" : "none";
}

/**
 * Atualiza o painel de detalhes para uma linha ou coluna específica.
 * @param type - Tipo do detalhe a exibir.
 * @param rowIndex - Índice da linha, quando aplicável.
 * @param columnName - Nome da coluna, quando aplicável.
 */
function changeTabelaSelecionadaLinhaColuna(type: "row" | "column", rowIndex?: number, columnName?: string) {
    function createDisplayValue(value: any, columnType: DataTypes.DataType): string {
        let displayValue: string;
        if (compareTypes(columnType, types.DATE) && valueExists(value)) {
            displayValue = SQLDate.toString(value);
        } else if (compareTypes(columnType, types.TIME) && valueExists(value)) {
            displayValue = SQLTime.toString(value);
        } else {
            displayValue = String(value);
        }
        if (displayValue === "") displayValue = "null";
        return displayValue;
    }
    const tabelaSelecionadaLinhaColuna = document.getElementById("tabela-selecionada-linha-coluna")!;
    const header = tabelaSelecionadaLinhaColuna.querySelector("#tabela-selecionada-linha-coluna-header h3")!;
    header.textContent = type === "row" ? "Linha" : "Coluna";

    const lineColumnsNumber = tabelaSelecionadaLinhaColuna.querySelector("h4")!;
    lineColumnsNumber.textContent = type === "row" ? `${Object.keys(getTable(currentTable!)!.columns).length} colunas` : `${Object.keys(getTable(currentTable!)!.rows).length} linhas`;

    const ul = tabelaSelecionadaLinhaColuna.querySelector("ul")!;
    ul.innerHTML = "";
    if (type === "row") {
        for (const columnName in getTable(currentTable!)!.columns) {
            const div = document.createElement("div");
            const value = getTable(currentTable!)!.rows[rowIndex!].values[columnName];
            const columnType = getTable(currentTable!)!.columns[columnName].type;
            const displayValue = createDisplayValue(value, columnType);
            div.innerHTML = `
                <h5>${columnName} (${columnType.name})</h5>
                <p>${displayValue}</p>
            `;
            ul.appendChild(div);
        }
    } else {
        for (let i = 0; i < getTable(currentTable!)!.rows.length; i++) {
            const div = document.createElement("div");
            const value = getTable(currentTable!)!.rows[i].values[columnName!];
            const columnType = getTable(currentTable!)!.columns[columnName!].type;
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
    changeTabelaInfoVariosBotoes();
    showHideTabelaSelecionadaLinhaColuna(false);
}

// central menus

/**
 * Cria um bloco de formulário para configuração de uma coluna.
 * @param parent - Elemento pai que receberá o bloco.
 */
function createColumnCreationDiv(parent: HTMLElement) {
    const mainDiv = document.createElement("div");
    mainDiv.className = "outlined"

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
        if (char.hidden) label.style.display = "none";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add(char.className);
        checkbox.name = char.name;
        checkbox.onclick = function () { updateCharacteristics(mainDiv); };
        if (char.name === "default") {
            checkbox.onclick = function () { updateCharacteristics(mainDiv); updateDefaultInput(mainDiv); }
        }

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
function deleteColumnCreationDiv(button: HTMLElement) {
    const div = button.parentElement!.parentElement!;
    div.remove();
}

/**
 * Cria um bloco visual para montar uma condição de busca.
 */
function createWhereConditionDiv() {
    const whereConditionsContainer = document.getElementById("where-conditions")!;
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
        if (index === 0) li.classList.add("custom-dropdown-option-selected");
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
    const menu = document.getElementById("configurar-database")!;
    if (currentDatabase === null) {
        menu.querySelector("input")!.value = "";
        return;
    }
    menu.querySelector("input")!.value = currentDatabase;
}

/**
 * Atualiza o campo do menu de configuração de tabela.
 */
function changeConfigurarTabelaMenu() {
    const menu = document.getElementById("configurar-tabela")!;
    if (currentDatabase === null || currentTable === null) {
        menu.querySelector("input")!.value = "";
        return;
    }

    menu.querySelector("input")!.value = currentTable;
}

/**
 * Recria o menu de edição de colunas da tabela atual.
 */
function changeEditColumnsMenu() {
    if (currentDatabase === null) return;
    const menu = document.getElementById("lista-colunas-existentes")!;
    menu.innerHTML = "";
    if (currentTable === null) {
        menu.innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        return;
    } else if (Object.keys(getTable(currentTable!)!.columns).length === 0) {
        menu.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }

    Object.values(getTable(currentTable!)!.columns).forEach((column) => {
        const mainDiv = document.createElement("div");
        mainDiv.className = "outlined"
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
        const allowedConversions: Record<DataTypes.TDataTypeAsString, string[]> = {
            "TEXT": ["Text", "Integer", "Float", "Boolean", "Date", "Time"],
            "INTEGER": ["Text", "Integer", "Float", "Boolean", "Date", "Time"],
            "FLOAT": ["Text", "Integer", "Float", "Boolean", "Date", "Time"],
            "BOOLEAN": ["Text", "Integer", "Float", "Boolean"],
            "DATE": ["Text", "Date"],
            "TIME": ["Text", "Integer", "Float", "Time"],
            "ENUM": ["text", "Enum"]
        };

        let options = allowedConversions[column.type.name];
        options.forEach((option) => {
            const li = document.createElement("li");
            li.className = "custom-dropdown-option";
            if (option.toLowerCase() === column.type.name.toLowerCase()) li.classList.add("custom-dropdown-option-selected");
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
            if (char.hidden) label.style.display = "none";
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add(char.className);
            checkbox.name = char.name;
            checkbox.onclick = function () { updateCharacteristics(mainDiv); };
            if (char.name === "default") {
                checkbox.onclick = function () { updateCharacteristics(mainDiv); updateDefaultInput(mainDiv); }
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
        deleteDiv.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="assets/images/icons-sprite.svg#icon-trash-can"></use></svg>';
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

        mainDiv.appendChild(defaultDiv);

        updateDefaultInput(mainDiv, column.defaultValue);

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
        enumInput.value = compareTypes(column.type, types.ENUM([])) ? (column.type as DataTypes.EnumType).getAllowedValues().join(", ") : "";
        enumDiv.appendChild(enumInput);

        mainDiv.appendChild(enumDiv);

        menu.appendChild(mainDiv);
        updateCharacteristics(mainDiv);
        updateCustomDropdowns();
    });

    const criacaoColunasEdit = document.getElementById("criacao-colunas-edit")!;
    criacaoColunasEdit.innerHTML = "";
    createColumnCreationDiv(criacaoColunasEdit);

    updateCustomDropdowns();
}

/**
 * Recria o menu de inserção de linhas da tabela atual.
 */
function changeInsertRowMenu() {
    if (currentDatabase === null) return;
    const menuUl = document.querySelector("#colunas-inserir-linha")!;
    menuUl.innerHTML = "";
    if (currentTable === null) {
        menuUl.innerHTML = "<p>Crie uma tabela para mostrar as colunas existentes</p>";
        return;
    } else if (Object.keys(getTable(currentTable!)!.columns).length === 0) {
        menuUl.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }

    Object.values(getTable(currentTable!)!.columns).forEach((column) => {
        const div = document.createElement("div");
        menuUl.appendChild(div);

        const h3 = document.createElement("h3");
        h3.textContent = column.name;
        div.appendChild(h3);

        const p = document.createElement("p");
        p.textContent = `(${column.type.name.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})`;
        div.appendChild(p);

        if (column.isAutoIncrement) {
            const p = document.createElement("p");
            p.textContent = "Valor gerado automaticamente";
            div.appendChild(p);
        } else if (compareTypes(column.type, types.INTEGER) || compareTypes(column.type, types.FLOAT)) {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "number";
            input.step = "any";
            div.appendChild(input);
        } else if (compareTypes(column.type, types.BOOLEAN)) {
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
        } else if (compareTypes(column.type, types.DATE)) {
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            } else {
                const input = document.createElement("input");
                input.type = "date";
                input.classList.add("menu-central-input");
                div.appendChild(input);
            }
        } else if (compareTypes(column.type, types.TIME)) {
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            } else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "time";
                input.step = "1";
                div.appendChild(input);
            }
        } else if (compareTypes(column.type, types.ENUM([]))) {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";

            const button = document.createElement("button");
            button.className = "custom-dropdown-trigger";
            button.textContent = compareTypes(column.type, types.ENUM([])) ? (column.type as DataTypes.EnumType).getAllowedValues()[0] : "Selecione um valor";
            button.onclick = function () { openCustomDropdown(button); };
            dropdown.appendChild(button);

            const menu = document.createElement("ul");
            menu.className = "custom-dropdown-menu";
            (column.type as DataTypes.EnumType).getAllowedValues()!.forEach((value, index) => {
                const li = document.createElement("li");
                li.className = "custom-dropdown-option";
                if (index === 0) li.classList.add("custom-dropdown-option-selected");
                li.textContent = value;
                menu.appendChild(li);
            });
            dropdown.appendChild(menu);

            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "enum-value";
            hiddenInput.value = (column.type as DataTypes.EnumType).getAllowedValues()[0];
            dropdown.appendChild(hiddenInput);

            div.appendChild(dropdown);
            updateCustomDropdowns();
        } else {
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
function changeEditRowMenu(rowIndex: number) {
    if (currentDatabase === null) return;
    const menuUl = document.getElementById("colunas-editar-linha")!;
    menuUl.innerHTML = "";
    if (Object.keys(getTable(currentTable!)!.columns).length === 0) {
        menuUl.innerHTML = "<p>Não há colunas nessa tabela</p>";
        return;
    }

    const editButton = menuUl.parentElement!.querySelector("button#editar-linha-button")! as HTMLButtonElement;
    editButton.onclick = function () { editRowInterface(rowIndex); };

    Object.values(getTable(currentTable!)!.columns).forEach((column) => {
        const div = document.createElement("div");
        menuUl.appendChild(div);

        const h3 = document.createElement("h3");
        h3.textContent = column.name;
        div.appendChild(h3);

        const p = document.createElement("p");
        p.textContent = `(${column.type.name.toUpperCase()}${column.isPrimaryKey ? " • PK" : ""}${column.isForeignKey ? " • FK" : ""}${column.isNotNull ? " • NOT NULL" : ""}${column.isUnique ? " • UNIQUE" : ""}${column.isAutoIncrement ? " • AUTO_INCREMENT" : ""})`;
        div.appendChild(p);

        if (column.isAutoIncrement) {
            const p = document.createElement("p");
            p.textContent = "Valor gerado automaticamente";
            div.appendChild(p);
        } else if (compareTypes(column.type, types.INTEGER) || compareTypes(column.type, types.FLOAT)) {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            input.type = "number";
            input.step = "any";
            input.value = getTable(currentTable!)!.rows[rowIndex].values[column.name];
            div.appendChild(input);
        } else if (compareTypes(column.type, types.BOOLEAN)) {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";
            dropdown.innerHTML = `
            <button class="custom-dropdown-trigger" onclick="openCustomDropdown(this)">
                ${getTable(currentTable!)!.rows[rowIndex].values[column.name] ? "frue" : "false"}
            </button>
            <ul class="custom-dropdown-menu">
                <li class="custom-dropdown-option ${getTable(currentTable!)!.rows[rowIndex].values[column.name] ? '' : 'custom-dropdown-option-selected'}">false</li>
                <li class="custom-dropdown-option ${getTable(currentTable!)!.rows[rowIndex].values[column.name] ? 'custom-dropdown-option-selected' : ''}">true</li>
            </ul>
            <input type="hidden" value="text">
            `;
            div.appendChild(dropdown);
            updateCustomDropdowns();
        } else if (compareTypes(column.type, types.DATE)) {
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            } else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "date";
                const value = getTable(currentTable!)!.rows[rowIndex].values[column.name];
                input.value = SQLDate.toString(value);
                div.appendChild(input);
            }

        } else if (compareTypes(column.type, types.TIME)) {
            if (column.isCurrentTimestamp) {
                const p = document.createElement("p");
                p.textContent = "Valor gerado automaticamente";
                div.appendChild(p);
            } else {
                const input = document.createElement("input");
                input.classList.add("menu-central-input");
                input.type = "time";
                input.step = "1";
                const value = getTable(currentTable!)!.rows[rowIndex].values[column.name];
                input.value = SQLTime.toString(value);
                div.appendChild(input);
            }
        } else if (compareTypes(column.type, types.ENUM([]))) {
            const dropdown = document.createElement("div");
            dropdown.className = "custom-dropdown";

            const currentValue = getTable(currentTable!)!.rows[rowIndex].values[column.name];
            const enumValues = (column.type as DataTypes.EnumType).getAllowedValues() ?? [];
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
        } else {
            const input = document.createElement("input");
            input.classList.add("menu-central-input");
            const value = getTable(currentTable!)!.rows[rowIndex].values[column.name];
            input.value = value;
            div.appendChild(input);
        }
    });
}

/**
 * Recria o menu de pesquisa e suas opções de join.
 */
function changeSearchMenu() {
    const searchColumnsDiv = document.getElementById("colunas-pesquisa")!;
    searchColumnsDiv.innerHTML = "";
    const currentTableObj = getTable(currentTable!)!;
    if (currentDatabase === null) {
        searchColumnsDiv.innerHTML = "<p>Selecione uma tabela para mostrar as colunas existentes</p>";
        return;
    } else if (currentTable === null) {
        searchColumnsDiv.innerHTML = "<p>Selecione uma tabela para mostrar as colunas existentes</p>";
        return;
    } else if (Object.keys(currentTableObj.columns).length === 0) {
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
    Object.values(getTable(currentTable!)!.columns).forEach((column) => {
        const label = document.createElement("label");
        label.classList.add("checkbox-div");
        label.innerHTML += `
        <input type="checkbox" name="search-column" value="${column.name}">
        ${column.name} (${column.type.name.toUpperCase()})
        `;
        searchColumnsDiv.appendChild(label);
    });

    // Joins
    const referencesDiv = document.querySelector("#references-search")!;
    referencesDiv.innerHTML = "";

    const isReferenceByDiv = document.querySelector("#is-referenced-by-search")! as HTMLDivElement;
    isReferenceByDiv.innerHTML = "";

    const relationships = getCurrentDatabase()!.getTableRelationships(currentTable!);
    const currentTableReferences = relationships.outgoing;
    const referencedBy = relationships.incoming;

    // OUTGOING
    if (currentTableReferences.length === 0) {
        referencesDiv.innerHTML =
            "<p>Não há chaves estrangeiras nessa tabela para realizar joins</p>";
    } else {
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
    } else {
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
function changeConfirmDeleteMenu(type: "database" | "table" | "column" | "row", rowIndex?: number, columnName?: string) {
    const menuUl = document.getElementById("confirmar-deletar-lista")!;
    menuUl.innerHTML = "";

    if (currentDatabase === null) {
        menuUl.innerHTML = "<p>Nenhuma database selecionada.</p>";
        return;
    } else if (currentTable === null && (type === "table" || type === "column" || type === "row")) {
        menuUl.innerHTML = "<p>Nenhuma tabela selecionada.</p>";
        return;
    }

    if (type === "database" || type === "table" || type === "column" || type === "row") {
        menuUl.innerHTML += `
        <div class="outlined">
            <h4 class="text2">Database</h4>
            <div>
                <p class="text3">${currentDatabase}</p>
                <p class="text3">Tabelas: ${Object.keys(getCurrentDatabase()!.tables).length}</p>
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
                <p class="text3">Colunas: ${Object.keys(getTable(currentTable!)!.columns).length}</p>
            </div>
        </div>
        `;
    }

    if (type === "column") {
        if (!columnName) return;
        menuUl.innerHTML += `
        <div class="outlined">
            <h4 class="text2">Coluna</h4>
            <div>
                <p class="text3">${getTable(currentTable!)!.columns[columnName].name}</p>
                <p class="text3">${getTable(currentTable!)!.columns[columnName].type.name.toLocaleUpperCase()}</p>
            </div>
        </div>
        `;
    }

    if (type === "row") {
        const row = getTable(currentTable!)!.rows[rowIndex!];

        const formattedEntries = Object.entries(row).map(([key, value]) => {
            const column = getTable(currentTable!)!.columns[key];
            let displayValue: any = value;

            if (column) {
                if (compareTypes(column.type, types.DATE)) {
                    displayValue = SQLDate.toString(value);
                } else if (compareTypes(column.type, types.TIME)) {
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

    const deleteButton = document.getElementById("confirmar-deletar-button") as HTMLButtonElement;
    deleteButton.onclick = () => {
        if (type === "database") {
            SGBDFunctions.deleteDatabase(currentDatabase!);
            openNotifications("<p style='color: var(--green5)'>Database deletada com sucesso!</p>");
        } else if (type === "table") {
            const refs = getCurrentDatabase()!.foreignKeyMap[currentTable!];

            if (refs && Object.keys(refs).length > 0) {
                const mensagens: string[] = [];

                for (const column in refs) {
                    for (const ref of refs[column]) {
                        mensagens.push(`${ref.table}.${ref.column}`);
                    }
                }

                openNotifications(
                    `<p style='color: var(--red5)'>Não é possível deletar a tabela. Referenciada por:<br>
                    ${mensagens.join("<br>")}
                    </p>`
                );
                return;
            }
            SGBDFunctions.deleteTable(currentTable!);
            openNotifications("<p style='color: var(--green5)'>Tabela deletada com sucesso!</p>");
        } else if (type === "column") {
            const refs = getCurrentDatabase()!.foreignKeyMap[currentTable!]?.[columnName!];

            if (refs && refs.length > 0) {
                openNotifications(
                    `<p style='color: var(--red5)'>Não é possível deletar a coluna. Referenciada por:<br>
                    ${refs.map(r => `${r.table}.${r.column}`).join("<br>")}
                    </p>`
                );
                return;
            }
            SGBDFunctions.deleteColumn(currentTable!, columnName!);
            openNotifications("<p style='color: var(--green5)'>Coluna deletada com sucesso!</p>");
        } else if (type === "row") {
            SGBDFunctions.deleteRow(currentTable!, rowIndex!);
            openNotifications("<p style='color: var(--green5)'>Linha deletada com sucesso!</p>");
        }
        document.getElementById("menus-centrais")!.style.display = "none";
        document.querySelectorAll("#menus-centrais > div").forEach((m) => {
            const menu = m as HTMLElement;
            menu.style.display = "none";
        });
    };
}

/**
 * Atualiza a exibição e as restrições dos campos de características da coluna.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateCharacteristics(parentDiv: Element) {
    // pegar inputs
    const pkInput = parentDiv.querySelector("input.primary-key") as HTMLInputElement;
    const fkInput = parentDiv.querySelector("input.foreign-key") as HTMLInputElement;
    const notNullInput = parentDiv.querySelector("input.not-null") as HTMLInputElement;
    const uniqueInput = parentDiv.querySelector("input.unique") as HTMLInputElement;
    const defaultInput = parentDiv.querySelector("input.default") as HTMLInputElement;
    const autoIncInput = parentDiv.querySelector("input.auto-increment") as HTMLInputElement;
    const currentTimestampInput = parentDiv.querySelector("input.auto-date") as HTMLInputElement;

    const typeDropdown = parentDiv.querySelector(".custom-dropdown button") as HTMLElement;

    const autoIncLabel = autoIncInput.parentElement as HTMLElement;
    const currentTimestampLabel = currentTimestampInput.parentElement as HTMLElement;

    const state = {
        pk: pkInput.checked,
        fk: fkInput.checked,
        notNull: notNullInput.checked,
        unique: uniqueInput.checked,
        default: defaultInput.checked,
        autoIncrement: autoIncInput.checked,
        currentTimestamp: currentTimestampInput.checked,
        type: typeDropdown.textContent!.toUpperCase() as DataTypes.TDataTypeAsString
    };

    const forcedTrue = {
        notNull: state.pk || state.autoIncrement,
        unique: state.autoIncrement || state.pk,
    };

    const forcedFalse = {
        fk: state.autoIncrement || state.currentTimestamp || state.currentTimestamp,
        default: state.autoIncrement || state.currentTimestamp || state.currentTimestamp,
        autoIncrement: state.fk || state.default || state.type !== "INTEGER",
        currentTimestamp: state.fk || state.default || state.type !== "DATE" && state.type !== "TIME",
    }

    const hidden = {
        autoIncrement: state.type !== "INTEGER",
        currentTimestamp: state.type !== "DATE" && state.type !== "TIME",
    };

    const disabled = {
        notNull: state.pk || state.autoIncrement,
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
    const defaultDiv = parentDiv.querySelector("div.default-input-text") as HTMLElement;
    defaultDiv.style.display = state.default ? "block" : "none";

    // FK
    fkInput.disabled = disabled.fk;
    fkInput.checked = state.fk && !forcedFalse.fk;

    // REFERÊNCIA (FK)
    const referenciaDiv = parentDiv.querySelector("div.referencia") as HTMLElement;
    referenciaDiv.style.display = fkInput.checked ? "block" : "none";
    updateForeignKeyReferenceTableOptions(parentDiv);
    updateForeignKeyReferenceColumnOptions(parentDiv);

    // ENUM
    const enumDiv = parentDiv.querySelector("div.enum-values") as HTMLElement;
    enumDiv.style.display = state.type === "ENUM" ? "block" : "none";
}

/**
 * Troca o tipo do campo de valor padrão conforme o tipo da coluna.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateDefaultInput(parentDiv: Element, initialValue?: any) {
    const type = (parentDiv.querySelector(".custom-dropdown button") as HTMLElement).textContent!.toLowerCase();
    if (type == "boolean") {
        const defaultDiv = parentDiv.querySelector("div.default-input-text") as HTMLElement;
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

    const defaultDiv = parentDiv.querySelector("div.default-input-text") as HTMLElement;
    if (type === "integer") {
        defaultDiv.innerHTML = `
        <p>Default</p>
        <input class="menu-central-input" type="number" placeholder="Valor padrão">
        `;
    } else if (type === "date") {
        defaultDiv.innerHTML = `
        <p>Default</p>
        <input class="menu-central-input" type="date" placeholder="Valor padrão">
        `;
    } else if (type === "time") {
        defaultDiv.innerHTML = `
        <p>Default</p>
        <input class="menu-central-input" type="time" placeholder="Valor padrão">
        `;
    } else {
        defaultDiv.innerHTML = `
        <p>Default</p>
        <input class="menu-central-input" type="text" placeholder="Valor padrão">
        `;
    }

    const input = defaultDiv.querySelector("input") as HTMLInputElement | null;
    if (input && valueExists(initialValue)) {
        input.value = String(initialValue);
    }

    if (type === "date" && valueExists(initialValue)) {
        const input = defaultDiv.querySelector("input") as HTMLInputElement;
        input.value = SQLDate.toString(initialValue);
    }

    if (type === "time" && valueExists(initialValue)) {
        const input = defaultDiv.querySelector("input") as HTMLInputElement;
        input.value = SQLTime.toString(initialValue);
    }
}

/**
 * Atualiza as tabelas disponíveis para referência de chave estrangeira.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateForeignKeyReferenceTableOptions(parentDiv: Element) {
    const database = getCurrentDatabase()!;

    const shouldFilterCurrentTable = currentTable && database.tables[currentTable];

    const availableTables = Object.keys(database.tables).filter(tableName =>
        !shouldFilterCurrentTable || tableName !== currentTable
    );

    const tableSelect = parentDiv.querySelector(".referencia .custom-dropdown-menu") as HTMLElement;
    tableSelect.innerHTML = "";
    availableTables.forEach((tableName, i) => {
        tableSelect.innerHTML += `
            <li class="custom-dropdown-option ${i === 0 ? "custom-dropdown-option-selected" : ""}">${tableName}</li>
        `;
    });

    const refButton = parentDiv.querySelector(".referencia .custom-dropdown-trigger") as HTMLElement;
    if (availableTables.length === 0) {
        refButton.textContent = "Crie outra tabela";
    } else {
        refButton.textContent = availableTables[0];
    }
    updateCustomDropdowns();
}

/**
 * Atualiza as colunas disponíveis na tabela de referência selecionada.
 * @param parentDiv - Container do bloco de criação/edição da coluna.
 */
function updateForeignKeyReferenceColumnOptions(parentDiv: Element) {
    const database = getCurrentDatabase()!;
    const columnSelect = parentDiv.querySelector(".referencia :nth-child(3) .custom-dropdown-menu") as HTMLElement;
    const refTableButton = parentDiv.querySelector(".referencia .custom-dropdown-trigger") as HTMLElement;
    const refButton = parentDiv.querySelector(".referencia :nth-child(3) .custom-dropdown-trigger") as HTMLElement;

    columnSelect.innerHTML = "";

    const referencedTable = database.tables[refTableButton.textContent!];
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
    } else {
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
function getCurrentTerminalSession(): TerminalSession {
    return terminalSessions[currentTerminalSession];
}

const commandTextarea = document.querySelector("#terminal-input-field") as HTMLTextAreaElement;

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

    const terminalSessionsContainer = document.getElementById("terminal-sessions")!;
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
        if (terminalSessions.length === 1) return; // não permite fechar a última sessão
        terminalSessionsContainer.removeChild(sessionDiv);
        currentTerminalSession = 0;
    }
    sessionDiv.appendChild(closeButton);
}

// #endregion

// #region SQL namespace

/**
 * Processa comandos SQL digitados no terminal.
 */
namespace SQL {
    /**
     * Executa o comando SQL completo após tokenização.
     * @param fullCommand - Texto original digitado.
     */
    export function execute(fullCommand: string) {
        const commands = fullCommand.split(";").map(command => command.trim()).filter(command => command.length > 0);
        for (const commandText of commands) {
            const tokens = tokenizeSQL(commandText);

            if (tokens.length === 0) return;
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

    export class SQLAlter {
        private fullCommand: string;
        private tokens: string[];

        constructor(fullCommand: string, tokens: string[]) {
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
            const tableName = this.tokens[2];
            if (currentDatabase === null) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nenhuma database selecionada"], "error");
                return;
            }
            if (getCurrentDatabase()!.tables[tableName] === undefined) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Tabela "${tableName}" não existe na database "${currentDatabase}"`], "error");
                return;
            }

            const action = this.tokens[3]?.toLowerCase();
            switch (action) {
                case "rename":
                    this.rename();
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
                if (getCurrentDatabase()!.tables[newName]) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma tabela com o nome "${newName}" nessa database`], "error");
                    return;
                }
                SGBDFunctions.renameTable(this.tokens[2], newName);
            }
            else if (word5 === "column") {
                if (this.tokens.length !== 8) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
                    return;
                }
                const columnName = this.tokens[5];
                if (getTable(this.tokens[2])!.columns[columnName] === undefined) {
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
                if (getTable(this.tokens[2])!.columns[newName] !== undefined) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma coluna com o nome "${newName}" na tabela "${this.tokens[2]}"`], "error");
                    return;
                }
                const newColumn: DB.Column = getTable(this.tokens[2])!.columns[columnName].clone();
                newColumn.name = newName;
                SGBDFunctions.alterColumn(this.tokens[2], columnName, newColumn);
            }
            else {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando ALTER TABLE incorreto", "Sintaxe incorreta"], "error");
            }
        }

        addColumn() {

        }

        dropColumn() {

        }

        alterColumn() {

        }
    }

    /**
     * Implementa o comando SQL CREATE.
     */
    export class SQLCreate {
        private fullCommand: string;
        private tokens: string[];

        constructor(fullCommand: string, tokens: string[]) {
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
            SGBDFunctions.createDatabase(new DB.Database(databaseName));
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
            if (getCurrentDatabase()!.tables[tableName]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Já existe uma tabela com o nome "${tableName}" nessa database`], "error");
                return;
            }
            if (this.tokens[3] !== "(" || this.tokens[this.tokens.length - 1] !== ")") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE TABLE incorreto", "Sintaxe inválida para a definição da tabela"], "error");
                return;
            }
            if (keyWords.includes(this.tokens[2].toLowerCase())) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Nome da tabela é uma palavra-chave reservada"], "error");
                return;
            }

            let table = new DB.Table(tableName);
            const columnDefs = splitColumnDefinitions(this.tokens.slice(4, -1));

            for (const columnDef of columnDefs) {
                const { column, error } = parseColumn(columnDef);
                if (error) {
                    getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando CREATE TABLE incorreto", error], "error");
                    return;
                }
                table.columns[column!.name] = column!;
            }

            SGBDFunctions.createTable(table);
            getCurrentTerminalSession().createEntry(this.fullCommand, [`Tabela "${tableName}" criada com sucesso!`], "success");
        }

    }

    export class SQLInsert {
        private fullCommand: string;
        private tokens: string[];

        constructor(fullCommand: string, tokens: string[]) {
            this.fullCommand = fullCommand;
            this.tokens = tokens;
        }

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
            if (!getCurrentDatabase()!.tables[tableName]) {
                getCurrentTerminalSession().createEntry(this.fullCommand, [`Tabela "${tableName}" não existe na database "${currentDatabase}"`], "error");
                return;
            }
            const table = getTable(tableName)!;

            let columnsToBeInserted: string[] = [];
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
                    } else if (i % 2 === 1 && token !== ",") {
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

        getRowValuesAndInsert(startIndex: number, tableName: string, columnsToBeInserted: string[]) {
            const t = this.tokens;
            const table = getTable(tableName)!;
            let depth = 0;
            let columnIndex = 0;
            const rowsToBeInserted: DB.Row[] = [];
            let row: DB.Row = new DB.Row({});
            let value = "";
            for (let i = startIndex; i < t.length; i++) {
                const token = t[i];

                if (token === "(") {
                    depth++;
                    if (depth === 1) {
                        row.values = {};
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
                    row.values = {};
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
            if (rowsToBeInserted.length === 0) {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", "Nenhuma linha fornecida"], "error");
                return;
            }

            const validatedRows = this.validateRowsTypes(rowsToBeInserted, table);
            if (typeof validatedRows === "string") {
                getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", validatedRows], "error");
                return;
            }

            let valuesBeforeIncrement: { column: string, value: number }[] = [];
            for (let i = 0; i < validatedRows.length; i++) {
                for (const columnName in table.columns) {
                    let col = table.columns[columnName]
                    if (!columnsToBeInserted.includes(columnName)) {
                        if (col.isNotNull) {
                            if (col.defaultValue !== undefined) {
                                validatedRows[i].values[columnName] = col.defaultValue;
                                continue;
                            } else if (col.isAutoIncrement) {
                                valuesBeforeIncrement.push({ column: columnName, value: col.incrementCounter });
                                validatedRows[i].values[columnName] = col.increment();
                                continue;
                            } else {
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
                    } else {
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

                        if (value === null) continue;
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
                    const referencedTable = getTable(table.columns[columnName].reference!.table)!;
                    const referencedColumn = table.columns[columnName].reference!.column;
                    if (!referencedTable) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é FOREIGN KEY e a tabela referenciada "${table.columns[columnName].reference!.table}" não existe`], "error");
                        table.revertAutoIncrementValues(valuesBeforeIncrement);
                        return;
                    }
                    if (!referencedTable.columns[referencedColumn]) {
                        getCurrentTerminalSession().createEntry(this.fullCommand, ["Comando INSERT incorreto", `Coluna "${columnName}" é FOREIGN KEY e a coluna referenciada "${table.columns[columnName].reference!.column}" não existe na tabela "${table.columns[columnName].reference!.table}"`], "error");
                        table.revertAutoIncrementValues(valuesBeforeIncrement);
                        return;
                    }

                    for (const row of validatedRows) {
                        const value = row.values[columnName];
                        if (value === null) continue;
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
                SGBDFunctions.insertRow(tableName, row);
            }
            getCurrentTerminalSession().createEntry(this.fullCommand, [`${validatedRows.length} linha(s) inserida(s) na tabela "${tableName}"`], "success");
        }

        validateRowsTypes(rows: DB.Row[], table: DB.Table): DB.Row[] | string {
            const newRows: DB.Row[] = [];
            for (const row of rows) {
                const newRow: DB.Row = new DB.Row({})
                for (const columnName in row) {
                    if (typeof row.values[columnName] === "string" && row.values[columnName].toUpperCase() === "NULL") {
                        newRow.values[columnName] = null;
                        continue;
                    }
                    const colType = table.columns[columnName].type;
                    let parsed = row.values[columnName];
                    if (compareTypes(colType, types.TEXT) || compareTypes(colType, types.DATE) || compareTypes(colType, types.TIME)) {
                        if (!(parsed.startsWith("'") && parsed.endsWith("'") || parsed.startsWith('"') && parsed.endsWith('"'))) {
                            return "Tipo deve começar e acabar com \" ou \'"
                        }
                        parsed = (parsed as string).slice(1, parsed.length - 1);
                    }
                    parsed = colType.parse(parsed);
                    if (!valueExists(parsed)) {
                        return `Valor inválido para a coluna "${columnName}"`
                    }
                    newRow.values[columnName] = parsed;
                }
                newRows.push(newRow);
            }
            return newRows;
        }
    }

    /**
     * Agrupa comandos de sistema como USE.
     */
    export class SystemCommands {
        private fullCommand: string;
        private tokens: string[];

        /**
         * Cria um executor para comandos de sistema tokenizados.
         * @param fullCommand - Texto original do comando.
         * @param tokens - Tokens gerados a partir do comando.
         */
        constructor(fullCommand: string, tokens: string[]) {
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

    /**
     * Analisa uma definição de coluna do SQL e cria a instância correspondente.
     * @param columnDef - Tokens que compõem a definição da coluna.
     * @returns Coluna parseada ou mensagem de erro.
     */
    export function parseColumn(columnDef: string[]): { column: DB.Column | null, error: string | null } {
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
        let columnType: DataTypes.DataType;
        if (rawColumnType === "int") {
            columnType = types.INTEGER;
        } else {
            columnType = DataTypes.createDataTypeFromString(rawColumnType.toUpperCase() as DataTypes.TDataTypeAsString);
        }
        if (!valueExists(columnType)) {
            return { column: null, error: `Tipo de coluna inválido: "${columnDef[1]}"` };
        }


        const column = new DB.Column(columnName, columnType, false, false, false, false, false, false, false);

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
                    return { column: null, error: "Tipo deve começar e acabar com \" ou \'" }
                }
            }
            const parsedDefaultValue = columnType.parse(defaultValue);
            if (!valueExists(parsedDefaultValue) || isNaN(parsedDefaultValue)) {
                return { column: null, error: `Valor DEFAULT inválido para ${columnType.name}` }
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
            const refTable = getTable(columnDef[referencesIndex + 1]);
            if (refTable === null) {
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
                } else {
                    if (token !== ",") {
                        return { column: null, error: "Valores ENUM devem ser separados por vírgula" };
                    }
                }
            }
            (column.type as DataTypes.EnumType).setAllowedValues(
                enumValues.filter(token => token !== ",").map(token => {
                    if (token.startsWith('"') && token.endsWith('"')) {
                        return token.slice(1, -1);
                    }
                    return token;
                })
            );
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

    /**
     * Valida palavras-chave compostas, como PRIMARY KEY ou NOT NULL.
     */
    export function validateCompoundKeyword(first: string, second: string, name: string, words: string[]): number | string {
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

    /**
     * Valida palavras-chave simples, como UNIQUE ou DEFAULT.
     */
    export function validateSingleKeyword(keyword: string, name: string, words: string[]): number | string {
        const count = countTokenSequence(words, keyword);
        if (count > 1) {
            return `${name} definido mais de uma vez`;
        }
        return count;
    }

    /**
     * Conta quantas vezes uma sequência de tokens aparece.
     * @param tokens - Lista de tokens de entrada.
     * @param sequence - Sequência a ser procurada.
     * @returns Número de ocorrências encontradas.
     */
    export function countTokenSequence(tokens: string[], ...sequence: string[]): number {
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

    /**
     * Divide a lista de tokens em definições de colunas separadas por vírgula.
     * @param tokens - Tokens da cláusula de colunas.
     * @returns Lista de definições de coluna.
     */
    export function splitColumnDefinitions(tokens: string[]): string[][] {
        const columns: string[][] = [];
        let current: string[] = [];
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

    /**
     * Tokeniza uma string SQL em palavras e símbolos relevantes.
     * @param sql - Texto SQL original.
     * @returns Lista de tokens resultantes.
     */
    export function tokenizeSQL(sql: string): string[] {

        const tokens: string[] = [];

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

    /**
     * Palavras reservadas reconhecidas pelo parser SQL.
     */
    export const keyWords = [
        "primary", "key", "foreign", "not", "null", "unique", "default", "auto_increment", "where",
        "select", "from", "insert", "into", "values", "update", "set", "delete", "create", "table",
        "database", "use", "drop", "alter", "add", "column", "enum", "references", "on", "and", "or",
        "in", "is", "integer", "float", "text", "date", "time", "boolean"
    ];
}

// #endregion

// #region save and load

/**
 * Marca visualmente a ação de salvar/carregar selecionada pela UI.
 * @param div - Elemento que representa a ação clicada.
 */
function selectAction(div: HTMLDivElement) {
    document.querySelector(".acao-escolhida")?.classList.remove("acao-escolhida");
    div.classList.add("acao-escolhida");
}

/**
 * Marca visualmente a opção (local/json/sql) selecionada pela UI.
 * @param div - Elemento que representa a opção clicada.
 */
function selectOption(div: HTMLDivElement) {
    document.querySelector(".opcao-escolhida")?.classList.remove("opcao-escolhida");
    div.classList.add("opcao-escolhida");
}

let timeoutSaveOrLoad: number;
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

    const notification = document.querySelector("#save-notification") as HTMLDivElement;
    const action = selectedAction.id;
    const option = selectedOption.id;
    if (action === "save-action") {
        if (option === "salvar-local") {
            saveToLocalStorage();
        } else if (option === "salvar-json") {
            saveToJson();
        } else if (option === "salvar-sql") {
            saveToSql();
        }

        notification.querySelector("p")!.innerText = "Dados salvos com sucesso!";
        notification.style.display = "block";
        timeoutSaveOrLoad = setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    } else if (action === "load-action") {
        if (option === "salvar-local") {
            loadFromLocalStorage();
        } else if (option === "salvar-json") {
            loadFromJson();
        } else if (option === "salvar-sql") {
            loadFromSql();
        }

        notification.querySelector("p")!.innerText = "Dados carregados com sucesso!";
        notification.style.display = "block";
        timeoutSaveOrLoad = setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }
}

/**
 * Persiste o estado atual de `databases` no `localStorage` do navegador.
 */
function saveToLocalStorage() {
    localStorage.setItem("databases", JSON.stringify(databases));
}

/**
 * Restaura o estado de `databases` a partir do `localStorage`, reconstruindo objetos em memória.
 */
function loadFromLocalStorage() {
    const databasesJson = localStorage.getItem("databases");

    if (!databasesJson) return;

    const parsedDatabases = JSON.parse(databasesJson);

    databases = {};

    for (const dbName in parsedDatabases) {
        const dbData = parsedDatabases[dbName];

        const db = new DB.Database(dbData.name);
        db.foreignKeyMap = dbData.foreignKeyMap || {};

        for (const tableName in dbData.tables) {
            const tableData = dbData.tables[tableName];

            const table = new DB.Table(tableData.name);

            // Colunas
            for (const columnName in tableData.columns) {
                const colData = tableData.columns[columnName];

                const column = new DB.Column(
                    colData.name,
                    colData.type,
                    colData.isPrimaryKey,
                    colData.isForeignKey,
                    colData.isNotNull,
                    colData.isUnique,
                    colData.isAutoIncrement,
                    colData.hasDefault,
                    colData.isCurrentTimestamp,
                    colData.reference
                );

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
                    const value = row.values[columnName];

                    if (!table.indexes[columnName].has(value)) {
                        table.indexes[columnName].set(value, []);
                    }

                    table.indexes[columnName].get(value)!.push(rowIndex);
                }
            });

            db.tables[tableName] = table;
        }

        databases[dbName] = db;
    }

    if (currentDatabase === "") currentDatabase = null;
    if (currentTable === "") currentTable = null;

    refreshUI();
}

/**
 * Gera e inicia o download de um arquivo JSON contendo o estado atual de `databases`.
 */
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

/**
 * Abre um seletor de arquivo para carregar um arquivo JSON com o estado das databases
 * e aplica os dados carregados ao estado em memória.
 */
function loadFromJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result as string);

                if (data.databases === undefined || typeof data.databases !== "object") {
                    throw new Error("Formato de arquivo inválido: propriedade 'databases' ausente ou incorreta");
                }

                const previousDatabase = currentDatabase;
                const previousTable = currentTable;
                let databasesCopy: Record<string, DB.Database> = {};

                for (const dbName in data.databases) {
                    const dbData = data.databases[dbName];

                    const db = new DB.Database(dbData.name);
                    db.foreignKeyMap = dbData.foreignKeyMap || {};

                    for (const tableName in dbData.tables) {
                        const tableData = dbData.tables[tableName];

                        const table = new DB.Table(tableData.name);

                        // Colunas
                        for (const columnName in tableData.columns) {
                            const colData = tableData.columns[columnName];

                            const column = new DB.Column(
                                colData.name,
                                colData.type,
                                colData.isPrimaryKey,
                                colData.isForeignKey,
                                colData.isNotNull,
                                colData.isUnique,
                                colData.isAutoIncrement,
                                colData.hasDefault,
                                colData.isCurrentTimestamp,
                                colData.reference
                            );

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

                        table.rows.forEach((row: Record<string, any>, rowIndex: number) => {
                            for (const columnName in table.indexes) {
                                const value = row[columnName];

                                if (!table.indexes[columnName].has(value)) {
                                    table.indexes[columnName].set(value, []);
                                }

                                table.indexes[columnName].get(value)!.push(rowIndex);
                            }
                        });

                        db.tables[tableName] = table;
                    }

                    databasesCopy[dbName] = db;
                }

                databases = databasesCopy;
                currentDatabase = previousDatabase && databases[previousDatabase] ? previousDatabase : Object.keys(databases)[0] ?? null;
                if (currentDatabase !== null) {
                    const currentDb = getCurrentDatabase();
                    currentTable = currentDb && previousTable && currentDb.tables[previousTable] ? previousTable : Object.keys(currentDb?.tables ?? {})[0] ?? null;
                } else {
                    currentTable = null;
                }
                refreshUI();

            } catch (error) {
                console.error(error);
                alert("Arquivo JSON inválido.");
            }
        };

        reader.readAsText(file);
    };

    input.click();
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

// #endregion

// #region help

function createHelpButtons() {
    const helpButtons = document.querySelectorAll("#help-left > div");
    helpButtons.forEach((button, index) => {
        button.addEventListener("click", () => showHelp(index));
    });
}

function showHelp(index: number) {
    const helpRight = document.getElementById("help-right")!;
    const helpButtons = document.querySelectorAll("#help-left > div");
    const helpLeft = document.getElementById("help-left")!;
    for (let i = 0; i < helpButtons.length; i++) {
        const child = helpRight.children[i] as HTMLElement;
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
        if (session.history.length === 0) return;
        if (TerminalSession.historyIndex === session.history.length) return;
        event.preventDefault();
        TerminalSession.historyIndex++;
        commandTextarea.value = session.history[session.history.length - TerminalSession.historyIndex].command;
        commandTextarea.style.height = "auto";
        commandTextarea.style.height = commandTextarea.scrollHeight + "px";
    } else if (event.key === "ArrowDown") {
        const session = getCurrentTerminalSession();
        if (session.history.length === 0) return;
        if (TerminalSession.historyIndex === 0) return;
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
    } else {
        TerminalSession.historyIndex = 0;
    }
});

document.addEventListener("click", closeAllCustomDropdowns);

document.getElementById("menus-centrais")!.addEventListener("click", (event) => {
    if (event.target !== event.currentTarget) return;

    document.querySelectorAll("#menus-centrais > div").forEach((m) => {
        const menu = m as HTMLElement;
        menu.style.display = "none";
    });
    document.getElementById("menus-centrais")!.style.display = "none";
});

window.addEventListener('load', () => updateInterfaceTerminalIndicator(buttonChangeToGrafical));


createColumnCreationDiv(document.querySelector("#criacao-tabela ul")!);
createColumnCreationDiv(document.getElementById("criacao-colunas-edit")!);

createHelpButtons();

createExempleDatabase();

changeLeftSide();

// To Do
// -Atualizar a arvore quando algo acontece
// -Criar um sistema de arquivos
// -Aba de ajuda
// -Criar classes para cada tipo
// -AST para comandos SQL
// -Constraints de integridade
// -ver () dentro de strings no insert
// -Terminal
// -Salvar e carregar em SQL
// -Salvar e carregar com Banco de dados
// -Modelo lógico (diagrama de entidade relacionamento)
// -Pesquisar(Dashboard)
// -Permitir sincronização com banco real
// -Adicionar mais tipos de dados (JSON, BLOB, varchar, decimal, etc)
// -Validações para SQLDate e Time na criação
