// --- Renderizar Perfil para Clientes ---
function renderizarPerfil(perfil) {
    const container = document.getElementById('perfil');
    container.innerHTML = `
        <img src="${perfil.foto}" alt="Foto da Mimi">
        <div>
            <p>${perfil.mensagem}</p>
            <p>📍 ${perfil.localizacao}</p>
            <p>⏰ Entregas: ${perfil.horario}</p>
            <p>🚚 Área de entrega: ${perfil.area}</p>
        </div>
    `;
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
            `;
            container.appendChild(card);

            // Cliente clica no card para abrir formulário
            card.addEventListener('click', () => {
                abrirFormularioPedido(produto, data.adicionais);
            });
        });
    });
}

// --- Formulário de Pedido ---
function abrirFormularioPedido(produto, adicionais) {
    const formArea = document.getElementById('pedido');
    formArea.innerHTML = `
        <h2>Pedido: ${produto.nome}</h2>
        <p>Preço base: R$ ${produto.preco}</p>
        
        <h3>Adicionais</h3>
        ${adicionais.map(add => `
            <label>
                <input type="checkbox" value="${add.nome} - R$ ${add.preco}" class="check-adicional">
                ${add.nome} - R$ ${add.preco}
            </label><br>
        `).join('')}
        
        <h3>Forma de pagamento</h3>
        <select id="pagamento">
            <option value="Pix">Pix</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão">Cartão</option>
        </select>
        
        <h3>Precisa de troco?</h3>
        <select id="troco">
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
        </select>
        
        <h3>Endereço de entrega</h3>
        <input type="text" id="endereco" placeholder="Rua e número" required>
        
        <h3>Seu WhatsApp</h3>
        <input type="text" id="whatsapp" placeholder="(DDD) 99999-9999" required>
        
        <button id="finalizar-pedido">Finalizar Pedido</button>
    `;

    document.getElementById('finalizar-pedido').addEventListener('click', () => {
        const selecionados = [...document.querySelectorAll('.check-adicional:checked')].map(c => c.value);
        const pagamento = document.getElementById('pagamento').value;
        const troco = document.getElementById('troco').value;
        const endereco = document.getElementById('endereco').value;
        const whatsapp = document.getElementById('whatsapp').value;

        const mensagem = `
Pedido: ${produto.nome}
Adicionais: ${selecionados.join(', ') || 'Nenhum'}
Pagamento: ${pagamento} (Troco: ${troco})
Endereço: ${endereco}
WhatsApp do cliente: ${whatsapp}
        `;

        window.open(`https://wa.me/5521995714872?text=${encodeURIComponent(mensagem)}`, '_blank');
    });
}

// --- Inicialização ---
renderizarProdutos();
