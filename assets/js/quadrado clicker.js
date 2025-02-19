//variáveis

let quadrados = 0;
let quadradosTotais = 0;
let base = 1;

let triangulos = 0;
let melhoriasTri = {
    pd1: false,
    cc1: false,
    cm1: false,
    sp1: false,
    ms1: false,
    lm1: false,
    qm1: false,
    sq1: false,
    pa1: false
}
let tri = {
    tr1: false,
    tr2: false,
    tr3: false,
    tr4: false,
    tr5: false,
    tr6: false,
    tr7: false,
    tr8: false,
    tr9: false,
    tr10: false
}
let a_pd1 = 1

let nApostas = 0;

let mana = 10;
let nclicks = 0;
let magiaselecionada = null;
let usoumultiplicus = false;
let magiasUsadas = 0;
let cliques10x = 0;

let renasceu = false;
let conseguiu1QuadradosAscendente = false;
let quadrados_ascendentes = 0;
let valorParaGanhar1QuadradoAscendente = 100000000;


//construções
class Gerador {
    constructor(nome, valorBase, aumento, melhorias, nomes) {
        this.nome = nome;
        this.n = 0;
        this.valorBase = valorBase;
        this.a = aumento;
        this.v = valorBase * (1.15 ** this.n);
        this.m1 = new Melhoria(melhorias[0], nomes[0]);
        this.m2 = new Melhoria(melhorias[1], nomes[1]);
        this.m3 = new Melhoria(melhorias[2], nomes[2]);
        this.adicionarMelhorias()
        this.adicionarGerador()
    }

    comprar() {
        if (quadrados >= this.v) {
            this.n++;
            quadrados -= this.v;
            this.v = arredondar(0, this.valorBase * (1.15 ** this.n));
            alterar()
        }
    }

    comprarMelhorias(melhoria, evento) {
        if (melhoria === 1 && !this.m1.possui && quadrados >= this.m1.preco) {
            this.m1.possui = true;
            this.a *= 2
            quadrados -= this.m1.preco;
            evento.target.closest("td").style.backgroundColor = "#f88c5d";
        } else if (melhoria === 2 && !this.m2.possui && quadrados >= this.m2.preco) {
            this.m2.possui = true;
            this.a *= 5;
            quadrados -= this.m2.preco;
            evento.target.closest("td").style.backgroundColor = "#f88c5d";
        } else if (melhoria === 3 && !this.m3.possui && quadrados >= this.m3.preco) {
            this.m3.possui = true;
            this.a *= 20;
            quadrados -= this.m3.preco;
            evento.target.closest("td").style.backgroundColor = "#f88c5d";
        }
    }

    adicionarMelhorias() {
        const tabela = document.getElementById("tabela-melhorias");
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");

        let td1h2 = document.createElement("h2");
        let td1p = document.createElement("p");
        let td1h3 = document.createElement("h3");
        td1h2.textContent = this.m1.nome;
        td1p.textContent = this.nome + " 2X mais eficiente";
        td1h3.textContent = "Preço: " + formatar(this.m1.preco);
        td1.appendChild(td1h2);
        td1.appendChild(td1p);
        td1.appendChild(td1h3);
        td1.id = this.nome + 1;
        td1.addEventListener("click", () => this.comprarMelhorias(1,event));

        let td2h2 = document.createElement("h2");
        let td2p = document.createElement("p");
        let td2h3 = document.createElement("h3");
        td2h2.textContent = this.m2.nome;
        td2p.textContent = this.nome + " 5X mais eficiente";
        td2h3.textContent = "Preço: " + formatar(this.m2.preco);
        td2.appendChild(td2h2);
        td2.appendChild(td2p);
        td2.appendChild(td2h3);
        td2.id = this.nome + 2;
        td2.addEventListener("click", () => this.comprarMelhorias(2,event));

        let td3h2 = document.createElement("h2");
        let td3p = document.createElement("p");
        let td3h3 = document.createElement("h3");
        td3h2.textContent = this.m3.nome;
        td3p.textContent = this.nome + " 20X mais eficiente";
        td3h3.textContent = "Preço: " + formatar(this.m3.preco);
        td3.appendChild(td3h2);
        td3.appendChild(td3p);
        td3.appendChild(td3h3);
        td3.id = this.nome + 3;
        td3.addEventListener("click", () => this.comprarMelhorias(3,event));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tabela.appendChild(tr);
    }

    adicionarGerador() {
        const direita = document.getElementById("direita");
        let div = document.createElement("div");
        div.className = "construcao"

        let h2 = document.createElement("h2");
        h2.textContent = this.nome
        let valortext = document.createElement("h3");
        valortext.id = "v" + this.nome;
        
        let aumentotext = document.createElement("h3");
        aumentotext.id = "a" + this.nome;

        let numerotext = document.createElement("h4");
        numerotext.id = "n" + this.nome;

        div.appendChild(h2);
        div.appendChild(valortext);
        div.appendChild(aumentotext);
        div.appendChild(numerotext);
        div.addEventListener("click", () => {
            this.comprar()
        });

        direita.appendChild(div)
    }
};

class Melhoria {
    constructor (preco, nome) {
        this.preco = preco;
        this.nome = nome;
        this.possui = false;
    }
}

co = {
    cur: new Gerador("Cursores"     , 10e1   , 1      , [50e1   , 35e3    , 28e5    ], ["Cursores duplos", "Múltiplos cursores", "Super cursores"]),
    pro: new Gerador("Professores"  , 3e3    , 10     , [15e3   , 10.5e5  , 8.4e7   ], ["Professores duplos", "Múltiplos professores", "Super professores"]),
    mat: new Gerador("Matemáticos"  , 1.3e5  , 44     , [6.5e5  , 4.55e7  , 3.64e9  ], ["Matemáticos duplos", "Múltiplos matemáticos", "Super matemáticos"]),
    qua: new Gerador("Quadros"      , 0.9e7  , 305    , [4.5e7  , 3.15e9  , 2.52e11 ], ["Quadros duplos", "Múltiplos quadros", "Super quadros"]),
    imp: new Gerador("Impressoras"  , 1.5e9  , 5070   , [7.5e9  , 5.25e11 , 4.2e13  ], ["Impressoras duplas", "Múltiplas impressoras", "Super impressoras"]),
    fab: new Gerador("Fábricas"     , 2e11   , 674e2  , [10e11  , 7e13    , 5.6e15  ], ["Fábricas duplas", "Múltiplas fábricas", "Super fabricas"]),
    eng: new Gerador("Engenheiros"  , 2.5e13 , 8425e2 , [12.5e13, 8.75e15 , 7e17    ], ["Engenheiros duplos", "Múltiplas engenheiros", "Super engenheiros"]),
    pog: new Gerador("Programadores", 3.7e15 , 1246e4 , [18.5e15, 12.95e17, 10.36e19], ["Programadores duplos", "Múltiplos programadores", "Super programadores"]),
}

//perguntas
class Pergunta {
    static numPerguntas = 0;
    static respondidas = 0;
    static acertos = 0;
    static erros = 0;

    constructor(pergunta, opçoes, resposta) {
        this.pergunta = pergunta;
        this.opçoes = opçoes;
        this.resposta = resposta;
        Pergunta.numPerguntas++
    }

    static maisPergunta() {
        Pergunta.respondidas++;
    }

    static maisAcerto() {
        Pergunta.acertos++;
    }

    static maisErro() {
        Pergunta.erros++;
    }
};

