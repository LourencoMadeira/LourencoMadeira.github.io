const API_URL = 'https://deisishop.pythonanywhere.com';
let produtos = [];
let referenciaAtual = 2011240049;

document.addEventListener('DOMContentLoaded', async () => {
    await carregarDadosAPI();
    atualizarCesto();
    
    ['filtro-categoria', 'ordenar', 'procurar'].forEach(id => 
        document.getElementById(id).addEventListener(id === 'procurar' ? 'input' : 'change', filtrarProdutos)
    );
    document.getElementById('btn-comprar').addEventListener('click', realizarCompra);
    ['estudante-checkbox', 'cupao-desconto'].forEach(id => 
        document.getElementById(id).addEventListener(id.includes('checkbox') ? 'change' : 'input', calcularValorFinal)
    );
});

async function carregarDadosAPI() {
    try {
        const [produtosRes, categoriasRes] = await Promise.all([
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/categories`)
        ]);
        
        produtos = await produtosRes.json();
        const categorias = await categoriasRes.json();
        
        const select = document.getElementById('filtro-categoria');
        categorias.forEach(cat => {
            select.insertAdjacentHTML('beforeend', `<option value="${cat}">${cat}</option>`);
        });
        
        exibirProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function filtrarProdutos() {
    const categoria = document.getElementById('filtro-categoria').value;
    const ordenacao = document.getElementById('ordenar').value;
    const pesquisa = document.getElementById('procurar').value.toLowerCase();
    
    let filtrados = produtos.filter(p => 
        (!categoria || p.category === categoria) &&
        (!pesquisa || p.title.toLowerCase().includes(pesquisa) || 
         p.description.toLowerCase().includes(pesquisa))
    );
    
    if (ordenacao) {
        filtrados.sort((a, b) => ordenacao === 'crescente' ? a.price - b.price : b.price - a.price);
    }
    
    exibirProdutos(filtrados);
}

function exibirProdutos(lista) {
    document.getElementById('lista-produtos').innerHTML = lista.map(produto => `
        <article>
            <h3>${produto.title}</h3>
            <img src="${produto.image}" alt="${produto.title}">
            <p class="price">${produto.price.toFixed(2)} €</p>
            <button onclick="adicionarAoCesto(${JSON.stringify(produto).replace(/"/g, '&quot;')})">
                + Adicionar ao Cesto
            </button>
        </article>
    `).join('');
}

function adicionarAoCesto(produto) {
    const cesto = getCesto();
    cesto.push(produto);
    setCesto(cesto);
    atualizarCesto();
}

function removerDoCesto(index) {
    const cesto = getCesto();
    cesto.splice(index, 1);
    setCesto(cesto);
    atualizarCesto();
}

function atualizarCesto() {
    const cesto = getCesto();
    const container = document.getElementById('produtos-selecionados');
    const total = cesto.reduce((sum, p) => sum + p.price, 0);
    
    container.innerHTML = cesto.length ? cesto.map((produto, i) => `
        <article>
            <h3>${produto.title}</h3>
            <img src="${produto.image}" alt="${produto.title}">
            <p class="price">${produto.price.toFixed(2)} €</p>
            <button onclick="removerDoCesto(${i})">- Remover do Cesto</button>
        </article>
    `).join('') : '<p>O seu cesto está vazio.</p>';
    
    document.getElementById('custo-total').textContent = total.toFixed(2);
    calcularValorFinal();
}

function calcularValorFinal() {
    const total = parseFloat(document.getElementById('custo-total').textContent);
    const desconto = (document.getElementById('estudante-checkbox').checked ? 0.25 : 0) +
                    (document.getElementById('cupao-desconto').value.trim() ? 0.25 : 0);
    const valorFinal = total * (1 - desconto);
    
    ['valor-final', 'referencia-preview'].forEach((id, index) => {
        if (!document.getElementById(id)) {
            const elem = document.createElement('p');
            elem.id = id;
            elem.style.cssText = index === 0 ? 
                'font-size:1.3rem;font-weight:bold;margin-top:20px' : 
                'font-size:1.1rem;margin-top:10px';
            const ref = index === 0 ? document.getElementById('checkout').nextSibling : 
                                     document.getElementById('valor-final').nextSibling;
            document.getElementById('checkout').parentNode.insertBefore(elem, ref);
        }
    });
    
    if (total > 0) {
        document.getElementById('valor-final').textContent = 
            `Valor final a pagar (com eventuais descontos): ${valorFinal.toFixed(2)} €`;
        document.getElementById('referencia-preview').textContent = 
            `Referência de pagamento: ${formatarReferencia(referenciaAtual)} €`;
    } else {
        document.getElementById('valor-final').textContent = '';
        document.getElementById('referencia-preview').textContent = '';
    }
}

function formatarReferencia(num) {
    const str = num.toString();
    return `${str.slice(0, 6)}-${str.slice(6)}`;
}

async function realizarCompra() {
    const cesto = getCesto();
    
    if (!cesto.length) {
        alert('O cesto está vazio!');
        return;
    }
    
    referenciaAtual++;
    calcularValorFinal();
    
    const dados = {
        products: cesto.map(p => p.id),
        ...(document.getElementById('estudante-checkbox').checked && { student: true }),
        ...(document.getElementById('cupao-desconto').value.trim() && 
            { coupon: document.getElementById('cupao-desconto').value.trim() })
    };
    
    try {
        const response = await fetch(`${API_URL}/buy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (response.ok) {
            const resultado = await response.json();
            const valorFinal = resultado.totalCost || resultado.total_cost;
            
            alert(`Compra realizada com sucesso!\nReferência: ${formatarReferencia(referenciaAtual - 1)}\nValor Final: ${valorFinal.toFixed(2)} €`);
            
            localStorage.removeItem('cesto');
            atualizarCesto();
            document.getElementById('estudante-checkbox').checked = false;
            document.getElementById('cupao-desconto').value = '';
        }
    } catch (error) {
        console.error('Erro ao realizar compra:', error);
    }
}

const getCesto = () => JSON.parse(localStorage.getItem('cesto')) || [];
const setCesto = (cesto) => localStorage.setItem('cesto', JSON.stringify(cesto));
