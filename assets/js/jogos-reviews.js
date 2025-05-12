// Função que aplica a cor de fundo de acordo com a nota
function aplicarEstiloNota10() {
    // Seleciona todas as tabelas
    var tabelas = document.querySelectorAll('table.tabela');

    tabelas.forEach(function(tabela) {
		// Identifica se a tabela é a de "Nota Final"
		var tituloTabela = tabela.previousElementSibling ? tabela.previousElementSibling.textContent : '';
		var isNotaFinal = tituloTabela.includes('Nota final');

		// Seleciona todas as células com as notas dentro da tabela
		var celulasNotas = tabela.querySelectorAll('tr.nota td');

		// Itera sobre todas as células
		celulasNotas.forEach(function(celula, index) {
			// Converte o texto da célula para número
			var nota = parseFloat(celula.textContent.trim());

			// Verifica se estamos na coluna "Dificuldade" (supondo que seja a 5ª coluna)
			var isDificuldade = (index + 1) % 5 === 0;

			// Verifica se a conversão resultou em um número válido
			if (!isNaN(nota)) {
				if (isNotaFinal) {
					// Lógica para "Nota Final" (quanto maior, melhor)
					if (nota > 10) {
						celula.style.backgroundColor = '#3498DB';  // Azul forte para notas maiores que 10
					} else if (nota === 10) {
						celula.style.backgroundColor = 'rgb(32, 211, 8)';  // Verde vibrante
					} else if (nota >= 9) {
						celula.style.backgroundColor = 'rgb(98, 214, 31)';  // Verde claro vibrante
					} else if (nota >= 7) {
						celula.style.backgroundColor = '#F1C40F';  // Amarelo brilhante
					} else if (nota >= 5) {
						celula.style.backgroundColor = '#F39C12';  // Laranja viva
					} else if (nota >= 3) {
						celula.style.backgroundColor = '#E67E22';  // Laranja avermelhado
					} else if (nota >= 1) {
						celula.style.backgroundColor = '#E74C3C';  // Vermelho vivo
					} else if (nota === 0) {
						celula.style.backgroundColor = '#C0392B';  // Vermelho intenso
					}
				} else if (isDificuldade) {
					// Inverte a lógica para a coluna "Dificuldade" (quanto menor, melhor)
					if (nota === 10) {
						celula.style.backgroundColor = '#C0392B';  // Vermelho intenso
					} else if (nota >= 9) {
						celula.style.backgroundColor = '#E74C3C';  // Vermelho vivo
					} else if (nota >= 7) {
						celula.style.backgroundColor = '#E67E22';  // Laranja avermelhado
					} else if (nota >= 5) {
						celula.style.backgroundColor = '#F39C12';  // Laranja viva
					} else if (nota >= 3) {
						celula.style.backgroundColor = '#F1C40F';  // Amarelo brilhante
					} else if (nota >= 1) {
						celula.style.backgroundColor = 'rgb(98, 214, 31)';  // Verde claro vibrante
					} else if (nota === 0) {
						celula.style.backgroundColor = 'rgb(32, 211, 8)';  // Verde vibrante para zero dificuldade
					}
				} else {
					// Lógica normal para outras categorias
					if (nota > 10) {
						celula.style.backgroundColor = '#3498DB';  // Azul forte para notas maiores que 10
					} else if (nota === 10) {
						celula.style.backgroundColor = 'rgb(32, 211, 8)';  // Verde vibrante
					} else if (nota >= 9) {
						celula.style.backgroundColor = 'rgb(98, 214, 31)';  // Verde claro vibrante
					} else if (nota >= 7) {
						celula.style.backgroundColor = '#F1C40F';  // Amarelo brilhante
					} else if (nota >= 5) {
						celula.style.backgroundColor = '#F39C12';  // Laranja viva
					} else if (nota >= 3) {
						celula.style.backgroundColor = '#E67E22';  // Laranja avermelhado
					} else if (nota >= 1) {
						celula.style.backgroundColor = '#E74C3C';  // Vermelho vivo
					} else if (nota === 0) {
						celula.style.backgroundColor = '#C0392B';  // Vermelho intenso
					}
				}
			} else {
				// Se não for um número, aplica cor cinza médio
				celula.style.backgroundColor = '#95A5A6';  // Cinza médio
			}
		});
	});
}

// Executa a função quando a página for carregada
window.onload = aplicarEstiloNota10;
