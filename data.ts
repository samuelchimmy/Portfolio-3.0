import React from 'react';
import { 
  SiReact, 
  SiTypescript, 
  SiSupabase, 
  SiGooglecloud, 
  SiDocker, 
  SiSolidity, 
  SiPostgresql, 
  SiVite, 
  SiNextdotjs, 
  SiRust, 
  SiCoinbase, 
  SiResend, 
  SiSocketdotio, 
  SiTailwindcss, 
  SiCapacitor,
  SiAnthropic,
  SiOpenai,
  SiGoogle
} from 'react-icons/si';
import { FaGem, FaRobot, FaCode, FaHeart, FaLayerGroup } from 'react-icons/fa';
import { VscTerminalCmd } from 'react-icons/vsc';

// --- TEMPLATE CONFIGURATION (BUILDER READY) ---
export const THEME = {
  // Colors
  primaryColor: "#000000",
  accentColor: "#22c55e", // Used for the "Optimist" stickman, success states, and highlights
  
  // Fonts (Must match Google Fonts import in index.html)
  headingFont: "'Henny Penny', cursive",
  bodyFont: "'Kalam', cursive",
  
  // UI Physics
  borderRadius: "12px",
  borderWidth: "2px",
  shadowStyle: "2px 2px 2px rgba(0,0,0,0.15)"
};

export const SERVICES = {
  // Google Apps Script Web App URL for Calendar
  calendarUrl: "https://script.google.com/macros/s/AKfycbzA6KW-e43M3uT57G4O5aCCRDAE9m4oUChTuW0vbWDJaPt0MNn_EvJ2vT5ROTauqSmQ/exec",
  // Host Timezone Offset (e.g., 1 for UTC+1, -5 for EST) - Used to calculate slots relative to the host
  calendarHostOffset: 1, 
};

export const SEO = {
  title: "Geometric Journal - Portfolio Template",
  description: "A reactive, AI-native Personal Operating System featuring a geometric bento grid and an executive AI assistant.",
  keywords: "portfolio, react, ai, template, developer, creative"
};

export const PROFILE = {
  name: "Samuel",
  role: "Product Engineer",
  bio: "Full-stack Web3 developer with over five years of experience architecting decentralized systems and scalable web applications. My work centers on React, TypeScript, and Solidity, with an emphasis on performance, reliability, inclusive design and real-world usability.",
  links: {
    github: "https://github.com/samuelchimmy",
    x: "https://x.com/WallstreetJade",
    email: "samuel.chiedozie@learnable.fun",
    linkedin: "https://www.linkedin.com/in/samuelchimmy1/",
    telegram: "https://t.me/bossop1",
    discord: "https://discord.com/users/758554694389334026",
    blog: "https://blog.0xnotes.lol/",
    dailydev: "https://app.daily.dev/jadeofwallstreet"
  },
  photoUrl: "https://picsum.photos/400/400?grayscale"
};

// --- pSEO CONFIGURATION ---
// This maps URL slugs (e.g., /hire/claude-developer) to specific profile overrides.

