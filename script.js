function Player(name, token) {
    this.getName = () => name;
    this.getToken = () => token;
}

function gameboard() {
    const row = 6;
    const column = 7;
    const board = [];

    // Create board
    for (let y = 0; y < row; y++) {
        board.push([])
        for (let x = 0; x < column; x++) {
            board[y].push(cell());
        }
    }

    const getBoard = () => board;

    // Add token to board, if column is full function will return false
    const addTokenToBoard = (column, player) => {
        const availableCells = board
            .map(row => row[column])
            .filter(cell => cell.getValue() === 0);

        // Check column is full
        if (!(availableCells.length)) {
            return false;
        }

        let lastAvailableCells = availableCells.length - 1;

        board[lastAvailableCells][column].addToken(player);

    }

    return {
        addTokenToBoard,
        getBoard,
    }

}

function cell() {
    let value = 0;

    const getValue = () => value;

    const addToken = (player) => {
        value = player
    }

    return {
        getValue,
        addToken
    }
}

function gameController() {
    const player1 = new Player('konrad', 1);
    const player2 = new Player('jacek', 2);

    const board = gameboard();

    let activePlayer = player1;

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const playRound = (column) => {
        board.addTokenToBoard(column, getActivePlayer().getToken());
        switchActivePlayer();
    }

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    }
}

function ScreenController() {
    const boardElement = document.querySelector('.board');
    const turnElement = document.querySelector('.turn');
    const game = gameController();

    const updateScreen = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        boardElement.textContent = '';
        turnElement.textContent = `${activePlayer.getName()}'s turn...`;

        board.forEach((row) => {
            row.forEach((cell, index) => {
                const button = document.createElement('button')
                button.classList.add("cell");
                button.dataset.column = index;
                button.textContent = cell.getValue();
                boardElement.appendChild(button);
            });
        });

    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        if (!selectedColumn) return;

        game.playRound(selectedColumn);
        updateScreen();
    }
    boardElement.addEventListener("click", clickHandlerBoard);

    updateScreen();
}

ScreenController();