import { useState } from 'react';
import { FileText, Link2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import ResultCard from './ResultCard';
import { analyzeNews, AnalysisResult } from '../utils/newsAnalysis';
import { saveToHistory } from '../utils/historyStorage';


export default function AnalysisPage() {
  const [inputType, setInputType] = useState<'text' | 'url'>('text');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);


  const handleAnalyze = async () => {
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
    
    // Save to history
    saveToHistory(analysisResults);


    setIsAnalyzing(false);
  };


  const handleReset = () => {
    setTextInput('');
    setUrlInput('');
    setResults(null);
  };


  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-gray-900 mb-6">Analyze News Content</h2>
        
        <Tabs value={inputType} onValueChange={(v: string) => setInputType(v as 'text' | 'url')} className="mb-6">
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
            onClick={handleAnalyze}
            disabled={isAnalyzing || (inputType === 'text' ? !textInput.trim() : !urlInput.trim())}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze News'
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
          <ResultCard
            algorithm="Random Forest Classifier"
            description="Uses ensemble learning with TF-IDF vectorization for robust classification"
            result={results.randomForest}
          />
          <ResultCard
            algorithm="Logistic Regression"
            description="Linear classification model with TF-IDF feature extraction"
            result={results.logisticRegression}
          />
        </div>
      )}
    </div>
  );
}