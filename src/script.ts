import Game from "./game.js";

document.querySelector("button")!.addEventListener("click", (event) => {
  event.preventDefault();
  const difficulty = (document.querySelector(
    'input[name="difficulty"]:checked'
  )! as any).value;
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
  } else if (difficulty === "custom") {
    width = (document.getElementById("widthInput")! as any).value;
    height = (document.getElementById("heightInput")! as any).value;
    bombs = (document.getElementById("bombsInput")! as any).value;
  }
  const game = new Game(width, height, bombs);
  game.renderGrid();
  hideForm();
});

document
  .querySelectorAll(".play-again-btn")
  .forEach((node) => node.addEventListener("click", playAgain));

function hideForm() {
  const h1 = document.querySelector("h1")!;
  h1.style.display = "none";
  const form = document.querySelector("form")!;
  form.style.display = "none";
}

function playAgain(event: any) {
  const grid = document.querySelector(".board")!;
  grid.innerHTML = "";
  const h1 = document.querySelector("h1")!;
  h1.style.display = "block";
  const form = document.querySelector("form")!;
  form.style.display = "flex";
  // hide target div
  event.target.parentNode.parentNode.style.display = "none";
}

const inputs = document.getElementsByName("difficulty");
[...inputs].forEach((node) =>
  node.addEventListener("input", handleDifficultySelection)
);

function handleDifficultySelection(event: any) {
  const custom: any = document.getElementById("custom")!;
  const settings: any = document.querySelector(".custom-settings")!;
  if (custom.checked) {
    settings.hidden = false;
  } else {
    settings.hidden = true;
  }
}

const widthInput: any = document.getElementById("widthInput")!;
widthInput?.addEventListener("input", handleDimensionsChange);

const heightInput: any = document.getElementById("heightInput")!;
heightInput?.addEventListener("input", handleDimensionsChange);

const slider: any = document.getElementById("bombsInput")!;
slider?.addEventListener("input", updateBombCount);

function handleDimensionsChange(event: any) {
  const MAX_AREA = 5000;
  const EASY_DENSITY = 10 / 81;
  const MED_DENSITY = 40 / 256;
  const HARD_DENSITY = 99 / 480;

  const width = widthInput.value;
  const height = heightInput.value;
  const area = width * height;
  const bombNumberTag: any = document.getElementById("bombNumber")!;
  const bombSection: any = document.querySelector(".bomb-section")!;
  const warningArea: any = document.querySelector(".warningArea")!;
  if (area > MAX_AREA) {
    warningArea.hidden = false;
  } else {
    warningArea.hidden = true;
  }
  const warningWidth: any = document.querySelector(".warningWidth")!;
  if (width > 16) {
    warningWidth.hidden = false;
  } else {
    warningWidth.hidden = true;
  }

  if (width && height) {
    bombSection.hidden = false;
    slider.min = Math.round(area * EASY_DENSITY);
    slider.max = Math.round(area * HARD_DENSITY);
    slider.value = Math.round(area * MED_DENSITY);
    bombNumberTag.innerHTML =
      slider.value + '<span class="blue">(medium)</span>';
  } else {
    bombSection.hidden = true;
  }
}

function updateBombCount(event: any) {
  const EASY_SPAN = '<span class="green">(easy)</span>';
  const MED_SPAN = '<span class="blue">(medium)</span>';
  const HARD_SPAN = '<span class="red">(hard)</span>';
  const max = event.target.max;
  const min = event.target.min;
  const dif = max - min;
  const highThreshold = +min + (2 * dif) / 3;
  const lowThreshold = +min + dif / 3;

  const bombCount = event.target.value;
  let msg;
  if (bombCount > highThreshold) {
    msg = HARD_SPAN;
  } else if (bombCount > lowThreshold) {
    msg = MED_SPAN;
  } else {
    msg = EASY_SPAN;
  }
  const bombNumberTag = document.getElementById("bombNumber")!;
  bombNumberTag.innerHTML = bombCount + msg;
}
