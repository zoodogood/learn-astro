
// @ts-check
import { EventsEmitter } from "./EventsEmmiter";


class Board {
	width = 8;
	height = 8;
}

// For implement black and white & more figures
const PieceOffensiveDirection = {
	Right: "right",
	Left: "left",
	Top: "top",
	Bottom: "bottom"
}

function resolveDirection(direction) {
	return {
		[PieceOffensiveDirection.Right]: [1, 0],
		[PieceOffensiveDirection.Left]: [-1, 0],
		[PieceOffensiveDirection.Top]: [0, 1],
		[PieceOffensiveDirection.Bottom]: [0, -1],
	}[direction];
}


const PieceEvent = {
	BeforeMove: "beforeMove",
	Move: "move",

}

class PieceUtil {
	
}

class BasePiece {
	position = [0, 0];
	offensiveDirection = null;
	stepsCount = 0;
	emitter = new EventsEmitter();

	onPick() {
		console.info("Is can be implemented");
	}

	onMove() {
		console.info("Is can be implemented");
	}
	
	onKilled() {
		console.info("Is can be implemented");
	}
	
	requestMove([x, y], game) {
		if (this.canMovedTo(x, y, game)) {
			return false;
		}
		return this._move([x, y]);
	}

	_move([x, y]) {
		const event = new Event(PieceEvent.BeforeMove, { cancelable: true });
		const context = { position: [x, y], event, piece: this };
		this.emitter.emit(PieceEvent.BeforeMoveMove, context);
		if (event.defaultPrevented) {
			return;
		}
		this.emitter.emit(PieceEvent.Move, context);
		this.position = [x, y];
	}

	/**
	 * 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {Game} game 
	 * @returns {boolean}
	 */
	canMovedTo(x, y, game) {
		throw new Error("Must be implemented");
	}

	static from(props){
		return Object.assign(Object.create(this.prototype), props);
	}
}

class CellsWatcher {
	// genera;
	limit = 5_000;
	emitter = new EventsEmitter();
	/** @type {boolean | null} */
	stopped = null;

	// addable
	/** @type {Game | null} */
	game = null;
	/** @type {[number, number] | null} */
	entryPosition = null;
	/** @type {number | null} */
	rectangleRadiusLimit = null;
	

	setRectangleRadiusLimit(radius) {
		this.rectangleRadiusLimit = radius;
		return this;
	}

	setEntryPosition(position) {
		this.entryPosition = position;
		return this;
	}

	setGame(game) {
		this.game = game;
		return this;
	}

	stop(code) {
		this.stopped = true;
		this.emitter.emit("stop", code);
	}

	watchGenerator(strategy) {
		this.stopped = false;
		return strategy(this);
	}



	static *cellByCellOnBoard(watcher) {
		const { game: {board} } = watcher;
		if (!board) {
			return;
		}

		for (let indexY = 0; indexY < board.width; indexY++){
			for (let indexX = 0; indexX < board.height; indexX++){
				if (watcher.stopped || watcher.limit < indexX * indexY + indexX) {
					return;
				}
				yield [indexX, indexY];
			}
		}
		return;
	}

	static *aroundPiece(watcher) {
		throw new Error("If you need this behaviour, please create issue on github");
	}

	static *onViewOnRealTime(watcher) {
		throw new Error("If you need this behaviour, please create issue on github");
	}

	static strategies = {
		cellByCellOnBoard: this.cellByCellOnBoard,
		aroundPiece: this.cellByCellOnBoard,
		onViewOnRealTime: this.onViewOnRealTime
	};
}

class Game {
	positions = new Map();
	board = null;
	emitter = new EventsEmitter();
	init() {
		console.info("Is can be implemented");
	}
	setBoard(board) {
		this.board = board;
		return this;
	}

	onAddPiece({piece}){
		const position = piece.position.toString();
		this.positions.set(position, piece);
	}

	static cellsWatcherDefaultStrategy = CellsWatcher.strategies.cellByCellOnBoard;
}

export { Board, BasePiece, Game, CellsWatcher, PieceOffensiveDirection, resolveDirection };
