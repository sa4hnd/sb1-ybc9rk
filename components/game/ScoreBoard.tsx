"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface Team {
  name: string;
  flag: string;
  color: string;
}

interface ScoreBoardProps {
  scores: {
    team1: number;
    team2: number;
  };
  gameTime: number;
  onReset: () => void;
  teams: {
    team1: Team;
    team2: Team;
  };
}

export function ScoreBoard({ scores, gameTime, onReset, teams }: ScoreBoardProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-between space-x-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
             style={{ 
               background: teams.team1.color,
               boxShadow: `0 0 20px ${teams.team1.color}`
             }}>
          <span className="text-2xl font-bold text-white">{scores.team1}</span>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-white">
            {gameTime}'
          </div>
        </div>

        <div className="w-16 h-16 rounded-full flex items-center justify-center"
             style={{ 
               background: teams.team2.color,
               boxShadow: `0 0 20px ${teams.team2.color}`
             }}>
          <span className="text-2xl font-bold text-white">{scores.team2}</span>
        </div>
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="mt-4 bg-transparent border-white/20 text-white hover:bg-white/10"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Game
      </Button>
    </div>
  );
}