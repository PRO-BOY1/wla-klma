"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { GameState } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { fireVictoryConfetti } from "@/lib/confetti";
import { cx } from "@/lib/utils";

interface EndScreenProps {
  state: GameState;
  onPlayAgain: () => void;
  onBackToSetup: () => void;
}

export function EndScreen({ state, onPlayAgain, onBackToSetup }: EndScreenProps) {
  const { scores, settings, wordsGuessed } = state;
  const isRedWinner = scores.red > scores.blue;
  const isTie = scores.red === scores.blue;
  const winnerName = isTie ? null : isRedWinner ? settings.redName : settings.blueName;
  const winnerColor = isTie ? "#FFC94D" : isRedWinner ? "#FF4655" : "#3FC1FF";

  useEffect(() => {
    fireVictoryConfetti(isTie ? ["#FFC94D", "#F5F7FA"] : [winnerColor, "#FFC94D", "#F5F7FA"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center px-4 py-10 gap-8 max-w-lg mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex flex-col items-center gap-3"
      >
        <span className="text-6xl">{isTie ? "🤝" : "🏆"}</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-paper">
          {isTie ? "تعادل مثير!" : `${winnerName} فاز!`}
        </h1>
        <p className="text-mist font-body">انتهت المباراة، هذه نتائجكم</p>
      </motion.div>

      <div className="glass-strong rounded-3xl p-6 w-full flex flex-col gap-4">
        <ResultRow label={settings.redName} score={scores.red} guessed={wordsGuessed.red} color="#FF4655" />
        <div className="h-px bg-white/10" />
        <ResultRow label={settings.blueName} score={scores.blue} guessed={wordsGuessed.blue} color="#3FC1FF" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button variant="gold" size="lg" className="flex-1" onClick={onPlayAgain}>
          🔁 لعب مرة أخرى
        </Button>
        <Button variant="ghost" size="lg" className="flex-1" onClick={onBackToSetup}>
          ⚙️ إعدادات جديدة
        </Button>
      </div>
    </div>
  );
}

function ResultRow({
  label,
  score,
  guessed,
  color,
}: {
  label: string;
  score: number;
  guessed: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-display font-bold text-lg" style={{ color }}>
          {label}
        </span>
        <span className="text-xs text-mist font-body">{guessed} كلمة تم تخمينها</span>
      </div>
      <span className={cx("font-display font-black text-4xl tabular-nums text-paper")}>{score}</span>
    </div>
  );
}
