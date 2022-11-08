class Board {
  cells = [];
  bombs = 0;
  rows = 0;
  columns = 0;

  constructor(rows, columns, bombs) {
    this.rows = rows;
    this.columns = columns;
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

  // edge case: 1x1 grid
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

const container = document.getElementById("container");

function initGame() {
  let b = new Board(3, 3, 1);

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("div");
      cell.dataset.row = i;
      cell.dataset.column = j;
      cell.className = "cell";
      container.appendChild(cell);
      // cell.addEventListener("click", () => {
      //   b.selectCell(i, j);
      //   cell.innerText = b.getCell(i, j).adjacentBombs;
      // });
    }
  }

  for(let i = 0; i < container.children.length; i++) {
    let child = container.children[i];
    child.addEventListener("click", () => {
      b.selectCell(child.dataset.row, child.dataset.column);

      b.cells.flat().forEach(cell => {
        if (cell.isRevealed) {
          let test = container.querySelector(`[data-row="${cell.row}"][data-column="${cell.column}"]`);
          test.innerText = cell.adjacentBombs;
        }
      })
    })
  }
}
