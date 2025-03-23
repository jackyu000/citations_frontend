'use client';

import { useState } from 'react';

export default function Home() {
  const [hypothesis, setHypothesis] = useState('');
  const [subject, setSubject] = useState('Physics');
  
  const handleSubmit = async () => {
    try {
      const response = await fetch('https://webhook.site/your-webhook-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hypothesis,
          subject,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Clear the hypothesis field after successful submission
      setHypothesis('');
      alert('Hypothesis submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting hypothesis:', error);
      alert('Error submitting hypothesis. Please try again.');
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
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleSubmit}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
