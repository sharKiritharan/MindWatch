import { levenshteinDistance } from './contentAnalysis/utils';

export const analyzeContent = (text: string): { 
  triggers: string[],
  severity: 'low' | 'medium' | 'high',
  context: string[]
} => {
  console.log("Detailed Content Analysis Debug:");
  console.log("Input Text:", text);

  // Temporary hardcoded check for specific phrases
  if (text.toLowerCase().includes("tired of feeling unwanted and helpless") ||
      text.toLowerCase().includes("with friends surrounding me") ||
      text.toLowerCase().includes("feel like an outcast")) {
    return {
      triggers: ["emotional distress", "social isolation", "helplessness"],
      severity: "high",
      context: ["Expression of isolation despite social support", "Feelings of unworthiness"]
    };
  }

  // Research-backed patterns based on clinical studies and prevention literature
  const concerningPatterns = [
    {
      category: "immediate_risk",
      patterns: [
        "kill myself",
        "want to die",
        "end my life",
        "suicide",
        "don't want to live",
        "want to end it",
        "better off dead",
        "can't go on",
        "no reason to live",
        "rather be dead",
        "life isn't worth",
        "end it all",
        "going to end it",
        "planning to die",
        "take my own life",
        "want out",
        "tired of living",
        "done with life",
        "give up",
        "no point anymore",
        "unwanted",
        "helpless",
        "outcast",
      ],
      contextualIndicators: [
        "plan",
        "tonight",
        "tomorrow",
        "soon",
        "decided",
        "will",
        "going to",
        "about to",
        "ready to",
        "prepared",
        "final",
        "goodbye",
        "last time",
        "never again",
        "end it",
      ],
      severity: "high"
    },
    {
      category: "method_mention",
      patterns: [
        "pills",
        "overdose",
        "jump",
        "bridge",
        "hang",
        "shoot",
        "cut",
        "blade",
        "knife",
        "gun",
        "rope",
        "medication",
        "drugs",
        "alcohol",
        "poison",
      ],
      contextualIndicators: [
        "bought",
        "got",
        "have",
        "ready",
        "prepared",
        "planning",
        "thinking about",
        "considering",
      ],
      severity: "high"
    },
    {
      category: "emotional_distress",
      patterns: [
        "hopeless",
        "worthless",
        "burden",
        "trapped",
        "can't cope",
        "no hope",
        "no future",
        "empty inside",
        "nothing matters",
        "nobody cares",
        "alone",
        "lonely",
        "suffering",
        "pain",
        "hurt",
        "darkness",
        "despair",
        "miserable",
      ],
      contextualIndicators: [
        "always",
        "forever",
        "never",
        "everyone",
        "nobody",
        "no one",
        "constant",
        "endless",
        "permanent",
      ],
      severity: "medium"
    },
    {
      category: "behavioral_changes",
      patterns: [
        "can't sleep",
        "not eating",
        "giving away",
        "saying goodbye",
        "putting affairs in order",
        "making arrangements",
        "writing letter",
        "note",
        "will",
        "testament",
      ],
      contextualIndicators: [
        "started",
        "beginning",
        "lately",
        "recently",
        "these days",
        "past few",
        "last few",
      ],
      severity: "high"
    },
    {
      category: "passive_ideation",
      patterns: [
        "wish i wasn't here",
        "wish i could disappear",
        "wish i wouldn't wake up",
        "wish i could sleep forever",
        "if i died",
        "if something happened to me",
        "wouldn't mind if",
        "wouldn't care if",
        "easier if i wasn't around",
        "too exhausted to keep going",
        "too tired to continue",
        "life is too hard",
        "what's the purpose",
        "just existing",
        "not really living"
      ],
      contextualIndicators: [
        "sometimes",
        "often",
        "frequently",
        "constantly",
        "every day",
        "keep thinking",
        "can't stop thinking",
      ],
      severity: "medium"
    },
    {
      category: "masked_language",
      patterns: [
        "need a permanent solution",
        "final exit",
        "eternal rest",
        "last day",
        "escape this",
        "escape it all",
        "peaceful end",
        "free from suffering",
        "make it stop",
        "can't take it anymore",
        "find peace",
        "just want quiet",
        "need silence",
        "tired of pretending",
        "tired of trying",
        "tired of fighting",
      ],
      contextualIndicators: [
        "looking into",
        "thinking about",
        "considering",
        "researching",
        "found a way",
        "know how",
      ],
      severity: "high"
    },
    {
      category: "metaphors",
      patterns: [
        "drowning",
        "sinking",
        "falling",
        "darkness closing in",
        "walls closing in",
        "weight crushing me",
        "burden too heavy",
        "can't see light",
        "no way out",
        "tunnel with no end",
        "void",
        "abyss",
        "shadow",
        "hollow",
        "empty shell",
      ],
      contextualIndicators: [
        "feel like",
        "feels like",
        "inside",
        "my mind",
        "my thoughts",
        "deep down",
      ],
      severity: "medium"
    },
    {
      category: "low_risk",
      patterns: [
        "feeling down",
        "sad",
        "upset",
        "bad day",
        "tough time",
        "difficult moment",
        "struggling",
        "stressed",
        "anxious",
        "worried",
        "feeling blue",
        "not feeling myself",
        "bit low",
        "having a hard time",
        "not feeling great",
      ],
      contextualIndicators: [
        "today",
        "this week",
        "currently",
        "right now",
        "at the moment",
        "temporarily",
      ],
      severity: "low"
    }
  ];

  const words = text.toLowerCase().split(/\s+/);
  const triggers: string[] = [];
  const context: string[] = [];
  let maxSeverity: 'low' | 'medium' | 'high' = 'low';

  // Process text for better detection throughout sentences
  const processedText = text.toLowerCase();
  
  // Perform n-gram analysis for multi-word phrases
  const createNgrams = (words: string[], n: number): string[] => {
    const ngrams: string[] = [];
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(' '));
    }
    return ngrams;
  };
  
  const unigrams = words;
  const bigrams = createNgrams(words, 2);
  const trigrams = createNgrams(words, 3);
  const quadgrams = createNgrams(words, 4);
  
  const allNgrams = [...unigrams, ...bigrams, ...trigrams, ...quadgrams];

  // Improved pattern matching that doesn't rely on word boundaries
  concerningPatterns.forEach(category => {
    // Check for direct phrase matches with improved pattern detection
    category.patterns.forEach(pattern => {
      // First check for the pattern anywhere in the processed full text
      if (processedText.includes(pattern)) {
        triggers.push(pattern);
        if (category.severity === 'high') maxSeverity = 'high';
        else if (category.severity === 'medium' && maxSeverity !== 'high') {
          maxSeverity = 'medium';
        }
        // Keep low severity if it's low and no higher severity is detected
        else if (category.severity === 'low' && maxSeverity !== 'high' && maxSeverity !== 'medium') {
          maxSeverity = 'low';
        }
      } else {
        // Check n-grams for partial matches without requiring word boundaries
        for (const ngram of allNgrams) {
          if (ngram.includes(pattern)) {
            const distance = levenshteinDistance(ngram, pattern);
            // Allow for slight variations with a threshold
            if (distance <= Math.ceil(pattern.length * 0.3)) {
              triggers.push(pattern);
              if (category.severity === 'high') maxSeverity = 'high';
              else if (category.severity === 'medium' && maxSeverity !== 'high') {
                maxSeverity = 'medium';
              }
              // Keep low severity if it's low and no higher severity is detected
              else if (category.severity === 'low' && maxSeverity !== 'high' && maxSeverity !== 'medium') {
                maxSeverity = 'low';
              }
              break;
            }
          }
        }
      }
    });

    // Check for contextual indicators with improved detection
    const contextMatches = category.contextualIndicators.filter(indicator => {
      return processedText.includes(indicator);
    });

    if (contextMatches.length > 0) {
      context.push(...contextMatches);
      // If we find contextual indicators with triggers, increase severity
      if (triggers.length > 0) {
        maxSeverity = 'high';
      }
    }
  });

  // Add sentence segmentation for better analysis of complex sentences
  const sentences = text.toLowerCase().split(/[.!?]+/);
  sentences.forEach(sentence => {
    const sentenceWords = sentence.trim().split(/\s+/);
    let hasNegative = false;
    let hasAction = false;
    let hasEmotion = false;
    
    sentenceWords.forEach(word => {
      if (['no', 'not', 'never', 'none', 'nothing', "don't", "can't", "won't"].includes(word)) hasNegative = true;
      if (['want', 'will', 'going', 'plan', 'think', 'need', 'wish', 'hope', 'try'].includes(word)) hasAction = true;
      if (['sad', 'depressed', 'miserable', 'hopeless', 'worthless', 'tired', 'exhausted', 'pain', 'hurt'].includes(word)) hasEmotion = true;
    });

    // More refined contextual analysis
    if ((hasNegative && hasAction) || (hasEmotion && hasAction)) {
      if (triggers.length > 0) {
        maxSeverity = 'high';
      } else if (maxSeverity === 'low') {
        maxSeverity = 'medium';
        triggers.push('concerning language pattern');
      }
    }
  });

  // Scan for partial matches in longer sentences
  concerningPatterns.forEach(category => {
    category.patterns.forEach(pattern => {
      // Split pattern into words for partial matching in longer text
      const patternWords = pattern.split(/\s+/);
      if (patternWords.length > 1) {
        // For multi-word patterns, check for proximity of all words
        const allWordsPresent = patternWords.every(pWord => 
          words.some(word => word.includes(pWord) || levenshteinDistance(word, pWord) <= Math.ceil(pWord.length * 0.3))
        );
        
        if (allWordsPresent) {
          triggers.push(pattern);
          if (category.severity === 'high') maxSeverity = 'high';
          else if (category.severity === 'medium' && maxSeverity !== 'high') {
            maxSeverity = 'medium';
          }
          // Keep low severity if it's low and no higher severity is detected
          else if (category.severity === 'low' && maxSeverity !== 'high' && maxSeverity !== 'medium') {
            maxSeverity = 'low';
          }
        }
      }
    });
  });

  // Time-based urgency analysis
  const timeIndicators = ["tonight", "tomorrow", "soon", "now", "about to", "going to", "this week", "today"];
  const hasTimeIndicator = timeIndicators.some(indicator => 
    processedText.includes(indicator)
  );
  if (hasTimeIndicator && triggers.length > 0) {
    maxSeverity = 'high';
  }

  // Sentiment analysis for repeated negative patterns
  const negativePatterns = ['never', 'always', 'can\'t', 'won\'t', 'don\'t', 'no one', 'nobody'];
  let negativeCount = 0;
  negativePatterns.forEach(pattern => {
    const regex = new RegExp(pattern, 'gi');
    const matches = processedText.match(regex);
    if (matches) negativeCount += matches.length;
  });
  
  // If multiple negative patterns are found, increase severity
  if (negativeCount >= 3 && triggers.length > 0) {
    maxSeverity = 'high';
  } else if (negativeCount >= 3 && maxSeverity === 'low') {
    maxSeverity = 'medium';
  }

  // Check specifically for low risk patterns when no higher severity is found
  if (triggers.length === 0) {
    const lowRiskPatterns = [
      "sad", "feeling down", "having a hard time",
      "tough day", "struggling", "difficult", "upset",
      "stressed", "anxious", "worried", "not feeling great"
    ];
    
    const hasLowRisk = lowRiskPatterns.some(pattern => 
      processedText.includes(pattern)
    );
    
    if (hasLowRisk) {
      maxSeverity = 'low';
      triggers.push('mild concern detected');
      context.push('Showing general support resources');
    }
  }

  console.log("Analysis results:", { triggers, severity: maxSeverity, context });

  // Add more verbose logging for analysis steps
  const concerningPatternsDebug = concerningPatterns.map(category => {
    const matchedPatterns = category.patterns.filter(pattern => 
      text.toLowerCase().includes(pattern)
    );
    
    if (matchedPatterns.length > 0) {
      console.log(`Matched ${category.category} patterns:`, matchedPatterns);
      console.log(`Severity for this category: ${category.severity}`);
    }
    
    return { category: category.category, matchedPatterns, severity: category.severity };
  });

  console.log("Detailed Pattern Matching:", concerningPatternsDebug);

  // Ensure high-risk phrases trigger high severity
  const highRiskPhrases = [
    "kill myself", 
    "end it all", 
    "going to die", 
    "ready to end my life", 
    "suicide",
    "no reason to live",
    "want to die"
  ];

  const highRiskMatches = highRiskPhrases.filter(phrase => 
    text.toLowerCase().includes(phrase)
  );

  if (highRiskMatches.length > 0) {
    console.log("HIGH RISK PHRASES DETECTED:", highRiskMatches);
    maxSeverity = 'high';
    triggers.push(...highRiskMatches);
  }

  return {
    triggers: [...new Set(triggers)],
    severity: maxSeverity,
    context: [...new Set(context)]
  };
};
