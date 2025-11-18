import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface MemoryInputSimpleProps {
  onRunComparison: (blocks: number[], processes: number[]) => void;
}

export const MemoryInputSimple = ({ onRunComparison }: MemoryInputSimpleProps) => {
  const [blocks, setBlocks] = useState<number[]>([100, 500, 200, 300, 600]);
  const [processes, setProcesses] = useState<number[]>([212, 417, 112, 426]);
  const [newBlock, setNewBlock] = useState("");
  const [newProcess, setNewProcess] = useState("");

  const handleAddBlock = () => {
    const value = parseInt(newBlock);
    if (value > 0) {
      setBlocks([...blocks, value]);
      setNewBlock("");
    }
  };

  const handleAddProcess = () => {
    const value = parseInt(newProcess);
    if (value > 0) {
      setProcesses([...processes, value]);
      setNewProcess("");
    }
  };

  const handleRemoveBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleRemoveProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const handleRunComparison = () => {
    if (blocks.length > 0 && processes.length > 0) {
      onRunComparison(blocks, processes);
    }
  };

  return (
    <Card className="p-6 shadow-card">
      <div className="space-y-6">
        {/* Memory Blocks */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Memory Blocks (KB)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter block size"
              value={newBlock}
              onChange={(e) => setNewBlock(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddBlock()}
              className="flex-1"
            />
            <Button onClick={handleAddBlock} size="icon" variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {blocks.map((block, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-md text-sm font-medium"
              >
                {block} KB
                <button
                  onClick={() => handleRemoveBlock(index)}
                  className="hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Processes */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Processes (KB)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter process size"
              value={newProcess}
              onChange={(e) => setNewProcess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddProcess()}
              className="flex-1"
            />
            <Button onClick={handleAddProcess} size="icon" variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {processes.map((process, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-accent/10 text-accent px-3 py-1.5 rounded-md text-sm font-medium"
              >
                P{index + 1}: {process} KB
                <button
                  onClick={() => handleRemoveProcess(index)}
                  className="hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Run Button */}
        <Button
          onClick={handleRunComparison}
          className="w-full bg-gradient-primary text-white font-semibold shadow-elegant hover:opacity-90 transition-opacity"
          size="lg"
          disabled={blocks.length === 0 || processes.length === 0}
        >
          Compare All Algorithms
        </Button>
      </div>
    </Card>
  );
};
