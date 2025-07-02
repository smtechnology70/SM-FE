import { Rolls } from "./interfaces";

const ActionTypes = {
  ROLL_DIE: "die/ROLL_DIE",
  ROLL_DIE_COMPLETE: "die/ROLL_DIE_COMPLETE",
  ENABLE_DIE: "die/ENABLE_DIE",
  DISABLE_DIE: "die/DISABLE_DIE",
  INVALIDATE_DIE_ROLL: "die/INVALIDATE_DIE_ROLL",
};

export { ActionTypes };

export const rollDie = () => ({
  type: ActionTypes.ROLL_DIE,
});

export const rollDieComplete = (value) => ({
  data: { value },
  type: ActionTypes.ROLL_DIE_COMPLETE,
});

export const enableDie = () => ({
  type: ActionTypes.ENABLE_DIE,
});

export const disableDie = () => ({
  type: ActionTypes.DISABLE_DIE,
});

export const invalidateDieRoll = () => ({
  type: ActionTypes.INVALIDATE_DIE_ROLL,
});
