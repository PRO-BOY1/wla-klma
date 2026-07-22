"use client";

import { motion } from "framer-motion";
import type { TeamId } from "@/lib/types";
import { cx } from "@/lib/utils";

interface ScoreBarProps {
  redName: string;
  blueName: string;
  redScore: number;
  blueScore: number;
  currentTeam: TeamId;
  roundNumber: number;
  totalRounds: number;
}

export function ScoreBar({
  redName,
  blueName,
  redScore,
  blueScore,
  currentTeam,
  roundNumber,
  totalRounds,
}: ScoreBarProps) {
  return (
    <div className="w-full flex items-center gap-3 px-4 py-3 glass rounded-2xl">
      <TeamPill name={redName} score={redScore} team="red" active={currentTeam === "red"} />
      <div className="flex flex-col items-center px-2 shrink-0">
        <span className="text-xs text-mist font-body">الجولة</span>
        <span className="font-display font-bold text-paper text-sm tabular-nums">
          {Math.min(roundNumber, totalRounds)}/{totalRounds}
        </span>
      </div>
      <TeamPill name={blueName} score={blueScore} team="blue" active={currentTeam === "blue"} />
    </div>
  );
}

function TeamPill({
  name,
  score,
  team,
  active,
}: {
  name: string;
  score: number;
  team: TeamId;
  active: boolean;
}) {
  return (
    <motion.div
      animate={{ scale: active ? 1.03 : 1 }}
      className={cx(
        "flex-1 flex items-center justify-between rounded-xl px-3 py-2 min-w-0 transition-colors",
        team === "red" ? "bg-team-redDim" : "bg-team-blueDim",
        active && "ring-2",
        active && team === "red" && "ring-team-red",
        active && team === "blue" && "ring-team-blue"
      )}
    >
      <span
        className={cx(
          "truncate font-body text-sm",
          team === "red" ? "text-team-red" : "text-team-blue"
        )}
      >
        {name}
      </span>
      <span className="font-display font-black text-xl text-paper tabular-nums shrink-0 ms-2">
        {score}
      </span>
    </motion.div>
  );
}
