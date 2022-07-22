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
            cell.addEventListener("contextmenu", Game.toggleFlag);
            cell.addEventListener("click", Game.guess);
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

  static toggleFlag(event) {
    event.preventDefault();
    event.target.classList.toggle("flag");
  }

  static guess(event) {
    if (event.target.classList.contains("flag")) return;
    const coords = event.target.id.split("-");
    // Game.board[(coords[0], coords[1])] = Game.answer[(coords[0], coords[1])];
  }
  // [[o,2,x,2,o,o,o,o,o],
  // [o,2,x,2,1,1,o,o,o],
  // [o,1,1,2,x,2,1,o,o],
  // [o,o,o,1,2,x,1,o,o],
  // [o,o,o,o,1,1,1,o,o],
  // [o,o,o,o,o,o,o,o,o],
  // [o,o,o,o,o,o,o,o,o],
  // [o,o,o,o,o,o,o,o,o],
  // [o,o,o,o,o,o,o,o,o]]
}
