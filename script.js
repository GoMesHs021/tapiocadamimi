let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

const container = document.getElementById('produtos');
container.innerHTML = '';

produtos.forEach(produto => {
  const card = document.createElement('div');
  card.classList.add('produto');

  card.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}" width="150">
    <h3>${produto.nome}</h3>
    <p>R$ ${produto.preco}</p>
    <a href="https://wa.me/5521999999999?text=${encodeURIComponent(produto.mensagem)}" target="_blank">
      Comprar pelo WhatsApp
    </a>
  `;
  container.appendChild(card);
});

}

carregarProdutos();
