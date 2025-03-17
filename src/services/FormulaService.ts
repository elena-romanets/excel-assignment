import { CellMap, evaluateFormula, findCellReferences } from '../utils/excelUtils';

export class FormulaService {
  private dependencyGraph: Record<string, string[]> = {};

  // Build initial dependency graph from cell data
  public buildDependencyGraph(cellData: CellMap): void {
    const newDeps: Record<string, string[]> = {};
    
    // Scan all cells with formulas and build dependency graph
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

  // Update dependencies for a specific cell
  public updateDependencies(coord: string, formula: string): void {
    const refs = findCellReferences(formula);
    
    // Remove this cell from old dependencies
    Object.keys(this.dependencyGraph).forEach(key => {
      if (this.dependencyGraph[key]?.includes(coord)) {
        this.dependencyGraph[key] = this.dependencyGraph[key].filter(dep => dep !== coord);
      }
    });
    
    // Add new dependencies
    refs.forEach(ref => {
      if (!this.dependencyGraph[ref]) {
        this.dependencyGraph[ref] = [];
      }
      if (!this.dependencyGraph[ref].includes(coord)) {
        this.dependencyGraph[ref] = [...this.dependencyGraph[ref], coord];
      }
    });
  }

  // Get cells dependent on a specific cell
  public getDependents(coord: string): string[] {
    return this.dependencyGraph[coord] || [];
  }

  // Recalculate a cell and its dependents
  public recalculateDependents(
    coord: string,
    cellData: CellMap,
    visited = new Set<string>()
  ): CellMap {
    if (visited.has(coord)) return cellData; // Prevent circular dependencies
    visited.add(coord);
    
    const newData = { ...cellData };
    
    // Get cells that depend on this cell
    const dependentCells = this.getDependents(coord);
    
    dependentCells.forEach(depCoord => {
      const depCell = newData[depCoord];
      if (depCell && depCell.formula) {
        newData[depCoord] = {
          ...depCell,
          computed: evaluateFormula(depCell.formula, depCoord, newData)
        };
        // Recursively update cells that depend on this one
        this.recalculateDependents(depCoord, newData, visited);
      }
    });
    
    return newData;
  }

  // Recalculate all formulas in topological order
  public recalculateAllFormulas(cellData: CellMap): CellMap {
    const newData = { ...cellData };
    
    // Build a topological sort of the dependency graph
    const visited = new Set<string>();
    const tempVisited = new Set<string>();
    const stack: string[] = [];
    
    const visit = (coord: string) => {
      if (tempVisited.has(coord)) return; // Circular dependency
      if (visited.has(coord)) return;
      
      tempVisited.add(coord);
      
      // Visit all dependencies first
      const deps = findCellReferences(newData[coord]?.formula || '');
      deps.forEach(dep => visit(dep));
      
      tempVisited.delete(coord);
      visited.add(coord);
      stack.push(coord);
    };
    
    // Find all formula cells
    Object.entries(newData).forEach(([coord, cell]) => {
      if (cell.formula && cell.formula.startsWith('=')) {
        visit(coord);
      }
    });
    
    // Process in topological order (reversed)
    while (stack.length > 0) {
      const coord = stack.pop();
      if (coord && newData[coord]?.formula) {
        newData[coord] = {
          ...newData[coord],
          computed: evaluateFormula(newData[coord].formula, coord, newData)
        };
      }
    }
    
    return newData;
  }
} 