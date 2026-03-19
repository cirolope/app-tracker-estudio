import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function ExamEngine({ questions, onComplete }) {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(() => {
        const saved = localStorage.getItem('exam_currentQuestionIdx');
        return saved !== null ? Number(saved) : 0;
    });
    const [selectedAnswer, setSelectedAnswer] = useState(() => {
        return localStorage.getItem('exam_selectedAnswer') || null;
    });
    const [isAnswered, setIsAnswered] = useState(() => {
        const saved = localStorage.getItem('exam_isAnswered');
        return saved !== null ? saved === 'true' : false;
    });
    const [score, setScore] = useState(() => {
        const saved = localStorage.getItem('exam_score');
        return saved !== null ? Number(saved) : 0;
    });

    useEffect(() => {
        localStorage.setItem('exam_currentQuestionIdx', currentQuestionIdx);
        localStorage.setItem('exam_selectedAnswer', selectedAnswer || '');
        localStorage.setItem('exam_isAnswered', isAnswered);
        localStorage.setItem('exam_score', score);
    }, [currentQuestionIdx, selectedAnswer, isAnswered, score]);

    const question = questions[currentQuestionIdx];

    const handleSelect = (option) => {
        if (isAnswered) return; // Prevent changing answer after submission
        setSelectedAnswer(option);
    };

    const handleSubmit = () => {
        if (!selectedAnswer) return;

        setIsAnswered(true);
        if (!question.options || question.options.length === 0) {
            // For fill-in text, we score conditionally true if not empty 
            // Real evaluation is subjective/self-graded so we just count it as attempted for now
            setScore(prev => prev + 1);
        } else if (selectedAnswer === question.correct_answer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            // Reset exam state before completing
            localStorage.removeItem('exam_currentQuestionIdx');
            localStorage.removeItem('exam_selectedAnswer');
            localStorage.removeItem('exam_isAnswered');
            localStorage.removeItem('exam_score');

            // Calculate final score percentage
            const scorePercentage = (score / questions.length) * 100;
            onComplete(scorePercentage);
        }
    };

    if (!questions || questions.length === 0) return <p>No hay preguntas disponibles.</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

            <div style={{ marginBottom: '40px' }}>
                <span style={{ fontSize: '18px', color: 'var(--accent-color)', fontWeight: '600' }}>
                    Pregunta {currentQuestionIdx + 1} de {questions.length}
                </span>
                <h3 style={{ marginTop: '16px', fontSize: '26px', lineHeight: 1.5, maxWidth: '800px' }}>
                    <Latex>{question.question}</Latex>
                </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                {question.options && question.options.length > 0 ? (
                    question.options.map((opt, idx) => {
                        let bgColor = 'rgba(255,255,255,0.05)';
                        let borderColor = 'var(--glass-border)';

                        if (isAnswered) {
                            if (opt === question.correct_answer) {
                                bgColor = 'var(--success-color)';
                                borderColor = 'var(--success-color)';
                            } else if (opt === selectedAnswer && opt !== question.correct_answer) {
                                bgColor = 'var(--danger-color)';
                                borderColor = 'var(--danger-color)';
                            }
                        } else if (selectedAnswer === opt) {
                            borderColor = 'var(--accent-color)';
                            bgColor = 'rgba(10, 132, 255, 0.1)';
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleSelect(opt)}
                                style={{
                                    background: bgColor,
                                    border: borderColor,
                                    padding: '24px',
                                    borderRadius: '16px',
                                    color: 'var(--text-primary)',
                                    textAlign: 'left',
                                    fontSize: '18px',
                                    lineHeight: 1.4,
                                    fontWeight: '400',
                                    cursor: isAnswered ? 'default' : 'pointer',
                                    maxWidth: '1000px'
                                }}
                            >
                                <Latex>{opt}</Latex>
                            </button>
                        )
                    })
                ) : (
                    <div style={{ maxWidth: '1000px' }}>
                        <textarea
                            value={selectedAnswer || ''}
                            onChange={(e) => handleSelect(e.target.value)}
                            disabled={isAnswered}
                            placeholder="Desarrolla tu respuesta aquí..."
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                padding: '24px',
                                borderRadius: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: isAnswered ? (selectedAnswer ? '1px solid var(--success-color)' : '1px solid var(--glass-border)') : '1px solid var(--accent-color)',
                                color: 'var(--text-primary)',
                                fontSize: '18px',
                                lineHeight: 1.5,
                                outline: 'none',
                                resize: 'vertical'
                            }}
                        />
                    </div>
                )}
            </div>

            {isAnswered && (
                <div className="animate-fade-in" style={{
                    marginTop: '32px',
                    padding: '24px',
                    backgroundColor: 'rgba(255,159,10,0.1)',
                    borderLeft: '6px solid var(--warning-color)',
                    borderRadius: '12px',
                    maxWidth: '1000px'
                }}>
                    <h4 style={{ color: 'var(--warning-color)', marginBottom: '12px', fontSize: '20px' }}>
                        {(!question.options || question.options.length === 0)
                            ? 'Compará tu desarrollo con la respuesta ideal:'
                            : (selectedAnswer === question.correct_answer ? '¡Correcto!' : 'Incorrecto - La trampa era:')}
                    </h4>
                    {(!question.options || question.options.length === 0) && (
                        <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span style={{ fontWeight: 'bold' }}>Concepto clave esperado: </span>
                            <Latex>{question.correct_answer}</Latex>
                        </div>
                    )}
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        <Latex>{question.explanation}</Latex>
                    </p>
                </div>
            )}

            <div style={{ marginTop: '24px' }}>
                {!isAnswered ? (
                    <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={(!question.options || question.options.length === 0) ? (!selectedAnswer || selectedAnswer.trim() === '') : !selectedAnswer}
                        style={{ opacity: ((!question.options || question.options.length === 0) ? (selectedAnswer && selectedAnswer.trim() !== '') : selectedAnswer) ? 1 : 0.5 }}
                    >
                        Verificar Respuesta
                    </button>
                ) : (
                    <button className="btn-primary" onClick={handleNext}>
                        {currentQuestionIdx < questions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Examen'}
                    </button>
                )}
            </div>

        </div>
    );
}
