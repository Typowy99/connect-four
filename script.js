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

    const checkGameEnd = () => {
        const boardValues = board.map(row => row.map(cell => cell.getValue()));

        const checkGroups = (groups) => {
            for (const group of groups) {
                if (group.every(item => item === group[0] && item !== 0)) {
                    return true;
                }
            }
            return false;
        };

        const horizontalGroups = [];
        const diagonalGroups = [];
        const verticalGroups = [];

        // Horizontal and vertical groups
        for (let y = 0; y < row; y++) {
            for (let x = 0; x <= (column - 4); x++) {
                horizontalGroups.push(boardValues[y].slice(x, x + 4));
                if (y <= (row - 4)) {
                    verticalGroups.push(boardValues.slice(y, y + 4).map(row => row[x]));
                }
            }
        }

        // Diagonal groups (both directions)
        for (let y = 0; y <= (row - 4); y++) {
            for (let x = 0; x <= (column - 4); x++) {
                const diagonalDown = [];
                const diagonalUp = [];
                for (let i = 0; i < 4; i++) {
                    diagonalDown.push(boardValues[y + i][x + i]);
                    diagonalUp.push(boardValues[y + 3 - i][x + i]);
                }
                diagonalGroups.push(diagonalDown, diagonalUp);
            }
        }

        return checkGroups(horizontalGroups) || checkGroups(diagonalGroups) || checkGroups(verticalGroups);
    };


    const getBoard = () => board;

    // Add token to board, if column is full function will return false
    const addTokenToBoard = (column, playerToken) => {
        const availableCells = board
            .map(row => row[column])
            .filter(cell => cell.getValue() === 0);

        // Check column is full
        if (!(availableCells.length)) {
            return false;
        }

        let lastAvailableCells = availableCells.length - 1;

        board[lastAvailableCells][column].addToken(playerToken);

    }

    return {
        addTokenToBoard,
        getBoard,
        checkGameEnd,
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
    const player1 = new Player('red', 1);
    const player2 = new Player('blue', 2);

    const board = gameboard();

    let activePlayer = player1;

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const playRound = (column) => {
        board.addTokenToBoard(column, getActivePlayer().getToken());

        if(board.checkGameEnd()) {
            return true
        }

        switchActivePlayer();

        return false;
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
    const infoElement = document.querySelector('.info');
    const infoText = document.querySelector('.info-text');
    const shadow = document.querySelector('.shadow')
    const btnNewGame = document.querySelector('.new-game')

    const game = gameController();

    const updateScreen = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        boardElement.textContent = '';


        turnElement.style.backgroundColor = activePlayer.getToken() === 1 ? 'red' : 'blue';

        board.forEach((row) => {
            row.forEach((cell, index) => {
                const button = document.createElement('button');
                button.classList.add("cell");
                button.dataset.column = index;
                button.dataset.color = cell.getValue();
                if (cell.getValue()) {
                    button.classList.add(button.dataset.color === '1' ? 'red' : 'blue');
                }

                boardElement.appendChild(button);
            });
        });
    }


    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;

        if (!selectedColumn) return;

        if(game.playRound(selectedColumn)) {
            infoElement.style.display = 'block';
            infoText.textContent = `${game.getActivePlayer().getName()} won!`;
            shadow.style.display = 'block';
        }
        updateScreen();
    }
    boardElement.addEventListener("click", clickHandlerBoard);

    updateScreen();

    btnNewGame.addEventListener('click', function() {
        location.reload();
    });
}

ScreenController();