//variaveis

let quadrados = 0;
let base = 1000000;

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
let aQua = 500;
let aFab = 10000;

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
    sq1: false,
    qm1: false
}
a_pd1 = 1

let triangulos = 0;
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

let mana = 10;
let nclicks = 0;
let magiaselecionada = null;

let renasceu = false;
let quadrados_ascendentes = 0;
let valorParaGanhar1QuadradoAscendente = 100000000;

let click = (base + (nCur * aCur) + (nPro *aPro) + (nMat *aMat) + (nQua * aQua) + (nFab * aFab)) * a_pd1;

//variaveis

//principais funções

function formatar(numero) {
    if (numero >= 1 && numero < 1000) {
        return numero
    } else if (numero >= 1000 && numero < 1000000) {
        return arredondar(2,numero / 1000) + "k"
    } else if (numero >= 1000000 && numero < 1000000000) {
        return arredondar(2,numero / 1000000) + "mi"
    } else if (numero >= 1000000000 && numero < 1000000000000) {
        return arredondar(2,numero / 1000000000) + "bi"
    } else if (numero >= 1000000000000 && numero < 1000000000000000) {
        return arredondar(2,numero / 1000000000000) + "t"
    } else if (numero === 0) {
        return 0
    }
}

function clique() {
    if (window.innerWidth < 600) {
        quadrados += click;
        nclicks++;
        
        // Mudar tamanho ao clicar
        const elemento = document.getElementById("quadrado");
        elemento.style.width = "100px";
        elemento.style.height = "100px";

        setTimeout(() => {
            elemento.style.width = "80px";
            elemento.style.height = "80px";
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

    verificarQuadradosAscendentes()
    verificarTriangulos()
    cliqueCritico()
    verificarMana()
    alterar()
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
        base = 1000

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
        valorParaGanhar1QuadradoAscendente = Math.round(valorParaGanhar1QuadradoAscendente * 1.2)
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
            quadrados += click * 14
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
    if (quadrados >= 100000000000000000 && tri.tr8 === false) {
        triangulos++;
        tri.tr8 = true; 
    }
    if (quadrados >= 10000000000000000000 && tri.tr9 === false) {
        triangulos++;
        tri.tr9 = true; 
    }
    if (quadrados >= 1000000000000000000000 && tri.tr10 === false) {
        triangulos++;
        tri.tr10 = true; 
    }
}

function apostar() {
    // Obtém o valor do input
    let valorAposta = document.getElementById('valor-aposta').value;
    
    // Verifica se o valor é válido
    if (valorAposta.trim() === '' || isNaN(valorAposta) || Number(valorAposta) <= 0) {
        let TextoEmergencia = document.getElementById("textoEmergencia")
        TextoEmergencia.innerText = "Insira um valor válido"
    } else {
        let TextoEmergencia = document.getElementById("textoEmergencia")
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
    if (!magiaSelecionada) {
            
    } else if (magiaselecionada === "Constructo") {

    } else if (magiaselecionada === "Quadramentio") {

    } else if (magiaselecionada === "Trianglusio") {

    } else if (magiaselecionada === "Multiplicos quadrados") {

    }
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
    document.getElementById("maquina-da-sorte").style.justifyContent = "center"
}

function mudarLivromagico() {
    document.getElementById("outros").style.display = "none";
    document.getElementById("livro-magico").style.display = "flex";
}

function mudarQuizmatematico() {
    document.getElementById("outros").style.display = "none";
    document.getElementById("quiz-matematico").style.display = "block";
}

function mudarSkinquadrado() {
    document.getElementById("outros").style.display = "none";
    document.getElementById("quiz-matematico").style.display = "block";
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
    document.getElementById("triangulos").style.display = "none";
    document.getElementById("renascer").style.display = "none";
    document.getElementById("confirmarRenascer").style.display = "none";
    document.getElementById("maquina-da-sorte").style.display = "none";
    document.getElementById("livro-magico").style.display = "none";
    document.getElementById("quiz-matematico").style.display = "none";
    document.getElementById("renascer").style.backgroundColor = "#e0f7fa";
    let consiga1quadradoText = document.getElementById("consiga1quadrado")
    consiga1quadradoText.innerText = ""
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
        quadrados -= 300000;
        base *= 300;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Mega Clique
    if (melhoria === "Mega clique" && melhorias.Bas.b3 === false && quadrados >= 20000000) {
        melhorias.Bas.b3 = true;
        quadrados -= 20000000;
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
        quadrados -= 75000;
        aCur *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Cursores
    if (melhoria === "Super cursores" && melhorias.Cur.c3 === false && quadrados >= 10000000) {
        melhorias.Cur.c3 = true;
        quadrados -= 10000000;
        aCur *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Professores Duplos
    if (melhoria === "Professores duplos" && melhorias.Pro.p1 === false && quadrados >= 25000) {
        melhorias.Pro.p1 = true;
        quadrados -= 25000;
        aPro *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Escola
    if (melhoria === "Escola" && melhorias.Pro.p2 === false && quadrados >= 600000) {
        melhorias.Pro.p2 = true;
        quadrados -= 600000;
        aPro *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Professores
    if (melhoria === "Super professores" && melhorias.Pro.p3 === false && quadrados >= 90000000) {
        melhorias.Pro.p3 = true;
        quadrados -= 90000000;
        aPro *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Matemática Dupla
    if (melhoria === "Matematica dupla" && melhorias.Mat.m1 === false && quadrados >= 600000) {
        melhorias.Mat.m1 = true;
        quadrados -= 600000;
        aMat *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Conjunto de Matemáticos
    if (melhoria === "Conjunto de matematicos" && melhorias.Mat.m2 === false && quadrados >= 20000000) {
        melhorias.Mat.m2 = true;
        quadrados -= 20000000;
        aMat *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Matemáticos
    if (melhoria === "Super matematicos" && melhorias.Mat.m3 === false && quadrados >= 100000000) {
        melhorias.Mat.m3 = true;
        quadrados -= 100000000;
        aMat *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Dois Quadros
    if (melhoria === "Dois quadros" && melhorias.Qua.q1 === false && quadrados >= 30000000) {
        melhorias.Qua.q1 = true;
        quadrados -= 30000000;
        aQua *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Quadrão
    if (melhoria === "Quadrão" && melhorias.Qua.q2 === false && quadrados >= 75000000) {
        melhorias.Qua.q2 = true;
        quadrados -= 75000000;
        aQua *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Quadros Poderosos
    if (melhoria === "Quadros poderosos" && melhorias.Qua.q3 === false && quadrados >= 300000000) {
        melhorias.Qua.q3 = true;
        quadrados -= 300000000;
        aQua *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    // Duas Fábricas
    if (melhoria === "Duas fabricas" && melhorias.Fab.f1 === false && quadrados >= 2500000000) {
        melhorias.Fab.f1 = true;
        quadrados -= 2500000000;
        aFab *= 2;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Começo da Revolução
    if (melhoria === "Começo da revolução" && melhorias.Fab.f2 === false && quadrados >= 5000000000) {
        melhorias.Fab.f2 = true;
        quadrados -= 5000000000;
        aFab *= 5;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    // Super Fábricas
    if (melhoria === "Super fabricas" && melhorias.Fab.f3 === false && quadrados >= 100000000000) {
        melhorias.Fab.f3 = true;
        quadrados -= 100000000000;
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
    if (melhoria === 'Clique crítico' && melhoriasTri.pd1 === false && triangulos >= 1) {
        melhoriasTri.cc1 = true;
        triangulos -= 1

        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Crítico melhorado' && melhoriasTri.pd1 === false && triangulos >= 1) {
        melhoriasTri.cm1 = true;
        triangulos -= 1

        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Superprodução' && melhoriasTri.pd1 === false && triangulos >= 2) {
        melhoriasTri.sp1 = true;
        triangulos -= 2
        aCur *= 2
        aPro *= 2
        aMat *= 2
        aQua *= 2
        aFab *= 2
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Maquina da sorte' && melhoriasTri.pd1 === false && triangulos >= 3) {
        melhoriasTri.ms1 = true;
        triangulos -= 3
        document.getElementById("maquinadasorte").style.display = "block"
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Livro magico' && melhoriasTri.pd1 === false && triangulos >= 3) {
        melhoriasTri.lm1 = true;
        triangulos -= 3;
        document.getElementById("livromagico").style.display = "block";
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }
    if (melhoria === 'Quiz matemático' && melhoriasTri.pd1 === false && triangulos >= 3) {
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
    }

    alterar()
}

//compras
