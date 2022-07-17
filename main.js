document.querySelector('button').addEventListener('click', setGridDimensions);

function setGridDimensions(event) {
  event.preventDefault();
  const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
  const grid = document.querySelector('.board');
  grid.innerHTML = '';
  if (difficulty === 'easy') {
    width = 9;
    height = 9;
  } else if (difficulty === 'medium') {
    width = 16;
    height = 16;
  } else if (difficulty === 'hard') {
    width = 30;
    height = 16;
  }
  makeCells(width * height);
  grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
  // grid.style.height = (height/width)*700 + 'px';

  //each square's width: 700px/width;
  // each square's height should be 700px/width,
  //which means total board height should be height*700px/width
}

function makeCells(n) {
  const grid = document.querySelector('.board');
  let i = 0;
  while (i < n) {
    const cell = document.createElement('div');
    grid.append(cell);
    i++;
  }
}