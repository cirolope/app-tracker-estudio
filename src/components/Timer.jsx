import { useState, useEffect } from 'react';

export default function Timer({ minutes, onComplete, isActive, title, size = 160 }) {
    const [secondsLeft, setSecondsLeft] = useState(() => {
        const saved = localStorage.getItem(`timer_${title}`);
        return saved !== null ? Number(saved) : minutes * 60;
    });
    const [isPaused, setIsPaused] = useState(() => {
        const saved = localStorage.getItem(`timer_paused_${title}`);
        return saved !== null ? saved === 'true' : false;
    });

    useEffect(() => {
        const saved = localStorage.getItem(`timer_${title}`);
        if (saved !== null) {
            setSecondsLeft(Number(saved));
        } else {
            setSecondsLeft(minutes * 60);
        }

        const savedPaused = localStorage.getItem(`timer_paused_${title}`);
        if (savedPaused !== null) {
            setIsPaused(savedPaused === 'true');
        } else {
            setIsPaused(false);
        }
    }, [minutes, title]);

    useEffect(() => {
        localStorage.setItem(`timer_${title}`, secondsLeft);
        localStorage.setItem(`timer_paused_${title}`, isPaused);
    }, [secondsLeft, isPaused, title]);

    useEffect(() => {
        if (!isActive || isPaused) return;

        if (secondsLeft <= 0) {
            localStorage.removeItem(`timer_${title}`);
            localStorage.removeItem(`timer_paused_${title}`);
            onComplete();
            return;
        }

        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isActive, isPaused, secondsLeft, onComplete]);

    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    // Calculate percentage for circular progress
    const totalSeconds = minutes * 60;
    const percentage = (secondsLeft / totalSeconds) * 100;

    // SVG Circle properties
    const radius = (size / 2) - 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
                {/* Background Circle */}
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={isActive ? 'var(--accent-color)' : 'var(--text-secondary)'}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>

                {/* Time Text */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    flexDirection: 'column'
                }}>
                    <span style={{ fontSize: size > 200 ? '48px' : '36px', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
                        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {isActive && (
                <button
                    className="btn-secondary"
                    style={{ marginTop: '24px', padding: '12px 24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setIsPaused(!isPaused)}
                >
                    {isPaused ? '▶ Reanudar' : '⏸ Pausar'}
                </button>
            )}
        </div>
    );
}
