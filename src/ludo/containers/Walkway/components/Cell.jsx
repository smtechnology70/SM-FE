import classnames from "classnames";
import React from "react";
import { generateCellID } from "../utils";
import styles from "./Cell.module.css";
import { getStyleObject } from "../../utils";
import { CELL_SIZE, STAR_BASE64 } from "../../../globalConstants";

export class Cell extends React.PureComponent {
  render() {
    const { color, column, cellType, row, walkwayPosition, isStar } =
      this.props;

    const children = React.Children.map(this.props.children, (child) => child);
    const mutipleCoinClassName =
      children && children.length > 1 ? styles.MultipleCoins : null;

    return (
      <div
        className={classnames(styles.Container, mutipleCoinClassName)}
        style={{
          ...getStyleObject(CELL_SIZE, CELL_SIZE, color),
          backgroundImage: isStar ? `url(${STAR_BASE64})` : undefined,
        }}
        data-id={generateCellID(walkwayPosition, row, column)}
        data-row={row}
        data-column={column}
        data-position={walkwayPosition}
        data-cell-type={cellType}
        onContextMenu={this.handleContextMenu}
        onMouseEnter={this.highlightNextCells}
      >
        {children}
      </div>
    );
  }

  handleContextMenu = (event) => {
    event.preventDefault();
    const target = event.target;
    this.props.onContextMenuOpened({
      cellID: target.getAttribute("data-id"),
      cellType: target.getAttribute("data-cell-type"),
      column: Number(target.getAttribute("data-column")),
      position: target.getAttribute("data-position"),
      row: Number(target.getAttribute("data-row")),
      x: event.clientX,
      y: event.clientY,
    });
  };

  highlightNextCells = (event) => {
    const target = event.target;
    const cellID = target.getAttribute("data-id");
    if (cellID) {
      this.props.onHighlightNextCells(cellID);
    }
  };
}
