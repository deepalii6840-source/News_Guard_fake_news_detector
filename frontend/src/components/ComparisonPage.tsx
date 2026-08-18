import { useState } from 'react';
import { FileText, Link2, Loader2, Trophy, GitCompare } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { analyzeNews, AnalysisResult } from '../utils/newsAnalysis';
import { Progress } from './ui/progress';

export default function ComparisonPage() {
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleCompare = async () => {
    const content = inputType === 'text' ? textInput : urlInput;
    
    if (!content.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const analysisResults = analyzeNews(content, inputType);
    setResults(analysisResults);

    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setTextInput('');
    setUrlInput('');
    setResults(null);
  };

  const getBetterAlgorithm = () => {
    if (!results) return null;
    
    const rf = results.randomForest;
    const lr = results.logisticRegression;

    // Compare confidence levels
    if (rf.confidence > lr.confidence) {
      return {
        name: 'Random Forest Classifier',
        reason: 'Higher confidence level',
        confidence: rf.confidence,
        prediction: rf.prediction
      };
    } else if (lr.confidence > rf.confidence) {
      return {
        name: 'Logistic Regression',
        reason: 'Higher confidence level',
        confidence: lr.confidence,
        prediction: lr.prediction
      };
    } else {
      // If confidence is equal, check probability margins
      const rfMargin = Math.abs(rf.reliableProbability - rf.unreliableProbability);
      const lrMargin = Math.abs(lr.reliableProbability - lr.unreliableProbability);
      
      if (rfMargin > lrMargin) {
        return {
          name: 'Random Forest Classifier',
          reason: 'Clearer probability distinction',
          confidence: rf.confidence,
          prediction: rf.prediction
        };
      } else {
        return {
          name: 'Logistic Regression',
          reason: 'Clearer probability distinction',
          confidence: lr.confidence,
          prediction: lr.prediction
        };
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <GitCompare className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-gray-900">Algorithm Comparison</h2>
            <p className="text-sm text-gray-600">Compare predictions from both algorithms</p>
          </div>
        </div>
        
        <Tabs value={inputType} onValueChange={(v) => setInputType(v as 'text' | 'url')} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Text Input
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              URL Input
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Enter news article text:
                </label>
                <Textarea
                  placeholder="Paste the news article text here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700">
                  Enter news article URL:
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/news-article"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3">
          <Button
            onClick={handleCompare}
            disabled={isAnalyzing || (inputType === 'text' ? !textInput.trim() : !urlInput.trim())}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Comparing...
              </>
            ) : (
              'Compare Algorithms'
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={isAnalyzing}
          >
            Reset
          </Button>
        </div>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Winner Card */}
          <Card className="p-6 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-3 rounded-xl shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-2">Best Algorithm for This Analysis</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-900">{getBetterAlgorithm()?.name}</span>
                    <Badge variant="outline" className="bg-white">
                      {getBetterAlgorithm()?.prediction}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">
                    Reason: {getBetterAlgorithm()?.reason} ({getBetterAlgorithm()?.confidence}% confidence)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Side-by-Side Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Random Forest */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900">Random Forest Classifier</h3>
                  <p className="text-sm text-gray-600">TF-IDF Vectorization</p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  results.randomForest.prediction === 'Reliable'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Prediction:</span>
                    <Badge variant={results.randomForest.prediction === 'Reliable' ? "default" : "destructive"}>
                      {results.randomForest.prediction}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-700">
                    Confidence: {results.randomForest.confidence}%
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm text-gray-700">Probability Distribution</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Reliable</span>
                      <span className="text-green-600">{results.randomForest.reliableProbability.toFixed(2)}%</span>
                    </div>
                    <Progress 
                      value={results.randomForest.reliableProbability} 
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-green-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Unreliable</span>
                      <span className="text-red-600">{results.randomForest.unreliableProbability.toFixed(2)}%</span>
                    </div>
                    <Progress 
                      value={results.randomForest.unreliableProbability} 
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-red-600"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Logistic Regression */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-900">Logistic Regression</h3>
                  <p className="text-sm text-gray-600">TF-IDF Feature Extraction</p>
                </div>

                <div className={`p-4 rounded-lg border-2 ${
                  results.logisticRegression.prediction === 'Reliable'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Prediction:</span>
                    <Badge variant={results.logisticRegression.prediction === 'Reliable' ? "default" : "destructive"}>
                      {results.logisticRegression.prediction}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-700">
                    Confidence: {results.logisticRegression.confidence}%
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm text-gray-700">Probability Distribution</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Reliable</span>
                      <span className="text-green-600">{results.logisticRegression.reliableProbability.toFixed(2)}%</span>
                    </div>
                    <Progress 
                      value={results.logisticRegression.reliableProbability} 
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-green-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Unreliable</span>
                      <span className="text-red-600">{results.logisticRegression.unreliableProbability.toFixed(2)}%</span>
                    </div>
                    <Progress 
                      value={results.logisticRegression.unreliableProbability} 
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-red-600"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
