'use client';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function FrontierMindsLogo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
    xl: { icon: 72, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Feynman-diagram inspired logo: represents discovery, interaction, transformation */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Background circle - the "frontier" boundary */}
        <circle cx="32" cy="32" r="30" stroke="url(#gradient1)" strokeWidth="2" fill="none" opacity="0.3" />

        {/* Central vertex - the "mind" / interaction point */}
        <circle cx="32" cy="32" r="4" fill="url(#gradient1)" />

        {/* Incoming particle paths (straight lines with arrows) - knowledge coming in */}
        <line x1="8" y1="32" x2="28" y2="32" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="8" x2="32" y2="28" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />

        {/* Wavy line (photon/energy exchange) - the transformation process */}
        <path
          d="M36 32 Q40 28, 44 32 Q48 36, 52 32 Q56 28, 60 32"
          stroke="url(#gradient2)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Outgoing paths with arrows - transformed knowledge going out */}
        <line x1="36" y1="36" x2="52" y2="52" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
        <polygon points="54,54 48,52 52,48" fill="#A78BFA" />

        <line x1="36" y1="28" x2="52" y2="12" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
        <polygon points="54,10 48,12 52,16" fill="#34D399" />

        {/* Small vertices on the paths - learning moments */}
        <circle cx="20" cy="32" r="2" fill="#60A5FA" />
        <circle cx="32" cy="20" r="2" fill="#60A5FA" />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-white tracking-tight ${text}`}>
            Frontier<span className="text-blue-400">Minds</span>
          </span>
          <span className="text-[10px] text-slate-500 tracking-widest uppercase">
            AI-Powered Learning
          </span>
        </div>
      )}
    </div>
  );
}
