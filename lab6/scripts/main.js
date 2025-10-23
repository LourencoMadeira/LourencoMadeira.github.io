let carrinho = [];

function criarProdutoCesto(produto) {
    const article = document.createElement('article');
    
    const title = document.createElement('h3');
    title.textContent = produto.title;
    
    const image = document.createElement('img');
    image.src = produto.image;
    
    const price = document.createElement('p');
    price.className = 'preco';
    price.textContent = `€${produto.price.toFixed(2)}`;
    
    const button = document.createElement('button');
    button.textContent = '- Remover do cesto';
    
    button.addEventListener('click', () => {
        let produtosSelecionados = JSON.parse(localStorage.getItem('produtos-selecionados'));
        
        const index = produtosSelecionados.findIndex(p => p.id === produto.id);
        
        if (index !== -1) {
            produtosSelecionados.splice(index, 1);
        }
        
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
        
        article.remove();
        
        atualizaCesto();
    });
    
    article.append(title, image, price, button);
    
    return article;
}

function atualizaCesto() {
    let produtosSelecionados = localStorage.getItem('produtos-selecionados');
    
    if (!produtosSelecionados) {
        produtosSelecionados = [];
    } else {
        produtosSelecionados = JSON.parse(produtosSelecionados);
    }
    
    const secaoCesto = document.querySelector('#cesto');
    secaoCesto.innerHTML = '';
    
    const titulo = document.createElement('h2');
    titulo.textContent = 'Cesto de Compras';
    secaoCesto.append(titulo);
    
    produtosSelecionados.forEach(produto => {
        const artigo = criarProdutoCesto(produto);
        secaoCesto.append(artigo);
    });
    
    const precoTotal = produtosSelecionados.reduce((total, produto) => total + produto.price, 0);
    
    const totalElement = document.createElement('p');
    totalElement.textContent = `Preço Total: €${precoTotal.toFixed(2)}`;
    totalElement.style.fontWeight = 'bold';
    totalElement.style.fontSize = '1.5rem';
    secaoCesto.append(totalElement);
}

function criarProduto(produto) {
    const article = document.createElement('article');
    
    const title = document.createElement('h3');
    title.textContent = produto.title;
    
    const image = document.createElement('img');
    image.src = produto.image;
    
    const description = document.createElement('p');
    description.textContent = produto.description;
    
    const price = document.createElement('p');
    price.className = 'preco';
    price.textContent = `€${produto.price.toFixed(2)}`;
    
    const button = document.createElement('button');
    button.textContent = '+ Adicionar ao cesto';
    
    button.addEventListener('click', () => {
        let produtosSelecionados = localStorage.getItem('produtos-selecionados');
        
        if (!produtosSelecionados) {
            produtosSelecionados = [];
        } else {
            produtosSelecionados = JSON.parse(produtosSelecionados);
        }
        
        produtosSelecionados.push(produto);
        
        localStorage.setItem('produtos-selecionados', JSON.stringify(produtosSelecionados));
        
        atualizaCesto();
    });
    
    article.append(title, image, description, price, button);
    
    return article;
}

function carregarProdutos(produtos) {
    const secaoProdutos = document.querySelector('#produtos');
    
    produtos.forEach(produto => {
        const artigo = criarProduto(produto);
        secaoProdutos.append(artigo);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos(produtos);
    atualizaCesto();
});