import { Card } from "@/components/ui/card";

interface MemoryVisualizationProps {
  blocks: number[];
  processes: number[];
  allocation: number[];
  title: string;
}

export const MemoryVisualization = ({
  blocks,
  processes,
  allocation,
  title,
}: MemoryVisualizationProps) => {
  const maxBlock = Math.max(...blocks);

  // Calculate which processes are allocated to each block
  const blockAllocations = blocks.map((_, blockIdx) => {
    return processes
      .map((process, processIdx) => 
        allocation[processIdx] === blockIdx ? { processIdx, size: process } : null
      )
      .filter(Boolean) as { processIdx: number; size: number }[];
  });

  return (
    <Card className="p-6 shadow-card">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {blocks.map((blockSize, blockIdx) => {
          const allocated = blockAllocations[blockIdx];
          const usedSpace = allocated.reduce((sum, a) => sum + a.size, 0);
          const freeSpace = blockSize - usedSpace;
          const usedPercentage = (usedSpace / blockSize) * 100;

          return (
            <div key={blockIdx} className="space-y-1">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="font-medium">Block {blockIdx + 1} ({blockSize} KB)</span>
                <span>{usedPercentage.toFixed(0)}% used</span>
              </div>
              <div className="relative h-10 bg-secondary rounded-lg overflow-hidden">
                {allocated.map((alloc, idx) => {
                  const percentage = (alloc.size / blockSize) * 100;
                  const previousPercentage = allocated
                    .slice(0, idx)
                    .reduce((sum, a) => sum + (a.size / blockSize) * 100, 0);

                  return (
                    <div
                      key={idx}
                      className="absolute top-0 bottom-0 bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        left: `${previousPercentage}%`,
                        width: `${percentage}%`,
                      }}
                    >
                      P{alloc.processIdx + 1}
                    </div>
                  );
                })}
                {freeSpace > 0 && (
                  <div
                    className="absolute top-0 bottom-0 flex items-center justify-center text-xs text-muted-foreground"
                    style={{
                      left: `${usedPercentage}%`,
                      width: `${100 - usedPercentage}%`,
                    }}
                  >
                    {freeSpace > blockSize * 0.15 && `${freeSpace} KB free`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
