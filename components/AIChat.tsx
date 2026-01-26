import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { PROJECTS, PROFILE } from '../data';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const HINT_PHRASES = [
  "Is Samuel free for a meeting?",
  "Tell me about MoniPay.",
  "Download Samuel's Resume.",
  "What is your tech stack?",
  "Explain the Gasless Relayer."
];

const LoadingDots = () => (
  <motion.div className="flex space-x-1">
    <motion.span
      className="w-2 h-2 bg-gray-500 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-500 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, delay: 0.1, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-500 rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.5, delay: 0.2, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.div>
);

const TypewriterText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 15);

    return () => clearInterval(timer);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

export const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm Samuel's virtual assistant. Ask me anything about his projects, skills, or availability." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    const currentHint = HINT_PHRASES[placeholderIndex];
    let timeoutId: number;

    if (isDeleting) {
      if (currentPlaceholder.length > 0) {
        timeoutId = window.setTimeout(() => {
          setCurrentPlaceholder(currentPlaceholder.slice(0, -1));
        }, 50);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % HINT_PHRASES.length);
      }
    } else {
      if (currentPlaceholder.length < currentHint.length) {
        timeoutId = window.setTimeout(() => {
          setCurrentPlaceholder(currentHint.slice(0, currentPlaceholder.length + 1));
        }, 100);
      } else {
        timeoutId = window.setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [currentPlaceholder, isDeleting, placeholderIndex]);

  const getMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('gasless relayer') || lowerQuery.includes('invisible wallet')) {
      return "The Gasless Relayer is a proprietary infrastructure component in MoniPay. It abstracts gas fees for merchants, allowing them to process crypto transactions without holding ETH/BASE for fees. Combined with the 'Invisible Wallet' monitag architecture, it uses local AES-GCM encryption to securely manage session keys directly on the device.";
    }
    if (lowerQuery.includes('resume') || lowerQuery.includes('cv')) {
      return "You can download Samuel's Resume directly. (Simulating download...) For now, please check his LinkedIn profile in the Identity card for the full work history.";
    }
    if (lowerQuery.includes('meeting') || lowerQuery.includes('calendar') || lowerQuery.includes('book')) {
      return "Samuel is currently open for meetings! Please use the Availability card (bottom right) to book a slot via Google Calendar integration.";
    }
    for (const project of PROJECTS) {
      if (lowerQuery.includes(project.title.toLowerCase())) {
        return `Ah, ${project.title}! It's a project where Samuel worked on ${project.description}. The tech stack included ${project.stack.join(', ')}. It's currently ${project.status}.`;
      }
    }
    if (lowerQuery.includes('skill') || lowerQuery.includes('stack') || lowerQuery.includes('tech')) {
      return "Samuel is proficient in a modern web3 stack including React, TypeScript, Solidity, and Rust. He's also experienced with Supabase for backends and Google Cloud for infrastructure.";
    }
    if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('available')) {
      return `He is! You can reach him at ${PROFILE.links.email} to discuss new opportunities.`;
    }
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return "Hello there! How can I help you learn more about Samuel's work?";
    }
    return "That's a great question. I can tell you about specific projects like MoniPay or BaseStory, or his overall skillset. What are you most interested in?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const responseText = getMockResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having a bit of trouble right now. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden" title="AI Assistant (Gemini 1.5 Flash)" noPadding>
      <video
        src="/assets/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-15 pointer-events-none mix-blend-multiply"
      />

      <div className="relative z-10 flex flex-col h-full">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar min-h-0">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-yellow-200' : 'bg-blue-200'} shadow-hard-pressed`}>
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div 
                className={`max-w-[80%] p-3 rounded-lg border-2 border-black shadow-hard-pressed font-body text-base leading-snug backdrop-blur-md
                ${msg.role === 'assistant' ? 'bg-white/90 rounded-tl-none' : 'bg-blue-50/90 rounded-tr-none'}`}
              >
                {msg.role === 'assistant' ? <TypewriterText text={msg.text} /> : msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0 bg-yellow-200 shadow-hard-pressed">
                <Bot size={16} />
              </div>
              <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg rounded-tl-none border-2 border-black shadow-hard-pressed">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>
        <div className="p-3 border-t-2 border-black bg-gray-50/90 backdrop-blur-md">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={currentPlaceholder}
              className="flex-1 bg-white border-2 border-black rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-black focus:shadow-hard-pressed transition-all placeholder:text-gray-400 placeholder:italic"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="p-2 bg-black text-white rounded-lg border-2 border-black shadow-hard hover:bg-gray-800 active:translate-y-px active:shadow-hard-pressed transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};