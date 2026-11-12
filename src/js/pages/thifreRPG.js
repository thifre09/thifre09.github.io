import { setupTabNavigation } from "../others/global.js";
setupTabNavigation({
    menus: ["regras", "personagem", "save"],
    initial: "regras"
});
const rules = [
    {
        id: "introducao",
        title: "Introdução",
        group: "Geral",
        icon: "⌂",
        description: "Conheça os fundamentos do sistema e prepare-se para suas aventuras.",
        content: `
            <section class="rule-section">
                <h2>Sobre o sistema</h2>
                <p>
                    Este é um sistema de RPG de mesa que utiliza atributos,
                    classes, habilidades e um sistema próprio de combate
                    para proporcionar liberdade na criação de personagens.
                </p>
            </section>

            <section class="rule-section">
                <h2>Como utilizar este manual</h2>
                <p>
                    Este compêndio reúne as regras necessárias para
                    compreender e jogar o sistema. Utilize o menu lateral
                    para navegar entre os diferentes assuntos.
                </p>

                <div class="rule-highlight">
                    <strong>Dica:</strong>
                    Utilize a pesquisa para encontrar rapidamente
                    uma regra específica.
                </div>
            </section>
        `
    },
    {
        id: "atributos",
        title: "Atributos",
        group: "Personagem",
        icon: "◈",
        description: "As capacidades físicas, mentais e sociais dos personagens.",
        content: `
            <section class="rule-section">
                <h2>O que são atributos?</h2>
                <p>
                    Os atributos representam as capacidades de um personagem.
                    Eles influenciam suas ações e determinam suas aptidões.
                </p>
            </section>

            <section class="rule-section">
                <h2>Distribuição de atributos</h2>
                <p>
                    A distribuição acontece durante a criação do personagem,
                    seguindo as regras estabelecidas pelo sistema.
                </p>
            </section>
        `
    },
    {
        id: "classes",
        title: "Classes",
        group: "Personagem",
        icon: "♜",
        description: "Conheça as classes e subclasses disponíveis.",
        content: `
            <section class="rule-section">
                <h2>Classes principais</h2>
                <p>
                    As classes determinam a especialização principal
                    de um personagem, definindo suas capacidades
                    e seu estilo de jogo.
                </p>
            </section>

            <section class="rule-section">
                <h2>Especialista</h2>
                <p>Descreva aqui as características da classe Especialista.</p>
            </section>

            <section class="rule-section">
                <h2>Guerreiro</h2>
                <p>Descreva aqui as características da classe Guerreiro.</p>
            </section>

            <section class="rule-section">
                <h2>Arcanista</h2>
                <p>Descreva aqui as características da classe Arcanista.</p>
            </section>

            <section class="rule-section">
                <h2>Subclasses</h2>
                <p>
                    Cada classe pode possuir diferentes subclasses,
                    responsáveis por definir especializações e estilos de jogo.
                </p>
            </section>
        `
    },
    {
        id: "pericias",
        title: "Perícias",
        group: "Personagem",
        icon: "✧",
        description: "Conhecimentos e especializações dos personagens.",
        content: `
            <section class="rule-section">
                <h2>Perícias</h2>
                <p>
                    Adicione aqui as regras relacionadas às perícias,
                    seus níveis de especialização e suas aplicações.
                </p>
            </section>
        `
    },
    {
        id: "combate",
        title: "Combate",
        group: "Combate",
        icon: "⚔",
        description: "Entenda como funcionam os confrontos.",
        content: `
            <section class="rule-section">
                <h2>O combate</h2>
                <p>
                    Explique aqui o funcionamento geral do combate,
                    incluindo a ordem dos acontecimentos e as regras
                    utilizadas durante os confrontos.
                </p>
            </section>

            <section class="rule-section">
                <h2>Ações</h2>
                <p>
                    Descreva os tipos de ações disponíveis durante
                    um turno e suas respectivas limitações.
                </p>
            </section>

            <section class="rule-section">
                <h2>Classe de Armadura</h2>
                <p>
                    Explique o funcionamento da Classe de Armadura
                    e sua relação com os ataques.
                </p>
            </section>
        `
    },
    {
        id: "ataques",
        title: "Ataques",
        group: "Combate",
        icon: "⚔",
        description: "Regras para criação e utilização de ataques.",
        content: `
            <section class="rule-section">
                <h2>Criação de ataques</h2>
                <p>
                    Apresente o sistema de criação de ataques,
                    seus atributos e os custos associados.
                </p>
            </section>

            <section class="rule-section">
                <h2>Características dos ataques</h2>
                <p>
                    Explique as características que podem ser
                    utilizadas na construção de um ataque.
                </p>
            </section>
        `
    },
    {
        id: "magia",
        title: "Magia",
        group: "Combate",
        icon: "✧",
        description: "O funcionamento do sistema de magia.",
        content: `
            <section class="rule-section">
                <h2>Sistema de magia</h2>
                <p>
                    Apresente as regras gerais da magia e sua relação
                    com a classe Arcanista.
                </p>
            </section>

            <section class="rule-section">
                <h2>Pontos de magia</h2>
                <p>
                    Explique como os pontos de magia são obtidos,
                    utilizados e recuperados.
                </p>
            </section>
        `
    },
    {
        id: "progressao",
        title: "Progressão",
        group: "Desenvolvimento",
        icon: "↗",
        description: "A evolução dos personagens ao longo da campanha.",
        content: `
            <section class="rule-section">
                <h2>Níveis</h2>
                <p>
                    Explique como funciona a progressão de níveis
                    e quais benefícios são desbloqueados.
                </p>
            </section>

            <section class="rule-section">
                <h2>Habilidades</h2>
                <p>
                    Apresente como novas habilidades são adquiridas
                    durante a evolução do personagem.
                </p>
            </section>
        `
    },
    {
        id: "equipamentos",
        title: "Equipamentos",
        group: "Desenvolvimento",
        icon: "◇",
        description: "Armas, armaduras e outros equipamentos.",
        content: `
            <section class="rule-section">
                <h2>Equipamentos</h2>
                <p>
                    Apresente as regras relacionadas aos equipamentos,
                    seus efeitos e suas limitações.
                </p>
            </section>
        `
    }
];
// Elementos da página
const rulesPage = document.getElementById("regras");
const navigation = rulesPage.querySelector("#rules-navigation");
const content = rulesPage.querySelector("#rules-content");
const search = rulesPage.querySelector("#rules-search");
const pageTitle = rulesPage.querySelector("#rules-title");
const pageDescription = rulesPage.querySelector("#rules-description");
const breadcrumb = rulesPage.querySelector("#rules-breadcrumb");
let activeRule = "introducao";
/**
 * Retorna as regras correspondentes à pesquisa.
 */
