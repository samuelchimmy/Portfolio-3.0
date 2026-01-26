import React, { useState } from 'react';
import { Card } from './Card';
import { PROJECTS, TECH_ICONS } from '../data';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

const StatusBadge: React.FC<{ status: 'Live' | 'Building' | 'Sunsetted' }> = ({ status }) => {
  const statusStyles = {
    Live: 'bg-green-100 text-green-800 border-green-300',
    Building: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Sunsetted: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const liveAnimation = status === 'Live' ? {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  } : {};
  
  return (
    <motion.div 
      animate={liveAnimation}
      className={clsx("absolute top-3 right-3 px-2 py-0.5 text-[11px] font-bold rounded-full border leading-tight z-10", statusStyles[status])}
    >
      {status}
    </motion.div>
  );
};


export const ProjectShowcase: React.FC = () => {
  const [index, setIndex] = useState(0);

  const nextProject = () => setIndex((prev) => (prev + 1) % PROJECTS.length);
  const prevProject = () => setIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);

  const project = PROJECTS[index];

  return (
    <Card className="h-full relative group" title={`Showcase (${index + 1}/${PROJECTS.length})`} noPadding>
      <div className="h-full flex flex-col relative overflow-hidden bg-white">
        
        {/* Navigation Buttons - Absolute centered vertically */}
        <button 
          onClick={prevProject}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white border-2 border-black rounded-full shadow-hard hover:shadow-hard-pressed active:translate-y-1 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextProject}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white border-2 border-black rounded-full shadow-hard hover:shadow-hard-pressed active:translate-y-1 transition-all"
        >
          <ChevronRight size={20} />
        </button>

        <div className="flex-1 p-8 md:px-16 flex flex-col justify-center h-full">
          <AnimatePresence mode='wait'>
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col h-full justify-center relative"
            >
              <StatusBadge status={project.status} />
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <h3 
                  className="font-display text-4xl"
                  style={{ color: project.color }}
                >
                  {project.title}
                </h3>
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <ExternalLink size={18} />
                </a>
              </div>

              <p className="font-body text-xl text-gray-700 leading-relaxed mb-8">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.stack.map((tech) => {
                  const Icon = TECH_ICONS[tech];
                  return (
                  <span 
                    key={tech} 
                    className="flex items-center gap-1.5 px-3 py-1 border border-black rounded-full text-sm font-bold bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]"
                  >
                    {Icon && <Icon className="text-base" />}
                    {tech}
                  </span>
                )})}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-100 border-t-2 border-black flex">
          {PROJECTS.map((_, i) => (
            <div 
              key={i}
              className={`h-full flex-1 transition-colors duration-300 ${i === index ? 'bg-black' : 'bg-transparent'}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};