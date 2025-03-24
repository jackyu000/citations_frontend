'use client';
import { useState } from 'react';

export default function Home() {
  const [hypothesis, setHypothesis] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  const [pollingStatus, setPollingStatus] = useState('');

  // Function to poll for run status
  const pollRunStatus = async (id: string) => {
    try {
      setPollingStatus('Checking run status...');
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ runId: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to check run status');
      }

      const data = await response.json();
      const runData = data.result;
      
      console.log('Poll response:', runData);
      
      if (runData.status === 'completed') {
        setResult(runData);
        setRunId(null);
        setLoading(false);
        setPollingStatus('');
      } else if (runData.status === 'failed') {
        throw new Error('Run failed: ' + (runData.error || 'Unknown error'));
      } else {
        // Still in progress, poll again after a delay
        setPollingStatus(`Run in progress (${runData.status})...`);
        setTimeout(() => pollRunStatus(id), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setRunId(null);
      setLoading(false);
      setPollingStatus('');
    }
  };

  const handleValidate = async () => {
    if (!hypothesis.trim()) {
      setError('Please enter a hypothesis');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    setPollingStatus('Starting analysis...');

    try {
      // Create a new run
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hypothesis, subject }),
      });

      if (!response.ok) {
        throw new Error('Failed to start analysis');
      }

      const data = await response.json();
      console.log('Initial run data:', data);
      
      const newRunId = data.result.id;
      setRunId(newRunId);
      
      // Start polling for status
      pollRunStatus(newRunId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
      setPollingStatus('');
    }
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#b31b1b] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">RipUrPaper</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-1 text-white hover:bg-[#a31919]">Donate</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <p className="text-sm mb-4">
            RipUrPaper is a hypothesis validation tool that searches through open-access archive for nearly 2.4 million scholarly articles
            in the fields of physics, mathematics, computer science, quantitative biology, quantitative finance,
            statistics, electrical engineering and systems science, and economics.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Input Your Hypothesis:</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <select 
                className="border p-2 rounded bg-white w-64"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option>Physics</option>
                <option>Mathematics</option>
                <option>Quantitative Biology</option>
                <option>Computer Science</option>
                <option>Quantitative Finance</option>
                <option>Statistics</option>
                <option>Electrical Engineering and Systems Science</option>
                <option>Economics</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="border p-2 rounded w-[32rem]"
                placeholder="Hypothesis"
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
              />
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={handleValidate}
                disabled={loading}
              >
                {loading ? pollingStatus || 'Processing...' : 'Validate'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-4 p-6 bg-gray-50 rounded border">
                <h3 className="text-lg font-semibold mb-2">Analysis Result:</h3>
                <div className="whitespace-pre-wrap">
                  {result.result || result.output?.content || result.output?.[0]?.content || 'No analysis available'}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
