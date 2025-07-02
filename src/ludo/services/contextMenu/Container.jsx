import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { ContextMenu as ContextMenuComponent } from "./components/ContextMenu";
import {
  contextMenuPositionSelector,
  isContextMenuVisibleSelector,
  menuContentsSelector,
} from "./selectors";

const mapStateToProps = createStructuredSelector({
  menuContents: menuContentsSelector,
  position: contextMenuPositionSelector,
  visible: isContextMenuVisibleSelector,
});

class ContextMenuBare extends React.PureComponent {
  render() {
    const { menuContents, position, visible } = this.props;
    return visible ? (
      <ContextMenuComponent menuContents={menuContents} position={position} />
    ) : null;
  }
}

export const ContextMenu = connect(mapStateToProps)(ContextMenuBare);
