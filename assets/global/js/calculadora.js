let num1 = 0;
let numeroAtivo = 0;
let operador = "";
let calcularFoiUltimoUsado = false;
let virgulaAtivo = false;
let clicksVirgula = 1;



function numbers(numero) {

    if (virgulaAtivo === false) {
        numeroAtivo *= 10;
        numeroAtivo += numero;
        visor.innerText = numeroAtivo;
    } else {
        numeroAtivo += numero / 10 ** clicksVirgula;
        clicksVirgula++;
        visor.innerText = numeroAtivo.toLocaleString("pt-BR", { maximumFractionDigits: 8 });
    }
}

function simbolos(simbolo) {
    if (operador !== "" && calcularFoiUltimoUsado === false) {
        calcular(); // Corrige a lógica repetitiva e reutiliza o cálculo.
    } else if (operador === "") {
        num1 = numeroAtivo;
    }

    numeroAtivo = 0;
    virgulaAtivo = false;
    clicksVirgula = 1;
    calcularFoiUltimoUsado = false;
    operador = simbolo;
}

function simbolosInstantaneos(simbolo) {
    if (simbolo === "**") {
        numeroAtivo **= 2;
    } else if (simbolo === "sqrt") {
        numeroAtivo = Math.sqrt(numeroAtivo);
    } else if (simbolo === "+/-") {
        numeroAtivo *= -1;
    } else if (simbolo === "1/x") {
        numeroAtivo = 1 / numeroAtivo;
    } else if (simbolo === "%") {
        numeroAtivo = (num1 / 100) * numeroAtivo;
    }

    visor.innerHTML = numeroAtivo;
}

function apagar(tipo) {
    if (tipo === "tudo") {
        num1 = 0;
        numeroAtivo = 0;
        operador = "";
        virgulaAtivo = false;
        clicksVirgula = 1;
        calcularFoiUltimoUsado = false;
        visor.innerHTML = numeroAtivo;
    } else if (tipo === "parcial") {
        numeroAtivo = 0;
        virgulaAtivo = false;
        clicksVirgula = 1;
        visor.innerHTML = numeroAtivo;
    } else if (tipo === "um") {
        if (virgulaAtivo === false) {
            numeroAtivo = Math.floor(numeroAtivo / 10);
        } else {
            numeroAtivo = Math.floor(numeroAtivo * 10 ** (clicksVirgula - 1)) / 10 ** (clicksVirgula - 1);
            clicksVirgula--;
        }

        if (numeroAtivo === 0) {
            visor.innerHTML = num1;
        } else {
            visor.innerHTML = numeroAtivo.toLocaleString("pt-BR", { maximumFractionDigits: 8 });
        }
    }
}

function virgula() {
    virgulaAtivo = true;
    visor.innerHTML = numeroAtivo.toLocaleString("pt-BR") + ",";
}

function calcular() {
    if (operador === "+") {
        num1 += numeroAtivo;
    } else if (operador === "-") {
        num1 -= numeroAtivo;
    } else if (operador === "x") {
        num1 *= numeroAtivo;
    } else if (operador === "/") {
        if (numeroAtivo !== 0) {
            num1 /= numeroAtivo;
        } else {
            visor.innerHTML = "Erro: Divisão por zero";
            return;
        }
    }

    numeroAtivo = 0;
    virgulaAtivo = false;
    clicksVirgula = 1;
    calcularFoiUltimoUsado = true;
    visor.innerHTML = num1.toLocaleString("pt-BR");
}