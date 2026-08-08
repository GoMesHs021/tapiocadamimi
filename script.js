async function carregarProdutos() {
  const resposta = await fetch('data.json');
  const dados = await resposta.json();

  const container = document.getElementById('produtos');
  container.innerHTML = '';

  dados.produtos.forEach(p => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}" width="150">
      <h2>${p.nome}</h2>
      <p>R$ ${p.preco.toFixed(2)}</p>
      <a href="https://wa.me/${dados.whatsapp}?text=Quero%20${encodeURIComponent(p.nome)}">
        Comprar pelo WhatsApp
      </a>
    `;
    container.appendChild(card);
  });
}

carregarProdutos();
