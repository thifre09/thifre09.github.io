import * as Auth from "../supabase/auth.js";
import { supabase } from "../supabase/client.js";

// #region Change navbar

const buttonChangeToGame = document.getElementById("button-header-game")!;
const buttonChangeToOthers = document.getElementById("button-header-others")!;
const buttonChangeToSave = document.getElementById("button-header-save")!;
const buttonChangeToHelp = document.getElementById("button-header-help")!;
const navBar = document.getElementById("nav-bar")!;

/**
 * Atualiza a posição e a largura do indicador da interface ativa.
 * @param activeButton - Botão atualmente selecionado.
 */
function updateNavBarIndicator(activeButton: HTMLElement) {
    const left = activeButton.offsetLeft;
    const width = activeButton.offsetWidth;
    navBar.style.setProperty("--indicator-left", `${left}px`);
    navBar.style.setProperty("--indicator-width", `${width}px`);
}

/**
 * Troca a interface visível no painel (gráfica, terminal, logical, save ou help).
 * @param id - Identificador da interface a ser exibida.
 */
function changeTo(id: "game" | "others" | "save" | "help") {
    document.getElementById("game")!.style.display = "none";
    document.getElementById("others")!.style.display = "none";
    document.getElementById("save")!.style.display = "none";
    document.getElementById("help")!.style.display = "none";
    document.getElementById(id)!.style.display = "flex";
    document.querySelector(".nav-bar-ativo")?.classList.remove("nav-bar-ativo");
    switch (id) {
        case "game":
            buttonChangeToGame.classList.add("nav-bar-ativo");
            updateNavBarIndicator(buttonChangeToGame);
            break;
        case "others":
            buttonChangeToOthers.classList.add("nav-bar-ativo");
            updateNavBarIndicator(buttonChangeToOthers);
            break;
        case "save":
            buttonChangeToSave.classList.add("nav-bar-ativo");
            updateNavBarIndicator(buttonChangeToSave);
            break;
        case "help":
            buttonChangeToHelp.classList.add("nav-bar-ativo");
            updateNavBarIndicator(buttonChangeToHelp);
            break;
    }
}



buttonChangeToGame.addEventListener("click", () => {
    changeTo("game");
});

buttonChangeToOthers.addEventListener("click", () => {
    changeTo("others");
});

buttonChangeToSave.addEventListener("click", () => {
    changeTo("save");
});

buttonChangeToHelp.addEventListener("click", () => {
    changeTo("help");
});

// #endregion

// #region classes

class Gerador {
    static PRICE_MULTIPLIER = 1.15;
    name: string;
    basePrice: number;
    production: number;
    quantity: number;

    constructor(name: string, basePrice: number, production: number) {
        this.name = name;
        this.basePrice = basePrice;
        this.production = production;
        this.quantity = 0;
    }

    createHTML(): HTMLElement {
        const container = document.createElement("div");
        container.classList.add("gerador");
        container.addEventListener("click", () => this.buy());

        const divTexts = document.createElement("div");
        divTexts.classList.add("gerador-texts");
        container.appendChild(divTexts);

        const divAmount = document.createElement("div");
        divAmount.classList.add("gerador-amount");
        divAmount.textContent = this.quantity.toString();
        container.appendChild(divAmount);

        const h2Name = document.createElement("h2");
        h2Name.textContent = this.name;
        divTexts.appendChild(h2Name);

        const divPriceProduction = document.createElement("div");
        divPriceProduction.classList.add("gerador-price-production");
        divTexts.appendChild(divPriceProduction);

        const pPrice = document.createElement("p");
        pPrice.textContent = "Preço: " + formatNumber(this.price);
        divPriceProduction.appendChild(pPrice);

        const pProduction = document.createElement("p");
        pProduction.textContent = "Produção: " + formatNumber(this.production);
        divPriceProduction.appendChild(pProduction);

        return container;
    }

