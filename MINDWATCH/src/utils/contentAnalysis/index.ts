
import { analyzePatterns } from './patterns';

export const analyzeContent = async (text: string): Promise<{ 
  triggers: string[];
  severity: 'low' | 'medium' | 'high';
  context: string[];
}> => {
  console.log("Analyzing content:", text);

  // Perform rule-based pattern analysis
  const patternAnalysis = analyzePatterns(text);
  console.log("Pattern analysis results:", patternAnalysis);

  // Get triggers and context from pattern analysis
  const triggers = [...new Set([...patternAnalysis.triggers])];
  const context = [...new Set([...patternAnalysis.context])];
  
  // Get severity based on phrase matching
  const severityFromPhrases = getSeverityFromPhrases(text);
  console.log("Severity from phrases:", severityFromPhrases);
  
  // Determine final severity based on phrase matching
  const finalSeverity = severityFromPhrases || 'low';

  // Update triggers and context based on final severity
  updateTriggersAndContext(finalSeverity, triggers, context);

  console.log("Final analysis results:", { 
    triggers, 
    severity: finalSeverity, 
    context,
    severityFromPhrases
  });

  return {
    triggers: [...new Set(triggers)],
    severity: finalSeverity,
    context: [...new Set(context)]
  };
};

// Extract the severity determination from phrases into a separate function
const getSeverityFromPhrases = (text: string): 'low' | 'medium' | 'high' | null => {
  const processedText = text.toLowerCase();
  
  // Define risk phrases
  const highRiskPhrases = [
    "suicide", "kill myself", "end it",
    "don't want to live", "better off dead",
    "want to die", "end my life", "going to end it all"
  ];
  
  const mediumRiskPhrases = [
    "unwanted", "helpless", "outcast", "give up",
    "worthless", "hopeless", "can't go on"
  ];
  
  const lowRiskPhrases = [
    "sad", "feeling down", "having a hard time",
    "tough day", "struggling", "difficult"
  ];
  
  // Check for exact phrase matches to determine severity
  const hasHighRisk = highRiskPhrases.some(phrase => 
    processedText.includes(phrase)
  );
  
  if (hasHighRisk) {
    return 'high';
  }
  
  const hasMediumRisk = mediumRiskPhrases.some(phrase => 
    processedText.includes(phrase)
  );
  
  if (hasMediumRisk) {
    return 'medium';
  }
  
  const hasLowRisk = lowRiskPhrases.some(phrase => 
    processedText.includes(phrase)
  );
  
  if (hasLowRisk) {
    return 'low';
  }
  
  return null;
};

// Update triggers and context based on final severity
const updateTriggersAndContext = (
  severity: 'low' | 'medium' | 'high',
  triggers: string[],
  context: string[]
): void => {
  switch (severity) {
    case 'high':
      if (!triggers.includes('immediate risk detected')) {
        triggers.push('immediate risk detected');
        context.push('Contains explicit concerning content');
      }
      break;
    case 'medium':
      if (!triggers.includes('concerning content detected')) {
        triggers.push('concerning content detected');
        context.push('Showing support resources');
      }
      break;
    case 'low':
      if (!triggers.includes('mild concern detected')) {
        triggers.push('mild concern detected');
        context.push('Showing support resources');
      }
      break;
  }
};
