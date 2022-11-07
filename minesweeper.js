// const BOTTOM_LEFT = 1;
// const BOTTOM_EDGE = 2;
// const BOTTOM_RIGHT = 3;
// const LEFT_EDGE = 4;
// const CENTER = 5;
// const RIGHT_EDGE = 6;
// const TOP_LEFT = 7;
// const TOP_EDGE = 8;
// const TOP_RIGHT = 9;

class Board {
  cells = [];
  bombs = 0;
  // getCellPosition(cell, rows, columns) {
  //   if (cell.row == rows - 1 && cell.column == 0) {
  //     return BOTTOM_LEFT;
  //   }

  //   if (cell.row == rows - 1) {
  //     return BOTTOM_EDGE;
  //   } 

  //   if (cell.row == rows - 1 && cell.column == columns - 1) {
  //     return BOTTOM_RIGHT;
  //   }

  //   if (cell.column == 0) {
  //     return LEFT_EDGE;
  //   }

  //   if (cell.column == columns - 1) {
  //     return RIGHT_EDGE;
  //   }

  //   if (cell.row == 0 && cell.column == 0) {
  //     return TOP_LEFT;
  //   }

  //   if (cell.row == 0) {
  //     return TOP_EDGE
  //   } 

  //   if (cell.row == 0 && cell.column == columns - 1) {
  //     return TOP_RIGHT;
  //   }

  //   return CENTER;
  // }

  constructor(rows, columns, bombs) {
    this.bombs = bombs;

    this.createCells(rows, columns);
    this.addBombs(bombs);

    // set adjacent cells
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        this.setAdjacentCells(cell, rows, columns);
      });
    });

    console.table(this.displayBoard());
  }

  // console log sanity testing
  displayBoard() {
    let displayBoard = [];
    for (let i = 0; i < this.cells.length; i++) {
      let row = [];
      for (let j = 0; j < this.cells[i].length; j++) {
        let cell = this.cells[i][j];
        if (cell.isRevealed && cell.hasBomb) {
          row.push("X");
        } else if (cell.isRevealed) {
          row.push(cell.adjacentBombs);
        } else {
          row.push(" ");
        }
      }

      displayBoard.push(row);
    }

    return displayBoard;
  }

  createCells(rows, columns) {
    for (let i = 0; i < rows; i++) {
      let row = [];

      for (let j = 0; j < columns; j++) {
        row.push(new Cell(i, j));
      }

      this.cells.push(row);
    }    
  }

  addBombs(bombs) {
    let flatBoard = this.cells.flat();

    for(let i = 0; i < bombs; i++) {
      let index = Math.floor(Math.random() * flatBoard.length);
      flatBoard[index].hasBomb = true;
      flatBoard.splice(index, 1);
    }
  }

  getCell(row, column) {
    return this.cells[row][column];
  }

  setAdjacentCells(cell, rows, columns) {
    if (cell.row == 0 && cell.column == 0) { // top left corner
      cell.adjacentCells = [
        this.getCell(cell.row, cell.column + 1),
        this.getCell(cell.row + 1, cell.column),
        this.getCell(cell.row + 1, cell.column + 1),
      ];
    } else if (cell.row == 0 && cell.column == columns - 1) { // top right corner
      cell.adjacentCells = [
        this.getCell(cell.row, cell.column - 1),
        this.getCell(cell.row + 1, cell.column),
        this.getCell(cell.row + 1, cell.column - 1),
      ];
    } else if (cell.row == rows - 1 && cell.column == 0) { // bottom left corner
      cell.adjacentCells = [
        this.getCell(cell.row, cell.column + 1),
        this.getCell(cell.row - 1, cell.column),
        this.getCell(cell.row - 1, cell.column + 1),
      ];
    } else if (cell.row == rows - 1 && cell.column == columns - 1) { // bottom right corner
      cell.adjacentCells = [
        this.getCell(cell.row, cell.column - 1),
        this.getCell(cell.row - 1, cell.column),
        this.getCell(cell.row - 1, cell.column - 1),
      ];
    } else if (cell.row == 0) { // top edge 
      cell.adjacentCells = [
        this.getCell(cell.row, cell.column + 1),
        this.getCell(cell.row + 1, cell.column + 1),
        this.getCell(cell.row + 1, cell.column),
        this.getCell(cell.row + 1, cell.column - 1),
        this.getCell(cell.row, cell.column - 1),
      ];
    } else if (cell.row == rows - 1) { // bottom edge
      cell.adjacentCells = [
        this.getCell(cell.row, cell.column + 1),
        this.getCell(cell.row - 1, cell.column + 1),
        this.getCell(cell.row, cell.column - 1),
        this.getCell(cell.row - 1, cell.column - 1),
        this.getCell(cell.row - 1, cell.column),
      ];
    } else if (cell.column == 0) { // left edge
      cell.adjacentCells = [
        this.getCell(cell.row + 1, cell.column),
        this.getCell(cell.row + 1, cell.column + 1),
        this.getCell(cell.row, cell.column + 1),
        this.getCell(cell.row - 1, cell.column + 1),
        this.getCell(cell.row - 1, cell.column),
      ];
    } else if (cell.column == columns - 1) { // right edge
      cell.adjacentCells = [
        this.getCell(cell.row + 1, cell.column),
        this.getCell(cell.row + 1, cell.column - 1),
        this.getCell(cell.row, cell.column - 1),
        this.getCell(cell.row - 1, cell.column - 1),
        this.getCell(cell.row - 1, cell.column),
      ];
    } else { // somewhere in middle
      cell.adjacentCells = [
        this.getCell(cell.row - 1, cell.column),
        this.getCell(cell.row - 1, cell.column + 1),
        this.getCell(cell.row, cell.column + 1),
        this.getCell(cell.row + 1, cell.column + 1),
        this.getCell(cell.row + 1, cell.column),
        this.getCell(cell.row + 1, cell.column - 1),
        this.getCell(cell.row, cell.column - 1),
        this.getCell(cell.row - 1, cell.column - 1),
      ];
    }
  } 

  selectCell(row, column) {
    let cell = this.cells[row][column];
    if (cell.hasBomb) {
      console.log("game over!");
      let flatBoard = this.cells.flat();
      let bombCells = flatBoard.filter(cell => cell.hasBomb);
      bombCells.forEach(cell => cell.isRevealed = true);
      console.table(this.displayBoard());
      return;
    }

    this.revealCell(cell);

    console.table(this.displayBoard());

    let flatBoard = this.cells.flat();
    let remaining = flatBoard.filter(cell => !cell.isRevealed);

    if (remaining.length == this.bombs) {
      console.log("you win!");
      flatBoard.forEach(cell => cell.isRevealed = true);
      console.table(this.displayBoard());
    }
  }

  revealCell(cell) {
    if (cell.isRevealed || cell.isFlagged || cell.hasBomb) {
      return;
    }
  
    cell.isRevealed = true;
  
    if (cell.adjacentBombs == 0) {
      cell.adjacentCells.forEach(adjCell => {
        this.revealCell(adjCell);
      });
    }
  }


  #validateBoard(rows, columns, bombs) {
    // if (rows == 0) {
    //   throw "Number of rows must be greater than 0.";
    // }

    // if (columns == 0) {
    //   throw "Number of columns must be greater than 0.";
    // }

    // if (rows == 1 && columns == 1) {
    //   throw "Grid must be larger than 1 x 1";
    // }

    // let maxBombs = (rows * columns) - 1;

    // if (bombs == 0) {
    //   throw "Must have at least 1 bomb.";
    // }

    // if (bombs > maxBombs) {
    //   throw `Cannot have more than ${maxBombs} for a grid of size ${rows} x ${columns}`;
    // }
  }
}

