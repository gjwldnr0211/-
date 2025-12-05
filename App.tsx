import React, { useState, useEffect } from 'react';
import { AppStep, StyleRecommendation, AnalysisOptions } from './types';
import AnalysisStep from './components/AnalysisStep';
import ResultCard from './components/ResultCard';
import { Scissors, User, UserCheck, X, Lock, Gift, Sparkles, MessageCircle, ShieldCheck, FileText, Check } from 'lucide-react';
import { playSound } from './utils/audio';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [result, setResult] = useState<StyleRecommendation | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions | undefined>(undefined);
  
  // Language State for Welcome Screen
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const isEn = lang === 'en';
  
  // Modals State
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female'>('Female');

  // Usage Limit State
  const [usageCount, setUsageCount] = useState(0);
  const [extraCredits, setExtraCredits] = useState(0);
  const [showLimitModal, setShowLimitModal] = useState(false);

  // CHANGED: Daily limit updated to 2
  const MAX_DAILY_LIMIT = 2;

  useEffect(() => {
    // Initialize Usage Stats from LocalStorage
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('safecut_date');
    const storedCount = localStorage.getItem('safecut_usage');
    const storedCredits = localStorage.getItem('safecut_credits');

    if (storedDate !== today) {
        // Reset if new day
        localStorage.setItem('safecut_date', today);
        localStorage.setItem('safecut_usage', '0');
        setUsageCount(0);
    } else {
        setUsageCount(parseInt(storedCount || '0', 10));
    }

    if (storedCredits) {
        setExtraCredits(parseInt(storedCredits, 10));
    }
  }, []);

  const checkUsageLimit = (): boolean => {
      // Strict check: If usage meets or exceeds limit, BLOCK immediately.
      if (usageCount < (MAX_DAILY_LIMIT + extraCredits)) {
          return true;
      }
      playSound('hover'); // Warning sound
      setShowLimitModal(true);
      return false;
  };

  const incrementUsage = () => {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('safecut_usage', newCount.toString());
  };

  const handleInviteFriend = () => {
      playSound('click');
      // Updated Message: Longer, persuasive, and safety-focused (approx 150 chars)
      const shareData = {
          title: 'SafeCut AI',
          text: isEn 
            ? "Wait! Are you heading to the salon? ✋ Don't risk expensive haircuts you might regret! 💸 Try SafeCut AI first to simulate your perfect look. Find your life-changing style in seconds. Test it now before you cut! 👇 #SafeCutAI" 
            : "미용실 가기 전 필수! ✋ 설마 그냥 가시는 건 아니죠? 💸 비싼 돈 주고 머리 망하면 복구도 힘들잖아요. S컬 C컬 구구절절 설명할 필요 없이 디자이너에게 보여주기만 하면 끝! ✂️ 실패 없는 스타일 변신, 지금 바로 시뮬레이션 해보고 안전하게 미용실 가세요! 👇 #SafeCutAI",
          url: window.location.href
      };

      if (navigator.share) {
          navigator.share(shareData)
              .then(() => {
                  grantCredits();
              })
              .catch((e) => {
                  console.log('Share cancelled', e);
                  // 낙관적 UI: 공유 창을 열었다가 취소해도 의도를 인정하여 크레딧 지급 (UX friction 감소)
                  grantCredits(); 
              });
      } else {
          // Fallback for desktop
          navigator.clipboard.writeText(window.location.href);
          alert(isEn ? "Link copied! Send it to a friend." : "초대 링크가 복사되었습니다! 친구에게 붙여넣기 해주세요.");
          grantCredits();
      }
  };

  const grantCredits = () => {
      // Grant +3 credits
      const newCredits = extraCredits + 3;
      setExtraCredits(newCredits);
      localStorage.setItem('safecut_credits', newCredits.toString());
      playSound('success');
      
      // ADDED: Visible notification for the user
      // CHANGED: Removed "Free" wording
      alert(isEn ? "Invitation successful! +3 credits added." : "초대 완료! 🎉\n이용권 3회가 즉시 추가되었습니다.");

      setShowLimitModal(false);
  };

  const handleAnalysisComplete = (data: StyleRecommendation, image: string | null, options: AnalysisOptions) => {
    incrementUsage(); // Deduct credit on success
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
    setShowPrivacyModal(false);
  };

  const handleStart = () => {
      // Show Privacy Modal FIRST
      setShowPrivacyModal(true);
  };

  const handlePrivacyAgree = () => {
      playSound('click');
      setShowPrivacyModal(false);
      setShowGenderModal(true);
  };

  const selectGenderAndProceed = (gender: 'Male' | 'Female') => {
      setSelectedGender(gender);
      setShowGenderModal(false);
      setStep(AppStep.ANALYSIS);
  };

  const renderContent = () => {
    // Calculate remaining (prevent negative numbers)
    const remaining = Math.max(0, (MAX_DAILY_LIMIT + extraCredits) - usageCount);

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
            
            {/* Usage Badge */}
            <div className="mb-6 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-slate-600">
                     {/* CHANGED: Removed "Free" wording */}
                    {isEn ? `Credits Left: ${remaining}` : `남은 횟수: ${remaining}회`}
                </span>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-transform"
            >
              {lang === 'ko' ? "거울 보고 시작하기" : "Start with Camera"}
            </button>
          </div>
        );
      case AppStep.ANALYSIS:
        return (
            <AnalysisStep 
                onComplete={handleAnalysisComplete} 
                lang={lang} 
                gender={selectedGender} 
                onHome={handleReset} 
                checkLimit={checkUsageLimit}
            />
        );
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

      {/* 1. Privacy Consent Modal (First Step) */}
      {showPrivacyModal && (
          <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center relative max-h-[90vh] overflow-y-auto">
                  
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-400/30">
                      <ShieldCheck className="w-8 h-8 text-blue-300" />
                  </div>

                  <h2 className="text-xl font-bold text-white mb-4 text-center">
                      {isEn ? "Privacy & Usage Agreement" : "개인정보 수집 및 이용 동의"}
                  </h2>

                  <div className="w-full bg-black/20 rounded-xl p-4 mb-6 border border-white/5 space-y-3">
                      <div className="flex gap-3">
                          <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-300 leading-relaxed text-left">
                              <span className="text-white font-bold block mb-0.5">
                                  {isEn ? "1. Face Data Collection" : "1. 얼굴 데이터 수집"}
                              </span>
                              {isEn 
                                ? "We collect your photo solely to analyze face shape and generate hairstyle simulations." 
                                : "헤어스타일 시뮬레이션을 위해 사용자의 얼굴이 포함된 사진을 사용합니다."}
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-300 leading-relaxed text-left">
                              <span className="text-white font-bold block mb-0.5">
                                  {isEn ? "2. No Server Storage" : "2. 서버 저장 안 함 (즉시 파기)"}
                              </span>
                              {isEn 
                                ? "Your photos are processed in real-time and deleted immediately. We do NOT store your face data." 
                                : "업로드된 사진은 분석 후 즉시 삭제되며, 서버에 절대 저장되지 않습니다."}
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="text-xs text-slate-300 leading-relaxed text-left">
                              <span className="text-white font-bold block mb-0.5">
                                  {isEn ? "3. Third-Party Processing" : "3. 처리 위탁"}
                              </span>
                              {isEn 
                                ? "Data is processed via Google Gemini API for AI generation only." 
                                : "AI 생성을 위해 Google Gemini API를 통해 데이터가 처리됩니다."}
                          </div>
                      </div>
                  </div>

                  <button 
                      onClick={handlePrivacyAgree}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                      <FileText className="w-5 h-5" />
                      <span>{isEn ? "Agree & Continue" : "동의하고 시작하기"}</span>
                  </button>

                  <button 
                      onClick={() => setShowPrivacyModal(false)}
                      className="mt-4 text-white/40 text-xs underline hover:text-white"
                  >
                      {isEn ? "Cancel" : "취소"}
                  </button>
              </div>
          </div>
      )}

      {/* 2. Gender Selection Modal (Second Step) */}
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

      {/* LIMIT REACHED / INVITE MODAL - LIQUID GLASS STYLE */}
      {showLimitModal && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-fade-in">
               <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex flex-col items-center text-center relative overflow-hidden">
                    
                    {/* Decorative Glow */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/30 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl pointer-events-none"></div>

                    <button 
                        onClick={() => setShowLimitModal(false)}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20 relative shadow-inner">
                        <Lock className="w-10 h-10 text-orange-200" />
                        <div className="absolute top-0 right-0 bg-red-500 w-5 h-5 rounded-full border-2 border-slate-900 shadow-md"></div>
                    </div>

                     {/* CHANGED: Removed "Free" wording */}
                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                        {isEn ? "Daily Limit Reached" : "오늘 이용 횟수 마감"}
                    </h2>
                    <p className="text-white/70 text-sm mb-8 leading-relaxed">
                         {/* CHANGED: Removed "Free" wording */}
                        {isEn ? 
                            "Invite a friend and get +3 credits instantly!" : 
                            "친구에게 소개하고\n+3회 추가 이용권을 바로 받으세요!"}
                    </p>

                    {/* Kakao Style Button */}
                    <button 
                        onClick={handleInviteFriend}
                        className="w-full py-4 bg-[#FEE500] hover:bg-[#FDD835] rounded-2xl text-[#3C1E1E] font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 relative z-10"
                    >
                        <MessageCircle className="w-6 h-6 fill-[#3C1E1E]" />
                        <span>{isEn ? "Invite via KakaoTalk" : "카카오톡으로 초대하기"}</span>
                    </button>
                    
                    <div className="mt-4 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-pink-400" />
                        <p className="text-[11px] text-pink-200">
                            {isEn ? "Reward applied immediately after sharing" : "공유만 해도 즉시 지급됩니다"}
                        </p>
                    </div>
               </div>
          </div>
      )}
    </div>
  );
};

export default App;