
import React, { useState } from 'react';

interface FastaCardProps {
  sequence: string;
}

const FastaCard: React.FC<FastaCardProps> = ({ sequence }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sequence);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          FASTA Sequence
        </h3>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-base font-black transition-all ${
            copied 
              ? 'bg-green-100 text-green-700' 
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm active:scale-95'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Copied to Clipboard
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Sequence
            </>
          )}
        </button>
      </div>
      <div className="p-10 bg-slate-900">
        <pre className="mono text-2xl md:text-3xl font-bold tracking-tight leading-[1.6] text-blue-300 overflow-x-auto whitespace-pre-wrap max-h-[800px] scrollbar-thin">
          {sequence}
        </pre>
      </div>
    </div>
  );
};

export default FastaCard;
