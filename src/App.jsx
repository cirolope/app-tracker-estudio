import { useState, useEffect } from 'react';
import Timer from './components/Timer';
import MasteryBar from './components/MasteryBar';
import FlashcardsDeck from './components/FlashcardsDeck';
import ExamEngine from './components/ExamEngine';
import studyData from './data.json';
import './index.css';

// 4 sessions of 15 min each
const POMODORO_SESSIONS = 4;
const SESSION_DURATION_MINUTES = 15;
const REST_DURATION_MINUTES = 15;

function App() {
  const [currentSession, setCurrentSession] = useState(() => {
    const saved = localStorage.getItem('study_currentSession');
    return saved !== null ? Number(saved) : 1;
  });
  const [isResting, setIsResting] = useState(() => {
    const saved = localStorage.getItem('study_isResting');
    return saved !== null ? saved === 'true' : false;
  });
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('study_mode') || 'study';
  });
  const [masteryProgress, setMasteryProgress] = useState(() => {
    const saved = localStorage.getItem('study_masteryProgress');
    return saved !== null ? Number(saved) : 0;
  });
  const [accumulatedMinutes, setAccumulatedMinutes] = useState(() => {
    const saved = localStorage.getItem('study_accumulatedMinutes');
    return saved !== null ? Number(saved) : 0;
  });
  const [currentTip, setCurrentTip] = useState(null);

  useEffect(() => {
    localStorage.setItem('study_currentSession', currentSession);
    localStorage.setItem('study_isResting', isResting);
    localStorage.setItem('study_mode', mode);
    localStorage.setItem('study_masteryProgress', masteryProgress);
    localStorage.setItem('study_accumulatedMinutes', accumulatedMinutes);
  }, [currentSession, isResting, mode, masteryProgress, accumulatedMinutes]);

  // Handle completion of a 15 min study session
  const handleSessionComplete = () => {
    setAccumulatedMinutes(prev => prev + SESSION_DURATION_MINUTES);

    if (currentSession < POMODORO_SESSIONS) {
      // Small progress bump just for studying
      updateMastery(5);

      const tips = studyData.study_methodology.study_tips;
      setCurrentTip(tips[Math.floor(Math.random() * tips.length)]);
    } else {
      // 4 sessions done (1 hour), trigger rigorous Exam!
      setMode('exam');
    }
  };

  const handleNextSession = () => {
    setCurrentSession(prev => prev + 1);
    setCurrentTip(null);
  };

  // Handle completion of the exam
  const handleExamComplete = (scorePercentage) => {
    // Increase mastery based on exam performance
    const masteryGain = Math.floor(scorePercentage * 0.2); // Up to 20% gain per exam
    updateMastery(masteryGain);

    // Switch to Rest Mode!
    setMode('rest');
    setIsResting(true);
  };

  // Handle completion of the rest period (15m)
  const handleRestComplete = () => {
    setIsResting(false);
    setCurrentSession(1);
    setMode('study');
  };

  const updateMastery = (amount) => {
    setMasteryProgress(prev => Math.min(100, prev + amount));
  };

  return (
    <div className="glass-panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', margin: 0 }}>Aerodinámica</h1>
          <p style={{ fontSize: '18px', marginTop: '4px' }}>
            {mode === 'rest' ? 'Descanso Reconstructivo' :
              mode === 'exam' ? 'Evaluación Formativa' :
                `Sesión de Estudio ${currentSession}/${POMODORO_SESSIONS}`}
          </p>
        </div>
        <div style={{ width: '300px' }}>
          <MasteryBar progress={masteryProgress} />
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className="animate-fade-in">

        {mode === 'study' && !currentTip && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', flex: '0 0 300px' }}>
              <Timer
                minutes={SESSION_DURATION_MINUTES}
                onComplete={handleSessionComplete}
                isActive={!isResting && mode === 'study' && !currentTip}
                title={`Sesión ${currentSession}`}
                size={240}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <FlashcardsDeck cards={studyData.flashcards} />
            </div>
          </div>
        )}

        {mode === 'study' && currentTip && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '32px' }}>
            <h2 style={{ color: 'var(--success-color)', fontSize: '32px' }}>¡Sesión Completada! 🎉</h2>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '32px', borderRadius: '16px', maxWidth: '600px', textAlign: 'center', border: 'var(--glass-border)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Consejo de Estudio</p>
              <p style={{ color: 'var(--text-primary)', fontSize: '24px', lineHeight: 1.5, fontWeight: '500' }}>"{currentTip}"</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>Tiempo total estudiado:</p>
              <p style={{ fontSize: '36px', color: 'var(--accent-color)', fontWeight: 'bold', marginTop: '8px' }}>
                {Math.floor(accumulatedMinutes / 60)}h {accumulatedMinutes % 60}m
              </p>
            </div>

            <button className="btn-primary" style={{ width: 'auto', padding: '16px 48px', fontSize: '18px', marginTop: '16px', borderRadius: '32px' }} onClick={handleNextSession}>
              Comenzar Siguiente Sesión
            </button>
          </div>
        )}

        {mode === 'exam' && (
          <ExamEngine
            questions={studyData.exam_questions}
            onComplete={handleExamComplete}
          />
        )}

        {mode === 'rest' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
            <Timer
              minutes={REST_DURATION_MINUTES}
              onComplete={handleRestComplete}
              isActive={isResting}
              title="Descanso"
            />
            <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--success-color)' }}>
              El reposo es crucial para consolidar la memoria. Relájate.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}

export default App
