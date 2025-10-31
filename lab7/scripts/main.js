// Variáveis globais
let produtos = [];
let produtosFiltrados = [];
let categorias = [];

// URLs da API
const API_BASE = 'https://deisishop.pythonanywhere.com';
const API_PRODUTOS = `${API_BASE}/products/`;
const API_CATEGORIAS = `${API_BASE}/categories/`;
const API_COMPRAR = `${API_BASE}/buy/`;

// ========================================
// FUNÇÕES DE API
// ========================================

async function carregarProdutosDaAPI() {
    try {
        const response = await fetch(API_PRODUTOS);
        const data = await response.json();
        produtos = data;
        produtosFiltrados = data;
        renderizarProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        document.querySelector('#produtos').innerHTML = '<p class="erro">Erro ao carregar produtos. Tente novamente mais tarde.</p>';
    }
}

async function carregarCategorias() {
    try {
        const response = await fetch(API_CATEGORIAS);
        const data = await response.json();
        categorias = data;
        preencherSelectCategorias();
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

function preencherSelectCategorias() {
    const select = document.querySelector('#filtro-categoria');
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        select.appendChild(option);
    });
}

// ========================================
// FUNÇÕES DE RENDERIZAÇÃO DE PRODUTOS
// ========================================

function criarProduto(produto) {
    const article = document.createElement('article');
    
    const title = document.createElement('h3');
    title.textContent = produto.title;
    
    const image = document.createElement('img');
    image.src = produto.image;
    image.alt = produto.title;
    
    const description = document.createElement('p');
    description.textContent = produto.description;
    
    const categoria = document.createElement('p');
    categoria.className = 'categoria';
    categoria.textContent = `Categoria: ${produto.category}`;
    
    const price = document.createElement('p');
    price.className = 'preco';
    price.textContent = `€${produto.price.toFixed(2)}`;
    
    const button = document.createElement('button');
    button.textContent = '+ Adicionar ao cesto';
    
    button.addEventListener('click', () => {
        adicionarAoCesto(produto);
    });
    
    article.append(title, image, description, categoria, price, button);
    
    return article;
}

function renderizarProdutos() {
    const secaoProdutos = document.querySelector('#produtos');
    secaoProdutos.innerHTML = '';
    
    if (produtosFiltrados.length === 0) {
        secaoProdutos.innerHTML = '<p class="sem-produtos">Nenhum produto encontrado.</p>';
        return;
    }
    
    produtosFiltrados.forEach(produto => {
        const artigo = criarProduto(produto);
        secaoProdutos.appendChild(artigo);
    });
}

// ========================================
// FUNÇÕES DE FILTRO, ORDENAÇÃO E PESQUISA
// ========================================

function aplicarFiltros() {
    const categoriaFiltro = document.querySelector('#filtro-categoria').value;
    const ordenacao = document.querySelector('#ordenacao').value;
    const pesquisa = document.querySelector('#pesquisa').value.toLowerCase();
    
    // Filtrar por categoria
    if (categoriaFiltro) {
        produtosFiltrados = produtos.filter(p => p.category === categoriaFiltro);
    } else {
        produtosFiltrados = [...produtos];
    }
    
    // Filtrar por pesquisa
    if (pesquisa) {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.title.toLowerCase().includes(pesquisa)
        );
    }
    
    // Ordenar
    if (ordenacao === 'preco-asc') {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    } else if (ordenacao === 'preco-desc') {
        produtosFiltrados.sort((a, b) => b.price - a.price);
    }
    
    renderizarProdutos();
}

// ========================================
// FUNÇÕES DO CESTO
// ========================================

function adicionarAoCesto(produto) {
    let produtosSelecionados = obterCesto();
    produtosSelecionados.push(produto);
    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    atualizarCesto();
}

function obterCesto() {
    const cesto = localStorage.getItem('produtos-selecionados');
    return cesto ? JSON.parse(cesto) : [];
}

function criarProdutoCesto(produto, index) {
    const article = document.createElement('article');
    article.className = 'produto-cesto';
    
    const title = document.createElement('h3');
    title.textContent = produto.title;
    
    const image = document.createElement('img');
    image.src = produto.image;
    image.alt = produto.title;
    
    const price = document.createElement('p');
    price.className = 'preco';
    price.textContent = `€${produto.price.toFixed(2)}`;
    
    const button = document.createElement('button');
    button.textContent = '- Remover do cesto';
    
    button.addEventListener('click', () => {
        removerDoCesto(index);
    });
    
    article.append(title, image, price, button);
    
    return article;
}

