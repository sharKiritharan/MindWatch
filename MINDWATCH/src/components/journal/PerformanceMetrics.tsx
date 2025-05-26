
import { useState, useEffect } from "react";
import { getPerformanceMetrics, resetMetrics } from "@/utils/performanceMonitoring";
import generateBenchmarkReport from "@/utils/generateBenchmarkReport";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "../ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "@/hooks/use-toast";

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    avgLatency: 0,
    frameDrops: 0,
    avgMemory: 0
  });
  const [isOpen, setIsOpen] = useState(false);
  const [fullReport, setFullReport] = useState("");

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setMetrics(getPerformanceMetrics());
      }, 1000);
      
      // Generate full report when dialog opens
      setFullReport(generateBenchmarkReport());
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleReset = () => {
    resetMetrics();
    setMetrics(getPerformanceMetrics());
    setFullReport(generateBenchmarkReport());
  };

  const chartData = [
    {
      name: "Analysis Latency",
      value: metrics.avgLatency,
      target: 500,
      label: `${metrics.avgLatency}ms / 500ms target`
    },
    {
      name: "Frame Drops",
      value: metrics.frameDrops,
      target: 5,
      label: `${metrics.frameDrops} / 5 target`
    },
    {
      name: "Memory Usage",
      value: metrics.avgMemory,
      target: 50,
      label: `${metrics.avgMemory}MB / 50MB target`
    }
  ];

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fullReport);
    toast({
      title: "Report copied",
      description: "Performance benchmark report copied to clipboard",
    });
  };

  const handleSaveReport = () => {
    // Create a blob and download it
    const blob = new Blob([fullReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindwatch-benchmark-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report saved",
      description: "Performance benchmark report downloaded as Markdown",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="absolute bottom-4 right-4">
          Performance Metrics
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Performance Benchmarks</DialogTitle>
          <DialogDescription>
            Real-time metrics for content analysis performance
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="report">Full Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="py-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Analysis Latency:</span>
                <span className={`text-sm ${metrics.avgLatency < 500 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.avgLatency}ms (Target: &lt;500ms)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">UI Responsiveness:</span>
                <span className={`text-sm ${metrics.frameDrops === 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.frameDrops} frame drops (Target: 0)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Memory Usage:</span>
                <span className={`text-sm ${metrics.avgMemory < 50 ? 'text-green-500' : 'text-red-500'}`}>
                  {metrics.avgMemory}MB average (Target: &lt;50MB)
                </span>
              </div>
            </div>
            
            <ChartContainer config={{}} className="h-[200px] w-full">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="report" className="py-4">
            <div className="h-[300px] overflow-auto p-4 text-xs font-mono bg-gray-50 rounded border">
              <pre className="whitespace-pre-wrap">{fullReport}</pre>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset Metrics
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              Copy Report
            </Button>
            <Button onClick={handleSaveReport}>
              Save Report
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PerformanceMetrics;
