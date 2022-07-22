export default class Game {
  // static board = ;

  constructor(width, height, bombs) {
    this.width = width;
    this.height = height;
    this.board = Game.makeNewBoard(width, height);

    // should not be set on the constructor, only on first guess:
    this.answer = Game.createAnswerBoard(bombs, width, height);
  }

  static makeNewBoard(width, height) {
    const board = [];
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push("o");
      }
      board.push(row);
    }
    return board;
  }

  renderGrid() {
    const grid = document.querySelector(".board");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const cell = document.createElement("div");
        cell.addEventListener("contextmenu", (e) => this.toggleFlag(e));
        cell.id = row + "-" + col;
        switch (this.board[row][col]) {
          case "x":
            cell.classList.add("bomb");
            break;
          case "f":
            cell.classList.add("flag");
            break;
          case "0":
            cell.classList.add("zero");
            break;
          case "1":
            cell.innerText = "1";
            cell.classList.add("one");
            break;
          case "2":
            cell.innerText = "2";
            cell.classList.add("two");
            break;
          case "3":
            cell.innerText = "3";
            cell.classList.add("three");
            break;
          case "4":
            cell.innerText = "4";
            cell.classList.add("four");
            break;
          case "5":
            cell.innerText = "5";
            cell.classList.add("five");
            break;
          case "6":
            cell.innerText = "6";
            cell.classList.add("six");
            break;
          case "7":
            cell.innerText = "7";
            cell.classList.add("seven");
            break;
          default:
            cell.addEventListener("click", (e) => this.guess(e));
        }
        grid.append(cell);
      }
    }
  }

  // should be called with the first click on the board
  // the clicked cell should be a guaranteed 0, i.e. bombs can't be placed on any adjacent squares
  static createAnswerBoard(numBombs, width, height) {
    let answerBoard = Game.makeNewBoard(width, height);
    while (numBombs) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (answerBoard[y][x] === "x") continue;
      answerBoard[y][x] = "x";
      numBombs--;
    }
    answerBoard = Game.populateNumbers(answerBoard);
    return answerBoard;
  }

  static populateNumbers(board) {
    const height = board.length;
    const width = board[0].length;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        if (board[row][col] === "x") continue;
        const numAdjacentBombs = Game.getAdjacentBombs(row, col, board);
        board[row][col] = numAdjacentBombs.toString();
      }
    }
    return board;
  }

  static getAdjacentBombs(row, col, board) {
    const adjacentSquares = [
      board[row - 1]?.[col - 1],
      board[row - 1]?.[col],
      board[row - 1]?.[col + 1],
      board[row][col - 1],
      board[row][col + 1],
      board[row + 1]?.[col - 1],
      board[row + 1]?.[col],
      board[row + 1]?.[col + 1],
    ];
    return adjacentSquares.filter((square) => square === "x").length;
  }

  toggleFlag(event) {
    event.preventDefault();
    const coords = event.target.id.split("-");
    const x = +coords[0];
    const y = +coords[1];
    if (this.board[x][y] !== "o" && this.board[x][y] !== "f") return;
    if (this.board[x][y] === "f") this.board[x][y] = "o";
    else this.board[x][y] = "f";
    this.renderGrid();
  }

  guess(event) {
    const coords = event.target.id.split("-");
    const x = +coords[0];
    const y = +coords[1];
    if (this.board[x][y] === "f") return;
    this.open(x, y);
    this.renderGrid();
  }

  open(row, col) {
    if (this.answer[row][col] === "0") {
      // breadth first search

      const queue = [];
      queue.push([row, col]);
      while (queue.length > 0) {
        const [nextRow, nextCol] = queue.shift();
        this.board[nextRow][nextCol] = this.answer[nextRow][nextCol];
        if (this.board[nextRow][nextCol] !== "0") continue;
        const candidates = [
          [nextRow - 1, nextCol - 1],
          [nextRow - 1, nextCol],
          [nextRow - 1, nextCol + 1],
          [nextRow, nextCol - 1],
          [nextRow, nextCol + 1],
          [nextRow + 1, nextCol - 1],
          [nextRow + 1, nextCol],
          [nextRow + 1, nextCol + 1],
        ];
        for (const coords of candidates) {
          const x = coords[0];
          const y = coords[1];
          if (
            0 <= x &&
            x < this.height &&
            0 <= y &&
            y < this.width && // [x, y] exists in the board
            this.board[x][y] === "o" && // [x, y] hasn't been explored
            this.answer[x][y] !== "x" // [x, y] doesn't have a bomb
          ) {
            queue.push([x, y]);
          }
        }
      }
    } else {
      this.board[row][col] = this.answer[row][col];
    }
  }

  // one event: a click on a 0
  // should update this.board
  // one call of renderGrid()

  // recursively calling click: exceeds maximum call stack size but is somehow working??
  // openAllAdjacent(row, col) {
  //   const prevRow = this.board[row - 1];
  //   const nextRow = this.board[row + 1];
  //   const prevCol = this.board[row][col - 1];
  //   const nextCol = this.board[row][col + 1];

  //   if (prevCol !== undefined && this.board[row][col - 1] === "o") {
  //     document.getElementById(`${row}-${col - 1}`).click();
  //   }
  //   if (nextCol !== undefined && this.board[row][col + 1] === "o") {
  //     document.getElementById(`${row}-${col + 1}`).click();
  //   }

  //   if (prevRow !== undefined) {
  //     if (this.board[row - 1][col] === "o") {
  //       document.getElementById(`${row - 1}-${col}`).click();
  //     }
  //     if (prevCol !== undefined && this.board[row - 1][col - 1] === "o") {
  //       document.getElementById(`${row - 1}-${col - 1}`).click();
  //     }
  //     if (nextCol !== undefined && this.board[row - 1][col + 1] === "o") {
  //       document.getElementById(`${row - 1}-${col + 1}`).click();
  //     }
  //   }

  //   if (nextRow !== undefined) {
  //     if (this.board[row + 1][col] === "o") {
  //       document.getElementById(`${row + 1}-${col}`).click();
  //     }
  //     if (prevCol !== undefined && this.board[row + 1][col - 1] === "o") {
  //       document.getElementById(`${row + 1}-${col - 1}`).click();
  //     }
  //     if (nextCol !== undefined && this.board[row + 1][col + 1] === "o") {
  //       document.getElementById(`${row + 1}-${col + 1}`).click();
  //     }
  //   }
  // }
}
