import { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function FlashcardsDeck({ cards }) {
    const [currentIndex, setCurrentIndex] = useState(() => {
        const saved = localStorage.getItem('flashcard_index');
        return saved !== null ? Number(saved) : 0;
    });
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        localStorage.setItem('flashcard_index', currentIndex);
    }, [currentIndex]);

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 150); // slight delay to allow flip back animation
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 150);
    };

    const currentCard = cards[currentIndex];

    if (!cards || cards.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>

            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Tarjeta {currentIndex + 1} de {cards.length}
            </div>

            <div
                style={{
                    perspective: '1500px',
                    width: '100%',
                    flex: 1,
                    maxHeight: '450px',
                    cursor: 'pointer'
                }}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}>

                    {/* Front */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        backgroundColor: 'rgb(28, 28, 30)',
                        borderRadius: 'var(--border-radius-lg)',
                        border: 'var(--glass-border)',
                        boxShadow: 'var(--glass-shadow)',
                        transform: 'translateZ(1px)' // Small push ensures Firefox doesn't z-fight
                    }}>
                        <h3 style={{ fontSize: '28px', fontWeight: '500', lineHeight: 1.4 }}>
                            <Latex>{currentCard.question}</Latex>
                        </h3>
                    </div>

                    {/* Back */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg) translateZ(1px)', // Matching push for the back face
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '40px',
                        backgroundColor: 'rgb(20, 35, 50)', // Dark blue solid tint
                        borderRadius: 'var(--border-radius-lg)',
                        border: '1px solid rgba(10, 132, 255, 0.3)',
                        boxShadow: 'var(--glass-shadow)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', maxHeight: '100%' }}>
                            <p style={{ fontSize: '22px', color: 'var(--text-primary)', lineHeight: 1.5, overflowY: 'auto' }}>
                                <Latex>{currentCard.answer}</Latex>
                            </p>
                            {currentCard.image && (
                                <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', justifyContent: 'center', padding: '8px' }}>
                                    <img src={currentCard.image} alt="Diagrama explicativo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                                </div>
                            )}
                            {currentCard.images && (
                                <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', padding: '8px', overflowX: 'auto' }}>
                                    {currentCard.images.map((imgSrc, idx) => (
                                        <img key={idx} src={imgSrc} alt={`Diagrama explicativo ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px', flexShrink: 0 }} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', width: '100%' }}>
                <button className="btn-secondary" onClick={prevCard} style={{ flex: 1 }}>Anterior</button>
                <button className="btn-secondary" onClick={nextCard} style={{ flex: 1 }}>Siguiente</button>
            </div>

        </div>
    );
}
