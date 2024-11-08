"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  team: "team1" | "team2";
}

interface Team {
  name: string;
  flag: string;
  color: string;
}

interface GameArenaProps {
  onScore: (team: "team1" | "team2") => void;
  setGameTime: (time: number) => void;
  teams: {
    team1: Team;
    team2: Team;
  };
}

export function GameArena({ onScore, setGameTime, teams }: GameArenaProps) {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [balls, setBalls] = useState<Ball[]>([
    { x: -150, y: 0, vx: 8, vy: -8, team: "team1" },
    { x: 150, y: 0, vx: -8, vy: 8, team: "team2" }
  ]);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; color: string; angle: number }>>([]);

  const BALL_SIZE = 40;
  const ARENA_RADIUS = 300;
  const ELASTICITY = 0.98;
  const SPEED_LIMIT = 15;

  useEffect(() => {
    let startTime = Date.now();
    let animationFrameId: number;
    let hasScored = false;

    const updateGame = () => {
      setBalls(prevBalls => {
        return prevBalls.map(ball => {
          // Apply physics with improved velocity
          let newX = ball.x + ball.vx;
          let newY = ball.y + ball.vy;
          let newVx = ball.vx;
          let newVy = ball.vy;

          // Check collision with arena boundaries
          const distance = Math.sqrt(newX * newX + newY * newY);
          if (distance > ARENA_RADIUS - BALL_SIZE / 2) {
            // Calculate collision point and bounce angle
            const angle = Math.atan2(newY, newX);
            newX = (ARENA_RADIUS - BALL_SIZE / 2) * Math.cos(angle);
            newY = (ARENA_RADIUS - BALL_SIZE / 2) * Math.sin(angle);
            
            // Calculate reflection vector
            const normalX = newX / distance;
            const normalY = newY / distance;
            const dotProduct = (newVx * normalX + newVy * normalY) * 2;
            newVx = (ball.vx - dotProduct * normalX) * ELASTICITY;
            newVy = (ball.vy - dotProduct * normalY) * ELASTICITY;

            // Add collision particles
            createParticles(newX, newY, ball.team === "team1" ? teams.team1.color : teams.team2.color);
          }

          // Check for goal (bottom of circle)
          if (Math.abs(newX) < 40 && newY > ARENA_RADIUS - BALL_SIZE && !hasScored) {
            hasScored = true;
            onScore(ball.team);
            setTimeout(() => { hasScored = false; }, 1000);
          }

          // Apply speed limits
          newVx = Math.max(Math.min(newVx, SPEED_LIMIT), -SPEED_LIMIT);
          newVy = Math.max(Math.min(newVy, SPEED_LIMIT), -SPEED_LIMIT);

          return {
            ...ball,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        });
      });

      // Update game time
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      const gameMinutes = Math.min(90, Math.floor(elapsed * 30));
      setGameTime(gameMinutes);

      animationFrameId = requestAnimationFrame(updateGame);
    };

    animationFrameId = requestAnimationFrame(updateGame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onScore, setGameTime, teams]);

  const createParticles = (x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 15 }, () => ({
      x,
      y,
      color,
      angle: Math.random() * Math.PI * 2
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => setParticles([]), 500);
  };

  return (
    <div className="relative w-[600px] h-[600px]" ref={arenaRef}>
      {/* Arena Circle */}
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)',
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: '0 0 40px rgba(255,255,255,0.1), inset 0 0 40px rgba(255,255,255,0.1)'
        }}
      />
      
      {/* Goal */}
      <div
        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-20 h-16"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.3))',
          clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)'
        }}
      >
        <div className="w-full h-full grid grid-cols-8 grid-rows-6 gap-px">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="bg-white/20" />
          ))}
        </div>
      </div>

      {/* Balls */}
      {balls.map((ball, index) => (
        <div
          key={index}
          className="absolute w-10 h-10 transition-transform duration-50"
          style={{
            transform: `translate(${ball.x}px, ${ball.y}px) translate(-50%, -50%) translate(${ARENA_RADIUS}px, ${ARENA_RADIUS}px)`,
            filter: `drop-shadow(0 0 10px ${ball.team === "team1" ? teams.team1.color : teams.team2.color})`
          }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: ball.team === "team1" ? teams.team1.color : teams.team2.color,
              boxShadow: `0 0 20px ${ball.team === "team1" ? teams.team1.color : teams.team2.color}`
            }}
          />
        </div>
      ))}

      {/* Particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: particle.color,
            left: particle.x + ARENA_RADIUS,
            top: particle.y + ARENA_RADIUS,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: Math.cos(particle.angle) * 100,
            y: Math.sin(particle.angle) * 100,
          }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </div>
  );
}