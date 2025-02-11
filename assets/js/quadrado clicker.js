//variáveis

let quadrados = 0;
let quadradosTotais = 0;
let base = 1;

let melhorias = {
    Bas: {b1: false, b2: false, b3: false},
    Cur: {c1: false, c2: false, c3: false},
    Pro: {p1: false, p2: false, p3: false},
    Mat: {m1: false, m2: false, m3: false},
    Qua: {q1: false, q2: false, q3: false},
    Fab: {f1: false, f2: false, f3: false}
}

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

let mana = 10;
let nclicks = 0;
let magiaselecionada = null;
let usoumultiplicus = false;

let renasceu = false;
let quadrados_ascendentes = 0;
let valorParaGanhar1QuadradoAscendente = 100000000;


//construções
class Construcao {
    constructor(valorBase,aumento) {
        this.n = 0;
        this.valorBase = valorBase;
        this.a = aumento;
        this.v = valorBase * (1.15 ** this.n);
    }

};

let cur = new Construcao(100, 1);
let pro = new Construcao(5000, 10);
let mat = new Construcao(130_000, 50);
let qua = new Construcao(9_000_000, 750);
let fab = new Construcao(650_000_000, 15_000);


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

const perguntas = [
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
];

let perguntaescolhida = null;

class Conquista {
    static conquistasObtidas = 0;

    constructor(nome, descricao) {
        this.nome = nome;
        this.descricao = descricao;
        this.obtida = false;
    }
};

const conquistas = [
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
    new Conquista("Pra que tantos quadros", "Compre 100 quadros"),
    new Conquista("Fábrica", "Compre 1 fábrica"),
    new Conquista("Conglomerado", "Compre 100 fábricas"),

    // Triângulos
    new Conquista("Triangulo 1", "Consiga o primeiro triângulo"),
    new Conquista("10 triângulos", "Consiga 10 triângulos"),
    new Conquista("Força triangular", "Compre todas as melhorias de triângulos"),

    // Melhorias
    new Conquista("Melhoria básica", "Compre uma melhoria base"),
    new Conquista("Cursores melhorados", "Compre 1 melhoria de cursores"),
    new Conquista("Cursores no total", "Compre todas as melhorias de cursores"),
    new Conquista("Bom professor", "Compre 1 melhoria de professores"),
    new Conquista("Professores top", "Compre todas as melhorias de professores"),
    new Conquista("Matemática básica", "Compre 1 melhoria de matemáticos"),
    new Conquista("Matemática avançada", "Compre todas as melhorias de matemáticos"),
    new Conquista("Quadros melhores", "Compre 1 melhoria de quadros"),
    new Conquista("Lousa", "Compre todas as melhorias de quadros"),
    new Conquista("Fabricação intensa", "Compre 1 melhoria de fábricas"),
    new Conquista("Fábricas no topo", "Compre todas as melhorias de fábricas"),
    new Conquista("Tudo feito", "Compre todas as melhorias"),
    
    // Outros
    new Conquista("Apostador", "Aposte 1 vez na máquina da sorte"),
    new Conquista("Grande apostador", "Aposte 10 vezes na máquina da sorte"),
    new Conquista("Viciado em apostas", "Aposte 100 vezes na máquina da sorte"),
    new Conquista("Mágico aprendiz", "Use uma magia"),
    new Conquista("Mestre da magia", "Use 10 magias"),
    new Conquista("Estilista", "Mude a skin do quadrado 1 vez"),
    new Conquista("Fashionista", "Mude a skin do quadrado 10 vezes"),
    new Conquista("Aluno", "Responda 1 pergunta do quiz de matemática"),
    new Conquista("Bom aluno", "Responda 10 perguntas do quiz de matemática"),
    new Conquista("Gênio da matemática", "Responda 50 perguntas do quiz de matemática")
];


let click = (base + (cur.n * cur.a) + (pro.n * pro.a) + (mat.n * mat.a) + (qua.n * qua.a) + (qua.n * qua.a)) * a_pd1;

//variáveis

//principais funções

