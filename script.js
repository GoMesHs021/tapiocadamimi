// Produtos de exemplo
const produtos = [
  { nome: "Tapioca Tradicional", preco: 8, imagem: "tapioca1.jpg" },
  { nome: "Tapioca com Queijo", preco: 10, imagem: "tapioca2.jpg" },
  { nome: "Tapioca Doce", preco: 12, imagem: "tapioca3.jpg" }
];

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

// Renderizar produtos
function renderizarProdutos() {
  const container = document.getElementById("produtos");
  container.innerHTML = "";
  produtos.forEach((prod, index) => {
    const card = document.createElement("div");
    card.className = "produto";
    card.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p>R$ ${prod.preco.toFixed(2)}</p>
      <button onclick="adicionarCarrinho(${index})">Adicionar</button>
    `;
    container.appendChild(card);
  });
}
renderizarProdutos();

// Adicionar ao carrinho
function adicionarCarrinho(index) {
  const produto = { ...produtos[index], quantidade: 1 };
  carrinho.push(produto);
  salvarCarrinho();
  atualizarCarrinho();
}

// Atualizar carrinho
function atualizarCarrinho() {
  document.getElementById("carrinho").textContent = `Carrinho (${carrinho.length})`;
}

// Salvar carrinho
function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

// Abrir modal carrinho
document.getElementById("carrinho").addEventListener("click", () => {
  const detalhes = document.getElementById("detalhes-produto");
  detalhes.innerHTML = "";
  if (carrinho.length === 0) {
    detalhes.innerHTML = "<p>Seu carrinho está vazio.</p>";
  } else {
    carrinho.forEach((item, i) => {
      detalhes.innerHTML += `
        <div>
          <strong>${item.nome}</strong> - R$ ${item.preco} 
          <div class="quantidade">
            <button onclick="alterarQuantidade(${i}, -1)">-</button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidade(${i}, 1)">+</button>
            <button onclick="removerItem(${i})">Remover</button>
          </div>
        </div>
      `;
    });
  }
  document.querySelector(".modal").classList.add("show");
});

// Alterar quantidade
function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
  document.getElementById("carrinho").click();
}

// Remover item
function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
  document.getElementById("carrinho").click();
}

// Finalizar pedido
document.getElementById("form-pedido").addEventListener("submit", (e) => {
  e.preventDefault();
  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }
  const pagamento = document.getElementById("pagamento").value;
  const troco = document.getElementById("troco").value;
  const endereco = document.getElementById("endereco").value;
  const whatsapp = document.getElementById("whatsapp").value;

  let resumo = "📦 Pedido - Tapioca da Mimi\n\n";
  let subtotal = 0;
  carrinho.forEach(item => {
    resumo += `- ${item.nome} x${item.quantidade} (R$ ${item.preco})\n`;
    subtotal += item.preco * item.quantidade;
  });
  resumo += `\nSubtotal: R$ ${subtotal.toFixed(2)}`;
  resumo += `\nPagamento: ${pagamento} (Troco: ${troco})`;
  resumo += `\nEndereço: ${endereco}`;
  resumo += `\nWhatsApp: ${whatsapp}`;

  // Salvar pedido no histórico
  const pedido = {
    id: Date.now(),
    itens: carrinho,
    total: subtotal,
    status: "Recebido",
    data: new Date().toLocaleString()
  };
  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  // Abrir WhatsApp
  window.open(`https://wa.me/5521995714872?text=${encodeURIComponent(resumo)}`, "_blank");

  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
  document.querySelector(".modal").classList.remove("show");
  renderizarPedidos();
});

// Renderizar pedidos
function renderizarPedidos() {
  const lista = document.getElementById("lista-pedidos");
  lista
