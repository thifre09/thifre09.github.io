function enviar() {
    const checkboxes = document.querySelectorAll('input[name="quiz"]:checked');
    const numMarcados = checkboxes.length; // Conta os selecionados
    const section = document.getElementById("resultados");
    const resultadoTexto = document.getElementById("resultadoTexto");
    
    // Exibe o número de caixas marcadas
    resultadoTexto.textContent = `Você acertou ${numMarcados}/30 curiosidades.`;
    resultadoTexto.style.textAlign = "center"
    resultadoTexto.style.fontSize = "x-Large"
    section.style.display = "block"; // Mostra a seção de resultados
}