import React, { useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';
import { THEME } from '../data';

// --- PERSONALITY DATA ---

const PHRASES_A = [ // The Architect (Black/White) - Technical, Cynical, Backend, Crypto-Native
  "I optimize for O(1) interactions.",
  "Hire him, or I delete the database.",
  "My neck hurts from looking at that div.",
  "Did you check the console logs?",
  "I'm actually just a bunch of lines.",
  "Refactoring my life choices...",
  "Zero-knowledge proof that I exist.",
  "Is it time for a coffee break?",
  "I've seen the source code. It's beautiful.",
  "Don't click me, I'm stateless.",
  "Deploying personality...",
  "I speak purely in binary.",
  "Gas fees are killing me today.",
  "Not your keys, not your pixels.",
  "I prefer Solidity to English.",
  "This grid is mathematically perfect.",
  "Garbage collection is my hobby.",
  "I dream in SQL queries.",
  "Is this component memoized?",
  "Rust is the answer. Always.",
  "I'm judging your cursor velocity.",
  "Don't touch the border radius.",
  "I live in the DOM tree.",
  "Decentralize the div.",
  "My rate is indexed in ETH.",
  "Did you optimize that asset?",
  "Too many re-renders on the left.",
  "I see a race condition...",
  "The backend is the real hero.",
  "Checking the smart contract...",
  "Base chain is the future.",
  "Sleep is just a blocking process.",
  "Docs or it didn't happen.",
  "I am a sovereign entity.",
  "Have you tried turning it off and on?",
  "404: Motivation not found.",
  "This shadow offset is exactly 2px."
];

const PHRASES_B = [ // The Optimist (Accent Color) - UI/UX, Hiring, Cheerful, Hype-Man
  "I'm the green flag you're looking for!",
  "Look at those smooth animations.",
  "Let's schedule a meeting!",
  "Does this pixel make me look good?",
  "100% test coverage on my heart.",
  "Ready to scale!",
  "I think we're trending.",
  "Checking availability...",
  "Best view in the viewport.",
  "User experience is my passion.",
  "Ship it!",
  "Did someone say 'Hired'?",
  "Samuel is a total 10x dev!",
  "Look at that commit streak!",
  "WAGMI friend, WAGMI.",
  "This font pairing? Chef's kiss.",
  "He fixes bugs before they exist.",
  "Let's get that offer letter signed!",
  "Best ROI in the tech stack.",
  "Feel that tactile button click?",
  "Tailwind is my love language.",
  "Building the future on Base!",
  "To the moon! 🚀",
  "Don't be shy, book a call!",
  "The UX flow is buttery smooth.",
  "We are trending on localHost.",
  "Green flags all around!",
  "Web3 is just getting started.",
  "I love this digital house.",
  "Click the AI, it's super smart.",
  "Ready for the next sprint?",
  "Shipping code like it's Amazon.",
  "Vibe check passed.",
  "Pure aesthetic.",
  "This portfolio slaps.",
  "I'm feeling bullish on this code.",
  "Mobile responsive? You bet."
];

interface Bubble {
    text: string;
    targetX: number; // The stickman head position
    targetY: number;
    startTime: number;
    duration: number;
    isRightSide: boolean; // Preferred side
    actor: 'A' | 'B';
}

export const StickmanScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  const themeRef = useRef(theme);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const actorsRef = useRef({ a: {x:0, y:0}, b: {x:0, y:0} });
  const bubblesRef = useRef<Bubble[]>([]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Interaction Event Listeners
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
        const mx = e.clientX;
        const my = e.clientY;
        const now = Date.now();
        
        // Hit Test A (The Architect)
        const posA = actorsRef.current.a;
        if (Math.hypot(mx - posA.x, my - posA.y) < 60) {
            bubblesRef.current.push({
                text: PHRASES_A[Math.floor(Math.random() * PHRASES_A.length)],
                targetX: posA.x,
                targetY: posA.y - 22, 
                startTime: now,
                duration: 4000, // Slightly longer reading time
                isRightSide: false,
                actor: 'A'
            });
            return;
        }

        // Hit Test B (The Optimist)
        const posB = actorsRef.current.b;
        if (Math.hypot(mx - posB.x, my - posB.y) < 60) {
            bubblesRef.current.push({
                text: PHRASES_B[Math.floor(Math.random() * PHRASES_B.length)],
                targetX: posB.x,
                targetY: posB.y - 22,
                startTime: now,
                duration: 4000,
                isRightSide: true,
                actor: 'B'
            });
        }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('click', handleClick);
    return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = Date.now();

    // --- CONFIGURATION ---
    const COLOR_B = THEME.accentColor; // Dynamic Accent Color
    const LINE_WIDTH = 2;
    const HEAD_R = 7;
    const TORSO_LEN = 22;
    const LEG_LEN = 22;
    const OFFSET_SIT = 15; 

    // --- MATH HELPERS ---
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
    const easeInOut = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    const parabolicJump = (startX: number, startY: number, endX: number, endY: number, height: number, t: number) => {
      const x = lerp(startX, endX, t);
      const linearY = lerp(startY, endY, t);
      const arc = height * 4 * t * (1 - t); 
      return { x, y: linearY - arc };
    };

    // --- DRAWING PRIMITIVES ---
    const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = color;
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const drawCircle = (x: number, y: number, r: number, color: string, fill: boolean = false) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (fill) {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();
      }
    };

    const drawCloudBubble = (bubble: Bubble) => {
        const elapsedBubble = Date.now() - bubble.startTime;
        if (elapsedBubble > bubble.duration) return;

        const isDark = themeRef.current === 'dark';
        const bg = isDark ? '#27272a' : '#ffffff'; // slightly lighter zinc for dark mode bubble
        const fg = isDark ? '#ffffff' : '#000000';
        
        // Fade out logic
        const fadeStart = bubble.duration - 500;
        let opacity = 1;
        if (elapsedBubble > fadeStart) {
            opacity = 1 - ((elapsedBubble - fadeStart) / 500);
        }
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = `12px ${THEME.bodyFont}`; // Dynamic Font
        const padding = 12;
        const textMetrics = ctx.measureText(bubble.text);
        const textWidth = textMetrics.width;
        const boxW = textWidth + padding * 2;
        const boxH = 32;
        
        // --- SMART POSITIONING & CLAMPING ---
        // 1. Determine ideal position
        let offsetX = bubble.isRightSide ? 30 : -(boxW + 30);
        let offsetY = -50; // Ideally above head

        let bx = bubble.targetX + offsetX;
        let by = bubble.targetY + offsetY;

        // 2. Horizontal Clamping (Keep inside screen)
        const margin = 10;
        if (bx < margin) {
            bx = margin; // Hit left edge
        } else if (bx + boxW > canvas.width / (window.devicePixelRatio || 1) - margin) {
            bx = (canvas.width / (window.devicePixelRatio || 1)) - boxW - margin; // Hit right edge
        }

        // 3. Vertical Clamping (If too high, flip to side/below, but prioritize visibility)
        // If it goes off top, push it down.
        if (by < margin) {
            by = bubble.targetY + 20; // Move below head if top is clipped
        }

        // Draw Cloud Shape (Rounded Rect approximation for "Cloud")
        ctx.beginPath();
        ctx.fillStyle = bg;
        ctx.strokeStyle = fg;
        ctx.lineWidth = 1.5;
        
        const r = 16; // Very rounded corners for cloud effect
        ctx.beginPath();
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + boxW - r, by);
        ctx.quadraticCurveTo(bx + boxW, by, bx + boxW, by + r);
        ctx.lineTo(bx + boxW, by + boxH - r);
        ctx.quadraticCurveTo(bx + boxW, by + boxH, bx + boxW - r, by + boxH);
        ctx.lineTo(bx + r, by + boxH);
        ctx.quadraticCurveTo(bx, by + boxH, bx, by + boxH - r);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw Thought Dots (Connecting bubble to head)
        // Calculate closest point on bubble to head
        const headX = bubble.targetX;
        const headY = bubble.targetY;
        const bubbleCenterX = bx + boxW / 2;
        const bubbleCenterY = by + boxH / 2;
        
        // Draw 3 dots lerping towards head
        ctx.fillStyle = bg;
        const dotCount = 3;
        for (let i = 1; i <= dotCount; i++) {
            const t = i / (dotCount + 1);
            // Interpolate from Head to Bubble Center
            // But stop short of the bubble center to keep dots outside
            const dotX = lerp(headX, bubbleCenterX, t * 0.6); 
            const dotY = lerp(headY, bubbleCenterY, t * 0.6);
            const dotR = 2 + (i * 0.5); // Growing size
            
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        
        // Text
        ctx.fillStyle = fg;
        ctx.textAlign = 'center'; // Center text in cloud
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.text, bx + boxW / 2, by + boxH / 2 + 2);
        
        ctx.restore();
    }

    // --- RENDER LOOP ---
    const render = () => {
      // 1. Setup Canvas & Targets
      const idCard = document.getElementById('identity-card');
      const aiCard = document.getElementById('ai-assistant-card');

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = window.innerWidth;
      const cssHeight = window.innerHeight;
      
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      ctx.scale(dpr, dpr);

      const COLOR_A = themeRef.current === 'dark' ? '#e5e5e5' : '#1e1e1e';

      if (!idCard || !aiCard) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // 2. Geometry Anchors
      const idRect = idCard.getBoundingClientRect();
      const aiRect = aiCard.getBoundingClientRect();
      const idFloor = idRect.top; 
      const aiFloor = aiRect.top;
      const idLeft = idRect.left;
      const idRight = idRect.right;
      const aiLeft = aiRect.left;
      const aiRight = aiRect.right;
      const aiCenter = aiRect.left + aiRect.width / 2;
      const idOuterSit = idLeft + OFFSET_SIT;
      const idInnerSit = idRight - OFFSET_SIT;
      const aiInnerSit = aiLeft + OFFSET_SIT;
      const aiOuterSit = aiRight - OFFSET_SIT;

      // Time
      const elapsed = (Date.now() - startTime) / 1000;
      const walkCycle = elapsed * 6;
      const danceCycle = elapsed * 12;

      // State Variables
      let ax = idOuterSit, ay = idFloor;
      let bx = aiOuterSit, by = aiFloor;
      let aPose = 'sit_relaxed'; 
      let bPose = 'sit_relaxed';
      let aFace = -1; 
      let bFace = 1;
      let aAction = 'idle';
      let bAction = 'idle';

      // --- CINEMATIC DIRECTOR (24s Loop) ---

      // PHASE 1: LOUNGING (0s - 4s)
      if (elapsed < 4.0) {
        ax = idOuterSit; ay = idFloor; aPose = 'sit_relaxed'; aFace = -1;
        bx = aiOuterSit; by = aiFloor; bPose = 'sit_relaxed'; bFace = 1;
      } 
      // PHASE 2: WAKE UP & WAVE (4s - 6s)
      else if (elapsed < 6.0) {
        aPose = 'stand'; bPose = 'stand';
        ax = idOuterSit; bx = aiOuterSit;
        aFace = 1; bFace = -1;
        if (elapsed > 5.0) { aAction = 'wave'; bAction = 'wave'; }
      }
      // PHASE 3: THE CROSSING (6s - 12s)
      else if (elapsed < 12.0) {
        const phaseTime = elapsed - 6.0;
        bPose = 'walk'; bFace = -1;
        const walkB = easeInOut(clamp(phaseTime / 4.0, 0, 1));
        bx = lerp(aiOuterSit, aiCenter + 25, walkB);

        if (phaseTime < 2.0) {
            const t = phaseTime / 2.0; aPose = 'walk'; aFace = 1;
            ax = lerp(idOuterSit, idRight, t); ay = idFloor;
        } else if (phaseTime < 3.0) {
            const t = (phaseTime - 2.0) / 1.0; aPose = 'jump'; aFace = 1;
            const jumpPos = parabolicJump(idRight, idFloor, aiLeft, aiFloor, 60, t);
            ax = jumpPos.x; ay = jumpPos.y;
        } else {
            const t = clamp((phaseTime - 3.0) / 2.0, 0, 1); aPose = 'walk'; aFace = 1;
            ax = lerp(aiLeft, aiCenter - 25, t); ay = aiFloor;
        }
      }
      // PHASE 4: INTERACTION (12s - 16s)
      else if (elapsed < 16.0) {
        ax = aiCenter - 25; bx = aiCenter + 25; ay = aiFloor; by = aiFloor;
        aPose = 'dance'; bPose = 'dance'; aFace = 1; bFace = -1;
        if (elapsed > 14.5) { aPose = 'stand'; bPose = 'stand'; aAction = 'shake'; bAction = 'shake'; }
      }
      // PHASE 5: THE RETREAT (16s - 20s)
      else if (elapsed < 20.0) {
        const phaseTime = elapsed - 16.0;
        aFace = -1; bFace = 1; 
        bPose = 'walk';
        const walkB = easeInOut(clamp(phaseTime / 3.0, 0, 1));
        bx = lerp(aiCenter + 25, aiInnerSit, walkB); 
        if (walkB >= 1) bFace = -1; 

        if (phaseTime < 1.5) {
            const t = phaseTime / 1.5; aPose = 'walk'; ax = lerp(aiCenter - 25, aiLeft, t); ay = aiFloor;
        } else if (phaseTime < 2.5) {
            const t = (phaseTime - 1.5) / 1.0; aPose = 'jump'; aFace = -1;
            const jumpPos = parabolicJump(aiLeft, aiFloor, idRight, idFloor, 60, t);
            ax = jumpPos.x; ay = jumpPos.y;
        } else {
            const t = clamp((phaseTime - 2.5) / 1.0, 0, 1); aPose = 'walk'; aFace = -1;
            ax = lerp(idRight, idInnerSit, t); ay = idFloor;
            if (t >= 1) aFace = 1; 
        }
      }
      // PHASE 6: FINAL CHAT (20s+)
      else {
        ax = idInnerSit; ay = idFloor; aPose = 'sit_relaxed'; aFace = 1;
        bx = aiInnerSit; by = aiFloor; bPose = 'sit_relaxed'; bFace = -1;
      }

      // Update Refs for Hit Testing (for click interactions)
      actorsRef.current.a = { x: ax, y: ay };
      actorsRef.current.b = { x: bx, y: by };

      // --- ARTIST (DRAWING LOGIC) ---
      
      const drawStickman = (x: number, y: number, color: string, pose: string, action: string, faceDir: number) => {
        let hipY = y;
        let neckX = x;
        let neckY = y - TORSO_LEN;

        // 1. RELAXED SITTING
        if (pose === 'sit_relaxed') {
             const leanAngle = 0.26;
             hipY = y;
             neckX = x - (Math.sin(leanAngle) * TORSO_LEN * faceDir);
             neckY = hipY - (Math.cos(leanAngle) * TORSO_LEN);

             // Draw Head with Rotation Logic
             const headX = neckX;
             const headY = neckY - HEAD_R;
             
             // Default eyes direction
             let eyeOffsetX = 2 * faceDir; 
             let eyeOffsetY = 0;

             // Mouse Tracking (Look at cursor if close)
             const mx = mouseRef.current.x;
             const my = mouseRef.current.y;
             const distToMouse = Math.hypot(mx - headX, my - headY);
             if (distToMouse < 200) {
                 const angle = Math.atan2(my - headY, mx - headX);
                 // Clamp eye movement radius to 3px
                 eyeOffsetX = Math.cos(angle) * 3;
                 eyeOffsetY = Math.sin(angle) * 3;
             }
             
             drawCircle(headX, headY, HEAD_R, color);
             // Eyes
             drawCircle(headX + eyeOffsetX, headY + eyeOffsetY, 1, color, true);

             // Body parts
             drawLine(x, hipY, neckX, neckY, color);
             const shoulderX = neckX;
             const shoulderY = neckY + 4;
             const handX = x - (20 * faceDir); 
             const handY = y;
             drawLine(shoulderX, shoulderY, handX, handY, color);
             const kneeX = x + (OFFSET_SIT * faceDir);
             const kneeY = y;
             drawLine(x, hipY, kneeX, kneeY, color);
             const swing = Math.sin(elapsed * 2) * 3; 
             const footX = kneeX + swing;
             const footY = y + LEG_LEN;
             drawLine(kneeX, kneeY, footX, footY, color);
             drawLine(x, hipY, kneeX, kneeY, color); 
             drawLine(kneeX, kneeY, footX + 4, footY - 2, color); 
        } 
        else if (pose === 'jump') {
             hipY = y - 15; 
             neckY = hipY - TORSO_LEN;
             neckX = x;
             
             // Head (No tracking in Jump)
             drawLine(x, hipY, x, neckY, color);
             drawCircle(x, neckY - HEAD_R, HEAD_R, color);
             drawCircle(x + (2*faceDir), neckY - HEAD_R, 1, color, true); // Static eyes

             const kneeX = x - (5 * faceDir);
             const kneeY = hipY + 5;
             const footX = x - (8 * faceDir);
             const footY = hipY + 12;
             drawLine(x, hipY, kneeX, kneeY, color);
             drawLine(kneeX, kneeY, footX, footY, color);
             drawLine(x, hipY, kneeX+3, kneeY+2, color);
             drawLine(kneeX+3, kneeY+2, footX+3, footY+2, color);
             const shoulderY = neckY + 4;
             drawLine(x, shoulderY, x + (15*faceDir), shoulderY - 5, color);
        } 
        else if (pose === 'dance') {
             const bounce = Math.abs(Math.sin(danceCycle)) * 4;
             hipY = y - LEG_LEN - bounce;
             neckY = hipY - TORSO_LEN;
             neckX = x;

             // Legs
             const lKneeX = x - 8; const lKneeY = hipY + 10; const lFootX = x - 12; const lFootY = y;
             const rKneeX = x + 8; const rKneeY = hipY + 10; const rFootX = x + 12; const rFootY = y;
             drawLine(x, hipY, lKneeX, lKneeY, color); drawLine(lKneeX, lKneeY, lFootX, lFootY, color);
             drawLine(x, hipY, rKneeX, rKneeY, color); drawLine(rKneeX, rKneeY, rFootX, rFootY, color);

             // Body
             drawLine(x, hipY, x, neckY, color);
             // Head (No Tracking)
             drawCircle(x, neckY - HEAD_R, HEAD_R, color);
             // Eyes (Straight)
             drawCircle(x, neckY - HEAD_R, 1, color, true);

             const shoulderY = neckY + 4;
             const wave = Math.sin(elapsed * 20) * 10;
             drawLine(x, shoulderY, x - 12, shoulderY - 10 + wave, color);
             drawLine(x, shoulderY, x + 12, shoulderY - 10 - wave, color);
        } 
        else { // Stand/Walk
             hipY = y - LEG_LEN;
             neckY = hipY - TORSO_LEN;
             neckX = x;

             // Legs
             const stride = pose === 'walk' ? 6 : 0;
             const lift = pose === 'walk' ? 3 : 0;
             const phase = pose === 'walk' ? walkCycle : 0;
             const lPhase = Math.sin(phase);
             const rPhase = Math.sin(phase + Math.PI);
             const lKneeX = x + (lPhase * stride * 0.6);
             const lKneeY = hipY + 11 - (Math.abs(lPhase) * lift);
             const lFootX = x + (lPhase * stride);
             const lFootY = y - (Math.max(0, lPhase) * lift);
             const rKneeX = x + (rPhase * stride * 0.6);
             const rKneeY = hipY + 11 - (Math.abs(rPhase) * lift);
             const rFootX = x + (rPhase * stride);
             const rFootY = y - (Math.max(0, rPhase) * lift);
             drawLine(x, hipY, lKneeX, lKneeY, color); drawLine(lKneeX, lKneeY, lFootX, lFootY, color);
             drawLine(x, hipY, rKneeX, rKneeY, color); drawLine(rKneeX, rKneeY, rFootX, rFootY, color);

             // Body
             drawLine(x, hipY, x, neckY, color);
             
             // Head Tracking Logic
             const headX = neckX;
             const headY = neckY - HEAD_R;
             let eyeOffsetX = 2 * faceDir; 
             let eyeOffsetY = 0;
             
             const mx = mouseRef.current.x;
             const my = mouseRef.current.y;
             const distToMouse = Math.hypot(mx - headX, my - headY);
             
             if (distToMouse < 200) {
                 const angle = Math.atan2(my - headY, mx - headX);
                 eyeOffsetX = Math.cos(angle) * 3;
                 eyeOffsetY = Math.sin(angle) * 3;
             }
             drawCircle(headX, headY, HEAD_R, color);
             drawCircle(headX + eyeOffsetX, headY + eyeOffsetY, 1, color, true);

             // Arms
             const shoulderY = neckY + 4;
             if (action === 'wave') {
                 drawLine(x, shoulderY, x - 4, hipY, color); 
                 const wave = Math.sin(elapsed * 10);
                 const elbowX = x + (10*faceDir);
                 const elbowY = shoulderY - 2;
                 const handX = elbowX + (3 * wave);
                 const handY = elbowY - 8 + (2 * wave);
                 drawLine(x, shoulderY, elbowX, elbowY, color);
                 drawLine(elbowX, elbowY, handX, handY, color);
             } else if (action === 'shake') {
                 const reachX = x + (12 * faceDir);
                 const reachY = shoulderY + 5 + Math.sin(elapsed * 20)*2;
                 drawLine(x, shoulderY, reachX, reachY, color);
                 drawLine(x, shoulderY, x - 4, hipY, color);
             } else {
                 drawLine(x, shoulderY, x - 4, hipY, color);
                 drawLine(x, shoulderY, x + 4, hipY, color);
             }
        }
      };

      // Draw Actors
      drawStickman(ax, ay, COLOR_A, aPose, aAction, aFace);
      drawStickman(bx, by, COLOR_B, bPose, bAction, bFace);

      // Draw Bubbles
      // Remove expired bubbles
      bubblesRef.current = bubblesRef.current.filter(b => Date.now() - b.startTime < b.duration);
      bubblesRef.current.forEach(b => drawCloudBubble(b));

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []); 

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};