let perguntas = [
    new Pergunta("Quanto é 1+1?", ["2", "3", "4", "1"], "2"),
    new Pergunta("Quanto é 5-3?", ["2", "3", "5", "1"], "2"),
    new Pergunta("Quanto é 5x5?", ["25", "20", "15", "30"], "25"),
    new Pergunta("Quanto é 36/6?", ["6", "7", "8", "9"], "6"),
    new Pergunta("Quanto é 4²?", ["16", "8", "4", "12"], "16"),
    new Pergunta("Quais são os 3 primeiros dígitos de π?", ["3.14", "3.15", "3.13", "3.12"], "3.14"),
    new Pergunta("Quanto é 335-229?", ["106", "110", "105", "100"], "106"),
    new Pergunta("Quanto é 542+6534?", ["7076", "7074", "7067", "7066"], "7076"),
    new Pergunta("Quanto vale a área de um quadrado com lado = 3?", ["9", "6", "3", "12"], "9"),
    new Pergunta("Qual é a área de um triângulo com base = 5 e altura = 6?", ["15", "10", "20", "12"], "15"),
    new Pergunta("Quanto é 2x3+7/1-5?", ["8", "11", "13", "9"], "9"),
    new Pergunta("Quanto é 5x2,5?", ["12.5", "13", "14", "11.5"], "12.5"),
    new Pergunta("Quanto é 550-1000?", ["-450", "-400", "-500", "-550"], "-450"),
    new Pergunta("Quanto é 5³?", ["125", "150", "25", "100"], "125"),
    new Pergunta("Qual é o nome do número que é 1^100?", ["um", "googolplex", "googol", "número um"], "um"),
    new Pergunta("Quantos subconjuntos do conjunto {1,2,3,...,30} têm a propriedade de que a soma dos elementos do subconjunto é divisível por 5?", ["59049", "90000", "60503", "59050"], "59049"),
    new Pergunta("Qual é o nome da forma geométrica que possui 3 lados?", ["Triângulo", "Quadrado", "Retângulo", "Círculo"], "Triângulo"),
    new Pergunta("Qual é o nome do número que é 10^googol?", ["googolplex", "googol", "milhão", "trilhão"], "googolplex"),
    new Pergunta("Qual é a circunferência de um círculo que possui raio = 8,4 e π = 3?", ["50.4", "48", "52", "45.6"], "50.4"),
    new Pergunta("Esse jogo é legal?", ["sim", "não", "talvez", "depende"], "sim"),
    new Pergunta("Resolva a equação para x no conjunto dos números reais: x³-6x²+11x-6=0", ["1, 2 e 3", "1 e 3", "1, 3 e 6", "2, 3 e 6"], "1, 2 e 3"),
    new Pergunta("Quanto é 9 + 10?", ["19", "21", "18", "20"], "19"),
    new Pergunta("Qual é a soma dos ângulos internos de um triângulo?", ["180", "360", "90", "120"], "180"),
    new Pergunta("Qual é o resultado de 100 ÷ 25?", ["4", "5", "2", "6"], "4"),
    new Pergunta("Quanto é a raiz quadrada de 81?", ["9", "6", "8", "7"], "9"),
    new Pergunta("Quanto é 50% de 200?", ["100", "50", "25", "200"], "100"),
    new Pergunta("Quanto é 10³?", ["1000", "100", "10", "10000"], "1000"),
    new Pergunta("Quanto é a raiz cúbica de 27?", ["3", "9", "27", "1"], "3"),
    new Pergunta("Qual é a soma dos ângulos internos de um quadrado?", ["360", "180", "90", "720"], "360"),
    new Pergunta("Qual é o valor do logaritmo de 100 na base 10?", ["2", "0", "1", "100"], "2"),
    new Pergunta("Qual é o seno de 30 graus?", ["0.5", "0.707", "1", "0"], "0.5"),
    new Pergunta("Qual é a tangente de 45 graus?", ["1", "0", "0.707", "1.5"], "1"),
    new Pergunta("Quanto é 7x8?", ["56", "48", "64", "49"], "56"),
    new Pergunta("Quanto é 100 ÷ 4?", ["25", "20", "30", "40"], "25"),
    new Pergunta("Quanto é 2^5?", ["32", "16", "64", "25"], "32"),
    new Pergunta("Qual é a raiz quadrada de 144?", ["12", "14", "10", "16"], "12"),
    new Pergunta("Quanto é 81 ÷ 9?", ["9", "8", "7", "10"], "9"),
    new Pergunta("Qual é o maior número primo abaixo de 20?", ["19", "17", "13", "11"], "19"),
    new Pergunta("Quanto é 15% de 200?", ["30", "25", "40", "35"], "30"),
    new Pergunta("Quanto é a raiz cúbica de 64?", ["4", "6", "8", "3"], "4"),
    new Pergunta("Qual é o resultado de 7 + 3 x 2?", ["13", "17", "20", "10"], "13"),
    new Pergunta("Quanto é 1000 - 750?", ["250", "300", "200", "150"], "250"),
    new Pergunta("Quanto é 6!", ["720", "120", "600", "24"], "720"),
    new Pergunta("Qual é o nome do polígono com 6 lados?", ["Hexágono", "Pentágono", "Heptágono", "Octógono"], "Hexágono"),
    new Pergunta("Quanto é 2³ x 3²?", ["72", "36", "54", "108"], "72"),
    new Pergunta("Qual é o valor de log₂(16)?", ["4", "3", "5", "2"], "4"),
    new Pergunta("Quanto é 11 x 11?", ["121", "112", "111", "122"], "121"),
    new Pergunta("Qual é o maior número primo abaixo de 50?", ["47", "43", "41", "37"], "47"),
    new Pergunta("Se um círculo tem diâmetro 10, qual é seu raio?", ["5", "10", "15", "20"], "5"),
    new Pergunta("Quanto é 8! (8 fatorial)?", ["40320", "5040", "362880", "720"], "40320"),
    new Pergunta("Qual é a soma dos ângulos internos de um pentágono?", ["540", "360", "450", "600"], "540"),
    new Pergunta("Qual é o maior divisor comum entre 48 e 18?", ["6", "12", "18", "24"], "6"),
    new Pergunta("Quanto é 2 elevado a 10?", ["1024", "512", "2048", "256"], "1024"),
    new Pergunta("Se um quadrado tem perímetro de 40, qual é o comprimento do seu lado?", ["10", "8", "12", "16"], "10"),
    new Pergunta("Quantos lados tem um dodecágono?", ["12", "10", "14", "8"], "12"),
    new Pergunta("Qual é o logaritmo de 1000 na base 10?", ["3", "2", "1", "10"], "3"),
    new Pergunta("Qual é a raiz quadrada de 225?", ["15", "20", "25", "12"], "15"),
    new Pergunta("Se um número for divisível por 6, ele também é divisível por?", ["2 e 3", "3 e 4", "2 e 4", "5 e 2"], "2 e 3"),
    new Pergunta("Quanto é 0.5 + 0.75?", ["1.25", "1.5", "1", "0.85"], "1.25"),
    new Pergunta("Qual é a equação da reta que passa pelos pontos (0,3) e (2,7)?", ["y = 2x + 3", "y = x + 3", "y = 3x + 2", "y = 7x - 2"], "y = 2x + 3"),
    new Pergunta("Se um prisma tem 6 faces, 12 arestas e 8 vértices, ele é um:", ["Cubo", "Tetraedro", "Octaedro", "Prisma triangular"], "Cubo"),
    new Pergunta("Qual é o resultado de 144 ÷ 12?", ["12", "14", "10", "16"], "12"),
    new Pergunta("Quanto é 5^4?", ["625", "125", "1024", "256"], "625"),
    new Pergunta("O que significa a notação Σ em matemática?", ["Soma", "Multiplicação", "Fatorial", "Integral"], "Soma"),
    new Pergunta("Se um triângulo tem lados de 5, 12 e 13, ele é um:", ["Triângulo retângulo", "Triângulo equilátero", "Triângulo isósceles", "Triângulo escaleno"], "Triângulo retângulo"),
    new Pergunta("Quanto vale 1/2 + 1/4?", ["3/4", "1/3", "2/4", "1/2"], "3/4"),
    new Pergunta("Se x + 3 = 10, quanto vale x?", ["7", "3", "10", "13"], "7"),
    new Pergunta("Quantos vértices tem um icosaedro?", ["12", "20", "30", "60"], "12"),
    new Pergunta("Qual é a derivada de x²?", ["2x", "x", "x²", "1"], "2x"),
    new Pergunta("O número 121 é um:", ["Quadrado perfeito", "Número primo", "Número ímpar", "Número composto"], "Quadrado perfeito"),
    new Pergunta("Qual é o único número primo par?", ["2", "3", "5", "7"], "2"),
    new Pergunta("Qual é a fração equivalente a 0.75?", ["3/4", "2/5", "4/5", "1/2"], "3/4"),
    new Pergunta("Quanto é 3√27?", ["3", "6", "9", "4"], "3"),
    new Pergunta("Qual é o seno de 90 graus?", ["1", "0", "0.5", "√2/2"], "1"),
    new Pergunta("Quanto é a integral de 2x dx?", ["x² + C", "2x + C", "x³ + C", "x + C"], "x² + C")
];

