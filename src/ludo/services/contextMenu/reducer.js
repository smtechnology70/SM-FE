import { ActionTypes } from "./actions";

const initialState = {
  menuContents: [],
  position: {
    x: 0,
    y: 0,
  },
  visible: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SHOW_CONTEXT_MENU:
      return {
        ...state,
        menuContents: action.data.menuContents,
        position: {
          x: action.data.x,
          y: action.data.y,
        },
        visible: true,
      };
    case ActionTypes.HIDE_CONTEXT_MENU:
      return initialState;
    default:
      return state;
  }
};