    buy() {
        if (quadrados < this.price) return;
        quadrados -= this.price;
        this.quantity++;
        updateQuadradosPorSegundoValue();
        updateUI();
    }

    get price(): number {
        return Math.floor(this.basePrice * Math.pow(Gerador.PRICE_MULTIPLIER, this.quantity));
    }
}

class Melhoria {
    name: string;
    description: string;
    price: number;
    bought: boolean;
    affectedGenerator: Gerador;
    productionIncrease: number;
    otherEffects: () => void;

    constructor(name: string, description: string, price: number, affectedGenerator: Gerador, productionIncrease: number, otherEffects?: () => void) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.affectedGenerator = affectedGenerator;
        this.productionIncrease = productionIncrease;
        this.bought = false;
        this.otherEffects = otherEffects || (() => { });
    }

    createHTML(): HTMLElement {
        const container = document.createElement("div");
        container.classList.add("melhoria");
        container.addEventListener("click", () => {
            this.buy()
            updateUI();
        });

        const h2Name = document.createElement("h2");
        h2Name.textContent = this.name;
        container.appendChild(h2Name);

        const pDescription = document.createElement("p");
        pDescription.textContent = this.description;
        container.appendChild(pDescription);

        const pPrice = document.createElement("p");
        pPrice.textContent = "Preço: " + formatNumber(this.price);
        container.appendChild(pPrice);

        return container;
    }

    buy() {
        if (this.bought) return;
        if (quadrados < this.price) return;

        quadrados -= this.price;
        this.bought = true;
        this.otherEffects();
        this.affectedGenerator.production *= this.productionIncrease;
        updateUI();
        updateQuadradosPorSegundoValue();
    }
}

class MelhoriaTriangulo {
    name: string;
    description: string;
    price: number;
    bought: boolean;
    effect: () => void;

    constructor(name: string, description: string, price: number, effect: () => void) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.effect = effect;
        this.bought = false;
    }

    createHTML(): HTMLElement {
        const container = document.createElement("div");
        container.classList.add("melhoria");
        container.addEventListener("click", () => {
            this.buy()
            updateUI();
        });

        const h2Name = document.createElement("h2");
        h2Name.textContent = this.name;
        container.appendChild(h2Name);

        const pDescription = document.createElement("p");
        pDescription.textContent = this.description;
        container.appendChild(pDescription);

        const pPrice = document.createElement("p");
        pPrice.textContent = "Preço: " + formatNumber(this.price);
        container.appendChild(pPrice);

        return container;
    }

    buy() {
        if (this.bought) return;
        if (triangulos < this.price) return;

        triangulos -= this.price;
        this.bought = true;
        this.effect();
        updateUI();
    }
}

class Pergunta {
    static numPerguntas = 0;
    static respondidas = 0;
    static acertos = 0;
    static erros = 0;

    pergunta: string;
    opçoes: string[];
    resposta: string;

    constructor(pergunta: string, opçoes: string[], resposta: string) {
        this.pergunta = pergunta;
        this.opçoes = opçoes;
        this.resposta = resposta;
        Pergunta.numPerguntas++
    }
};

const geradores: Gerador[] = [
    new Gerador("Cursores", 10e1, 1),
    new Gerador("Professores", 3e3, 10),
    new Gerador("Matemáticos", 1.3e5, 44),
    new Gerador("Quadros", 0.9e7, 305),
    new Gerador("Impressoras", 1.5e9, 5070),
    new Gerador("Fábricas", 2e11, 674e2),
    new Gerador("Engenheiros", 2.5e13, 8425e2),
    new Gerador("Programadores", 3.7e15, 1246e4),
    // new Gerador("Computadores", 10, 1),
    // new Gerador("Cubos", 100, 5),
]

