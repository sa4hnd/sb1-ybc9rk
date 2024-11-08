"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Team {
  name: string;
  flag: string;
}

interface TeamSelectionProps {
  selectedTeams: {
    team1: Team;
    team2: Team;
  };
  setSelectedTeams: (teams: { team1: Team; team2: Team }) => void;
  onStart: () => void;
}

export function TeamSelection({ selectedTeams, setSelectedTeams, onStart }: TeamSelectionProps) {
  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">
        Neon Football
      </h1>

      <div className="flex items-center justify-center space-x-8">
        <div className="text-center space-y-4">
          <Image
            src={selectedTeams.team1.flag}
            alt={selectedTeams.team1.name}
            width={80}
            height={80}
            className="rounded-full border-2 border-cyan-500/50"
          />
          <div className="text-cyan-400 font-bold">{selectedTeams.team1.name}</div>
        </div>

        <div className="text-cyan-500 text-2xl font-bold">VS</div>

        <div className="text-center space-y-4">
          <Image
            src={selectedTeams.team2.flag}
            alt={selectedTeams.team2.name}
            width={80}
            height={80}
            className="rounded-full border-2 border-cyan-500/50"
          />
          <div className="text-cyan-400 font-bold">{selectedTeams.team2.name}</div>
        </div>
      </div>

      <Button
        onClick={onStart}
        className="text-xl px-8 py-6 bg-gradient-to-r from-cyan-500 to-cyan-700 hover:from-cyan-600 hover:to-cyan-800 text-white rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]"
      >
        Start Match
      </Button>
    </div>
  );
}