function getFilteredRules() {
    const query = search.value.trim().toLowerCase();
    if (!query)
        return rules;
    return rules.filter(rule => {
        const searchable = [
            rule.title,
            rule.group,
            rule.description,
            rule.content.replace(/<[^>]*>/g, "")
        ].join(" ").toLowerCase();
        return searchable.includes(query);
    });
}
/**
 * Renderiza o menu lateral.
 */
function renderNavigation() {
    navigation.innerHTML = "";
    const filteredRules = getFilteredRules();
    const groups = [...new Set(filteredRules.map(rule => rule.group))];
    for (const group of groups) {
        const groupElement = document.createElement("div");
        groupElement.className = "rules-nav-group";
        const groupTitle = document.createElement("div");
        groupTitle.className = "rules-nav-group-title";
        groupTitle.textContent = group;
        groupElement.appendChild(groupTitle);
        for (const rule of filteredRules.filter(rule => rule.group === group)) {
            const button = document.createElement("button");
            button.className = "rules-nav-item";
            if (rule.id === activeRule) {
                button.classList.add("active");
            }
            const icon = document.createElement("span");
            icon.className = "rules-nav-icon";
            icon.textContent = rule.icon;
            const title = document.createElement("span");
            title.textContent = rule.title;
            button.append(icon, title);
            button.addEventListener("click", () => {
                showRule(rule.id);
            });
            groupElement.appendChild(button);
        }
        navigation.appendChild(groupElement);
    }
}
/**
 * Exibe uma categoria de regras.
 */
function showRule(id) {
    const rule = rules.find(rule => rule.id === id);
    if (!rule)
        return;
    activeRule = id;
    pageTitle.textContent = rule.title;
    pageDescription.textContent = rule.description;
    breadcrumb.textContent = rule.title;
    content.innerHTML = rule.content;
    renderNavigation();
}
/**
 * Atualiza a pesquisa.
 */
function filterRules() {
    const filteredRules = getFilteredRules();
    renderNavigation();
    if (!filteredRules.some(rule => rule.id === activeRule)) {
        if (filteredRules.length > 0) {
            showRule(filteredRules[0].id);
        }
        else {
            pageTitle.textContent = "Nenhum resultado";
            pageDescription.textContent =
                "Não encontramos regras correspondentes à sua pesquisa.";
            breadcrumb.textContent = "Pesquisa";
            content.innerHTML = `
                <div class="rules-empty">
                    Nenhuma regra encontrada.
                </div>
            `;
        }
    }
}
// Eventos
search.addEventListener("input", filterRules);
document.addEventListener("keydown", event => {
    if (!rulesPage.classList.contains("active") &&
        !rulesPage.classList.contains("visivel"))
        return;
    if (event.key === "/" &&
        document.activeElement !== search) {
        event.preventDefault();
        search.focus();
    }
    if (event.key === "Escape") {
        search.value = "";
        search.blur();
        filterRules();
    }
});
// Inicialização
showRule("introducao");
