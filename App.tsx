import React, { useState, useEffect } from 'react';
import { IdentityCard } from './components/IdentityCard';
import { AIChat } from './components/AIChat';
import { ProjectShowcase } from './ProjectShowcase';
import { TechMarquee } from './components/TechMarquee';
import { Availability } from './components/Availability';
import { StickmanScene } from './components/StickmanScene';
import { PROJECTS, PSEO_CONFIG, SEO } from './data';
import { ThemeProvider } from './components/ThemeContext';

const AppContent: React.FC = () => {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [overrideConfig, setOverrideConfig] = useState<any>(null);

  // --- NATIVE ROUTING LOGIC ---
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);
      
      // Check for /hire/:persona
      if (parts.length >= 2 && parts[0] === 'hire') {
        const personaSlug = parts[1];
        if (PSEO_CONFIG[personaSlug]) {
          setOverrideConfig(PSEO_CONFIG[personaSlug]);
          return;
        }
      }
      
      setOverrideConfig(null);
    };

    // Run on mount
    handleRoute();

    // Listen for popstate (back/forward button)
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  // --- SEO INJECTION ---
  useEffect(() => {
    // 1. Title
    document.title = overrideConfig?.metaTitle || SEO.title;

    // 2. Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    const newDesc = overrideConfig?.metaDescription || SEO.description;
    if (metaDesc) {
      metaDesc.setAttribute('content', newDesc);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'description';
      newMeta.content = newDesc;
      document.head.appendChild(newMeta);
    }

    // 3. Keywords
    const metaKeys = document.querySelector('meta[name="keywords"]');
    const newKeys = overrideConfig?.keywords || SEO.keywords;
    if (metaKeys) {
      metaKeys.setAttribute('content', newKeys);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.name = 'keywords';
      newMeta.content = newKeys;
      document.head.appendChild(newMeta);
    }
  }, [overrideConfig]);

  // Apply accent color override globally
  useEffect(() => {
    if (overrideConfig?.accentColor) {
      document.documentElement.style.setProperty('--accent-color', overrideConfig.accentColor);
    } else {
       document.documentElement.style.removeProperty('--accent-color');
    }
  }, [overrideConfig]);

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center transition-colors duration-300">
      {/* Animation Layer */}
      <StickmanScene />
      
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-[400px_300px_140px] gap-6">
        
        {/* 1. Identity Card */}
        <div className="lg:col-span-1 lg:row-span-2 h-[600px] lg:h-auto z-10">
          <IdentityCard overrideProfile={overrideConfig} />
        </div>

        {/* 2. AI Assistant */}
        <div className="lg:col-span-3 lg:row-span-1 h-[500px] lg:h-full z-10">
          <AIChat 
            currentProject={PROJECTS[currentProjectIndex]} 
            systemInstructionExtras={overrideConfig?.aiSystemInstructionExtras}
            accentColor={overrideConfig?.accentColor}
          />
        </div>

        {/* 3. Project Showcase */}
        <div className="lg:col-span-2 lg:row-span-1 h-[400px] lg:h-full z-10">
          <ProjectShowcase 
            currentIndex={currentProjectIndex} 
            setCurrentIndex={setCurrentProjectIndex} 
          />
        </div>

        {/* 4. Availability */}
        <div className="lg:col-span-1 lg:row-span-1 h-[340px] lg:h-full z-10">
          <Availability />
        </div>

        {/* 5. Tech Stack */}
        <div className="lg:col-span-4 lg:row-span-1 h-36 lg:h-full z-10">
          <TechMarquee />
        </div>

      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;