// TypeScript types and interfaces removed for JS conversion
// If you need runtime validation, consider using PropTypes or a validation library

// import { BaseColors, WalkwayPosition } from 'state/interfaces';

const BaseID = {
  BASE_1: "BASE_1",
  BASE_2: "BASE_2",
  BASE_3: "BASE_3",
  BASE_4: "BASE_4",
};

const BoardEntities = {
  BASE: "BASE",
  WALKWAY: "WALKWAY",
  HOME: "HOME",
};

const CellType = {
  SPAWN: "SPAWN",
  STAR: "STAR",
  HOMEPATH: "HOMEPATH",
  NORMAL: "NORMAL",
};

// Export enums as objects for JS usage
export { BaseID, BoardEntities, CellType };
