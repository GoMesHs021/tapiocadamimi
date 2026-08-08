// --- Cadastro de Produtos ---
const formProduto = document.getElementById('form-produto');
if (formProduto) {
  formProduto.addEventListener('submit', function(e) {
    e.preventDefault();
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').value;
    const mensagem = document.getElementById('mensagem').value;
    produtos.push({ nome, preco, imagem, mensagem });
    localStorage.setItem('produtos', JSON.stringify(produtos));
    renderizarProdutosAdmin();
    formProduto.reset();
  });
}

// --- Cadastro de Adicionais ---
const formAdicional = document.getElementById('form-adicional');
if (formAdicional) {
  formAdicional.addEventListener('submit', function(e) {
    e.preventDefault();
    let adicionais = JSON.parse(localStorage.getItem('adicionais')) || [];
    const nome = document.getElementById('nome-adicional').value;
    const preco = document.getElementById('preco-adicional').value;
    adicionais.push({ nome, preco });
    localStorage.setItem('adicionais', JSON.stringify(adicionais));
    renderizarAdicionaisAdmin();
    formAdicional.reset();
  });
}

// --- Renderizar Produtos no Admin ---
function renderizarProdutosAdmin() {
  let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  const container = document.getElementById('produtos');
  if (!container) return;

  container.innerHTML = '';
  produtos.forEach((produto, index) => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <button class="excluir" data-index="${index}">&times;</button>
      <img src="${produto.imagem}" alt="${produto.nome}" width="150">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco}</p>
      <a href="https://wa.me/5521999999999?text=${encodeURIComponent(produto.mensagem)}" target="_blank">
        Comprar pelo WhatsApp
      </a>
    `;
    container.appendChild(card);
  });

  // Eventos de exclusão
  document.querySelectorAll('.excluir').forEach(btn => {
    btn.addEventListener('click', function() {
      let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
      const idx = this.getAttribute('data-index');
      produtos.splice(idx, 1);
      localStorage.setItem('produtos', JSON.stringify(produtos));
      renderizarProdutosAdmin();
    });
  });
}

// --- Renderizar Adicionais no Admin ---
function renderizarAdicionaisAdmin() {
  let adicionais = JSON.parse(localStorage.getItem('adicionais')) || [];
  const container = document.getElementById('adicionais');
  if (!container) return;

  container.innerHTML = '';
  adicionais.forEach((add, index) => {
    const item = document.createElement('div');
    item.className = 'adicional';
    item.innerHTML = `
      <span>${add.nome} - R$ ${add.preco}</span>
      <button class="excluir" data-index="${index}">&times;</button>
    `;
    container.appendChild(item);
  });

  document.querySelectorAll('.adicional .excluir').forEach(btn => {
    btn.addEventListener('click', () => {
  // Se já está visível, fecha
  if (lista.style.display === 'block') {
    lista.style.display = 'none';
  } else {
    // Se está fechado, abre e carrega os adicionais
    lista.innerHTML = '';
    data.adicionais.forEach(add => {
      const li = document.createElement('li');
      li.textContent = `${add.nome} - R$ ${add.preco}`;
      lista.appendChild(li);
    });
    lista.style.display = 'block';
  }
});


// --- Exportar JSON ---
const exportarBtn = document.getElementById('exportar-json');
if (exportarBtn) {
  exportarBtn.addEventListener('click', function() {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    let adicionais = JSON.parse(localStorage.getItem('adicionais')) || [];
    const data = { produtos, adicionais };
    const jsonStr = JSON.stringify(data, null, 2);

    // Mostrar prévia
    const preview = document.getElementById('json-preview');
    if (preview) preview.textContent = jsonStr;

    // Copiar para área de transferência
    navigator.clipboard.writeText(jsonStr);
    alert("JSON exportado e copiado para a área de transferência!");
  });
}

// --- Renderizar Produtos para Clientes ---
function renderizarProdutos() {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('produtos');
      if (!container) return;
      container.innerHTML = '';
      data.produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto';
        card.innerHTML = `
          <img src="${produto.imagem}" alt="${produto.nome}">
          <h3>${produto.nome}</h3>
          <p>R$ ${produto.preco}</p>
          <a href="https://wa.me/5521999999999?text=${encodeURIComponent(produto.mensagem)}" target="_blank">
            Comprar pelo WhatsApp
          </a>
          <button class="mostrar-adicionais">+ Adicionais</button>
          <ul class="lista-adicionais"></ul>
        `;
        container.appendChild(card);

        // Mostrar lista de adicionais
        const btn = card.querySelector('.mostrar-adicionais');
        const lista = card.querySelector('.lista-adicionais');
        btn.addEventListener('click', () => {
          lista.innerHTML = '';
          data.adicionais.forEach(add => {
            const li = document.createElement('li');
            li.textContent = `${add.nome} - R$ ${add.preco}`;
            lista.appendChild(li);
          });
        });
      });
    });
}

// --- Inicialização ---
renderizarProdutosAdmin();
renderizarAdicionaisAdmin();
renderizarProdutos();
