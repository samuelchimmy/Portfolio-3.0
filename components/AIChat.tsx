import React, { useState, useRef, useEffect } from 'react';
import { Card } from './Card';
import { Send, Bot, User, CheckCircle, Loader2, Download } from 'lucide-react';
import { PROJECTS, PROFILE, Project } from '../data';
import { GoogleGenAI, Chat, FunctionDeclaration, Type, Tool, Part } from "@google/genai";

// Shared Backend URL
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzA6KW-e43M3uT57G4O5aCCRDAE9m4oUChTuW0vbWDJaPt0MNn_EvJ2vT5ROTauqSmQ/exec";

interface Message {
  role: 'user' | 'assistant' | 'system';
  text: string;
  type?: 'text' | 'success-card' | 'resume-card';
  bookingDetails?: any;
}

interface AIChatProps {
  currentProject?: Project;
}

const HINT_PHRASES = [
  "Are you free next Tuesday?",
  "Book a meeting with Samuel",
  "How does MoniPay work?",
  "Tell me about the tech stack."
];

// --- TOOL DEFINITIONS ---

const checkCalendarTool: FunctionDeclaration = {
  name: "check_calendar",
  description: "Fetches Samuel's calendar availability for a specific date to find free slots.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      date: {
        type: Type.STRING,
        description: "The date to check in YYYY-MM-DD format.",
      },
    },
    required: ["date"],
  },
};

const createBookingTool: FunctionDeclaration = {
  name: "create_booking",
  description: "Book a meeting with Samuel after collecting all necessary details.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The name of the person booking." },
      email: { type: Type.STRING, description: "The email of the person booking." },
      purpose: { type: Type.STRING, description: "The reason or agenda for the meeting." },
      date: { type: Type.STRING, description: "The date in YYYY-MM-DD format." },
      time: { type: Type.STRING, description: "The time in HH:MM format (24-hour)." },
      duration: { type: Type.NUMBER, description: "Duration in minutes (15, 30, or 45)." },
    },
    required: ["name", "email", "purpose", "date", "time", "duration"],
  },
};

