"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CardsData, GameState, TurnResultChoice } from "@/lib/types";
import { findCategoryIcon, findCategoryName } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ScoreBar } from "@/components/ScoreBar";
import { TimerRing } from "@/components/TimerRing";
import { useTimer } from "@/hooks/useTimer";
import { cx } from "@/lib/utils";

interface GameScreenProps {
  state: GameState;
  cards: CardsData;
  onReveal: () => void;
  onTimerDone: () => void;
  onChooseResult: (choice: TurnResultChoice) => void;
}

export function GameScreen({ state, cards, onReveal, onTimerDone, onChooseResult }: GameScreenProps) {
  const timer = useTimer(state.settings.roundSeconds, { onComplete: onTimerDone });

  useEffect(() => {
    if (state.phase === "turn-active") {
      timer.start();
    }
    if (state.phase === "turn-intro") {
      timer.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase]);

  const teamName = state.currentTeam === "red" ? state.settings.redName : state.settings.blueName;
  const teamTextClass = state.currentTeam === "red" ? "text-team-red" : "text-team-blue";
  const teamBgGlow = state.currentTeam === "red" ? "shadow-team-red" : "shadow-team-blue";

  return (
    <div className="min-h-dvh w-full flex flex-col items-center px-4 py-6 gap-6 max-w-2xl mx-auto">
      <ScoreBar
        redName={state.settings.redName}
        blueName={state.settings.blueName}
        redScore={state.scores.red}
        blueScore={state.scores.blue}
        currentTeam={state.currentTeam}
        roundNumber={state.roundNumber}
        totalRounds={state.settings.totalRounds}
      />

      <div className="flex-1 w-full flex flex-col items-center justify-center gap-8">
        <AnimatePresence mode="wait">
          {state.phase === "turn-intro" && state.currentWord && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center gap-6"
            >
              <span className={cx("font-display font-bold text-lg", teamTextClass)}>
                دور {teamName}
              </span>

              <div className={cx("glass-strong rounded-[32px] px-8 py-10 w-full flex flex-col items-center gap-4 shadow-glow", teamBgGlow)}>
                <span className="text-4xl">{findCategoryIcon(cards, state.currentWord.categoryId)}</span>
                <span className="text-mist font-body text-sm">
                  {findCategoryName(cards, state.currentWord.categoryId)}
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-paper text-center leading-tight">
                  {state.currentWord.text}
                </h2>
              </div>

              <Button variant="gold" size="xl" className="w-full" onClick={onReveal}>
                👁️ قرأت الكلمة
              </Button>
              <p className="text-mist text-sm font-body text-center max-w-sm">
                احفظ الكلمة جيدًا، عند الضغط ستختفي ويبدأ العد التنازلي مباشرة
              </p>
            </motion.div>
          )}

          {state.phase === "turn-active" && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <span className={cx("font-display font-bold text-xl", teamTextClass)}>
                {teamName} يمثّل الآن
              </span>

              <TimerRing remaining={timer.remaining} duration={state.settings.roundSeconds} team={state.currentTeam} />

              <Button variant="ghost" size="lg" onClick={onTimerDone} className="w-full max-w-xs">
                ⏹️ إنهاء الدور
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {state.phase === "turn-result" && (
        <ResultModal
          teamName={teamName}
          opponentName={state.currentTeam === "red" ? state.settings.blueName : state.settings.redName}
          currentTeamVariant={state.currentTeam === "red" ? "team-red" : "team-blue"}
          opponentVariant={state.currentTeam === "red" ? "team-blue" : "team-red"}
          onChoose={onChooseResult}
        />
      )}
    </div>
  );
}

function ResultModal({
  teamName,
  opponentName,
  currentTeamVariant,
  opponentVariant,
  onChoose,
}: {
  teamName: string;
  opponentName: string;
  currentTeamVariant: "team-red" | "team-blue";
  opponentVariant: "team-red" | "team-blue";
  onChoose: (choice: TurnResultChoice) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-ink/85 backdrop-blur-md flex items-center justify-center px-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="glass-strong rounded-3xl p-6 w-full max-w-sm flex flex-col gap-4"
      >
        <h3 className="font-display font-bold text-xl text-paper text-center">من خمّن الكلمة؟</h3>
        <Button variant={currentTeamVariant} size="lg" onClick={() => onChoose("mine")} className="w-full">
          ✅ {teamName} خمّنها
        </Button>
        <Button variant={opponentVariant} size="lg" onClick={() => onChoose("opponent")} className="w-full">
          ❌ {opponentName} خمّنها
        </Button>
        <Button variant="ghost" size="lg" onClick={() => onChoose("none")} className="w-full">
          ⏭️ لم يخمنها أحد
        </Button>
      </motion.div>
    </motion.div>
  );
}