const melhorias: Melhoria[] = [
    new Melhoria("Cursores duplos", "Dobra a produção dos cursores", 500, geradores[0], 2),
    new Melhoria("Professores duplos", "Dobra a produção dos professores", 15e3, geradores[1], 2),
    new Melhoria("Matemáticos duplos", "Dobra a produção dos matemáticos", 6.5e5, geradores[2], 2),
    new Melhoria("Quadros duplos", "Dobra a produção dos quadros", 4.5e7, geradores[3], 2),
    new Melhoria("Impressoras duplas", "Dobra a produção das impressoras", 7.5e9, geradores[4], 2),
    new Melhoria("Fábricas duplas", "Dobra a produção das fábricas", 10e11, geradores[5], 2),
    new Melhoria("Engenheiros duplos", "Dobra a produção dos engenheiros", 12.5e13, geradores[6], 2),
    new Melhoria("Programadores duplos", "Dobra a produção dos programadores", 18.5e15, geradores[7], 2),
    // new Melhoria("Computadores duplos", "Dobra a produção dos computadores", 50000000000, geradores[8], 2),
    // new Melhoria("Cubos duplos", "Dobra a produção dos cubos", 500000000000, geradores[9], 2),

    new Melhoria("Múltiplos cursores", "Multiplica a produção dos cursores por 5", 35e3, geradores[0], 5),
    new Melhoria("Múltiplos professores", "Multiplica a produção dos professores por 5", 10.5e5, geradores[1], 5),
    new Melhoria("Múltiplos matemáticos", "Multiplica a produção dos matemáticos por 5", 4.55e7, geradores[2], 5),
    new Melhoria("Múltiplos quadros", "Multiplica a produção dos quadros por 5", 3.15e9, geradores[3], 5),
    new Melhoria("Múltiplos impressoras", "Multiplica a produção das impressoras por 5", 5.25e11, geradores[4], 5),
    new Melhoria("Múltiplos fábricas", "Multiplica a produção das fábricas por 5", 7e13, geradores[5], 5),
    new Melhoria("Múltiplos engenheiros", "Multiplica a produção dos engenheiros por 5", 8.75e15, geradores[6], 5),
    new Melhoria("Múltiplos programadores", "Multiplica a produção dos programadores por 5", 12.95e17, geradores[7], 5),
    // new Melhoria("Múltiplos computadores", "Multiplica a produção dos computadores por 5", 50000000000, geradores[8], 5),
    // new Melhoria("Múltiplos cubos", "Multiplica a produção dos cubos por 5", 5000000000, geradores[9], 5),

    new Melhoria("Super cursores", "Multiplica a produção dos cursores por 20", 28e5, geradores[0], 20),
    new Melhoria("Super professores", "Multiplica a produção dos professores por 20", 8.4e7, geradores[1], 20),
    new Melhoria("Super matemáticos", "Multiplica a produção dos matemáticos por 20", 3.64e9, geradores[2], 20),
    new Melhoria("Super quadros", "Multiplica a produção dos quadros por 20", 2.52e11, geradores[3], 20),
    new Melhoria("Super impressoras", "Multiplica a produção das impressoras por 20", 4.2e13, geradores[4], 20),
    new Melhoria("Super fábricas", "Multiplica a produção das fábricas por 20", 5.6e15, geradores[5], 20),
    new Melhoria("Super engenheiros", "Multiplica a produção dos engenheiros por 20", 7e17, geradores[6], 20),
    new Melhoria("Super programadores", "Multiplica a produção dos programadores por 20", 10.36e19, geradores[7], 20),
    // new Melhoria("Super computadores", "Multiplica a produção dos computadores por 20", 50000000000, geradores[8], 20),
    // new Melhoria("Super cubos", "Multiplica a produção dos cubos por 20", 50000000000, geradores[9], 20),
]

const melhoriasTriangulo: MelhoriaTriangulo[] = [
    new MelhoriaTriangulo("Quiz Matemático", "Desbloqueia o quiz matemático", 1, () => {
        document.getElementById("quizmatematico")!.style.display = "block";
    }),
    new MelhoriaTriangulo("Maquina da sorte", "Desbloqueia a maquina da sorte", 2, () => {
        document.getElementById("maquinadasorte")!.style.display = "block";
    }),
]

