
import React, { useState, useEffect, useCallback } from 'react';
import { fetchProteinData } from './services/pdbService';
import { ProteinData } from './types';
import FastaCard from './components/FastaCard';

const App: React.FC = () => {
  const [searchId, setSearchId] = useState('4HHB');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProteinData | null>(null);

  const performSearch = useCallback(async (id: string) => {
    const cleanId = id.trim().toUpperCase();
    if (!cleanId || cleanId.length !== 4) {
      setError('PDB ID must be exactly 4 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchProteinData(cleanId);
      setData(result);
    } catch (err: any) {
      console.error('Search error:', err);
      if (err.message.includes('Network error')) {
        setError('Network Connection Failed. The RCSB PDB API may be blocked by browser settings or a firewall. Please try another PDB ID.');
      } else {
        setError(err.message || 'An unexpected error occurred while fetching PDB data.');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchId);
  };

  useEffect(() => {
    performSearch('4HHB');
  }, [performSearch]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-32">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter hidden sm:block">ProteinExplorer</h1>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl relative group">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              placeholder="Enter PDB ID (e.g. 1JWP)"
              maxLength={4}
              className="w-full bg-slate-100 border border-transparent rounded-[24px] px-8 py-5 text-xl font-bold focus:bg-white focus:ring-8 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2.5 top-2.5 bottom-2.5 bg-blue-600 text-white px-8 rounded-2xl text-lg font-black hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? '...' : 'Search'}
            </button>
          </form>
          
          <div className="hidden lg:flex items-center gap-4 text-base font-black text-slate-400 uppercase tracking-widest">
            BIO-DATABASE
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 pb-20">
        {error && (
          <div className="bg-white border-4 border-red-50 p-12 rounded-[48px] shadow-sm text-center max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Request Denied</h3>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed px-10">{error}</p>
            <button 
              onClick={() => performSearch(searchId)}
              className="px-10 py-5 bg-blue-600 text-white rounded-3xl text-xl font-black hover:bg-blue-700 transition-all active:scale-95 shadow-2xl shadow-blue-100"
            >
              Retry Protocol
            </button>
          </div>
        )}

        {loading && (
          <div className="space-y-10 animate-pulse">
            <div className="h-64 bg-white rounded-[48px] border border-slate-200 shadow-sm" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white rounded-[32px] border border-slate-200 shadow-sm" />)}
            </div>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Main Information */}
            <div className="bg-white rounded-[48px] p-12 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-4 h-full bg-blue-600"></div>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-5 mb-6">
                    <span className="inline-flex px-5 py-2 bg-blue-600 text-white text-sm font-black rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
                      ID: {data.entry.rcsb_id}
                    </span>
                    <span className="text-sm text-slate-400 font-black uppercase tracking-[0.4em]">Structure Profile</span>
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tighter">{data.entry.struct.title}</h2>
                  <div className="flex flex-wrap gap-4">
                    <span className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest">{data.entry.exptl[0]?.method || 'Experimental'}</span>
                    <span className="bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest">{data.entry.rcsb_entry_info.polymer_entity_count} Unique Polymers</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center lg:items-end p-10 bg-slate-50 rounded-[40px] border border-slate-100 min-w-[220px] shadow-inner">
                  <div className="text-sm text-slate-400 font-black uppercase tracking-[0.2em] mb-3">Resolution</div>
                  <div className="text-6xl font-mono font-black text-blue-600 tracking-tighter">
                    {data.entry.rcsb_entry_info.resolution_combined?.[0] 
                      ? `${data.entry.rcsb_entry_info.resolution_combined[0]}Å` 
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Entity List */}
            <div className="space-y-10">
              <div className="flex items-center gap-6">
                <h3 className="text-3xl font-black text-slate-800">Molecular Components</h3>
                <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.entities.map((entity) => (
                  <div key={entity.rcsb_id} className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm hover:border-blue-400 transition-all hover:shadow-xl group">
                    <div className="flex justify-between items-start gap-8 mb-6">
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 text-2xl leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                          {entity.rcsb_polymer_entity.pdbx_description}
                        </h4>
                        <div className="text-lg text-slate-500 font-bold flex items-center gap-3">
                          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {entity.rcsb_entity_source_organism?.[0]?.scientific_name || 'Organism Unspecified'}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end min-w-[80px]">
                        {entity.rcsb_polymer_entity_container_identifiers.auth_asym_ids.map(id => (
                          <span key={id} className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-sm font-black border border-blue-500 shadow-lg shadow-blue-100">
                            {id}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sequence Display */}
            <FastaCard sequence={data.fasta} />
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-200 py-6 z-40">
        <div className="max-w-7xl mx-auto px-10 flex justify-between items-center text-xs font-black uppercase tracking-[0.5em] text-slate-400">
          <span>&copy; {new Date().getFullYear()} Molecular Dynamics Laboratory</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'} animate-pulse shadow-lg`}></span>
              {error ? 'Protocol Offline' : 'RCSB Link Active'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