let perguntaescolhida = null;


//conquistas
class Conquista {
    static conquistasObtidas = 0;

    constructor(nome, descricao) {
        this.nome = nome;
        this.descricao = descricao;
        this.obtida = false;
    }
};

let conquistas = [
    // Quadrados
    new Conquista("Primeiro click", "Clique pela primeira vez"),
    new Conquista("10 quadrados", "Consiga 10 quadrados"),
    new Conquista("100 quadrados", "Consiga 100 quadrados"),
    new Conquista("Milhar", "Consiga 1k quadrados"),
    new Conquista("10000 quadrados", "Consiga 10k quadrados"),
    new Conquista("10^5", "Consiga 100k quadrados"),
    new Conquista("Milhão", "Consiga 1mi quadrados"),
    new Conquista("Um numero um pouco maior", "Consiga 1bi quadrados"),
    new Conquista("O grande t", "Consiga 1t quadrados"),
    new Conquista("Qa-drados", "Consiga 1Qa quadrados"),
    new Conquista("Ainda pode ficar maior", "Consiga 1Qi quadrados"),
    new Conquista("É sextilhão, não sexta", "Consiga 1Sx quadrados"),
    new Conquista("Não consegui pensar num nome legal", "Consiga 1Sp quadrados"),
    new Conquista("Você acha esse número grande?", "Consiga 1Oc quadrados"),
    new Conquista("Império de quadrados", "Consiga 1No quadrados"),
    new Conquista("Você chegou ao 10-lhão", "Consiga 1De quadrados"),

    // Construções
    new Conquista("Cursor", "Compre 1 cursor"),
    new Conquista("Muitos cursores", "Compre 100 cursores"),
    new Conquista("Professor", "Compre 1 professor"),
    new Conquista("Vários professores", "Compre 100 professores"),
    new Conquista("Matemático", "Compre 1 matemático"),
    new Conquista("Comissão de matemáticos", "Compre 100 matemáticos"),
    new Conquista("Quadro", "Compre 1 quadro"),
    new Conquista("Para que tantos quadros", "Compre 100 quadros"),
    new Conquista("Impressora", "Compre 1 impressora"),
    new Conquista("Impressionante", "Compre 100 impressoras"),
    new Conquista("Fábrica", "Compre 1 fábrica"),
    new Conquista("Conglomerado", "Compre 100 fábricas"),
    new Conquista("Engenheiro","Compre 1 engenheiro"),
    new Conquista("Construtora","Compre 100 engenheiros"),
    new Conquista("Programador","Compre 1 programador"),
    new Conquista("Programação quadratica","Compre 100 programadores"),

    // Triângulos
    new Conquista("Triangulo 1", "Consiga o primeiro triângulo"),
    new Conquista("10 triângulos", "Tenha 10 triângulos ao mesmo tempo"),
    new Conquista("Força triangular", "Compre todas as melhorias de triângulos"),

    // Melhorias
    new Conquista("Cursores melhorados", "Compre 1 melhoria de cursores"),
    new Conquista("Cursores no total", "Compre todas as melhorias de cursores"),
    new Conquista("Bom professor", "Compre 1 melhoria de professores"),
    new Conquista("Professores top", "Compre todas as melhorias de professores"),
    new Conquista("Matemática básica", "Compre 1 melhoria de matemáticos"),
    new Conquista("Matemática avançada", "Compre todas as melhorias de matemáticos"),
    new Conquista("Quadros melhores", "Compre 1 melhoria de quadros"),
    new Conquista("Lousa", "Compre todas as melhorias de quadros"),
    new Conquista("Tinta de qualidade", "Compre 1 melhoria de impressoras"),
    new Conquista("Melhor que impressora 3D", "Compre todas as melhorias de impressoras"),
    new Conquista("Fabricação intensa", "Compre 1 melhoria de fábricas"),
    new Conquista("Fábricas no topo", "Compre todas as melhorias de fábricas"),
    new Conquista("Lápis e papel","Compre 1 melhoria de engenheiro"),
    new Conquista("Melhores engenheiros existentes","Compre todas as melhorias de engenheiros"),
    new Conquista("PC melhor","Compre 1 melhoria de programador"),
    new Conquista("Hacker de quadrados","Compre todas as melhorias de programadores"),
    new Conquista("Tudo feito", "Compre todas as melhorias"),

    // Outros
    new Conquista("Apostador", "Aposte 1 vez na máquina da sorte"),
    new Conquista("Grande apostador", "Aposte 10 vezes na máquina da sorte"),
    new Conquista("Viciado em apostas", "Aposte 100 vezes na máquina da sorte"),
    new Conquista("Rei do cassino", "Aposte 777 vezes na máquina da sorte"),
    new Conquista("Mágico aprendiz", "Use uma magia"),
    new Conquista("Mestre da magia", "Use 30 magias"),
    new Conquista("O mago supremo", "Use 250 magias"),
    new Conquista("Estilista", "Mude a skin do quadrado 1 vez"),
    new Conquista("Aluno", "Responda 1 pergunta do quiz de matemática"),
    new Conquista("Bom aluno", "Responda 10 perguntas do quiz de matemática"),
    new Conquista("Gênio da matemática", "Responda 100 perguntas do quiz de matemática corretamente"),
    new Conquista("Fracasso total", "Erre 200 perguntas no quiz de matemática"),

    new Conquista("Obrigado por jogar Quadrado Clicker", "Consiga todas as conquistas"),
];

let click = 1

//variáveis

//principais funções

function salvarDados() {
    const estado = {
        quadrados,
        quadradosTotais,
        base,
        triangulos,
        melhoriasTri,
        tri, 
        a_pd1,
        nApostas,
        mana,
        nclicks,
        magiaselecionada,
        usoumultiplicus,
        magiasUsadas,
        cliques10x,
        renasceu,
        conseguiu1QuadradosAscendente,
        quadrados_ascendentes,
        valorParaGanhar1QuadradoAscendente,
        co,
        perguntas,
        perguntaescolhida,
        conquistas,
        click
    };

    localStorage.setItem("estadoJogo", JSON.stringify(estado));
}

