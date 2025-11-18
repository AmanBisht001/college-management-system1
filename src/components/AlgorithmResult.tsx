import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AllocationResult } from "@/lib/memoryAlgorithms";
import { Award, CheckCircle2, XCircle } from "lucide-react";

interface AlgorithmResultProps {
  name: string;
  result: AllocationResult;
  blocks: number[];
  processes: number[];
  isBest: boolean;
}

export const AlgorithmResult = ({
  name,
  result,
  blocks,
  processes,
  isBest,
}: AlgorithmResultProps) => {
  const { allocation, remainingBlocks, allocatedCount, totalWastage, utilization } = result;
  const unallocatedCount = processes.length - allocatedCount;

  return (
    <Card
      className={`p-6 relative overflow-hidden transition-all ${
        isBest
          ? "ring-2 ring-success shadow-elegant"
          : "shadow-card hover:shadow-elegant"
      }`}
    >
      {isBest && (
        <div className="absolute top-0 right-0 bg-success text-success-foreground px-4 py-1.5 rounded-bl-lg flex items-center gap-1.5">
          <Award className="h-4 w-4" />
          <span className="text-sm font-semibold">Best</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/5 border-primary/20">
              {allocatedCount}/{processes.length} Allocated
            </Badge>
            <Badge variant="outline" className="bg-accent/5 border-accent/20">
              {utilization.toFixed(1)}% Utilized
            </Badge>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Allocated</p>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <p className="text-2xl font-bold">{allocatedCount}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Unallocated</p>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <p className="text-2xl font-bold">{unallocatedCount}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Utilization</p>
            <p className="text-2xl font-bold">{utilization.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Wastage</p>
            <p className="text-2xl font-bold">{totalWastage} KB</p>
          </div>
        </div>

        {/* Allocation Details */}
        <div>
          <p className="text-sm font-semibold mb-3">Allocation Details</p>
          <div className="space-y-2">
            {processes.map((process, idx) => {
              const blockIdx = allocation[idx];
              const isAllocated = blockIdx !== -1;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-md text-sm ${
                    isAllocated
                      ? "bg-success/10 text-success-foreground"
                      : "bg-destructive/10 text-destructive-foreground"
                  }`}
                >
                  <span className="font-medium">
                    Process P{idx + 1} ({process} KB)
                  </span>
                  <span className="text-xs">
                    {isAllocated ? (
                      <>
                        → Block {blockIdx + 1} ({blocks[blockIdx]} KB)
                      </>
                    ) : (
                      "Not Allocated"
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Remaining Memory */}
        <div>
          <p className="text-sm font-semibold mb-3">Remaining Memory</p>
          <div className="flex flex-wrap gap-2">
            {remainingBlocks.map((remaining, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-xs font-medium"
              >
                Block {idx + 1}: {remaining} KB
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
