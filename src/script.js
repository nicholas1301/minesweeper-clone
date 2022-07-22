import Game from "./controllers/game.controller.js";

document.querySelector("button").addEventListener("click", (event) => {
  event.preventDefault();
  const difficulty = document.querySelector(
    'input[name="difficulty"]:checked'
  ).value;
  let width, height, bombs;
  if (difficulty === "easy") {
    width = 9;
    height = 9;
    bombs = 10;
  } else if (difficulty === "medium") {
    width = 16;
    height = 16;
    bombs = 40;
  } else if (difficulty === "hard") {
    width = 30;
    height = 16;
    bombs = 99;
  }
  const game = new Game(width, height, bombs);
  game.renderGrid();
  hideForm();
});

function hideForm() {
  const form = document.querySelector("form");
  form.style.display = "none";
  const board = document.querySelector(".board");
  board.style.marginTop = "100px";
}
