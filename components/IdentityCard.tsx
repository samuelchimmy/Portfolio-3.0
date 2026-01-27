import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { PROFILE } from '../data';
import { Github, Twitter, Mail, Linkedin, Book } from 'lucide-react';
import { SiTelegram, SiDiscord } from 'react-icons/si';

export const IdentityCard: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = "Hello! I'm Samuel.";

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 100); // Speed of typing

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="h-full" title="Identity">
      <div className="flex flex-col h-full items-center text-center">
        <div className="w-32 h-32 rounded-full border-2 border-black shadow-[2px_2px_2px_rgba(0,0,0,0.15)] overflow-hidden mb-6">
          <img 
            src={PROFILE.photoUrl} 
            alt={PROFILE.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Typewriter Header */}
        <div className="mb-6 h-16 flex items-center justify-center">
          <h1 className="font-display text-2xl leading-tight">
            {text}
            <span className="inline-block w-1 h-8 bg-black animate-blink align-middle ml-1" />
          </h1>
        </div>
        
        <p className="font-body text-lg leading-relaxed mb-auto text-left">
          {PROFILE.bio}
        </p>

        <div className="flex gap-3 mt-8 w-full justify-center flex-wrap">
          <a 
            href={PROFILE.links.github} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="p-2.5 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-none"
          >
            <Github size={18} />
          </a>
          <a 
            href={PROFILE.links.x} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
            className="p-2.5 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-none"
          >
            <Twitter size={18} />
          </a>
          <a 
            href={PROFILE.links.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="p-2.5 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-none"
          >
            <Linkedin size={18} />
          </a>
          <a 
            href={PROFILE.links.telegram} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Telegram Profile"
            className="p-2.5 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-none"
          >
            <SiTelegram size={18} />
          </a>
          <a 
            href={PROFILE.links.discord} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Discord Profile"
            className="p-2.5 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-none"
          >
            <SiDiscord size={18} />
          </a>
          <a 
            href={PROFILE.links.blog} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Blog"
            className="p-2.5 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-none"
          >
            <Book size={18} />
          </a>
          <a 
            href={`mailto:${PROFILE.links.email}`}
            aria-label="Email"
            className="p-2.5 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors shadow-[2px_2px_2px_rgba(0,0,0,0.15)] active:translate-y-[1px] active:shadow-none"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </Card>
  );
};