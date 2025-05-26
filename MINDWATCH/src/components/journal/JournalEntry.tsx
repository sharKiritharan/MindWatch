
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeContent } from "@/utils/contentAnalysis";
import CrisisAlert from "./CrisisAlert";
import PerformanceMetrics from "./PerformanceMetrics";
import { recordAnalysisLatency, recordMemoryUsage, checkFrameRate } from "@/utils/performanceMonitoring";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface JournalEntryProps {
  entry: string;
  rating: string;
  isSubmitting: boolean;
  onEntryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const JournalEntry = ({
  entry,
  rating,
  isSubmitting,
  onEntryChange,
  onSubmit,
}: JournalEntryProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [context, setContext] = useState<string[]>([]);
  const [shownTriggers, setShownTriggers] = useState<Set<string>>(new Set());
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    let isActive = true;
    
    const runAnalysis = async () => {
      if (entry.trim() && !analyzing) {
        setAnalyzing(true);
        const startTime = Date.now();
        
        try {
          console.log("Analyzing entry:", entry);
          recordMemoryUsage();
          
          const analysis = await analyzeContent(entry);
          
          recordAnalysisLatency(startTime);
          checkFrameRate();
          recordMemoryUsage();
          
          if (!isActive) return;
          
          const newTriggers = analysis.triggers.filter(trigger => !shownTriggers.has(trigger));
          
          if (newTriggers.length > 0) {
            console.log("New triggers detected:", newTriggers);
            console.log("Analysis severity:", analysis.severity);
            
            // Update states with the current analysis results
            setSeverity(analysis.severity);
            setTriggers(newTriggers);
            setContext(analysis.context);
            setShowAlert(true);
            
            // Remember which triggers we've shown
            const updatedShownTriggers = new Set(shownTriggers);
            newTriggers.forEach(trigger => updatedShownTriggers.add(trigger));
            setShownTriggers(updatedShownTriggers);
          }
        } catch (error) {
          console.error("Error analyzing content:", error);
        } finally {
          if (isActive) {
            setAnalyzing(false);
          }
        }
      }
    };
    
    const timer = setTimeout(() => {
      runAnalysis();
    }, 800);
    
    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [entry, shownTriggers, analyzing]);

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Daily Journal</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              How are you feeling today? (Rating: {rating}/10)
            </label>
            <Textarea
              value={entry}
              onChange={(e) => onEntryChange(e.target.value)}
              placeholder="Write your thoughts here..."
              className="min-h-[200px]"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !entry.trim()}>
              {isSubmitting ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg mt-4">
        <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
        <p className="text-gray-600">
          If you're feeling overwhelmed, please remember you're not alone. The
          Suicide and Crisis Lifeline is available 24/7: <strong>0300 102 1234</strong>
        </p>
      </div>

      <CrisisAlert 
        isOpen={showAlert} 
        onClose={handleAlertClose}
        triggers={triggers}
        severity={severity}  
        context={context}
      />
      
      <PerformanceMetrics />
    </>
  );
};

export default JournalEntry;
