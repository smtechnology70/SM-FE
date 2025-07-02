import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  basesSelector,
  cellsSelector,
  coinsSelector,
  currentTurnSelector,
  linksSelector,
} from "../Ludo/state/selectors";
import {
  hideContextMenu,
  showContextMenu,
} from "../../services/contextMenu/service";
import { Cell } from "./components/Cell";
import { generateCellID } from "./utils";
import styles from "./Container.module.css";
import { Coin } from "../Base/components/Coin";
import { isDieRollValidSelector } from "../Dice/state/selectors";
import { moveCoin } from "../Ludo/state/actions";
import { getStyleObject } from "../utils";
import {
  COIN_SIZE,
  WALKWAY_LENGTH,
  WALKWAY_WIDTH,
} from "../../globalConstants";
import { flatArray } from "../../common/utils";

const cells = {};
const cellLinks = {};

const mapStateToProps = createStructuredSelector({
  bases: basesSelector,
  cells: cellsSelector,
  coins: coinsSelector,
  currentTurn: currentTurnSelector,
  isDieRollValid: isDieRollValidSelector,
  links: linksSelector,
});

const mapDispatchToProps = {
  moveCoin,
};

class WalkwayBare extends React.PureComponent {
  render() {
    const isHorizontal = this.isHorizontalWalkway();

    return (
      <div
        className={styles.Container}
        style={
          isHorizontal
            ? getStyleObject(WALKWAY_LENGTH, WALKWAY_WIDTH)
            : getStyleObject(WALKWAY_WIDTH, WALKWAY_LENGTH)
        }
      >
        {this.renderCells()}
      </div>
    );
  }

  renderCells = () => {
    const {
      walkway: { position, baseID },
      cells: cellConfigurations,
      bases,
      coins,
    } = this.props;

    const cellComponents = [[]];

    const cellConfigurationsForWalkway = Object.values(
      cellConfigurations[position]
    );
    const base = bases[baseID];

    cellConfigurationsForWalkway.forEach((cellConfiguration, index) => {
      const { row, column, position } = cellConfiguration;
      const cellID = generateCellID(position, row, column);
      const cellType = cellConfigurations[position][cellID].cellType;
      cellComponents[cellConfiguration.row] =
        cellComponents[cellConfiguration.row] || [];
      cellComponents[cellConfiguration.row][cellConfiguration.column] = (
        <Cell
          key={index}
          column={column}
          row={row}
          walkwayPosition={position}
          color={
            ["HOMEPATH", "SPAWN"].includes(cellType) ? base.color : undefined
          }
          isStar={cellType === "STAR"}
          cellType={cellType}
          onContextMenuOpened={this.onContextMenuOpened}
          onHighlightNextCells={this.onHighlightNextCells}
        >
          {cellConfiguration.coinIDs.map((coinID, index) => (
            <Coin
              baseColor={coins[coinID].color}
              coinSize={
                cellConfiguration.coinIDs.length > 1 ? COIN_SIZE / 2 : COIN_SIZE
              }
              onCoinClicked={() => this.onCoinClicked(coinID, position, cellID)}
              key={index}
            />
          ))}
        </Cell>
      );
    });

    return flatArray(cellComponents);
  };

  isHorizontalWalkway = () =>
    ["EAST", "WEST"].includes(this.props.walkway.position);

  onContextMenuOpened = (options) => {
    const {
      walkway: { baseID },
    } = this.props;
    const { cellID, cellType, column, position, row, x, y } = options;
    const cellInfo = {
      baseID,
      cellID,
      cellType,
      coinIDs: [],
      column,
      position,
      row,
    };
    showContextMenu(x, y, [
      {
        action: () => this.markCells({ ...cellInfo, cellType: "NORMAL" }),
        label: "NORMAL",
      },
      {
        action: () => this.markCells({ ...cellInfo, cellType: "SPAWN" }),
        label: "SPAWN",
      },
      {
        action: () => this.markCells({ ...cellInfo, cellType: "STAR" }),
        label: "STAR",
      },
      {
        action: () => this.markCells({ ...cellInfo, cellType: "HOMEPATH" }),
        label: "HOMEPATH",
      },
      {
        action: () => this.linkCells(cellInfo),
        label: "Link",
      },
    ]);
  };

  onHighlightNextCells = (cellID) => {
    const { links } = this.props;
    const linkedCellIDs = links[cellID].map((cell) => cell.cellID);
    console.log(`${cellID} -> ${linkedCellIDs}`);
  };

  markCells = (cellInfo) => {
    cells[cellInfo.position] = cells[cellInfo.position] || {};
    cells[cellInfo.position][cellInfo.cellID] = cellInfo;
    hideContextMenu();
    console.log(JSON.stringify(cells));
  };

  linkCells = (cellInfo) => {
    hideContextMenu();
    const onClick = (event) => {
      const element = event.target;
      const cellID = element.getAttribute("data-id");
      const shouldLink = window.confirm(
        `Link ${cellInfo.cellID} to ${cellID} ?`
      );

      if (shouldLink) {
        cellLinks[cellInfo.cellID] = cellLinks[cellInfo.cellID] || new Set();
        cellLinks[cellInfo.cellID].add(cellID);
      }
      document.removeEventListener("click", onClick);
      window.cellLinks = cellLinks;
    };
    document.addEventListener("click", onClick);
  };

  onCoinClicked = (coinID, position, cellID) => {
    const { coins, currentTurn } = this.props;
    const coin = coins[coinID];
    if (this.props.isDieRollValid && coin.baseID === currentTurn) {
      this.props.moveCoin(coinID, position, cellID);
    }
  };
}

export const Walkway = connect(
  mapStateToProps,
  mapDispatchToProps
)(WalkwayBare);
