// @ts-check
import { BasePiece, resolveDirection } from "@lib/ChessGame.js";
import { getDistance2d } from "@lib/MathUtils.js";
class Pawn extends BasePiece {
  stepSize = 1;
  firstStepSize = 2;
  canMovedTo(targetX, targetY, _game) {
    if (!this.canMoveAlongDirection({ targetX, targetY })) {
      return false;
    }

    const { position, stepsCount } = this;
    const [myX, myY] = position;
    const maximumStepSize = (() => {
      const isFirstStep = stepsCount === 0;
      const { stepSize, firstStepSize } = this;
      return isFirstStep ? firstStepSize : stepSize;
    })();
    if (
      Math.round(getDistance2d(myX, myY, targetX, targetY)) > maximumStepSize
    ) {
      return false;
    }

    return true;
  }
  canMoveAlongDirection({ targetX, targetY }) {
    const { offensiveDirection, position } = this;
    if (!offensiveDirection) {
      return true;
    }
    const [myX, myY] = position;
    const [byX, byY] = resolveDirection(offensiveDirection);
    return (
      (byX === 1 && myX < targetX) ||
      (byX === -1 && myX > targetX) ||
      (byY === -1 && myY < targetY) ||
      (byY === 1 && myY > targetY)
    );
  }
}

export { Pawn };
