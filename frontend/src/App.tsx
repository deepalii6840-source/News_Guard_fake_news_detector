import { useState } from 'react';
import { Shield, History, GitCompare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import AnalysisPage from './components/AnalysisPage';
import HistoryPage from './components/HistoryPage';
import ComparisonPage from './components/ComparisonPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('analysis');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-gray-900">NEWS GUARD</h1>
              <p className="text-sm text-gray-600">Advanced Fake News Detection System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <GitCompare className="w-4 h-4" />
              Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <AnalysisPage />
          </TabsContent>

          <TabsContent value="history">
            <HistoryPage />
          </TabsContent>

          <TabsContent value="comparison">
            <ComparisonPage />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>Powered by Random Forest Classifier & Logistic Regression with TF-IDF Vectorization</p>
        </div>
      </footer>
    </div>
  );
}