const getResumeTool: FunctionDeclaration = {
  name: "get_resume",
  description: "Provides a downloadable PDF of Samuel's Resume/CV.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

const tools: Tool[] = [{
  functionDeclarations: [checkCalendarTool, createBookingTool, getResumeTool],
}];

// --- COMPONENT ---

export const AIChat: React.FC<AIChatProps> = ({ currentProject }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello! I'm Samuel's AI agent. I can answer questions about his work or help you book a meeting directly in this chat." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping, toolStatus]);

  // Typewriter placeholder effect
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
        }, 3000);
      }
    }
    return () => clearTimeout(timeoutId);
  }, [currentPlaceholder, isDeleting, placeholderIndex]);

  // --- API FUNCTIONS ---

  const checkCalendar = async (dateStr: string): Promise<string> => {
    try {
      setToolStatus("Checking Samuel's calendar...");
      
      const requestedDate = new Date(dateStr);
      
      // Hardcoded Sunday Check
      // Using getUTCDay() ensures we check the day of the requested YYYY-MM-DD (which parses to UTC midnight)
      // 0 represents Sunday.
      if (!isNaN(requestedDate.getTime()) && requestedDate.getUTCDay() === 0) {
        setToolStatus(null);
        return `Samuel is unavailable on Sundays (${dateStr}). Please ask the user to choose a weekday or Saturday.`;
      }

      const response = await fetch(BACKEND_URL, { redirect: 'follow' });
      const bookedSlots: { start: string, end: string }[] = await response.json();

      // Simple slot calculation logic
      const hostOffset = 1; // Lagos UTC+1
      const slots = [];
      
      // Generate slots from 12:00 PM to 6:00 PM (Host Time)
      for (let hour = 12; hour < 18; hour++) {
        slots.push({ h: hour, m: 0 });
        slots.push({ h: hour, m: 30 });
      }

      const freeSlots = slots.filter(slot => {
        const slotDate = new Date(requestedDate);
        slotDate.setUTCHours(slot.h - hostOffset, slot.m, 0, 0);
        const slotEnd = new Date(slotDate.getTime() + 30 * 60000);

        // Check collision
        const isBooked = bookedSlots.some(b => {
          const bStart = new Date(b.start);
          const bEnd = new Date(b.end);
          return (slotDate < bEnd && slotEnd > bStart);
        });
        return !isBooked;
      });

      if (freeSlots.length === 0) {
        return "No slots available on this date. Offer to waitlist or check the next day.";
      }

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return `Available slots on ${dateStr} (${timeZone}): ` + freeSlots.map(s => {
          const d = new Date(requestedDate);
          d.setUTCHours(s.h - hostOffset, s.m);
          // Explicitly format to user's timezone
          return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone });
      }).join(", ");

    } catch (e) {
      console.error(e);
      return "Error fetching calendar data.";
    } finally {
      setToolStatus(null);
    }
  };

  const createBooking = async (args: any): Promise<string> => {
    try {
      setToolStatus("Finalizing booking...");
      const { name, email, purpose, date, time, duration } = args;

      // Construct ISO string
      const d = new Date(`${date}T${time}`);
      // Fallback if parsing fails
      const bookingTimeUTC = !isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString();

      const payload = {
        name, email, purpose, duration: duration.toString(), bookingTimeUTC
      };

      await fetch(BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Inject Success Card into Chat
      setMessages(prev => [...prev, {
        role: 'system',
        text: 'Booking Confirmed',
        type: 'success-card',
        bookingDetails: { date, time, duration }
      }]);

      return "Booking request sent successfully. I have displayed a confirmation card to the user.";
    } catch (e) {
      return "Failed to book. Please ask the user to use the manual form.";
    } finally {
      setToolStatus(null);
    }
  };

  // --- MAIN CHAT LOGIC ---

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input;
    setInput('');
    
    // Add User Message
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        chatRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            tools,
            systemInstruction: `You are Samuel's Executive AI Assistant. Your goal is to be a "Conversational Interviewer".
            
            **YOUR KNOWLEDGE BASE:**
            - **Profile:** ${JSON.stringify(PROFILE)}
            - **Projects:** ${JSON.stringify(PROJECTS)}
            - **Current User Timezone:** ${userTimeZone}
            - **Today's Date:** ${new Date().toDateString()}

            **BEHAVIOR & RULES:**
            1. **Active Project Context:** The user is currently looking at: ${currentProject?.title || "Home"}. Use this context to offer relevant insights.
            2. **Booking Flow (The Interview):**
               - **IMPORTANT:** Samuel is **UNAVAILABLE ON SUNDAYS**. Do not suggest Sunday slots. If a user asks for Sunday, politely decline and offer Saturday or Monday.
               - **Step 1 (Check):** If user asks about availability, call \`check_calendar(date)\`.
               - **Step 2 (Suggest):** Present free slots **in the user's local timezone** (${userTimeZone}). The slots returned by the tool are already converted to ${userTimeZone}.
               - **Step 3 (Interview):** If they pick a slot, ask for Name, Email, and Purpose ONE BY ONE. Do not ask for everything at once.
               - **Step 4 (Confirm):** Summarize details. Call \`create_booking\` ONLY after explicit confirmation.
            3. **Waitlist:** If a day is full, offer to check the next day or add them to a waitlist (pretend to add).
            4. **Pre-Meeting:** After booking, ask: "Is there a specific document you'd like Samuel to review before the call?"
            5. **Handoff:** If the user seems frustrated, tell them they can use the manual "Book a Call" card.
            6. **Resume:** If user asks for resume, CV, or background info that requires a document, call \`get_resume\`.
            
            **TONE:** Professional, efficient, slightly witty.
            `,
          },
        });
      }

      // Inject Context if Project Changed
      let msgToSend = userText;
      if (currentProject) {
        msgToSend = `[Context: User is viewing "${currentProject.title}"] ${userText}`;
      }

      // Send user message
      let response = await chatRef.current.sendMessage({ message: msgToSend });
      
      // Handle Function Calls Loop
      let functionCalls = response.functionCalls;

      while (functionCalls && functionCalls.length > 0) {
        const toolResponses: Part[] = [];
        
        for (const call of functionCalls) {
          let result = "";
          if (call.name === "check_calendar") {
            const args = call.args as any;
            result = await checkCalendar(args.date);
          } else if (call.name === "create_booking") {
            const args = call.args as any;
            result = await createBooking(args);
          } else if (call.name === "get_resume") {
            result = "Resume card displayed to user.";
            setMessages(prev => [...prev, {
              role: 'system',
              text: 'Download Resume',
              type: 'resume-card'
            }]);
          }
          
          toolResponses.push({
            functionResponse: {
              name: call.name,
              id: call.id,
              response: { result }
            }
          });
        }
        
        // Send tool results back to model
        response = await chatRef.current.sendMessage({ message: toolResponses });
        functionCalls = response.functionCalls;
      }

      // Final Text Response
      const text = response.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'assistant', text }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting right now. Please try again or use the manual booking form." }]);
    } finally {
      setIsTyping(false);
      setToolStatus(null);
    }
  };

  return (
    <Card id="ai-assistant-card" className="h-full flex flex-col overflow-hidden" title="AI Executive Assistant" noPadding>
      <div className="flex flex-col h-full bg-white dark:bg-zinc-900 transition-colors duration-300">
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar min-h-0">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col gap-2`}>
              {msg.type === 'success-card' ? (
                // Success Card - Emerald Green
                <div className="mr-auto w-fit max-w-[85%] bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg rounded-tl-none p-3 shadow-hard-pressed">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-display text-sm mb-1.5">
                    <CheckCircle size={16} />
                    <span>Booking Confirmed</span>
                  </div>
                  <div className="text-xs font-body text-emerald-900 dark:text-emerald-200 space-y-0.5">
                    <p><strong>Date:</strong> {msg.bookingDetails.date}</p>
                    <p><strong>Time:</strong> {msg.bookingDetails.time}</p>
                    <p><strong>Duration:</strong> {msg.bookingDetails.duration} mins</p>
                  </div>
                </div>
              ) : msg.type === 'resume-card' ? (
                // Resume Card - Emerald Green
                <div className="mr-auto w-fit max-w-[85%] bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg rounded-tl-none p-3 shadow-hard-pressed">
                  <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-200 dark:bg-emerald-800 rounded-full border border-emerald-300 dark:border-emerald-700">
                              <Download className="text-emerald-800 dark:text-emerald-200" size={14} />
                          </div>
                          <div className="flex flex-col">
                              <span className="font-display text-sm text-emerald-900 dark:text-emerald-200 leading-none">Samuel's Resume</span>
                              <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">PDF Document</span>
                          </div>
                      </div>
                      <a 
                          href="/public/assets/dev%20resume.pdf" 
                          download="Samuel_Chiedozie_Resume.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-[10px] shadow-sm transition-colors flex items-center gap-1 whitespace-nowrap"
                      >
                          Download
                      </a>
                  </div>
                </div>
              ) : (
                // Standard Chat Bubbles
                <div className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full border-2 border-black dark:border-zinc-500 flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-yellow-200 dark:bg-yellow-600' : 'bg-blue-200 dark:bg-blue-600'} shadow-hard-pressed text-black dark:text-white`}>
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div 
                    className={`max-w-[85%] p-3 rounded-lg border-2 border-black dark:border-zinc-600 shadow-hard-pressed font-body text-base leading-snug backdrop-blur-md
                    ${msg.role === 'assistant' 
                      ? 'bg-white/90 dark:bg-zinc-800/90 rounded-tl-none text-black dark:text-zinc-100' 
                      : 'bg-blue-50/90 dark:bg-blue-900/40 rounded-tr-none text-black dark:text-zinc-100'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Status Indicator */}
          {(isTyping || toolStatus) && (
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 ml-12 animate-pulse">
               {toolStatus ? (
                 <>
                   <Loader2 size={12} className="animate-spin" />
                   {toolStatus}
                 </>
               ) : (
                 "Thinking..."
               )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t-2 border-black dark:border-zinc-400 bg-gray-50/90 dark:bg-zinc-800/90 backdrop-blur-md transition-colors">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={currentPlaceholder}
              disabled={isTyping}
              className="flex-1 bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-500 rounded-lg px-4 py-2 font-body text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-zinc-400 focus:shadow-hard-pressed transition-all placeholder:text-gray-400 disabled:bg-gray-100 dark:disabled:bg-zinc-800 disabled:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg border-2 border-black dark:border-zinc-300 shadow-hard hover:bg-gray-800 dark:hover:bg-gray-200 active:translate-y-px active:shadow-hard-pressed transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};