let alimentos = [];
let alimentosSelecionados = [];

// Carrega o JSON
fetch('alimentos.json')
  .then(response => response.json())
  .then(data => {
    alimentos = data;
    console.log('JSON carregado:', alimentos);
  })
  .catch(error => {
    console.error('Erro ao carregar o JSON:', error);
  });

// Consulta individual (não mexe na lista acumulada)
function consultarInformacoes() {
  const nomeAlimento = document.getElementById('nomeAlimento').value.toLowerCase().trim();
  const quantidade = parseFloat(document.getElementById('quantidade').value);
  const resultadoDiv = document.getElementById('resultado');

  if (!nomeAlimento || isNaN(quantidade) || quantidade <= 0) {
    resultadoDiv.innerHTML = "Por favor, preencha ambos os campos corretamente.";
    return;
  }

  const alimento = alimentos.find(a => a.nome.toLowerCase() === nomeAlimento);

  if (!alimento) {
    resultadoDiv.innerHTML = "Alimento não encontrado!";
    return;
  }

  const info = alimento.informacoes_nutricionais;
  resultadoDiv.innerHTML = `
    <h3>Informações Nutricionais: ${alimento.nome} (${quantidade}g):</h3>
    <p><strong>Proteína:</strong> ${(info.proteina * quantidade / 100).toFixed(2)}g</p>
    <p><strong>Carboidrato:</strong> ${(info.carboidrato * quantidade / 100).toFixed(2)}g</p>
    <p><strong>Gordura Total:</strong> ${(info.gordura_total * quantidade / 100).toFixed(2)}g</p>
    <p><strong>Calorias:</strong> ${(info.calorias * quantidade / 100).toFixed(2)} kcal</p>
  `;
}

// Adiciona alimento ao total acumulado
function adicionarAlimento() {
  const nomeAlimento = document.getElementById('nomeAlimento').value.toLowerCase().trim();
  const quantidade = parseFloat(document.getElementById('quantidade').value);
  const resultadoDiv = document.getElementById('resultado');

  if (!nomeAlimento || isNaN(quantidade) || quantidade <= 0) {
    resultadoDiv.innerHTML = "Por favor, preencha ambos os campos corretamente.";
    return;
  }

  const alimento = alimentos.find(a => a.nome.toLowerCase() === nomeAlimento);

  if (!alimento) {
    resultadoDiv.innerHTML = "Alimento não encontrado!";
    return;
  }

  alimentosSelecionados.push({
    nome: alimento.nome,
    quantidade: quantidade,
    info: alimento.informacoes_nutricionais
  });

  resultadoDiv.innerHTML = `${alimento.nome} (${quantidade}g) adicionado ao total!`;
}

// Mostra o total acumulado
function mostrarTotal() {
  const resultadoDiv = document.getElementById('resultado');

  if (alimentosSelecionados.length === 0) {
    resultadoDiv.innerHTML = "Nenhum alimento adicionado ainda.";
    return;
  }

  let totalProteina = 0;
  let totalCarbo = 0;
  let totalGordura = 0;
  let totalCalorias = 0;

  alimentosSelecionados.forEach(item => {
    totalProteina += (item.info.proteina * item.quantidade / 100);
    totalCarbo += (item.info.carboidrato * item.quantidade / 100);
    totalGordura += (item.info.gordura_total * item.quantidade / 100);
    totalCalorias += (item.info.calorias * item.quantidade / 100);
  });

  resultadoDiv.innerHTML = `
    <h3>Totais acumulados:</h3>
    <p><strong>Proteína:</strong> ${totalProteina.toFixed(2)}g</p>
    <p><strong>Carboidrato:</strong> ${totalCarbo.toFixed(2)}g</p>
    <p><strong>Gordura Total:</strong> ${totalGordura.toFixed(2)}g</p>
    <p><strong>Calorias:</strong> ${totalCalorias.toFixed(2)} kcal</p>
  `;
}

// Limpa a lista acumulada
function limparLista() {
  alimentosSelecionados = [];
  document.getElementById('resultado').innerHTML = "Lista de alimentos limpa.";
}