function carregarDados() {
    const estadoSalvo = localStorage.getItem("estadoJogo");

    if (estadoSalvo) {
        const estado = JSON.parse(estadoSalvo);

        // Restaura os valores salvos
        quadrados = estado.quadrados;
        quadradosTotais = estado.quadradosTotais;
        base = estado.base;
        triangulos = estado.triangulos;
        melhoriasTri = estado.melhoriasTri;
        tri = estado.tri;
        a_pd1 = estado.a_pd1;
        nApostas = estado.nApostas;
        mana = estado.mana;
        nclicks = estado.nclicks;
        magiaselecionada = estado.magiaselecionada;
        usoumultiplicus = estado.usoumultiplicus;
        magiasUsadas = estado.magiasUsadas;
        cliques10x = estado.cliques10x;
        renasceu = estado.renasceu;
        conseguiu1QuadradosAscendente = estado.conseguiu1QuadradosAscendente;
        quadrados_ascendentes = estado.quadrados_ascendentes;
        valorParaGanhar1QuadradoAscendente = estado.valorParaGanhar1QuadradoAscendente;
        co = estado.co;
        perguntas = estado.perguntas;
        perguntaescolhida = estado.perguntaescolhida;
        conquistas = estado.conquistas;
        click = estado.click;

    }

    for (let key in co) {
        let gerador = co[key];  // Obtém o gerador
        if (gerador.m1.possui) {
            document.getElementById(gerador.nome + 1).style.backgroundColor = "#f88c5d"; 
        }
        if (gerador.m2.possui) {
            document.getElementById(gerador.nome + 2).style.backgroundColor = "#f88c5d"; 
        }
        if (gerador.m3.possui) {
            document.getElementById(gerador.nome + 1).style.backgroundColor = "#f88c5d"; 
        }
    }

    const elementos = [
        { id: "pd1", melhoria: "pd1" },
        { id: "cc1", melhoria: "cc1" },
        { id: "cm1", melhoria: "cm1" },
        { id: "sp1", melhoria: "sp1" },
        { id: "ms1", melhoria: "ms1", botaoId: "maquinadasorte" },
        { id: "lm1", melhoria: "lm1", botaoId: "livromagico" },
        { id: "qm1", melhoria: "qm1", botaoId: "quizmatematico" },
        { id: "sq1", melhoria: "sq1", botaoId: "skinquadrado" },
        { id: "pa1", melhoria: "pa1" }

    ];

    elementos.forEach(({ id, melhoria, botaoId }) => {
        const celula = document.getElementById(id);
        if (melhoriasTri[melhoria]) {
            celula.style.backgroundColor = "#f88c5d";
            if (botaoId) {
                const botao = document.getElementById(botaoId);
                botao.style.display = "block";
            }
        }
    });

    if (melhoriasTri["pa1"]) {
        producaoAutomatizada()
    }
}

function salvarJson() {
    // Todas as variáveis do jogo
    const estadoJogo = {
        quadrados,
        quadradosTotais,
        base,
        co,
        melhoriasTri,
        tri,
        triangulos,
        a_pd1,
        mana,
        nclicks,
        magiaselecionada,
        usoumultiplicus,
        perguntaescolhida,
        conquistasObtidas,
        renasceu,
        quadrados_ascendentes,
        valorParaGanhar1QuadradoAscendente,
        click
    };

    // Converte o estado para JSON
    const dadosJSON = JSON.stringify(estadoJogo, null, 4);

    // Criação de um elemento <a> para simular o download
    const elemento = document.createElement('a');
    const arquivoBlob = new Blob([dadosJSON], { type: 'application/json' });

    // Configura o download do arquivo
    elemento.href = URL.createObjectURL(arquivoBlob);
    elemento.download = 'estado_jogo.json';

    // Simula o clique para baixar o arquivo
    document.body.appendChild(elemento);
    elemento.click();

    // Remove o elemento <a> depois de usá-lo
    document.body.removeChild(elemento);
}

function carregarJson() {
    // Cria um input do tipo file para o usuário selecionar o arquivo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    // Define o que acontece quando o arquivo é selecionado
    input.onchange = (evento) => {
        const arquivo = evento.target.files[0]; // Seleciona o arquivo

        if (arquivo) {
            const leitor = new FileReader(); // Cria um FileReader para ler o arquivo

            leitor.onload = (e) => {
                try {
                    const dadosCarregados = JSON.parse(e.target.result); // Converte JSON para objeto

                    // Atualiza todas as variáveis do jogo
                    quadrados = dadosCarregados.quadrados;
                    quadradosTotais = dadosCarregados.quadradosTotais;
                    base = dadosCarregados.base;

                    co = dadosCarregados.co,

                    melhoriasTri = dadosCarregados.melhoriasTri;
                    tri = dadosCarregados.tri;

                    triangulos = dadosCarregados.triangulos;
                    a_pd1 = dadosCarregados.a_pd1;

                    mana = dadosCarregados.mana;
                    nclicks = dadosCarregados.nclicks;
                    magiaselecionada = dadosCarregados.magiaselecionada;
                    usoumultiplicus = dadosCarregados.usoumultiplicus;

                    perguntaescolhida = dadosCarregados.perguntaescolhida;

                    conquistasObtidas = dadosCarregados.conquistasObtidas;
                    renasceu = dadosCarregados.renasceu;
                    quadrados_ascendentes = dadosCarregados.quadrados_ascendentes;
                    valorParaGanhar1QuadradoAscendente = dadosCarregados.valorParaGanhar1QuadradoAscendente;

                    click = dadosCarregados.click;

                    for (let key in co) {
                        let gerador = co[key];  // Obtém o gerador
                        if (gerador.m1.possui) {
                            document.getElementById(gerador.nome + 1).style.backgroundColor = "#f88c5d"; 
                        }
                        if (gerador.m2.possui) {
                            document.getElementById(gerador.nome + 2).style.backgroundColor = "#f88c5d"; 
                        }
                        if (gerador.m3.possui) {
                            document.getElementById(gerador.nome + 1).style.backgroundColor = "#f88c5d"; 
                        }
                    }

                    const elementos = [
                        { id: "pd1", melho: "pd1" },
                        { id: "cc1", melho: "cc1" },
                        { id: "cm1", melho: "cm1" },
                        { id: "sp1", melho: "sp1" },
                        { id: "ms1", melho: "ms1", botaoId: "maquinadasorte" },
                        { id: "lm1", melho: "lm1", botaoId: "livromagico" },
                        { id: "qm1", melho: "qm1", botaoId: "quizmatematico" },
                        { id: "sq1", melho: "sq1", botaoId: "skinquadrado" },
                        { id: "pa1", melho: "pa1" }
                    ];

                    elementos.forEach(({ id, melho, botaoId }) => {
                        const celula = document.getElementById(id);
                        if (melhoriasTri[melho]) {
                            celula.style.backgroundColor = "#f88c5d";
                            if (botaoId) {
                                const botao = document.getElementById(botaoId);
                                botao.style.display = "block";
                            }
                        }
                    });

                    if (melhoriasTri["pa1"]) {
                        producaoAutomatizada()
                    }

                    alert("Estado do jogo carregado com sucesso!");
                } catch (erro) {
                    console.error("Erro ao carregar o arquivo:", erro);
                    alert("O arquivo selecionado não é válido.");
                }
            };

            leitor.readAsText(arquivo); // Lê o conteúdo do arquivo
        }
    };

    // Simula o clique no input para abrir o seletor de arquivos
    input.click();
}

