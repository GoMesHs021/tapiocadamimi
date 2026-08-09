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

// Mostrar lista de adicionais
function mostrarAdicionais(index) {
  const divAdd = document.getElementById(`adicionais-${index}`);
  divAdd.innerHTML = "";
  adicionais.forEach(add => {
    const checked = carrinho[index].adicionais.some(a => a.nome === add.nome);
    divAdd.innerHTML += `
      <label>
        <input type="checkbox" ${checked ? "checked" : ""} 
          onchange="toggleAdicional(${index}, '${add.nome}', ${add.preco}, this.checked)">
        ${add.nome} - R$ ${add.preco}
      </label>
    `;
  });
  divAdd.style.display = "block";
}

function toggleAdicional(index, nome, preco, checked) {
  if (checked) {
    carrinho[index].adicionais.push({ nome, preco });
  } else {
    carrinho[index].adicionais = carrinho[index].adicionais.filter(a => a.nome !== nome);
  }
  salvarCarrinho();
}

function alterarQuantidade(index, delta) {
  carrinho[index].quantidade += delta;
  if (carrinho[index].quantidade <= 0) carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
  document.getElementById("carrinho").click();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
  document.getElementById("carrinho").click();
}

// Fechar modal
document.getElementById("fechar-modal").addEventListener("click", () => {
  document.querySelector(".modal").classList.remove("show");
});

// =========================
// Finalizar pedido
// =========================
document.getElementById("form-pedido").addEventListener("submit", (e) => {
  e.preventDefault();
  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const tipoPedido = document.getElementById("tipo-pedido").value;
  let resumo = "📦 Pedido - Tapioca da Mimi\n\n";

  // Itens do carrinho
  let subtotal = 0;
  carrinho.forEach(item => {
    resumo += `- ${item.nome} x${item.quantidade} (R$ ${item.preco.toFixed(2)})\n`;
    subtotal += item.preco * item.quantidade;
    if (item.adicionais && item.adicionais.length > 0) {
      resumo += `   Adicionais: ${item.adicionais.map(a => a.nome + " R$ " + a.preco).join(", ")}\n`;
      item.adicionais.forEach(a => subtotal += a.preco * item.quantidade);
    }
  });

  resumo += `\nSubtotal: R$ ${subtotal.toFixed(2)}\n`;

  if (tipoPedido === "entrega") {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const endereco = document.getElementById("endereco").value;
    const numero = document.getElementById("numero").value;

    resumo += `Nome: ${nome}\nTelefone: ${telefone}\nEndereço: ${endereco}, Nº ${numero}\n`;
  }

  const pagamento = document.getElementById("pagamento").value;
  resumo += `Pagamento: ${pagamento}\n`;

  if (pagamento === "dinheiro") {
    const precisaTroco = document.getElementById("precisa-troco").value;
    if (precisaTroco === "sim") {
      const troco = document.getElementById("troco").value;
      resumo += `Troco para: R$ ${troco}\n`;
    } else {
      resumo += "Sem necessidade de troco\n";
    }
  }

  const whatsapp = document.getElementById("whatsapp").value;
  resumo += `WhatsApp: ${whatsapp}\n`;

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

// =========================
// Meus pedidos
// =========================
function renderizarPedidos() {
  const lista = document.getElementById("lista-pedidos");
  if (!lista) return;
  lista.innerHTML = "";
 if (pedidos.length === 0) {
  lista.innerHTML = "<p>Nenhum pedido realizado ainda.</p>";
} else {
  pedidos.forEach(p => {
    lista.innerHTML += `
      <div class="pedido">
        <strong>Pedido #${p.id}</strong><br>
        Data: ${p.data}<br>
        Total: R$ ${p.total.toFixed(2)}<br>
        Status: ${p.status}
      </div>
    `;
  });
}
}
