import { dispatch } from "../../state/store";
import {
  hideContextMenu as hideContextMenuAction,
  showContextMenu as showContextMenuAction,
} from "./actions";

export const showContextMenu = (x, y, menuContents) =>
  dispatch(showContextMenuAction(x, y, menuContents));
export const hideContextMenu = () => dispatch(hideContextMenuAction());
