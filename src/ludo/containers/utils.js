import { BASE_COLORS, CELL_DIMENSION } from "../globalConstants";

export const getStyleObject = (
  cellCountLengthwise,
  cellCountWidthwise,
  baseColor
) => ({
  backgroundColor: baseColor && getBaseHexColor(baseColor),
  height: `${cellCountWidthwise * CELL_DIMENSION}px`,
  width: `${cellCountLengthwise * CELL_DIMENSION}px`,
});

export const getBaseHexColor = (color) => BASE_COLORS[color];
