'use client';

import React from 'react';
import { Menu, Home, ArrowLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PageProps {
  setCurrentPage: (page: 'main' | 'leaf') => void;
}

const MainPage: React.FC<PageProps> = ({ setCurrentPage }) => {
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');

  const handleSend = async () => {
    if (!question.trim()) {
      alert('Please type project details here...');
      return;
    }
    
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          imageUrl: 'YOUR_IMAGE_URL' // If you have an image to process
        })
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
      // Update the answer text area with the response
      setAnswer(data.text || JSON.stringify(data, null, 2));
      
    } catch (error) {
      console.error('Error:', error);
      setAnswer('Error: Failed to get response from server');
    }
  };

  return (
    <div className="min-h-screen bg-blue-500">
      {/* Menubar section remains the same */}
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-white font-roboto">
          My home improvement need:
        </h1>
        
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-4 border rounded-xl bg-white"
              style={{
                minHeight: '160px',
                width: '50ch',
                fontSize: '16px',
                fontFamily: 'Roboto, sans-serif',
              }}
              placeholder="Type question here..."
            />
  
            <button
              onClick={handleSend}
              className="bg-white text-blue-500 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 font-roboto text-base w-32 mx-auto shadow-lg"
            >
              Submit
            </button>
          </div>
                  
          <div className="mt-8">
            <textarea 
              value={answer}
              className="w-full p-6 border rounded-xl shadow-lg min-h-[160px] focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent hover:border-gray-300 transition-colors font-roboto text-base bg-white"
              placeholder="Answer will appear here..."
              style={{ width: '50ch' }}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// LeafPage component remains unchanged but should be updated with similar styling
const LeafPage: React.FC<PageProps> = ({ setCurrentPage }) => (
  <div className="min-h-screen bg-blue-500 p-8">
    <div className="max-w-4xl mx-auto space-y-8">
      <img 
        src="/api/placeholder/400/400"
        alt="Leaf"
        className="mx-auto rounded-xl shadow-lg"
      />
      
      <div className="text-center">
        <button
          onClick={() => setCurrentPage('main')}
          className="inline-flex items-center space-x-2 bg-white text-blue-500 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors font-roboto text-base shadow-lg"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Return</span>
        </button>
      </div>
    </div>
  </div>
);

export default function Page() {
  const [currentPage, setCurrentPage] = React.useState<'main' | 'leaf'>('main');
  return currentPage === 'main' ? 
    <MainPage setCurrentPage={setCurrentPage} /> : 
    <LeafPage setCurrentPage={setCurrentPage} />;
}