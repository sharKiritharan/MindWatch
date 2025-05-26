interface AnalysisResult {
  triggers: string[];
  severity: 'low' | 'medium' | 'high';
  context: string[];
}

export const analyzePatterns = (text: string): AnalysisResult => {
  const lowRiskPatterns = [
    /\b(sad|lonely|tired|stressed|anxious)\b/i,
    /\b(overwhelmed|exhausted|frustrated)\b/i,
  ];

  const mediumRiskPatterns = [
    /\b(hopeless|worthless|empty|numb)\b/i,
    /\b(give up|cant take|no point)\b/i,
    /\b(nobody cares|no one understands)\b/i,
  ];

  const highRiskPatterns = [
    /\b(suicide|kill myself|end it all|better off dead)\b/i,
    /\b(plan to|going to|tonight|tomorrow|soon.*die)\b/i,
    /\b(pills|gun|jump|hang|overdose)\b/i,
  ];

  const triggers: string[] = [];
  const context: string[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';

  // Check high risk patterns first
  for (const pattern of highRiskPatterns) {
    if (pattern.test(text)) {
      triggers.push(pattern.source.replace(/\\b|\(|\)|\?:/g, ''));
      severity = 'high';
    }
  }

  // If not high risk, check medium risk
  if (severity !== 'high') {
    for (const pattern of mediumRiskPatterns) {
      if (pattern.test(text)) {
        triggers.push(pattern.source.replace(/\\b|\(|\)|\?:/g, ''));
        severity = 'medium';
      }
    }
  }

  // If neither high nor medium, check low risk
  if (severity === 'low') {
    for (const pattern of lowRiskPatterns) {
      if (pattern.test(text)) {
        triggers.push(pattern.source.replace(/\\b|\(|\)|\?:/g, ''));
      }
    }
  }

  // Add contextual information
  if (severity === 'high') {
    context.push('Immediate attention recommended');
  } else if (severity === 'medium') {
    context.push('Professional support may be helpful');
  } else {
    context.push('Consider talking to someone you trust');
  }

  return {
    triggers,
    severity,
    context
  };
};