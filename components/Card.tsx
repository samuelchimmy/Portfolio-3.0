import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
  onClick?: () => void;
  id?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, noPadding = false, onClick, id }) => {
  return (
    <motion.div
      id={id}
      initial={{ y: 0, boxShadow: '2px 2px 2px rgba(0,0,0,0.15)' }}
      whileHover={{ y: -2, boxShadow: '4px 4px 6px rgba(0,0,0,0.1)' }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }} // Increased damping for stability
      onClick={onClick}
      className={clsx(
        "bg-white dark:bg-zinc-900 border-2 border-black dark:border-zinc-400 rounded-xl overflow-hidden flex flex-col relative transition-colors duration-300",
        // Removed shadow-hard class here as it's handled by motion.div initial/animate to prevent conflicts
        className
      )}
    >
      {/* Window Controls Header */}
      <div className="border-b-2 border-black dark:border-zinc-400 p-3 bg-gray-50 dark:bg-zinc-800 flex items-center justify-between shrink-0 relative z-20 transition-colors duration-300">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20" />
        </div>
        {title && (
          <span className="font-display text-sm tracking-wider text-black/70 dark:text-zinc-300 truncate ml-4">
            {title}
          </span>
        )}
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className={clsx("flex-1 min-h-0 relative z-10 text-black dark:text-zinc-100", !noPadding && "p-6")}>
        {children}
      </div>
    </motion.div>
  );
};