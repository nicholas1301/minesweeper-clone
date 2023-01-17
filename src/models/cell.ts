class Cell {
  private isMine: boolean;
  private adjacentMines: number;
  private revealed: boolean;

  constructor() {
      this.isMine = false;
      this.adjacentMines = 0;
      this.revealed = false;
  }

  public reveal() {
      // logic to reveal the cell
  }
}