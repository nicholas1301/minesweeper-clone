import Game from "./game.js";

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
    width = 16;
    height = 30;
    bombs = 99;
  }
  const game = new Game(width, height, bombs);
  game.renderGrid();
  hideForm();
});

document
  .querySelectorAll(".play-again-btn")
  .forEach((node) => node.addEventListener("click", playAgain));

function hideForm() {
  const h1 = document.querySelector("h1");
  h1.style.display = "none";
  const form = document.querySelector("form");
  form.style.display = "none";
}

function playAgain(event) {
  const grid = document.querySelector(".board");
  grid.innerHTML = "";
  const h1 = document.querySelector("h1");
  h1.style.display = "block";
  const form = document.querySelector("form");
  form.style.display = "flex";
  // hide target div
  event.target.parentNode.parentNode.style.display = "none";
}
