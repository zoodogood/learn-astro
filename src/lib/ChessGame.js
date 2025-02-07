// @ts-check
import { EventsEmitter } from "./EventsEmitter.js";

class Board {
  width = 8;
  height = 8;
}

// For implement black and white & more figures
const PieceOffensiveDirection = {
  Right: "right",
  Left: "left",
  Top: "top",
  Bottom: "bottom",
};

/**
 *
 * @param {keyof typeof PieceOffensiveDirection} direction
 * @returns {[number, number]}
 */
function resolveDirection(direction) {
  // @ts-expect-error ReturnType "can have more than 2 elements"
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
};

class Positions extends Map {
  toJSON() {
    return [...this.values()];
  }
}

class Position {
  #position;
  constructor(x, y) {
    this.#position = [x, y];
  }
  *[Symbol.iterator]() {
    for (const point of this.#position) {
      yield point;
    }
    return;
  }
  get x() {
    return this.#position[0];
  }

  set x(value) {
    this.#position[0] = value;
  }

  get y() {
    return this.#position[0];
  }

  set y(value) {
    this.#position[1] = value;
  }

  toString() {
    return this.#position.join(",");
  }
}

class PieceUtil {}

class BasePiece {
  position = new Position(0, 0);
  offensiveDirection = null;
  stepsCount = 0;
  emitter = new EventsEmitter();

  onPick() {
    throw new Error("Must be implemented");
  }

  onPickCancelled() {
    throw new Error("Must be implemented");
  }

  onMove() {
    throw new Error("Must be implemented");
  }

  onKilled() {
    throw new Error("Must be implemented");
  }

  requestMove(position, game) {
    if (this.canMovedTo(position, game)) {
      return false;
    }
    return this._move(position);
  }

  _move(position) {
    const event = new Event(PieceEvent.BeforeMove, { cancelable: true });
    const context = { position, event, piece: this };
    this.emitter.emit(PieceEvent.BeforeMoveMove, context);
    if (event.defaultPrevented) {
      return;
    }
    this.emitter.emit(PieceEvent.Move, context);
    this.position = position;
  }

  /**
   *
   * @param {Position} position
   * @param {Game} game
   * @returns {boolean}
   */
  canMovedTo(position, game) {
    throw new Error("Must be implemented");
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
    const {
      game: { board },
    } = watcher;
    if (!board) {
      return;
    }

    for (let indexY = 0; indexY < board.width; indexY++) {
      for (let indexX = 0; indexX < board.height; indexX++) {
        if (watcher.stopped || watcher.limit < indexX * indexY + indexX) {
          return;
        }
        yield new Position(indexX, indexY);
      }
    }
    return;
  }

  // eslint-disable-next-line require-yield
  static *aroundPiece(_watcher) {
    throw new Error(
      "If you need this behaviour, please create issue on github",
    );
  }

  // eslint-disable-next-line require-yield
  static *onViewOnRealTime(_watcher) {
    throw new Error(
      "If you need this behaviour, please create issue on github",
    );
  }

  static strategies = {
    cellByCellOnBoard: this.cellByCellOnBoard,
    aroundPiece: this.cellByCellOnBoard,
    onViewOnRealTime: this.onViewOnRealTime,
  };
}

class Game {
  positions = new Positions();
  board = null;
  emitter = new EventsEmitter();
  init() {
    console.info("Is can be implemented");
  }
  setBoard(board) {
    this.board = board;
    return this;
  }

  onAddPiece({ piece }) {
    const position = piece.position.toString();
    this.positions.set(position, piece);
  }
  static cellsWatcherDefaultStrategy =
    CellsWatcher.strategies.cellByCellOnBoard;
}

export {
  Board,
  BasePiece,
  Game,
  CellsWatcher,
  PieceOffensiveDirection,
  resolveDirection,
};
