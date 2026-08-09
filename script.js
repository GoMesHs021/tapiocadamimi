let produtos = [];
let adicionais = [];
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

// =========================
// Carregar dados do JSON
// =========================
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    // Perfil
    document.getElementById("perfil-foto").src = data.perfil.foto;
    document.getElementById("perfil-mensagem").textContent = data.perfil.mensagem;
    document.getElementById("perfil-localizacao").textContent = "📍 " + data.perfil.localizacao;
    document.getElementById("perfil-horario").textContent = "⏰ " + data.perfil.horario;
    document.getElementById("perfil-area").textContent = "🚚 " + data.perfil.area;

    // Produtos
    produtos = data.produtos.map(p => ({
      nome: p.nome,
      preco: parseFloat(p.preco.replace(",", ".")),
      imagem: p.imagem,
      categoria: p.categoria || "salgada"
    }));

    // Adicionais
    adicionais = data.adicionais.map(a => ({
      nome: a.nome,
      preco: parseFloat(a.preco.replace(",", "."))
    }));
  })
  .catch(error => console.error("Erro ao carregar data.json:", error));

// =========================
// Mostrar produtos por categoria
// =========================
function mostrarCategoria(categoria) {
  const container = document.getElementById("produtos");
  container.style.display = "block";
  container.innerHTML = "";
  const filtrados = produtos.filter(p => p.categoria === categoria);
  if (filtrados.length === 0) {
    container.innerHTML = "<p>Nenhum produto nesta categoria.</p>";
  } else {
    filtrados.forEach((prod, index) => {
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
}

// =========================
// Carrinho
// =========================
function adicionarCarrinho(index) {
  const produto = { ...produtos[index], quantidade: 1, adicionais: [] };
  carrinho.push(produto);
  salvarCarrinho();
  atualizarCarrinho();
}

function atualizarCarrinho() {
  document.getElementById("carrinho").textContent = `Carrinho (${carrinho.length})`;
}

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
          <strong>${item.nome}</strong> - R$ ${item.preco.toFixed(2)}
          <div class="quantidade">
            <button onclick="alterarQuantidade(${i}, -1)">-</button>
            <span>${item.quantidade}</span>
            <button onclick="alterarQuantidade(${i}, 1)">+</button>
            <button onclick="removerItem(${i})">Remover</button>
            <button onclick="mostrarAdicionais(${i})">ADD</button>
          </div>
          <div id="adicionais-${i}" class="adicionais-lista" style="display:none;"></div>
        </div>
      `;
    });
  }

  document.querySelector(".modal").classList.add("show");
});

// Mostrar lista de adicionais para um item específico
function mostrarAdicionais(index) {
  const divAdd = document.getElementById(`adicionais-${index}`);
  divAdd.innerHTML =