function formatar(numero) {
    const sufixos = [
        "", "k",
        "mi", "bi", "t", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "De",
        "UnDe", "DuDe", "TreDe", "QaDe", "QiDe", "SxDe", "SpDe", "OcDe", "NoDe", "Vi",
        "UnVi", "DuVi", "TreVi", "QaVi", "QiVi", "SxVi", "SpVi", "OcVi", "NoVi", "Tre",
        "UnTre", "DuTre", "TreTre", "QaTre", "QiTre", "SxTre", "SpTre", "OcTre", "NoTre", "Quat",
        "UnQuat", "DuQuat", "TreQuat", "QaQuat", "QiQuat", "SxQuat", "SpQuat", "OcQuat", "NoQuat", "Quit",
        "UnQuit", "DuQuit", "TreQuit", "QaQuit", "QiQuit", "SxQuit", "SpQuit", "OcQuit", "NoQuit", "Sexa",
        "UnSexa", "DuSexa", "TreSexa", "QaSexa", "QiSexa", "SxSexa", "SpSexa", "OcSexa", "NoSexa", "Sept",
        "UnSept", "DuSept", "TreSept", "QaSept", "QiSept", "SxSept", "SpSept", "OcSept", "NoSept", "Octa",
        "UnOcta", "DuOcta", "TreOcta", "QaOcta", "QiOcta", "SxOcta", "SpOcta", "OcOcta", "NoOcta", "Nove",
        "UnNove", "DuNove", "TreNove", "QaNove", "QiNove", "SxNove", "SpNove", "OcNove", "NoNove", "Ce"
    ];

    let i = 0;

    while (numero >= 1000) {
        numero = Math.round(numero)
        numero /= 1000;
        i++;
    }

    return i <= sufixos.length ? arredondar(2,numero) + sufixos[i] : "Você ta de hack, só pode";
}

function clique() {
    if (window.innerWidth < 600) {
        quadrados += click;
        quadradosTotais += click;
        nclicks++;

        // Mudar tamanho ao clicar
        const elemento = document.getElementById("quadrado");
        elemento.style.width = "90px";
        elemento.style.height = "90px";

        setTimeout(() => {
            elemento.style.width = "70px";
            elemento.style.height = "70px";
        }, 100);
    } else if (window.innerWidth >= 600) {
        quadrados += click;
        quadradosTotais += click;
        nclicks++;

        // Mudar tamanho ao clicar
        const elemento = document.getElementById("quadrado");
        elemento.style.width = "230px";
        elemento.style.height = "230px";

        setTimeout(() => {
            elemento.style.width = "200px";
            elemento.style.height = "200px";
        }, 100);
    }

    verificarQuadradosAscendentes();
    verificarTriangulos();
    cliqueCritico();
    verificarMagias();
    alterar();
}

function alterar() {
    let quadradosText = document.getElementById("quadradotext");
    let triangulosText = document.getElementById("triangulotext")
    quadradosText.innerText = "Quadrados: " + formatar(quadrados);
    triangulosText.innerText = "Triângulos: " + triangulos;

    let triangulosTextMelhorias = document.getElementById("triangulotextMelhorias");
    triangulosTextMelhorias.innerText = formatar(triangulos);

    let quadradotextMelhorias = document.getElementById("quadradotextMelhorias");
    quadradotextMelhorias.innerText = formatar(quadrados);

    for (key in co) {
        let nCoText = document.getElementById("n" + co[key].nome);
        let vCoText = document.getElementById("v" + co[key].nome);
        let aCoText = document.getElementById("a" + co[key].nome);
        nCoText.innerText = co[key].n
        vCoText.innerText = "Preço: " + formatar(co[key].v)
        aCoText.innerText = "Aumento: " + formatar(co[key].a)
    }

    let quadrados_ascendentesText = document.getElementById("quadrados-ascendentes");
    quadrados_ascendentesText.innerText = "Você possui " + quadrados_ascendentes + " quadrados ascendentes";
    let quadrados_ascendentesFaltantesText = document.getElementById("quadrados-ascendentes-faltantes");
    quadrados_ascendentesFaltantesText.innerText = "Consiga " + formatar(valorParaGanhar1QuadradoAscendente) + " quadrados para o proximo quadrado ascendente";

    let manaText = document.getElementById("mana");
    manaText.innerText = "Mana: " + mana;

    click = (base + (co.cur.n * co.cur.a) + (co.pro.n * co.pro.a) + (co.mat.n * co.mat.a) + (co.qua.n * co.qua.a) + (co.imp.n * co.imp.a) + (co.fab.n * co.fab.a) + (co.eng.n * co.eng.a) + (co.pog.n * co.pog.a)) * a_pd1;

    if (renasceu === true) {
        click = (base + (co.cur.n * co.cur.a) + (co.pro.n * co.pro.a) + (co.mat.n * co.mat.a) + (co.qua.n * co.qua.a) + (co.imp.n * co.imp.a) + (co.fab.n * co.fab.a) + (co.eng.n * co.eng.a) + (co.pog.n * co.pog.a)) * a_pd1 * (1 + quadrados_ascendentes / 10);
    }

    let quadradosporclickText = document.getElementById("quadradosporclickText")
    quadradosporclickText.innerText = "Quadrados por click: " + formatar(click)
}

function arredondar(casasDecimais, variavel) {
    return variavel = Math.round(variavel * 10 ** casasDecimais) / 10 ** casasDecimais;
}

function renascer() {
    if (conseguiu1QuadradosAscendente === true) {
        renasceu = true
        conseguiu1QuadradosAscendente = false;

        quadrados = 0
        base = 1

        co = {
            cur: new Gerador("Cursores",100, 1, [500,],["Cursores duplos", "Múltiplos cursores", "Super cursores"]),
            pro: new Gerador("Professores",3e3, 10, [15e3,],["Professores duplos", "Múltiplos professores", "Super professores"]),
            mat: new Gerador("Matemáticos",1.3e5, 44, [6.5e5,],["Matemáticos duplos", "Múltiplos matemáticos", "Super matemáticos"]),
            qua: new Gerador("Quadros",0.9e7, 305, [4.5e7,],["Quadros duplos", "Múltiplos quadros", "Super quadros"]),
            fab: new Gerador("Fábricas",1.5e9, 5070, [7.5e9,],["Fábricas duplas", "Múltiplas fábricas", "Super fabricas"]),
            eng: new Gerador("Engenheiros",2e11,674e2, [10e11,],["Engenheiros duplos", "Múltiplas engenheiros", "Super engenheiros"]),
            pog: new Gerador("Programadores",2.5e13,8425e2,[12.5e13,],["Programadores duplos", "Múltiplos programadores", "Super programadores"]),
        }

        for (let pegoutri in tri) {
            tri[pegoutri] = false
        }

        let celulas = document.querySelectorAll('#melhorias td');

        celulas.forEach(function (celula) {
            celula.style.backgroundColor = "#d4c4bd";
        });

        document.getElementById("renascer").style.backgroundColor = "#e0f7fa"
        alterar()
        mudarMain()
    } else  {
        let consiga1quadradoText = document.getElementById("consiga1quadrado")
        consiga1quadradoText.innerText = "Consiga pelo menos 1 quadrado ascendente para renascer"
    }

}

function adicionarConquistas() {
    let listaConquistas = document.getElementById("lista-conquistas");
    listaConquistas.innerHTML = "";

    for (let i = 0; i <= conquistas.length-2; i++) {
        let div = document.createElement("div");
        div.className = conquistas[i].obtida ? "conquista-ativa": "conquista-inativa";

        let titulo = document.createElement("h3");
        titulo.textContent = conquistas[i].nome;

        let descricao = document.createElement("p");
        descricao.textContent = conquistas[i].descricao;

        div.appendChild(titulo);
        div.appendChild(descricao);
        listaConquistas.appendChild(div);
    }

    if (conquistas[conquistas.length-1].obtida) {
        let div = document.createElement("div");
        div.className = conquistas[conquistas.length-1].obtida ? "conquista-ativa" : "conquista-inativa";

        let titulo = document.createElement("h3");
        titulo.textContent = conquistas[conquistas.length-1].nome;

        let descricao = document.createElement("p");
        descricao.textContent = conquistas[conquistas.length-1].descricao;

        div.appendChild(titulo);
        div.appendChild(descricao);
        listaConquistas.appendChild(div);
    } else {
        let div = document.createElement("div");
        div.className = conquistas[conquistas.length-1].obtida ? "conquista-ativa" : "conquista-inativa";

        let titulo = document.createElement("h3");
        titulo.textContent = "???";

        let descricao = document.createElement("p");
        descricao.textContent = "???";

        div.appendChild(titulo);
        div.appendChild(descricao);
        listaConquistas.appendChild(div);
    }
        
}

