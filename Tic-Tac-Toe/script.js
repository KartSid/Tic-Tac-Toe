const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const boardEl = document.getElementById('board');
const restartBtn = document.getElementById('restartBtn');
const gameArea = document.getElementById('gameArea');
const resultOverlay = document.getElementById('resultOverlay');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const resultRestartBtn = document.getElementById('resultRestartBtn');
const scanlineOverlay = document.getElementById('scanlineOverlay');

let board = Array(9).fill("");
let playerSymbol = "X";
let botSymbol = "O";
let currentPlayer = "player"; // 'player' or 'bot'
const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function drawBoard(){
  boardEl.innerHTML = "";
  board.forEach((cell, idx) => {
    const div = document.createElement('div');
    div.classList.add('cell');
    if(cell) {
      div.classList.add(cell);
      div.classList.add('taken');
      div.textContent = cell;
    }
    div.addEventListener('click', () => playerMove(idx));
    boardEl.appendChild(div);
  });
}

function playerMove(idx){
  if(currentPlayer !== 'player') return;
  if(board[idx]) return;
  board[idx] = playerSymbol;
  currentPlayer = 'bot';
  drawBoard();
  if(checkWin(board, playerSymbol)) return gameOver(playerSymbol);
  if(boardFull()) return gameOver('draw');
  setTimeout(botMove, 350);
}

function botMove(){
  const best = minimax(board, botSymbol);
  board[best.index] = botSymbol;
  currentPlayer = 'player';
  drawBoard();
  if(checkWin(board, botSymbol)) return gameOver(botSymbol);
  if(boardFull()) return gameOver('draw');
}

function minimax(newBoard, player){
  const availSpots = newBoard.map((v,i) => v === "" ? i : null).filter(i => i !== null);

  if(checkWin(newBoard, playerSymbol)) return {score: -10};
  if(checkWin(newBoard, botSymbol)) return {score: 10};
  if(availSpots.length === 0) return {score: 0};

  let moves = [];

  for(let i=0; i<availSpots.length; i++){
    let move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if(player === botSymbol){
      let result = minimax(newBoard, playerSymbol);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, botSymbol);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if(player === botSymbol){
    let bestScore = -Infinity;
    for(let i=0; i<moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for(let i=0; i<moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function checkWin(bd, sym){
  return winCombos.some(combo => combo.every(i => bd[i] === sym));
}

function boardFull(){
  return board.every(cell => cell);
}

function gameOver(winner){
  drawBoard();
  highlightWin(winner);
  showResultOverlay(winner);
  currentPlayer = null; // disable moves
  restartBtn.style.display = 'inline-block';
}

function highlightWin(sym){
  if(sym === 'draw') return;
  const cells = document.querySelectorAll('.cell');
  winCombos.forEach(combo => {
    if(combo.every(i => board[i] === sym)){
      combo.forEach(i => cells[i].classList.add('win'));
    }
  });
}

function showResultOverlay(winner){
  scanlineOverlay.classList.add('visible');
  if(winner === 'draw'){
    resultTitle.textContent = "It's a Draw!";
    resultTitle.style.color = '#0ff';
    resultTitle.style.textShadow = '0 0 15px cyan, 0 0 30px cyan';
    resultTitle.classList.remove('glitch');
    resultMessage.textContent = "Try again to beat the bot!";
  } else if(winner === playerSymbol){
    resultTitle.textContent = "You Win!";
    resultTitle.style.color = '#ff2aad';
    resultTitle.style.textShadow = '0 0 15px #ff2aad, 0 0 30px #ff2aad';
    resultTitle.classList.remove('glitch');
    resultMessage.textContent = "Congrats, you beat the bot!";
  } else {
    resultTitle.textContent = "Bot Wins!";
    resultTitle.setAttribute('data-text', 'Bot Wins!');
    resultTitle.classList.add('glitch');
    resultMessage.textContent = "HAHAHAHAHA You Lose...!";
  }
  resultOverlay.classList.add('visible');
}

function resetGame(){
  board = Array(9).fill("");
  currentPlayer = "player";
  restartBtn.style.display = 'none';
  gameArea.style.display = 'none';
  resultOverlay.classList.remove('visible');
  scanlineOverlay.classList.remove('visible');
  startScreen.style.display = 'block';
}

startBtn.addEventListener('click', () => {
  playerSymbol = document.getElementById('symbolChoice').value;
  botSymbol = playerSymbol === "X" ? "O" : "X";
  currentPlayer = document.getElementById('startChoice').value;
  board = Array(9).fill("");
  restartBtn.style.display = 'none';
  startScreen.style.display = 'none';
  gameArea.style.display = 'block';
  resultOverlay.classList.remove('visible');
  scanlineOverlay.classList.remove('visible');
  drawBoard();
  if(currentPlayer === 'bot'){
    setTimeout(botMove, 400);
  }
});

resultRestartBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', resetGame);
