const chessboardElement = document.getElementById('chessboard');
const currentTurnElement = document.getElementById('current-turn');
const resetButton = document.getElementById('reset-button');

// Piece Unicode characters (for visual representation)
const piecesUnicode = {
    'R': '&#9814;', 'N': '&#9816;', 'B': '&#9815;', 'Q': '&#9813;', 'K': '&#9812;', 'P': '&#9817;',
    'r': '&#9820;', 'n': '&#9822;', 'b': '&#9821;', 'q': '&#9819;', 'k': '&#9818;', 'p': '&#9823;'
};

// Initial board setup (FEN string like representation)
// Uppercase for White, Lowercase for Black
let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let currentTurn = 'White'; // 'White' or 'Black'
let selectedPiece = null; // { row, col, piece }
let possibleMoves = [];

function initBoard() {
    board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
    currentTurn = 'White';
    selectedPiece = null;
    possibleMoves = [];
    renderBoard();
    updateTurnDisplay();
}

function renderBoard() {
    chessboardElement.innerHTML = ''; // Clear existing board
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((r + c) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = r;
            square.dataset.col = c;

            const piece = board[r][c];
            if (piece) {
                square.innerHTML = piecesUnicode[piece];
                // Add color class to piece for styling (e.g., black text for black pieces)
                if (piece === piece.toLowerCase()) { // Black piece
                    square.style.color = '#333'; // Darker color for black pieces
                } else { // White piece
                    square.style.color = '#eee'; // Lighter color for white pieces
                }
            }
            square.addEventListener('click', () => handleSquareClick(r, c));
            chessboardElement.appendChild(square);
        }
    }
    highlightSelectedAndPossibleMoves();
}

function updateTurnDisplay() {
    currentTurnElement.textContent = currentTurn;
    if (currentTurn === 'White') {
        currentTurnElement.style.color = '#f1c40f'; // Yellow for White
    } else {
        currentTurnElement.style.color = '#e74c3c'; // Red for Black
    }
}

function getPieceColor(piece) {
    if (!piece) return null;
    return (piece === piece.toUpperCase()) ? 'White' : 'Black';
}

function handleSquareClick(row, col) {
    const clickedPiece = board[row][col];
    const clickedPieceColor = getPieceColor(clickedPiece);

    if (selectedPiece) {
        // A piece is already selected, try to move it
        const moveIndex = possibleMoves.findIndex(move => move.row === row && move.col === col);
        if (moveIndex !== -1) {
            // Valid move
            makeMove(selectedPiece.row, selectedPiece.col, row, col);
            selectedPiece = null;
            possibleMoves = [];
            switchTurn();
        } else {
            // Clicked an invalid square or another piece
            if (clickedPiece && clickedPieceColor === currentTurn) {
                // Clicked on a friendly piece, re-select
                selectedPiece = { row, col, piece: clickedPiece };
                possibleMoves = calculatePossibleMoves(row, col, clickedPiece);
            } else {
                // Clicked on an empty square or enemy piece (not a valid move), deselect
                selectedPiece = null;
                possibleMoves = [];
            }
        }
    } else {
        // No piece selected, try to select one
        if (clickedPiece && clickedPieceColor === currentTurn) {
            selectedPiece = { row, col, piece: clickedPiece };
            possibleMoves = calculatePossibleMoves(row, col, clickedPiece);
        }
    }
    renderBoard(); // Re-render to update highlights
}

function makeMove(startRow, startCol, endRow, endCol) {
    board[endRow][endCol] = board[startRow][startCol];
    board[startRow][startCol] = null;
    // Add logic for pawn promotion here if desired
}

function switchTurn() {
    currentTurn = (currentTurn === 'White') ? 'Black' : 'White';
    updateTurnDisplay();
}

function highlightSelectedAndPossibleMoves() {
    document.querySelectorAll('.square').forEach(square => {
        square.classList.remove('selected', 'possible-move');
    });

    if (selectedPiece) {
        const selectedSquare = document.querySelector(`.square[data-row="${selectedPiece.row}"][data-col="${selectedPiece.col}"]`);
        if (selectedSquare) {
            selectedSquare.classList.add('selected');
        }

        possibleMoves.forEach(move => {
            const moveSquare = document.querySelector(`.square[data-row="${move.row}"][data-col="${move.col}"]`);
            if (moveSquare) {
                moveSquare.classList.add('possible-move');
            }
        });
    }
}

// --- Piece Movement Logic (Simplified for demonstration) ---
// This is a basic implementation. A full chess engine involves more complex checks
// like avoiding putting own king in check.

function calculatePossibleMoves(row, col, piece) {
    const moves = [];
    const color = getPieceColor(piece);
    const isWhite = color === 'White';

    // Helper to add move if valid (within board and not capturing friendly piece)
    const addMove = (r, c) => {
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            const targetPiece = board[r][c];
            if (!targetPiece || getPieceColor(targetPiece) !== color) {
                moves.push({ row: r, col: c });
            }
        }
    };

    // Helper for sliding pieces (Rook, Bishop, Queen)
    const addSlidingMoves = (directions) => {
        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            while (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const targetPiece = board[r][c];
                if (!targetPiece) {
                    moves.push({ row: r, col: c });
                } else {
                    if (getPieceColor(targetPiece) !== color) {
                        moves.push({ row: r, col: c }); // Capture
                    }
                    break; // Blocked by a piece
                }
                r += dr;
                c += dc;
            }
        }
    };

    switch (piece.toLowerCase()) {
        case 'p': // Pawn
            const direction = isWhite ? -1 : 1; // White moves up, Black moves down
            
            // Single step forward
            if (board[row + direction] && !board[row + direction][col]) {
                addMove(row + direction, col);
            }

            // Double step forward (from starting position)
            if (isWhite && row === 6 && !board[row - 1][col] && !board[row - 2][col]) {
                addMove(row - 2, col);
            } else if (!isWhite && row === 1 && !board[row + 1][col] && !board[row + 2][col]) {
                addMove(row + 2, col);
            }

            // Captures diagonally
            for (const dc of [-1, 1]) {
                if (board[row + direction] && col + dc >= 0 && col + dc < 8) {
                    const targetPiece = board[row + direction][col + dc];
                    if (targetPiece && getPieceColor(targetPiece) !== color) {
                        addMove(row + direction, col + dc);
                    }
                }
            }
            // TODO: En passant and Promotion
            break;

        case 'r': // Rook
            addSlidingMoves([
                [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
            ]);
            break;

        case 'n': // Knight
            const knightMoves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            knightMoves.forEach(([dr, dc]) => addMove(row + dr, col + dc));
            break;

        case 'b': // Bishop
            addSlidingMoves([
                [-1, -1], [-1, 1], [1, -1], [1, 1] // All diagonals
            ]);
            break;

        case 'q': // Queen
            addSlidingMoves([
                [-1, 0], [1, 0], [0, -1], [0, 1], // Rook moves
                [-1, -1], [-1, 1], [1, -1], [1, 1] // Bishop moves
            ]);
            break;

        case 'k': // King
            const kingMoves = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
            kingMoves.forEach(([dr, dc]) => addMove(row + dr, col + dc));
            // TODO: Castling
            break;
    }

    return moves;
}

// --- Game Initialization ---
resetButton.addEventListener('click', initBoard);
initBoard(); // Initial setup when the page loads