let perguntas: Pergunta[] = [
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
    new Pergunta("Qual é o resultado de 2 + 3 x 2?", ["13", "8", "20", "10"], "8"),
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
// #endregion

// #region main

let quadrados = 0;
let quadradosPorClique = 1;
let quadradosPorSegundo = 0;
let triangulos = 10;
let triangulosExpoenteIndex = 1;
let quadradosAscendentes = 0;
let quadradosAscendentesDesseRenascimento = 0;
let totalQuadrados = 0;

let clickAnimationTimeout: number | null = null;
let perguntaAtual: Pergunta | null = null;

function updateQuadradosValue(newValue: number) {
    if (newValue > quadrados) {
        totalQuadrados += newValue - quadrados;
    }

    quadrados = parseInt(newValue.toString());

    if (quadrados > 1000 ** triangulosExpoenteIndex) {
        triangulosExpoenteIndex++;
        triangulos++;
    }

    if (totalQuadrados >= getNextQuadradosAscendentesCost()) {
        quadradosAscendentes++;
    }

    updateUI();
}

function updateQuadradosPorSegundoValue() {
    quadradosPorSegundo = geradores.reduce((acc, gerador) => acc + (gerador.production * gerador.quantity), 0);
    quadradosPorSegundo *= (1 + (0.1 * quadradosAscendentesDesseRenascimento));
    updateUI();
}

function click() {
    updateQuadradosValue(quadrados + quadradosPorClique);
    quadrado.classList.add("click-animation");
    clearTimeout(clickAnimationTimeout ? clickAnimationTimeout : undefined);

    clickAnimationTimeout = setTimeout(() => {
        quadrado.classList.remove("click-animation");
    }, 150);

    updateUI();
}

function updateUI() {
    document.getElementById("quadrados")!.textContent = "Quadrados: " + formatNumber(quadrados);
    document.getElementById("quadradosPorClick")!.textContent = formatNumber(quadradosPorClique);
    document.getElementById("quadradosPorSegundo")!.textContent = formatNumber(quadradosPorSegundo);
    document.getElementById("triangulos")!.textContent = formatNumber(triangulos);
    document.getElementById("quadrados-ascendentes")!.textContent = formatNumber(quadradosAscendentes);
    document.getElementById("quadrados-ascendentes-faltantes")!.textContent = formatNumber(getNextQuadradosAscendentesCost() - totalQuadrados);
    updateGeradoresUI();
    updateMelhoriasUI();
    updateMelhoriasTrianguloUI();
}

function formatNumber(num: number): string {
    if (num == 0) {
        return "0";
    }
    const suffixes = [
        "", "K",
        "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
        "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Vg",
        "Uv", "Dv", "Tv", "Qav", "Qiv", "Sxv", "Spv", "Ocv", "Nov", "Tg",
    ];
    const suffixIndex = Math.floor(Math.log10(num) / 3);

    if (suffixIndex < 0 || suffixIndex >= suffixes.length) {
        return Math.round(num / Math.pow(10, suffixIndex * 3) * 100) / 100 + suffixes[suffixes.length - 1]; // Use the last suffix if the number is too large
    }

    return Math.round(num / Math.pow(10, suffixIndex * 3) * 100) / 100 + suffixes[suffixIndex];
}

function updateMelhoriasUI() {
    const melhoriasContainer = document.getElementById("melhorias-div")!;
    melhoriasContainer.innerHTML = "";
    const sortedMelhorias = [...melhorias].sort((a, b) => a.price - b.price); // Sort by price
    for (const melhoria of sortedMelhorias) {
        if (melhoria.bought) continue; // Skip bought upgrades
        melhoriasContainer.appendChild(melhoria.createHTML());
    }
}

function updateGeradoresUI() {
    const generatorsContainer = document.getElementById("geradores-div")!;
    generatorsContainer.innerHTML = "";
    for (const gerador of geradores) {
        generatorsContainer.appendChild(gerador.createHTML());
    }
}

function updateMelhoriasTrianguloUI() {
    const melhoriasContainer = document.getElementById("melhorias-triangulos-div")!;
    melhoriasContainer.innerHTML = "";
    for (const melhoria of melhoriasTriangulo) {
        if (melhoria.bought) continue; // Skip bought upgrades
        melhoriasContainer.appendChild(melhoria.createHTML());
    }
}

function mudarMenu(id: string) {
    const menu = document.getElementById(id);
    for (const child of document.getElementById("menus")!.children) {
        (child as HTMLElement).style.display = "none";
    }
    if (!menu) {
        document.getElementById("menus")!.style.display = "none";
        document.getElementById("botoesOutros")!.style.display = "flex";
        document.getElementById("botao-voltar-others")!.style.display = "none";
    }
    if (menu) {
        document.getElementById("menus")!.style.display = "flex";
        document.getElementById("botoesOutros")!.style.display = "none";
        document.getElementById("botao-voltar-others")!.style.display = "flex";
        menu.style.display = "flex";
    }
    updateUI();
}

let resultadoQuizTimeout: number | null = null;

function proximaPergunta() {
    perguntaAtual = perguntas[Math.floor(Math.random() * perguntas.length)];
    document.getElementById("pergunta")!.textContent = perguntaAtual?.pergunta || "";
    const opcoes = perguntaAtual?.opçoes || [];
    opcoes.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 4; i++) {
        const botao = document.getElementById(`opcao${i + 1}`) as HTMLButtonElement;
        botao.textContent = perguntaAtual?.opçoes[i] || "";
        botao.disabled = false;
    }

}

