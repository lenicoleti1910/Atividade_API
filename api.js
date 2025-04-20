const config = {
  // Proxy CORS usado para evitar bloqueios de CORS ao acessar a API
  corsProxy: 'https://cors-anywhere.herokuapp.com/',

  // URL base da API
  apiBase: 'https://api.genius.com',

  // Endpoint de busca da API
  searchEndpoint: '/search',

  // Token de autenticação da API
  token: '6VIFrjUIAN3OtypDlexkHYwonOPAK4XaGwmmjBO2K2sISTaRJ5FlWnBhtUsETxrq'
};

// Função assíncrona
async function buscarNaApi(termo) {
  // URL completa da requisição, incluindo o proxy, endpoint e termo de busca codificado
  const url = `${config.corsProxy}${config.apiBase}${config.searchEndpoint}?q=${encodeURIComponent(termo)}`;

  // Define o cabeçalho da requisição, incluindo o token de autorização
  const headers = {
    Authorization: `Bearer ${config.token}`
  };

  try {
    // Realiza a chamada à API com fetch, usando os cabeçalhos definidos
    const response = await fetch(url, { headers });

    // Converte a resposta em JSON
    const data = await response.json();

    // Verifica se os dados da resposta possuem a estrutura esperada
    if (!data.response || !data.response.hits) {
      throw new Error('Dados não encontrados na API.');
    }

    // Retorna a lista de resultados da API
    return data.response.hits;
  } catch (error) {
    // Exibe os erros no console
    console.error('Erro ao buscar na API:', error);
    throw new Error('Erro na API');
  }
}
