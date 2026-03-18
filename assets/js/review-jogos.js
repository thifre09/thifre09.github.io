"use strict";
class Review {
    constructor(nome, imagem, notas, comentarioPrincipal = "") {
        this.nome = nome;
        this.imagem = imagem;
        this.notas = notas;
        this.comentarioPrincipal = comentarioPrincipal;
    }
}
class Notas {
    constructor(gameplay = 0, historia = 0, graficos = 0, trilhaSonora = 0, tempoJogado = "Não sei", dificuldade = 0, diversao = 0, notaFinal = 0) {
        this.gameplay = gameplay;
        this.historia = historia;
        this.graficos = graficos;
        this.trilhaSonora = trilhaSonora;
        this.tempoJogado = tempoJogado;
        this.dificuldade = dificuldade;
        this.diversao = diversao;
        this.notaFinal = notaFinal;
    }
}
function criarReviews() {
    const reviewsContainer = document.getElementById("reviews");
    reviews.forEach(review => {
        const jogoDiv = document.createElement("div");
        jogoDiv.classList.add("jogo");
        reviewsContainer.appendChild(jogoDiv);
        const h2 = document.createElement("h2");
        h2.textContent = review.nome;
        jogoDiv.appendChild(h2);
        const divPrincipal = document.createElement("div");
        jogoDiv.appendChild(divPrincipal);
        const img = document.createElement("img");
        img.src = `assets/images/jogos reviews img/${review.imagem}`;
        divPrincipal.appendChild(img);
        const tabela = document.createElement("div");
        tabela.classList.add("tabela");
        divPrincipal.appendChild(tabela);
        const divDentroTabela = document.createElement("div");
        tabela.appendChild(divDentroTabela);
        for (const [key, value] of Object.entries(review.notas)) {
            const div = document.createElement("div");
            divDentroTabela.appendChild(div);
            const h3 = document.createElement("h3");
            div.appendChild(h3);
            const h4 = document.createElement("h4");
            h4.textContent = value.toString();
            div.appendChild(h4);
            if (key === "tempoJogado") {
                h3.textContent = "Tempo jogado";
                h4.style.backgroundColor = "var(--blue5)";
            }
            else if (key === "dificuldade") {
                h3.textContent = "Dificuldade";
                switch (true) {
                    case value === 10:
                        h4.style.backgroundColor = "var(--red3)";
                        break;
                    case value >= 8:
                        h4.style.backgroundColor = "var(--red4)";
                        break;
                    case value >= 6:
                        h4.style.backgroundColor = "var(--orange5)";
                        break;
                    case value >= 4:
                        h4.style.backgroundColor = "var(--yellow6)";
                        break;
                    case value >= 2:
                        h4.style.backgroundColor = "var(--green5)";
                        break;
                    case value >= 0:
                        h4.style.backgroundColor = "var(--green3)";
                        break;
                    default:
                        h4.style.backgroundColor = "gray";
                        break;
                }
            }
            else if (key === "trilhaSonora") {
                h3.textContent = "Trilha sonora";
                switch (true) {
                    case value === 10:
                        h4.style.backgroundColor = "var(--green3)";
                        break;
                    case value >= 8:
                        h4.style.backgroundColor = "var(--green5)";
                        break;
                    case value >= 6:
                        h4.style.backgroundColor = "var(--yellow6)";
                        break;
                    case value >= 4:
                        h4.style.backgroundColor = "var(--orange5)";
                        break;
                    case value >= 2:
                        h4.style.backgroundColor = "var(--red4)";
                        break;
                    case value >= 0:
                        h4.style.backgroundColor = "var(--red3)";
                        break;
                    default:
                        h4.style.backgroundColor = "gray";
                        break;
                }
            }
            else {
                h3.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                switch (true) {
                    case value === 10:
                        h4.style.backgroundColor = "var(--green3)";
                        break;
                    case value >= 9:
                        h4.style.backgroundColor = "var(--green5)";
                        break;
                    case value >= 8:
                        h4.style.backgroundColor = "var(--yellow6)";
                        break;
                    case value >= 6:
                        h4.style.backgroundColor = "var(--orange5)";
                        break;
                    case value >= 4:
                        h4.style.backgroundColor = "var(--red4)";
                        break;
                    case value >= 0:
                        h4.style.backgroundColor = "var(--red2)";
                        break;
                    default:
                        h4.style.backgroundColor = "gray";
                        break;
                }
            }
        }
        const comentarios = document.createElement("div");
        comentarios.classList.add("comentarios");
        divPrincipal.appendChild(comentarios);
        comentarios.innerHTML = `
            <h5>Comentario</h5>
            <div>
                <p class="comentario-principal">${review.comentarioPrincipal}</p>         
            </div>
        `;
    });
}
let reviews = [
    new Review("A Hat in Time", "a hat in time.jpg", new Notas(6, 4, 6, 9, "", 2, 7, 6)),
    new Review("Among Us", "among us.jpeg", new Notas(8, "N/A", 8.5, 9.5, "Não sei", "1-10", 10, 8)),
    new Review("Animal Well", "animal well.jpg", new Notas(9, "Não sei", 8.5, 8, "", 4, 9.5, 9)),
    new Review("Astro's Playroom", "astro playroom.jpeg", new Notas(10, "N/A", 10, 9, "", 1, 10, 10)),
    new Review("Beat Saber", "beat saber.jpg", new Notas(10, "N/A", "N/A", 10, "Não sei", "1-10", 10, 10)),
    new Review("Bloodborne", "bloodborne.jpg", new Notas(8, 4, 6, 8, "", 7, 8, 9)),
    new Review("Brawl stars", "brawl stars.jpg", new Notas(9.5, "Não sei", 10, 9.5, "+500h", "4-10", 9, 9)),
    new Review("Bloons TD battles 2", "BTD battles 2.jpeg", new Notas(9, "N/A", 9, 9.5, "200h", "4-10", 9, 8.5)),
    new Review("Bloons TD 6", "BTD6.jpeg", new Notas(9, "N/A", 9.5, 9.5, "+50h", 7, 8, 8.5)),
    new Review("Carto", "carto.jpg", new Notas(8.5, 6.5, 8, 8, "", 2, 7, 8)),
    new Review("Celeste", "celeste.jpg", new Notas(9, 5, 8.5, 8.5, "", 6, 8.5, 9)),
    new Review("Civilization 6", "civilization 6.jpg", new Notas(9.5, "N/A", 9, 8, "+33h", 6, "6-9", 9)),
    new Review("Clair Obscur: expedition 33", "clair obscur.jpg", new Notas(10, 10, 9.5, 10, "", 5, 10, 10)),
    new Review("Clash of clans", "clash of clans.jpg", new Notas(7, "N/A", 9.5, 9, "Não sei", 5, 6.5, 8.5)),
    new Review("Clash royale", "clash royale.jpg", new Notas(9.5, "N/A", 9.5, 9, "Não sei", "5-10", 10, 8.5)),
    new Review("Control", "control.jpg", new Notas(7, 4, 9, 7, "", 4, 6, 5.5)),
    new Review("Death Stranding", "death stranding.jpg", new Notas()),
    new Review("Demon's Souls", "demons souls.jpg", new Notas()),
    new Review("Detroit: Become Human", "detroit.jpg", new Notas()),
    new Review("Dispatch", "dispatch.jpg", new Notas()),
    new Review("Doki Doki literature club plus", "doki doki.jpg", new Notas()),
    new Review("Fall guys", "fall guys.jpeg", new Notas()),
    new Review("Forager", "forager.jpg", new Notas()),
    new Review("Fortnite", "fortnite.jpeg", new Notas()),
    new Review("Geometry Dash", "geometry dash.png", new Notas()),
    new Review("Ghost of Tsushima", "ghost of tsushima.jpeg", new Notas()),
    new Review("God of war 1", "god of war 1.jpeg", new Notas()),
    new Review("God of war 2", "god of war 2.jpeg", new Notas()),
    new Review("God of war 2018", "god of war 2018.jpeg", new Notas()),
    new Review("God of War Ragnarok", "god of war ragnarok.jpg", new Notas()),
    new Review("Hades", "hades.jpg", new Notas()),
    new Review("Hades 2", "hades 2.jpg", new Notas()),
    new Review("Hogwarts Legacy", "hogwarts legacy.jpeg", new Notas()),
    new Review("Hollow Knight", "hollow knight.jpeg", new Notas()),
    new Review("Hollow Knight: Silksong", "silksong.jpg", new Notas()),
    new Review("Horizon Forbidden West", "horizon forbidden west.jpeg", new Notas()),
    new Review("Horizon Zero Dawn", "horizon zero dawn.jpeg", new Notas()),
    new Review("Kena: bridge of spirits", "kena bridge of spirits.jpg", new Notas()),
    new Review("Life is Strange", "life is strange 1.jpeg", new Notas()),
    new Review("Life is Strange 2", "life is strange 2.jpg", new Notas()),
    new Review("Minecraft", "minecraft.jpeg", new Notas()),
    new Review("Ratchet and clank: Rift Apart", "ratchet and clank rift apart.jpg", new Notas()),
    new Review("Red Dead Redemption 2", "red dead 2.jpeg", new Notas()),
    new Review("Sekiro", "sekiro.jpg", new Notas()),
    new Review("Shadow of the colossus", "shadow of the colossus.jpg", new Notas()),
    new Review("Spider-man 2", "spider man 2.jpg", new Notas()),
    new Review("Spider-man Miles Morales", "spider man miles morales.jpg", new Notas()),
    new Review("Spider-man remastered", "spider man remastered.jpg", new Notas()),
    new Review("Squad Buster", "squad busters.jpg", new Notas()),
    new Review("Stumble guys", "stumble guys.jpeg", new Notas()),
    new Review("Superhot", "super hot.jpg", new Notas()),
    new Review("The Last of Us 1", "the last of us 1.jpg", new Notas()),
    new Review("The Last of Us 2", "the last of us 2.jpg", new Notas()),
    new Review("The Plucky Squire", "the plucky squire.jpg", new Notas()),
    new Review("The Stanley Parable: Ultra Deluxe", "the stanley parable ultra deluxe.jpg", new Notas()),
    new Review("Two Points Hospital", "two point hospital.jpeg", new Notas()),
];
function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length === 0) {
            searchResults.classList.remove("active");
            return;
        }
        const filteredReviews = reviews.filter(review => review.nome.toLowerCase().includes(query));
        if (filteredReviews.length === 0) {
            searchResults.innerHTML = "<div style='padding: var(--p3); text-align: center; color: var(--black);'>Nenhum jogo encontrado</div>";
            searchResults.classList.add("active");
            return;
        }
        searchResults.innerHTML = filteredReviews
            .map((review) => `
                <div class="search-result-item" onclick="scrollToGame('${review.nome.replace(/'/g, "\\'")}')"  >
                    <img src="assets/images/jogos reviews img/${review.imagem}" alt="${review.nome}" class="search-result-img">
                    <span class="search-result-name">${review.nome}</span>
                </div>
            `)
            .join("");
        searchResults.classList.add("active");
    });
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove("active");
        }
    });
}
function scrollToGame(gameName) {
    const gameElement = Array.from(document.querySelectorAll(".jogo h2")).find((h2) => h2.textContent === gameName);
    if (gameElement) {
        gameElement.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("searchInput")?.blur();
        document.getElementById("searchResults").classList.remove("active");
    }
}
criarReviews();
setupSearch();
