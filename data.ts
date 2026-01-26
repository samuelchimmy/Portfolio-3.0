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
} from 'react-icons/si';
import { FaGem } from 'react-icons/fa';
import { VscTerminalCmd } from 'react-icons/vsc';

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
    blog: "https://blog.0xnotes.lol/"
  },
  photoUrl: "https://picsum.photos/400/400?grayscale" // Placeholder grayscale
};

export interface Project {
  title: string;
  description: string;
  stack: string[];
  color: string;
  url: string;
  status: 'Live' | 'Building' | 'Sunsetted';
}

export const PROJECTS: Project[] = [
  {
    title: "MoniPay",
    description: "Decentralized SoftPOS protocol on Base replacing hardware terminals. Features a proprietary Gasless Relayer and 'Invisible Wallet' monitag architecture.",
    stack: ["React", "Base", "Solidity", "Supabase", "CapacitorJS"],
    color: "#0052FF",
    url: "https://monipay.xyz",
    status: 'Live',
  },
  {
    title: "Taxapp.ng",
    description: "Institutional-grade fiscal orchestration engine utilizing AI to optimize tax-efficiency pipelines for Nigerian entities.",
    stack: ["React", "Gemini AI", "Supabase"],
    color: "#10B981",
    url: "https://taxapp.ng",
    status: 'Building',
  },
  {
    title: "LighterDash",
    description: "Institutional DeFi intelligence platform delivering real-time liquidation heatmaps and high-frequency analytics.",
    stack: ["WebSockets", "React", "TanStack Query", "Gemini AI", "Supabase"],
    color: "#000000",
    url: "https://lighterdash.lol",
    status: 'Live',
  },
  {
    title: "BaseStory",
    description: "Privacy-preserving on-chain social layer on Base, leveraging Account Abstraction for gasless, anonymous content.",
    stack: ["Solidity", "Account Abstraction", "Supabase", "Coinbase Smart Wallet"],
    color: "#0052FF",
    url: "https://www.basestory.app",
    status: 'Live',
  },
  {
    title: "Invitecodes.xyz",
    description: "High-fidelity referral intelligence hub architected for the crypto-native ecosystem.",
    stack: ["React", "Vite", "Supabase", "Resend"],
    color: "#000000",
    url: "https://invitecodes.xyz",
    status: 'Live',
  },
  {
    title: "Learnable AI",
    description: "An AI-powered study companion for university students. Features automated GPA calculations and exam preparation workflows.",
    stack: ["React", "Vite", "SQL", "Gemini 1.5 Pro"],
    color: "#50e182",
    url: "https://www.learnable.fun",
    status: 'Live',
  },
  {
    title: "Saros SDK Docs",
    description: "Technical documentation site. Helps developers integrate the Saros network using Rust-based SDKs with clear guides and examples.",
    stack: ["React", "TypeScript", "Rust", "Technical Writing"],
    color: "#6e4efd",
    url: "https://sarodocs.hashnode.space",
    status: 'Live',
  },
  {
    title: "SuccinctStar",
    description: "An interactive educational platform teaching the complex concepts of Zero-Knowledge (ZK) infrastructure and verifiable computation.",
    stack: ["React", "TypeScript", "Supabase", "Vite"],
    color: "#fe11c5",
    url: "https://succinctstar.club",
    status: 'Sunsetted',
  },
  {
    title: "OptimumStar",
    description: "A gamified learning hub designed to teach the mechanics of high-performance memory infrastructure for blockchains.",
    stack: ["React", "TypeScript", "Supabase", "Vite"],
    color: "#be8dff",
    url: "https://optimumstar.quest",
    status: 'Sunsetted',
  },
  {
    title: "CodeBox",
    description: "A lightweight developer toolkit offering high-speed utilities and formatters, enhanced by AI-assisted workflows.",
    stack: ["React", "Vite", "TypeScript", "Supabase"],
    color: "#3B82F6",
    url: "https://codebox.help",
    status: 'Sunsetted',
  },
  {
    title: "This Portfolio",
    description: "An AI-native personal website featuring a custom \"Super-Intelligent\" assistant and real-time Google Calendar booking integration.",
    stack: ["React", "Tailwind CSS", "Gemini 1.5 Flash", "Google Cloud Run"],
    color: "#000000",
    url: "https://0xnotes.lol",
    status: 'Live',
  }
];

export const TECH_ICONS: Record<string, React.ElementType> = {
  "React": SiReact,
  "TypeScript": SiTypescript,
  "Supabase": SiSupabase,
  "Google Cloud Run": SiGooglecloud,
  "Docker": SiDocker,
  "Gemini AI": FaGem,
  "Gemini 1.5 Pro": FaGem,
  "Gemini 1.5 Flash": FaGem,
  "Solidity": SiSolidity,
  "Base": SiCoinbase,
  "Base Chain": SiCoinbase, // Keeping fallback just in case
  "PostgreSQL": SiPostgresql,
  "Vite": SiVite,
  "Next.js": SiNextdotjs,
  "Rust": SiRust,
  "Coinbase Smart Wallet": SiCoinbase,
  "Resend": SiResend,
  "WebSockets": SiSocketdotio,
  "Account Abstraction": VscTerminalCmd,
  "CapacitorJS": SiCapacitor,
  "Tailwind CSS": SiTailwindcss,
  "SQL": SiPostgresql, 
};

export const TECH_STACK = [
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Solidity", icon: SiSolidity },
  { name: "Rust", icon: SiRust },
  { name: "Supabase", icon: SiSupabase },
  { name: "Google Cloud", icon: SiGooglecloud },
  { name: "Docker", icon: SiDocker },
  { name: "Gemini", icon: FaGem },
  { name: "Base Chain", icon: SiCoinbase },
  { name: "Vite", icon: SiVite },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Resend", icon: SiResend },
];