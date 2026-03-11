import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, AlertCircle, ChevronRight, GraduationCap } from 'lucide-react';
import api from '../api';

const HomePage = () => {
  const [problemStatements, setProblemStatements] = useState([]);
  const [teamNumber, setTeamNumber] = useState('');
  const [teamName, setTeamName] = useState('');
  const [selectedPS, setSelectedPS] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPS = async () => {
      try {
        const { data } = await api.get('/problem-statements');
        setProblemStatements(data);
      } catch (err) {
        console.error('Error fetching statements', err);
      }
    };
    fetchPS();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPS) {
      setError('Please select a problem statement before submitting.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.post('/submissions', {
        teamNumber,
        teamName,
        psNumber: selectedPS.psNumber,
        psTitle: selectedPS.title,
      });
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Error completing submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTeamNumber('');
    setTeamName('');
    setSelectedPS(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col items-center justify-center mb-16 pt-8 space-y-4 text-center">
          {/* Logos */}
          <div className="flex justify-center items-center space-x-8 mb-6 animate-fade-in-up">
            <img src="/logos/klu.png" alt="Kalasalingam Academy" className="h-20 md:h-24 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
            <img src="/logos/kare-oss.png" alt="KARE OSS" className="h-20 md:h-24 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
            <img src="/logos/nexoss.png" alt="NEXOSS" className="h-20 md:h-24 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 flex flex-col items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 pb-2">
              WONDERS OF AI 3.0
            </span>
            <span className="text-2xl md:text-3xl text-gray-300 mt-2 font-light">
              PS Dashboard
            </span>
          </h1>
        </header>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto bg-[#0f1524]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative">
          
          {error && (
            <div className="mb-8 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl flex items-center shadow-lg">
              <AlertCircle className="mr-3" size={24} />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Team Info Section */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <h2 className="text-2xl font-bold">Team Details</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Team Number (ID)</label>
                  <input
                    type="text"
                    required
                    value={teamNumber}
                    onChange={(e) => setTeamNumber(e.target.value)}
                    className="w-full bg-[#1a2333]/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                    placeholder="e.g. T-1042"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-[#1a2333]/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                    placeholder="Enter your registered team name"
                  />
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Problem Statements Section */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <h2 className="text-2xl font-bold">Select Problem Statement</h2>
              </div>
              
              <div className="space-y-4">
                {problemStatements.length === 0 ? (
                  <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-2xl bg-[#1a2333]/30">
                    <p className="text-gray-400 text-lg">Problem statements are not yet available. Please check back later.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {problemStatements.map((ps) => {
                      const isSelected = selectedPS?._id === ps._id;
                      const isFull = ps.selectedCount >= 4;
                      
                      return (
                        <div 
                          key={ps._id}
                          className={`relative overflow-hidden border rounded-2xl p-6 transition-all duration-300 group ${
                            isFull
                              ? 'bg-[#1a2333]/20 border-red-500/20 opacity-75 cursor-not-allowed'
                              : isSelected 
                                ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)] transform md:-translate-y-1 cursor-pointer' 
                                : 'bg-[#1a2333]/40 border-white/5 hover:bg-[#1a2333]/80 hover:border-white/20 cursor-pointer'
                          }`}
                          onClick={() => {
                            if (!isFull) setSelectedPS(ps);
                          }}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex-1">
                              <div className="flex items-start space-x-4">
                                <span className={`shrink-0 inline-flex items-center justify-center font-bold px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                                  isSelected 
                                    ? 'bg-blue-500 text-white border-blue-400 shadow-md' 
                                    : 'bg-[#0b0f19] text-gray-300 border-white/10 group-hover:bg-[#1a2333]'
                                }`}>
                                  {ps.psNumber}
                                </span>
                                <div>
                                  <h3 className={`text-xl font-bold mb-2 transition-colors ${isSelected ? 'text-blue-100' : 'text-white'}`}>
                                    {ps.title}
                                  </h3>
                                  <p className="text-gray-400 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                                    {ps.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="shrink-0 flex justify-end">
                              <button
                                type="button"
                                disabled={isFull}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                  isFull
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    : isSelected 
                                      ? 'bg-blue-500 text-white shadow-lg' 
                                      : 'bg-[#0b0f19] text-gray-400 border border-white/10 hover:text-white hover:border-white/30'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isFull) setSelectedPS(ps);
                                }}
                              >
                                {isFull ? (
                                  <>
                                    <AlertCircle size={20} />
                                    <span>Full (4/4 Teams)</span>
                                  </>
                                ) : isSelected ? (
                                  <>
                                    <CheckCircle size={20} />
                                    <span>Selected</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Select PS</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          {/* Selection indicator background highlight */}
                          {isSelected && (
                            <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-blue-500/10 to-transparent"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </section>

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading || problemStatements.length === 0}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg py-5 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-[0_10px_40px_-10px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:filter-none disabled:transform-none"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-[30deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                {loading ? 'Processing Submission...' : 'Confirm Final Submission'}
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">
                By confirming, you lock in your choice for WONDERS OF AI 3.0
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f1524] border border-blue-500/30 rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="text-green-500" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
            <p className="text-gray-300 text-lg mb-8">
              Your submission has been recorded successfully. Good luck with the hackathon!
            </p>
            <div className="bg-[#1a2333]/50 border border-white/5 rounded-xl p-4 mb-8 text-left space-y-2">
              <p className="text-sm text-gray-400">Team: <span className="text-white font-medium ml-2">{teamName}</span></p>
              <p className="text-sm text-gray-400">Selected PS: <span className="text-blue-400 font-bold ml-2">{selectedPS?.psNumber}</span></p>
            </div>
            <button
              onClick={closeModal}
              className="w-full bg-[#1a2333] hover:bg-[#1e293b] text-white font-semibold py-3 flex-1 rounded-xl transition-colors border border-white/10"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
