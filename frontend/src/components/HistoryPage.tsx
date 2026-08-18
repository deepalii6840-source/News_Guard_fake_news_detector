import { useState, useEffect } from 'react';
import { History, Trash2, Calendar, FileText, Link2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { getHistory, clearHistory, AnalysisResult } from '../utils/historyStorage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setHistory(data);
  };

  const handleClearHistory = () => {
    clearHistory();
    loadHistory();
  };

  if (history.length === 0) {
    return (
      <Card className="p-12 text-center">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-gray-900 mb-2">No Analysis History</h3>
        <p className="text-gray-600">
          Your analyzed news articles will appear here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-900">Analysis History</h2>
          <p className="text-sm text-gray-600 mt-1">
            {history.length} {history.length === 1 ? 'analysis' : 'analyses'} performed
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear History
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Analysis History?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your analysis history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearHistory} className="bg-red-600 hover:bg-red-700">
                Clear History
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-4">
        {history.map((item, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {item.inputType === 'text' ? (
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  ) : (
                    <Link2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 break-words">
                      {item.content.length > 150 
                        ? item.content.substring(0, 150) + '...' 
                        : item.content}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {new Date(item.timestamp).toLocaleString()}
              </div>

              {/* Results */}
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                {/* Random Forest Result */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Random Forest</span>
                    <Badge
                      variant={item.randomForest.prediction === 'Reliable' ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {item.randomForest.prediction}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Confidence: {item.randomForest.confidence}%
                  </div>
                </div>

                {/* Logistic Regression Result */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Logistic Regression</span>
                    <Badge
                      variant={item.logisticRegression.prediction === 'Reliable' ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {item.logisticRegression.prediction}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Confidence: {item.logisticRegression.confidence}%
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
