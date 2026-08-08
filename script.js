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
            <a href="https://wa.me/5521995714872?text=${encodeURIComponent(produto.mensagem)}" target="_blank">
                Comprar pelo WhatsApp
            </a>
        `;
        container.appendChild(card);
    });

    // Eventos de exclusão de produtos
    document.querySelectorAll('.produto .excluir').forEach(btn => {
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

    // Eventos de exclusão de adicionais
    document.querySelectorAll('.adicional .excluir').forEach(btn => {
        btn.addEventListener('click', function() {
            let adicionais = JSON.parse(localStorage.getItem('adicionais')) || [];
            const idx = this.getAttribute('data-index');
            adicionais.splice(idx, 1);
            localStorage.setItem('adicionais', JSON.stringify(adicionais));
            renderizarAdicionaisAdmin();
        });
    });
}

// --- Exportar JSON ---
const exportarBtn = document.getElementById('exportar-json');
if (exportarBtn) {
    exportarBtn.addEventListener('click', function() {
        let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        let adicionais = JSON.parse(localStorage.getItem('adicionais')) || [];
        const data = { produtos, adicionais };
        const jsonStr = JSON.stringify(data, null, 2);

        const preview = document.getElementById('json-preview');
        if (preview) preview.textContent = jsonStr;

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
            `;
            container.appendChild(card);

            // Evento: clicar no card abre formulário
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

    // Evento de finalizar pedido
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
renderizarProdutosAdmin();
renderizarAdicionaisAdmin();
renderizarProdutos();
