"use client";

import { motion } from "framer-motion";
import type { TeamId } from "@/lib/types";
import { cx } from "@/lib/utils";

interface TimerRingProps {
  remaining: number;
  duration: number;
  team: TeamId;
}

const TEAM_HEX: Record<TeamId, string> = {
  red: "#FF4655",
  blue: "#3FC1FF",
};

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerRing({ remaining, duration, team }: TimerRingProps) {
  const progress = Math.max(0, Math.min(1, remaining / duration));
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const color = TEAM_HEX[team];
  const isUrgent = remaining <= 5 && remaining > 0;

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-40"
        style={{ background: color }}
        aria-hidden
      />
      <svg width="280" height="280" viewBox="0 0 280 280" className="-rotate-90">
        <circle
          cx="140"
          cy="140"
          r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
        />
        <motion.circle
          cx="140"
          cy="140"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.4, ease: "linear" }}
          style={{ filter: `drop-shadow(0 0 12px ${color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          key={remaining}
          initial={{ scale: isUrgent ? 1.25 : 1, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className={cx(
            "font-display font-black tabular-nums leading-none",
            isUrgent ? "text-6xl text-team-red" : "text-7xl text-paper"
          )}
        >
          {remaining}
        </motion.span>
        <span className="mt-2 text-sm text-mist font-body">ثانية متبقية</span>
      </div>
    </div>
  );
}
