import React from "react";

import { getBaseHexColor, getStyleObject } from "../utils";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { basesSelector } from "../Ludo/state/selectors";
import { CELL_DIMENSION, HOME_SIZE } from "../../globalConstants";

import styles from "./Container.module.css";

const mapStateToProps = createStructuredSelector({
  bases: basesSelector,
});

class HomeBare extends React.PureComponent {
  render() {
    const { baseIDs, bases } = this.props;
    return (
      <div
        className={styles.Container}
        style={getStyleObject(HOME_SIZE, HOME_SIZE)}
      >
        {baseIDs &&
          baseIDs.map((baseID, index) => {
            const base = bases[baseID];
            return (
              <div
                key={index}
                className={styles.HomeContainer}
                style={this.getCSS(HOME_SIZE, base.color, index)}
              />
            );
          })}
      </div>
    );
  }

  getCSS = (cellSize, baseColor, index) => {
    const size = cellSize * CELL_DIMENSION;
    const colorHex = getBaseHexColor(baseColor);

    const cssProperties = {
      borderColor: `${colorHex} transparent transparent transparent`,
      borderWidth: `${size / 2}px ${size / 2}px 0 ${size / 2}px`,
    };

    switch (index) {
      case 0:
        return cssProperties;
      case 1:
        return {
          ...cssProperties,
          left: `${size / 4}px`,
          top: `${size / 4}px`,
          transform: "rotate(90deg)",
        };
      case 2:
        return {
          ...cssProperties,
          top: `${size / 2}px`,
          transform: "rotate(180deg)",
        };
      case 3:
        return {
          ...cssProperties,
          right: `${size / 4}px`,
          top: `${size / 4}px`,
          transform: "rotate(-90deg)",
        };
      default:
        return {};
    }
  };
}

export const Home = connect(mapStateToProps)(HomeBare);