class Cell {
  row = 0;
  column = 0;
  hasBomb = false;
  isRevealed = false;
  isFlagged = false;
  adjacentCells = [];

  constructor(row, column) {
    this.row = row;
    this.column = column;
  }

  get adjacentBombs() {
    return this.adjacentCells.reduce(
      (count, cell) => cell.hasBomb ? count + 1 : count, 0
    );    
  }
}

function createCell(x, y) {
  return {
    x,
    y,
    hasBomb: false,
    flagged: false,
    revealed: false,
    adjacentBombs: 0,
    adjacentCells: []
  }
}

function createRow(rowNumber, columns) {
  let row = [];

  for (let i = 0; i < columns; i++) {
    row.push(createCell(i, rowNumber));
  }

  return row;
}

function createBoard(rows, columns) {
  let board = [];

  for (let i = 0; i < rows; i++) {
    board.push(createRow(i, columns));
  }

  return board;
}

function applyBombs(board, numberOfBombs) {
  // get random indices from board
  let flatBoard = board.flat();
  let chosenCells = [];
  
  while (chosenCells.length < numberOfBombs) {
    let index = Math.floor(Math.random() * flatBoard.length);
    chosenCells.push(flatBoard[index]);
    flatBoard.splice(index, 1);
  }

  console.table(chosenCells);

  chosenCells.forEach(cell => {
    board[cell.y][cell.x].hasBomb =  true;
  });
}

function getCell(board, row, column) {
  if (row >= board.length || row < 0) {
    return null;
  }

  if (column >= board[row].length || column < 0) {
    return null;
  }

  return board[row][column];
}

function initAdjacentCells(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let cell = board[i][j];

      cell.adjacentCells = [
        getCell(board, i - 1, j - 1),
        getCell(board, i - 1, j),
        getCell(board, i - 1, j + 1),
        getCell(board, i, j - 1),
        getCell(board, i, j + 1),
        getCell(board, i + 1, j - 1),
        getCell(board, i + 1, j),
        getCell(board, i + 1, j + 1),
      ];

      let adjacentBombs = cell.adjacentCells.reduce(
        (count, cell) => {
          if (cell && cell.hasBomb) {
            count += 1
          }

          return count;
        }, 0
      );

      board[i][j].adjacentBombs = adjacentBombs;
    }
  }
}

function test() {
  let board = createBoard(3, 3);
  applyBombs(board, 1);
  console.table(board);

  initAdjacentCells(board);
  console.table(board);
  return board;
}


function displayTest(board) {
  let display = Array.from({ length: 3 }, () => Array(3).fill(" "));
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      let cell = board[i][j];

      if (cell.revealed) {
        if (cell.hasBomb) {
          display[i][j] = "X"
        }
        else if (cell.adjacentBombs) {
          display[i][j] = cell.adjacentBombs;
        } else {
          display[i][j] = "_";
        }
      } else {
        display[i][j] = " ";
      }
    }
  } 

  console.table(display);
}

function clickCell(board, row, col) {
  let cell = board[row][col];
  if (cell.revealed || cell.flagged) {
    return;
  }

  console.log(cell);

  if (cell.hasBomb) {
    console.log("game over!");
    return;
  }

  revealCell(cell);

  displayTest(board);
}

function revealCell(cell) {
  if (!cell) {
    return;
  }

  if (cell.revealed || cell.flagged || cell.hasBomb) {
    return;
  }

  cell.revealed = true;

  if (cell.adjacentBombs == 0) {
    cell.adjacentCells.forEach(adjCell => {
      revealCell(adjCell);
    })
  }
}
