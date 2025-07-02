export const ActionTypes = {
  SHOW_CONTEXT_MENU: "contextMenu/SHOW_CONTEXT_MENU",
  HIDE_CONTEXT_MENU: "contextMenu/HIDE_CONTEXT_MENU",
};

export const showContextMenu = (x, y, menuContents) => ({
  data: {
    menuContents,
    x,
    y,
  },
  type: ActionTypes.SHOW_CONTEXT_MENU,
});

export const hideContextMenu = () => ({
  type: ActionTypes.HIDE_CONTEXT_MENU,
});
