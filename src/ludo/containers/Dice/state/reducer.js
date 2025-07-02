import { ActionTypes } from "./actions";
import { Rolls } from "./interfaces";

const initialState = {
  isDieRollAllowed: true,
  isDieRollValid: false,
  roll: Rolls.ONE,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ROLL_DIE_COMPLETE: {
      return {
        ...state,
        isDieRollAllowed: false,
        isDieRollValid: true,
        roll: action.data.value,
      };
    }
    case ActionTypes.ENABLE_DIE: {
      return {
        ...state,
        isDieRollAllowed: true,
      };
    }
    case ActionTypes.DISABLE_DIE: {
      return {
        ...state,
        isDieRollAllowed: false,
      };
    }
    case ActionTypes.INVALIDATE_DIE_ROLL: {
      return {
        ...state,
        isDieRollValid: false,
      };
    }
    default:
      return state;
  }
};