function verificarQuiz(numeroOpcao: number) {
    if (!perguntaAtual) return;

    const opcaoEscolhida = perguntaAtual.opçoes[numeroOpcao - 1];
    const acertou = opcaoEscolhida === perguntaAtual.resposta;
    const variacao = Math.max(quadrados * 0.15, 1);

    updateQuadradosValue(acertou ? quadrados + variacao : Math.max(0, quadrados - variacao));
    document.getElementById("resultado-quiz")!.style.display = "block";
    clearTimeout(resultadoQuizTimeout ? resultadoQuizTimeout : undefined);
    resultadoQuizTimeout = setTimeout(() => {
        document.getElementById("resultado-quiz")!.style.display = "none";
    }, 2000);
    if (acertou) {
        document.getElementById("resultado-quiz")!.textContent = "Acertou! +" + formatNumber(variacao) + " quadrados";
        document.getElementById("resultado-quiz")!.style.color = "var(--green4)";
        Pergunta.acertos++;
    } else {
        document.getElementById("resultado-quiz")!.textContent = "Errou! -" + formatNumber(variacao) + " quadrados";
        document.getElementById("resultado-quiz")!.style.color = "var(--red4)";
        Pergunta.erros++;
    }
    Pergunta.respondidas++;
    proximaPergunta();
}

for (let i = 1; i <= 4; i++) {
    const botao = document.getElementById(`opcao${i}`) as HTMLButtonElement;
    botao.addEventListener("click", () => verificarQuiz(i));
}

proximaPergunta();

function apostar() {
    const input = document.getElementById("valor-aposta") as HTMLInputElement;
    const mensagem = document.getElementById("textoEmergenciamaquina")!;
    const aposta = Number(input.value);

    if (!Number.isFinite(aposta) || aposta <= 0) {
        mensagem.textContent = "Digite uma aposta maior que zero.";
        return;
    }

    if (aposta > quadrados) {
        mensagem.textContent = "Você não tem quadrados suficientes para essa aposta.";
        return;
    }

    if (Math.random() < 0.5) {
        updateQuadradosValue(quadrados + aposta);
        mensagem.textContent = `Você ganhou! Sua aposta dobrou para ${formatNumber(aposta * 2)} quadrados.`;
    } else {
        updateQuadradosValue(0);
        mensagem.textContent = "Você perdeu! Todos os seus quadrados foram perdidos.";
    }

    input.value = "";
}

