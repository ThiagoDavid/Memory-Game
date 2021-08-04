let images = []; // vetor com url das imágens
for (i = 1; i <= 8; i++)
    images.push(`https://picsum.photos/id/${i}/100`); // imagens do picsum de 1 a 8
let fundo = 'https://picsum.photos/100?grayscale'; // verso da carta imágem aleatória

// estado do jogo
// vetor contendo o número da imágem associada a cada carta
let cartas = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
let pontos = 0;
let posicaoCartaAnterior; // indice da carta no vetor de cartas.
let valorCartaAnterior; // numero correspontende a imagem no vetor de imagens
let jaClicou = false; // marcar quando clicar uma vez
let idCartaAnterior; // marcar o id do objeto para modificar
const timerDoJogo = new Timer('#timer');

// ao carregar a página
onload = () => {
    let elemImages = document.querySelectorAll('#memory img');
    elemImages.forEach((img, i) => {
        img.src = fundo;
        img.style.opacity = 0.6;
        img.setAttribute('data-valor', i);
    });
    // criar evento do botao de inicio
    document.querySelector('#btInicio').onclick = iniciaJogo;

    const timerDoJogo = new Timer('#timer');
}


//------------------
// Inicia o jogo
//------------------

const iniciaJogo = () => {
    // embaralhar as cartas    
    for (i = 0; i < cartas.length; i++) {
        randomNumber = Math.trunc(Math.random() * 16);
        aux = cartas[randomNumber];
        cartas[randomNumber] = cartas[i];
        cartas[i] = aux;
    }

    // associar evento às imagens
    let elementoImagens = document.querySelectorAll('#memory img');
    elementoImagens.forEach(
        (img, i) => {
            img.onclick = trataCliqueImagem;
            img.style.opacity = 1;
            img.src = fundo;
        });
    document.querySelector('#timer').style.backgroundColor = 'orange';
    document.querySelector('#btInicio').disabled = true;
    
    timerDoJogo.start();

    // Reinicia estado do jogo
    pontos = 0;
    posicaoCartaAnterior = 1; // indice da carta no vetor de cartas.
    valorCartaAnterior = 0; // numero correspontende a imagem no vetor de imagens
    jaClicou = false; // marcar quando clicar uma vez
    idCartaAnterior = -1; // marcar o id do objeto para modificar

};

// ------------------------
// Process click on images
// ------------------------
const trataCliqueImagem = (e) => {
    const p = +e.target.getAttribute('data-valor');
    e.target.src = images[cartas[p] - 1]; //muda imagem (vira carta)
    e.target.onclick = null; // ao clicar uma vez não permitir clicar novamente
    if (jaClicou) {
        // se as duas cartas expostas tem o mesmo valor
        if (cartas[p] == valorCartaAnterior) {
            pontos++;
        }

        // impedir de clicar em mais imagens até voltar ao estado inicial        
        let elementoImagens = document.querySelectorAll('#memory img');
        elementoImagens.forEach(
            (img, i) => {
                img.onclick = null;
            });
        // resetar as duas cartas para posição anterior
        setTimeout(() => {
            if (cartas[p] != valorCartaAnterior) {
                e.target.src = fundo;
                e.target.onclick = trataCliqueImagem;
                document.querySelector('#' + idCartaAnterior).src = fundo;
                document.querySelector('#' + idCartaAnterior).onclick = trataCliqueImagem;
            }
            // retornar ao estado normal
            let elementoImagens = document.querySelectorAll('#memory img');
            elementoImagens.forEach(
                (img, i) => {
                    img.onclick = trataCliqueImagem;
                });
            jaClicou = false;
        }, 700);
        if (pontos == 8) {
            document.querySelector('#timer').style.backgroundColor = 'green';
            document.querySelector('#btInicio').disabled = false;
            timerDoJogo.stop();
        }
    } else {
        posicaoCartaAnterior = p;
        valorCartaAnterior = cartas[p];
        idCartaAnterior = e.target.getAttribute('id');
        jaClicou = true;
    }
};

// -------------------
// Timer
//------------------


function Timer(e) {
    this.tempo = 0;
    this.element = e;
    this.control = null;
    this.start = () => {
        this.reset();
        this.control = setInterval(() => {
            this.tempo++; // aumenta 1 segundo
            if (this.tempo >= 3600) this.tempo = 0;
            minutos = Math.trunc(this.tempo / 60); // obtem minutos
            segundos = this.tempo % 60; // obtem segundos

            document.querySelector(this.element).innerHTML =
                (minutos < 10 ? '0' : '') + minutos + ':' +
                (segundos < 10 ? '0' : '') + segundos;

        }, 1000);
    }
    this.stop = () => {
        clearInterval(this.control);
        this.control = null;
    }
    this.reset = () =>{
        this.tempo = 0;
        document.querySelector(this.element).innerHTML = '00:00';
    }
}
