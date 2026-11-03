import React from 'react';

interface ImoleLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean;
}

export default function ImoleLogo({ size = 'md', light = false }: ImoleLogoProps) {
  const fontSizes = {
    sm: { text: '1.25rem', halo: '8px', haloTop: '-6px' },
    md: { text: '1.75rem', halo: '10px', haloTop: '-8px' },
    lg: { text: '2.5rem', halo: '14px', haloTop: '-12px' },
    xl: { text: '3.75rem', halo: '18px', haloTop: '-16px' },
  };

  const current = fontSizes[size];
  const textColor = light ? '#FFFFFF' : '#300E58';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', userSelect: 'none' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Golden Radiant Halo above O */}
        <span
          style={{
            display: 'inline-block',
            fontWeight: 800,
            letterSpacing: '0.08em',
            fontSize: current.text,
            color: textColor,
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          IM
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                position: 'absolute',
                top: current.haloTop,
                left: '50%',
                transform: 'translateX(-50%)',
                width: current.halo,
                height: current.halo,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #FFE259 0%, #FFA751 100%)',
                boxShadow: '0 0 12px #FFA751, 0 0 20px rgba(255, 215, 0, 0.6)',
              }}
            />
            Ọ
          </span>
          LẸ
        </span>
      </div>
    </div>
  );
}