document.getElementById("botao-apostar")!.addEventListener("click", apostar);

function renascer() {
    quadrados = 0;
    quadradosPorClique = 1 * (1 + (0.1 * quadradosAscendentes));
    quadradosAscendentesDesseRenascimento = quadradosAscendentes;
    geradores.forEach(gerador => gerador.quantity = 0);
    melhorias.forEach(melhoria => melhoria.bought = false);
    document.getElementById("confirmarRenascer")!.style.display = "none";
    updateQuadradosPorSegundoValue();
    updateUI();
}

function getNextQuadradosAscendentesCost(): number {
    let valor = 100000000;

    for (let i = 1; i <= quadradosAscendentes; i++) {
        valor += 100000 * (1.10 ** i);
    }

    return Math.round(valor);
}

const quadrado = document.getElementById("quadrado")!;
quadrado.addEventListener("click", click);

// #region save

let timeoutSaveOrLoad: number;

function confirmSaveOrLoad() {
    const selectedAction = document.querySelector(".acao-escolhida");
    const selectedOption = document.querySelector(".opcao-escolhida");
    if (!selectedAction || !selectedOption) {
        alert("Por favor, selecione uma ação e uma opção.");
        return;
    }

    const notification = document.querySelector("#save-notification") as HTMLDivElement;
    const action = selectedAction.id;
    const option = selectedOption.id;
    if (action === "save-action") {
        if (option === "salvar-local") {
            saveToLocalStorage();
        } else if (option === "salvar-json") {
            saveToJson();
        } else if (option === "salvar-online") {
            if (!Auth.isUserLoggedIn()) {
                alert("Você precisa estar logado para salvar online.");
                return;
            }
            saveToSupabase();
        }

        notification.querySelector("p")!.innerText = "Dados salvos com sucesso!";
        notification.style.display = "block";
        timeoutSaveOrLoad = setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    } else if (action === "load-action") {
        if (option === "salvar-local") {
            loadFromLocalStorage();
        } else if (option === "salvar-json") {
            loadFromJson();
        } else if (option === "salvar-online") {
            if (!Auth.isUserLoggedIn()) {
                alert("Você precisa estar logado para carregar online.");
                return;
            }
            loadFromSupabase();
        }
    }
}

function selectAction(div: HTMLDivElement) {
    document.querySelector(".acao-escolhida")?.classList.remove("acao-escolhida");
    div.classList.add("acao-escolhida");
}

function selectOption(div: HTMLDivElement) {
    document.querySelector(".opcao-escolhida")?.classList.remove("opcao-escolhida");
    div.classList.add("opcao-escolhida");
}

function transformToJson(): string {
    return JSON.stringify({
        quadrados: quadrados,
        quadradosPorClique: quadradosPorClique,
        quadradosPorSegundo: quadradosPorSegundo,
        triangulos: triangulos,
        triangulosExpoenteIndex: triangulosExpoenteIndex,
        quadradosAscendentes: quadradosAscendentes,
        quadradosAscendentesDesseRenascimento: quadradosAscendentesDesseRenascimento,
        totalQuadrados: totalQuadrados,
        geradores: geradores,
        melhorias: melhorias,
        melhoriasTriangulo: melhoriasTriangulo,
    });
}

