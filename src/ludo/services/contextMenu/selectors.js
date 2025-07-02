import { createSelector } from "reselect";

export const contextMenuStateSelector = (state) => state.contextMenu;

export const isContextMenuVisibleSelector = createSelector(
  [contextMenuStateSelector],
  (state) => state.visible
);

export const contextMenuPositionSelector = createSelector(
  [contextMenuStateSelector],
  (state) => state.position
);

export const menuContentsSelector = createSelector(
  [contextMenuStateSelector],
  (state) => state.menuContents
);
