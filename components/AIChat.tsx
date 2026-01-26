import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { PROJECTS, PROFILE } from '../data';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

// System message to guide the mock AI's responses
const SYSTEM_PROMPT = `You are a helpful virtual assistant for Samuel, a Product Engineer.
Your goal is to answer questions about his skills, projects, and availability.
Be concise and friendly.

Samuel's Skills: React, TypeScript, Solidity, Rust, Supabase, Google Cloud, Docker, Gemini API, Base Chain.

Samuel's Projects:
${PROJECTS.map(p => `- ${p.title}: ${p.description}`).join('\n')}

Availability: Samuel is currently open for new projects. Users can book a call or email him at ${PROFILE.links.email}.
`;

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

export const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm Samuel's virtual assistant. Ask me anything about his projects, skills, or availability." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const getMockResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Check for project keywords
    for (const project of PROJECTS) {
      if (lowerQuery.includes(project.title.toLowerCase())) {
        return `Ah, ${project.title}! It's a project where Samuel worked on ${project.description}. The tech stack included ${project.stack.join(', ')}. It's currently ${project.status}.`;
      }
    }
    
    // Check for skill keywords
    if (lowerQuery.includes('skill') || lowerQuery.includes('stack') || lowerQuery.includes('tech')) {
      return "Samuel is proficient in a modern web3 stack including React, TypeScript, Solidity, and Rust. He's also experienced with Supabase for backends and Google Cloud for infrastructure.";
    }

    // Check for contact/availability
    if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('available')) {
      return `He is! You can reach him at ${PROFILE.links.email} to discuss new opportunities.`;
    }
    
    // Check for greeting
    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return "Hello there! How can I help you learn more about Samuel's work?";
    }

    // Fallback response
    return "That's a great question. I can tell you about specific projects like MoniPay or BaseStory, or his overall skillset. What are you most interested in?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate thinking
      const responseText = getMockResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having a bit of trouble right now. Please try again later!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col" title="AI Assistant (Gemini 1.5 Flash)" noPadding>
      <div className="flex flex-col h-full bg-[#F9FAFB]">
        
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[300px] lg:max-h-none no-scrollbar">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-yellow-200' : 'bg-blue-200'}`}>
                {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div 
                className={`max-w-[80%] p-3 rounded-lg border-2 border-black shadow-hard-pressed font-body text-base leading-snug
                ${msg.role === 'assistant' ? 'bg-white rounded-tl-none' : 'bg-blue-50 rounded-tr-none'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0 bg-yellow-200">
                <Bot size={16} />
              </div>
              <div className="bg-white p-3 rounded-lg rounded-tl-none border-2 border-black shadow-hard-pressed">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t-2 border-black bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about my projects..."
              className="flex-1 bg-white border-2 border-black rounded-lg px-4 py-2 font-body focus:outline-none focus:ring-2 focus:ring-black focus:shadow-hard-pressed transition-shadow placeholder:text-gray-400"
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