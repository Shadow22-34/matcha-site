document.addEventListener('DOMContentLoaded', function() {
    // Add a simple animation to the header
    const header = document.querySelector('header');
    header.style.opacity = 0;
    
    setTimeout(() => {
        header.style.transition = 'opacity 1s ease-in-out';
        header.style.opacity = 1;
    }, 300);
    
    // Make the CTA button interactive
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        alert('Welcome to Matcha.fun! Our full experience is coming soon.');
    });

    // Connect Four Game Implementation
    class ConnectFour {
        constructor() {
            this.ROWS = 6;
            this.COLS = 7;
            this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(0));
            this.currentPlayer = 1; // 1 for player, 2 for AI
            this.gameActive = true;
            this.playerTurnElement = document.querySelector('.current-player');
            this.boardElement = document.querySelector('.connect-four-board');
            this.resetButton = document.getElementById('reset-game');
            
            this.initializeBoard();
            this.resetButton.addEventListener('click', () => this.resetGame());
        }
        
        initializeBoard() {
            this.boardElement.innerHTML = '';
            
            for (let col = 0; col < this.COLS; col++) {
                const column = document.createElement('div');
                column.classList.add('column');
                column.dataset.col = col;
                
                for (let row = this.ROWS - 1; row >= 0; row--) {
                    const cell = document.createElement('div');
                    cell.classList.add('cell');
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    column.appendChild(cell);
                }
                
                column.addEventListener('click', (e) => {
                    if (this.gameActive && this.currentPlayer === 1) {
                        const col = parseInt(e.currentTarget.dataset.col);
                        this.makeMove(col);
                    }
                });
                
                this.boardElement.appendChild(column);
            }
            
            this.updatePlayerTurn();
        }
        
        makeMove(col) {
            const row = this.getLowestEmptyRow(col);
            if (row === -1) return; // Column is full
            
            this.board[row][col] = this.currentPlayer;
            this.updateBoardUI();
            
            if (this.checkWin(row, col)) {
                this.gameActive = false;
                this.playerTurnElement.textContent = this.currentPlayer === 1 ? 'You Win!' : 'AI Wins!';
                return;
            }
            
            if (this.checkDraw()) {
                this.gameActive = false;
                this.playerTurnElement.textContent = 'Draw!';
                return;
            }
            
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            this.updatePlayerTurn();
            
            // If it's AI's turn, make a move after a short delay
            if (this.currentPlayer === 2 && this.gameActive) {
                setTimeout(() => {
                    const aiCol = this.getAIMove();
                    this.makeMove(aiCol);
                }, 700);
            }
        }
        
        getLowestEmptyRow(col) {
            for (let row = 0; row < this.ROWS; row++) {
                if (this.board[row][col] === 0) {
                    return row;
                }
            }
            return -1; // Column is full
        }
        
        updateBoardUI() {
            for (let row = 0; row < this.ROWS; row++) {
                for (let col = 0; col < this.COLS; col++) {
                    const cell = this.boardElement.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
                    
                    if (this.board[row][col] === 1) {
                        cell.classList.add('player');
                    } else if (this.board[row][col] === 2) {
                        cell.classList.add('ai');
                    } else {
                        cell.classList.remove('player', 'ai');
                    }
                }
            }
        }
        
        updatePlayerTurn() {
            this.playerTurnElement.textContent = this.currentPlayer === 1 ? 'Your Turn' : 'AI Thinking...';
        }
        
        checkWin(row, col) {
            const player = this.board[row][col];
            
            // Check horizontal
            let count = 0;
            for (let c = 0; c < this.COLS; c++) {
                count = (this.board[row][c] === player) ? count + 1 : 0;
                if (count >= 4) return true;
            }
            
            // Check vertical
            count = 0;
            for (let r = 0; r < this.ROWS; r++) {
                count = (this.board[r][col] === player) ? count + 1 : 0;
                if (count >= 4) return true;
            }
            
            // Check diagonal (bottom-left to top-right)
            for (let r = 0; r <= this.ROWS - 4; r++) {
                for (let c = 0; c <= this.COLS - 4; c++) {
                    if (this.board[r][c] === player && 
                        this.board[r+1][c+1] === player && 
                        this.board[r+2][c+2] === player && 
                        this.board[r+3][c+3] === player) {
                        return true;
                    }
                }
            }
            
            // Check diagonal (top-left to bottom-right)
            for (let r = this.ROWS - 1; r >= 3; r--) {
                for (let c = 0; c <= this.COLS - 4; c++) {
                    if (this.board[r][c] === player && 
                        this.board[r-1][c+1] === player && 
                        this.board[r-2][c+2] === player && 
                        this.board[r-3][c+3] === player) {
                        return true;
                    }
                }
            }
            
            return false;
        }
        
        checkDraw() {
            return this.board.every(row => row.every(cell => cell !== 0));
        }
        
        getAIMove() {
            // Smart AI implementation
            // First, check if AI can win in the next move
            for (let col = 0; col < this.COLS; col++) {
                const row = this.getLowestEmptyRow(col);
                if (row !== -1) {
                    // Try this move
                    this.board[row][col] = 2;
                    if (this.checkWin(row, col)) {
                        // Undo the move
                        this.board[row][col] = 0;
                        return col;
                    }
                    // Undo the move
                    this.board[row][col] = 0;
                }
            }
            
            // Check if player can win in the next move and block
            for (let col = 0; col < this.COLS; col++) {
                const row = this.getLowestEmptyRow(col);
                if (row !== -1) {
                    // Try this move for the player
                    this.board[row][col] = 1;
                    if (this.checkWin(row, col)) {
                        // Undo the move
                        this.board[row][col] = 0;
                        return col;
                    }
                    // Undo the move
                    this.board[row][col] = 0;
                }
            }
            
            // Try to play in the center column
            const centerCol = Math.floor(this.COLS / 2);
            if (this.getLowestEmptyRow(centerCol) !== -1) {
                return centerCol;
            }
            
            // Play in a random valid column
            const validMoves = [];
            for (let col = 0; col < this.COLS; col++) {
                if (this.getLowestEmptyRow(col) !== -1) {
                    validMoves.push(col);
                }
            }
            
            return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        
        resetGame() {
            this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(0));
            this.currentPlayer = 1;
            this.gameActive = true;
            this.updateBoardUI();
            this.updatePlayerTurn();
        }
    }
    
    // Initialize the Connect Four game
    const game = new ConnectFour();
});