import { evaluate } from 'mathjs';

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
  let header = '';
  
  // Excel style column labeling (A, B, C, ... Z, AA, AB, ... ZZ, AAA, etc.)
  let temp = index;
  while (temp >= 0) {
    // Convert to 0-25 for A-Z
    const remainder = temp % 26;
    header = String.fromCharCode(65 + remainder) + header;
    
    // Move to next position and subtract 1 for 0-indexing
    temp = Math.floor(temp / 26) - 1;
    
    // Break if we've processed the last digit
    if (temp < 0) break;
  }
  
  return header;
};

// Get cell coordinate in A1 notation
export const getCellCoord = (col: number, row: number): string => {
  const column = getColumnHeader(col);
  return `${column}${row + 1}`;
};

// Find all cell references (like A1, B2) in a formula
export const findCellReferences = (formula: string): string[] => {
  const cellRefs: string[] = [];
  if (formula.startsWith('=')) {
    const matches = formula.match(/[A-Z]+\d+/g);
    if (matches) {
      return matches;
    }
  }
  return cellRefs;
};

// Evaluate a formula with the given cell data
export const evaluateFormula = (
  formula: string, 
  coord: string, 
  cellData: CellMap
): string | number => {
  try {
    if (formula.startsWith('=')) {
      const expression = formula
        .substring(1)
        .replace(/[A-Z]+\d+/g, (match) => {
          const cellValue = cellData[match]?.computed !== undefined 
            ? cellData[match].computed 
            : cellData[match]?.value || '0';
            
          const numValue = !isNaN(Number(cellValue)) ? Number(cellValue) : 0;
          return numValue.toString();
        });
      
      return evaluate(expression);
    }
    return formula;
  } catch (error) {
    console.error('Error evaluating formula:', error, formula);
    return '#ERROR';
  }
};

// Constants for the Excel grid
export const GRID_CONSTANTS = {
  COLUMN_WIDTH: 100,
  ROW_HEIGHT: 35,
  HEADER_HEIGHT: 35,
  GRID_SIZE: 10_000
}; 