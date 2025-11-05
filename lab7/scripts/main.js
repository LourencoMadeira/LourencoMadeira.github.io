const API_URL = 'https://deisishop.pythonanywhere.com';
let produtos = [];
let referenciaAtual = 2011240049;

// DOMContentLoaded: Evento disparado quando o DOM está construído
document.addEventListener('DOMContentLoaded', function() {
    carregarDadosAPI();
    atualizarCesto();
    
    // addEventListener: Associa eventos a elementos
    document.getElementById('filtro-categoria').addEventListener('change', filtrarProdutos);
    document.getElementById('ordenar').addEventListener('change', filtrarProdutos);
    document.getElementById('procurar').addEventListener('input', filtrarProdutos);
    
    document.getElementById('btn-comprar').addEventListener('click', realizarCompra);
    document.getElementById('estudante-checkbox').addEventListener('change', calcularValorFinal);
    document.getElementById('cupao-desconto').addEventListener('input', calcularValorFinal);
});

// fetch: Faz pedidos HTTP e retorna Promise
// .then() processa a resposta quando chega
function carregarDadosAPI() {
    fetch(`${API_URL}/products`)
        .then(response => response.json())
        .then(data => {
            produtos = data;
            exibirProdutos(produtos);
            carregarCategorias();
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
    
    // MODIFICAÇÃO 1: Ordenar produtos por preço ao carregar
    // O que faz: Ordena automaticamente produtos do mais barato ao mais caro
    // Como fazer:
    /*
    fetch(`${API_URL}/products`)
        .then(response => response.json())
        .then(data => {
            produtos = data;
            produtos.sort(function(a, b) {
                return a.price - b.price;
            });
            exibirProdutos(produtos);
            carregarCategorias();
        })
    */
}

// createElement() + append(): Cria elementos HTML dinamicamente
function carregarCategorias() {
    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then(categorias => {
            const select = document.getElementById('filtro-categoria');
            categorias.forEach(function(cat) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.append(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar categorias:', error);
        });
    
    // MODIFICAÇÃO 2: Ordenar categorias alfabeticamente
    // O que faz: Mostra categorias em ordem alfabética no menu
    // Como fazer:
    /*
    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then(categorias => {
            categorias.sort();
            const select = document.getElementById('filtro-categoria');
            categorias.forEach(function(cat) {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.append(option);
            });
        })
    */
}

// forEach: Percorre array executando função para cada elemento
// sort: Ordena array modificando-o
function filtrarProdutos() {
    const categoria = document.getElementById('filtro-categoria').value;
    const ordenacao = document.getElementById('ordenar').value;
    const pesquisa = document.getElementById('procurar').value.toLowerCase();
    
    // Filtrar produtos manualmente com forEach
    let filtrados = [];
    produtos.forEach(function(p) {
        const categoriaMatch = !categoria || p.category === categoria;
        const pesquisaMatch = !pesquisa || 
            p.title.toLowerCase().includes(pesquisa) || 
            p.description.toLowerCase().includes(pesquisa);
        
        if (categoriaMatch && pesquisaMatch) {
            filtrados.push(p);
        }
    });
    
    // sort: Ordena array com função de comparação
    if (ordenacao === 'crescente') {
        filtrados.sort(function(a, b) {
            return a.price - b.price;
        });
    } else if (ordenacao === 'decrescente') {
        filtrados.sort(function(a, b) {
            return b.price - a.price;
        });
    }
    
    exibirProdutos(filtrados);
    
    // MODIFICAÇÃO 3: Filtrar por intervalo de preços
    // O que faz: Filtra produtos entre preço mínimo e máximo
    // Passo 1: Adicionar inputs no HTML:
    // <input type="number" id="preco-min" placeholder="Preço mín">
    // <input type="number" id="preco-max" placeholder="Preço máx">
    // Passo 2: Adicionar antes do exibirProdutos():
    /*
    const precoMin = parseFloat(document.getElementById('preco-min').value) || 0;
    const precoMax = parseFloat(document.getElementById('preco-max').value) || 999999;
    
    let filtradosPreco = [];
    filtrados.forEach(function(p) {
        if (p.price >= precoMin && p.price <= precoMax) {
            filtradosPreco.push(p);
        }
    });
    filtrados = filtradosPreco;
    */
    
    // MODIFICAÇÃO 4: Ordenar por avaliação (rating)
    // O que faz: Ordena produtos pela avaliação mais alta
    // Passo 1: Adicionar option no HTML:
    // <option value="rating">Melhor Avaliação</option>
    // Passo 2: Adicionar após as outras ordenações:
    /*
    else if (ordenacao === 'rating') {
        filtrados.sort(function(a, b) {
            return b.rating.rate - a.rating.rate;
        });
    }
    */
}

// createElement: Cria novo elemento HTML
// append: Adiciona elemento ao DOM
function exibirProdutos(lista) {
    const container = document.getElementById('lista-produtos');
    container.innerHTML = '';
    
    if (lista.length === 0) {
        container.innerHTML = '<p class="sem-produtos">Nenhum produto encontrado.</p>';
        return;
    }
    
    lista.forEach(function(produto) {
        const article = document.createElement('article');
        
        const titulo = document.createElement('h3');
        titulo.textContent = produto.title;
        
        const imagem = document.createElement('img');
        imagem.src = produto.image;
        imagem.alt = produto.title;
        
        const preco = document.createElement('p');
        preco.className = 'price';
        preco.textContent = `${produto.price.toFixed(2)} €`;
        
        const botao = document.createElement('button');
        botao.textContent = '+ Adicionar ao Cesto';
        botao.onclick = function() {
            adicionarAoCesto(produto);
        };
        
        article.append(titulo);
        article.append(imagem);
        article.append(preco);
        article.append(botao);
        
        container.append(article);
    });
    
    // MODIFICAÇÃO 5: Mostrar descrição do produto
    // O que faz: Adiciona descrição abaixo do preço (limitada a 100 caracteres)
    // Adicionar após criar o preco:
    /*
    const descricao = document.createElement('p');
    descricao.className = 'descricao';
    descricao.textContent = produto.description.substring(0, 100) + '...';
    
    article.append(titulo);
    article.append(imagem);
    article.append(preco);
    article.append(descricao);
    article.append(botao);
    */
    
    // MODIFICAÇÃO 6: Mostrar avaliação (rating)
    // O que faz: Mostra estrelas e número de avaliações
    // Adicionar após criar o preco:
    /*
    const rating = document.createElement('p');
    rating.className = 'rating';
    rating.textContent = `${produto.rating.rate} ★ (${produto.rating.count} avaliações)`;
    
    article.append(titulo);
    article.append(imagem);
    article.append(preco);
    article.append(rating);
    article.append(botao);
    */
    
    // MODIFICAÇÃO 7: Botão para mostrar/ocultar descrição completa
    // O que faz: Toggle para ver descrição completa do produto
    // Adicionar no final do forEach, antes de append(article):
    /*
    const btnDetalhes = document.createElement('button');
    btnDetalhes.textContent = 'Ver Detalhes';
    const descricaoCompleta = document.createElement('p');
    descricaoCompleta.textContent = produto.description;
    descricaoCompleta.style.display = 'none';
    
    btnDetalhes.onclick = function() {
        if (descricaoCompleta.style.display === 'none') {
            descricaoCompleta.style.display = 'block';
            btnDetalhes.textContent = 'Ocultar Detalhes';
        } else {
            descricaoCompleta.style.display = 'none';
            btnDetalhes.textContent = 'Ver Detalhes';
        }
    };
    
    article.append(btnDetalhes);
    article.append(descricaoCompleta);
    */
}

// localStorage: Armazena dados que persistem após fechar browser
// push: Adiciona elemento ao fim do array
function adicionarAoCesto(produto) {
    const cesto = getCesto();
    cesto.push(produto);
    setCesto(cesto);
    atualizarCesto();
    
    // MODIFICAÇÃO 8: Notificação ao adicionar produto
    // O que faz: Mostra mensagem confirmando que produto foi adicionado
    // Opção 1 - Alert simples:
    /*
    alert(`${produto.title} foi adicionado ao cesto!`);
    */
    
    // Opção 2 - Notificação elegante:
    /*
    const notif = document.createElement('div');
    notif.className = 'notificacao';
    notif.textContent = `✓ ${produto.title} adicionado!`;
    notif.style.position = 'fixed';
    notif.style.top = '20px';
    notif.style.right = '20px';
    notif.style.backgroundColor = '#27ae60';
    notif.style.color = 'white';
    notif.style.padding = '15px';
    notif.style.borderRadius = '5px';
    document.body.append(notif);
    setTimeout(function() {
        notif.remove();
    }, 2000);
    */
}

// splice: Remove elementos do array
function removerDoCesto(index) {
    const cesto = getCesto();
    cesto.splice(index, 1);
    setCesto(cesto);
    atualizarCesto();
}

// forEach com índice: forEach(function(elemento, índice) {...})
function atualizarCesto() {
    const cesto = getCesto();
    const container = document.getElementById('produtos-selecionados');
    container.innerHTML = '';
    
    let total = 0;
    
    if (cesto.length === 0) {
        container.innerHTML = '<p>O seu cesto está vazio.</p>';
    } else {
        cesto.forEach(function(produto, index) {
            const article = document.createElement('article');
            
            const titulo = document.createElement('h3');
            titulo.textContent = produto.title;
            
            const imagem = document.createElement('img');
            imagem.src = produto.image;
            imagem.alt = produto.title;
            
            const preco = document.createElement('p');
            preco.className = 'price';
            preco.textContent = `${produto.price.toFixed(2)} €`;
            
            const botao = document.createElement('button');
            botao.textContent = '- Remover do Cesto';
            botao.onclick = function() {
                removerDoCesto(index);
            };
            
            article.append(titulo);
            article.append(imagem);
            article.append(preco);
            article.append(botao);
            
            container.append(article);
            
            total = total + produto.price;
        });
    }
    
    document.getElementById('custo-total').textContent = total.toFixed(2);
    calcularValorFinal();
    
    // MODIFICAÇÃO 9: Mostrar contador de produtos
    // O que faz: Exibe quantos produtos estão no cesto
    // Adicionar no final da função:
    /*
    if (!document.getElementById('contador-cesto')) {
        const contador = document.createElement('p');
        contador.id = 'contador-cesto';
        contador.style.fontWeight = 'bold';
        contador.style.marginTop = '10px';
        document.getElementById('cesto').append(contador);
    }
    document.getElementById('contador-cesto').textContent = 
        `Total de produtos: ${cesto.length}`;
    */
    
    // MODIFICAÇÃO 10: Agrupar produtos repetidos com quantidade
    // O que faz: Conta produtos iguais e mostra "Produto x3"
    // Substituir todo o else acima por:
    /*
    else {
        const produtosAgrupados = {};
        
        cesto.forEach(function(produto) {
            if (produtosAgrupados[produto.id]) {
                produtosAgrupados[produto.id].quantidade++;
            } else {
                produtosAgrupados[produto.id] = {
                    id: produto.id,
                    title: produto.title,
                    image: produto.image,
                    price: produto.price,
                    quantidade: 1
                };
            }
        });
        
        for (let id in produtosAgrupados) {
            const produto = produtosAgrupados[id];
            const article = document.createElement('article');
            
            const titulo = document.createElement('h3');
            titulo.textContent = `${produto.title} (x${produto.quantidade})`;
            
            const imagem = document.createElement('img');
            imagem.src = produto.image;
            imagem.alt = produto.title;
            
            const preco = document.createElement('p');
            preco.className = 'price';
            preco.textContent = `${(produto.price * produto.quantidade).toFixed(2)} €`;
            
            const botao = document.createElement('button');
            botao.textContent = '- Remover';
            botao.onclick = function() {
                let index = -1;
                for (let i = 0; i < cesto.length; i++) {
                    if (cesto[i].id === produto.id) {
                        index = i;
                        break;
                    }
                }
                removerDoCesto(index);
            };
            
            article.append(titulo);
            article.append(imagem);
            article.append(preco);
            article.append(botao);
            container.append(article);
            
            total = total + (produto.price * produto.quantidade);
        }
    }
    */
}

// element.style: Modifica propriedades CSS de um elemento
function calcularValorFinal() {
    const total = parseFloat(document.getElementById('custo-total').textContent);
    
    let desconto = 0;
    
    if (document.getElementById('estudante-checkbox').checked) {
        desconto = desconto + 0.25;
    }
    
    if (document.getElementById('cupao-desconto').value.trim()) {
        desconto = desconto + 0.25;
    }
    
    const valorFinal = total * (1 - desconto);
    
    if (!document.getElementById('valor-final')) {
        const elemValor = document.createElement('p');
        elemValor.id = 'valor-final';
        elemValor.style.fontSize = '1.3rem';
        elemValor.style.fontWeight = 'bold';
        elemValor.style.marginTop = '20px';
        document.getElementById('checkout').append(elemValor);
    }
    
    if (!document.getElementById('referencia-preview')) {
        const elemRef = document.createElement('p');
        elemRef.id = 'referencia-preview';
        elemRef.style.fontSize = '1.1rem';
        elemRef.style.marginTop = '10px';
        document.getElementById('checkout').append(elemRef);
    }
    
    if (total > 0) {
        document.getElementById('valor-final').textContent = 
            `Valor final a pagar (com eventuais descontos): ${valorFinal.toFixed(2)} €`;
        document.getElementById('referencia-preview').textContent = 
            `Referência de pagamento: ${formatarReferencia(referenciaAtual)} €`;
    } else {
        document.getElementById('valor-final').textContent = '';
        document.getElementById('referencia-preview').textContent = '';
    }
    
    // MODIFICAÇÃO 11: Mostrar detalhes dos descontos
    // O que faz: Exibe que descontos foram aplicados
    // Adicionar no final da função:
    /*
    if (!document.getElementById('detalhes-desconto')) {
        const detalhes = document.createElement('p');
        detalhes.id = 'detalhes-desconto';
        detalhes.style.marginTop = '10px';
        document.getElementById('checkout').append(detalhes);
    }
    
    let textoDesconto = '';
    if (desconto > 0) {
        textoDesconto = 'Descontos aplicados: ';
        if (document.getElementById('estudante-checkbox').checked) {
            textoDesconto += '25% estudante ';
        }
        if (document.getElementById('cupao-desconto').value.trim()) {
            textoDesconto += '25% cupão ';
        }
        textoDesconto += `(Total: ${(desconto * 100).toFixed(0)}%)`;
    }
    document.getElementById('detalhes-desconto').textContent = textoDesconto;
    */
    
    // MODIFICAÇÃO 12: Validar cupão específico
    // O que faz: Só aceita cupões válidos (ex: "DESCONTO2024")
    // Substituir a verificação do cupão por:
    /*
    const cupao = document.getElementById('cupao-desconto').value.trim().toUpperCase();
    const cupoesValidos = ['DESCONTO2024', 'PROMO50', 'BEMVINDO'];
    let cupaoValido = false;
    
    cupoesValidos.forEach(function(c) {
        if (c === cupao) {
            cupaoValido = true;
        }
    });
    
    if (cupaoValido) {
        desconto = desconto + 0.25;
    }
    */
}

function formatarReferencia(num) {
    const str = num.toString();
    return `${str.slice(0, 6)}-${str.slice(6)}`;
}

// fetch POST: Envia dados ao servidor
// JSON.stringify: Converte objeto em string JSON
function realizarCompra() {
    const cesto = getCesto();
    
    if (cesto.length === 0) {
        alert('O cesto está vazio!');
        return;
    }
    
    referenciaAtual++;
    calcularValorFinal();
    
    const dados = {
        products: []
    };
    
    cesto.forEach(function(p) {
        dados.products.push(p.id);
    });
    
    if (document.getElementById('estudante-checkbox').checked) {
        dados.student = true;
    }
    
    const cupao = document.getElementById('cupao-desconto').value.trim();
    if (cupao) {
        dados.coupon = cupao;
    }
    
    fetch(`${API_URL}/buy/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(function(resultado) {
        const valorFinal = resultado.totalCost || resultado.total_cost;
        
        alert(`Compra realizada com sucesso!\nReferência: ${formatarReferencia(referenciaAtual - 1)}\nValor Final: ${valorFinal.toFixed(2)} €`);
        
        localStorage.removeItem('cesto');
        atualizarCesto();
        document.getElementById('estudante-checkbox').checked = false;
        document.getElementById('cupao-desconto').value = '';
    })
    .catch(function(error) {
        console.error('Erro ao realizar compra:', error);
    });
    
    // MODIFICAÇÃO 13: Guardar histórico de compras
    // O que faz: Salva todas as compras no localStorage
    // Substituir o .then(function(resultado) {...}) por:
    /*
    .then(function(resultado) {
        const valorFinal = resultado.totalCost || resultado.total_cost;
        
        let historico = JSON.parse(localStorage.getItem('historico-compras'));
        if (!historico) {
            historico = [];
        }
        
        historico.push({
            data: new Date().toLocaleDateString(),
            referencia: formatarReferencia(referenciaAtual - 1),
            valorFinal: valorFinal,
            produtos: cesto
        });
        
        localStorage.setItem('historico-compras', JSON.stringify(historico));
        
        alert(`Compra realizada com sucesso!\nReferência: ${formatarReferencia(referenciaAtual - 1)}\nValor Final: ${valorFinal.toFixed(2)} €`);
        
        localStorage.removeItem('cesto');
        atualizarCesto();
        document.getElementById('estudante-checkbox').checked = false;
        document.getElementById('cupao-desconto').value = '';
    })
    */
    
    // MODIFICAÇÃO 14: Pedir confirmação antes de comprar
    // O que faz: Mostra janela de confirmação antes de finalizar
    // Adicionar no início da função, depois do if (cesto.length === 0):
    /*
    const totalProdutos = cesto.length;
    const confirmar = confirm(`Deseja finalizar a compra de ${totalProdutos} produto(s)?`);
    if (!confirmar) {
        return;
    }
    */
}

// localStorage.getItem: Recupera dados armazenados
// JSON.parse: Converte string JSON em objeto
function getCesto() {
    const cestoJSON = localStorage.getItem('cesto');
    if (cestoJSON) {
        return JSON.parse(cestoJSON);
    }
    return [];
}

// localStorage.setItem: Guarda dados no navegador
// JSON.stringify: Converte objeto em string JSON
function setCesto(cesto) {
    localStorage.setItem('cesto', JSON.stringify(cesto));
}

// MODIFICAÇÃO 15: Botão para limpar todo o cesto
// O que faz: Remove todos os produtos do cesto de uma vez
// Passo 1: Adicionar botão no HTML (secção #cesto):
// <button id="btn-limpar-cesto">Limpar Cesto</button>
// Passo 2: Adicionar função:
/*
function limparCesto() {
    const confirmar = confirm('Deseja remover todos os produtos do cesto?');
    if (confirmar) {
        localStorage.removeItem('cesto');
        atualizarCesto();
    }
}
*/
// Passo 3: Adicionar event listener no DOMContentLoaded:
/*
document.getElementById('btn-limpar-cesto').addEventListener('click', limparCesto);
*/

// MODIFICAÇÃO 16: Destacar termo pesquisado
// O que faz: Marca termo pesquisado nos títulos com fundo amarelo
// No exibirProdutos, substituir:
// titulo.textContent = produto.title;
// Por:
/*
const pesquisa = document.getElementById('procurar').value;
if (pesquisa) {
    const tituloOriginal = produto.title;
    const partes = tituloOriginal.split(new RegExp('(' + pesquisa + ')', 'gi'));
    titulo.innerHTML = '';
    partes.forEach(function(parte) {
        if (parte.toLowerCase() === pesquisa.toLowerCase()) {
            const mark = document.createElement('mark');
            mark.textContent = parte;
            mark.style.backgroundColor = 'yellow';
            titulo.append(mark);
        } else {
            const span = document.createElement('span');
            span.textContent = parte;
            titulo.append(span);
        }
    });
} else {
    titulo.textContent = produto.title;
}
*/

// MODIFICAÇÃO 17: Mostrar histórico de compras
// O que faz: Cria página para ver todas as compras realizadas
// Passo 1: Adicionar secção no HTML:
// <section id="historico">
//   <h2>Histórico de Compras</h2>
//   <div id="lista-historico"></div>
// </section>
// Passo 2: Adicionar função:
/*
function mostrarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historico-compras'));
    const container = document.getElementById('lista-historico');
    container.innerHTML = '';
    
    if (!historico || historico.length === 0) {
        container.innerHTML = '<p>Nenhuma compra realizada ainda.</p>';
        return;
    }
    
    historico.forEach(function(compra) {
        const div = document.createElement('div');
        div.style.border = '1px solid #ddd';
        div.style.padding = '10px';
        div.style.marginBottom = '10px';
        div.style.borderRadius = '5px';
        
        const p1 = document.createElement('p');
        p1.textContent = `Data: ${compra.data}`;
        
        const p2 = document.createElement('p');
        p2.textContent = `Referência: ${compra.referencia}`;
        
        const p3 = document.createElement('p');
        p3.textContent = `Valor: ${compra.valorFinal.toFixed(2)} €`;
        
        const p4 = document.createElement('p');
        p4.textContent = `Produtos: ${compra.produtos.length}`;
        
        div.append(p1);
        div.append(p2);
        div.append(p3);
        div.append(p4);
        
        container.append(div);
    });
}
*/
// Passo 3: Adicionar event listener no DOMContentLoaded:
/*
document.getElementById('btn-ver-historico').addEventListener('click', mostrarHistorico);
*/