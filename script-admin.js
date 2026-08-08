// Carregar dados existentes ou iniciar vazio
let data = JSON.parse(localStorage.getItem('data')) || {
    perfil: {},
    produtos: [],
    adicionais: []
};

// --- Salvar Perfil ---
const formPerfil = document.getElementById('form-perfil');
if (formPerfil) {
    formPerfil.addEventListener('submit', e => {
        e.preventDefault();
        data.perfil = {
            foto: document.getElementById('perfil-foto').value,
            mensagem: document.getElementById('perfil-mensagem').value,
            localizacao: document.getElementById('perfil-localizacao').value,
            horario: document.getElementById('perfil-horario').value,
            area: document.getElementById('perfil-area').value
        };
        localStorage.setItem('data', JSON.stringify(data));
        alert("Perfil atualizado com sucesso!");
    });
}

// --- Adicionar Produto ---
const formProduto = document.getElementById('form-produto');
if (formProduto) {
    formProduto.addEventListener('submit', e => {
        e.preventDefault();
        const novoProduto = {
            nome: document.getElementById('produto-nome').value,
            preco: document.getElementById('produto-preco').value,
            imagem: document.getElementById('produto-imagem').value,
            mensagem: document.getElementById('produto-mensagem').value
        };
        data.produtos.push(novoProduto);
        localStorage.setItem('data', JSON.stringify(data));
        alert("Produto adicionado com sucesso!");
    });
}

// --- Adicionar Adicional ---
const formAdicional = document.getElementById('form-adicional');
if (formAdicional) {
    formAdicional.addEventListener('submit', e => {
        e.preventDefault();
        const novoAdicional = {
            nome: document.getElementById('adicional-nome').value,
            preco: document.getElementById('adicional-preco').value
        };
        data.adicionais.push(novoAdicional);
        localStorage.setItem('data', JSON.stringify(data));
        alert("Adicional adicionado com sucesso!");
    });
}
