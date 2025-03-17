import { CellMap, evaluateFormula, findCellReferences } from '../utils/excelUtils';

export class FormulaService {
  private dependencyGraph: Record<string, string[]> = {};

  public buildDependencyGraph(cellData: CellMap): void {
    const newDeps: Record<string, string[]> = {};
    
    Object.entries(cellData).forEach(([coord, cell]) => {
      if (cell.formula && cell.formula.startsWith('=')) {
        const refs = findCellReferences(cell.formula);
        refs.forEach(ref => {
          if (!newDeps[ref]) {
            newDeps[ref] = [];
          }
          if (!newDeps[ref].includes(coord)) {
            newDeps[ref] = [...newDeps[ref], coord];
          }
        });
      }
    });
    
    this.dependencyGraph = newDeps;
  }

  public updateDependencies(coord: string, formula: string): void {
    const refs = findCellReferences(formula);
    
    Object.keys(this.dependencyGraph).forEach(key => {
      if (this.dependencyGraph[key]?.includes(coord)) {
        this.dependencyGraph[key] = this.dependencyGraph[key].filter(dep => dep !== coord);
      }
    });
    
    refs.forEach(ref => {
      if (!this.dependencyGraph[ref]) {
        this.dependencyGraph[ref] = [];
      }
      if (!this.dependencyGraph[ref].includes(coord)) {
        this.dependencyGraph[ref] = [...this.dependencyGraph[ref], coord];
      }
    });
  }

  public getDependents(coord: string): string[] {
    return this.dependencyGraph[coord] || [];
  }

  public recalculateDependents(
    coord: string,
    cellData: CellMap,
    visited = new Set<string>()
  ): CellMap {
    if (visited.has(coord)) return cellData;
    visited.add(coord);
    
    const newData = { ...cellData };
    
    const dependentCells = this.getDependents(coord);
    
    dependentCells.forEach(depCoord => {
      const depCell = newData[depCoord];
      if (depCell && depCell.formula) {
        newData[depCoord] = {
          ...depCell,
          computed: evaluateFormula(depCell.formula, newData)
        };
        this.recalculateDependents(depCoord, newData, visited);
      }
    });
    
    return newData;
  }

  public recalculateAllFormulas(cellData: CellMap): CellMap {
    const newData = { ...cellData };
    
    const visited = new Set<string>();
    const tempVisited = new Set<string>();
    const stack: string[] = [];
    
    const visit = (coord: string) => {
      if (tempVisited.has(coord)) return;
      if (visited.has(coord)) return;
      
      tempVisited.add(coord);
      
      const deps = findCellReferences(newData[coord]?.formula || '');
      deps.forEach(dep => visit(dep));
      
      tempVisited.delete(coord);
      visited.add(coord);
      stack.push(coord);
    };
    
    Object.entries(newData).forEach(([coord, cell]) => {
      if (cell.formula && cell.formula.startsWith('=')) {
        visit(coord);
      }
    });
    
    while (stack.length > 0) {
      const coord = stack.pop();
      if (coord && newData[coord]?.formula) {
        newData[coord] = {
          ...newData[coord],
          computed: evaluateFormula(newData[coord].formula, newData)
        };
      }
    }
    
    return newData;
  }
} 