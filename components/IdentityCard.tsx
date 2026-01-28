import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { PROFILE } from '../data';
import { Github, Twitter, Mail, Linkedin, Book, Sun, Moon, Newspaper } from 'lucide-react';
import { SiTelegram, SiDiscord } from 'react-icons/si';
import { useTheme } from './ThemeContext';
import clsx from 'clsx';

interface IdentityCardProps {
  overrideProfile?: {
    name?: string;
    role?: string;
    bio?: string;
    links?: typeof PROFILE.links;
  }
}

const SocialButton: React.FC<{
  href: string;
  icon: React.ElementType;
  label: string;
  isExternal?: boolean;
  tooltipPos?: 'top' | 'bottom';
}> = ({ href, icon: Icon, label, isExternal = true, tooltipPos = 'top' }) => (
  <a 
    href={href} 
    target={isExternal ? "_blank" : undefined}
    rel={isExternal ? "noopener noreferrer" : undefined}
    className="group relative p-2.5 border-2 border-black dark:border-zinc-400 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-none dark:text-white flex items-center justify-center"
    aria-label={label}
  >
    <Icon size={18} />
    
    {/* Tooltip */}
    <span className={clsx(
      "absolute left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-bold rounded opacity-0 scale-75 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none shadow-hard whitespace-nowrap z-50",
      // Theme Colors: Light = White BG/Black Text. Dark = Zinc BG/White Text.
      "bg-white text-black border-2 border-black dark:bg-zinc-900 dark:text-white dark:border-zinc-400",
      // Position specific animation and placement
      tooltipPos === 'top' 
        ? "bottom-full mb-2 origin-bottom translate-y-2 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100" 
        : "top-full mt-2 origin-top -translate-y-2 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100"
    )}>
      {label}
      {/* Triangle Pointer */}
      <span className={clsx(
          "absolute left-1/2 -translate-x-1/2 border-[6px] border-transparent",
          tooltipPos === 'top' 
            ? "top-full border-t-black dark:border-t-zinc-400" 
            : "bottom-full border-b-black dark:border-b-zinc-400"
      )}></span>
    </span>
  </a>
);

export const IdentityCard: React.FC<IdentityCardProps> = ({ overrideProfile }) => {
  const { theme, toggleTheme } = useTheme();
  const [text, setText] = useState('');
  
  // Merge default profile with overrides
  const displayProfile = {
    ...PROFILE,
    ...overrideProfile
  };

  const fullText = `Hello! I'm ${displayProfile.name}.`;

  useEffect(() => {
    let currentIndex = 0;
    setText(''); // Reset text when profile changes
    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [fullText]);

  return (
    <Card 
      id="identity-card" 
      className="h-full" 
      title="Identity"
      headerRight={
        <button
          onClick={toggleTheme}
          className="lg:hidden p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white"
          title="Toggle Theme"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      }
    >
      <div className="flex flex-col h-full items-center text-center">
        <div className="w-32 h-32 rounded-full border-2 border-black dark:border-zinc-300 shadow-[2px_2px_2px_rgba(0,0,0,0.15)] overflow-hidden mb-6 transition-colors">
          <img 
            src={displayProfile.photoUrl} 
            alt={displayProfile.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Typewriter Header */}
        <div className="mb-4 h-16 flex flex-col items-center justify-center">
          <h1 className="font-display text-2xl leading-tight dark:text-white">
            {text}
            <span className="inline-block w-1 h-8 bg-black dark:bg-white animate-blink align-middle ml-1" />
          </h1>
          <span className="font-body text-sm font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
            {displayProfile.role}
          </span>
        </div>
        
        <p className="font-body text-lg leading-relaxed mb-auto text-left dark:text-zinc-200">
          {displayProfile.bio}
        </p>

        <div className="flex gap-3 mt-8 w-full justify-center flex-wrap relative z-20">
          <SocialButton href={displayProfile.links.github} icon={Github} label="GitHub" tooltipPos="top" />
          <SocialButton href={displayProfile.links.x} icon={Twitter} label="X (Twitter)" tooltipPos="top" />
          <SocialButton href={displayProfile.links.linkedin} icon={Linkedin} label="LinkedIn" tooltipPos="top" />
          <SocialButton href={displayProfile.links.telegram} icon={SiTelegram} label="Telegram" tooltipPos="top" />
          
          <SocialButton href={displayProfile.links.discord} icon={SiDiscord} label="Discord" tooltipPos="top" />
          <SocialButton href={displayProfile.links.dailydev} icon={Newspaper} label="Daily.dev" tooltipPos="top" />
          <SocialButton href={displayProfile.links.blog} icon={Book} label="Blog" tooltipPos="top" />
          <SocialButton href={`mailto:${displayProfile.links.email}`} icon={Mail} label="Email" isExternal={false} tooltipPos="top" />
        </div>
      </div>
    </Card>
  );
};