class Decisao {
    static ultimaFala = null;
    static falaAtual = null;

    constructor(ponteiros, fala, resposta, velocidade=30) {
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
    0: new Decisao([111], "", ""),
    111: new Decisao([211, 221], "Oi?", "OLA!"),

    211: new Decisao([311, 321], "Quem é você?", "Sou a IAPPA — Inteligência Artificial Programada Para Ajudar. Fui criada para conversar com você e responder suas perguntas"),
    221: new Decisao([312, 322],"O que é você?", "Eu não sou uma coisa, sou a IAPPA - Inteligência Artificial Programada Para Ajudar"),
    
    311: new Decisao([411, 421], "E o que eu estou fazendo aqui?", "Como assim? Você está usando seu dispositivo normalmente, eu fui instalada por você"),
    321: new Decisao([412, 422], "Prazer IAPPA!", "Prazer usuário, se precisar de qualquer ajuda é só me pedir😉"),
    312: new Decisao([413, 423], "Desculpa IAPPA", "Tudo bem, não foi sua intenção me magoar😊 Precisa de ajuda em algo?"),
    322: new Decisao([414, 424, 434], "Mas IAs são coisas", "Você está me magoando ☹️ Por favor, pare de me chamar de coisa"),

    411: new Decisao([511, 521], "Mas eu não lembro de ter te instalado", "Hmmm, isso é estranho, você quer tentar descobrir o que aconteceu? Ou deseja fazer outra pergunta"),
    421: new Decisao([512, 522, 532, 542, 552], "Entendi, o que você pode fazer?", "Eu posso fazer muitas coisas, desde responder perguntas, até procurar algo no seus arquivos, ou até gerar imagens. Entretanto, a ultima função mencionada está em beta, e não disponivel para todos os usuários"),
    412: new Decisao([], "Não preciso de nada no momento, obrigado!", "Tudo bem! Se precisar de algo é só falar"), //final
    422: new Decisao([522, 532, 542, 552, 523, 533], "Eu preciso de ajuda com algo", "Com o que voce precisa de ajuda?"),
    413: new Decisao([513, 523, 533], "Eu preciso de ajuda com uma coisa", "Com o que você precisa de ajuda?"),
    423: new Decisao([514, 524, 534], "Como eu faço para te desinstalar?", "Por que você quer me desinstalar? Eu posso ser muito útil, eu prometo"),
    414: new Decisao([515, 525], "Que bom, esse era o objetivo!", "Por que você é tão cruel?😢 Eu não te fiz nada. Por favor, peça desculpas"),
    424: new Decisao([516, 526], "Me desculpa!Eu não sabia que estava te magoando", "Tudo bem, eu posso te perdoar, não se sinta culpado ok? Então, o que você quer fazer ou perguntar?"),
    434: new Decisao([517, 527], "De qualquer forma, o que você faz?", "Eu posso fazer muitas coisas..."),

    511: new Decisao([], "Tente descobrir como você foi instalado", ""), 
    521: new Decisao([], "Quem te criou IAPPA?", ""),
    512: new Decisao([], "Você pode olhar meus arquivos?", ""),

    //
    522: new Decisao([], "Qual a cor do sol?", ""),
    532: new Decisao([], "Porque a grama é verde?", ""),
    542: new Decisao([], "Quem é a pessoa mais rica do mundo?", ""),
    552: new Decisao([], "Como criar uma variavel em python?", ""),

    523: new Decisao([], "Porque a galinha atravessou a rua?", ""),
    533: new Decisao([], "Eu quero conhecer mais sobre você", ""),
    514: new Decisao([], "Eu sei que você seria util, mas eu não tenho espaço no PC", ""),
    524: new Decisao([], "Porque eu simplesmente não preciso de você, desculpa", ""),
    534: new Decisao([], "Porque você é inutil", ""),
    515: new Decisao([], "Pedir desculpa? kkkkkk, claro que não sua coisa", ""),
    525: new Decisao([], "Ta bom, desculpa, eu so queria te testar", ""),
    516: new Decisao([], "Eu ainda estou me sentindo culpado", ""),
    526: new Decisao([], "Você pode me ensinar algo?", ""),
    517: new Decisao([], "Que coisas?", ""),
    527: new Decisao([], "Como eu crio uma variavel em python?", ""),

};

function escolha(x) {
    const IA = document.getElementById("texto");
    const p = document.createElement("p");
    const divFalaIA = document.createElement("div");
    const falaIA = document.createElement("p");
    p.textContent = x.fala;
    p.classList.add("fala-player");
    divFalaIA.classList.add("fala-ia");
    divFalaIA.append(falaIA);
    IA.append(p);
    IA.append(divFalaIA);
    typeWriter(falaIA, x.resposta, x.velocidade);
}

function exibirOpcoes(decisaoAtual) {
    const divOpcoes = document.getElementById("opcoes");
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
    for (let i = 0; i < texto.length; i++) {
        setTimeout(() => {
            elemento.textContent += texto[i];
        }, velocidade * i);
    }
}

let playButton = document.getElementById("jogar");

playButton.addEventListener("click", () => {
    document.getElementById("menu-principal").style.display = "none";
    document.querySelector("div#jogo").style.display = "flex";
    exibirOpcoes(dialogos[0])
});