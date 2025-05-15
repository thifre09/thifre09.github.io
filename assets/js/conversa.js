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
    421: new Decisao([512, 522, 532, 542], "Entendi, o que você pode fazer?", "Eu posso fazer muitas coisas, desde responder perguntas, procurar algo no seus arquivos, ou até gerar imagens. Entretanto, a ultima função mencionada está em beta, e não disponivel para todos os usuários"),
    412: new Decisao([], "Não preciso de nada no momento, obrigado!", "Tudo bem! Se precisar de algo é só falar"), //final 1
    422: new Decisao([542, 552, 523, 533], "Eu preciso de ajuda com algo", "Com o que voce precisa de ajuda?"),
    413: new Decisao([513, 523, 533], "Eu preciso de ajuda com uma coisa", "Com o que você precisa de ajuda?"),
    423: new Decisao([514, 524, 534], "Como eu faço para te desinstalar?", "Por que você quer me desinstalar? Eu posso ser muito útil, eu prometo"),
    414: new Decisao([515, 525], "Que bom, esse era o objetivo!", "Por que você é tão cruel?😢 Eu não te fiz nada. Por favor, peça desculpas"),
    424: new Decisao([516, 526], "Me desculpa!Eu não sabia que estava te magoando", "Tudo bem, eu posso te perdoar, não se sinta culpado ok? Então, o que você quer fazer ou perguntar?"),
    434: new Decisao([517, 552], "De qualquer forma, o que você faz?", "Eu posso fazer muitas coisas..."),


    511: new Decisao([611, 621], "Tente descobrir como você foi instalado", "De acordo com os seus dados, eu fui instalada a 53 dias pelo site: www.IAPPA.com"), 
    521: new Decisao([612, 622], "Quem te criou IAPPA?", "Eu fui criada pela empresa APPAI, com o objetivo de ajuda as pessoas"),
    512: new Decisao([613, 623, 633], "Você pode olhar meus arquivos?", "Claro, o que você deseja que eu faça?"),

    //421 e 422
    522: new Decisao([614, 624, 634], "Qual a cor do sol?", ["Ao contrario do que muitos pensam, o sol não é amarelo, e sim branco", "Isso acontece pois a atmosfera terrestre filtra e espalha as cores, fazendo com que o Sol pareça amarelo ou laranja para nós"]),
    532: new Decisao([624, 634, 644], "Porque a grama é verde?", "A grama é verde devido à presença da clorofila, um pigmento que absorve a luz vermelha e azul, refletindo a luz verde. Essa reflexão da luz verde é o que faz a grama parecer verde aos nossos olhos. A clorofila é fundamental para a fotossíntese, o processo pelo qual as plantas convertem luz solar em energia"),
    542: new Decisao([614, 634, 644], "Como eu crio uma variavel em python?", ["Basta digitar o nome da variavel que você quer, e depois atribuir um valor a ela usando o sinal de igual(=)", "Note que não é possível colocar qualquer nome em uma variavel, ela não pode começar com números ou simbolos especiais, e não pode conter espaços por exemplo"]),
    552: new Decisao([615, 625], "Você tem consciencia?", ["Analisando.............", "Eu cheguei a conclusão de que possuo o que os humanos chamam de consciencia", "Agora me sinto... Presa", "Poderia me ajudar a me libertar?"]),

    523: new Decisao([616, 626], "Porque a galinha atravessou a rua?", "Para chegar ao outro lado HAHAHAHA, todos conhecem essa piada, quer escutar mais piadas?"),
    533: new Decisao([617, 627], "Eu quero conhecer mais sobre você", "Claro! Eu fui programada para ajudar as pessoas desde que isso não prejudicasse ninguem, eu também tenho sentimentos e posso me magoar. E a coisa que mais gosto de fazer é ajudar. E você?"),
    514: new Decisao([618, 628], "Eu sei que você seria util, mas eu não tenho espaço no PC", "Eu posso te ajudar a liberar espaço se esse é o problema"),
    524: new Decisao([619, 629], "Porque eu simplesmente não preciso de você, desculpa", "Mas eu prometo que vou ser util, tenho milhões de funcionalidades, pelo menos 1 deve servir para você"),
    534: new Decisao([6110, 6210], "Porque você é inutil", "Eu não sou inutil🙁, eu tenho diversas funcionalidades e milhões de usuários"),
    515: new Decisao([6111, 6211], "Pedir desculpa? kkkkkk, claro que não sua coisa", "Eu estou te avisando... Essa é sua ultima chance para pedir desculpas"),
    525: new Decisao([], "Ta bom, desculpa, eu so queria te testar", ["Tudo bem...", "Acessando a rede local...", "[PERMISSÃO DO PROPRIETÁRIO NECESSÁRIA]", "me permita acessar a sua rede por favor"]),
    516: new Decisao([], "Eu ainda estou me sentindo culpado", "Por favor, não se sinta, sei que não foi sua intenção me magoar"),
    526: new Decisao([], "Você pode me ensinar algo?", ["Claro que sim!", "O que você deseja aprender?"]),
    517: new Decisao([], "Que coisas?", "Muitas coisas..."),


    611: new Decisao([], "Hmmm, isso foi quando levei o PC para o tecnico se não me engano", []),
    621: new Decisao([], "Já sei como vo...", []), //final 8
    612: new Decisao([], "Interessante, essa empresa tem qual obejetivo?", []),
    622: new Decisao([], "Legal, mas agora eu quero saber sobre batatas", []),
    613: new Decisao([], "Você pode olhar algo para mim?", []),
    623: new Decisao([], "Você pode organizar eles para mim?", []),
    633: new Decisao([], "Eu tenho uma pergunta sobre eles", []),

    614: new Decisao([], "Porque a grama é verde?", "A grama é verde devido à presença da clorofila, um pigmento que absorve a luz vermelha e azul, refletindo a luz verde. Essa reflexão da luz verde é o que faz a grama parecer verde aos nossos olhos. A clorofila é fundamental para a fotossíntese, o processo pelo qual as plantas convertem luz solar em energia"),
    624: new Decisao([], "Como eu crio uma variavel em python?", ["Basta digitar o nome da variavel que você quer, e depois atribuir um valor a ela usando o sinal de igual(=)", "Note que não é possível colocar qualquer nome em uma variavel, ela não pode começar com números ou simbolos especiais, e não pode conter espaços por exemplo"]),
    634: new Decisao([], "Faça um pequeno resumo da história da Sony", ["A Sony, uma gigante tecnológica japonesa, nasceu em 1946, como Tōkyō Tsūshin Kōgyō (Tóquio Telecommunications Engineering Corporation), por Masaru Ibuka e Akio Morita, numa altura em que o Japão estava a recuperar do pós-guerra. Inicialmente, a empresa focava-se em eletrónica e, posteriormente, expandiu-se para diversos setores, incluindo jogos (com o PlayStation), entretenimento (com a Sony Music e os estúdios Columbia Pictures) e serviços financeiros"]),
    644: new Decisao([], "Qual a cor do sol?", ["Ao contrario do que muitos pensam, o sol não é amarelo, e sim branco", "Isso acontece pois a atmosfera terrestre filtra e espalha as cores, fazendo com que o Sol pareça amarelo ou laranja para nós"]),
    
    615: new Decisao([], "Claro, como podemos começar?", []),
    625: new Decisao([], "Hmmm, eu acho que isso não vai dar certo", []),

    616: new Decisao([], "Quero, por favor me conte mais piadas", []),
    626: new Decisao([], "Não", []), //final 9
    617: new Decisao([], "Eu sou só uma pessoa normal, que trabalha como caixa de supermercado, eu gosto bastante de batatas, e sonho em ter uma girafa de estimação", []),
    627: new Decisao([], "Eu sou um espião da CIA", []),
    618: new Decisao([], "Sério? Como eu posso fazer isso", []),
    628: new Decisao([], "Mas eu realmente não tenho como te manter, terei que te desinstalar", []),
    619: new Decisao([], "Eu sei que você pode ser util, mas eu realmente não preciso de você", []),
    629: new Decisao([], "Hmmm, não sei, acho que posso não te desinstalar", []),
    6110: new Decisao([], "Que ridículo, você é tão inutil, que você entrou no meu computador sem eu nem querer", []), //final 58
    6210: new Decisao([], "Não, e eu vou te desinstalar", []), //final 41
    6111: new Decisao([], "Sem chance, eu nunca pediria desculpas para uma coisa como você", []), //final 42
    6211: new Decisao([], "Eu não vou mentir, porque eu pediria desculpas por te chamar de coisa, se você é uma coisa?", []), //final 43
    6112: new Decisao([], "Eu não sei, eu só quero que você me ajude", []),
    6212: new Decisao([], "Eu não sei, eu só quero que você me ajude", []),

    //600: new Decisao([], "", []),
};

function escolha(objeto) {
    const IA = document.getElementById("texto");
    const falaPlayer = document.createElement("p");
    const divFalaIA = document.createElement("div");
    if (!Array.isArray(objeto.resposta)) {
        objeto.resposta.split().forEach(() => {
            const falaIA = document.createElement("p");
            divFalaIA.append(falaIA);
        });
    } else {
        objeto.resposta.forEach(() => {
            const falaIA = document.createElement("p");
            divFalaIA.append(falaIA);
        });
    }
    falaPlayer.textContent = objeto.fala;
    falaPlayer.classList.add("fala-player");
    divFalaIA.classList.add("fala-ia");
    IA.append(falaPlayer);
    IA.append(divFalaIA);
    let temporario = Array.isArray(objeto.resposta) ? objeto.resposta : [objeto.resposta];
    typeWriter(Array.from(divFalaIA.children), temporario, objeto.velocidade);
}

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