function salvarDados() {
    const estado = {
        quadrados,
        quadradosTotais,
        base,
        cur,
        pro,
        mat,
        qua,
        fab,
        melhorias,
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
        cur = estado.cur;
        pro = estado.pro;
        mat = estado.mat;
        qua = estado.mat;
        fab = estado.fab;
        melhorias = estado.melhorias;
        melhoriasTri = estado.melhoriasTri;
        tri = estado.tri;
        triangulos = estado.triangulos;
        a_pd1 = estado.a_pd1;
        mana = estado.mana;
        nclicks = estado.nclicks;
        magiaselecionada = estado.magiaselecionada;
        usoumultiplicus = estado.usoumultiplicus;
        perguntaescolhida = estado.perguntaescolhida;
        conquistasObtidas = estado.conquistasObtidas;
        renasceu = estado.renasceu;
        quadrados_ascendentes = estado.quadrados_ascendentes;
        valorParaGanhar1QuadradoAscendente = estado.valorParaGanhar1QuadradoAscendente;
    }

    for (let categoria in melhorias) {
        for (let melhoria in melhorias[categoria]) {
            if (melhorias[categoria][melhoria]) {
                const td = document.querySelector(`[data-melhoria="${melhoria}"]`);
                if (td) {
                    td.style.backgroundColor = "#f88c5d";
                }
            }
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
        cur,
        pro,
        mat,
        qua,
        fab,
        melhorias,
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
                    
                    cur = dadosCarregados.cur;
                    pro = dadosCarregados.pro;
                    mat = dadosCarregados.mat;
                    qua = dadosCarregados.mat;
                    fab = dadosCarregados.fab;

                    melhorias = dadosCarregados.melhorias;
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

                    for (let categoria in melhorias) {
                        for (let melhoria in melhorias[categoria]) {
                            if (melhorias[categoria][melhoria]) {
                                const td = document.querySelector(`[data-melhoria="${melhoria}"]`);
                                if (td) {
                                    td.style.backgroundColor = "#f88c5d";
                                }
                            }
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
        "mi"    , "bi"    , "t"      , "Qa"    , "Qi"    , "Sx"    , "Sp"    , "Oc"    , "No"    , "De"  ,
        "UnDe"  , "DuDe"  , "TreDe"  , "QaDe"  , "QiDe"  , "SxDe"  , "SpDe"  , "OcDe"  , "NoDe"  , "Vi"  ,
        "UnVi"  , "DuVi"  , "TreVi"  , "QaVi"  , "QiVi"  , "SxVi"  , "SpVi"  , "OcVi"  , "NoVi"  , "Tre" ,
        "UnTre" , "DuTre" , "TreTre" , "QaTre" , "QiTre" , "SxTre" , "SpTre" , "OcTre" , "NoTre" , "Quat",
        "UnQuat", "DuQuat", "TreQuat", "QaQuat", "QiQuat", "SxQuat", "SpQuat", "OcQuat", "NoQuat", "Quit",
        "UnQuit", "DuQuit", "TreQuit", "QaQuit", "QiQuit", "SxQuit", "SpQuit", "OcQuit", "NoQuit", "Sexa",
        "UnSexa", "DuSexa", "TreSexa", "QaSexa", "QiSexa", "SxSexa", "SpSexa", "OcSexa", "NoSexa", "Sept",
        "UnSept", "DuSept", "TreSept", "QaSept", "QiSept", "SxSept", "SpSept", "OcSept", "NoSept", "Octa",
        "UnOcta", "DuOcta", "TreOcta", "QaOcta", "QiOcta", "SxOcta", "SpOcta", "OcOcta", "NoOcta", "Nove",
        "UnNove", "DuNove", "TreNove", "QaNove", "QiNove", "SxNove", "SpNove", "OcNove", "NoNove", "Ce"
    ];

    let i = 0;

    while (numero >= 1000 && i < sufixos.length - 1) {
        numero /= 1000;
        i++;
    }

    return numero === 0 ? 0 : (numero <= 10e303 ? arredondar(2, numero) : "Você ta de hack, só pode") + sufixos[i];
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
    verificarMana();
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

    let nCurText = document.getElementById("nCur");
    let nProText = document.getElementById("nPro");
    let nMatText = document.getElementById("nMat");
    let nQuaText = document.getElementById("nQua");
    let nFabText = document.getElementById("nFab");
    nCurText.innerText = cur.n;
    nProText.innerText = pro.n;
    nMatText.innerText = mat.n;
    nQuaText.innerText = qua.n;
    nFabText.innerText = fab.n;

    let vCurText = document.getElementById("vCur");
    let vProText = document.getElementById("vPro");
    let vMatText = document.getElementById("vMat");
    let vQuaText = document.getElementById("vQua");
    let vFabText = document.getElementById("vFab");
    vCurText.innerText = "Preço: " + formatar(cur.v);
    vProText.innerText = "Preço: " + formatar(pro.v);
    vMatText.innerText = "Preço: " + formatar(mat.v);
    vQuaText.innerText = "Preço: " + formatar(qua.v);
    vFabText.innerText = "Preço: " + formatar(fab.v);

    let aCurText = document.getElementById("aCur");
    let aProText = document.getElementById("aPro");
    let aMatText = document.getElementById("aMat");
    let aQuaText = document.getElementById("aQua");
    let aFabText = document.getElementById("aFab");
    aCurText.innerText = "Aumento: " + formatar(cur.a);
    aProText.innerText = "Aumento: " + formatar(pro.a);
    aMatText.innerText = "Aumento: " + formatar(mat.a);
    aQuaText.innerText = "Aumento: " + formatar(qua.a);
    aFabText.innerText = "Aumento: " + formatar(fab.a);

    let quadrados_ascendentesText = document.getElementById("quadrados-ascendentes");
    quadrados_ascendentesText.innerText = "Você possui " + quadrados_ascendentes + " quadrados ascendentes";
    let quadrados_ascendentesFaltantesText = document.getElementById("quadrados-ascendentes-faltantes");
    quadrados_ascendentesFaltantesText.innerText = "Consiga " + formatar(valorParaGanhar1QuadradoAscendente) + " quadrados para o proximo quadrado ascendente";

    let manaText = document.getElementById("mana");
    manaText.innerText = "Mana: " + mana;

    click = (base + (cur.n * cur.a) + (pro.n * pro.a) + (mat.n * mat.a) + (qua.n * qua.a) + (qua.n * qua.a)) * a_pd1;

    if (renasceu === true) {
        click = (base + (cur.n * cur.a) + (pro.n * pro.a) + (mat.n * mat.a) + (qua.n * qua.a) + (qua.n * qua.a)) * a_pd1 * (1 + quadrados_ascendentes/10);
    }
    
    let quadradosporclickText = document.getElementById("quadradosporclickText")
    quadradosporclickText.innerText = "Quadrados por click: " + formatar(click)
}

function arredondar(casasDecimais, variavel) {
    return variavel = Math.round(variavel * 10**casasDecimais) / 10**casasDecimais;
}

function renascer() {
    if (quadrados_ascendentes >= 1) {
        renasceu = true

        quadrados = 0
        base = 1

        for (let categoria in melhorias) {
            for (let chave in melhorias[categoria]) {
                melhorias[categoria][chave] = false;
            }
        }

        for (let pegoutri in tri) {
            tri[pegoutri] = false
        }

        let celulas = document.querySelectorAll('#melhorias td');

        celulas.forEach(function(celula) {
            celula.style.backgroundColor = "#d4c4bd";
        });

        document.getElementById("renascer").style.backgroundColor = "#e0f7fa"
        alterar()
        mudarMain()
    } else if (quadrados_ascendentes < 1) {
        let consiga1quadradoText = document.getElementById("consiga1quadrado")
        consiga1quadradoText.innerText = "Consiga pelo menos 1 quadrado ascendente para renascer"
    }

}

function adicionarConquistas() {
    let listaConquistas = document.getElementById("lista-conquistas");
    listaConquistas.innerHTML = "";

    for (let conquista in conquistasDescricao) {
        let div = document.createElement("div");
        div.className = conquistasObtidas[conquista] ? "conquista-ativa col-3" : "conquista-inativa col-3";
        
        let titulo = document.createElement("h3");
        titulo.textContent = conquista;
        
        let descricao = document.createElement("p");
        descricao.textContent = conquistasDescricao[conquista];
        
        div.appendChild(titulo);
        div.appendChild(descricao);
        listaConquistas.appendChild(div);
    }
}

function verificarConquistas(callback) {
    //Quadrados
    if (quadradosTotais >= 1e0) {
        conquistasObtidas["Primeiro click"] = true;
    }
    if (quadradosTotais >= 1e1) {
        conquistasObtidas["10 quadrados"] = true;
    }
    if (quadradosTotais >= 1e2) {
        conquistasObtidas["100 quadrados"] = true;
    }
    if (quadradosTotais >= 1e3) {
        conquistasObtidas["Milhar"] = true;
    }
    if (quadradosTotais >= 1e4) {
        conquistasObtidas["10000 quadrados"] = true;
    }
    if (quadradosTotais >= 1e5) {
        conquistasObtidas["10^5"] = true;
    }
    if (quadradosTotais >= 1e6) {
        conquistasObtidas["Milhão"] = true;
    }
    if (quadradosTotais >= 1e9) {
        conquistasObtidas["Um numero um pouco maior"] = true;
    }
    if (quadradosTotais >= 1e12) {
        conquistasObtidas["O grande t"] = true;
    }
    if (quadradosTotais >= 1e15) {
        conquistasObtidas["Qa-drados"] = true;
    }
    if (quadradosTotais >= 1e18) {
        conquistasObtidas["Ainda pode ficar maior"] = true;
    }
    if (quadradosTotais >= 1e21) {
        conquistasObtidas["É sextilhão, não sexta"] = true;
    }
    if (quadradosTotais >= 1e24) {
        conquistasObtidas["Não consegui pensar num nome legal"] = true;
    }
    if (quadradosTotais >= 1e27) {
        conquistasObtidas["Você acha esse número grande?"] = true;
    }
    if (quadradosTotais >= 1e30) {
        conquistasObtidas["Império de quadrados"] = true;
    }
    if (quadradosTotais >= 1e33) {
        conquistasObtidas["Você chegou ao 10-lhão"] = true;
    }
    
    
    callback()
}

function verificarQuadradosAscendentes() {
    if (quadrados >= valorParaGanhar1QuadradoAscendente) {
        quadrados_ascendentes++;
        valorParaGanhar1QuadradoAscendente = Math.round(valorParaGanhar1QuadradoAscendente * 1.05)
    }
}

function mudarMenu(menu) {
    switch(menu) {
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
    if (valorAposta.trim() === '' || isNaN(valorAposta) || Number(valorAposta) <= 0) {
        let TextoEmergencia = document.getElementById("textoEmergenciamaquina")
        TextoEmergencia.innerText = "Insira um valor válido"
    } else {
        let TextoEmergencia = document.getElementById("textoEmergenciamaquina")
        TextoEmergencia.innerText = ""

        //aposta
        if (valorAposta <= quadrados) {
            let resultadoAposta = Math.random()
            if (resultadoAposta <= 0.5) {
                quadrados += Number(valorAposta);
                quadradosTotais += Number(valorAposta);
                let resultadoText = document.getElementById("resultado-maquina")
                resultadoText.innerText = "Ganhou"
            } else if (resultadoAposta > 0.5) {
                quadrados -= valorAposta
                let resultadoText = document.getElementById("resultado-maquina")
                resultadoText.innerText = "Perdeu"
            }
        } else if (valorAposta > quadrados) {
            let TextoEmergencia = document.getElementById("textoEmergencia")
            TextoEmergencia.innerText = "Insira um valor menor ou igual que seus quadrados"
        }
    }

    alterar()
};

function usarmagias() {
    let textomenssagens = document.getElementById("textoEmergencialivro")
    if (!magiaselecionada) {
        textomenssagens.innerText = "Selecione um poder"
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
        } else if (mana < 3) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        }
    } else if (magiaselecionada === "Quadramentio") {
        if (mana >= 3) {
            mana -= 3
            quadrados *= 1.25
            quadradosTotais += quadrados * 0.25
            textomenssagens.innerText = "Mais 25% de quadrados"
        } else if (mana <3) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        }
    } else if (magiaselecionada === "Trianglusio") {
        if (mana >= 2) {
            mana -= 2
            let numeroRandom = Math.random()
            if (numeroRandom <= 0.05) {
                triangulos++
                textomenssagens.innerText = "Você ganhou 1 triangulo"
            } else {
                textomenssagens.innerText = "Mais sorte na próxima vez"
            }
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
        } else if (mana < 10) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        } else if (usoumultiplicus === true) {
            textomenssagens.innerText = "Essa mágia só pode ser usada uma vez por renascimento"
        }
    }

    alterar()
}

