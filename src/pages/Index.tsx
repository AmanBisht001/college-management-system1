import { useState } from "react";
import { motion } from "framer-motion";
import { MemoryInputSimple } from "@/components/MemoryInputSimple";
import { AlgorithmResult } from "@/components/AlgorithmResult";
import { MemoryVisualization } from "@/components/MemoryVisualization";
import { Layout } from "@/components/Layout";
import {
  firstFit,
  bestFit,
  worstFit,
  nextFit,
  compareResults,
  AllocationResult,
} from "@/lib/memoryAlgorithms";

interface ComparisonResults {
  firstFit: AllocationResult;
  bestFit: AllocationResult;
  worstFit: AllocationResult;
  nextFit: AllocationResult;
  bestAlgorithm: string;
  blocks: number[];
  processes: number[];
}

const Index = () => {
  const [results, setResults] = useState<ComparisonResults | null>(null);

  const handleRunComparison = (blocks: number[], processes: number[]) => {
    const firstFitResult = firstFit(blocks, processes);
    const bestFitResult = bestFit(blocks, processes);
    const worstFitResult = worstFit(blocks, processes);
    const nextFitResult = nextFit(blocks, processes);

    const bestAlgorithm = compareResults(
      firstFitResult,
      bestFitResult,
      worstFitResult,
      nextFitResult
    );

    setResults({
      firstFit: firstFitResult,
      bestFit: bestFitResult,
      worstFit: worstFitResult,
      nextFit: nextFitResult,
      bestAlgorithm,
      blocks,
      processes,
    });
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
            Compare All Algorithms
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Compare First Fit, Best Fit, Worst Fit, and Next Fit algorithms side by side
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <MemoryInputSimple onRunComparison={handleRunComparison} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <AlgorithmResult
                  name="First Fit"
                  result={results.firstFit}
                  blocks={results.blocks}
                  processes={results.processes}
                  isBest={results.bestAlgorithm === "First Fit"}
                />
                <AlgorithmResult
                  name="Best Fit"
                  result={results.bestFit}
                  blocks={results.blocks}
                  processes={results.processes}
                  isBest={results.bestAlgorithm === "Best Fit"}
                />
                <AlgorithmResult
                  name="Worst Fit"
                  result={results.worstFit}
                  blocks={results.blocks}
                  processes={results.processes}
                  isBest={results.bestAlgorithm === "Worst Fit"}
                />
                <AlgorithmResult
                  name="Next Fit"
                  result={results.nextFit}
                  blocks={results.blocks}
                  processes={results.processes}
                  isBest={results.bestAlgorithm === "Next Fit"}
                />
              </div>
            </div>

            {/* Memory Visualizations */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Memory Layout</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <MemoryVisualization
                  blocks={results.blocks}
                  processes={results.processes}
                  allocation={results.firstFit.allocation}
                  title="First Fit"
                />
                <MemoryVisualization
                  blocks={results.blocks}
                  processes={results.processes}
                  allocation={results.bestFit.allocation}
                  title="Best Fit"
                />
                <MemoryVisualization
                  blocks={results.blocks}
                  processes={results.processes}
                  allocation={results.worstFit.allocation}
                  title="Worst Fit"
                />
                <MemoryVisualization
                  blocks={results.blocks}
                  processes={results.processes}
                  allocation={results.nextFit.allocation}
                  title="Next Fit"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
