import { createSelector } from "reselect";

export const diceStateSelector = (state) => state.dice;

export const currentDieRollSelector = createSelector(
  [diceStateSelector],
  (state) => state.roll
);

export const isDieRollAllowedSelector = createSelector(
  [diceStateSelector],
  (state) => state.isDieRollAllowed
);

export const isDieRollValidSelector = createSelector(
  [diceStateSelector],
  (state) => state.isDieRollValid
);