function verificarMana() {
    if (nclicks >= 1000) {
        nclicks = 0;
        mana++
        if (mana >= 10) {
            mana = 10;
        }
    }
}

function mostrarFeitico(id) {
    const feiticos = {
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
            descricao: "Essa magia tem uma chance muito baixa de gerar um triangulo",
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
    } else if(tipo === "tipoborda") {
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

function comprarConstrucao(construcao) {
    if (construcao === "cur") {
        if (quadrados >= cur.v) {
            cur.n++;
            quadrados -= cur.v;
            cur.v = arredondar(0,100 * (1.15 ** cur.n));
        }
    } else if (construcao === "pro") {
        if (quadrados >= pro.v){
            pro.n++;
            quadrados -= pro.v;
            pro.v = arredondar(0,5_000* (1.15 ** pro.n));
        }  
    } else if (construcao === "mat") {
        if (quadrados >= mat.v) {
            mat.n++
            quadrados -= mat.v;
            mat.v = arredondar(0,130_000* (1.15 ** mat.n));
        }
    } else if (construcao === "qua") {
        if (quadrados >= qua.v) {
            qua.n++;
            quadrados -= qua.v;
            qua.v = arredondar(0,9_000_000* (1.15 ** qua.n));
        }
    } else if (construcao === "fab") {
        if (quadrados >= fab.v) {
            fab.n++;
            quadrados -= fab.v;
            fab.v = arredondar(0,650_000_000* (1.15 ** fab.n));
        }  
    }

    alterar()
}

function comprarMelhorias(melhoria, evento) {
    // Clique Duplo
    if (melhoria === "Clique duplo" && melhorias.Bas.b1 === false && quadrados >= 70) {
        melhorias.Bas.b1 = true;
        quadrados -= 70;
        base *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";   
    }
    // Super Clique
    if (melhoria === "Super clique" && melhorias.Bas.b2 === false && quadrados >= 300000) {
        melhorias.Bas.b2 = true;
        quadrados -= 500000;
        base *= 900;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Mega Clique
    if (melhoria === "Mega clique" && melhorias.Bas.b3 === false && quadrados >= 20000000) {
        melhorias.Bas.b3 = true;
        quadrados -= 40000000;
        base *= 100;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Cursores Duplos
    if (melhoria === "Cursores duplos" && melhorias.Cur.c1 === false && quadrados >= 750) {
        melhorias.Cur.c1 = true;
        quadrados -= 750;
        cur.a *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Múltiplos Cursores
    if (melhoria === "Multiplos cursores" && melhorias.Cur.c2 === false && quadrados >= 75000) {
        melhorias.Cur.c2 = true;
        quadrados -= 100_000;
        cur.a *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Cursores
    if (melhoria === "Super cursores" && melhorias.Cur.c3 === false && quadrados >= 10000000) {
        melhorias.Cur.c3 = true;
        quadrados -= 30_000_000;
        cur.a *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Professores Duplos
    if (melhoria === "Professores duplos" && melhorias.Pro.p1 === false && quadrados >= 25000) {
        melhorias.Pro.p1 = true;
        quadrados -= 25_000;
        pro.a *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Escola
    if (melhoria === "Escola" && melhorias.Pro.p2 === false && quadrados >= 600000) {
        melhorias.Pro.p2 = true;
        quadrados -= 1_800_000;
        pro.a *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Professores
    if (melhoria === "Super professores" && melhorias.Pro.p3 === false && quadrados >= 90000000) {
        melhorias.Pro.p3 = true;
        quadrados -= 180_000_000;
        pro.a *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Matemática Dupla
    if (melhoria === "Matematica dupla" && melhorias.Mat.m1 === false && quadrados >= 600000) {
        melhorias.Mat.m1 = true;
        quadrados -= 600_000;
        mat.a *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Conjunto de Matemáticos
    if (melhoria === "Conjunto de matematicos" && melhorias.Mat.m2 === false && quadrados >= 20000000) {
        melhorias.Mat.m2 = true;
        quadrados -= 80_000_000;
        mat.a *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Matemáticos
    if (melhoria === "Super matematicos" && melhorias.Mat.m3 === false && quadrados >= 100000000) {
        melhorias.Mat.m3 = true;
        quadrados -= 1_00_000_000;
        mat.a *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Dois Quadros
    if (melhoria === "Dois quadros" && melhorias.Qua.q1 === false && quadrados >= 30000000) {
        melhorias.Qua.q1 = true;
        quadrados -= 30_000_000;
        qua.a *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Quadrão
    if (melhoria === "Quadrão" && melhorias.Qua.q2 === false && quadrados >= 75000000) {
        melhorias.Qua.q2 = true;
        quadrados -= 200_000_000;
        qua.a *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Quadros Poderosos
    if (melhoria === "Quadros poderosos" && melhorias.Qua.q3 === false && quadrados >= 300000000) {
        melhorias.Qua.q3 = true;
        quadrados -= 10_000_000_000;
        qua.a *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Duas Fábricas
    if (melhoria === "Duas fabricas" && melhorias.Fab.f1 === false && quadrados >= 2500000000) {
        melhorias.Fab.f1 = true;
        quadrados -= 2_500_000_000;
        fab.a *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Começo da Revolução
    if (melhoria === "Começo da revolução" && melhorias.Fab.f2 === false && quadrados >= 5000000000) {
        melhorias.Fab.f2 = true;
        quadrados -= 15_000_000_000;
        fab.a *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Fábricas
    if (melhoria === "Super fabricas" && melhorias.Fab.f3 === false && quadrados >= 100000000000) {
        melhorias.Fab.f3 = true;
        quadrados -= 1_000_000_000_000;
        fab.a *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    alterar();
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
        cur.a *= 2
        pro.a *= 2
        mat.a *= 2
        qua.a *= 2
        fab.a *= 2
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

//compras

