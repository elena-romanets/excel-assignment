import React from 'react';
import { HeaderCell, CornerCell } from './ExcelStyles';
import { getColumnHeader, GRID_CONSTANTS } from '../utils/excelUtils';

interface HeadersProps {
  scrollLeft: number;
  scrollTop: number;
}

export const ColumnHeaders: React.FC<HeadersProps> = ({ scrollLeft }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: GRID_CONSTANTS.COLUMN_WIDTH, 
      height: GRID_CONSTANTS.HEADER_HEIGHT, 
      display: 'flex',
      zIndex: 1,
      transform: `translateX(${-scrollLeft}px)`,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {Array.from({ length: Math.min(1000, GRID_CONSTANTS.GRID_SIZE) }, (_, i) => (
        <HeaderCell
          key={`col-${i}`}
          style={{
            width: GRID_CONSTANTS.COLUMN_WIDTH,
            height: GRID_CONSTANTS.HEADER_HEIGHT,
            flexShrink: 0,
            boxSizing: 'border-box'
          }}
        >
          {getColumnHeader(i)}
        </HeaderCell>
      ))}
    </div>
  );
};

export const RowHeaders: React.FC<HeadersProps> = ({ scrollTop }) => {
  return (
    <div style={{ 
      position: 'fixed', 
      left: 0, 
      top: GRID_CONSTANTS.HEADER_HEIGHT, 
      width: GRID_CONSTANTS.COLUMN_WIDTH,
      zIndex: 1,
      transform: `translateY(${-scrollTop}px)`,
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {Array.from({ length: Math.min(10000, GRID_CONSTANTS.GRID_SIZE) }, (_, i) => (
        <HeaderCell
          key={`row-${i}`}
          style={{
            width: GRID_CONSTANTS.COLUMN_WIDTH,
            height: GRID_CONSTANTS.ROW_HEIGHT,
            boxSizing: 'border-box'
          }}
        >
          {i + 1}
        </HeaderCell>
      ))}
    </div>
  );
};

export const GridCorner: React.FC = () => {
  return (
    <CornerCell style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: GRID_CONSTANTS.COLUMN_WIDTH, 
      height: GRID_CONSTANTS.HEADER_HEIGHT,
      zIndex: 2
    }} />
  );
}; 