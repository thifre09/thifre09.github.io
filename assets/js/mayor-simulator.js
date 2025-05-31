const btnPlay = document.getElementById('btn-play');
const btnTutorial = document.getElementById('btn-tutorial');
const btnCredits = document.getElementById('btn-credits');
const btnReturn = document.getElementById('btn-return')

btnPlay.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('jogo').style.display = 'flex';
});

btnTutorial.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('tutorial').style.display = 'block';
});

btnCredits.addEventListener("click", ()=>{
    document.getElementById('tela-inicial').style.display = 'none';
    document.getElementById('creditos').style.display = 'block';
});

btnReturn.addEventListener("click", () => {
    document.getElementById('tela-inicial').style.display = 'flex';
    document.getElementById('creditos').style.display = 'none';
    document.getElementById('jogo').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';

})

let dinheiro = 1000;
let satisfacaoPopulacao = 50;
let populacao = 1000;

class Proposta {
    static dinheiro = 1000;
    static satisfacaoPopulacao = 50;
    static populacao = 1000;

    constructor(titulo, descricao, aceitarResultado, recusarResultado) {
        this.titulo = titulo;
        this.descricao = descricao;      
        this.aceitarResultado = aceitarResultado; //Estatistica
        this.recusarResultado = recusarResultado; //Estatistica
    }

    aceitar() {
        dinheiro += this.aceitarResultado.dinheiro;
        satisfacaoPopulacao += this.aceitarResultado.satisfacaoPopulacao;
        populacao += this.aceitarResultado.populacao;
    }

    recusar() {
        dinheiro += this.recusarResultado.dinheiro;
        satisfacaoPopulacao += this.recusarResultado.satisfacaoPopulacao;
        populacao += this.recusarResultado.populacao;
    }
}

class Estatistica {
    constructor(dinheiro, satisfacaoPopulacao, populacao, noticia) {
        this.dinheiro = dinheiro;
        this.satisfacaoPopulacao = satisfacaoPopulacao;
        this.populacao = populacao;
        this.noticia = noticia;
    }
}

const listaPropostas = [

];