function verificarConquistas(callback) {
    //Quadrados
    if (quadradosTotais >= 1e0) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Primeiro click")].obtida = true;
    }
    if (quadradosTotais >= 1e1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "10 quadrados")].obtida = true;
    }
    if (quadradosTotais >= 1e2) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "100 quadrados")].obtida = true;
    }
    if (quadradosTotais >= 1e3) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Milhar")].obtida = true;
    }
    if (quadradosTotais >= 1e4) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "10000 quadrados")].obtida = true;
    }
    if (quadradosTotais >= 1e5) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "10^5")].obtida = true;
    }
    if (quadradosTotais >= 1e6) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Milhão")].obtida = true;
    }
    if (quadradosTotais >= 1e9) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Um numero um pouco maior")].obtida = true;
    }
    if (quadradosTotais >= 1e12) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "O grande t")].obtida = true;
    }
    if (quadradosTotais >= 1e15) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Qa-drados")].obtida = true;
    }
    if (quadradosTotais >= 1e18) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Ainda pode ficar maior")].obtida = true;
    }
    if (quadradosTotais >= 1e21) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "É sextilhão, não sexta")].obtida = true;
    }
    if (quadradosTotais >= 1e24) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Não consegui pensar num nome legal")].obtida = true;
    }
    if (quadradosTotais >= 1e27) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Você acha esse número grande?")].obtida = true;
    }
    if (quadradosTotais >= 1e30) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Império de quadrados")].obtida = true;
    }
    if (quadradosTotais >= 1e33) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Você chegou ao 10-lhão")].obtida = true;
    }

    //Construções
    if (co.cur.n >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Cursor")].obtida = true;
    }
    if (co.cur >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Muitos cursores")].obtida = true;
    }
    if (co.pro.n >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Professor")].obtida = true;
    }
    if (co.pro.n >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Vários professores")].obtida = true;
    }
    if (co.mat.n >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Matemático")].obtida = true;
    }
    if (co.mat.n >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Comissão de matemáticos")].obtida = true;
    }
    if (co.qua.n >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Quadro")].obtida = true;
    }
    if (co.qua.n >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Pra que tantos quadros")].obtida = true;
    }
    if (co.fab.n >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Fábrica")].obtida = true;
    }
    if (co.fab.n >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Conglomerado")].obtida = true;
    }
    if (co.eng.n >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Engenheiro")].obtida = true;
    }
    if (co.eng.n >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Construtora")].obtida = true;
    }
    if (co.pog.n >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Programador")].obtida = true;
    }
    if (co.pog.n >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Programação quadratica")].obtida = true;
    }

    //Triângulos
    if (triangulos >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Triangulo 1")].obtida = true;
    }
    if (triangulos >= 10) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "10 triângulos")].obtida = true;
    }
    if (Object.values(melhoriasTri).every(valor => valor === true)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Força triangular")].obtida = true;
    }

    //Melhorias
    function verificarConquistasMelhorias(Gerador, n) {
        let melhoriasConquistas = [Gerador.m1.possui, Gerador.m2.possui, Gerador.m3.possui]
        if (n === 1) {
            if (melhoriasConquistas.includes(true)) {
                return true
            };
        } else if (n === 2) {
            if (melhoriasConquistas.filter((elemento) => { return elemento === true }).length === 3) {
                return true
            }
        } else {
            melhoriasConquistas = []
            for (key in co) {
                key = co[key]
                melhoriasConquistas.push(key.m1.possui, key.m2.possui, key.m3.possui)
            }
            return melhoriasConquistas.filter(e => e === true).length === Object.keys(co).length * 3;
        }
    }
    if (verificarConquistasMelhorias(co.cur, 1)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Cursores melhorados")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.cur, 2)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Cursores no total")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.pro, 1)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Bom professor")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.pro, 2)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Professores top")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.mat, 1)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Matemática básica")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.mat, 2)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Matemática avançada")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.qua, 1)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Quadros melhores")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.qua, 2)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Lousa")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.fab, 1)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Fabricação intensa")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.fab, 2)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Fábricas no topo")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.eng, 1)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Lápis e papel")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.eng, 2)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Melhores engenheiros existentes")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.pog, 1)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "PC melhor")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.pog, 2)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Hacker de quadrados")].obtida = true;
    }
    if (verificarConquistasMelhorias(co.cur, 3)) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Tudo feito")].obtida = true;
    }

    //Outros
    if (nApostas >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Apostador")].obtida = true;
    }
    if (nApostas >= 10) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Grande apostador")].obtida = true;
    }
    if (nApostas >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Viciado em apostas")].obtida = true;
    }
    if (nApostas >= 777) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Rei do cassino")].obtida = true;
    }
    if (magiasUsadas >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Mágico aprendiz")].obtida = true;
    }
    if (magiasUsadas >= 30) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Mestre da magia")].obtida = true;
    }
    if (magiasUsadas >= 250) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "O mago supremo")].obtida = true;
    }
    //estilista está na função de mudar a skin
    if (Pergunta.respondidas >= 1) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Aluno")].obtida = true;
    }
    if (Pergunta.respondidas >= 10) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Bom aluno")].obtida = true;
    }
    if (Pergunta.acertos >= 100) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Gênio da matemática")].obtida = true;
    }
    if (Pergunta.erros >= 200) {
        conquistas[conquistas.findIndex((elemento) => elemento.nome === "Fracasso total")].obtida = true;
    }

    if (conquistas.filter(c => c.obtida).length >= conquistas.length - 1) {
        conquistas.find(c => c.nome === "Obrigado por jogar Quadrado Clicker").obtida = true;
    }
    callback()
}

function verificarQuadradosAscendentes() {
    if (quadrados >= valorParaGanhar1QuadradoAscendente) {
        conseguiu1QuadradosAscendente = true;
        quadrados_ascendentes++;
        valorParaGanhar1QuadradoAscendente = Math.round(valorParaGanhar1QuadradoAscendente * 1.05)
    }
}

