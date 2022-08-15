export default class Game {
  constructor(width, height, bombs) {
    this.width = width;
    this.height = height;
    this.board = Game.makeNewBoard(width, height);
    this.flags = 0;
    this.bombs = bombs;
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

  renderGrid(gameOn = true) {
    const grid = document.querySelector(".board");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const cell = document.createElement("div");
        if (gameOn)
          cell.addEventListener("contextmenu", (e) => this.toggleFlag(e));
        cell.id = row + "-" + col;
        switch (this.board[row][col]) {
          case "x":
            cell.classList.add("bomb");
            break;
          case "X":
            cell.classList.add("exploded");
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
            cell.addEventListener("click", (e) => this.openAdjacent(e));
            break;
          case "2":
            cell.innerText = "2";
            cell.classList.add("two");
            cell.addEventListener("click", (e) => this.openAdjacent(e));
            break;
          case "3":
            cell.innerText = "3";
            cell.classList.add("three");
            cell.addEventListener("click", (e) => this.openAdjacent(e));
            break;
          case "4":
            cell.innerText = "4";
            cell.classList.add("four");
            cell.addEventListener("click", (e) => this.openAdjacent(e));
            break;
          case "5":
            cell.innerText = "5";
            cell.classList.add("five");
            cell.addEventListener("click", (e) => this.openAdjacent(e));
            break;
          case "6":
            cell.innerText = "6";
            cell.classList.add("six");
            cell.addEventListener("click", (e) => this.openAdjacent(e));
            break;
          case "7":
            cell.innerText = "7";
            cell.classList.add("seven");
            cell.addEventListener("click", (e) => this.openAdjacent(e));
            break;
          default:
            if (gameOn) cell.addEventListener("click", (e) => this.guess(e));
        }
        grid.append(cell);
      }
    }
  }

  static createAnswerBoard(numBombs, width, height, clickCoords) {
    const [clickX, clickY] = clickCoords;
    const adjacent = [
      [clickX - 1, clickY - 1],
      [clickX - 1, clickY],
      [clickX - 1, clickY + 1],
      [clickX, clickY - 1],
      [clickX, clickY],
      [clickX, clickY + 1],
      [clickX + 1, clickY - 1],
      [clickX + 1, clickY],
      [clickX + 1, clickY + 1],
    ];
    let answerBoard = Game.makeNewBoard(width, height);
    while (numBombs) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      if (answerBoard[y][x] === "x") continue;
      if (
        adjacent.some(
          (coords) => JSON.stringify(coords) === JSON.stringify([y, x])
        )
      )
        continue;
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
    if (this.board[x][y] === "f") {
      this.board[x][y] = "o";
      this.flags--;
    } else {
      this.board[x][y] = "f";
      this.flags++;
    }
    let win = false;
    if (this.flags === this.bombs) {
      win = this.checkVictory();
    }
    this.renderGrid(!win);
    if (win)
      document.querySelector(".victory-msg-container").style.display = "block";
  }

  checkVictory() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.answer[i][j] !== "x" && this.board[i][j] !== this.answer[i][j])
          return false;
        if (this.answer[i][j] === "x" && this.board[i][j] !== "f") return false;
      }
    }
    return true;
  }

  guess(event) {
    const coords = event.target.id.split("-");
    const x = +coords[0];
    const y = +coords[1];
    if (!this.answer) {
      this.answer = Game.createAnswerBoard(
        this.bombs,
        this.width,
        this.height,
        [x, y]
      );
    }
    if (this.board[x][y] === "f") return;
    if (this.answer[x][y] === "x") {
      this.gameOver(event);
      return;
    }
    this.open(x, y);
    let win = false;
    if (this.flags === this.bombs) {
      win = this.checkVictory();
    }
    this.renderGrid(!win);
    if (win)
      document.querySelector(".victory-msg-container").style.display = "block";
  }

  gameOver(event) {
    this.showAllBombs();
    const coords = event.target.id.split("-");
    const x = +coords[0];
    const y = +coords[1];
    this.board[x][y] = "X";
    this.renderGrid(false);
    document.querySelector(".defeat-msg-container").style.display = "block";
  }

  showAllBombs() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (this.answer[i][j] === "x" && this.board[i][j] !== "f")
          this.board[i][j] = "x";
      }
    }
  }

  // const candidates = [
  //   [row - 1, col - 1],
  //   [row - 1, col],
  //   [row - 1, col + 1],
  //   [row, col - 1],
  //   [row, col + 1],
  //   [row + 1, col - 1],
  //   [row + 1, col],
  //   [row + 1, col + 1],
  // ];
  // candidates.forEach((coords) => this.open(...coords));
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
            this.board[x][y] === "o" // [x, y] hasn't been explored
          ) {
            queue.push([x, y]);
          }
        }
      }
    } else {
      this.board[row][col] = this.answer[row][col];
    }
  }

  openAdjacent(event) {
    const num = +event.target.innerText;
    const [x, y] = event.target.id.split("-").map((x) => +x);
    // verify if the number of adjacent flags is equal to num
    const adjacentCoords = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x, y - 1],
      [x + 1, y - 1],
      [x + 1, y],
      [x + 1, y + 1],
    ];
    const numAdjacentFlags = adjacentCoords.filter(
      ([row, col]) => this.board[row]?.[col] === "f"
    ).length;
    if (numAdjacentFlags === num) {
      const coordsToClick = adjacentCoords.filter(
        ([row, col]) => this.board[row]?.[col] === "o"
      );
      coordsToClick.forEach(([row, col]) =>
        document.getElementById(row + "-" + col).click()
      );
    }
  }

  // recursively calling click: exceeds maximum call stack size but is somehow working??
  openAllAdjacent(row, col) {
    const prevRow = this.board[row - 1];
    const nextRow = this.board[row + 1];
    const prevCol = this.board[row][col - 1];
    const nextCol = this.board[row][col + 1];

    if (prevCol !== undefined && this.board[row][col - 1] === "o") {
      document.getElementById(`${row}-${col - 1}`).click();
    }
    if (nextCol !== undefined && this.board[row][col + 1] === "o") {
      document.getElementById(`${row}-${col + 1}`).click();
    }

    if (prevRow !== undefined) {
      if (this.board[row - 1][col] === "o") {
        document.getElementById(`${row - 1}-${col}`).click();
      }
      if (prevCol !== undefined && this.board[row - 1][col - 1] === "o") {
        document.getElementById(`${row - 1}-${col - 1}`).click();
      }
      if (nextCol !== undefined && this.board[row - 1][col + 1] === "o") {
        document.getElementById(`${row - 1}-${col + 1}`).click();
      }
    }

    if (nextRow !== undefined) {
      if (this.board[row + 1][col] === "o") {
        document.getElementById(`${row + 1}-${col}`).click();
      }
      if (prevCol !== undefined && this.board[row + 1][col - 1] === "o") {
        document.getElementById(`${row + 1}-${col - 1}`).click();
      }
      if (nextCol !== undefined && this.board[row + 1][col + 1] === "o") {
        document.getElementById(`${row + 1}-${col + 1}`).click();
      }
    }
  }
}
