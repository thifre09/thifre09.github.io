let num1 = 0;
let numeroAtivo = 0;
let operador =  "";
let virgulaAtivo = false;
let clicksVirgula =  1;

let visor = document.getElementById('visor');

function numbers(numero) {
    if (virgulaAtivo === false) {
        numeroAtivo *= 10;
        numeroAtivo += numero;
        visor.innerHTML = numeroAtivo;
    } else if (virgulaAtivo === true) {
        numeroAtivo += (numero / 10**clicksVirgula)
        clicksVirgula++
        if (numero === 0) {
            visor.innerHTML = numeroAtivo.toLocaleString("pt-BR", {maximumFractionDigits:8}) + ",0";
        } else {
            visor.innerText = numeroAtivo.toLocaleString("pt-BR", {maximumFractionDigits:8});
        }
        
    }
        
}

function simbolos(simbolo) {
    if (operador === "") {
        num1 += numeroAtivo;
        numeroAtivo = 0;
        clicksVirgula = 1;
        virgulaAtivo = false;
        visor.innerHTML = numeroAtivo;
    } else if (operador !== "") {
        num1 += numeroAtivo;
        numeroAtivo =  0;
        clicksVirgula = 1
        virgulaAtivo = false
        visor.innerHTML = num1;
    }
        

    if (simbolo === "+") {
        operador = "+"
    } else if (simbolo === "-") {
        operador = "-"
    } else if (simbolo === "x") {
       operador = "x"
    } else if (simbolo === "/") {
        operador = "/"
    }
}

function simbolosInstantaneos(simbolo) {
    if (simbolo === "**") {
        numeroAtivo **= 2;
        visor.innerHTML = numeroAtivo;
        operador = "**"
    } else if (simbolo === "sqrt") {
        numeroAtivo = Math.sqrt(numeroAtivo)
        visor.innerHTML = numeroAtivo
        operador = "sqrt"
    } else if (simbolo === "+/-") {
        numeroAtivo *= -1;
        visor.innerHTML = numeroAtivo;
    } else if (simbolo === "1/x") {
        numeroAtivo = 1/numeroAtivo;
        visor.innerHTML = numeroAtivo;
    } else if (simbolo === "%") {
        if (num1 === 0) {
            numeroAtivo = 0;
            visor.innerHTML = numeroAtivo;
        } else {
            numeroAtivo = (num1/100) * numeroAtivo;
            visor.innerHTML = numeroAtivo
        }
    }
}

function apagar(tipo) {
    if (tipo === "tudo") {
        numeroAtivo = 0;
        num1 = 0;
        operador = "";
        virgulaAtivo = false;
        clicksVirgula = 1;
        visor.innerHTML = numeroAtivo;
    } else if (tipo === "parcial") {
        numeroAtivo = 0;
        visor.innerHTML = numeroAtivo;
    } else if (tipo === "um") {
        if (virgulaAtivo === false) {
            numeroAtivo = Math.floor(numeroAtivo / 10);
            visor.innerHTML = numeroAtivo;
        } else if (virgulaAtivo === true) {
            numeroAtivo = Math.round(numeroAtivo * (10**(clicksVirgula-1))) / 10
            numeroAtivo = Math.floor(numeroAtivo)
            numeroAtivo = numeroAtivo / (10**(clicksVirgula-2))
            clicksVirgula -= 1
    
            visor.innerHTML = numeroAtivo.toLocaleString("pt-BR", {maximumFractionDigits:8});
        }
        if (numeroAtivo === 0) {
            visor.innerHTML = num1
        }
    }
}

function virgula() {
    virgulaAtivo = true;
    visor.innerHTML = String(numeroAtivo) + ","
}

function calcular() {

    if (operador == "+") {
        num1 += numeroAtivo
    } else if (operador == "-") {
        num1 -= numeroAtivo
    } else if (operador == "x") {
        num1 *= numeroAtivo
    } else if (operador == "/") {
        num1 /= numeroAtivo
    } else {
        num1 = numeroAtivo
    }

    operador = ""

    numeroAtivo = 0

    num1 = Math.round(num1 * (10**(clicksVirgula-1)))
    num1 = Math.floor(num1)
    num1 = num1 / (10**(clicksVirgula-2)) / 10

    visor.innerHTML = num1.toLocaleString("pt-BR", {maximumFractionDigits:8});
}

