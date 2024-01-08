// @ts-check
import { Game, Board, CellsWatcher } from "../lib/ChessGame";



class ClassicGame extends Game {
	init() {
		this.setBoard(new Board());
	}

	static cellsWatcherDefaultStrategy = CellsWatcher.strategies.cellByCellOnBoard;
}

export { ClassicGame as ClassicChess };