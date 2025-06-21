let alimentos = [];
let alimentosSelecionados = [];

fetch('alimentos.json')
  .then(response => response.json())
  .then(data => {
    alimentos = data;
    console.log('JSON carregado:', alimentos);
  })
  .catch(error => {
    console.error('Erro ao carregar o JSON:', error);
  });

function consultarInformacoes() {
  let nomeAlimento = document.getElementById('nomeAlimento').value.toLowerCase().trim();
  let quantidade = parseFloat(document.getElementById('quantidade').value);
  let resultadoDiv = document.getElementById('resultado');

  if (!nomeAlimento || isNaN(quantidade) || quantidade <= 0) {
    resultadoDiv.innerHTML = "Por favor, preencha ambos os campos corretamente.";
    return;
  }

  let alimento = alimentos.find(a => a.nome.toLowerCase() === nomeAlimento);

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

function adicionarAlimento() {
  let nomeAlimento = document.getElementById('nomeAlimento').value.toLowerCase().trim();
  let quantidade = parseFloat(document.getElementById('quantidade').value);
  let resultadoDiv = document.getElementById('resultado');

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

function mostrarTotal() {
  let resultadoDiv = document.getElementById('resultado');

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

function pegarValores() {
  let sexo = document.getElementById('Sexo').value;
  let peso = parseFloat(document.getElementById('quantidade').value);
  let altura = parseFloat(document.getElementById('Altura').value) * 100; 
  let idade = parseInt(document.getElementById('Idade').value);
  let atividade = document.getElementById('Atividade').selectedIndex;
  let objetivo = document.getElementById('Objetivo').selectedIndex;

  return { sexo, peso, altura, idade, atividade, objetivo };
}

function calcularTMB(sexo, peso, altura, idade) {
  if (sexo === 'M') {
    return (10 * peso) + (6.25 * altura) - (5 * idade) + 5;
  } else if (sexo === 'F') {
    return (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
  } else {
    return 0;
  }
}

function fatorAtividade(indice) {
  switch (indice) {
    case 1: return 1.2;    // Sedentário
    case 2: return 1.375;  // Leve
    case 3: return 1.55;   // Moderado
    case 4: return 1.725;  // Alto
    case 5: return 1.9;    // Muito alto
    default: return 1.2;
  }
}

function ajusteObjetivo(calorias, indice) {
  switch (indice) {
    case 1: return calorias;              // Manutenção
    case 2: return calorias - 500;        // Emagrecimento
    case 3: return calorias + 300;        // Hipertrofia
    default: return calorias;
  }
}

function calculoCaloria() {
  let { sexo, peso, altura, idade, atividade, objetivo } = pegarValores();

  if (!sexo || !peso || !altura || !idade || atividade === 0 || objetivo === 0) {
    document.getElementById('resultado2').innerHTML = 'Preencha todos os campos corretamente.';
    return;
  }

  let tmb = calcularTMB(sexo, peso, altura, idade);
  let fator = fatorAtividade(atividade);
  let totalCalorias = tmb * fator;
  totalCalorias = ajusteObjetivo(totalCalorias, objetivo);

  document.getElementById('resultado2').innerHTML = `Sua meta calórica diária é: <strong>${totalCalorias.toFixed(0)} kcal</strong>`;
}

function calculoProteina() {
  let { peso, objetivo } = pegarValores();

  if (!peso || objetivo === 0) {
    document.getElementById('resultado2').innerHTML = 'Preencha peso e objetivo.';
    return;
  }

  let proteina = 0;

  switch (objetivo) {
    case 1: proteina = peso * 1.5; break; // Manutenção
    case 2: proteina = peso * 2; break;   // Emagrecimento
    case 3: proteina = peso * 2; break;   // Hipertrofia
    default: proteina = peso * 1.5;
  }

  document.getElementById('resultado2').innerHTML = `Meta de proteína: <strong>${proteina.toFixed(1)}g por dia</strong>`;
}

function calculoCarbo() {
  let { peso, objetivo } = pegarValores();

  if (!peso || objetivo === 0) {
    document.getElementById('resultado2').innerHTML = 'Preencha peso e objetivo.';
    return;
  }

  let carbo = 0;

  switch (objetivo) {
    case 1: carbo = peso * 4; break; // Manutenção
    case 2: carbo = peso * 2.5; break; // Emagrecimento
    case 3: carbo = peso * 6; break; // Hipertrofia
    default: carbo = peso * 4;
  }

  document.getElementById('resultado2').innerHTML = `Meta de carboidratos: <strong>${carbo.toFixed(1)}g por dia</strong>`;
}

function limparCalculo() {
  document.getElementById('resultado2').innerHTML = '';
}
