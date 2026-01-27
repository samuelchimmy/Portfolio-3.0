import React, { useState } from 'react';
import { IdentityCard } from './components/IdentityCard';
import { AIChat } from './components/AIChat';
import { ProjectShowcase } from './ProjectShowcase';
import { TechMarquee } from './components/TechMarquee';
import { Availability } from './components/Availability';
import { StickmanScene } from './components/StickmanScene';
import { PROJECTS } from './data';

const App: React.FC = () => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      {/* Animation Layer */}
      <StickmanScene />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-[400px_300px_140px] gap-6">
        
        {/* 1. Identity Card: Left Column, Spans 2 Rows on Desktop */}
        <div className="lg:col-span-1 lg:row-span-2 h-[600px] lg:h-auto z-10">
          <IdentityCard />
        </div>

        {/* 2. AI Assistant: Top Right, Spans 2 Columns */}
        <div className="lg:col-span-3 lg:row-span-1 h-[500px] lg:h-full z-10">
          <AIChat currentProject={PROJECTS[currentProjectIndex]} />
        </div>

        {/* 3. Project Showcase: Middle Right, Spans 2 Columns */}
        <div className="lg:col-span-2 lg:row-span-1 h-[400px] lg:h-full z-10">
          <ProjectShowcase 
            currentIndex={currentProjectIndex} 
            setCurrentIndex={setCurrentProjectIndex} 
          />
        </div>

        {/* 4. Availability: Small Floating Card next to Projects */}
        {/* Increased mobile height from 200px to 340px for better calendar fit */}
        <div className="lg:col-span-1 lg:row-span-1 h-[340px] lg:h-full z-10">
          <Availability />
        </div>

        {/* 5. Tech Stack: Bottom Row, Full Width */}
        <div className="lg:col-span-4 lg:row-span-1 h-36 lg:h-full z-10">
          <TechMarquee />
        </div>

      </div>
    </div>
  );
};

export default App;