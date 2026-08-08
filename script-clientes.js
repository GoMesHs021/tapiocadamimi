// --- Renderizar Perfil ---
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

// --- Renderizar Produtos ---
function renderizarProdutos(data) {
  const container = document.getElementById('produtos');
  container.innerHTML = '';
  data.produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>Preço: R$ ${produto.preco}</p>
    `;
    card.addEventListener('click', () => abrirModal(produto, data.adicionais));
    container.appendChild(card);
  });
}

// --- Abrir Modal ---
function abrirModal(produto, adicionais) {
  const modal = document.getElementById('modal-produto');
  const detalhes = document.getElementById('detalhes-produto');
  const opcoes = document.getElementById('opcoes-adicionais');

  detalhes.innerHTML = `
    <h2>${produto.nome}</h2>
    <img src="${produto.imagem}" alt="${produto.nome}">
    <p>Preço: R$ ${produto.preco}</p>
  `;

  opcoes.innerHTML = '<h3>Adicionais:</h3>';
  adicionais.forEach(add => {
    opcoes.innerHTML += `
      <label>
        <input type="checkbox" value="${add.nome} - R$ ${add.preco}">
        ${add.nome} (R$ ${add.preco})
      </label><br>
    `;
  });

  modal.classList.remove('hidden');

  document.getElementById('btn-finalizar').onclick = () => {
    modal.classList.add('hidden');
    document.getElementById('form-pedido').classList.remove('hidden');
  };
}

// --- Fechar Modal ---
document.getElementById('fechar-modal').onclick = () => {
  document.getElementById('modal-produto').classList.add('hidden');
};

// --- Mostrar opção de troco ---
document.getElementById('cliente-pagamento').addEventListener('change', e => {
  if (e.target.value === 'Dinheiro') {
    document.getElementById('troco-opcao').classList.remove('hidden');
  } else {
    document.getElementById('troco-opcao').classList.add('hidden');
  }
});

// --- Enviar Pedido ---
document.getElementById('pedido-form').addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('cliente-nome').value;
  const telefone = document.getElementById('cliente-telefone').value;
  const endereco = document.getElementById('cliente-endereco').value;
  const numero = document.getElementById('cliente-numero').value;
  const pagamento = document.getElementById('cliente-pagamento').value;
  const troco = pagamento === 'Dinheiro' ? document.getElementById('cliente-troco').value : '';

  // Captura adicionais marcados
  const adicionaisSelecionados = Array.from(document.querySelectorAll('#opcoes-adicionais input:checked'))
    .map(el => el.value)
    .join(', ');

  const mensagem = `Pedido de ${nome}
Telefone: ${telefone}
Endereço: ${endereco}, nº ${numero}
Pagamento: ${pagamento} ${troco ? '- Troco: ' + troco : ''}
Adicionais: ${adicionaisSelecionados || 'Nenhum'}`;

  window.open(`https://wa.me/5521995714872?text=${encodeURIComponent(mensagem)}`, '_blank');
});

// --- Carregar dados do JSON ---
fetch('data.json')
  .then(res => res.json())
  .then(data => {
    renderizarPerfil(data.perfil);
    renderizarProdutos(data);
  })
  .catch(err => console.error("Erro ao carregar data.json:", err));
