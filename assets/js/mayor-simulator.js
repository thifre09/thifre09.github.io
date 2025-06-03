let dinheiro = 1000;
let populacao = 1000;

let saude = 50;
let alegria = 50;
let seguranca = 50;
let educacao = 50;
let fome = 50;
let economia = 50;
let desemprego = 50;
let infraestrutura = 50;
let imposto = 50

let satisfacaoPopulacao = 50;
let IndexPropostaAtual = null;

class Proposta {

    constructor(titulo, descricao, aceitarResultado = new Estatistica(), recusarResultado = new Estatistica()) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.aceitarResultado = aceitarResultado; //Estatistica
        this.recusarResultado = recusarResultado; //Estatistica
    }

    aceitar() {
        dinheiro += this.aceitarResultado.dinheiro;
        saude = this.aceitarResultado.saude;
        alegria = this.aceitarResultado.alegria;
        seguranca = this.aceitarResultado.seguranca;
        educacao = this.aceitarResultado.educacao;
        fome = this.aceitarResultado.fome;
        economia = this.aceitarResultado.economia;
        desemprego = this.aceitarResultado.desemprego;
        infraestrutura = this.aceitarResultado.infraestrutura;
        imposto = this.aceitarResultado.imposto
        populacao *= this.aceitarResultado.populacao;
    }

    recusar() {
        dinheiro += this.recusarResultado.dinheiro;
        saude = this.recusarResultado.saude;
        alegria = this.recusarResultado.alegria;
        seguranca = this.recusarResultado.seguranca;
        educacao = this.recusarResultado.educacao;
        fome = this.recusarResultado.fome;
        economia = this.recusarResultado.economia;
        desemprego = this.recusarResultado.desemprego;
        infraestrutura = this.recusarResultado.infraestrutura;
        imposto = this.recusarResultado.imposto
        populacao *= this.recusarResultado.populacao;
    }
}

class Estatistica {
    constructor(dinheiro = 0, saude = 0, alegria = 0, seguranca = 0, educacao = 0, fome = 0, economia = 0, desemprego = 0, infraestrutura = 0, imposto = 0, populacao = 1, noticia = "") {
        this.dinheiro = dinheiro;
        this.saude = saude;
        this.alegria = alegria;
        this.seguranca = seguranca;
        this.educacao = educacao;
        this.fome = fome;
        this.economia = economia;
        this.desemprego = desemprego;
        this.infraestrutura = infraestrutura;
        this.imposto = imposto
        this.populacao = populacao;
        this.noticia = noticia;
    }
}

const listaPropostas = [
    new Proposta("Aumentar os impostos sobre anticontraceptivos.", "Isso reduzirá significamente a taxa de natalidade e aumentará seu dinheiro. Custo: 0 reais."),
    new Proposta("Planejar uma festa para a população.", "Os cidadões vão ficar muito contentes... Custo: 10.000 reais."),
    new Proposta("Trazer Hyago Kadson para a cidade.", "A população nunca vai esquecer esse dia. Custo 27.658 reais."),
    new Proposta("Campanha de concientização a vacinação", "Ensinará a população sobre as vacinas. Custo: 5000 reais.")
];

function escolherProposta() {
    let randomIndex = Math.floor(Math.random() * listaPropostas.length);
    while (randomIndex === IndexPropostaAtual) {
        // Garante que a proposta escolhida seja diferente da atual
        randomIndex = Math.floor(Math.random() * listaPropostas.length);
    }
    IndexPropostaAtual = randomIndex;
}

escolherProposta();

function atualizarTela() {
    satisfacaoPopulacao = (saude + alegria + seguranca + educacao + (100 - fome) + economia + (100 - desemprego) + infraestrutura) / 8;
    document.getElementById('dinheiro').innerText = `Dinheiro: R$ ${dinheiro}`;
    document.getElementById('satisfacao').innerText = `Satisfação da População: ${satisfacaoPopulacao}%`;
    document.getElementById('populacao').innerText = `População: ${populacao}`;
    document.getElementById('saude').innerText = `${saude}%`;
    document.getElementById('alegria').innerText = `${alegria}%`;
    document.getElementById('seguranca').innerText = `${seguranca}%`;
    document.getElementById('educacao').innerText = `${educacao}%`;
    document.getElementById('fome').innerText = `${fome}%`;
    document.getElementById('economia').innerText = `${economia}%`;
    document.getElementById('desemprego').innerText = `${desemprego}%`;
    document.getElementById('infraestrutura').innerText = `${infraestrutura}%`;
}

const btnPlay = document.getElementById('btn-play');
const btnTutorial = document.getElementById('btn-tutorial');
const btnCredits = document.getElementById('btn-credits');
const btnReturn = document.getElementById('btn-return');
const btnNews = document.getElementById('news');
const btnPropostas = document.getElementById('proposals');

btnPlay.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('jogo').style.display = 'flex';
});

btnTutorial.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('tutorial').style.display = 'flex';
});

btnCredits.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('creditos').style.display = 'flex';
});

btnReturn.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'flex';
    document.getElementById('creditos').style.display = 'none';
    document.getElementById('jogo').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none'
})

btnNews.addEventListener("click", () => {
    document.getElementById('propostas').style.display = 'none';
    document.getElementById('noticias').style.display = 'block';
});

btnPropostas.addEventListener("click", () => {
    document.getElementById('noticias').style.display = 'none';
    document.getElementById('propostas').style.display = 'block';
});

const btnAceitar = document.getElementById('btnAceitar');
const btnRecusar = document.getElementById('btnRecusar');

btnAceitar.addEventListener("click", () => {
    listaPropostas[IndexPropostaAtual].aceitar();
    atualizarTela();
    escolherProposta();
});

btnRecusar.addEventListener("click", () => {
    listaPropostas[IndexPropostaAtual].recusar();
    atualizarTela();
    escolherProposta();
});