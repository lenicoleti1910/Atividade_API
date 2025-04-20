// Evita chamadas repetidas (como em buscas enquanto o usuário digita).
function debounce(fn, delay) { // Função debounce - usada para limitar a frequência com que uma função é executada.
  let time; // variável de temporizador
  return (...args) => {
    clearTimeout(time); // Limpa o temporizador anterior
    time = setTimeout(() => fn(...args), delay); // Aguarda o tempo especificado antes de chamar a função
  };
}

function salvarUltimaBusca(valor) { // Função para salvar o valor da última busca realizada no localStorage
  localStorage.setItem('ultimaBusca', valor); // Salva o valor da chave "ultimaBusca"
}

function carregarUltimaBusca() { // Função para carregar o valor da última busca salva no localStorage
  return localStorage.getItem('ultimaBusca') || ''; // Retorna o valor salvo ou uma string vazia
}

// Os dados são convertidos para string JSON antes de serem salvos
function salvarCache(chave, dados) { // Função para salvar qualquer tipo de dado no cache
  localStorage.setItem(chave, JSON.stringify(dados)); // Salva os dados usando a chave 
}

// Os dados são convertidos de volta de JSON para objeto JavaScript
function carregarCache(chave) { // Função para carregar dados do cache (localStorage)
  const dados = localStorage.getItem(chave); // Recupera os dados salvos pela chave
  try {
    return JSON.parse(dados); // Tenta converter os dados de JSON para objeto
  } catch {
    return null; // Retorna null se os dados não puderem ser convertidos (por exemplo
  }
}