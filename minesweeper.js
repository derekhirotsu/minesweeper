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
