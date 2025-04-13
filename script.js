// Inicializa a lista de cartas do jogador e a pontuação
let cartasJogador = [];
let pontuacao = 0;

// O baralho completo do jogo será armazenado aqui
let deck = [];

// Objeto que associa o valor textual de uma carta com o nome do arquivo da imagem
const valores = {
  "A": "ace",    // Ás
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
  "10": "10",
  "J": "jack",   // Valete
  "Q": "queen",  // Dama
  "K": "king"    // Rei
};

// Objeto que associa a letra do naipe com seu nome completo (para o nome das imagens)
const naipes = {
  "C": "clubs",     // Paus
  "D": "diamonds",  // Ouros
  "H": "hearts",    // Copas
  "S": "spades"     // Espadas
};

// Função responsável por criar um baralho novo (52 cartas)
function criarDeck() {
  const naipesArray = Object.keys(naipes);   // ["C", "D", "H", "S"]
  const valoresArray = Object.keys(valores); // ["A", "2", ..., "K"]
  deck = [];

  // Combina cada valor com cada naipe para formar uma carta, exemplo: "A-C", "10-H"
  for (let n of naipesArray) {
    for (let v of valoresArray) {
      deck.push(`${v}-${n}`);
    }
  }

  // Embaralha o baralho depois de criado
  embaralhar(deck);
}

// Função de embaralhamento usando o algoritmo de Fisher-Yates
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Troca os elementos
  }
}

// Converte o nome da carta no formato "10-H" para o caminho da imagem correspondente
function getImageSrc(carta) {
  const [valor, naipe] = carta.split("-"); // Separa valor e naipe
  return `./cartas/${valores[valor]}_of_${naipes[naipe]}.png`;
}

// Retorna o valor numérico de uma carta (para somar na pontuação)
function gerarValorCarta(carta) {
  const valor = carta.split("-")[0]; // Pega apenas o valor (ex: "A", "10", "K")

  if (valor === "A") return 11;                   // Ás vale 11
  if (["J", "Q", "K"].includes(valor)) return 10; // Figuras valem 10
  return parseInt(valor);                         // Números normais de 2 a 10
}

// Atualiza a interface com as cartas do jogador e a pontuação
function atualizarTela() {
  const cartasDiv = document.getElementById('cartas');
  cartasDiv.innerHTML = ""; // Limpa as cartas anteriores da tela

  // Para cada carta do jogador, cria uma imagem e adiciona na tela
  // Para cada carta do jogador, cria uma imagem e adiciona na tela
for (let carta of cartasJogador) {
  const img = document.createElement("img");
  img.src = getImageSrc(carta);
  img.classList.add("carta"); // Aqui é onde adicionamos a animação
  cartasDiv.appendChild(img);
}


  // Atualiza o valor da pontuação do jogador
  document.getElementById('pontuacao').innerText = pontuacao;
}

// Quando o jogador clica em "Pedir Carta"
function pedirCarta() {
  if (deck.length === 0) return; // Se o baralho acabou, não faz nada

  document.getElementById('som-carta').play();

  const novaCarta = deck.pop();           // Retira a carta do topo do baralho
  cartasJogador.push(novaCarta);          // Adiciona à mão do jogador
  pontuacao += gerarValorCarta(novaCarta); // Soma o valor da carta à pontuação

  atualizarTela(); // Atualiza a tela com a nova carta

  // Verifica condições de fim de jogo
  if (pontuacao > 21) {
    document.getElementById('resultado').innerText = 'Você perdeu!';
    desativarBotoes();

    document.getElementById('som-derrota').play(); 

  } else if (pontuacao === 21) {
    document.getElementById('resultado').innerText = 'Você fez 21!';

    document.getElementById('som-vitoria').play(); 

    desativarBotoes();
  }
}

// Quando o jogador decide parar de pedir cartas
function parar() {
  const pontuacaoComputador = Math.floor(Math.random() * 6) + 17; // Computador faz entre 17 e 22
  let resultado = "";

  document.getElementById('som-parei').play();

  // Lógica para determinar quem ganhou
  if (pontuacaoComputador > 21 || pontuacao > pontuacaoComputador) {
    resultado = "Você venceu!";
    
    document.getElementById('som-vitoria').play(); 

  } else if (pontuacao === pontuacaoComputador) {
    resultado = "Empate!";
  } else {
    resultado = "Você perdeu!";

    document.getElementById('som-derrota').play(); 

  }

  // Exibe o resultado e a pontuação do computador
  document.getElementById("resultado").innerText = `${resultado} (Computador fez ${pontuacaoComputador})`;
  desativarBotoes();
}

// Desativa os botões "Pedir Carta" e "Parar", mas mantém o botão "Reiniciar" ativo
function desativarBotoes() {
  document.querySelectorAll('button').forEach(btn => {
    if (btn.textContent !== "Reiniciar") {
      btn.disabled = true;
    }
  });
}

// Função que reinicia o jogo
function reiniciar() {
  cartasJogador = [];                 // Limpa as cartas
  pontuacao = 0;                      // Reseta a pontuação
  criarDeck();                        // Gera novo baralho
  atualizarTela();                    // Atualiza a interface
  document.getElementById('resultado').innerText = ''; // Limpa o resultado anterior

  // Habilita os botões novamente
  document.querySelectorAll('button').forEach(btn => btn.disabled = false);
}

// Quando a página é carregada, cria o baralho e atualiza a tela
window.onload = () => {
  criarDeck();
  atualizarTela();
};
