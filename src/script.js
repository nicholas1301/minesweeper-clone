import Board from "./controllers/board.controller.js";

document.querySelector("button").addEventListener("click", (event) => {
  Board.setGridDimensions(event);
  hideForm();
});

function hideForm() {
  const form = document.querySelector("form");
  form.style.display = "none";
  const board = document.querySelector(".board");
  board.style.marginTop = "100px";
}
