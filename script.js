const form = document.getElementById('form-produto');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const preco = document.getElementById('preco').value;
    const imagem = document.getElementById('imagem').value;
    const mensagem = document.getElementById('mensagem').value;

    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push({ nome, preco, imagem, mensagem });
    localStorage.setItem('produtos', JSON.stringify(produtos));

    // Agora renderiza na tela do admin também
    renderizarProdutos();

    e.target.reset();
    alert("Produto adicionado! Veja abaixo na lista.");
  });
}
