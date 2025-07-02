import React from "react";
import styles from "./PlayerAvatar.module.css";
import { getBaseHexColor } from "../../utils";

export class PlayerAvatar extends React.PureComponent {
  render() {
    const { baseColor } = this.props;
    const color = getBaseHexColor(baseColor);
    return (
      <div className={styles.Container}>
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <g>
            <title>Layer 1</title>
            <ellipse
              ry="50"
              rx="50"
              id="svg_1"
              cy="50"
              cx="50"
              strokeWidth="0"
              stroke={color}
              fill={color}
            />
            <ellipse
              id="svg_2"
              cy="56.25"
              cx="59.25"
              strokeWidth="0"
              stroke={color}
              fill={color}
            />
            <ellipse
              ry="25"
              rx="25"
              id="svg_4"
              cy="37.796875"
              cx="51.75"
              strokeWidth="0"
              stroke="#FFFFFF"
              fill="#FFFFFF"
            />
            <ellipse
              ry="12.5"
              rx="27.5"
              id="svg_10"
              cy="80"
              cx="52"
              fillOpacity="null"
              strokeOpacity="null"
              strokeWidth="0"
              stroke="#FFFFFF"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </div>
    );
  }
}
