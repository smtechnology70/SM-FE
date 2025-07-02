import { createSelector } from "reselect";

export const ludoStateSelector = (state) => state.ludo;

export const basesSelector = createSelector(
  [ludoStateSelector],
  (state) => state.bases
);

export const relationshipsSelector = createSelector(
  [ludoStateSelector],
  (state) => state.relationships
);

export const walkwaysSelector = createSelector(
  [ludoStateSelector],
  (state) => state.walkways
);

export const cellsSelector = createSelector(
  [ludoStateSelector],
  (state) => state.cells
);

export const linksSelector = createSelector(
  [ludoStateSelector],
  (state) => state.links
);

export const coinsSelector = createSelector(
  [ludoStateSelector],
  (state) => state.coins
);

export const currentTurnSelector = createSelector(
  [ludoStateSelector],
  (state) => state.currentTurn
);
