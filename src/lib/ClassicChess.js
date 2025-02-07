// @ts-check
import { Game, Board, CellsWatcher } from "@lib/ChessGame.js";

class ClassicGame extends Game {
  init() {
    this.setBoard(new Board());
  }

  static cellsWatcherDefaultStrategy =
    CellsWatcher.strategies.cellByCellOnBoard;
}

export { ClassicGame as ClassicChess };
