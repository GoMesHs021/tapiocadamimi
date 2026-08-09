// Produtos de exemplo
const produtos = [
  { nome: "Tapioca Tradicional", preco: 8, imagem: "tapioca1.jpg" },
  { nome: "Tapioca com Queijo", preco: 10, imagem: "tapioca2.jpg" },
  { nome: "Tapioca Doce", preco: 12, imagem: "tapioca3.jpg" }
];

let carrinho = [];

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
  carrinho.push(produtos[index]);
  atualizarCarrinho();
  mostrarToast("Produto adicionado ao carrinho!");
}

// Atualizar carrinho
function atualizarCarrinho() {
  document.getElementById("carrinho").textContent = `Carrinho (${carrinho.length})`;
}

// Abrir modal carrinho
