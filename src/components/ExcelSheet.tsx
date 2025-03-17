import { useState, useCallback, useEffect, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { CellMap, GRID_CONSTANTS } from '../utils/excelUtils';
import { FormulaService } from '../services/FormulaService';
import ExcelCell from './ExcelCell';
import { ColumnHeaders, RowHeaders, GridCorner } from './ExcelHeaders';

const ExcelSheet: React.FC = () => {
  const [cellData, setCellData] = useState<CellMap>({});
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  
  const formulaService = useMemo(() => new FormulaService(), []);
  
  useEffect(() => {
    formulaService.buildDependencyGraph(cellData);
  }, []);
  
  const updateCell = useCallback((coord: string, value: string) => {
    console.log(`Updating cell ${coord} to value: ${value}`);
    
    if (cellData[coord]?.value === value && 
        cellData[coord]?.formula === (value.startsWith('=') ? value : '')) {
      return;
    }
    
    formulaService.updateDependencies(coord, value);
    
    setCellData((prev) => {
      const newData = { ...prev };
      const isFormula = value.startsWith('=');
      
      newData[coord] = {
        value: value,
        formula: isFormula ? value : '',
        computed: isFormula ? '' : value
      };
      
      if (isFormula) {
        newData[coord].computed = formulaService.recalculateAllFormulas(newData)[coord].computed;
        
        return formulaService.recalculateDependents(coord, newData);
      }
      
      return formulaService.recalculateDependents(coord, newData);
    });
  }, [cellData, formulaService]);
  
  useEffect(() => {
    const formulaCells = Object.entries(cellData)
      .filter(([_, cell]) => cell.formula && cell.formula.startsWith('='))
      .map(([coord]) => coord);
      
    if (formulaCells.length > 0) {
      const timer = setTimeout(() => {
        setCellData(prev => formulaService.recalculateAllFormulas(prev));
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleScroll = ({ scrollLeft, scrollTop }: { scrollLeft: number; scrollTop: number }) => {
    setScrollLeft(scrollLeft);
    setScrollTop(scrollTop);
  };
  
  return (
    <div style={{ height: '100vh', width: '100%', overflow: 'hidden', position: 'relative' }}>
      <GridCorner />
      <ColumnHeaders scrollLeft={scrollLeft} scrollTop={scrollTop} />
      <RowHeaders scrollLeft={scrollLeft} scrollTop={scrollTop} />
      <div style={{ 
        paddingTop: GRID_CONSTANTS.HEADER_HEIGHT, 
        paddingLeft: GRID_CONSTANTS.COLUMN_WIDTH, 
        height: '100%', 
        width: '100%'
      }}>
        <Grid
          columnCount={GRID_CONSTANTS.GRID_SIZE}
          columnWidth={GRID_CONSTANTS.COLUMN_WIDTH}
          height={window.innerHeight - 100}
          rowCount={GRID_CONSTANTS.GRID_SIZE}
          rowHeight={GRID_CONSTANTS.ROW_HEIGHT}
          width={window.innerWidth - 50}
          itemData={{ cellData, updateCell }}
          onScroll={handleScroll}
          className="excel-grid"
          style={{
            overflowX: 'auto',
            overflowY: 'auto',
          }}
        >
          {ExcelCell}
        </Grid>
      </div>
    </div>
  );
};

export default ExcelSheet;