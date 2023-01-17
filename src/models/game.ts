class Game {
  private board: Board;
  private gameOver: boolean;
  private gameWon: boolean;

  constructor(boardSize: number, numMines: number) {
      this.board = new Board(boardSize, numMines);
      this.gameOver = false;
      this.gameWon = false;
  }

  public start() {
      // logic to set up the game and start the player's turn
  }

  public reset() {
      // logic to reset the game and start a new round
  }

  public checkWin() {
      // logic to check if the player has won the game
  }

  public checkLose() {
      // logic to check if the player has lost the game
  }
}