function transformFromJson(json: string | null): void {
    if (!json) return;
    try {
        const data = JSON.parse(json);
        quadrados = data.quadrados;
        quadradosPorClique = data.quadradosPorClique;
        quadradosPorSegundo = data.quadradosPorSegundo;
        triangulos = data.triangulos;
        triangulosExpoenteIndex = data.triangulosExpoenteIndex;
        quadradosAscendentes = data.quadradosAscendentes;
        quadradosAscendentesDesseRenascimento = data.quadradosAscendentesDesseRenascimento;
        totalQuadrados = data.totalQuadrados;

        for (let g of data.geradores) {
            const gerador = geradores.find(gen => gen.name === g.name);
            if (gerador) {
                gerador.quantity = g.quantity;
                gerador.production = g.production;
            }
        }

        for (let m of data.melhorias) {
            const melhoria = melhorias.find(melh => melh.name === m.name);
            if (melhoria) {
                melhoria.bought = m.bought;
                melhoria.price = m.price;
                melhoria.productionIncrease = m.productionIncrease;
            }
        }

        for (let mt of data.melhoriasTriangulo) {
            const melhoriaTriangulo = melhoriasTriangulo.find(melh => melh.name === mt.name);
            if (melhoriaTriangulo) {
                melhoriaTriangulo.bought = mt.bought;
                if (mt.bought) {
                    melhoriaTriangulo.effect();
                }
            }
        }
        const notification = document.querySelector("#save-notification") as HTMLDivElement;
        notification.querySelector("p")!.innerText = "Dados carregados com sucesso!";
        notification.style.display = "block";
        timeoutSaveOrLoad = setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    } catch (error) {
        const notification = document.querySelector("#save-notification") as HTMLDivElement;
        notification.querySelector("p")!.innerText = "Erro ao carregar os dados!";
        notification.style.display = "block";
        timeoutSaveOrLoad = setTimeout(() => {
            notification.style.display = "none";
        }, 3000);
    }
    
}

function saveToLocalStorage() {
    localStorage.setItem("quadradoClicker", transformToJson());
}

function loadFromLocalStorage() {
    const json = localStorage.getItem("quadradoClicker");
    transformFromJson(json);
}

function saveToJson() {
    const json = transformToJson();
    const blob = new Blob([json], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quadradoClicker.json";
    a.click();

    URL.revokeObjectURL(url);
}

function loadFromJson() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const json = (e.target as FileReader).result as string;
            transformFromJson(json);
        };
        reader.readAsText(file);
    };
    input.click();
}

async function saveToSupabase() {
    const user = await Auth.getUser();
    const { error } = await supabase.from("profiles")
        .update({
            quadrado_clicker_save: JSON.parse(transformToJson())
        }).eq("id", user.id)
    console.log(error);
}

async function loadFromSupabase() {
    const user = await Auth.getUser();
    const { data, error } = await supabase.from("profiles")
        .select("quadrado_clicker_save").eq("id", user.id)
    if (error) return;
    const json = JSON.stringify(data[0]["quadrado_clicker_save"]);

    transformFromJson(json);
}


document.getElementById("save-action")!.addEventListener("click", () => selectAction(document.getElementById("save-action") as HTMLDivElement));
document.getElementById("load-action")!.addEventListener("click", () => selectAction(document.getElementById("load-action") as HTMLDivElement));
document.getElementById("salvar-local")!.addEventListener("click", () => selectOption(document.getElementById("salvar-local") as HTMLDivElement));
document.getElementById("salvar-json")!.addEventListener("click", () => selectOption(document.getElementById("salvar-json") as HTMLDivElement));
document.getElementById("salvar-online")!.addEventListener("click", () => selectOption(document.getElementById("salvar-online") as HTMLDivElement));
document.getElementById("confirm-save-load-button")!.addEventListener("click", confirmSaveOrLoad);

// #endregion

updateUI();

setInterval(() => {
    updateQuadradosValue(quadrados + quadradosPorSegundo);
    document.getElementById("quadrados")!.textContent = "Quadrados: " + formatNumber(quadrados);
}, 1000);

setTimeout(() => {
    changeTo("game");
}, 1000);

window.addEventListener("DOMContentLoaded", async () => {
    if (await Auth.isUserLoggedIn()) {
        loadFromSupabase();
    } else {
        loadFromLocalStorage();
    }
});

//@ts-ignore
window.mudarMenu = mudarMenu;
//@ts-ignore
window.renascer = renascer;
// #endregion

export { }