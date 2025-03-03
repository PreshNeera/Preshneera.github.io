
const boardSize = 8;
let board = [];
let currentPlayer = 1; 
let selectedPiece = null;
let player1Captures = 0; 
let player2Captures = 0; 


function initializeBoard() {
  board = []; 
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = ''; 
  for (let row = 0; row < boardSize; row++) {
    const boardRow = [];
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if ((row + col) % 2 === 1) {
        cell.classList.add('dark');
        if (row < 3) {
          cell.innerHTML = '<div class="piece black"></div>';
          boardRow.push(2); 
        } else if (row > 4) {
          cell.innerHTML = '<div class="piece red"></div>';
          boardRow.push(1); 
        } else {
          boardRow.push(0); 
        }
      } else {
        boardRow.push(0); 
      }
      cell.addEventListener('click', () => handleCellClick(row, col));
      cell.addEventListener('dblclick', () => handleDoubleClick(row, col)); // Double-click event
      gameBoard.appendChild(cell);
    }
    board.push(boardRow);
  }
  currentPlayer = 1; 
  player1Captures = 0; 
  player2Captures = 0; 
  updateStats(); 
  updateTurnIndicator(); 
}


function restartGame() {
  initializeBoard();
}


function handleCellClick(row, col) {
  if (selectedPiece) {
    movePiece(row, col);
  } else {
    selectPiece(row, col);
  }
}


function handleDoubleClick(row, col) {
  const piece = board[row][col];
  if (piece === currentPlayer || piece === currentPlayer + 2) {
    kingPiece(row, col);
  }
}


function selectPiece(row, col) {
  const piece = board[row][col];
  if (piece === currentPlayer || piece === currentPlayer + 2) { // Include kings
    selectedPiece = { row, col };
    highlightCell(row, col);
    showValidMoves(row, col);
  }
}


function movePiece(row, col) {
  const { row: oldRow, col: oldCol } = selectedPiece;
  if (isValidMove(oldRow, oldCol, row, col)) {
    const pieceElement = document.querySelector(`.cell:nth-child(${oldRow * boardSize + oldCol + 1}) .piece`);
    const targetCell = document.querySelector(`.cell:nth-child(${row * boardSize + col + 1})`);

    
    const translateX = (col - oldCol) * 62; 
    const translateY = (row - oldRow) * 62;

    
    pieceElement.style.setProperty('--translate-x', `${translateX}px`);
    pieceElement.style.setProperty('--translate-y', `${translateY}px`);
    pieceElement.style.animation = 'moveAnimation 0.3s forwards';


    setTimeout(() => {
      board[row][col] = board[oldRow][oldCol];
      board[oldRow][oldCol] = 0;
      checkForKing(row, col); // Check if the piece should be kinged
      updateBoard();
      if (!checkWin()) {
        switchPlayer();
      }
    }, 300);
  }
  selectedPiece = null;
  clearHighlights();
}


function isValidMove(oldRow, oldCol, newRow, newCol) {
  const rowDiff = newRow - oldRow;
  const colDiff = newCol - oldCol;
  const direction = currentPlayer === 1 ? -1 : 1; 


  if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
    return board[newRow][newCol] === 0 && rowDiff === direction;
  }

 
  if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
    const midRow = (oldRow + newRow) / 2;
    const midCol = (oldCol + newCol) / 2;
    const midPiece = board[midRow][midCol];
    if (
      board[newRow][newCol] === 0 &&
      (midPiece === 3 - currentPlayer || midPiece === 5 - currentPlayer) 
    ) {

      const capturedPiece = document.querySelector(`.cell:nth-child(${midRow * boardSize + midCol + 1}) .piece`);
      if (capturedPiece) {
        capturedPiece.style.animation = 'captureAnimation 0.3s forwards';
      }
      board[midRow][midCol] = 0; 
      updateCaptures(currentPlayer); 
      return true;
    }
  }

  return false;
}


function updateCaptures(player) {
  if (player === 1) {
    player1Captures++;
  } else if (player === 2) {
    player2Captures++;
  }
  updateStats(); 
}


function updateStats() {
  document.getElementById('player1-captures').textContent = player1Captures;
  document.getElementById('player2-captures').textContent = player2Captures;
}


function checkForKing(row, col) {
  if (currentPlayer === 1 && row === 0) {
    board[row][col] = 3; // King for Player 1
  } else if (currentPlayer === 2 && row === boardSize - 1) {
    board[row][col] = 4; // King for Player 2
  }
}


function kingPiece(row, col) {
  if (board[row][col] === 1 || board[row][col] === 2) {
    board[row][col] += 2; 
    updateBoard();
  }
}


function updateBoard() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if ((row + col) % 2 === 1) {
        cell.classList.add('dark');
        const piece = board[row][col];
        if (piece === 1) {
          cell.innerHTML = '<div class="piece red"></div>';
        } else if (piece === 2) {
          cell.innerHTML = '<div class="piece black"></div>';
        } else if (piece === 3) {
          cell.innerHTML = '<div class="piece red king"></div>';
        } else if (piece === 4) {
          cell.innerHTML = '<div class="piece black king"></div>';
        }
      }
      cell.addEventListener('click', () => handleCellClick(row, col));
      cell.addEventListener('dblclick', () => handleDoubleClick(row, col)); // Double-click event
      gameBoard.appendChild(cell);
    }
  }
}


function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateTurnIndicator();
}


function updateTurnIndicator() {
  const turnIndicator = document.getElementById('turn-indicator');
  turnIndicator.textContent = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Red' : 'Black'})`;
}


function highlightCell(row, col) {
  const gameBoard = document.getElementById('game-board');
  const cell = gameBoard.children[row * boardSize + col];
  const piece = cell.querySelector('.piece');
  if (piece) {
    piece.classList.add('selected');
  }
}


function showValidMoves(row, col) {
  const directions = currentPlayer === 1 ? [-1, 1] : [1, -1]; // Player 1 moves up, Player 2 moves down
  const moveOffsets = [
    { row: directions[0], col: -1 }, 
    { row: directions[0], col: 1 },  
    { row: directions[1], col: -1 }, 
    { row: directions[1], col: 1 },  
  ];

  moveOffsets.forEach((offset) => {
    const newRow = row + offset.row;
    const newCol = col + offset.col;
    if (isValidMove(row, col, newRow, newCol)) {
      const gameBoard = document.getElementById('game-board');
      const cell = gameBoard.children[newRow * boardSize + newCol];
      cell.classList.add('valid-move');
    }
  });
}


function clearHighlights() {
  const gameBoard = document.getElementById('game-board');
  for (const cell of gameBoard.children) {
    cell.classList.remove('valid-move');
    const piece = cell.querySelector('.piece');
    if (piece) {
      piece.classList.remove('selected');
    }
  }
}


function checkWin() {
  const player1Pieces = board.flat().filter((piece) => piece === 1 || piece === 3).length;
  const player2Pieces = board.flat().filter((piece) => piece === 2 || piece === 4).length;

  if (player1Pieces === 0) {
    alert('Player 2 (Black) wins!');
    return true;
  } else if (player2Pieces === 0) {
    alert('Player 1 (Red) wins!');
    return true;
  }
  return false;
}


document.getElementById('restart-button').addEventListener('click', restartGame);


window.onload = initializeBoard;