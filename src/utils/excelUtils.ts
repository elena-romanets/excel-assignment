import { evaluate } from "mathjs";

export interface CellData {
  value: string;
  formula: string;
  computed?: number | string;
}

export interface CellPosition {
  columnIndex: number;
  rowIndex: number;
}

export type CellMap = Record<string, CellData>;

export const getColumnHeader = (index: number): string => {
  let header = "";

  let temp = index;
  while (temp >= 0) {
    const remainder = temp % 26;
    header = String.fromCharCode(65 + remainder) + header;

    temp = Math.floor(temp / 26) - 1;
    if (temp < 0) break;
  }

  return header;
};

export const getCellCoord = (col: number, row: number): string => {
  const column = getColumnHeader(col);
  return `${column}${row + 1}`;
};

export const findCellReferences = (formula: string): string[] => {
  const cellRefs: string[] = [];
  if (formula.startsWith("=")) {
    const matches = formula.match(/[A-Z]+\d+/g);
    if (matches) {
      return matches;
    }
  }
  return cellRefs;
};

export const evaluateFormula = (
  formula: string,
  cellData: CellMap
): string | number => {
  try {
    if (formula.startsWith("=")) {
      const expression = formula.substring(1).replace(/[A-Z]+\d+/g, (match) => {
        const cellValue =
          cellData[match]?.computed !== undefined
            ? cellData[match].computed
            : cellData[match]?.value || "0";

        const numValue = !isNaN(Number(cellValue)) ? Number(cellValue) : 0;
        return numValue.toString();
      });

      return evaluate(expression);
    }

    return formula;
  } catch (error) {
    console.error("Error evaluating formula:", error, formula);
    
    return "#ERROR";
  }
};

export const GRID_CONSTANTS = {
  COLUMN_WIDTH: 100,
  ROW_HEIGHT: 35,
  HEADER_HEIGHT: 35,
  GRID_SIZE: 10_000,
};
