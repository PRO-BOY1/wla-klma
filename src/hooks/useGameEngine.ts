"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  CardsData,
  GameSettings,
  GameState,
  TeamId,
  TurnResultChoice,
} from "@/lib/types";
import { pickRandomWord } from "@/lib/utils";

const OTHER_TEAM: Record<TeamId, TeamId> = { red: "blue", blue: "red" };

function buildInitialState(settings: GameSettings, cards: CardsData): GameState {
  const firstWord = pickRandomWord(cards, settings.selectedCategoryIds, []);
  return {
    phase: "turn-intro",
    settings,
    currentTeam: "red",
    scores: { red: 0, blue: 0 },
    wordsGuessed: { red: 0, blue: 0 },
    roundNumber: 1,
    currentWord: firstWord,
    usedWordIds: firstWord ? [firstWord.id] : [],
    history: [],
  };
}

/** الآلة الحالة الرئيسية للعبة: من الإعداد إلى النهاية */
export function useGameEngine(cards: CardsData) {
  const [state, setState] = useState<GameState | null>(null);

  const startGame = useCallback(
    (settings: GameSettings) => {
      setState(buildInitialState(settings, cards));
    },
    [cards]
  );

  const revealWord = useCallback(() => {
    setState((prev) => (prev ? { ...prev, phase: "turn-active" } : prev));
  }, []);

  const endTurnTimer = useCallback(() => {
    setState((prev) => (prev ? { ...prev, phase: "turn-result" } : prev));
  }, []);

  const isMatchOver = useCallback(
    (scores: Record<TeamId, number>, roundNumber: number, settings: GameSettings) => {
      if (settings.targetScore && (scores.red >= settings.targetScore || scores.blue >= settings.targetScore)) {
        return true;
      }
      if (roundNumber >= settings.totalRounds) return true;
      return false;
    },
    []
  );

  const chooseResult = useCallback(
    (choice: TurnResultChoice) => {
      setState((prev) => {
        if (!prev || !prev.currentWord) return prev;

        const scores = { ...prev.scores };
        const wordsGuessed = { ...prev.wordsGuessed };

        if (choice === "mine") {
          scores[prev.currentTeam] += 1;
          wordsGuessed[prev.currentTeam] += 1;
        } else if (choice === "opponent") {
          scores[OTHER_TEAM[prev.currentTeam]] += 1;
          wordsGuessed[prev.currentTeam] += 1; // الكلمة اتخمنت برضو بس للفريق التاني
        }

        const history = [
          ...prev.history,
          {
            team: prev.currentTeam,
            categoryId: prev.currentWord.categoryId,
            wordId: prev.currentWord.id,
            result: choice,
          },
        ];

        const nextRoundNumber = prev.roundNumber + 1;
        const over = isMatchOver(scores, nextRoundNumber, prev.settings);

        if (over) {
          return {
            ...prev,
            scores,
            wordsGuessed,
            history,
            phase: "finished",
          };
        }

        const nextTeam = OTHER_TEAM[prev.currentTeam];
        const nextWord = pickRandomWord(cards, prev.settings.selectedCategoryIds, prev.usedWordIds);

        return {
          ...prev,
          scores,
          wordsGuessed,
          history,
          currentTeam: nextTeam,
          roundNumber: nextRoundNumber,
          currentWord: nextWord,
          usedWordIds: nextWord ? [...prev.usedWordIds, nextWord.id] : prev.usedWordIds,
          phase: "turn-intro",
        };
      });
    },
    [cards, isMatchOver]
  );

  const restartWithSameSettings = useCallback(() => {
    setState((prev) => (prev ? buildInitialState(prev.settings, cards) : prev));
  }, [cards]);

  const backToSetup = useCallback(() => {
    setState(null);
  }, []);

  const totalWordsGuessed = useMemo(() => {
    if (!state) return 0;
    return state.wordsGuessed.red + state.wordsGuessed.blue;
  }, [state]);

  return {
    state,
    startGame,
    revealWord,
    endTurnTimer,
    chooseResult,
    restartWithSameSettings,
    backToSetup,
    totalWordsGuessed,
  };
}
