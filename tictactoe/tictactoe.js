const canvas = document.getElementById('tictactoe');
const ctx = canvas.getContext('2d');
const gridSize = 3;
const cellSize = canvas.width / gridSize;
let board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
let currentPlayer = 'X';

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col]) {
                ctx.font = '40px Arial';
                ctx.fillText(board[row][col], col * cellSize + 15, row * cellSize + 50);
            }
        }
    }
}

function checkWinner() {
    for (let i = 0; i < gridSize; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) return board[i][0];
        if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) return board[0][i];
    }
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) return board[0][2];
    return null;
}

function resetGame() {
    board = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
    currentPlayer = 'X';
    drawBoard();
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    if (!board[row][col]) {
        board[row][col] = currentPlayer;
        const winner = checkWinner();
        if (winner) {
            setTimeout(() => {
                alert(`${winner} wins!`);
                resetGame();
            }, 10);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
        drawBoard();
    }
}

canvas.addEventListener('click', handleClick);
drawBoard(); 