function mudarMenu(menu) {
    switch (menu) {
        case "melhorias":
            document.getElementById("principal").style.display = "none";
            document.getElementById("melhorias").style.display = "block";
            break;
        case "ajuda":
            document.getElementById("principal").style.display = "none";
            document.getElementById("ajuda").style.display = "block";
            break;
        case "outros":
            document.getElementById("principal").style.display = "none";
            document.getElementById("outros").style.display = "block";
            break;
        case "salvamento":
            document.getElementById("principal").style.display = "none";
            document.getElementById("salvar").style.display = "block";
            break;
        case "triangulos":
            document.getElementById("outros").style.display = "none";
            document.getElementById("triangulos").style.display = "block";
            break;
        case "renascer":
            document.getElementById("outros").style.display = "none";
            document.getElementById("renascer").style.display = "flex";
            document.getElementById("renascer").style.flexWrap = "wrap";
            break;
        case "confirmarRenascer":
            document.getElementById("confirmarRenascer").style.display = "block";
            document.getElementById("renascer").style.backgroundColor = "#737575"
            break;
        case "conquistas":
            document.getElementById("outros").style.display = "none";
            document.getElementById("conquistas").style.display = "block";
            verificarConquistas(adicionarConquistas);
            break;
        case "maquinadasorte":
            document.getElementById("outros").style.display = "none";
            document.getElementById("maquina-da-sorte").style.display = "flex";
            break;
        case "livromagico":
            document.getElementById("outros").style.display = "none";
            document.getElementById("livro-magico").style.display = "flex";
            break;
        case "quizmatematico":
            document.getElementById("outros").style.display = "none";
            document.getElementById("quiz-matematico").style.display = "flex";
            break;
        case "skinquadrado":
            document.getElementById("outros").style.display = "none";
            document.getElementById("skin-quadrado").style.display = "block";
            break;
        case "main":
            document.getElementById("principal").style.display = "flex";
            document.getElementById("melhorias").style.display = "none";
            document.getElementById("ajuda").style.display = "none";
            document.getElementById("outros").style.display = "none";
            document.getElementById("salvar").style.display = "none";
            document.getElementById("triangulos").style.display = "none";
            document.getElementById("renascer").style.display = "none";
            document.getElementById("confirmarRenascer").style.display = "none";
            document.getElementById("conquistas").style.display = "none";
            document.getElementById("maquina-da-sorte").style.display = "none";
            document.getElementById("livro-magico").style.display = "none";
            document.getElementById("quiz-matematico").style.display = "none";
            document.getElementById("skin-quadrado").style.display = "none";
            document.getElementById("renascer").style.backgroundColor = "#e0f7fa";
            let consiga1quadradoText = document.getElementById("consiga1quadrado");
            consiga1quadradoText.innerText = "";
            alterar()
            break;
    }
}

//principais funções

//triangulos

function cliqueCritico() {
    if (melhoriasTri.cc1 === true && melhoriasTri.cm1 === false) {
        let valorRandom = Math.random()

        if (valorRandom <= 0.03) {
            quadrados += click * 4;
            quadradosTotais += click * 4;
        }
    } else if (melhoriasTri.cc1 === true && melhoriasTri.cm1 === true) {
        let valorRandom = Math.random()

        if (valorRandom <= 0.06) {
            quadrados += click * 9;
            quadradosTotais += click * 9;
        }
    }
}

function verificarTriangulos() {
    if (quadrados >= 1000 && tri.tr1 === false) {
        triangulos++;
        tri.tr1 = true;
    }
    if (quadrados >= 100000 && tri.tr2 === false) {
        triangulos++;
        tri.tr2 = true;
    }
    if (quadrados >= 10000000 && tri.tr3 === false) {
        triangulos++;
        tri.tr3 = true;
    }
    if (quadrados >= 1000000000 && tri.tr4 === false) {
        triangulos++;
        tri.tr4 = true;
    }
    if (quadrados >= 100000000000 && tri.tr5 === false) {
        triangulos++;
        tri.tr5 = true;
    }
    if (quadrados >= 10000000000000 && tri.tr6 === false) {
        triangulos++;
        tri.tr6 = true;
    }
    if (quadrados >= 1000000000000000 && tri.tr7 === false) {
        triangulos++;
        tri.tr7 = true;
    }
    if (quadrados >= 100000000000000000n && tri.tr8 === false) {
        triangulos++;
        tri.tr8 = true;
    }
    if (quadrados >= 10000000000000000000n && tri.tr9 === false) {
        triangulos++;
        tri.tr9 = true;
    }
    if (quadrados >= 1000000000000000000000n && tri.tr10 === false) {
        triangulos++;
        tri.tr10 = true;
    }
}

function apostar() {
    // Obtém o valor do input
    let valorAposta = document.getElementById('valor-aposta').value;

    // Verifica se o valor é válido
    let textoEmergencia = document.getElementById("textoEmergenciamaquina")
    if (valorAposta.trim() === '' || isNaN(valorAposta) || Number(valorAposta) <= 0) {
        textoEmergencia.innerText = "Insira um valor válido"
    } else {
        textoEmergencia.innerText = "";
        //aposta
        if (valorAposta <= quadrados) {
            nApostas++;
            let resultadoAposta = Math.random()
            if (resultadoAposta <= 0.5) {
                quadrados += Number(valorAposta);
                quadradosTotais += Number(valorAposta);
                let resultadoText = document.getElementById("resultado-maquina");
                resultadoText.innerText = "Ganhou";
            } else if (resultadoAposta > 0.5) {
                quadrados -= Number(valorAposta);
                let resultadoText = document.getElementById("resultado-maquina");
                resultadoText.innerText = "Perdeu";
            }
        } else if (valorAposta > quadrados) {
            textoEmergencia.innerText = "Insira um valor menor ou igual que seus quadrados";
        }
    }

    alterar()
};

function usarmagias() {
    let textomenssagens = document.getElementById("textoEmergencialivro")
    if (!magiaselecionada) {
        textomenssagens.innerText = "Selecione um poder"
    } else if (magiaselecionada === "Aresto clicum") {
        if (mana >= 1) {
            mana--;
            cliques10x += 20;
            magiasUsadas++;
        } else if (mana <= 1) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        }
    } else if (magiaselecionada === "Constructo") {
        if (mana >= 3) {
            mana -= 3
            let numeroRandom = Math.random()
            if (numeroRandom <= 0.2) {
                cur.n++
                textomenssagens.innerText = "Você ganhou 1 cursor"
            } else if (numeroRandom <= 0.4) {
                pro.n++
                textomenssagens.innerText = "Você ganhou 1 professor"
            } else if (numeroRandom <= 0.6) {
                mat.n++
                textomenssagens.innerText = "Você ganhou 1 matemático"
            } else if (numeroRandom <= 0.8) {
                qua.n++
                textomenssagens.innerText = "Você ganhou 1 quadro"
            } else if (numeroRandom <= 1) {
                fab.n++
                textomenssagens.innerText = "Você ganhou 1 fabrica"
            }
            magiasUsadas++;
        } else if (mana < 3) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        }
    } else if (magiaselecionada === "Quadramentio") {
        if (mana >= 3) {
            mana -= 3
            quadrados *= 1.25
            quadradosTotais += quadrados * 0.25
            textomenssagens.innerText = "Mais 25% de quadrados"
            magiasUsadas++;
        } else if (mana < 3) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        }
    } else if (magiaselecionada === "Trianglusio") {
        if (mana >= 2) {
            mana -= 2
            let numeroRandom = Math.random()
            if (numeroRandom <= 0.2) {
                triangulos++
                textomenssagens.innerText = "Você ganhou 1 triangulo"
            } else {
                textomenssagens.innerText = "Mais sorte na próxima vez"
            }
            magiasUsadas++;
        } else if (mana < 2) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        }
    } else if (magiaselecionada === "Multiplicos quadrados") {
        if (mana >= 10 && usoumultiplicus === false) {
            mana -= 10;
            quadrados *= 20;
            quadradosTotais += quadrados * 20
            usoumultiplicus = true;
            textomenssagens.innerText = "Multiplicos foi usado"
            magiasUsadas++;
        } else if (mana < 10) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        } else if (usoumultiplicus === true) {
            textomenssagens.innerText = "Essa mágia só pode ser usada uma vez por renascimento"
        }
    }

    alterar()
}

function verificarMagias() {
    if (nclicks >= 1000) {
        nclicks = 0;
        mana++;
        if (mana >= 10) {
            mana = 10;
        }
    }

    if (cliques10x >= 1) {
        cliques10x--;
        quadrados += click * 9;
        quadradosTotais += click *9;
    }
}

