import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layout } from "@/components/Layout";
import { fifoPageReplacement, lruPageReplacement, optimalPageReplacement, PageReplacementResult } from "@/lib/pageReplacement";

const PageReplacement = () => {
  const [framesCount, setFramesCount] = useState<number>(3);
  const [pageString, setPageString] = useState<string>("7,0,1,2,0,3,0,4,2,3,0,3,2");
  const [algorithm, setAlgorithm] = useState<string>("FIFO");
  const [result, setResult] = useState<PageReplacementResult | null>(null);

  const handleSimulate = () => {
    const pages = pageString.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    
    if (pages.length === 0) {
      alert("Please enter valid page numbers");
      return;
    }
    
    if (framesCount < 1) {
      alert("Number of frames must be at least 1");
      return;
    }

    let algorithmResult: PageReplacementResult;
    
    if (algorithm === "FIFO") {
      algorithmResult = fifoPageReplacement(pages, framesCount);
    } else if (algorithm === "LRU") {
      algorithmResult = lruPageReplacement(pages, framesCount);
    } else if (algorithm === "Optimal") {
      algorithmResult = optimalPageReplacement(pages, framesCount);
    } else {
      algorithmResult = fifoPageReplacement(pages, framesCount);
    }
    
    setResult(algorithmResult);
  };

  const handleReset = () => {
    setResult(null);
    setFramesCount(3);
    setPageString("7,0,1,2,0,3,0,4,2,3,0,3,2");
    setAlgorithm("FIFO");
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Page Replacement Simulator
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Visualize virtual memory page replacement using FIFO, LRU, and Optimal algorithms
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-primary/20 shadow-card">
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>Configure the page replacement simulation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="algorithm">Algorithm</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger id="algorithm">
                    <SelectValue placeholder="Select algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIFO">FIFO</SelectItem>
                    <SelectItem value="LRU">LRU</SelectItem>
                    <SelectItem value="Optimal">Optimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="frames">Number of Frames</Label>
                <Input
                  id="frames"
                  type="number"
                  min="1"
                  max="10"
                  value={framesCount}
                  onChange={(e) => setFramesCount(parseInt(e.target.value) || 1)}
                  placeholder="e.g., 3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Page Reference String (comma-separated)</Label>
                <Input
                  id="pages"
                  type="text"
                  value={pageString}
                  onChange={(e) => setPageString(e.target.value)}
                  placeholder="e.g., 7,0,1,2,0,3,0,4"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSimulate} className="flex-1">
                Run {algorithm} Simulation
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Page Faults</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive">
                    {result.pageFaults}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Page Hits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {result.pageHits}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20 bg-accent/5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Hit Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent-foreground">
                    {result.hitRate.toFixed(1)}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visualization */}
            <Card className="border-primary/20 shadow-card">
              <CardHeader>
                <CardTitle>{algorithm} Page Replacement Process</CardTitle>
                <CardDescription>Step-by-step visualization of {algorithm} page replacement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary/20">
                        <th className="p-3 text-left font-semibold">Step</th>
                        <th className="p-3 text-left font-semibold">Page</th>
                        <th className="p-3 text-left font-semibold">Frames State</th>
                        <th className="p-3 text-left font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.steps.map((step, index) => (
                        <tr 
                          key={index}
                          className={`border-b border-border/50 transition-colors ${
                            step.fault ? 'bg-destructive/5' : 'bg-primary/5'
                          }`}
                        >
                          <td className="p-3 font-mono">{step.step}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="font-mono text-base px-3 py-1">
                              {step.page}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              {step.frames.map((frame, idx) => (
                                <div
                                  key={idx}
                                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-semibold ${
                                    frame === step.page && step.fault
                                      ? 'border-destructive bg-destructive/10 text-destructive'
                                      : 'border-primary/30 bg-primary/5 text-primary'
                                  }`}
                                >
                                  {frame}
                                </div>
                              ))}
                              {/* Empty frame slots */}
                              {Array.from({ length: framesCount - step.frames.length }).map((_, idx) => (
                                <div
                                  key={`empty-${idx}`}
                                  className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30"
                                >
                                  -
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={step.fault ? "destructive" : "default"}
                              className="font-medium"
                            >
                              {step.fault ? "Page Fault" : "Page Hit"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default PageReplacement;
