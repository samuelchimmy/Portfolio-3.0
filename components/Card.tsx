import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, title, noPadding = false, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)' }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={clsx(
        "bg-white border-2 border-black shadow-hard rounded-xl overflow-hidden flex flex-col relative",
        className
      )}
    >
      {/* Window Controls Header */}
      <div className="border-b-2 border-black p-3 bg-gray-50 flex items-center justify-between shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/20" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/20" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/20" />
        </div>
        {title && (
          <span className="font-display text-sm tracking-wider text-black/70 truncate ml-4">
            {title}
          </span>
        )}
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className={clsx("flex-1 h-full", !noPadding && "p-6")}>
        {children}
      </div>
    </motion.div>
  );
};