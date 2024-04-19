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
        if (!(availableCells.length)) return false;

        let lastAvailableCells = availableCells.length - 1;

        board[lastAvailableCells][column].addToken(player)
    }

    const printBoard = () => {
        for (let y = 0; y < row; y++) {
            let rowString = "";
            for (let x = 0; x < column; x++) {
                rowString += board[y][x].getValue() + " ";
            }
            console.log(rowString);
        }
    }

    return {
        addTokenToBoard,
        getBoard,
        printBoard
    }


}

function cell() {
    let value = 0;

    const getValue = () => value;

    const addToken = (player) => {
        value = player
    }

    return {getValue, addToken}
}

//function gameController(player1='Player 1', player2='Player 2') {}

const game = gameboard()
console.log(game.printBoard())
console.log(game.addTokenToBoard(0,1))
console.log(game.printBoard())
console.log(game.addTokenToBoard(0,1))
console.log(game.printBoard())
console.log(game.addTokenToBoard(1,1))
console.log(game.printBoard())