function mostrarFeitico(id) {
    const feiticos = {
        "Aresto clicum": {
            titulo: "Aresto clicum",
            descricao: "Seus proximo 20 cliques dão 10x mais clicks",
            mana: "Mana:1"
        },
        Constructo: {
            titulo: "Constructo",
            descricao: "Essa magia te da uma construção aleatoria, mesmo que você nao tenha nenhuma dela",
            mana: "Mana:3",
        },
        Quadramentio: {
            titulo: "Quadramentio",
            descricao: "Essa magia te da 25% dos seus quadrados atuais",
            mana: "Mana:3",
        },
        Trianglusio: {
            titulo: "Trianglusio",
            descricao: "Essa magia tem uma chance de 20% de gerar um triangulo",
            mana: "Mana:2",
        },
        "Multiplicos quadrados": {
            titulo: "Multiplicos quadrados",
            descricao: "Essa magia multiplica seu numero de quadrados por 20, mas ela é tão poderosa, que so pode ser usada uma vez por renascimento",
            mana: "Mana:10",
        },
    };
    const feitico = feiticos[id];
    if (feitico) {
        document.getElementById("titulo-feitico").textContent = feitico.titulo;
        document.getElementById("descricao-feitico").textContent = feitico.descricao;
        document.getElementById("custo-mana").textContent = feitico.mana;

        magiaselecionada = id;
    }
}

function comecarquiz() {
    document.getElementById("comecarquiz").style.display = "none";
    perguntaescolhida = perguntas[Math.round(Math.random() * Pergunta.numPerguntas)];
    document.getElementById("pergunta").innerText = perguntaescolhida.pergunta;

    let opçao1 = document.getElementById("opção1");
    let opçao2 = document.getElementById("opção2");
    let opçao3 = document.getElementById("opção3");
    let opçao4 = document.getElementById("opção4");

    opçao1.innerText = perguntaescolhida.opçoes[0]
    opçao2.innerText = perguntaescolhida.opçoes[1]
    opçao3.innerText = perguntaescolhida.opçoes[2]
    opçao4.innerText = perguntaescolhida.opçoes[3]
}

function verificarQuiz(numerobotao) {
    let acertou = null;

    if (numerobotao === 1) {
        if (perguntaescolhida.opçoes[0] === perguntaescolhida.resposta) {
            acertou = true;
        } else {
            acertou = false;
        }
    } else if (numerobotao === 2) {
        if (perguntaescolhida.opçoes[1] === perguntaescolhida.resposta) {
            acertou = true;
        } else {
            acertou = false;
        }
    } else if (numerobotao === 3) {
        if (perguntaescolhida.opçoes[2] === perguntaescolhida.resposta) {
            acertou = true;
        } else {
            acertou = false;
        }
    } else if (numerobotao === 4) {
        if (perguntaescolhida.opçoes[3] === perguntaescolhida.resposta) {
            acertou = true;
        } else {
            acertou = false;
        }
    }

    if (acertou === true) {
        quadrados *= 1.15;
        Pergunta.maisAcerto();
    } else {
        quadrados *= 0.85;
        Pergunta.maisErro();
    }

    Pergunta.maisPergunta()

    mudarMenu("main");
    comecarquiz();
    alterar();

}

function skinquadrado(tipo) {
    conquistas[conquistas.findIndex((elemento) => elemento.nome === "Estilista")].obtida = true;
    let quadradoprincipal = document.getElementById('quadrado');
    if (tipo === "texto") {
        let textoinput = document.getElementById('textoQuadrado').value;
        quadradoprincipal.innerText = textoinput;
    } else if (tipo === "fundo") {
        let fundoinput = document.getElementById("fundoQuadrado").value;
        quadradoprincipal.style.backgroundColor = fundoinput;
    } else if (tipo === "corborda") {
        let corbordainput = document.getElementById("bordaQuadrado").value;
        quadradoprincipal.style.borderColor = corbordainput;
    } else if (tipo === "tipoborda") {
        const radios = document.querySelectorAll('#skin-quadrado input[type="radio"]');
        let tipobordainput = Array.from(radios).find(radio => radio.checked).value;
        quadradoprincipal.style.borderStyle = tipobordainput;
    } else if (tipo === "original") {
        quadradoprincipal.innerText = "";
        quadradoprincipal.style.backgroundColor = "#E0F7FA";
        quadradoprincipal.style.borderColor = "black";
        quadradoprincipal.style.backgroundImage = "none"
    } else if (tipo === "imagem") {
        let imagemInput = document.getElementById('imagem').files[0];
        if (imagemInput) {
            let imageURL = URL.createObjectURL(imagemInput);
            quadradoprincipal.style.backgroundImage = `url('${imageURL}')`;
            quadradoprincipal.style.backgroundSize = "cover"; // Ajusta o tamanho da imagem
            quadradoprincipal.style.backgroundPosition = "center"; // Centraliza a imagem
        } else {
            alert("Nenhuma imagem foi selecionada.");
        }
    } else {
        alert("Como você fez isso?");
    }

    alterar()
}

function producaoAutomatizada() {
    if (melhoriasTri.pa1) {
        setInterval(() => {
            quadrados += click * 0.1
            quadradosTotais += click * 0.1
            alterar()
        }, 1000);
    }

}

//triangulos

//compras

function comprarGerador(Gerador) {
    if (Gerador === "cur") {
        co.cur.comprar();
    } else if (Gerador === "pro") {
        co.pro.comprar();
    } else if (Gerador === "mat") {
        co.mat.comprar();
    } else if (Gerador === "qua") {
        co.qua.comprar();
    } else if (Gerador === "fab") {
        co.fab.comprar();
    }

    alterar()
}

function comprarMelhoriasTriangulos(melhoria, evento) {

    if (melhoria === 'Produtividade dobrada' && melhoriasTri.pd1 === false && triangulos >= 2) {
        melhoriasTri.pd1 = true;
        triangulos -= 2
        a_pd1 = 2
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Clique crítico' && melhoriasTri.cc1 === false && triangulos >= 1) {
        melhoriasTri.cc1 = true;
        triangulos -= 1
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Crítico melhorado' && melhoriasTri.cm1 === false && triangulos >= 1) {
        if (melhoriasTri.cc1 === true) {
            melhoriasTri.cm1 = true;
            triangulos -= 1
            evento.target.closest("td").style.backgroundColor = "#f88c5d";
        } else {
            alert('Precisa de Clique Critico primeiro')
        }

    }
    if (melhoria === 'Superprodução' && melhoriasTri.sp1 === false && triangulos >= 2) {
        melhoriasTri.sp1 = true;
        triangulos -= 2
        for (key in co) {
            co[key].a *= 2
        }
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Maquina da sorte' && melhoriasTri.ms1 === false && triangulos >= 2) {
        melhoriasTri.ms1 = true;
        triangulos -= 2
        document.getElementById("maquinadasorte").style.display = "block"
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Livro magico' && melhoriasTri.lm1 === false && triangulos >= 2) {
        melhoriasTri.lm1 = true;
        triangulos -= 2;
        document.getElementById("livromagico").style.display = "block";
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Quiz matemático' && melhoriasTri.qm1 === false && triangulos >= 2) {
        melhoriasTri.qm1 = true;
        triangulos -= 2;
        document.getElementById("quizmatematico").style.display = "block"
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Skin quadrado' && melhoriasTri.sq1 === false && triangulos >= 1) {
        melhoriasTri.sq1 = true;
        triangulos -= 1;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
        document.getElementById("skinquadrado").style.display = "block";
    }
    if (melhoria === 'Produção automatizada' && melhoriasTri.pa1 === false && triangulos >= 3) {
        melhoriasTri.pa1 = true;
        triangulos -= 3;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
        producaoAutomatizada();
    }

    alterar()
}

setInterval(salvarDados, 60000);
//compras

