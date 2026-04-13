// Seleciona os elementos HTML que serão manipulados
const form = document.getElementById('produto-form');
const tabela = document.getElementById('produtos-tabela');
const searchInput = document.getElementById('search-input');
const baseUrl = '/produtos';

// Adiciona um "listener" para carregar os produtos assim que a página for completamente carregada
document.addEventListener('DOMContentLoaded', carregarProdutos);

// Função assíncrona para carregar todos os produtos da API
async function carregarProdutos() {
    try {
        // Faz uma requisição GET para a URL base da API de produtos
        // O 'await' garante que a execução espera a resposta da requisição
        const response = await fetch(baseUrl);
        // Converte a resposta para JSON
        const produtos = await response.json();
        // Chama a função para renderizar (exibir) os produtos na tabela
        renderizarTabela(produtos);
        searchInput.value = '';
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function renderizarTabela(dados) {
    tabela.innerHTML = '';

    // Se o dado retornado não for um array (ex: busca por ID que retorna um único objeto)
    const listaProdutos = Array.isArray(dados) ? dados : [dados];

    listaProdutos.forEach(produto => {
        // Ignorar se o objeto estiver vazio (caso de ID não encontrado)
        if (!produto.id) return;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id}</td>
            <td>${produto.nome}</td>
            <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
            <td>${produto.estoque}</td>
            <td>${produto.categoria}</td>
            <td>
                <button class="btn-edit" onclick="prepararEdicao(${produto.id}, '${produto.nome}', ${produto.preco}, ${produto.estoque}, '${produto.categoria}')">Editar</button>
                <button class="btn-delete" onclick="deletarProduto(${produto.id})">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('produto-id').value;

    const produto = {
        nome: document.getElementById('nome').value,
        preco: parseFloat(document.getElementById('preco').value),
        estoque: parseInt(document.getElementById('estoque').value),
        categoria: document.getElementById('categoria').value
    };

    const url = id ? `${baseUrl}/${id}` : baseUrl;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produto)
        });

        if (res.ok) {
            limparFormulario();
            carregarProdutos();
        } else {
            const erro = await res.json();
            alert('Erro ao salvar: ' + erro.mensagem);
        }
    } catch (error) {
        alert('Erro de conexão com o servidor');
    }
};

async function deletarProduto(id) {
    if (confirm(`Tem certeza que deseja excluir o produto #${id}?`)) {
        await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
        carregarProdutos();
    }
}

function prepararEdicao(id, nome, preco, estoque, categoria) {
    document.getElementById('produto-id').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('preco').value = preco;
    document.getElementById('estoque').value = estoque;
    document.getElementById('categoria').value = categoria;

    document.getElementById('form-title').innerText = 'Editando Produto #' + id;
    document.getElementById('btn-cancel').style.display = 'inline-block';
    window.scrollTo(0, 0);
}

function limparFormulario() {
    form.reset();
    document.getElementById('produto-id').value = '';
    document.getElementById('form-title').innerText = 'Novo Produto';
    document.getElementById('btn-cancel').style.display = 'none';
}

document.getElementById('btn-cancel').onclick = limparFormulario;

async function buscar() {
    const termo = searchInput.value.trim();
    if (!termo) return carregarProdutos();

    // Lógica: se for número, busca por ID. Se for texto, busca por nome.
    const urlBusca = !isNaN(termo)
        ? `${baseUrl}/${termo}`
        : `${baseUrl}/nome/${encodeURIComponent(termo)}`;

    const res = await fetch(urlBusca);
    const resultado = await res.json();
    renderizarTabela(resultado);
}