class Review {
    nome: string;
    imagem: string;
    notas: Notas;
    comentarioPrincipal: string;

    constructor(nome: string, imagem: string, notas: Notas, comentarioPrincipal: string = "") {
        this.nome = nome;
        this.imagem = imagem;
        this.notas = notas;
        this.comentarioPrincipal = comentarioPrincipal;
    }
}

class Notas {
    gameplay: string | number;
    historia: string | number;
    graficos: string | number;
    trilhaSonora: string | number;
    tempoJogado: string;
    dificuldade: string | number;
    diversao: string | number;
    notaFinal: string | number;

    constructor(gameplay: string | number = 0, historia: string | number = 0, graficos: string | number = 0, trilhaSonora: string | number = 0, tempoJogado: string = "Não sei", dificuldade: string | number = 0, diversao: string | number = 0, notaFinal: string | number = 0) {
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
    const reviewsContainer = document.getElementById("reviews")!;
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
        img.src = `/assets/images/jogos reviews img/${review.imagem}`;
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
            } else if (key === "dificuldade") {
                h3.textContent = "Dificuldade";
                switch (true) {
                    case value === 10:
                        h4.style.backgroundColor = "var(--red2)";
                        break;
                    case value >= 9:
                        h4.style.backgroundColor = "var(--red4)";
                        break;
                    case value >= 8:
                        h4.style.backgroundColor = "var(--orange5)";
                        break;
                    case value >= 6:
                        h4.style.backgroundColor = "var(--yellow6)";
                        break;
                    case value >= 4:
                        h4.style.backgroundColor = "var(--green5)";
                        break;
                    case value >= 0:
                        h4.style.backgroundColor = "var(--green3)";
                        break;
                    default:
                        h4.style.backgroundColor = "gray";
                        break;
                }
            } else if (key === "trilhaSonora") {
                h3.textContent = "Trilha sonora";
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
            } else {
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
            <h5>Comentário</h5>
            <div>
                <p class="comentario-principal">${review.comentarioPrincipal}</p>         
            </div>
        `;
    });
}

let reviews: Review[] = [
    new Review("A Hat in Time", "a hat in time.jpg", new Notas(6, 4, 6, 9, "17h", 2, 7, 6.5), "Achei um jogo bem superestimado"),
    new Review("Among Us", "among us.jpeg", new Notas(8, "N/A", 8.5, 9.5, "Não sei", "1-10", 10, 8), "Esse jogo só é divertido com amigos"),
    new Review("Animal Well", "animal well.jpg", new Notas(9, "Não sei", 8.5, 8, "12h", 4, 9.5, 9), "Eu não entendi nada da história, mas o jogo é muito divertido"),
    new Review("Astro's Playroom", "astro playroom.jpeg", new Notas(10, "N/A", 10, 9, "4", 2, 10, 10), "É um jogo que parece simples, mas é extremamente divertido"),
    new Review("Beat Saber", "beat saber.jpg", new Notas(10, "N/A", "N/A", 10, "Não sei", "1-10", 10, 10), "O melhor jogo de realidade virtual que existe"),
    new Review("Bloodborne", "bloodborne.jpg", new Notas(8, 4, 6, 8, "40h", 7, 8, 9), "Foi meu primeiro soulslike, e as primeiras 10 horas foram ridiculamente difíceis, mas depois que você aprende os padrões dos inimigos, o jogo se torna muito divertido"),
    new Review("Brawl stars", "brawl stars.jpg", new Notas(9.5, "Não sei", 10, 9.5, "+500h", "4-10", 9, 9), "É possivelmente o melhor jogo mobile"),
    new Review("Bloons TD battles 2", "BTD battles 2.jpeg", new Notas(9, "N/A", 9, 9.5, "200h", "4-10", 9, 8.5), "Eu já passei muita raiva nesse jogo, mas é muito divertido"),
    new Review("Bloons TD 6", "BTD6.jpeg", new Notas(9, "N/A", 9.5, 9.5, "+50h", 7, 8, 8.5), "Depois de algumas horas, o jogo se torna muito repetitivo"),
    new Review("Carto", "carto.jpg", new Notas(8.5, 6.5, 8, 8, "6h", 2, 7, 8), "É legalzinho, mas é só isso mesmo"),
    new Review("Celeste", "celeste.jpg", new Notas(9, 5, 8.5, 8.5, "31h", 6, 8.5, 9), "Se você jogou celeste pela história, você é estranho"),
    new Review("Civilization 6", "civilization 6.jpg", new Notas(9.5, "N/A", 9, 8, "+33h", 6, "6-9", 9), "Recomendo jogar com algum amigo, principalmente se ele já souber jogar, porque o jogo é bem complexo"),
    new Review("Clair Obscur: expedition 33", "clair obscur.jpg", new Notas(10, 10, 9.5, 10, "62h", 5, 10, 10), "Esse jogo é perfeito, a trilha sonora é a melhor que eu já escutei em um jogo, a historia também é possivelmente a melhor que eu já joguei. Ele ganhou o GOTY, mas merece ganhar o prêmio de jogo da década, merece também um grammy. A trilha sonora de clair obscur é tão boa, que ela sozinha mudou completamente minha percepção sobre a música"),
    new Review("Clash of clans", "clash of clans.jpg", new Notas(7, "N/A", 9.5, 9, "Não sei", 5, 6.5, 8.5), "Uma melhoria que demora 13 dias para ficar pronta é o auge da diversão"),
    new Review("Clash royale", "clash royale.jpg", new Notas(9.5, "N/A", 9.5, 9, "Não sei", "5-10", 10, 8.5), "Eu odeio esse jogo e a supercell, e mesmo assim não consigo parar de jogar"),
    new Review("Control", "control.jpg", new Notas(7, 4, 9, 7, "8h", 4, 6, 6.5), "Achei bem decepcionante, principalmente considerando que ele concorreu a jogo do ano. E eu não entendi absolutamente nada da história"),
    new Review("Death Stranding", "death stranding.jpg", new Notas(8.5, 9, 9.5, 10, "31h", 4, 8, 9), "O melhor simulador de carteiro de todos"),
    new Review("Demon's Souls", "demons souls.jpg", new Notas(8, 4, 9, 8, "32h", 6, 8, 8.5), "Para um soulslike, achei ele bem fácil. A história é bem confusa, como todo bom soulslike deve ser"),
    // new Review("Detroit: Become Human", "detroit.jpg", new Notas()),
    new Review("Dispatch", "dispatch.jpg", new Notas(8, 9, 9.5, 8, "8h", 1, 9, 8.5), "Eu sinto que eu fiz as piores escolhas possíveis kkkkkk"),
    new Review("Doki Doki literature club plus", "doki doki.jpg", new Notas(2, 9.5, 9, 9, "16h", 1, 5, 8), "É definitivamente uma experiência única"),
    new Review("Fall guys", "fall guys.jpeg", new Notas(6, "N/A", 7, 8.5, "+12h", 5, 4, 5.5), "Eu me arrependo de ter comprado esse jogo"),
    new Review("Forager", "forager.jpg", new Notas(8, "N/A", 9, 8, "Não sei", 2, 8.5, 8), "Eu sinto que esse jogo tinha muito potencial, mas ele é bem curto"),
    new Review("Fortnite", "fortnite.jpeg", new Notas(9.5, "N/A", 9.5, 9.5, "+4400h", "6-10", 9, 9.5), "Esse é definitivamente o meu jogo multiplayer favorito"),
    new Review("Geometry Dash", "geometry dash.png", new Notas(9, "N/A", 8, 10, "Não sei", 7, 8.5, 8.5), "Esse jogo tem 1 botão, e mesmo assim é bem viciante"),
    new Review("Ghost of Tsushima", "ghost of tsushima.jpeg", new Notas(9.5, 7, 9.5, 8, "72h", 3, 9.5, 9.5), "O combate é bem satisfatório quando você aprende a defender"),
    new Review("God of war 1", "god of war 1.jpeg", new Notas(8, 9, 9.5, 9.5, "Não sei", 4, 9, 9.5), "Um dos primeiros jogos que eu joguei. Ele sempre será lembrado com carinho"),
    new Review("God of war 2", "god of war 2.jpeg", new Notas(8, 8, 9.5, 9.5, "Não sei", 4, 9, 8.5), "Eu odeio a Ponte de Ícaros, eu só conseguir zerar pelo emulador"),
    new Review("God of war 2018", "god of war 2018.jpeg", new Notas(9.5, 9.5, 9.5, 8.5, "54h", 4, 9.5, 10), "Esse jogo é fenomenal, a história é muito boa, o combate é muito satisfatório, e a trilha sonora é ótima. Ele é um dos meus jogos favoritos de todos os tempos"),
    new Review("God of War Ragnarok", "god of war ragnarok.jpg", new Notas(10, 9.5, 9.5, 8.5, "62hs", 4, 9.5, 9.5), "Eu gostei bastante desse jogo, mas achei ele um pouco inferior ao God of War 2018"),
    new Review("Hades", "hades.jpg", new Notas(9.5, 8.5, 9.5, 10, "Não sei", 4, 9.5, 9.5), "Que jogo viciante e divertido, principalmente com essa trilha sonora"),
    new Review("Hades 2", "hades 2.jpg", new Notas(9.5, 8.5, 9.5, 10, "Não sei", 4, 9, 9.5), "Achei a sequência tão boa quanto o primeiro, mas a trilha sonora do primeiro é melhor"),
    new Review("Hogwarts Legacy", "hogwarts legacy.jpeg", new Notas(10, 7, 9.5, 8, "71h", 2, 10, 9.5), "É muito divertido lançar Avada Kedavra nos inimigos, e o mundo é bem bonito, mas a história é bem fraca"),
    new Review("Hollow Knight", "hollow knight.jpeg", new Notas(10, 9, 10, 10, "+60h", 7, 10, 10), "Meu jogo favorito de todos os tempos, a história é muito boa, a trilha sonora é ótima, os bosses são muito variados e bem feitos, e o estilo de arte é lindo"),
    new Review("Hollow Knight: Silksong", "silksong.jpg", new Notas(10, 8.5, 10, 9.5, "82h", 9, 10, 10), "Silksong é uma sequência perfeita, ele é melhor em quase todos os sentidos(mesmo que as notas não condizam com o que eu acabei de falar). O jogo é mais divertido, mais bonito e muito maior, mas os bosses do primeiro são melhores"),
    new Review("Horizon Forbidden West", "horizon forbidden west.jpeg", new Notas(9, 10, 9.5, 9.5, "51h", 5, 9.5, 9.5), "Esse jogo é lindo, tão bom quanto o primeiro"),
    new Review("Horizon Zero Dawn", "horizon zero dawn.jpeg", new Notas(9, 10, 9.5, 9.5, "31h", 5, 9.5, 9.5), "Esse jogo é magnifico, uma pena que eu joguei ele com 20FPS, com os gráficos no mínimo"),
    new Review("Kena: bridge of spirits", "kena bridge of spirits.jpg", new Notas(8, 7, 9.5, 8.5, "18h", 4, 8, 8.5), "O jogo é bem bonito, e a ultima dificuldade é muito difícil, ela quase me fez desistir da platina"),
    new Review("Life is Strange", "life is strange 1.jpeg", new Notas(8, 9, 7, 8, "16h", 1, 7.5, 8), "Voltar no tempo é bem legal"),
    new Review("Life is Strange 2", "life is strange 2.jpg", new Notas(2, 9, 7, 8, "16h", 1, 5, 5.5), "A melhor coisa do primeiro jogo era voltar no tempo, e o segundo jogo não tem isso. A única coisa que salva esse jogo de ser um lixo é a historia"),
    new Review("Minecraft", "minecraft.jpeg", new Notas(10, "N/A", 10, 10, "Não sei", 3, 10, 10), "Acho que não preciso explicar nada"),
    new Review("Ratchet and clank: Rift Apart", "ratchet and clank rift apart.jpg", new Notas(9, 8.5, 9.5, 8, "20h", 3, 9.5, 9), "O foguetão é bem roubado"),
    new Review("Red Dead Redemption 2", "red dead 2.jpeg", new Notas(9.5, 8.5, 10, 9, "72h", 3, 8, 9.5), "Joguinho superestimado. Ele é muito bom, mas não é o melhor jogo da historia"),
    new Review("Sekiro", "sekiro.jpg", new Notas(9.5, 6, 6, 8.5, "60h", 9, 9.5, 9.5), "Hesitação é derrota. Genichiro Ashina é possivelmente o melhor boss da historia dos video games"),
    new Review("Shadow of the colossus", "shadow of the colossus.jpg", new Notas(7.5, 5, 9.5, 8.5, "", 2, 6, 7), "Se eu tivesse jogado no ps2, talvez eu tivesse gostado"),
    new Review("Spider-man 2", "spider man 2.jpg", new Notas(10, 7.5, 8.5, 8, "22h", 2, 10, 9.5), "O combate é melhor que o do primeiro"),
    new Review("Spider-man Miles Morales", "spider man miles morales.jpg", new Notas(10, 8, 8.5, 8, "27h", 2, 10, 9.5), "É mais legal jogar de Miles do que com o Peter"),
    new Review("Spider-man remastered", "spider man remastered.jpg", new Notas(9.5, 8, 8.5, 8, "48h", 2, 10, 9.5), "Que combate satisfatório, mas ele é muito fácil"),
    new Review("Stumble guys", "stumble guys.jpeg", new Notas(7.5, "N/A", 7, 8.5, "Não sei", 5, 9.5, 8), "A cópia é muito melhor que o original"),
    new Review("Superhot VR", "super hot.jpg", new Notas(9.5, "Não sei", 5, 8, "+8h", 3, 10, 9), "É bom, pode confiar👍"),
    new Review("The Last of Us 1", "the last of us 1.jpg", new Notas(8.5, 9.5, 9.5, 9, "22h", 4, 9, 9.5), "A história é absoluto cinema"),
    new Review("The Last of Us 2", "the last of us 2.jpg", new Notas(8.5, 10, 9.5, 9.5, "47h", 4, 8.5, 9.5), "Também conhecido como simulador de depressão. No final do jogo eu estava chorando, e eu nem sabia o por quê"),
    new Review("The Plucky Squire", "the plucky squire.jpg", new Notas(8, 8.5, 9, 8, "13h", 2, 9, 8.5), "Sair do livro é bem legal, vai de 2D para 3D, simplesmente genial"),
    new Review("The Stanley Parable: Ultra Deluxe", "the stanley parable ultra deluxe.jpg", new Notas(2, 9.5, 8.5, 8.5, "28h", 1, 10, 8.5), "Esse é o melhor walking simulator que tem, ele é muito engraçado"),
];

function setupSearch() {
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const searchResults = document.getElementById("searchResults")!;

    searchInput.addEventListener("input", (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase().trim();

        if (query.length === 0) {
            searchResults.classList.remove("active");
            return;
        }

        const filteredReviews = reviews.filter(review =>
            review.nome.toLowerCase().includes(query)
        );

        if (filteredReviews.length === 0) {
            searchResults.innerHTML = "<div style='padding: var(--p3); text-align: center; color: var(--black);'>Nenhum jogo encontrado</div>";
            searchResults.classList.add("active");
            return;
        }

        searchResults.innerHTML = filteredReviews
            .map(
                (review) => `
                <div class="search-result-item" onclick="scrollToGame('${review.nome.replace(/'/g, "\\'")}')"  >
                    <img src="assets/images/jogos reviews img/${review.imagem}" alt="${review.nome}" class="search-result-img">
                    <span class="search-result-name">${review.nome}</span>
                </div>
            `
            )
            .join("");

        searchResults.classList.add("active");
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target as Node) && !searchResults.contains(e.target as Node)) {
            searchResults.classList.remove("active");
        }
    });
}

function scrollToGame(gameName: string) {
    const gameElement = Array.from(document.querySelectorAll(".jogo h2")).find(
        (h2) => h2.textContent === gameName
    );
    if (gameElement) {
        gameElement.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("searchInput")?.blur();
        (document.getElementById("searchResults") as HTMLElement).classList.remove("active");
    }
}

criarReviews();
setupSearch();


