import { setupTabNavigation, setupSaveLoadUI } from "../others/global.js";

setupTabNavigation({
    menus: ["regras", "personagem", "save"],
    initial: "regras"
});

const rules: Record<string, string> = {
    "demonstracao-framework": "Demonstração do framework",
    "introducao": "Introdução",
};


const rulesPage = document.getElementById("regras")!;
const navigation = rulesPage.querySelector("#rules-navigation")!;
const content = rulesPage.querySelector("#rules-content")!;
const search = rulesPage.querySelector("#rules-search") as HTMLInputElement;
const location = document.getElementById("location")!

for (const [id, title] of Object.entries(rules)) {
    const button = document.createElement("button");
    button.textContent = title;
    button.dataset.target = id;
    if (id === "demonstracao-framework") {
        button.classList.add("ativo");
    }
    button.addEventListener("click", () => {
        for (let b of navigation.children) {
            let child = b as HTMLButtonElement;
            child.classList.remove("ativo");
        }
        button.classList.add("ativo");
        for (let c of content.children) {
            let child = c as HTMLElement;
            if (child.id === id) {
                child.style.display = "block";
                location.textContent = title;
            } else {
                child.style.display = "none";
                
            }
        }
    });
    navigation.appendChild(button);
}