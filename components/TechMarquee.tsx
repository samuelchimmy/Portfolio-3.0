import React from 'react';
import { Card } from './Card';
import { TECH_STACK } from '../data';
import { motion } from 'framer-motion';

export const TechMarquee: React.FC = () => {
  return (
    <Card className="w-full h-full overflow-hidden" title="Tech Stack" noPadding>
      <div className="flex items-center h-full bg-white relative overflow-hidden">
        <motion.div 
          className="flex gap-12 absolute whitespace-nowrap items-center"
          animate={{ x: [0, -1150] }}
          transition={{ 
            repeat: Infinity, 
            duration: 25, 
            ease: "linear" 
          }}
        >
          {/* Triple the array to create seamless loop */}
          {[...TECH_STACK, ...TECH_STACK, ...TECH_STACK].map((tech, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center gap-2 cursor-default w-24">
              <tech.icon className="text-4xl text-gray-600" />
              <span className="font-body text-sm text-gray-800 font-semibold truncate w-full text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </Card>
  );
};