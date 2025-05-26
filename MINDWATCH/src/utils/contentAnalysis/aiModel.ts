
// Enhanced pattern-based content analysis model
class EnhancedPatternAnalysis {
  private weights: number[];
  
  constructor() {
    this.weights = [0.8, 0.6, 0.5, 0.7, 0.6, 0.7, 0.5, 0.9, 0.4];
  }

  analyze(features: number[]): number {
    // Weighted analysis of features
    let riskScore = 0;
    let totalWeight = 0;
    
    for (let i = 0; i < features.length; i++) {
      riskScore += features[i] * this.weights[i];
      if (features[i] > 0) totalWeight += this.weights[i];
    }
    
    // Normalize risk score
    return totalWeight > 0 ? riskScore / totalWeight : 0;
  }
}

// Feature extraction based on linguistic patterns
function extractFeatures(text: string): number[] {
  const features = [];
  
  // 1. Explicit concerning content
  features.push(
    /\b(suicide|kill myself|end my life|die|death)\b/i.test(text) ? 1 : 0
  );
  
  // 2. Planning and immediacy indicators
  features.push(
    /\b(plan|will|going to|tonight|tomorrow|soon)\b/i.test(text) ? 1 : 0
  );
  
  // 3. Emotional state indicators
  features.push(
    /\b(hopeless|worthless|alone|pain|suffering|depressed)\b/i.test(text) ? 1 : 0
  );
  
  // 4. Finality and goodbye indicators
  features.push(
    /\b(goodbye|final|last time|never again)\b/i.test(text) ? 1 : 0
  );
  
  // 5. Social isolation indicators
  features.push(
    /\b(lonely|no one|nobody|abandoned|isolated)\b/i.test(text) ? 1 : 0
  );
  
  // 6. Self-worth indicators
  features.push(
    /\b(burden|worthless|failure|useless|mistake)\b/i.test(text) ? 1 : 0
  );
  
  // 7. Past attempts or ideation
  features.push(
    /\b(tried before|attempt|thought about|considered)\b/i.test(text) ? 1 : 0
  );
  
  // 8. Method specificity (high-risk indicator)
  features.push(
    /\b(pills|gun|jump|hang|overdose|bridge)\b/i.test(text) ? 1 : 0
  );
  
  // Add bias term
  features.push(1);
  
  return features;
}

// Initialize the pattern analysis model
const model = new EnhancedPatternAnalysis();

export async function analyzeWithAI(text: string): Promise<{
  risk: number;
  isHighRisk: boolean;
  features: number[];
}> {
  console.log('Analyzing text with enhanced pattern model:', text);
  
  const inputFeatures = extractFeatures(text);
  const risk = model.analyze(inputFeatures);
  
  // More nuanced risk assessment
  const isHighRisk = risk > 0.8; // Only truly severe cases

  console.log('Pattern analysis results:', {
    features: inputFeatures,
    risk,
    isHighRisk
  });

  return {
    risk,
    isHighRisk,
    features: inputFeatures
  };
}
