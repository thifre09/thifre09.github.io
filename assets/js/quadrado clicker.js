//variaveis

let quadrados = 0;
let base = 1;

let nCur = 0;
let nPro = 0;
let nMat = 0;
let nQua = 0;
let nFab = 0;

let vCur = 100;
let vPro = 5000;
let vMat = 130000;
let vQua = 9000000;
let vFab = 650000000;

let aCur = 1;
let aPro = 10;
let aMat = 50;
let aQua = 750;
let aFab = 15000;

let melhorias = {
    Bas: {b1: false, b2: false, b3: false},
    Cur: {c1: false, c2: false, c3: false},
    Pro: {p1: false, p2: false, p3: false},
    Mat: {m1: false, m2: false, m3: false},
    Qua: {q1: false, q2: false, q3: false},
    Fab: {f1: false, f2: false, f3: false}
}

let melhoriasTri = {
    pd1: false,
    cc1: false,
    cm1: false,
    sp1: false,
    ms1: false,
    lm1: false,
    qm1: false,
    sq1: false
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
let triangulos = 0;
let a_pd1 = 1

let mana = 10;
let nclicks = 0;
let magiaselecionada = null;
let usoumultiplicus = false;

let perguntaescolhida = null
let perguntas = [
    "Quanto é 1+1?",
    "Quanto é 5-3?",
    "Quanto é 5x5?",
    "Quanto é 36/6?",
    "Quanto é 4²?",
    "Quais são os 3 primeiros dígitos de π?",
    "Quanto é 335-229?",
    "Quanto é 542+6534?",
    "Quanto vale a área de um quadrado com lado = 3?",
    "Qual é a área de um triângulo com base = 5 e altura = 6?",
    "Quanto é 2x3+7/1-5?",
    "Quanto é 5x2,5?",
    "Quanto é 550-1000?",
    "Quanto é 5³?",
    "Qual é o nome do número que é 1^100?",
    "Quantos subconjuntos do conjunto {1,2,3,...,30} têm a propriedade de que a soma dos elementos do subconjunto é divisível por 5?",
    "Qual é o nome da forma geométrica que possui 3 lados?",
    "Qual é o nome do número que é 10^googol?",
    "Qual é a circunferência de um círculo que possui raio = 8,4 e π = 3?",
    "Esse jogo é legal?",
    "Resolva a equação para x no conjunto dos números reais: x³-6x²+11x-6=0",
    "Quanto é 9 + 10?",
    "Qual é a soma dos ângulos internos de um triângulo?",
    "Qual é o resultado de 100 ÷ 25?",
    "Quanto é a raiz quadrada de 81?",
    "Quanto é 50% de 200?",
    "Quanto é 10³?",
    "Quanto é a raiz cúbica de 27?",
    "Qual é a soma dos ângulos internos de um quadrado?",
    "Qual é o valor do logaritmo de 100 na base 10?",
    "Qual é o seno de 30 graus?",
    "Qual é a tangente de 45 graus?"
];
let opçoes = [
    ["2", "3", "4", "1"], // Quanto é 1+1?
    ["2", "3", "5", "1"], // Quanto é 5-3?
    ["25", "20", "15", "30"], // Quanto é 5x5?
    ["6", "7", "8", "9"], // Quanto é 36/6?
    ["16", "8", "4", "12"], // Quanto é 4²?
    ["3.14", "3.15", "3.13", "3.12"], // Quais são os 3 primeiros dígitos de π?
    ["106", "110", "105", "100"], // Quanto é 335-229?
    ["7076", "7074", "7067", "7066"], // Quanto é 542+6534?
    ["9", "6", "3", "12"], // Quanto vale a área de um quadrado com lado = 3?
    ["15", "10", "20", "12"], // Qual é a área de um triângulo com base = 5 e altura = 6?
    ["8", "11", "13", "9"], // Quanto é 2x3+7/1-5?
    ["12.5", "13", "14", "11.5"], // Quanto é 5x2,5?
    ["-450", "-400", "-500", "-550"], // Quanto é 550-1000?
    ["125", "150", "25", "100"], // Quanto é 5³?
    ["um", "googolplex", "googol", "número um"], // Qual é o nome do número que é 1^100?
    ["59049", "90000", "60503", "59050"], // Quantos subconjuntos têm soma divisível por 5?
    ["Triângulo", "Quadrado", "Retângulo", "Círculo"], // Qual é a forma geométrica de 3 lados?
    ["googolplex", "googol", "milhão", "trilhão"], // Qual é o número 10^googol?
    ["50.4", "48", "52", "45.6"], // Qual é a circunferência do círculo com raio 8.4 e π = 3?
    ["sim", "não", "talvez", "depende"], // Esse jogo é legal?
    ["1, 2 e 3", "1 e 3", "1, 3 e 6", "2, 3 e 6"], // Resolva x³-6x²+11x-6=0
    ["19", "21", "18", "20"], // Quanto é 9 + 10?
    ["180", "360", "90", "120"], // Qual é a soma dos ângulos internos de um triângulo?
    ["4", "5", "2", "6"], // Qual é o resultado de 100 ÷ 25?
    ["9", "6", "8", "7"], // Quanto é a raiz quadrada de 81?
    ["100", "50", "25", "200"], // Quanto é 50% de 200?
    ["1000", "100", "10", "10000"], // Quanto é 10³?
    ["3", "9", "27", "1"], // Quanto é a raiz cúbica de 27?
    ["360", "180", "90", "720"], // Qual é a soma dos ângulos internos de um quadrado?
    ["2", "0", "1", "100"], // Qual é o logaritmo de 100 na base 10?
    ["0.5", "0.707", "1", "0"], // Qual é o seno de 30 graus?
    ["1", "0", "0.707", "1.5"] // Qual é a tangente de 45 graus?
];
let respostasCorretas = [
    "2", // Quanto é 1+1?
    "2", // Quanto é 5-3?
    "25", // Quanto é 5x5?
    "6", // Quanto é 36/6?
    "16", // Quanto é 4²?
    "3.14", // Quais são os 3 primeiros dígitos de π?
    "106", // Quanto é 335-229?
    "7076", // Quanto é 542+6534?
    "9", // Quanto vale a área de um quadrado com lado = 3?
    "15", // Qual é a área de um triângulo com base = 5 e altura = 6?
    "9", // Quanto é 2x3+7/1-5?
    "12.5", // Quanto é 5x2,5?
    "-450", // Quanto é 550-1000?
    "125", // Quanto é 5³?
    "um", // Qual é o nome do número que é 1^100?
    "59049", // Quantos subconjuntos do conjunto {1,2,3,...,30} têm soma divisível por 5?
    "Triângulo", // Qual é o nome da forma geométrica que possui 3 lados?
    "googolplex", // Qual é o nome do número que é 10^googol?
    "50.4", // Qual é a circunferência de um círculo com raio = 8,4 e π = 3?
    "sim", // Esse jogo é legal? Digite sim ou não
    "1, 2 e 3", // Resolva x³-6x²+11x-6=0
    "19", // Quanto é 9 + 10?
    "180", // Qual é a soma dos ângulos internos de um triângulo?
    "4", // Qual é o resultado de 100 ÷ 25?
    "9", // Quanto é a raiz quadrada de 81?
    "100", // Quanto é 50% de 200?
    "1000", // Quanto é 10³?
    "3", // Quanto é a raiz cúbica de 27?
    "360", // Qual é a soma dos ângulos internos de um quadrado?
    "2", // Qual é o valor do logaritmo de 100 na base 10?
    "0.5", // Qual é o seno de 30 graus?
    "1" // Qual é a tangente de 45 graus?
];

let renasceu = false;
let quadrados_ascendentes = 0;
let valorParaGanhar1QuadradoAscendente = 100000000;

let click = (base + (nCur * aCur) + (nPro *aPro) + (nMat *aMat) + (nQua * aQua) + (nFab * aFab)) * a_pd1;

if (renasceu === true) {
    click = (base + (nCur * aCur) + (nPro *aPro) + (nMat *aMat) + (nQua * aQua) + (nFab * aFab)) * a_pd1 * (1 + quadrados_ascendentes/10);
}

//variaveis

//principais funções

function salvarDados() {
    const estado = {
        quadrados,
        base,
        nCur, nPro, nMat, nQua, nFab,
        vCur, vPro, vMat, vQua, vFab,
        aCur, aPro, aMat, aQua, aFab,
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
        base = estado.base;
        nCur = estado.nCur;
        nPro = estado.nPro;
        nMat = estado.nMat;
        nQua = estado.nQua;
        nFab = estado.nFab;
        vCur = estado.vCur;
        vPro = estado.vPro;
        vMat = estado.vMat;
        vQua = estado.vQua;
        vFab = estado.vFab;
        aCur = estado.aCur;
        aPro = estado.aPro;
        aMat = estado.aMat;
        aQua = estado.aQua;
        aFab = estado.aFab;
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

    let celulapd1 = document.getElementById("pd1");
    let celulacc1 = document.getElementById("cc1");
    let celulacm1 = document.getElementById("cm1");
    let celulasp1 = document.getElementById("sp1");
    let celulams1 = document.getElementById("ms1");
    let botaoms1 = document.getElementById("maquinadasorte");
    let celulalm1 = document.getElementById("lm1");
    let botaolm1 = document.getElementById("livromagico");
    let celulaqm1 = document.getElementById("qm1");
    let botaoqm1 = document.getElementById("quizmatematico");
    let celulasq1 = document.getElementById("sq1");
    let botaosq1 = document.getElementById("skinquadrado");
    if (melhoriasTri.pd1) {
        celulapd1.style.backgroundColor = "#f88c5d";
    }
    if (melhoriasTri.cc1) {
        celulacc1.style.backgroundColor = "#f88c5d";
    }
    if (melhoriasTri.cm1) {
        celulacm1.style.backgroundColor = "#f88c5d";
    }
    if (melhoriasTri.sp1) {
        celulasp1.style.backgroundColor = "#f88c5d";
    }
    if (melhoriasTri.ms1) {
        celulams1.style.backgroundColor = "#f88c5d";
        botaoms1.style.display = "block";
    }
    if (melhoriasTri.lm1) {
        celulalm1.style.backgroundColor = "#f88c5d";
        botaolm1.style.display = "block";
    }
    if (melhoriasTri.qm1) {
        celulaqm1.style.backgroundColor = "#f88c5d";
        botaoqm1.style.display = "block";
    }
    if (melhoriasTri.sq1) {
        celulasq1.style.backgroundColor = "#f88c5d";
        botaosq1.style.display = "block";
    }
    
    
}

function salvarJson() {
    // Todas as variáveis do jogo
    const estadoJogo = {
        quadrados,
        base,
        nCur,
        nPro,
        nMat,
        nQua,
        nFab,
        vCur,
        vPro,
        vMat,
        vQua,
        vFab,
        aCur,
        aPro,
        aMat,
        aQua,
        aFab,
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
        perguntas,
        opçoes,
        respostasCorretas,
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
                    base = dadosCarregados.base;
                    nCur = dadosCarregados.nCur;
                    nPro = dadosCarregados.nPro;
                    nMat = dadosCarregados.nMat;
                    nQua = dadosCarregados.nQua;
                    nFab = dadosCarregados.nFab;

                    vCur = dadosCarregados.vCur;
                    vPro = dadosCarregados.vPro;
                    vMat = dadosCarregados.vMat;
                    vQua = dadosCarregados.vQua;
                    vFab = dadosCarregados.vFab;

                    aCur = dadosCarregados.aCur;
                    aPro = dadosCarregados.aPro;
                    aMat = dadosCarregados.aMat;
                    aQua = dadosCarregados.aQua;
                    aFab = dadosCarregados.aFab;

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
                    perguntas = dadosCarregados.perguntas;
                    opçoes = dadosCarregados.opçoes;
                    respostasCorretas = dadosCarregados.respostasCorretas;

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
                
                    let celulapd1 = document.getElementById("pd1");
                    let celulacc1 = document.getElementById("cc1");
                    let celulacm1 = document.getElementById("cm1");
                    let celulasp1 = document.getElementById("sp1");
                    let celulams1 = document.getElementById("ms1");
                    let botaoms1 = document.getElementById("maquinadasorte");
                    let celulalm1 = document.getElementById("lm1");
                    let botaolm1 = document.getElementById("livromagico");
                    let celulaqm1 = document.getElementById("qm1");
                    let botaoqm1 = document.getElementById("quizmatematico");
                    let celulasq1 = document.getElementById("sq1");
                    let botaosq1 = document.getElementById("skinquadrado");
                    if (melhoriasTri.pd1) {
                        celulapd1.style.backgroundColor = "#f88c5d";
                    }
                    if (melhoriasTri.cc1) {
                        celulacc1.style.backgroundColor = "#f88c5d";
                    }
                    if (melhoriasTri.cm1) {
                        celulacm1.style.backgroundColor = "#f88c5d";
                    }
                    if (melhoriasTri.sp1) {
                        celulasp1.style.backgroundColor = "#f88c5d";
                    }
                    if (melhoriasTri.ms1) {
                        celulams1.style.backgroundColor = "#f88c5d";
                        botaoms1.style.display = "block";
                    }
                    if (melhoriasTri.lm1) {
                        celulalm1.style.backgroundColor = "#f88c5d";
                        botaolm1.style.display = "block";
                    }
                    if (melhoriasTri.qm1) {
                        celulaqm1.style.backgroundColor = "#f88c5d";
                        botaoqm1.style.display = "block";
                    }
                    if (melhoriasTri.sq1) {
                        celulasq1.style.backgroundColor = "#f88c5d";
                        botaosq1.style.display = "block";
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
    if (numero >= 1 && numero < 1000) {
        return arredondar(2,numero)
    } else if (numero >= 1000 && numero < 1000000) {
        return arredondar(2,numero / 1000) + "k"
    } else if (numero >= 1000000 && numero < 1000000000) {
        return arredondar(2,numero / 1000000) + "mi"
    } else if (numero >= 1000000000 && numero < 1000000000000) {
        return arredondar(2,numero / 1000000000) + "bi"
    } else if (numero >= 1000000000000 && numero < 1000000000000000) {
        return arredondar(2,numero / 1000000000000) + "t"
    } else if (numero >= 1000000000000000 && numero < 1000000000000000000) {
        return arredondar(2,numero / 1000000000000000) + "Qa"
    } else if (numero >= 1000000000000000000 && numero < 1000000000000000000000) {
        return arredondar(2,numero / 1000000000000000000) + "Qi"
    } else if (numero === 0) {
        return 0
    } else {
        return "esse numero é muito grande"
    }
}

function clique() {
    if (window.innerWidth < 600) {
        quadrados += click;
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

    let nCurText = document.getElementById("nCur")
    let nProText = document.getElementById("nPro")
    let nMatText = document.getElementById("nMat")
    let nQuaText = document.getElementById("nQua")
    let nFabText = document.getElementById("nFab")
    nCurText.innerText = nCur
    nProText.innerText = nPro
    nMatText.innerText = nMat
    nQuaText.innerText = nQua
    nFabText.innerText = nFab

    let vCurText = document.getElementById("vCur")
    let vProText = document.getElementById("vPro")
    let vMatText = document.getElementById("vMat")
    let vQuaText = document.getElementById("vQua")
    let vFabText = document.getElementById("vFab")
    vCurText.innerText = "Preço: " + formatar(vCur)
    vProText.innerText = "Preço: " + formatar(vPro)
    vMatText.innerText = "Preço: " + formatar(vMat)
    vQuaText.innerText = "Preço: " + formatar(vQua)
    vFabText.innerText = "Preço: " + formatar(vFab)

    let aCurText = document.getElementById("aCur")
    let aProText = document.getElementById("aPro")
    let aMatText = document.getElementById("aMat")
    let aQuaText = document.getElementById("aQua")
    let aFabText = document.getElementById("aFab")
    aCurText.innerText = "Aumento: " + formatar(aCur)
    aProText.innerText = "Aumento: " + formatar(aPro)
    aMatText.innerText = "Aumento: " + formatar(aMat)
    aQuaText.innerText = "Aumento: " + formatar(aQua)
    aFabText.innerText = "Aumento: " + formatar(aFab)

    let quadrados_ascendentesText = document.getElementById("quadrados-ascendentes");
    quadrados_ascendentesText.innerText = "Você possui " + quadrados_ascendentes + " quadrados ascendentes"
    let quadrados_ascendentesFaltantesText = document.getElementById("quadrados-ascendentes-faltantes");
    quadrados_ascendentesFaltantesText.innerText = "Consiga " + formatar(valorParaGanhar1QuadradoAscendente) + " quadrados para o proximo quadrado ascendente"

    let manaText = document.getElementById("mana")
    manaText.innerText = "Mana: " + mana

    click = (base + (nCur * aCur) + (nPro *aPro) + (nMat *aMat) + (nQua * aQua) + (nFab * aFab)) * a_pd1;

    if (renasceu === true) {
        click = (base + (nCur * aCur) + (nPro *aPro) + (nMat *aMat) + (nQua * aQua) + (nFab * aFab)) * a_pd1 * (1 + quadrados_ascendentes/10);
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

        nCur = 0;
        nPro = 0;
        nMat = 0;
        nQua = 0;
        nFab = 0;
        aCur = 1;
        aPro = 10;
        aMat = 50;
        aQua = 500;
        aFab = 1000;
        vCur = 100;
        vPro = 5000;
        vMat = 130000;
        vQua = 9000000;
        vFab = 650000000;

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

function verificarQuadradosAscendentes() {
    if (quadrados >= valorParaGanhar1QuadradoAscendente) {
        quadrados_ascendentes++;
        valorParaGanhar1QuadradoAscendente = Math.round(valorParaGanhar1QuadradoAscendente * 1.05)
    }
}

//principais funções

//triangulos

function cliqueCritico() {
    if (melhoriasTri.cc1 === true && melhoriasTri.cm1 === false) {
        let valorRandom = Math.random()

        if (valorRandom <= 0.03) {
            quadrados += click * 4
        }
    } else if (melhoriasTri.cc1 === true && melhoriasTri.cm1 === true) {
        let valorRandom = Math.random()

        if (valorRandom <= 0.06) {
            quadrados += click * 9
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
            if (resultadoAposta < 0.5) {
                quadrados += Number(valorAposta)
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
                nCur++ 
                textomenssagens.innerText = "Você ganhou 1 cursor"
            } else if (numeroRandom <= 0.4) {
                nPro++
                textomenssagens.innerText = "Você ganhou 1 professor"
            } else if (numeroRandom <= 0.6) {
                nMat++
                textomenssagens.innerText = "Você ganhou 1 matemático"
            } else if (numeroRandom <= 0.8) {
                nQua++
                textomenssagens.innerText = "Você ganhou 1 quadro"
            } else if (numeroRandom <= 1) {
                nFab++
                textomenssagens.innerText = "Você ganhou 1 fabrica"
            }
        } else if (mana < 3) {
            textomenssagens.innerText = "Você não tem mana suficiente"
        }
    } else if (magiaselecionada === "Quadramentio") {
        if (mana >= 3) {
            mana -= 3
            quadrados *= 1.25
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
    perguntaescolhida = perguntas[Math.floor(Math.random() * perguntas.length)];
    document.getElementById("pergunta").innerText = perguntaescolhida;

    let opçao1 = document.getElementById("opção1");
    let opçao2 = document.getElementById("opção2");
    let opçao3 = document.getElementById("opção3");
    let opçao4 = document.getElementById("opção4");

    for (let i = 0; i < perguntas.length; i++) {
        if (perguntaescolhida === perguntas[i]) {
            opçao1.innerText = opçoes[i][0]
            opçao2.innerText = opçoes[i][1]
            opçao3.innerText = opçoes[i][2]
            opçao4.innerText = opçoes[i][3]
        }
    }
}

function verificarQuiz(numerobotao) {
    let acertou = null;
    let numeropergunta = null
    for (let i = 0; i < perguntas.length; i++) {
        if (perguntaescolhida === perguntas[i]) {
            numeropergunta = i;
        }         
    }
    if (numerobotao === 1) {
        if (opçoes[numeropergunta][0] === respostasCorretas[numeropergunta]) {
            acertou = true;
        } else {
            acertou = false;
        }
    } else if (numerobotao === 2) {
        if (opçoes[numeropergunta][1] === respostasCorretas[numeropergunta]) {
            acertou = true;
        } else {
            acertou = false;
        }
    } else if (numerobotao === 3) {
        if (opçoes[numeropergunta][2] === respostasCorretas[numeropergunta]) {
            acertou = true;
        } else {
            acertou = false;
        }
    } else if (numerobotao === 4) {
        if (opçoes[numeropergunta][3] === respostasCorretas[numeropergunta]) {
            acertou = true;
        } else {
            acertou = false;
        }
    }

    if (acertou === true) {
        quadrados *= 1.15;
    } else {
        quadrados *= 0.85;
    }  

    mudarMain();
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
    
//triangulos

// menus

function mudarMelhorias() {
    document.getElementById("esquerda").style.display = "none";
    document.getElementById("centro").style.display = "none";
    document.getElementById("direita").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

    document.getElementById("melhorias").style.display = "block";
}

function mudarAjuda() {
    document.getElementById("esquerda").style.display = "none";
    document.getElementById("centro").style.display = "none";
    document.getElementById("direita").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

    document.getElementById("ajuda").style.display = "block";
}

function mudarOutros() {
    document.getElementById("esquerda").style.display = "none";
    document.getElementById("centro").style.display = "none";
    document.getElementById("direita").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

    document.getElementById("outros").style.display = "block";
}

function mudarSalvamento() {
    document.getElementById("esquerda").style.display = "none";
    document.getElementById("centro").style.display = "none";
    document.getElementById("direita").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

    document.getElementById("salvar").style.display = "block";
}

function mudarTriângulos() {
    document.getElementById("outros").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

    document.getElementById("triangulos").style.display = "block";
}

function mudarRenascer() {
    document.getElementById("outros").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

    document.getElementById("renascer").style.display = "flex";
    document.getElementById("renascer").style.flexWrap = "wrap";
}

function confirmarRenascer() {
    document.getElementById("confirmarRenascer").style.display = "block";
    document.getElementById("renascer").style.backgroundColor = "#737575"
}

function mudarMaquinadasorte() {
    document.getElementById("outros").style.display = "none";
    document.getElementById("maquina-da-sorte").style.display = "flex";
}

function mudarLivromagico() {
    document.getElementById("outros").style.display = "none";
    document.getElementById("livro-magico").style.display = "flex";
}

function mudarQuizmatematico() {
    document.getElementById("outros").style.display = "none";
    document.getElementById("quiz-matematico").style.display = "flex";
}

function mudarSkinquadrado() {
    document.getElementById("outros").style.display = "none";
    document.getElementById("skin-quadrado").style.display = "block";
}

function mudarMain() {
    document.getElementById("esquerda").style.display = "block";
    document.getElementById("centro").style.display = "block";
    document.getElementById("direita").style.display = "block";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "block";
    }

    document.getElementById("melhorias").style.display = "none";
    document.getElementById("ajuda").style.display = "none";
    document.getElementById("outros").style.display = "none";
    document.getElementById("salvar").style.display = "none";
    document.getElementById("triangulos").style.display = "none";
    document.getElementById("renascer").style.display = "none";
    document.getElementById("confirmarRenascer").style.display = "none";
    document.getElementById("maquina-da-sorte").style.display = "none";
    document.getElementById("livro-magico").style.display = "none";
    document.getElementById("quiz-matematico").style.display = "none";
    document.getElementById("skin-quadrado").style.display = "none";
    document.getElementById("renascer").style.backgroundColor = "#e0f7fa";
    let consiga1quadradoText = document.getElementById("consiga1quadrado");
    consiga1quadradoText.innerText = "";
}

//menus

//compras

function comprarCur() {
    if (quadrados >= vCur) {
        nCur++
        quadrados -= vCur
        vCur *= 1.1
        vCur = arredondar(0,vCur)
        alterar()
    }
}

function comprarPro() {
    if (quadrados >= vPro) {
        nPro++
        quadrados -= vPro
        vPro *= 1.1
        vPro = arredondar(0,vPro)
        alterar()
    }
}

function comprarMat() {
    if (quadrados >= vMat) {
        nMat++
        quadrados -= vMat
        vMat *= 1.1
        vMat = arredondar(0, vMat)
        alterar()
    }
}

function comprarQua() {
    if (quadrados >= vQua) {
        nQua++
        quadrados -= vQua
        vQua *= 1.1
        vQua = arredondar(0, vQua)
        alterar()
    }
}

function comprarFab() {
    if (quadrados >= vFab) {
        nFab++
        quadrados -= vFab
        vFab *= 1.1
        vFab = arredondar(0, vFab)
        alterar()
    }
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
        base *= 300;
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
        aCur *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Múltiplos Cursores
    if (melhoria === "Multiplos cursores" && melhorias.Cur.c2 === false && quadrados >= 75000) {
        melhorias.Cur.c2 = true;
        quadrados -= 100_000;
        aCur *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Cursores
    if (melhoria === "Super cursores" && melhorias.Cur.c3 === false && quadrados >= 10000000) {
        melhorias.Cur.c3 = true;
        quadrados -= 30_000_000;
        aCur *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Professores Duplos
    if (melhoria === "Professores duplos" && melhorias.Pro.p1 === false && quadrados >= 25000) {
        melhorias.Pro.p1 = true;
        quadrados -= 25_000;
        aPro *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Escola
    if (melhoria === "Escola" && melhorias.Pro.p2 === false && quadrados >= 600000) {
        melhorias.Pro.p2 = true;
        quadrados -= 1_800_000;
        aPro *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Professores
    if (melhoria === "Super professores" && melhorias.Pro.p3 === false && quadrados >= 90000000) {
        melhorias.Pro.p3 = true;
        quadrados -= 180_000_000;
        aPro *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Matemática Dupla
    if (melhoria === "Matematica dupla" && melhorias.Mat.m1 === false && quadrados >= 600000) {
        melhorias.Mat.m1 = true;
        quadrados -= 600_000;
        aMat *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Conjunto de Matemáticos
    if (melhoria === "Conjunto de matematicos" && melhorias.Mat.m2 === false && quadrados >= 20000000) {
        melhorias.Mat.m2 = true;
        quadrados -= 80_000_000;
        aMat *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Matemáticos
    if (melhoria === "Super matematicos" && melhorias.Mat.m3 === false && quadrados >= 100000000) {
        melhorias.Mat.m3 = true;
        quadrados -= 1_00_000_000;
        aMat *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Dois Quadros
    if (melhoria === "Dois quadros" && melhorias.Qua.q1 === false && quadrados >= 30000000) {
        melhorias.Qua.q1 = true;
        quadrados -= 30_000_000;
        aQua *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Quadrão
    if (melhoria === "Quadrão" && melhorias.Qua.q2 === false && quadrados >= 75000000) {
        melhorias.Qua.q2 = true;
        quadrados -= 200_000_000;
        aQua *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Quadros Poderosos
    if (melhoria === "Quadros poderosos" && melhorias.Qua.q3 === false && quadrados >= 300000000) {
        melhorias.Qua.q3 = true;
        quadrados -= 10_000_000_000;
        aQua *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Duas Fábricas
    if (melhoria === "Duas fabricas" && melhorias.Fab.f1 === false && quadrados >= 2500000000) {
        melhorias.Fab.f1 = true;
        quadrados -= 2_500_000_000;
        aFab *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Começo da Revolução
    if (melhoria === "Começo da revolução" && melhorias.Fab.f2 === false && quadrados >= 5000000000) {
        melhorias.Fab.f2 = true;
        quadrados -= 15_000_000_000;
        aFab *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Fábricas
    if (melhoria === "Super fabricas" && melhorias.Fab.f3 === false && quadrados >= 100000000000) {
        melhorias.Fab.f3 = true;
        quadrados -= 1_000_000_000_000;
        aFab *= 20;
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
        aCur *= 2
        aPro *= 2
        aMat *= 2
        aQua *= 2
        aFab *= 2
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Maquina da sorte' && melhoriasTri.ms1 === false && triangulos >= 3) {
        melhoriasTri.ms1 = true;
        triangulos -= 3
        document.getElementById("maquinadasorte").style.display = "block"
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Livro magico' && melhoriasTri.lm1 === false && triangulos >= 3) {
        melhoriasTri.lm1 = true;
        triangulos -= 3;
        document.getElementById("livromagico").style.display = "block";
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Quiz matemático' && melhoriasTri.qm1 === false && triangulos >= 3) {
        melhoriasTri.qm1 = true;
        triangulos -= 3
        document.getElementById("quizmatematico").style.display = "block"
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Skin quadrado' && melhoriasTri.sq1 === false && triangulos >= 1) {
        melhoriasTri.sq1 = true;
        triangulos -= 1;
        document.getElementById("skinquadrado")
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
        document.getElementById("skinquadrado").style.display = "block";
    }

    alterar()
}

//compras


window.addEventListener("beforeunload", salvarDados);
window.addEventListener("load", carregarDados);