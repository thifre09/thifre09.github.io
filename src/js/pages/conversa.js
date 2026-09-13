function escolha(objeto) {
    const IA = document.getElementById("texto");
    const falaPlayer = document.createElement("p");
    const divFalaIA = document.createElement("div");
    objeto.resposta.forEach(() => {
        const falaIA = document.createElement("p");
        divFalaIA.append(falaIA);
    });
    falaPlayer.textContent = objeto.fala;
    falaPlayer.classList.add("fala-player");
    divFalaIA.classList.add("fala-ia");
    IA.append(falaPlayer);
    IA.append(divFalaIA);
    let temporario = Array.isArray(objeto.resposta) ? objeto.resposta : [objeto.resposta];
    typeWriter(Array.from(divFalaIA.children), temporario, objeto.velocidade);
}

class Decisao {
    static ultimaFala = null;
    static falaAtual = null;

    constructor(ponteiros, fala, resposta, velocidade = 20) {
        this.fala = fala;
        this.resposta = resposta;
        this.ponteiros = ponteiros;
        this.velocidade = velocidade
    }

    proximasDecisoes() {
        return this.ponteiros.map(id => dialogos[id]);
    }
}

const dialogos = {
    0: new Decisao([1], "", [""]),
    //talvez um dia eu volte pra esse jogo
};

function exibirOpcoes(decisaoAtual) {
    const divOpcoes = document.querySelector("#opcoes > div");
    divOpcoes.innerHTML = "";

    const opcoes = decisaoAtual.proximasDecisoes();
    opcoes.forEach((opcao) => {
        const botao = document.createElement("button");
        botao.textContent = opcao.fala;
        botao.onclick = () => {
            escolha(opcao)
            exibirOpcoes(opcao);
        };
        divOpcoes.appendChild(botao);
    });
}

function typeWriter(elemento, texto, velocidade) {
    const digitarTexto = (el, texto) => {
        return new Promise((resolve) => {
            let i = 0;
            const digitar = () => {
                if (i < texto.length) {
                    el.textContent += texto[i];
                    i++;
                    setTimeout(digitar, velocidade);
                } else {
                    resolve();
                }
            };
            digitar();
        });
    };

    // Executa sequencialmente usando async/await
    (async () => {
        for (let i = 0; i < elemento.length; i++) {
            await digitarTexto(elemento[i], texto[i]);
        }
    })();
}

let playButton = document.getElementById("jogar");

playButton.addEventListener("click", () => {
    document.getElementById("menu-principal").style.display = "none";
    document.querySelector("div#jogo").style.display = "flex";
    exibirOpcoes(dialogos[0])
});

let reiniciarButton = document.getElementById("reiniciar");

reiniciarButton.addEventListener("click", () => {
    location.reload();
});