import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = 40 }) => {
  return (
    <svg 
      width={size * 4.5} 
      height={size} 
      viewBox="0 0 450 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Syringe Outline */}
      <path 
        d="M20 30V75C20 80 25 85 35 85C45 85 50 80 50 75V30" 
        stroke="black" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
      <rect x="12" y="25" width="46" height="6" rx="1" fill="black" />
      
      {/* Plunger */}
      <rect x="32" y="12" width="6" height="13" fill="black" />
      <rect x="22" y="6" width="26" height="6" rx="1.5" stroke="black" strokeWidth="3" fill="none" />
      
      {/* Liquid inside (partially filled) */}
      <path 
        d="M23.5 55V75C23.5 79 27 82 35 82C43 82 46.5 79 46.5 75V55H23.5Z" 
        fill="#98E2FF" 
      />
      
      {/* Markings */}
      <rect x="32" y="40" width="10" height="2.5" fill="black" />
      <rect x="32" y="52" width="10" height="2.5" fill="black" />
      <rect x="32" y="64" width="10" height="2.5" fill="black" />
      
      {/* Bottom detail and Needle */}
      <path d="M28 85H42L38 90H32L28 85Z" fill="black" />
      <rect x="34" y="90" width="2" height="10" fill="black" />
      
      {/* Text "MeoVacinas" in a tall condensed style */}
      <text 
        x="60" 
        y="80" 
        fill="black" 
        style={{ 
          fontFamily: '"Inter", "Arial Narrow", sans-serif', 
          fontWeight: '500', 
          fontSize: '72px',
          letterSpacing: '-2px',
          transform: 'scaleY(1.3) scaleX(0.8)',
          transformOrigin: '60px 80px'
        }}
      >
        MeoVacinas
      </text>
    </svg>
  );
};

export default Logo;
