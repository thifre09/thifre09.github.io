let num1 = 0
let num2 = 0
let numAtivo = "1"
let operador =  []

let visor = document.getElementById('visor')

function numbers(numero) {
    if (numAtivo == "1") {
        num1 *= 10
        num1 += numero 
        visor.innerHTML = num1
    } else if (numAtivo == "2") {
        num2 *= 10
        num2 += numero
        nclicks += 1
        visor.innerHTML = num2
    }
}

function simbolos(simbolo) {
    if (simbolo == "+") {
        operador.push("+")
    } else if (simbolo == "-") {
        operador.push("-")
    } else if (simbolo == "x") {
        operador.push("x")
    } else if (simbolo == "/") {
        operador.push("/")
    } else if (simbolo == "**") {
        operador.push("**")
    } else if (simbolo == "srqt") {
        operador.push("srqt")
    } else if (simbolo == "1/x") {
        operador.push("1/x")
    }

    numAtivo = "2"
    visor.innerHTML = 0
}

function apagar(tipo) {
    if (tipo == "tudo") {
        num1 = 0
        num2 = 0
        visor.innerHTML = 0
    } else if (tipo == "um") {
        if (numAtivo == "1") {
            num1 = Math.floor(num1 / 10)
            visor.innerHTML = num1
        } else if (numAtivo == "2") {
            num2 = Math.floor(num2 / 10)
            visor.innerHTML = num2
        }
    }
}