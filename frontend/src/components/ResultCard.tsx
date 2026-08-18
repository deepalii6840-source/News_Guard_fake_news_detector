import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface AlgorithmResult {
  prediction: 'Reliable' | 'Unreliable';
  reliableProbability: number;
  unreliableProbability: number;
  confidence: number;
}

interface ResultCardProps {
  algorithm: string;
  description: string;
  result: AlgorithmResult;
}

export default function ResultCard({ algorithm, description, result }: ResultCardProps) {
  const isReliable = result.prediction === 'Reliable';

  return (
    <Card className="p-6 border-2">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-900 flex items-center gap-2">
              {algorithm}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <Badge
            variant={isReliable ? "default" : "destructive"}
            className="px-4 py-1.5"
          >
            {result.prediction}
          </Badge>
        </div>

        {/* Prediction Result */}
        <div className={`p-6 rounded-lg border-2 ${
          isReliable 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {isReliable ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
            <div>
              <h4 className={`${isReliable ? 'text-green-900' : 'text-red-900'}`}>
                News Classified as {result.prediction}
              </h4>
              <p className={`text-sm ${isReliable ? 'text-green-700' : 'text-red-700'}`}>
                Confidence Level: {result.confidence}%
              </p>
            </div>
          </div>
        </div>

        {/* Probability Scores */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <h4 className="text-gray-900">Probability Scores</h4>
          </div>

          {/* Reliable Probability */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Reliable</span>
              <span className="text-green-600">{result.reliableProbability.toFixed(2)}%</span>
            </div>
            <Progress 
              value={result.reliableProbability} 
              className="h-3 bg-gray-200"
              indicatorClassName="bg-gradient-to-r from-green-500 to-green-600"
            />
          </div>

          {/* Unreliable Probability */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Unreliable</span>
              <span className="text-red-600">{result.unreliableProbability.toFixed(2)}%</span>
            </div>
            <Progress 
              value={result.unreliableProbability} 
              className="h-3 bg-gray-200"
              indicatorClassName="bg-gradient-to-r from-red-500 to-red-600"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
