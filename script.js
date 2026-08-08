// ----------------------
// Para index.html (clientes)
// ----------------------
async function carregarProdutos() {
  try {
    const resposta = await fetch('data.json'); // lê o arquivo do GitHub
    const dados = await resposta.json();

    const container = document.getElementById('produtos');
    if (!container) return; // segurança

    container.innerHTML = '';
    dados.produtos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'produto';
      card.innerHTML = `
        <img src="${p.imagem}" alt="${p.nome}" width="150">
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco}</p>
        <a href="https://wa.me/5521999999999?text=${encodeURIComponent(p.mensagem)}" target="_blank">
          Comprar pelo WhatsApp
        </a>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error("Erro ao carregar produtos:", e);
  }
}
carregarProdutos();

// ----------------------
// Para admin.html (formulário + exportar)
// ----------------------
function renderizarProdutosAdmin() {
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const container = document.getElementById('produtos');
  if (!container) return;

  container.innerHTML = '';
  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" width="150">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco}</p>
      <a href="https://wa.me/5521999999999?text=${encodeURIComponent(produto.mensagem)}" target="_blank">
        Comprar pelo WhatsApp
      </a>
    `;
    container.appendChild(card);
  });
}

const form = document.getElementById('form-produto');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').value;
    const mensagem = document.getElementById('mensagem').value;

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push({ nome, preco, imagem, mensagem });
    localStorage.setItem('produtos', JSON.stringify(produtos));

    renderizarProdutosAdmin(); // mostra na tela
    e.target.reset();
  });

  // Renderiza ao abrir o admin
  renderizarProdutosAdmin();
}

// Botão de exportar JSON
const exportarBtn = document.getElementById('exportar-json');
if (exportarBtn) {
  exportarBtn.addEventListener('click', function() {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const jsonPronto = JSON.stringify({ produtos }, null, 2);

    // Copia para área de transferência
    navigator.clipboard.writeText(jsonPronto).then(() => {
      alert("JSON copiado para a área de transferência!");
    });

    // Mostra na área de prévia
    const preview = document.getElementById('json-preview');
    if (preview) {
      preview.innerHTML = "<pre>" + jsonPronto + "</pre>";
    }
  });
}
