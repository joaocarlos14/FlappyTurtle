console.log('[DevKelua] Flappy Bird');

const sprites = new Image();
sprites.src = './flappyBird.png' ;

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');
let frames = 0;
const globais = {};
let maxRank = 0;
let rank = 0;
let rankAtual = 0;
let rankMaximo = 0;

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        largura: 38,
        altura: 28,
        x: 10,
        y: 50,
        gravidade: 0.25,
        velocidade: 0,
        pulo: 4.6,
        movimentos: [
            { spriteX: 355, spriteY: 537,}, //asa para cima
            { spriteX: 429, spriteY: 537,}, //asa no meio
            { spriteX: 504, spriteY: 537,}, //asa para baixo
        ],
        pula(){
            flappyBird.velocidade = - flappyBird.pulo;
        },
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                setTimeout(() => {
                    MudarTela(Telas.INICIO);
                }, 500);
                return ;
            }
    
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        frameatual: 0,
        atualizaFrameAtual() {
            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0;

            if(passouIntervalo) 
            {
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameatual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameatual = incremento % baseRepeticao;
            }

            
        },
        desenha() {
            flappyBird.atualizaFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameatual];

            contexto.drawImage(
                sprites,                                // Imagem com as Sprites
                spriteX, spriteY, // Sprite X, Sprite Y
                flappyBird.largura, flappyBird.altura,  // Tamanho do recorte da Sprite
                flappyBird.x, flappyBird.y,             // Posição na tela que vai ser desenhado 
                flappyBird.largura, flappyBird.altura   // Tamanho do Sprite
            )
        }
    }
    return flappyBird;
}

function criarChao() {
    const chao = {
        spriteX: 585,
        spriteY: 0,
        largura: 335,
        altura: 113,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoChao = 2;
            const repeteEm = chao.largura / 1;
            const movimentacao = chao.x - movimentoChao;

            chao.x = movimentacao % repeteEm;
        },
        desenha() {
            contexto.drawImage(
                sprites,                    // Imagem com as Sprites
                chao.spriteX, chao.spriteY, // Sprite X, Sprite Y
                chao.largura, chao.altura,  // Tamanho do recorte da Sprite
                chao.x, chao.y,             // Posição na tela que vai ser desenhado 
                chao.largura, chao.altura   // Tamanho do Sprite
            )
    
            contexto.drawImage(
                sprites,                    // Imagem com as Sprites
                chao.spriteX, chao.spriteY, // Sprite X, Sprite Y
                chao.largura, chao.altura,  // Tamanho do recorte da Sprite
                (chao.x + chao.largura), chao.y,             // Posição na tela que vai ser desenhado 
                chao.largura, chao.altura   // Tamanho do Sprite
            )
        }
    }
    return chao;
}

function criarCanos() {
    const canos = {
        canoCimaX: 112,
        canoCimaY: 647,
        canoBaixoX: 168,
        canoBaixoY: 647,
        largura: 52,
        altura: 319,
        posicaoCimaX: 200,
        posicaoCimaY: 0,
        posicaoBaixoX: 200,
        posicaoBaixoY: 0,
        pares: [],
        colisaoPersonagem(par) {
            const cabecaFlappy = globais.flappyBird.y;
            const peFlappy = globais.flappyBird.y + globais.flappyBird.altura;

            if(globais.flappyBird.x >= par.x) {
                if(cabecaFlappy <= (par.canoCima.y - globais.canos.altura)) {
                    return true;
                }

                if(peFlappy >= ((par.canoCima.y - globais.canos.altura)) + 100) {
                    return true;
                }
            }
        },
        atualiza() {
            const passouCemFrames = frames % 100 === 0;
            if(passouCemFrames)
            {
                canos.pares.push({
                    x: canvas.width, 
                    y: -100 * (Math.random() + 1),
                })
            }

            canos.pares.forEach(function(par) {
                par.x = par.x - 2;

                if(canos.colisaoPersonagem(par)) {
                    MudarTela(Telas.PERDEU);
                }

                if(par.x + canos.largura <= 0) {
                    rank = rank + 1;
                    canos.pares.shift();
                }
            });
        },
        desenha() {
            canos.pares.forEach(function(par) {
                const espacamentoCanos = 100;
                const yRandom = par.y;

                // Cano do Céu
                contexto.drawImage(
                    sprites,                            // Imagem com as Sprites
                    canos.canoCimaX, canos.canoCimaY,   // Sprite X, Sprite Y
                    canos.largura, canos.altura,        // Tamanho do recorte da Sprite
                    par.x, yRandom,                     // Posição na tela que vai ser desenhado 
                    canos.largura, canos.altura         // Tamanho do Sprite
                )
                // Cano do Chão
                contexto.drawImage(
                    sprites,                            // Imagem com as Sprites
                    canos.canoBaixoX, canos.canoBaixoY, // Sprite X, Sprite Y
                    canos.largura, canos.altura,        // Tamanho do recorte da Sprite
                    par.x, (canos.posicaoBaixoY + canos.altura + espacamentoCanos + yRandom),                   // Posição na tela que vai ser desenhado 
                    canos.largura, canos.altura         // Tamanho do Sprite
                )

                par.canoCima = {
                    x: canos.canoCimaX,
                    y: canos.canoCimaY + par.y,
                }
                par.canoBaixo = {
                    x: canos.canoBaixoX,
                    y: canos.canoBaixoY + par.y,
                }
            })             
        }
    }
    return canos;
}