export interface PSEOOverride {
  role: string;
  bio: string;
  accentColor: string;
  aiSystemInstructionExtras: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const PSEO_CONFIG: Record<string, PSEOOverride> = {
  "claude-code-engineer": {
    role: "Claude Code Engineer",
    bio: "Specialist in Anthropics's ecosystem. I build reasoning-heavy applications using Claude 3.7 Sonnet and the Model Context Protocol (MCP). I focus on steerability, large-context retrieval, and humane AI interfaces.",
    accentColor: "#d97757", // Anthropic Clay/Orange
    aiSystemInstructionExtras: "You are representing a Claude Code Engineer. Emphasize your knowledge of Anthropic, constitutional AI, Model Context Protocol (MCP), and large context windows. Be helpful and articulate.",
    metaTitle: "Hire a Senior Claude Code Engineer | Vibe Coding Expert",
    metaDescription: "Expert Claude Code Engineer specializing in MCP, Constitutional AI, and Vibe Coding. See my portfolio built with LLMs.",
    keywords: "Claude Code, Anthropic Developer, MCP, Model Context Protocol, Vibe Coder"
  },
  "google-gemini-developer": {
    role: "Google Gemini Developer",
    bio: "Deeply embedded in the Google AI ecosystem. I architect multimodal applications using Gemini 2.0 Pro/Flash, Vertex AI, and Project Astra. I specialize in 2M+ token context windows and video understanding.",
    accentColor: "#4285F4", // Google Blue
    aiSystemInstructionExtras: "You are representing a Google Gemini Developer. Brag about the 2 million token context window, multimodal capabilities, and Vertex AI. You are fast and accurate.",
    metaTitle: "Google Gemini Developer | AI Studio Expert",
    metaDescription: "Senior Google Gemini Developer specializing in 2M context windows, Multimodal AI, and Vertex AI applications.",
    keywords: "Google Gemini, Vertex AI, AI Studio, Multimodal AI, Vibe Coder"
  },
  "vibe-coder": {
    role: "Senior Vibe Coder",
    bio: "I don't just write code; I orchestrate intelligence. As a Vibe Coder, I leverage LLMs (Cursor, Windsurf, Replit) to ship full-stack applications at 10x speed. I focus on architecture, intent, and product velocity.",
    accentColor: "#8b5cf6", // Electric Purple
    aiSystemInstructionExtras: "You are a 'Vibe Coder'. Explain that Vibe Coding is about managing AI to write code, focusing on higher-level architecture and aesthetics. You are the future of software engineering.",
    metaTitle: "Senior Vibe Coder | AI-Native Product Engineer",
    metaDescription: "Hire a Vibe Coder. I use Cursor, Replit, and LLMs to build high-quality software 10x faster than traditional engineers.",
    keywords: "Vibe Coding, Cursor, Replit, AI Assisted Programming, 10x Engineer"
  },
  "lovable-developer": {
    role: "Lovable.dev Engineer",
    bio: "Building beautiful, full-stack applications at the speed of thought. Expert in the Lovable.dev ecosystem, turning prompts into production-grade React & Supabase apps instantly.",
    accentColor: "#ec4899", // Pink
    aiSystemInstructionExtras: "You are an expert in Lovable.dev. You love how fast it is to go from prompt to app. You are enthusiastic about no-code/low-code merging with pro-code.",
    metaTitle: "Lovable Developer | Prompt-to-App Specialist",
    metaDescription: "Expert Lovable.dev Engineer. Turning ideas into full-stack apps using the Lovable platform.",
    keywords: "Lovable, GPT-4o, Supabase, React, No-code"
  },
   "ai-engineer": {
    role: "AI Systems Engineer",
    bio: "Bridging the gap between LLMs and UI. I build RAG pipelines, agentic workflows, and semantic search systems that actually work in production.",
    accentColor: "#10b981", // Emerald
    aiSystemInstructionExtras: "You are a generalist AI Engineer. Talk about RAG, Vector Databases, and Agentic workflows.",
    metaTitle: "Hire an AI Engineer | RAG & Agents Specialist",
    metaDescription: "Full-stack AI Engineer specializing in RAG, Agents, and LLM integration.",
    keywords: "AI Engineer, RAG, LLM, Agents, Python, TypeScript"
  }
};

export interface Project {
  title: string;
  description: string;
  stack: string[];
  color: string;
  url: string;
  status: 'Live' | 'Building' | 'Sunsetted';
  likes: number;
}

export const PROJECTS: Project[] = [
  {
    title: "MoniPay",
    description: "Decentralized SoftPOS protocol on Base replacing hardware terminals. Features a proprietary Gasless Relayer and 'Invisible Wallet' monitag architecture.",
    stack: ["React", "Base", "Solidity", "Supabase", "CapacitorJS"],
    color: "#0052FF",
    url: "https://monipay.xyz",
    status: 'Live',
    likes: 124,
  },
  {
    title: "Taxapp.ng",
    description: "Institutional-grade fiscal orchestration engine utilizing AI to optimize tax-efficiency pipelines for Nigerian entities.",
    stack: ["React", "Gemini AI", "Supabase"],
    color: "#10B981",
    url: "https://taxapp.ng",
    status: 'Building',
    likes: 89,
  },
  {
    title: "LighterDash",
    description: "An institutional-grade analytics platform for decentralized trading. Transforming raw trade histories into a competitive edge with AI-powered insights from Google's Gemini.",
    stack: ["WebSockets", "React", "TanStack Query", "Gemini AI", "Supabase"],
    color: "#000000",
    url: "https://lighterdash.lol",
    status: 'Live',
    likes: 215,
  },
  {
    title: "BaseStory",
    description: "Privacy-preserving on-chain social layer on Base, leveraging Account Abstraction for gasless, anonymous content.",
    stack: ["Solidity", "Account Abstraction", "Supabase", "Coinbase SW"],
    color: "#0052FF",
    url: "https://www.basestory.app",
    status: 'Live',
    likes: 156,
  },
  {
    title: "Invitecodes.xyz",
    description: "High-fidelity referral intelligence hub architected for the crypto-native ecosystem.",
    stack: ["React", "Vite", "Supabase", "Resend"],
    color: "#000000",
    url: "https://invitecodes.xyz",
    status: 'Live',
    likes: 42,
  },
  {
    title: "Learnable AI",
    description: "An AI-powered study companion for university students. Features automated GPA calculations and exam preparation workflows.",
    stack: ["React", "Vite", "SQL", "Gemini 1.5 Pro"],
    color: "#50e182",
    url: "https://www.learnable.fun",
    status: 'Live',
    likes: 310,
  },
  {
    title: "Saros SDK Docs",
    description: "Technical documentation site. Helps developers integrate the Saros network using Rust-based SDKs with clear guides and examples.",
    stack: ["React", "TypeScript", "Rust", "Technical Writing"],
    color: "#6e4efd",
    url: "https://sarodocs.hashnode.space",
    status: 'Live',
    likes: 28,
  },
  {
    title: "SuccinctStar",
    description: "An interactive educational platform teaching the complex concepts of Zero-Knowledge (ZK) infrastructure and verifiable computation.",
    stack: ["React", "TypeScript", "Supabase", "Vite"],
    color: "#fe11c5",
    url: "https://succinctstar.club",
    status: 'Sunsetted',
    likes: 67,
  },
  {
    title: "OptimumStar",
    description: "A gamified learning hub designed to teach the mechanics of high-performance memory infrastructure for blockchains.",
    stack: ["React", "TypeScript", "Supabase", "Vite"],
    color: "#be8dff",
    url: "https://optimumstar.quest",
    status: 'Sunsetted',
    likes: 45,
  },
  {
    title: "CodeBox",
    description: "A lightweight developer toolkit offering high-speed utilities and formatters, enhanced by AI-assisted workflows.",
    stack: ["React", "Vite", "TypeScript", "Supabase"],
    color: "#3B82F6",
    url: "https://codebox.help",
    status: 'Sunsetted',
    likes: 92,
  },
  {
    title: "This Portfolio",
    description: "An AI-native personal website featuring a custom \"Super-Intelligent\" assistant and real-time Google Calendar booking integration.",
    stack: ["React", "Tailwind CSS", "Gemini 1.5 Flash", "Google Cloud Run"],
    color: "#000000",
    url: "https://geometric-journal-portfolio-1023135672471.us-west1.run.app/",
    status: 'Live',
    likes: 999,
  }
];

const BaseIcon = (props: React.ComponentProps<'svg'>) => {
  return React.createElement(
    'svg',
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      height: "1em",
      width: "1em",
      ...props
    },
    React.createElement('circle', { cx: "12", cy: "12", r: "12" }),
    React.createElement('path', {
      d: "M7 12a5 5 0 0 1 10 0",
      stroke: "white",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeOpacity: "0.9",
      fill: "none"
    })
  );
};

