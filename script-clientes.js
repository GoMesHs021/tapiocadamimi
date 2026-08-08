// --- Renderizar Perfil para Clientes ---
function renderizarPerfil(perfil) {
    const container = document.getElementById('perfil');
    if (!container) return;
    container.innerHTML = `
        <img src="${perfil.foto}" alt="Foto da Mimi">
        <div>
            <p>${perfil.mensagem}</p>
            <p>📍 ${perfil.localizacao}</p>
            <p>🕒 Entregas: ${perfil.horario}</p>
            <p>🚗 Área de entrega: ${perfil.area}</p>
        </div>
    `;
}

// --- Renderizar Produtos para Clientes ---
function renderizarProdutos(data) {
    const container = document.getElementById('produtos');
    if (!container) return;
    container.innerHTML = '';
    data.produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto';
        card.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p>Preço: R$ ${produto.preco}</p>
        `;

        // --- Clique no card inteiro abre o pedido ---
        card.addEventListener('click', () => {
            abrirPedido(produto.mensagem);
        });

        container.appendChild(card);
    });
}


// --- Abrir Pedido ---
function abrirPedido(mensagem) {
    const container = document.getElementById('pedido');
    if (!container) return;
    container.innerHTML = `
        <h2>Finalizar Pedido</h2>
        <p>${mensagem}</p>
        <a href="https://wa.me/5521999999999?text=${encodeURIComponent(mensagem)}" target="_blank">
            Enviar pelo WhatsApp
        </a>
    `;
}

// --- Carregar dados do JSON ---
fetch('data.json')
  .then(res => res.json())
  .then(data => {
      renderizarPerfil(data.perfil);   // mostra o perfil
      renderizarProdutos(data);        // mostra os produtos
  })
  .catch(err => console.error("Erro ao carregar data.json:", err));