const planoFundo = {
    spriteX: 0,
    spriteY: 0,
    largura: 288,
    altura: 512,
    x: 0,
    y: canvas.height - (520),
    desenha() {
        contexto.drawImage(
            sprites,                    // Imagem com as Sprites
            planoFundo.spriteX, planoFundo.spriteY, // Sprite X, Sprite Y
            planoFundo.largura, planoFundo.altura,  // Tamanho do recorte da Sprite
            planoFundo.x, planoFundo.y,             // Posição na tela que vai ser desenhado 
            planoFundo.largura, planoFundo.altura   // Tamanho do Sprite
        )

        contexto.drawImage(
            sprites,                    // Imagem com as Sprites
            planoFundo.spriteX, planoFundo.spriteY, // Sprite X, Sprite Y
            planoFundo.largura, planoFundo.altura,  // Tamanho do recorte da Sprite
            (planoFundo.x + planoFundo.largura), planoFundo.y,             // Posição na tela que vai ser desenhado 
            planoFundo.largura, planoFundo.altura   // Tamanho do Sprite
        )
    }
}

const mensagemGetReady = {
    spriteX: 590,
    spriteY: 117,
    largura: 188,
    altura: 54,
    x: (canvas.width / 2) - 188 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,                                            // Imagem com as Sprites
            mensagemGetReady.spriteX, mensagemGetReady.spriteY, // Sprite X, Sprite Y
            mensagemGetReady.largura, mensagemGetReady.altura,  // Tamanho do recorte da Sprite
            mensagemGetReady.x, mensagemGetReady.y,             // Posição na tela que vai ser desenhado 
            mensagemGetReady.largura, mensagemGetReady.altura   // Tamanho do Sprite
        )
    }
}

const mensagemIniciar = {
    spriteX: 585,
    spriteY: 180,
    largura: 112,
    altura: 102,
    x: (canvas.width /2) - 112 / 2,
    y: mensagemGetReady.altura + 70,
    desenha() {
        contexto.drawImage(
            sprites,                                            // Imagem com as Sprites
            mensagemIniciar.spriteX, mensagemIniciar.spriteY, // Sprite X, Sprite Y
            mensagemIniciar.largura, mensagemIniciar.altura,  // Tamanho do recorte da Sprite
            mensagemIniciar.x, mensagemIniciar.y,             // Posição na tela que vai ser desenhado 
            mensagemIniciar.largura, mensagemIniciar.altura   // Tamanho do Sprite
        )
    }
}

const mensagemPerdeu = {
    // GAME OVER
    gameOverSpriteX: 789,
    gameOverSpriteY: 117,
    gameOverLargura: 196,
    gameOverAltura: 48,
    gameOverX: (canvas.width / 2) - 196 / 2,
    gameOverY: 100,
    desenhaGameOver() {
        contexto.drawImage(
            sprites,
            mensagemPerdeu.gameOverSpriteX, mensagemPerdeu.gameOverSpriteY,
            mensagemPerdeu.gameOverLargura, mensagemPerdeu.gameOverAltura, 
            mensagemPerdeu.gameOverX, mensagemPerdeu.gameOverY,
            mensagemPerdeu.gameOverLargura, mensagemPerdeu.gameOverAltura
        )
    },
    // PLAY
    playSpriteX: 707,
    playSpriteY: 235,
    playLargura: 108,
    playAltura: 61,
    playX: (canvas.width / 2) - 108 / 2,
    playY: 200,
    desenhaPlay() {
        contexto.drawImage(
            sprites,
            mensagemPerdeu.playSpriteX, mensagemPerdeu.playSpriteY,
            mensagemPerdeu.playLargura, mensagemPerdeu.playAltura, 
            mensagemPerdeu.playX, mensagemPerdeu.playY,
            mensagemPerdeu.playLargura, mensagemPerdeu.playAltura
        )
    }
}

const telaRank = {
    desenha() {    
        rankAtual = rank,
        contexto.fillText('Pontuação: ' + rankAtual, 10, 460);

        if(rankMaximo < rank){
            rankMaximo = rank;
        }
        contexto.font = '25px arial black';
        contexto.fillText('Maior Pontuação: ' + rankMaximo, 10, 500);
    }
}

let telaAtiva = {};
function MudarTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.canos = criarCanos();
            globais.chao = criarChao();
        },
        desenha() {
            planoFundo.desenha();
            globais.flappyBird.desenha();
            globais.chao.desenha();
            mensagemGetReady.desenha();
            mensagemIniciar.desenha();
            telaRank.desenha();
        },
        click() {
            MudarTela(Telas.JOGO);
            rank = 0;
        },
        atualiza() {
            globais.chao.atualiza();
        }
    },
};

Telas.PERDEU = {
    desenha() {
        planoFundo.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();

        mensagemPerdeu.desenhaGameOver();
        mensagemPerdeu.desenhaPlay();

        telaRank.desenha();
    },
    click() {
        MudarTela(Telas.INICIO);
    },
    atualiza() {
        globais.chao.atualiza();
    }
};

Telas.JOGO = {
    desenha() {
        planoFundo.desenha();
        globais.canos.desenha();
        globais.chao.desenha();
        globais.flappyBird.desenha();

        telaRank.desenha();
    },
    click(){
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();
    }
};

function loop(){
    telaAtiva.desenha();
    telaAtiva.atualiza();
    frames = frames + 1;

    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
});

MudarTela(Telas.INICIO);
loop();