function removerDoCesto(index) {
    let produtosSelecionados = obterCesto();
    produtosSelecionados.splice(index, 1);
    localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
    atualizarCesto();
}

function atualizarCesto() {
    const produtosSelecionados = obterCesto();
    const secaoCesto = document.querySelector('#cesto');
    secaoCesto.innerHTML = '<h2>Cesto de Compras</h2>';
    
    if (produtosSelecionados.length === 0) {
        secaoCesto.innerHTML += '<p>O seu cesto está vazio.</p>';
        document.querySelector('#checkout').style.display = 'none';
        return;
    }
    
    produtosSelecionados.forEach((produto, index) => {
        const artigo = criarProdutoCesto(produto, index);
        secaoCesto.appendChild(artigo);
    });
    
    const precoTotal = calcularTotal(produtosSelecionados);
    
    const totalElement = document.createElement('p');
    totalElement.className = 'total-cesto';
    totalElement.textContent = `Preço Total: €${precoTotal.toFixed(2)}`;
    secaoCesto.appendChild(totalElement);
    
    // Mostrar secção de checkout
    document.querySelector('#checkout').style.display = 'block';
    document.querySelector('#total-checkout').textContent = precoTotal.toFixed(2);
    document.querySelector('#resultado-compra').style.display = 'none';
}

function calcularTotal(produtos) {
    return produtos.reduce((total, produto) => total + produto.price, 0);
}

// ========================================
// FUNÇÕES DE CHECKOUT
// ========================================

async function realizarCompra() {
    const produtosSelecionados = obterCesto();
    
    if (produtosSelecionados.length === 0) {
        alert('O cesto está vazio!');
        return;
    }
    
    const estudante = document.querySelector('#estudante-checkbox').checked;
    const cupao = document.querySelector('#cupao-input').value.trim();
    
    // Preparar dados para enviar
    const produtosIds = produtosSelecionados.map(p => p.id);
    
    const dados = {
        products: produtosIds,
        student: estudante,
        coupon: cupao
    };
    
    try {
        const response = await fetch(API_COMPRAR, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            mostrarResultadoCompra(resultado);
            // Limpar cesto
            localStorage.removeItem('produtos-selecionados');
            atualizarCesto();
        } else {
            alert(`Erro: ${resultado.message || 'Erro ao processar compra'}`);
        }
    } catch (error) {
        console.error('Erro ao realizar compra:', error);
        alert('Erro ao conectar com o servidor. Tente novamente.');
    }
}

function mostrarResultadoCompra(dados) {
    const divResultado = document.querySelector('#resultado-compra');
    
    let mensagemDesconto = '';
    if (dados.totalDiscount > 0) {
        mensagemDesconto = `
            <p class="desconto-info">💰 Desconto aplicado: €${dados.totalDiscount.toFixed(2)}</p>
        `;
    }
    
    divResultado.innerHTML = `
        <div class="compra-sucesso">
            <h3>✅ Compra Realizada com Sucesso!</h3>
            <p class="referencia">Referência de Pagamento: <strong>${dados.reference}</strong></p>
            ${mensagemDesconto}
            <p class="total-final">Total a Pagar: <strong>€${dados.totalCost.toFixed(2)}</strong></p>
            <p class="mensagem-final">Obrigado pela sua compra! 🎉</p>
        </div>
    `;
    
    divResultado.style.display = 'block';
    
    // Scroll para o resultado
    divResultado.scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Carregar produtos e categorias
    carregarProdutosDaAPI();
    carregarCategorias();
    
    // Atualizar cesto inicial
    atualizarCesto();
    
    // Filtros e pesquisa
    document.querySelector('#filtro-categoria').addEventListener('change', aplicarFiltros);
    document.querySelector('#ordenacao').addEventListener('change', aplicarFiltros);
    document.querySelector('#pesquisa').addEventListener('input', aplicarFiltros);
    
    // Botão de comprar
    document.querySelector('#btn-comprar').addEventListener('click', realizarCompra);
});