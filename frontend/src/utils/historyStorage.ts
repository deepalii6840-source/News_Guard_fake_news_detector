// Storage utility for analysis history
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

const STORAGE_KEY = 'newsguard_history';
const MAX_HISTORY_ITEMS = 50;

export function saveToHistory(result: AnalysisResult): void {
  try {
    const history = getHistory();
    history.unshift(result); // Add to beginning
    
    // Keep only last MAX_HISTORY_ITEMS
    const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving to history:', error);
  }
}

export function getHistory(): AnalysisResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing history:', error);
  }
}
