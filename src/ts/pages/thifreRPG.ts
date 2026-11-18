import { setupTabNavigation, setupSaveLoadUI } from "../others/global.js";

setupTabNavigation({
    menus: ["regras", "personagem", "save"],
    initial: "regras"
});

type RuleNode = {
    title: string;
    children?: Record<string, RuleNode>;
};

const rules: Record<string, RuleNode> = {
    "demonstracao-framework": {
        title: "Demonstração do framework"
    },
    "introducao": {
        title: "Introdução"
    },

    "classes": {
        title: "Classes",
        children: {
            "artifice": {
                title: "Artífice"
            },
            "barbaro": {
                title: "Bárbaro",
            },
            "bardo": {
                title: "Bardo",
            },
            "bruxo": {
                title: "Bruxo",
            },
            "clerigo": {
                title: "Clérigo",
            },
            "druida": {
                title: "Druida",
            },
            "feiticeiro": {
                title: "Feiticeiro",
            },
            "guerreiro": {
                title: "Guerreiro",
            },
            "ladino": {
                title: "Ladino",
            },
            "mago": {
                title: "Mago",
            },
            "monge": {
                title: "Monge",
            },
            "paladino": {
                title: "Paladino",
            },

        }
    }
};

const rulesPage = document.getElementById("regras")!;
const navigation = rulesPage.querySelector<HTMLElement>("#rules-navigation")!;
const content = rulesPage.querySelector("#rules-content")!;
const search = rulesPage.querySelector("#rules-search") as HTMLInputElement;
const currentLocation = document.getElementById("current-location")!
const parentsLocation = document.getElementById("parents-location")!

function findRule(ruleId: string, ruleMap: Record<string, RuleNode>): RuleNode | undefined {
    for (const [id, rule] of Object.entries(ruleMap)) {
        if (id === ruleId) return rule;

        if (rule.children) {
            const child = findRule(ruleId, rule.children);
            if (child) return child;
        }
    }
}

function showRule(ruleId: string, button: HTMLButtonElement): void {
    const rule = findRule(ruleId, rules);
    if (!rule || !content.querySelector(`#${CSS.escape(ruleId)}`)) return;

    for (const child of navigation.querySelectorAll("button")) {
        child.classList.remove("ativo");
    }
    button.classList.add("ativo");

    for (const child of content.children) {
        const element = child as HTMLElement;
        element.style.display = element.id === ruleId ? "block" : "none";
    }
    currentLocation.textContent = rule.title;
    parentsLocation.textContent = "Compêndio";
}

function renderRules(rulesToRender: Record<string, RuleNode>, parent: HTMLElement, level = 0): void {
    for (const [ruleId, rule] of Object.entries(rulesToRender)) {
        const item = document.createElement("div");
        item.className = "rules-navigation-item";
        item.dataset.level = String(level);

        const button = document.createElement("button");
        button.id = `rule-button-${ruleId}`;
        button.textContent = rule.title;
        button.dataset.target = ruleId;

        if (rule.children && Object.keys(rule.children).length > 0) {
            button.innerHTML += `
            <svg viewBox="0 0 24 24" height="24px" width="24px" fill="currentcolor">
                <path d="M12.6,12L8,7.4L9.4,6l6,6l-6,6L8,16.6L12.6,12Z"/>
            </svg>
            `;
            button.setAttribute("aria-expanded", "false");
            button.addEventListener("click", () => {
                const isExpanded = button.getAttribute("aria-expanded") === "true";
                button.setAttribute("aria-expanded", String(!isExpanded));
                item.classList.toggle("expanded", !isExpanded);
                showRule(ruleId, button);
            });
        } else {
            button.addEventListener("click", () => {
                showRule(ruleId, button);
            });
        }

        item.appendChild(button);
        parent.appendChild(item);

        if (rule.children && Object.keys(rule.children).length > 0) {
            const children = document.createElement("div");
            children.className = "rules-navigation-children";
            renderRules(rule.children, children, level + 1);
            item.appendChild(children);
        }
    }
}

renderRules(rules, navigation);
const initialRule = navigation.querySelector<HTMLButtonElement>("[data-target='demonstracao-framework']");
if (initialRule) showRule("demonstracao-framework", initialRule);

function filterRules(parent: HTMLElement, query: string): boolean {
    let hasMatch = false;

    for (const item of parent.children) {
        const element = item as HTMLElement;
        const button = element.querySelector<HTMLElement>(":scope > button");
        const children = element.querySelector<HTMLElement>(":scope > .rules-navigation-children");
        const ownMatch = button?.textContent?.toLocaleLowerCase().includes(query) ?? false;
        const childMatch = children ? filterRules(children, query) : false;
        const matches = !query || ownMatch || childMatch;

        element.hidden = !matches;
        if (childMatch && query) {
            element.classList.add("expanded");
            button?.setAttribute("aria-expanded", "true");
        }
        hasMatch ||= matches;
    }

    return hasMatch;
}

search.addEventListener("input", () => {
    filterRules(navigation, search.value.trim().toLocaleLowerCase());
});

const clickElements = document.querySelectorAll<HTMLElement>("[click]");
clickElements.forEach((element) => {
    element.addEventListener("click", () => {
        const targetId = element.getAttribute("click");
        if (!targetId) return;
        const targetButton = document.getElementById(`rule-button-${targetId}`) as HTMLButtonElement | null;
        if (!targetButton) return;

        showRule(targetId, targetButton);
    });
});