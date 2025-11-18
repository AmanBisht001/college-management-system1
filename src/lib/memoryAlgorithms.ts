export interface AllocationResult {
  allocation: number[];
  remainingBlocks: number[];
  allocatedCount: number;
  totalWastage: number;
  utilization: number;
}

// First Fit: Allocate the first memory block large enough to hold the process
export function firstFit(blocks: number[], processes: number[]): AllocationResult {
  const allocation = Array(processes.length).fill(-1);
  const memBlocks = [...blocks];
  
  for (let i = 0; i < processes.length; i++) {
    for (let j = 0; j < memBlocks.length; j++) {
      if (memBlocks[j] >= processes[i]) {
        allocation[i] = j;
        memBlocks[j] -= processes[i];
        break;
      }
    }
  }
  
  return calculateMetrics(allocation, memBlocks, blocks, processes);
}

// Best Fit: Allocate the smallest memory block large enough for the process
export function bestFit(blocks: number[], processes: number[]): AllocationResult {
  const allocation = Array(processes.length).fill(-1);
  const memBlocks = [...blocks];
  
  for (let i = 0; i < processes.length; i++) {
    let bestIdx = -1;
    for (let j = 0; j < memBlocks.length; j++) {
      if (memBlocks[j] >= processes[i]) {
        if (bestIdx === -1 || memBlocks[j] < memBlocks[bestIdx]) {
          bestIdx = j;
        }
      }
    }
    if (bestIdx !== -1) {
      allocation[i] = bestIdx;
      memBlocks[bestIdx] -= processes[i];
    }
  }
  
  return calculateMetrics(allocation, memBlocks, blocks, processes);
}

// Worst Fit: Allocate the largest memory block large enough for the process
export function worstFit(blocks: number[], processes: number[]): AllocationResult {
  const allocation = Array(processes.length).fill(-1);
  const memBlocks = [...blocks];
  
  for (let i = 0; i < processes.length; i++) {
    let worstIdx = -1;
    for (let j = 0; j < memBlocks.length; j++) {
      if (memBlocks[j] >= processes[i]) {
        if (worstIdx === -1 || memBlocks[j] > memBlocks[worstIdx]) {
          worstIdx = j;
        }
      }
    }
    if (worstIdx !== -1) {
      allocation[i] = worstIdx;
      memBlocks[worstIdx] -= processes[i];
    }
  }
  
  return calculateMetrics(allocation, memBlocks, blocks, processes);
}

// Next Fit: Allocate from the last allocated position, wrapping around
export function nextFit(blocks: number[], processes: number[]): AllocationResult {
  const allocation = Array(processes.length).fill(-1);
  const memBlocks = [...blocks];
  let j = 0; // Start position in memory
  const n = memBlocks.length;
  
  for (let i = 0; i < processes.length; i++) {
    let count = 0;
    while (count < n) {
      if (memBlocks[j] >= processes[i]) {
        allocation[i] = j;
        memBlocks[j] -= processes[i];
        break;
      }
      j = (j + 1) % n;
      count++;
    }
  }
  
  return calculateMetrics(allocation, memBlocks, blocks, processes);
}

function calculateMetrics(
  allocation: number[],
  remainingBlocks: number[],
  originalBlocks: number[],
  processes: number[]
): AllocationResult {
  const allocatedCount = allocation.filter(x => x !== -1).length;
  const totalWastage = remainingBlocks.reduce((sum, block) => sum + block, 0);
  const totalMemory = originalBlocks.reduce((sum, block) => sum + block, 0);
  const utilization = ((totalMemory - totalWastage) / totalMemory) * 100;
  
  return {
    allocation,
    remainingBlocks,
    allocatedCount,
    totalWastage,
    utilization
  };
}

export function compareResults(
  firstFitResult: AllocationResult,
  bestFitResult: AllocationResult,
  worstFitResult: AllocationResult,
  nextFitResult: AllocationResult
): string {
  const scores = {
    "First Fit": firstFitResult.allocatedCount + (firstFitResult.utilization / 100),
    "Best Fit": bestFitResult.allocatedCount + (bestFitResult.utilization / 100),
    "Worst Fit": worstFitResult.allocatedCount + (worstFitResult.utilization / 100),
    "Next Fit": nextFitResult.allocatedCount + (nextFitResult.utilization / 100)
  };
  
  return Object.keys(scores).reduce((a, b) => 
    scores[a] >= scores[b] ? a : b
  );
}
