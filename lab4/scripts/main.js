
const titulo = document.getElementById('titulo');

titulo.onmouseover = function() {
    this.textContent = '1. És bué fixe!';
};

titulo.onmouseout = function() {
    this.textContent = '1. Passa por aqui!';
};


const btnRed = document.getElementById('btnRed');
const btnGreen = document.getElementById('btnGreen');
const btnBlue = document.getElementById('btnBlue');

btnRed.onclick = function() {
    document.body.style.backgroundColor = 'red';
};

btnGreen.onclick = function() {
    document.body.style.backgroundColor = 'green';
};

btnBlue.onclick = function() {
    document.body.style.backgroundColor = 'blue';
};


const inputTexto = document.getElementById('inputTexto');

inputTexto.onkeyup = function() {
    console.log(this.value);
};


const inputCor = document.getElementById('inputCor');
const btnSubmeter = document.getElementById('btnSubmeter');

btnSubmeter.onclick = function() {
    const cor = inputCor.value;
    document.body.style.backgroundColor = cor;
};


const btnConta = document.getElementById('btnConta');
const contador = document.getElementById('contador');
let contagem = 0;

btnConta.onclick = function() {
    contagem = contagem + 1;
    contador.textContent = contagem;
};


const caixaRato = document.getElementById('caixaRato');
const coordenadas = document.getElementById('coordenadas');

caixaRato.onmousemove = function(evento) {
    const x = evento.offsetX;
    const y = evento.offsetY;
    coordenadas.textContent = 'X: ' + x + ' Y: ' + y;
};