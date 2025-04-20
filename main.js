const input = document.getElementById('busca');               // Campo de entrada de texto
const lista = document.getElementById('resultados');          // Lista onde os resultados serão exibidos
const aviso = document.getElementById('aviso');               // Elemento para exibir mensagens de status
const btnBuscar = document.getElementById('btnBuscar');       // Botão "Buscar"
const btnSalvar = document.getElementById('btnSalvar');       // Botão "Salvar busca"
const btnCarregarMais = document.getElementById('carregarMais'); // Botão "Carregar mais resultados"

// Variáveis de controle
let resultadosCache = [];              // Guarda os resultados já buscados (cache)
let paginaAtual = 0;                   // Página atual dos resultados (para paginação)
const RESULTADOS_POR_PAGINA = 5;       // Número de resultados mostrados por vez
let ultimoTermo = '';                  // Armazena o último termo buscado para evitar buscas repetidas

async function buscarMusica() {// Função principal de busca
  const termo = input.value.trim(); // Remove espaços desnecessários

  // Validação mínima: exige pelo menos 3 caracteres
  if (termo.length < 3) {
    aviso.innerText = 'Digite pelo menos 3 caracteres.';
    lista.innerHTML = ''; //limpa o conteúdo
    btnCarregarMais.style.display = 'none'; //esconde o botão
    return;
  }

  // Se o termo for o mesmo da última busca e houver cache, evita nova busca
  if (termo === ultimoTermo && resultadosCache.length > 0) return;
  ultimoTermo = termo; // Atualiza o último termo buscado

  // Limpa interface e estados antes de nova busca
  lista.innerHTML = '';
  aviso.innerText = '';
  paginaAtual = 0;
  resultadosCache = [];

  // Verifica se há dados no cache local
  const cacheKey = `cache_${termo.toLowerCase()}`;
  const dadosCache = carregarCache(cacheKey);

  if (dadosCache) { // verifica se já existem dados salvos no cache
    resultadosCache = dadosCache;
    aviso.innerText = 'Exibindo resultados do cache...';
    renderResultados();
    return;
  }

  // Caso não haja cache, realiza busca na API
  try {
    aviso.innerText = 'Buscando na API...';
    const resultados = await buscarNaApi(termo);

    if (!Array.isArray(resultados) || resultados.length === 0) {
      lista.innerHTML = '<li>Nenhum resultado encontrado.</li>';
      aviso.innerText = '';
      return;
    }

    // Salva resultados no cache local e renderiza na tela
    resultadosCache = resultados;
    salvarCache(cacheKey, resultados);
    aviso.innerText = 'Exibindo resultados da API...';
    renderResultados();
  } catch (e) {
    // Caso ocorra erro na API, informa ao usuário
    lista.innerHTML = '<li>Erro ao buscar resultados.</li>';
    aviso.innerText = '';
  }
}

// Função para exibir os resultados paginados
function renderResultados() {
  const inicio = paginaAtual * RESULTADOS_POR_PAGINA;
  const fim = inicio + RESULTADOS_POR_PAGINA;
  const resultadosPagina = resultadosCache.slice(inicio, fim); // Pega o pedaço da lista correspondente à página

  resultadosPagina.forEach(hit => {
    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${hit.result.full_title}</strong><br>
      <a href="${hit.result.url}" target="_blank">Ver letra no Genius</a>
    `;
    lista.appendChild(item);
  });

  paginaAtual++; // Avança a página

  // Mostra ou oculta botão "Carregar mais"
  if (paginaAtual * RESULTADOS_POR_PAGINA < resultadosCache.length) {
    btnCarregarMais.style.display = 'block';
  } else {
    btnCarregarMais.style.display = 'none';
  }
}

// Função para salvar a busca atual no localStorage
function salvarBusca() {
  const termo = input.value.trim();
  if (!termo) {
    alert('Digite algo para salvar.');
    return;
  }

  salvarUltimaBusca(termo); // Usa função utilitária
  alert('Busca salva com sucesso!');
}

// Evento de clique no botão "Buscar"
btnBuscar.addEventListener('click', (e) => {
  e.preventDefault();
  buscarMusica();
});

// Evento de clique no botão "Salvar busca"
btnSalvar.addEventListener('click', (e) => {
  e.preventDefault();
  salvarBusca();
});

// Evento de clique no botão "Carregar mais resultados"
btnCarregarMais.addEventListener('click', (e) => {
  e.preventDefault();
  renderResultados();
});

// Ativa busca automática com debounce enquanto o usuário digita
input.addEventListener('input', debounce(() => {
  if (input.value.trim().length >= 3) {
    buscarMusica();
  }
}, 500)); // Espera 500ms após o usuário parar de digitar

// Quando a página carrega, recupera a última busca salva
window.addEventListener('load', () => {
  const ultima = carregarUltimaBusca();
  if (ultima) {
    input.value = ultima;
    buscarMusica();
  }
});
