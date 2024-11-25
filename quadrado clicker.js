let quadrados = 0;
let base = 1000;

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

let click = base + (nCur * aCur) + (nPro *aPro) + (nMat *aMat) + (nQua * aQua) + (nFab * aFab);

function formatar(numero) {
    if (numero >= 1 && numero < 1000) {
        return numero
    } else if (numero >= 1000 && numero < 1000000) {
        return arredondar(2,numero / 1000) + "k"
    } else if (numero >= 1000000 && 1000000000) {
        return arredondar(2,numero / 1000000) + "mi"
    } else if (numero >= 1000000000 && 1000000000000) {
        return arredondar(2,numero / 1000000) + "bi"
    } else if (numero >= 1000000000000 && 1000000000000000) {
        return arredondar(2,numero / 1000000) + "t"
    }
}

function clique() {
    quadrados += click;
    
    //mudar tamanho ao clicar
    const elemento = document.getElementById("quadrado");
    elemento.style.width = "50%";
    elemento.style.height = "50%";

    setTimeout(() => {
        elemento.style.width = "45%";
        elemento.style.height = "45%";
    }, 100);
    verificarTriangulos()
    alterar()
}

function alterar() {
    let quadradosText = document.getElementById("quadradotext");
    let triangulosText = document.getElementById("triangulotext")
    quadradosText.innerText = "Quadrados: " + formatar(quadrados);
    triangulosText.innerText = "Triângulos: " + triangulos

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

    click = base + (nCur * aCur) + (nPro *aPro) + (nMat *aMat) + (nQua * aQua) + (aFab * nFab);

    let quadradosporclickText = document.getElementById("quadradosporclickText")
    quadradosporclickText.innerText = "Quadrados por click: " + formatar(click)
}

function arredondar(casasDecimais, variavel) {
    return variavel = Math.round(variavel * 10**casasDecimais) / 10**casasDecimais;
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

    document.getElementById("renascer").style.display = "block";
}

function mudarTrMaquinadasorte() {
    document.getElementById("outros").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

    document.getElementById("maquina-da-sorte").style.display = "block";
}

function mudarLivromagico() {
    document.getElementById("outros").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

    document.getElementById("livro-magico").style.display = "block";
}

function mudarQuizmatematico() {
    document.getElementById("outros").style.display = "none";

    const separadores = document.getElementsByClassName("separador");
    for (let i = 0; i < separadores.length; i++) {
        separadores[i].style.display = "none";
    }

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
    document.getElementById("Renascer").style.display = "none";
    document.getElementById("Maquina-da-sorte").style.display = "none";
    document.getElementById("livro-magico").style.display = "none";
    document.getElementById("quiz-matematico").style.display = "none";

}

//menus

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
    if (melhoria === "Super fabricas" && melhorias.Fab.f3 === false && quadrados >= 10000000000) {
        melhorias.Fab.f3 = true;
        quadrados -= 10000000000;
        aFab *= 20;
        evento.target.closest("td").style.backgroundColor = "#f88c5d";
    }

    alterar();
}

function comprarMelhoriasTriangulos(melhoria, evento) {
    
}
