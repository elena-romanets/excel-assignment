import React, { useState, useEffect } from 'react';
import { StyledCell, StyledInput } from './ExcelStyles';
import { getCellCoord, CellData } from '../utils/excelUtils';
import { GRID_CONSTANTS } from '../utils/excelUtils';

interface CellProps {
  columnIndex: number;
  rowIndex: number; 
  style: React.CSSProperties;
  data: {
    cellData: Record<string, CellData>;
    updateCell: (coord: string, value: string) => void;
  };
}

const ExcelCell: React.FC<CellProps> = ({ columnIndex, rowIndex, style, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const coord = getCellCoord(columnIndex, rowIndex);
  const cellData = data.cellData[coord] || { value: '', formula: '', computed: '' };

  const displayValue = cellData.computed !== undefined && cellData.computed !== '' 
    ? cellData.computed 
    : cellData.value;

  const handleClick = () => {
    if (!isEditing) {
      setLocalValue(cellData.formula || cellData.value);
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      data.updateCell(coord, localValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      data.updateCell(coord, localValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setLocalValue(cellData.formula || cellData.value);
    }
  };

  // Reset local value when cell data changes from external updates
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(cellData.formula || cellData.value);
    }
  }, [cellData, isEditing]);

  // Debugging
  useEffect(() => {
    if (cellData.formula && cellData.formula.startsWith('=')) {
      console.debug(`Cell ${coord} formula: ${cellData.formula}, computed: ${cellData.computed}`);
    }
  }, [cellData, coord]);

  // Apply exact size to match header size
  const cellStyle = {
    ...style,
    width: GRID_CONSTANTS.COLUMN_WIDTH,
    height: GRID_CONSTANTS.ROW_HEIGHT,
    boxSizing: 'border-box' as const,
    padding: '4px',
    margin: 0,
    border: '1px solid #e0e0e0',
    textAlign: 'right' as const,
  };

  return (
    <StyledCell 
      style={cellStyle}
      onClick={handleClick}
      role="gridcell"
      tabIndex={0}
    >
      {isEditing ? (
        <StyledInput
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {displayValue}
        </div>
      )}
    </StyledCell>
  );
};

export default ExcelCell; 