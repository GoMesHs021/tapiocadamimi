// =========================
// Cadastro de Produtos (Admin)
// =========================
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

// =========================
// Cadastro de Adicionais (Admin)
// =========================
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

// =========================
// Renderizar Produtos no Admin
// =========================
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
        `;
        container.appendChild(card);
    });

    // Exclusão de produtos
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

// =========================
// Renderizar Adicionais no Admin
// =========================
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

    // Exclusão de adicionais
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

// =========================
// Exportar JSON (Admin)
// =========================
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

// =========================
// Carrinho de Compras (Clientes)
// =========================
let carrinho = [];
const carrinhoBtn = document.getElementById("carrinho");
const modal = document.querySelector(".modal");
const fecharModal = document.getElementById("fechar-modal");
const detalhesProduto = document.getElementById("detalhes-produto");
const formPedido = document.getElementById("form-pedido");

// Renderizar Produtos para Clientes
function renderizarProdutos() {
    fetch('data.json')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('produtos');
        if (!container) return;
        container.innerHTML = '';
        data.produtos.forEach((produto, index) => {
            const card = document.createElement('div');
            card.className = 'produto';
            card.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p>R$ ${produto.preco}</p>
                <button onclick="adicionarCarrinho(${index})">Adicionar</button>
            `;
            container.appendChild(card);
        });
        // Guardar produtos em memória
        localStorage.setItem('produtosCache', JSON.stringify(data.produtos));
        localStorage.setItem('adicionaisCache', JSON.stringify(data.adicionais));
    });
}

// Adicionar ao carrinho
function adicionarCarrinho(index) {
    let produtos = JSON.parse(localStorage.getItem('produtosCache')) || [];
    const produto = produtos[index];
    carrinho.push(produto);
    atualizarCarrinho();
}

// Atualizar botão carrinho
function atualizarCarrinho() {
    carrinhoBtn.textContent = `Carrinho (${carrinho.length})`;
}

// Abrir modal com carrinho
carrinhoBtn.addEventListener("click", () => {
    detalhesProduto.innerHTML = "";
    if (carrinho.length === 0) {
        detalhesProduto.innerHTML = "<p>Seu carrinho está vazio.</p>";
    } else {
        carrinho.forEach(item => {
            detalhesProduto.innerHTML += `
                <div><strong>${item.nome}</strong> - R$ ${item.preco}</div>
            `;
        });
    }
    modal.classList.add("show");
});

// Fechar modal
if (fecharModal) {
    fecharModal.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}

// Finalizar pedido
if (formPedido) {
    formPedido.addEventListener("submit", (e) => {
        e.preventDefault();
        if (carrinho.length === 0) {
            alert("Adicione produtos ao carrinho antes de finalizar.");
            return;
        }

        const pagamento = document.getElementById("pagamento").value;
        const troco = document.getElementById("troco").value;
        const endereco = document.getElementById("endereco").value;
        const whatsapp = document.getElementById("whatsapp").value;

        let resumo = "📦 Pedido - Tapioca da Mimi\n\n";
        carrinho.forEach(item => {
            resumo += `- ${item.nome} (R$ ${item.preco})\n`;
        });
        resumo += `\n💳 Pagamento: ${pagamento}`;
        resumo += `\nTroco: ${troco}`;
        resumo += `\n📍 Endereço: ${endereco}`;
        resumo += `\n📱 WhatsApp: ${whatsapp}`;

        // Abrir WhatsApp com mensagem
        window.open(`https://wa.me/5521995714872?text=${encodeURIComponent(resumo)}`, '_blank');

        // Limpar carrinho
        carrinho = [];
        atualizarCarrinho();
        modal.classList.remove("show");
    });
}

// =========================
// Inicialização
// =========================
renderizarProdutosAdmin();
renderizarAdicionaisAdmin();
renderizarProdutos();