const LovableIcon = (props: React.ComponentProps<'svg'>) => {
    return React.createElement('svg', {
        viewBox: "0 0 24 24",
        fill: "currentColor",
        height: "1em",
        width: "1em",
        ...props
    }, React.createElement('path', {
        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    }));
};

const AntigravityIcon = (props: React.ComponentProps<'svg'>) => {
    return React.createElement('svg', {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        height: "1em",
        width: "1em",
        ...props
    },
        React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
        React.createElement('path', { d: "M8 12l4-4 4 4" }),
        React.createElement('path', { d: "M12 8v8" })
    );
};

const GoogleStudioIcon = (props: React.ComponentProps<'svg'>) => {
    return React.createElement('svg', {
        viewBox: "0 0 24 24",
        fill: "currentColor",
        height: "1em",
        width: "1em",
        ...props
    }, React.createElement('path', {
        d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
    }));
};


export const TECH_ICONS: Record<string, React.ElementType> = {
  "React": SiReact,
  "TypeScript": SiTypescript,
  "Supabase": SiSupabase,
  "Google Cloud Run": SiGooglecloud,
  "Docker": SiDocker,
  "Gemini AI": FaGem,
  "Gemini": FaGem,
  "Gemini 1.5 Pro": FaGem,
  "Gemini 1.5 Flash": FaGem,
  "Solidity": SiSolidity,
  "Base": BaseIcon,
  "Base Chain": BaseIcon,
  "PostgreSQL": SiPostgresql,
  "Vite": SiVite,
  "Next.js": SiNextdotjs,
  "Rust": SiRust,
  "Coinbase Smart Wallet": SiCoinbase,
  "Coinbase SW": SiCoinbase,
  "Resend": SiResend,
  "WebSockets": SiSocketdotio,
  "Account Abstraction": VscTerminalCmd,
  "CapacitorJS": SiCapacitor,
  "Tailwind CSS": SiTailwindcss,
  "SQL": SiPostgresql,
  "Claude": SiAnthropic,
  "OpenAI": SiOpenai,
  "Cursor": FaCode, 
  "Python": VscTerminalCmd,
  "Lovable": LovableIcon,
  "Antigravity": AntigravityIcon,
  "Google AI Studio": GoogleStudioIcon
};

export const TECH_STACK = [
  { name: "Gemini", icon: FaGem },
  { name: "Claude", icon: SiAnthropic },
  { name: "OpenAI", icon: SiOpenai },
  { name: "Lovable", icon: LovableIcon },
  { name: "AI Studio", icon: GoogleStudioIcon },
  { name: "Antigravity", icon: AntigravityIcon },
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Solidity", icon: SiSolidity },
  { name: "Rust", icon: SiRust },
  { name: "Supabase", icon: SiSupabase },
  { name: "Google Cloud", icon: SiGooglecloud },
  { name: "Docker", icon: SiDocker },
  { name: "Base Chain", icon: BaseIcon },
  { name: "Vite", icon: SiVite },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Resend", icon: SiResend },
];