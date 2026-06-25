const ROWS = 6;
const COLS = 7;
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let grid; // grid[row][col] = null | 'red' | 'yellow'
let current;
let gameOver;

function init() {
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  current = 'red';
  gameOver = false;
  boardEl.classList.remove('locked');
  boardEl.innerHTML = '';

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => handleClick(c));
      boardEl.appendChild(cell);
    }
  }
  updateStatus();
}

function updateStatus(message) {
  if (message) {
    statusEl.innerHTML = message;
    return;
  }
  statusEl.innerHTML = (current === 'red' ? 'Rood' : 'Geel') + ' is aan de beurt';
}

function getCellEl(row, col) {
  return boardEl.children[row * COLS + col];
}

function handleClick(col) {
  if (gameOver) return;

  // zoek laagste lege rij in deze kolom
  let targetRow = -1;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!grid[r][col]) { targetRow = r; break; }
  }
  if (targetRow === -1) return; // kolom vol

  grid[targetRow][col] = current;
  const cellEl = getCellEl(targetRow, col);
  const disc = document.createElement('div');
  disc.className = `disc ${current}`;
  cellEl.appendChild(disc);

  const winLine = checkWin(targetRow, col);
  if (winLine) {
    gameOver = true;
    boardEl.classList.add('locked');
    winLine.forEach(([r, c]) => getCellEl(r, c).querySelector('.disc').classList.add('win'));
    updateStatus((current === 'red' ? 'Rood' : 'Geel') + ' wint!');
    return;
  }

  if (grid.every(row => row.every(cell => cell))) {
    gameOver = true;
    boardEl.classList.add('locked');
    updateStatus('Gelijkspel! Het bord is vol.');
    return;
  }

  current = current === 'red' ? 'yellow' : 'red';
  updateStatus();
}

function checkWin(row, col) {
  const player = grid[row][col];
  const directions = [
    [[0, 1], [0, -1]],   // horizontaal
    [[1, 0], [-1, 0]],   // verticaal
    [[1, 1], [-1, -1]],  // diagonaal \
    [[1, -1], [-1, 1]],  // diagonaal /
  ];

  for (const [dirA, dirB] of directions) {
    let line = [[row, col]];

    for (const [dr, dc] of [dirA, dirB]) {
      let r = row + dr, c = col + dc;
      while (r >= 0 && r < ROWS && c >= 0 && c < COLS && grid[r][c] === player) {
        line.push([r, c]);
        r += dr; c += dc;
      }
    }

    if (line.length >= 4) return line;
  }
  return null;
}

resetBtn.addEventListener('click', init);
init();