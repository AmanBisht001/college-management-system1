import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Layout } from "@/components/Layout";
import { Trash2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PageTableEntry {
  page: number;
  frame: number;
}

interface Process {
  name: string;
  size: number;
  color: string;
  pageTable: PageTableEntry[];
}

const PROCESS_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-yellow-500",
  "bg-red-500",
];

const Paging = () => {
  const { toast } = useToast();
  const [totalMemory, setTotalMemory] = useState(1000);
  const [frameSize, setFrameSize] = useState(100);
  const [processName, setProcessName] = useState("");
  const [processSize, setProcessSize] = useState(0);
  const [frames, setFrames] = useState<(string | null)[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [logicalAddress, setLogicalAddress] = useState("");
  const [translationResult, setTranslationResult] = useState<{
    process: string;
    logical: number;
    page: number;
    offset: number;
    frame: number;
    physical: number;
  } | null>(null);

  const numFrames = Math.floor(totalMemory / frameSize);

  // Initialize frames when memory settings change
  const initializeMemory = () => {
    const newFrames = Array(Math.floor(totalMemory / frameSize)).fill(null);
    setFrames(newFrames);
    setProcesses([]);
    setTranslationResult(null);
    toast({
      title: "Memory Initialized",
      description: `${Math.floor(totalMemory / frameSize)} frames created`,
    });
  };

  const allocateProcess = () => {
    if (!processName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a process name",
        variant: "destructive",
      });
      return;
    }

    if (processSize <= 0) {
      toast({
        title: "Error",
        description: "Process size must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    // Check if process already exists
    if (processes.find(p => p.name === processName)) {
      toast({
        title: "Error",
        description: "Process name already exists",
        variant: "destructive",
      });
      return;
    }

    const numPages = Math.ceil(processSize / frameSize);
    const freeFrames = frames
      .map((frame, index) => (frame === null ? index : -1))
      .filter(index => index !== -1);

    if (freeFrames.length < numPages) {
      toast({
        title: "Allocation Failed",
        description: `Not enough free memory. Need ${numPages} frames, only ${freeFrames.length} available.`,
        variant: "destructive",
      });
      return;
    }

    // Allocate pages to random free frames
    const pageTable: PageTableEntry[] = [];
    const newFrames = [...frames];
    const color = PROCESS_COLORS[processes.length % PROCESS_COLORS.length];

    for (let page = 0; page < numPages; page++) {
      const randomIndex = Math.floor(Math.random() * freeFrames.length);
      const frameNum = freeFrames[randomIndex];
      freeFrames.splice(randomIndex, 1);

      pageTable.push({ page, frame: frameNum });
      newFrames[frameNum] = `${processName} - Page ${page}`;
    }

    setFrames(newFrames);
    setProcesses([...processes, { name: processName, size: processSize, color, pageTable }]);
    setProcessName("");
    setProcessSize(0);

    toast({
      title: "Process Allocated",
      description: `${processName} allocated with ${numPages} pages`,
    });
  };

  const deallocateProcess = (processName: string) => {
    const process = processes.find(p => p.name === processName);
    if (!process) return;

    const newFrames = [...frames];
    process.pageTable.forEach(entry => {
      newFrames[entry.frame] = null;
    });

    setFrames(newFrames);
    setProcesses(processes.filter(p => p.name !== processName));

    toast({
      title: "Process Deallocated",
      description: `${processName} removed from memory`,
    });
  };

  const translateAddress = () => {
    const addr = parseInt(logicalAddress);
    if (isNaN(addr) || addr < 0) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid logical address",
        variant: "destructive",
      });
      return;
    }

    // Find which process this address belongs to
    let currentOffset = 0;
    let targetProcess: Process | null = null;
    let relativeAddress = addr;

    for (const process of processes) {
      if (addr < currentOffset + process.size) {
        targetProcess = process;
        relativeAddress = addr - currentOffset;
        break;
      }
      currentOffset += process.size;
    }

    if (!targetProcess) {
      toast({
        title: "Address Out of Range",
        description: "This logical address doesn't belong to any allocated process",
        variant: "destructive",
      });
      return;
    }

    const page = Math.floor(relativeAddress / frameSize);
    const offset = relativeAddress % frameSize;
    const pageEntry = targetProcess.pageTable.find(entry => entry.page === page);

    if (!pageEntry) {
      toast({
        title: "Page Fault",
        description: "This page is not in memory",
        variant: "destructive",
      });
      return;
    }

    const physical = pageEntry.frame * frameSize + offset;

    setTranslationResult({
      process: targetProcess.name,
      logical: addr,
      page,
      offset,
      frame: pageEntry.frame,
      physical,
    });
  };

  const resetAll = () => {
    setFrames([]);
    setProcesses([]);
    setTranslationResult(null);
    setProcessName("");
    setProcessSize(0);
    toast({
      title: "Reset Complete",
      description: "All memory cleared",
    });
  };

  const usedFrames = frames.filter(f => f !== null).length;
  const utilizationPercentage = frames.length > 0 ? ((usedFrames / frames.length) * 100).toFixed(1) : "0";

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
            Paging Simulation
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Visualize memory paging and page table mapping
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Configuration Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
            <CardHeader>
              <CardTitle>Memory Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="totalMemory">Total Memory (KB)</Label>
                  <Input
                    id="totalMemory"
                    type="number"
                    value={totalMemory}
                    onChange={(e) => setTotalMemory(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="frameSize">Frame Size (KB)</Label>
                  <Input
                    id="frameSize"
                    type="number"
                    value={frameSize}
                    onChange={(e) => setFrameSize(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={initializeMemory} className="w-full">
                    Initialize Memory
                  </Button>
                </div>
                <div className="flex items-end">
                  <Button onClick={resetAll} variant="destructive" className="w-full gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* Stats */}
          {frames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary">{frames.length}</div>
                  <div className="text-sm text-muted-foreground">Total Frames</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{usedFrames}</div>
                  <div className="text-sm text-muted-foreground">Frames Used</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{frames.length - usedFrames}</div>
                  <div className="text-sm text-muted-foreground">Free Frames</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-purple-600">{utilizationPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Memory Utilization</div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Process Allocation */}
          {frames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
              <CardHeader>
                <CardTitle>Allocate Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="processName">Process Name</Label>
                    <Input
                      id="processName"
                      value={processName}
                      onChange={(e) => setProcessName(e.target.value)}
                      placeholder="e.g., P1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="processSize">Process Size (KB)</Label>
                    <Input
                      id="processSize"
                      type="number"
                      value={processSize || ""}
                      onChange={(e) => setProcessSize(parseInt(e.target.value) || 0)}
                      placeholder="e.g., 250"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={allocateProcess} className="w-full">
                      Allocate Process
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          )}

          {/* Two Column Layout */}
          {frames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Physical Memory Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle>Physical Memory (Frames)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {frames.map((frame, index) => {
                      const process = processes.find(p =>
                        p.pageTable.some(entry => entry.frame === index)
                      );
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded border-2 text-center text-xs transition-all ${
                            frame === null
                              ? "bg-muted border-border"
                              : `${process?.color} text-white border-primary`
                          }`}
                        >
                          <div className="font-bold">Frame {index}</div>
                          {frame && <div className="mt-1 text-xs">{frame}</div>}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Page Tables */}
              <Card>
                <CardHeader>
                  <CardTitle>Page Tables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {processes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No processes allocated yet
                    </p>
                  ) : (
                    processes.map((process) => (
                      <div key={process.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${process.color}`}></div>
                            <h3 className="font-bold">{process.name}</h3>
                            <span className="text-sm text-muted-foreground">
                              ({process.size} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deallocateProcess(process.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Page No.</TableHead>
                              <TableHead>Frame No.</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {process.pageTable.map((entry) => (
                              <TableRow key={entry.page}>
                                <TableCell>{entry.page}</TableCell>
                                <TableCell>{entry.frame}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Address Translation */}
          {processes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card>
              <CardHeader>
                <CardTitle>Logical to Physical Address Translation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="logicalAddress">Logical Address</Label>
                      <Input
                        id="logicalAddress"
                        type="number"
                        value={logicalAddress}
                        onChange={(e) => setLogicalAddress(e.target.value)}
                        placeholder="e.g., 220"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={translateAddress} className="w-full">
                        Translate
                      </Button>
                    </div>
                  </div>

                  {translationResult && (
                    <div className="bg-muted p-4 rounded-lg space-y-2 animate-in fade-in">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Process:</span>
                          <span className="ml-2 font-bold">{translationResult.process}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Logical Address:</span>
                          <span className="ml-2 font-bold">{translationResult.logical}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Page Number:</span>
                          <span className="ml-2 font-bold">{translationResult.page}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Offset:</span>
                          <span className="ml-2 font-bold">{translationResult.offset}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Frame Number:</span>
                          <span className="ml-2 font-bold">{translationResult.frame}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Physical Address:</span>
                          <span className="ml-2 font-bold text-primary">{translationResult.physical}</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground">
                          Calculation: Physical Address = (Frame × Frame Size) + Offset = ({translationResult.frame} × {frameSize}) + {translationResult.offset} = {translationResult.physical}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Paging;
