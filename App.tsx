import React, { useState } from 'react';
import { AppStep, StyleRecommendation, AnalysisOptions } from './types';
import AnalysisStep from './components/AnalysisStep';
import ResultCard from './components/ResultCard';
import { Scissors, User, UserCheck, X } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [result, setResult] = useState<StyleRecommendation | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions | undefined>(undefined);
  
  // Language State for Welcome Screen
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  
  // Gender State for Modal
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female'>('Female');

  const handleAnalysisComplete = (data: StyleRecommendation, image: string | null, options: AnalysisOptions) => {
    setResult(data);
    setUserImage(image);
    setAnalysisOptions(options);
    setStep(AppStep.RESULT);
  };

  const handleReset = () => {
    setResult(null);
    setUserImage(null);
    setAnalysisOptions(undefined);
    setStep(AppStep.WELCOME);
    setShowGenderModal(false);
  };

  const handleStart = () => {
      setShowGenderModal(true);
  };

  const selectGenderAndProceed = (gender: 'Male' | 'Female') => {
      setSelectedGender(gender);
      setShowGenderModal(false);
      setStep(AppStep.ANALYSIS);
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.WELCOME:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in relative z-10">
            {/* Language Toggle */}
            <div className="absolute top-6 right-6 flex bg-slate-200 p-1 rounded-full shadow-inner">
                <button 
                    onClick={() => setLang('ko')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'ko' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    KO
                </button>
                <button 
                    onClick={() => setLang('en')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    EN
                </button>
            </div>

            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <Scissors className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">SafeCut AI</h1>
            <p className="text-lg text-slate-600 mb-8 font-light">
              {lang === 'ko' ? (
                  <>
                    나에게 딱 맞는 헤어스타일,<br/>
                    AI가 미리 찾아드립니다.<br/>
                    <span className="font-bold text-primary">스마트한 헤어 시뮬레이션</span>
                  </>
              ) : (
                  <>
                    Find your perfect hairstyle<br/>
                    before you cut.<br/>
                    <span className="font-bold text-primary">Smart Hair Simulation</span>
                  </>
              )}
            </p>
            <button
              onClick={handleStart}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-transform"
            >
              {lang === 'ko' ? "거울 보고 시작하기" : "Start with Camera"}
            </button>
          </div>
        );
      case AppStep.ANALYSIS:
        return <AnalysisStep onComplete={handleAnalysisComplete} lang={lang} gender={selectedGender} />;
      case AppStep.RESULT:
        return result && (
            <ResultCard 
                recommendations={result} 
                userImage={userImage} 
                onSelect={handleReset} 
                options={analysisOptions}
                lang={lang} 
            />
        );
      default:
        return null;
    }
  };

  return (
    // Main app container
    <div className="max-w-md mx-auto h-full bg-slate-50 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 z-10">
        <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
        />
      </div>
      
      {renderContent()}

      {/* Liquid Glass Gender Selection Modal */}
      {showGenderModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fade-in">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col items-center relative">
                  <button 
                      onClick={() => setShowGenderModal(false)}
                      className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
                  >
                      <X className="w-6 h-6" />
                  </button>

                  <h2 className="text-2xl font-bold text-white mb-2">{lang === 'ko' ? "성별 선택" : "Select Gender"}</h2>
                  <p className="text-white/60 text-sm mb-8 text-center">{lang === 'ko' ? "정확한 AI 분석을 위해 선택해주세요." : "Please select for accurate AI analysis."}</p>

                  <div className="w-full space-y-4">
                      <button 
                          onClick={() => selectGenderAndProceed('Female')}
                          className="w-full h-16 rounded-2xl bg-gradient-to-r from-orange-500/80 to-pink-500/80 hover:from-orange-500 hover:to-pink-500 border border-white/20 shadow-lg flex items-center justify-center space-x-3 text-white font-bold text-lg active:scale-95 transition-all"
                      >
                          <User className="w-6 h-6" />
                          <span>{lang === 'ko' ? "여성 (Female)" : "Female"}</span>
                      </button>

                      <button 
                          onClick={() => selectGenderAndProceed('Male')}
                          className="w-full h-16 rounded-2xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 border border-white/20 shadow-lg flex items-center justify-center space-x-3 text-white font-bold text-lg active:scale-95 transition-all"
                      >
                          <UserCheck className="w-6 h-6" />
                          <span>{lang === 'ko' ? "남성 (Male)" : "Male"}</span>
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;