// @ts-check
import { BasePiece, resolveDirection } from "./ChessGame";
import { getDistance2d } from "./MathUtils";
class Pawn extends BasePiece {
	stepSize = 1;
	fisrtStepSize = 2;
	canMovedTo(targetX, targetY, pieceData) {
		if (!this.canMoveAlongDirection({ pieceData, targetX, targetY })) {
			return false;
		}
		
		const { position, stepsCount } = pieceData;
		const [myX, myY] = position;
		const maximumStepSize = (() => {
			const isFirstStep = stepsCount === 0;
			const { stepSize, fisrtStepSize } = this;
			return isFirstStep ? fisrtStepSize : stepSize;

		})();
		if (Math.round(getDistance2d(myX, targetX, myY, targetY)) > maximumStepSize) {
			return false;
		}

		return true;

	}

	canMoveAlongDirection({ pieceData, targetX, targetY }) {
		const { offensiveDirection, position } = pieceData;
		const [myX, myY] = position;
		const [byX, byY] = resolveDirection(offensiveDirection);
		return byX === 1 && myX < targetX || byY === -1 && myX > targetX || byY === 1 && myY < targetY || byY === -1 && myY > targetY;
	}


}

export { Pawn };