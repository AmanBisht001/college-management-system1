import { useState } from "react";
import { motion } from "framer-motion";
import { MemoryInput } from "@/components/MemoryInput";
import { AlgorithmResult } from "@/components/AlgorithmResult";
import { MemoryVisualization } from "@/components/MemoryVisualization";
import { Layout } from "@/components/Layout";
import {
  firstFit,
  bestFit,
  worstFit,
  nextFit,
  AllocationResult,
} from "@/lib/memoryAlgorithms";

interface ComparisonResults {
  firstFit: AllocationResult | null;
  bestFit: AllocationResult | null;
  worstFit: AllocationResult | null;
  nextFit: AllocationResult | null;
  bestAlgorithm: string;
  blocks: number[];
  processes: number[];
}

const CustomComparison = () => {
  const [results, setResults] = useState<ComparisonResults | null>(null);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>([]);

  const handleRunComparison = (blocks: number[], processes: number[], algorithms: string[]) => {
    const firstFitResult = algorithms.includes("First Fit") ? firstFit(blocks, processes) : null;
    const bestFitResult = algorithms.includes("Best Fit") ? bestFit(blocks, processes) : null;
    const worstFitResult = algorithms.includes("Worst Fit") ? worstFit(blocks, processes) : null;
    const nextFitResult = algorithms.includes("Next Fit") ? nextFit(blocks, processes) : null;

    // Only compare the algorithms that were actually run
    const results = [
      { name: "First Fit", result: firstFitResult },
      { name: "Best Fit", result: bestFitResult },
      { name: "Worst Fit", result: worstFitResult },
      { name: "Next Fit", result: nextFitResult }
    ].filter(item => item.result !== null);

    let bestAlgorithm = "";
    if (results.length > 0) {
      bestAlgorithm = results.reduce((best, current) => {
        const bestScore = best.result!.allocatedCount + (best.result!.utilization / 100);
        const currentScore = current.result!.allocatedCount + (current.result!.utilization / 100);
        return currentScore > bestScore ? current : best;
      }).name;
    }

    setResults({
      firstFit: firstFitResult,
      bestFit: bestFitResult,
      worstFit: worstFitResult,
      nextFit: nextFitResult,
      bestAlgorithm,
      blocks,
      processes,
    });
    setSelectedAlgorithms(algorithms);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Custom Algorithm Selection
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Choose which algorithms to compare and customize your simulation
          </p>
        </motion.div>
        
        <div className="space-y-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <MemoryInput onRunComparison={handleRunComparison} />
          </motion.div>

          {/* Results Section */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Algorithm Comparison */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Algorithm Comparison</h3>
                <div className={`grid gap-4 sm:gap-6 ${
                  selectedAlgorithms.length === 1 
                    ? "grid-cols-1 max-w-md mx-auto" 
                    : selectedAlgorithms.length === 2 
                    ? "grid-cols-1 md:grid-cols-2" 
                    : selectedAlgorithms.length === 3
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                }`}>
                  {selectedAlgorithms.includes("First Fit") && results.firstFit && (
                    <AlgorithmResult
                      name="First Fit"
                      result={results.firstFit}
                      blocks={results.blocks}
                      processes={results.processes}
                      isBest={results.bestAlgorithm === "First Fit"}
                    />
                  )}
                  {selectedAlgorithms.includes("Best Fit") && results.bestFit && (
                    <AlgorithmResult
                      name="Best Fit"
                      result={results.bestFit}
                      blocks={results.blocks}
                      processes={results.processes}
                      isBest={results.bestAlgorithm === "Best Fit"}
                    />
                  )}
                  {selectedAlgorithms.includes("Worst Fit") && results.worstFit && (
                    <AlgorithmResult
                      name="Worst Fit"
                      result={results.worstFit}
                      blocks={results.blocks}
                      processes={results.processes}
                      isBest={results.bestAlgorithm === "Worst Fit"}
                    />
                  )}
                  {selectedAlgorithms.includes("Next Fit") && results.nextFit && (
                    <AlgorithmResult
                      name="Next Fit"
                      result={results.nextFit}
                      blocks={results.blocks}
                      processes={results.processes}
                      isBest={results.bestAlgorithm === "Next Fit"}
                    />
                  )}
                </div>
              </div>

              {/* Memory Visualizations */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Memory Layout</h3>
                <div className={`grid gap-4 sm:gap-6 ${
                  selectedAlgorithms.length === 1 
                    ? "grid-cols-1 max-w-md mx-auto" 
                    : selectedAlgorithms.length === 2 
                    ? "grid-cols-1 md:grid-cols-2" 
                    : selectedAlgorithms.length === 3
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
                }`}>
                  {selectedAlgorithms.includes("First Fit") && results.firstFit && (
                    <MemoryVisualization
                      blocks={results.blocks}
                      processes={results.processes}
                      allocation={results.firstFit.allocation}
                      title="First Fit"
                    />
                  )}
                  {selectedAlgorithms.includes("Best Fit") && results.bestFit && (
                    <MemoryVisualization
                      blocks={results.blocks}
                      processes={results.processes}
                      allocation={results.bestFit.allocation}
                      title="Best Fit"
                    />
                  )}
                  {selectedAlgorithms.includes("Worst Fit") && results.worstFit && (
                    <MemoryVisualization
                      blocks={results.blocks}
                      processes={results.processes}
                      allocation={results.worstFit.allocation}
                      title="Worst Fit"
                    />
                  )}
                  {selectedAlgorithms.includes("Next Fit") && results.nextFit && (
                    <MemoryVisualization
                      blocks={results.blocks}
                      processes={results.processes}
                      allocation={results.nextFit.allocation}
                      title="Next Fit"
                    />
                )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CustomComparison;
