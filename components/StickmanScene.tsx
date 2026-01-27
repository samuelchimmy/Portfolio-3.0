import React, { useEffect, useRef } from 'react';

export const StickmanScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = Date.now();

    // --- CONFIGURATION ---
    const COLOR_A = '#1e1e1e'; // Black
    const COLOR_B = '#22c55e'; // Green
    const LINE_WIDTH = 2;
    const HEAD_R = 7;
    const TORSO_LEN = 22;
    const LEG_LEN = 22;
    
    // Safety buffer: How far inside the card to sit so butt is on "roof"
    const OFFSET_SIT = 15; 

    // --- MATH HELPERS ---
    const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
    const easeInOut = (t: number) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    
    // Parabolic Arc: Height reduced for "Low Hop"
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

    const drawCircle = (x: number, y: number, r: number, color: string) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = LINE_WIDTH;
      ctx.stroke();
    };

    // --- RENDER LOOP ---
    const render = () => {
      // 1. Setup Canvas & Targets
      const idCard = document.getElementById('identity-card');
      const aiCard = document.getElementById('ai-assistant-card');

      // --- HIGH DPI FIX ---
      const dpr = window.devicePixelRatio || 1;
      
      // Set Actual Pixel Resolution (Physical Pixels)
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Enforce CSS Display Size (Logical Pixels)
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      // Normalize Coordinate System: Scale all drawing ops to match logical pixels
      ctx.scale(dpr, dpr);

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

      // Sitting Anchors (Inset by OFFSET_SIT to keep hips on the card)
      const idOuterSit = idLeft + OFFSET_SIT;
      const idInnerSit = idRight - OFFSET_SIT;
      const aiInnerSit = aiLeft + OFFSET_SIT;
      const aiOuterSit = aiRight - OFFSET_SIT;

      // Time
      const elapsed = (Date.now() - startTime) / 1000;
      const walkCycle = elapsed * 6; // Slower walk
      const danceCycle = elapsed * 12;

      // State Variables
      let ax = idOuterSit, ay = idFloor;
      let bx = aiOuterSit, by = aiFloor;
      let aPose = 'sit_relaxed'; // sit_relaxed, stand, walk, jump, dance
      let bPose = 'sit_relaxed';
      let aFace = -1; // -1 Left, 1 Right
      let bFace = 1;
      let aAction = 'idle';
      let bAction = 'idle';

      // --- CINEMATIC DIRECTOR (24s Loop) ---

      // PHASE 1: LOUNGING (0s - 4s)
      if (elapsed < 4.0) {
        // A: Left Edge (Outer), facing Left
        ax = idOuterSit;
        ay = idFloor;
        aPose = 'sit_relaxed';
        aFace = -1;

        // B: Right Edge (Outer), facing Right
        bx = aiOuterSit;
        by = aiFloor;
        bPose = 'sit_relaxed';
        bFace = 1;
      } 
      
      // PHASE 2: WAKE UP & WAVE (4s - 6s)
      else if (elapsed < 6.0) {
        // Transition to Stand
        const standTime = clamp((elapsed - 4.0) / 1.0, 0, 1); // 1s to stand
        
        if (standTime < 1) {
             aPose = 'stand'; // Logic in drawer will handle interpolation if needed, or snap is okay for "getting up"
             bPose = 'stand';
        } else {
             aPose = 'stand';
             bPose = 'stand';
        }
        
        ax = idOuterSit;
        bx = aiOuterSit;
        
        // Turn Inward
        aFace = 1;
        bFace = -1;

        // Wave (5s+)
        if (elapsed > 5.0) {
            aAction = 'wave';
            bAction = 'wave';
        }
      }

      // PHASE 3: THE CROSSING (6s - 12s)
      else if (elapsed < 12.0) {
        const phaseTime = elapsed - 6.0; // 0 to 6s
        
        // --- Character B: Slow Walk to Center ---
        bPose = 'walk';
        bFace = -1;
        // Walk for 4s, then wait
        const walkB = easeInOut(clamp(phaseTime / 4.0, 0, 1));
        bx = lerp(aiOuterSit, aiCenter + 25, walkB);

        // --- Character A: Walk -> Jump -> Walk ---
        // 0-2s: Walk ID Outer -> ID Edge
        // 2-3s: Jump
        // 3-5s: Walk AI Edge -> AI Center
        
        if (phaseTime < 2.0) {
            // Walk to Jump Point
            const t = phaseTime / 2.0;
            aPose = 'walk';
            aFace = 1;
            ax = lerp(idOuterSit, idRight, t); // Walk to absolute edge
            ay = idFloor;
        } else if (phaseTime < 3.0) {
            // Jump (Low Arc)
            const t = (phaseTime - 2.0) / 1.0;
            aPose = 'jump';
            aFace = 1;
            const jumpPos = parabolicJump(idRight, idFloor, aiLeft, aiFloor, 60, t); // Height 60
            ax = jumpPos.x;
            ay = jumpPos.y;
        } else {
            // Walk to Meet
            const t = clamp((phaseTime - 3.0) / 2.0, 0, 1);
            aPose = 'walk';
            aFace = 1;
            ax = lerp(aiLeft, aiCenter - 25, t);
            ay = aiFloor;
        }
      }

      // PHASE 4: INTERACTION (12s - 16s)
      else if (elapsed < 16.0) {
        ax = aiCenter - 25;
        bx = aiCenter + 25;
        ay = aiFloor;
        by = aiFloor;
        aPose = 'dance';
        bPose = 'dance';
        aFace = 1;
        bFace = -1;
        
        // Shake hands after dance
        if (elapsed > 14.5) {
            aPose = 'stand';
            bPose = 'stand';
            aAction = 'shake';
            bAction = 'shake';
        }
      }

      // PHASE 5: THE RETREAT (16s - 20s)
      else if (elapsed < 20.0) {
        const phaseTime = elapsed - 16.0; // 0 to 4s
        
        // Turn Away
        aFace = -1;
        // B turns to face their spot
        bFace = 1; // B goes right

        // --- Character B: Walk Back ---
        bPose = 'walk';
        const walkB = easeInOut(clamp(phaseTime / 3.0, 0, 1));
        bx = lerp(aiCenter + 25, aiInnerSit, walkB); // To gap edge
        bFace = -1; // Facing left (gap) when arrived? No, walking Right.
        if (walkB >= 1) bFace = -1; // Turn to face gap once arrived

        // --- Character A: Walk Back -> Jump Back ---
        // 0-1.5s: Walk Center -> AI Edge
        // 1.5-2.5s: Jump Back
        // 2.5-3.5s: Walk ID Edge -> ID Inner Sit
        
        if (phaseTime < 1.5) {
            const t = phaseTime / 1.5;
            aPose = 'walk';
            ax = lerp(aiCenter - 25, aiLeft, t);
            ay = aiFloor;
        } else if (phaseTime < 2.5) {
            const t = (phaseTime - 1.5) / 1.0;
            aPose = 'jump';
            aFace = -1;
            const jumpPos = parabolicJump(aiLeft, aiFloor, idRight, idFloor, 60, t);
            ax = jumpPos.x;
            ay = jumpPos.y;
        } else {
            const t = clamp((phaseTime - 2.5) / 1.0, 0, 1);
            aPose = 'walk';
            aFace = -1;
            ax = lerp(idRight, idInnerSit, t); // Walk to sit spot
            ay = idFloor;
            if (t >= 1) aFace = 1; // Turn to face gap
        }
      }

      // PHASE 6: FINAL CHAT (20s+)
      else {
        // A: ID Inner Edge, facing Right (Gap)
        ax = idInnerSit;
        ay = idFloor;
        aPose = 'sit_relaxed';
        aFace = 1;

        // B: AI Inner Edge, facing Left (Gap)
        bx = aiInnerSit;
        by = aiFloor;
        bPose = 'sit_relaxed';
        bFace = -1;
      }

      // --- ARTIST (DRAWING LOGIC) ---
      
      const drawStickman = (x: number, y: number, color: string, pose: string, action: string, faceDir: number) => {
        let hipY = y;
        
        // 1. RELAXED SITTING
        if (pose === 'sit_relaxed') {
             // Logic: Leaning back away from faceDir
             // If facing Left (-1), back is to Right (+). Lean X is +
             // If facing Right (1), back is to Left (-). Lean X is -
             // Lean Angle: 15 deg = ~0.26 rad
             const leanAngle = 0.26;
             
             hipY = y;
             const neckX = x - (Math.sin(leanAngle) * TORSO_LEN * faceDir);
             const neckY = hipY - (Math.cos(leanAngle) * TORSO_LEN);

             // Head
             drawCircle(neckX, neckY - HEAD_R, HEAD_R, color);
             
             // Torso (Leaning)
             drawLine(x, hipY, neckX, neckY, color);

             // Arms (Supporting the lean)
             // Shoulder at neck. Hand on floor behind hips.
             const shoulderX = neckX;
             const shoulderY = neckY + 4;
             const handX = x - (20 * faceDir); // 20px behind hips
             const handY = y;
             drawLine(shoulderX, shoulderY, handX, handY, color);

             // Legs (Dangling from Edge)
             // Hips are at 'x' (which is OFFSET_SIT inside the card).
             // Knees need to be at the Card Edge.
             // If faceDir -1 (Left), Edge is x - OFFSET_SIT.
             // If faceDir 1 (Right), Edge is x + OFFSET_SIT.
             const kneeX = x + (OFFSET_SIT * faceDir);
             const kneeY = y;
             
             // Thighs (Flat on card)
             drawLine(x, hipY, kneeX, kneeY, color);
             
             // Shins (Vertical + Swing)
             const swing = Math.sin(elapsed * 2) * 3; // Gentle swing
             const footX = kneeX + swing;
             const footY = y + LEG_LEN;
             
             drawLine(kneeX, kneeY, footX, footY, color);
             // 2nd Leg (Offset)
             drawLine(x, hipY, kneeX, kneeY, color); 
             drawLine(kneeX, kneeY, footX + 4, footY - 2, color); // Slightly offset 2nd leg

        } 
        
        // 2. JUMPING
        else if (pose === 'jump') {
             hipY = y - 15; // Tucked up
             const neckY = hipY - TORSO_LEN;
             
             drawLine(x, hipY, x, neckY, color);
             drawCircle(x, neckY - HEAD_R, HEAD_R, color);

             // Legs Tucked
             const kneeX = x - (5 * faceDir);
             const kneeY = hipY + 5;
             const footX = x - (8 * faceDir);
             const footY = hipY + 12;
             
             drawLine(x, hipY, kneeX, kneeY, color);
             drawLine(kneeX, kneeY, footX, footY, color);
             drawLine(x, hipY, kneeX+3, kneeY+2, color);
             drawLine(kneeX+3, kneeY+2, footX+3, footY+2, color);

             // Arms Up (Superman style)
             const shoulderY = neckY + 4;
             drawLine(x, shoulderY, x + (15*faceDir), shoulderY - 5, color);

        } 
        
        // 3. DANCING
        else if (pose === 'dance') {
             const bounce = Math.abs(Math.sin(danceCycle)) * 4;
             hipY = y - LEG_LEN - bounce;
             const neckY = hipY - TORSO_LEN;

             // Wacky Legs
             const lKneeX = x - 8;
             const lKneeY = hipY + 10;
             const lFootX = x - 12;
             const lFootY = y;
             
             const rKneeX = x + 8;
             const rKneeY = hipY + 10;
             const rFootX = x + 12;
             const rFootY = y;

             drawLine(x, hipY, lKneeX, lKneeY, color);
             drawLine(lKneeX, lKneeY, lFootX, lFootY, color);
             drawLine(x, hipY, rKneeX, rKneeY, color);
             drawLine(rKneeX, rKneeY, rFootX, rFootY, color);

             drawLine(x, hipY, x, neckY, color);
             drawCircle(x, neckY - HEAD_R, HEAD_R, color);

             // Waving Arms
             const shoulderY = neckY + 4;
             const wave = Math.sin(elapsed * 20) * 10;
             drawLine(x, shoulderY, x - 12, shoulderY - 10 + wave, color);
             drawLine(x, shoulderY, x + 12, shoulderY - 10 - wave, color);

        } 
        
        // 4. STAND / WALK
        else {
             hipY = y - LEG_LEN;
             const neckY = hipY - TORSO_LEN;
             
             // Walk Cycle
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

             drawLine(x, hipY, lKneeX, lKneeY, color);
             drawLine(lKneeX, lKneeY, lFootX, lFootY, color);
             drawLine(x, hipY, rKneeX, rKneeY, color);
             drawLine(rKneeX, rKneeY, rFootX, rFootY, color);

             drawLine(x, hipY, x, neckY, color);
             drawCircle(x, neckY - HEAD_R, HEAD_R, color);

             // Arms
             const shoulderY = neckY + 4;
             if (action === 'wave') {
                 drawLine(x, shoulderY, x - 4, hipY, color); // Down
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