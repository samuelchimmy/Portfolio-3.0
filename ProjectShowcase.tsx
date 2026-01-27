import React, { useState, useEffect } from 'react';
import { Card } from './components/Card';
import { PROJECTS, TECH_ICONS } from './data';
import { ChevronLeft, ChevronRight, ExternalLink, Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

const StatusBadge: React.FC<{ status: 'Live' | 'Building' | 'Sunsetted' }> = ({ status }) => {
  const statusStyles = {
    Live: 'bg-green-600 text-white border-green-800',
    Building: 'bg-yellow-500 text-black border-yellow-600',
    Sunsetted: 'bg-gray-500 text-white border-gray-700'
  };

  const liveAnimation = status === 'Live' ? {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const }
  } : {};
  
  return (
    <motion.span 
      animate={liveAnimation}
      className={clsx("inline-block ml-2 px-1.5 py-[1px] text-[9px] uppercase tracking-wider font-bold rounded-sm border shadow-sm align-middle", statusStyles[status])}
    >
      {status}
    </motion.span>
  );
};

interface ProjectShowcaseProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ currentIndex, setCurrentIndex }) => {
  
  const nextProject = () => setCurrentIndex((currentIndex + 1) % PROJECTS.length);
  const prevProject = () => setCurrentIndex((currentIndex - 1 + PROJECTS.length) % PROJECTS.length);

  const project = PROJECTS[currentIndex];

  // Like Logic
  const [likes, setLikes] = useState(project.likes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Check localStorage for this specific project
    const storageKey = `liked_${project.title}`;
    const hasLiked = localStorage.getItem(storageKey) === 'true';
    
    setIsLiked(hasLiked);
    // If user has liked it on this device, add 1 to the base count from data
    // This ensures "Real Data" from the file is used as the source of truth
    setLikes(project.likes + (hasLiked ? 1 : 0));
  }, [project.title, project.likes]);

  const toggleLike = () => {
    const storageKey = `liked_${project.title}`;
    
    if (isLiked) {
      // Unlike
      localStorage.removeItem(storageKey);
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      // Like
      localStorage.setItem(storageKey, 'true');
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <Card className="h-full relative group" title={`Showcase (${currentIndex + 1}/${PROJECTS.length})`} noPadding>
      <div className="h-full flex flex-col relative overflow-hidden bg-white">
        
        {/* Navigation Buttons */}
        <button 
          onClick={prevProject}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 p-2 text-black/40 hover:text-black transition-colors focus:outline-none"
        >
          <ChevronLeft size={32} strokeWidth={1.5} />
        </button>
        <button 
          onClick={nextProject}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 p-2 text-black/40 hover:text-black transition-colors focus:outline-none"
        >
          <ChevronRight size={32} strokeWidth={1.5} />
        </button>

        <div className="flex-1 p-6 md:px-12 flex flex-col justify-center h-full">
          <AnimatePresence mode='wait'>
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col h-full justify-center relative"
            >
              {/* Header */}
              <div className="flex items-center mb-1 flex-wrap gap-y-1">
                <h3 
                  className="font-display text-3xl md:text-4xl"
                  style={{ color: project.color }}
                >
                  {project.title}
                </h3>
                <StatusBadge status={project.status} />
                <a 
                  href={project.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-black transition-colors ml-2"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Description */}
              <p className="font-body text-lg md:text-xl text-gray-700 leading-snug md:leading-relaxed mb-6">
                {project.description}
              </p>

              {/* Stack & Likes Row - Flattened for inline flow */}
              <div className="flex flex-wrap items-center gap-2 mt-auto">
                {project.stack.map((tech) => {
                  const Icon = TECH_ICONS[tech];
                  return (
                  <span 
                    key={tech} 
                    className="flex items-center gap-1 px-1.5 py-0.5 border border-black rounded-full text-[9px] md:text-xs font-bold bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)] whitespace-nowrap"
                  >
                    {Icon && <Icon className="text-xs md:text-sm" />}
                    {tech}
                  </span>
                )})}

                {/* Like Button */}
                <button 
                  onClick={toggleLike}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full hover:bg-gray-100 transition-colors group/heart"
                  aria-label={isLiked ? "Unlike project" : "Like project"}
                >
                  <Heart 
                    size={20} 
                    className={clsx(
                      "transition-all duration-300", 
                      isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-400 group-hover/heart:text-red-400"
                    )}
                  />
                  <span className={clsx("font-body text-sm font-bold transition-colors", isLiked ? "text-red-600" : "text-gray-500")}>
                    {likes}
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
};