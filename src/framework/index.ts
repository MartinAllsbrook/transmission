// Re-export main classes
export { GameInstance } from './GameInstance.ts';
export { GameObject } from './GameObject.ts';
export { GameRoot } from './GameRoot.ts';
export { Transform } from './Transform.ts';
export { Camera } from './Camera.ts';

// Re-export colliders
export { CircleCollider } from './colliders/CircleCollider.ts';
export { CollisionManager } from './colliders/CollisionManager.ts';
export { RectCollider } from './colliders/RectCollider.ts';
export { SATCollider } from './colliders/SATCollider.ts';

// Re-export inputs
export { BooleanInput } from './inputs/BooleanInput.ts';
export { Input } from './inputs/Input.ts';
export { InputManager } from './inputs/InputManager.ts';
export { ValueInput } from './inputs/ValueInput.ts';
export { VectorInput } from './inputs/VectorInput.ts';

// Re-export math
export { ExtraMath } from './math/ExtraMath.ts';
export { Vector2D } from './math/Vector2D.ts';

// Re-export splines
export { BezierSpline } from './math/splines/BezierSpline.ts';
export { CatmullRomSpline } from './math/splines/CatmullRomSpline.ts';
export { CatmullRomSplineOld } from './math/splines/CatmullRomSplineOld.ts';
export { SplinePoint } from './math/splines/SplinePoint.ts';

// Re-export rendering
export { LayerManager } from './rendering/LayerManager.ts';