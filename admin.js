const form = document.getElementById('produtoForm');
const lista = document.getElementById('listaProdutos');

let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

function renderProdutos() {
  lista.innerHTML = '';
  produtos.forEach((p, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${p.nome}</strong> - ${p.preco}
      <button onclick="editarProduto(${index})">Editar</button>
      <button onclick="removerProduto(${index})">Remover</button>
    `;
    lista.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const novoProduto = {
    nome: document.getElementById('nome').value,
    preco: document.getElementById('preco').value,
    imagem: document.getElementById('imagem').value,
    mensagem: document.getElementById('mensagem').value
  };
  produtos.push(novoProduto);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  renderProdutos();
  form.reset();
});

function editarProduto(index) {
  const p = produtos[index];
  document.getElementById('nome').value = p.nome;
  document.getElementById('preco').value = p.preco;
  document.getElementById('imagem').value = p.imagem;
  document.getElementById('mensagem').value = p.mensagem;
  produtos.splice(index, 1);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  renderProdutos();
}

function removerProduto(index) {
  produtos.splice(index, 1);
  localStorage.setItem('produtos', JSON.stringify(produtos));
  renderProdutos();
}

renderProdutos();
