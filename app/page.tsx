"use client";

import { useEffect, useState } from "react";
import { GameArena } from "@/components/game/GameArena";
import { ScoreBoard } from "@/components/game/ScoreBoard";

export default function Home() {
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [gameTime, setGameTime] = useState(0);
  const teams = {
    team1: {
      name: "Bayern Munich",
      flag: "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/de.svg",
      color: "#dc2626"
    },
    team2: {
      name: "Borussia Dortmund",
      flag: "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/de.svg",
      color: "#eab308"
    }
  };

  const handleScore = (team: "team1" | "team2") => {
    setScores(prev => ({
      ...prev,
      [team]: prev[team] + 1
    }));
  };

  const resetGame = () => {
    setScores({ team1: 0, team2: 0 });
    setGameTime(0);
  };

  return (
    <main className="min-h-screen bg-black p-4 flex flex-col items-center justify-center space-y-8">
      <GameArena 
        onScore={handleScore} 
        setGameTime={setGameTime}
        teams={teams}
      />
      <ScoreBoard 
        scores={scores} 
        gameTime={gameTime} 
        onReset={resetGame}
        teams={teams}
      />
    </main>
  );
}