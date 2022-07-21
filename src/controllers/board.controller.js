export default class Board {
  static setGridDimensions(event) {
    event.preventDefault();
    const difficulty = document.querySelector(
      'input[name="difficulty"]:checked'
    ).value;
    let width, height;
    if (difficulty === "easy") {
      width = 9;
      height = 9;
    } else if (difficulty === "medium") {
      width = 16;
      height = 16;
    } else if (difficulty === "hard") {
      width = 30;
      height = 16;
    }
    const board = Board.makeNewBoard(width, height);
    Board.renderGrid(board);
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

  static renderGrid(board) {
    const grid = document.querySelector(".board");
    grid.innerHTML = "";
    const height = board.length;
    const width = board[0].length;
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const cell = document.createElement("div");
        cell.id = row + "-" + col;
        switch (board[row][col]) {
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
        }
        grid.append(cell);
      }
    }
  }

  static createAnswerBoard() {
    return;
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
