// Simulates ML algorithms for fake news detection
// In production, this would call actual ML models

export interface AlgorithmResult {
  prediction: 'Reliable' | 'Unreliable';
  reliableProbability: number;
  unreliableProbability: number;
  confidence: number;
}

export interface AnalysisResult {
  randomForest: AlgorithmResult;
  logisticRegression: AlgorithmResult;
  content: string;
  inputType: 'text' | 'url';
  timestamp: string;
}

// Analyze text for fake news indicators
function analyzeContent(text: string): number {
  let fakeScore = 0;
  const lowerText = text.toLowerCase();

  // Start with base score
  let baseReliability = 50;

  // Sensationalism indicators (STRONG fake news indicators)
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.4) fakeScore += 25;
  else if (capsRatio > 0.25) fakeScore += 15;
  
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 10) fakeScore += 20;
  else if (exclamationCount > 5) fakeScore += 12;
  else if (exclamationCount > 2) fakeScore += 6;

  // Emotional and clickbait words (HIGH weight for fake news)
  const emotionalWords = [
    'shocking', 'unbelievable', 'incredible', 'amazing', 'terrible', 
    'horrible', 'devastating', 'miracle', 'breaking', 'urgent',
    'conspiracy', 'exposed', 'revealed', 'secret', 'hidden',
    'scam', 'hoax', 'fake', 'lie', 'propaganda', 'must see',
    'won\'t believe', 'stunned', 'outraged', 'epic', 'insane',
    'crazy', 'bombshell', 'explosive', 'scandal', 'corrupt'
  ];
  
  let emotionalWordCount = 0;
  emotionalWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = (text.match(regex) || []).length;
    emotionalWordCount += matches;
    fakeScore += matches * 5;
  });

  // Heavy use of emotional words is very suspicious
  if (emotionalWordCount > 5) fakeScore += 15;

  // Vague sources (RED FLAG)
  const vagueSources = [
    'sources say', 'experts claim', 'some people', 'many believe',
    'it is said', 'reportedly', 'allegedly', 'rumor has it',
    'people are saying', 'word on the street', 'insiders claim',
    'anonymous source', 'they don\'t want you to know'
  ];
  
  vagueSources.forEach(phrase => {
    if (lowerText.includes(phrase)) fakeScore += 12;
  });

  // Conspiracy indicators
  const conspiracyWords = [
    'cover up', 'they don\'t want', 'mainstream media', 'wake up',
    'sheeple', 'truth is', 'real story', 'what they won\'t tell',
    'hidden agenda', 'new world order', 'deep state'
  ];
  
  conspiracyWords.forEach(phrase => {
    if (lowerText.includes(phrase)) fakeScore += 18;
  });

  // Positive indicators (reduce fake score - CREDIBLE sources)
  const credibleIndicators = [
    'according to', 'published in', 'research shows', 'study found',
    'data indicates', 'professor', 'university', 'journal',
    'peer-reviewed', 'evidence suggests', 'statistics show',
    'reuters', 'associated press', 'new york times', 'bbc',
    'cnn', 'washington post', 'guardian', 'scientific study'
  ];
  
  let credibleCount = 0;
  credibleIndicators.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      fakeScore -= 15;
      credibleCount++;
    }
  });

  // Multiple credible sources is very good
  if (credibleCount >= 3) fakeScore -= 20;

  // Check for proper structure
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 3) fakeScore += 20; // Too short
  if (text.length < 50) fakeScore += 25; // Very short content
  if (text.length < 20) fakeScore += 30; // Extremely short

  // Grammar and spelling (simplified check)
  const hasMultipleSpaces = /\s{2,}/.test(text);
  if (hasMultipleSpaces) fakeScore += 8;

  // All caps sentences (VERY suspicious)
  const allCapsSentences = sentences.filter(s => {
    const words = s.trim().split(/\s+/);
    const capsWords = words.filter(w => w === w.toUpperCase() && w.length > 2);
    return capsWords.length > words.length * 0.5;
  });
  if (allCapsSentences.length > 0) fakeScore += 20;

  // Question marks (clickbait often uses questions)
  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount > 5) fakeScore += 10;

  // Normalize score to 0-100 range
  const finalScore = Math.max(0, Math.min(100, fakeScore));
  
  return finalScore;
}

// Random Forest simulation
function randomForestClassify(content: string, inputType: 'text' | 'url'): AlgorithmResult {
  const baseScore = analyzeContent(content);
  
  // Random Forest tends to be more conservative and robust
  // Add some variance and ensemble behavior
  const variance = Math.random() * 8 - 4; // -4 to +4
  const adjustedScore = Math.max(0, Math.min(100, baseScore + variance));
  
  // Add slight preference for ensemble robustness
  const ensembleAdjustment = Math.random() * 5;
  
  let unreliableProb = adjustedScore + ensembleAdjustment;
  unreliableProb = Math.max(5, Math.min(95, unreliableProb)); // Keep in 5-95 range
  
  const reliableProb = 100 - unreliableProb;
  const prediction = unreliableProb > 50 ? 'Unreliable' : 'Reliable';
  const confidence = Math.round(Math.abs(unreliableProb - 50) * 2);

  return {
    prediction,
    reliableProbability: Number(reliableProb.toFixed(2)),
    unreliableProbability: Number(unreliableProb.toFixed(2)),
    confidence: Math.min(99, Math.max(55, confidence))
  };
}

// Logistic Regression simulation
function logisticRegressionClassify(content: string, inputType: 'text' | 'url'): AlgorithmResult {
  const baseScore = analyzeContent(content);
  
  // Logistic Regression tends to have clearer decision boundaries
  // Apply sigmoid-like transformation
  const variance = Math.random() * 6 - 3; // -3 to +3
  let adjustedScore = baseScore + variance;
  
  // Sigmoid transformation for more decisive predictions
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-(x - 50) / 10));
  const sigmoidScore = sigmoid(adjustedScore) * 100;
  
  let unreliableProb = sigmoidScore;
  unreliableProb = Math.max(5, Math.min(95, unreliableProb));
  
  const reliableProb = 100 - unreliableProb;
  const prediction = unreliableProb > 50 ? 'Unreliable' : 'Reliable';
  const confidence = Math.round(Math.abs(unreliableProb - 50) * 2);

  return {
    prediction,
    reliableProbability: Number(reliableProb.toFixed(2)),
    unreliableProbability: Number(unreliableProb.toFixed(2)),
    confidence: Math.min(99, Math.max(55, confidence))
  };
}

// Main analysis function
export function analyzeNews(content: string, inputType: 'text' | 'url'): AnalysisResult {
  // For URL input, simulate fetched content
  let analyzedContent = content;
  if (inputType === 'url') {
    // In production, this would fetch and extract article text
    analyzedContent = `Article content from ${content}. This is simulated text for analysis purposes.`;
  }

  const randomForest = randomForestClassify(analyzedContent, inputType);
  const logisticRegression = logisticRegressionClassify(analyzedContent, inputType);

  return {
    randomForest,
    logisticRegression,
    content,
    inputType,
    timestamp: new Date().toISOString()
  };
}