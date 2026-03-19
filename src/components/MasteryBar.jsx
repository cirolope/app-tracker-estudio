export default function MasteryBar({ progress }) {
    // Define levels based on NotebookLM mastery metrics
    const getLevelInfo = (p) => {
        if (p < 25) return { name: 'Adquisición', color: 'var(--text-secondary)' };
        if (p < 50) return { name: 'Transición', color: 'var(--warning-color)' };
        if (p < 75) return { name: 'Aplicación', color: 'var(--accent-color)' };
        return { name: 'Dominio Experto', color: 'var(--success-color)' };
    };

    const currentLevel = getLevelInfo(progress);

    return (
        <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: currentLevel.color }}>
                    {currentLevel.name}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {progress}%
                </span>
            </div>

            {/* Container Track */}
            <div style={{
                height: '8px',
                width: '100%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                {/* Fill */}
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    backgroundColor: currentLevel.color,
                    borderRadius: '4px',
                    transition: 'width 0.5s ease, background-color 0.5s ease'
                }} />
            </div>
        </div>
    );
}
