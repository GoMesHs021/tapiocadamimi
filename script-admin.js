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
        atualizarPreviewPerfil();
        alert("Perfil atualizado com sucesso!");
    });
}

function atualizarPreviewPerfil() {
    const container = document.getElementById('preview-perfil');
    if (!container) return;
    container.innerHTML = `
        <img src="${data.perfil.foto}" alt="Foto" style="width:80px;height:80px;border-radius:50%">
        <p>${data.perfil.mensagem}</p>
        <p>📍 ${data.perfil.localizacao}</p>
        <p>🕒 ${data.perfil.horario}</p>
        <p>🚗 ${data.perfil.area}</p>
    `;
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
        atualizarListaProdutos();
        alert("Produto adicionado com sucesso!");
    });
}

function atualizarListaProdutos() {
    const container = document.getElementById('lista-produtos');
    if (!container) return;
    container.innerHTML = '';
    data.produtos.forEach((p, i) => {
        container.innerHTML += `
            <div class="produto">
                <img src="${p.imagem}" alt="${p.nome}" style="width:100px">
                <h3>${p.nome}</h3>
                <p>R$ ${p.preco}</p>
                <button onclick="removerProduto(${i})">Excluir</button>
            </div>
        `;
    });
}
function removerProduto(i) {
    data.produtos.splice(i, 1);
    localStorage.setItem('data', JSON.stringify(data));
    atualizarListaProdutos();
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
        atualizarListaAdicionais();
        alert("Adicional adicionado com sucesso!");
    });
}

function atualizarListaAdicionais() {
    const container = document.getElementById('lista-adicionais');
    if (!container) return;
    container.innerHTML = '';
    data.adicionais.forEach((a, i) => {
        container.innerHTML += `
            <p>${a.nome} - R$ ${a.preco} 
            <button onclick="removerAdicional(${i})">Excluir</button></p>
        `;
    });
}
function removerAdicional(i) {
    data.adicionais.splice(i, 1);
    localStorage.setItem('data', JSON.stringify(data));
    atualizarListaAdicionais();
}

// --- Exportar JSON ---
const exportarBtn = document.getElementById('exportar-json');
if (exportarBtn) {
    exportarBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// --- Inicializar previews ao carregar ---
atualizarPreviewPerfil();
atualizarListaProdutos();
atualizarListaAdicionais();
