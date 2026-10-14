import React from 'react';

interface HealthArogyaaLogoProps {
  className?: string;
  size?: number | string;
  showCircleRing?: boolean;
  background?: string;
}

export const HealthArogyaaLogo: React.FC<HealthArogyaaLogoProps> = ({
  className = 'w-10 h-10',
  size,
  showCircleRing = true,
  background = '#ffffff',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="HealthArogyaa Logo"
    >
      {/* White or Custom Circular Base */}
      {background !== 'none' && background !== 'transparent' && (
        <circle cx="100" cy="100" r="92" fill={background} />
      )}

      {/* Outer Green Circle Ring */}
      {showCircleRing && (
        <circle
          cx="100"
          cy="100"
          r="86"
          stroke="#3f7a52"
          strokeWidth="4"
          fill="none"
        />
      )}

      {/* Center Top Red Bindi / Head Dot */}
      <circle cx="100" cy="68" r="14" fill="#e22d2c" />

      {/* Left Red Petal (Health / Vitality / Heart Wing) */}
      <path
        d="M 96.5 86
           C 82 78, 62 80, 52 93
           C 46 100, 48 106, 56 107
           C 66 118, 78 136, 96.5 152
           Z"
        fill="#e22d2c"
      />

      {/* Right Green Petal (Arogyaa / Wellness / Leaf Wing) */}
      <path
        d="M 103.5 86
           C 118 78, 138 80, 148 93
           C 154 100, 152 106, 144 107
           C 134 118, 122 136, 103.5 152
           Z"
        fill="#1c7c3d"
      />
    </svg>
  );
};

export default HealthArogyaaLogo;
