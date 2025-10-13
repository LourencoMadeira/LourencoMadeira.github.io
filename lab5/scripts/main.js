
const titulo = document.getElementById('titulo');

titulo.onmouseover = () => {
    titulo.textContent = '1. Obrigado por passares!';
};

titulo.onmouseout = () => {
    titulo.textContent = '1. Passa por aqui!';
};


const pinta = document.getElementById('pinta');

document.querySelectorAll("button.color").forEach((botao) => {
    botao.onclick = () => {
        pinta.style.color = botao.dataset.color;
    };
});


const inputTexto = document.getElementById('inputTexto');

const cores = ['#ffcccc', '#ccffcc', '#ccccff', '#ffffcc'];
let indiceCorAtual = 0;

inputTexto.onkeyup = function() {
    console.log(this.value);

    this.style.backgroundColor = cores[indiceCorAtual];
    indiceCorAtual = (indiceCorAtual + 1) % 4;
};


const inputCor = document.getElementById('inputCor');

inputCor.onchange = function() {
    document.body.style.backgroundColor = this.value;
};


const btnConta = document.getElementById('btnConta');
const contador = document.getElementById('contador');
let contagem = 0;

btnConta.onclick = function() {
    contagem = contagem + 1;
    contador.textContent = contagem;
};





const formulario = document.getElementById('formulario');
const mensagem = document.getElementById('mensagem');

formulario.onsubmit = (e) => {
    e.preventDefault(); 
    
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    
    mensagem.textContent = 'Olá, o ' + nome + ' tem ' + idade + '!';
};

const contadorAutomatico = document.getElementById('contadorAuto');
let contagemAutomatica = 0;

setInterval(function() {
    contagemAutomatica = contagemAutomatica + 1;
    contadorAutomatico.textContent = contagemAutomatica;
}, 1000);