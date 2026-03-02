"use client";
import React, {useEffect, useMemo, useState} from "react";
import {Button, Typography, useTheme} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import {Difficulty, getNextReviewInfo} from "../utils/getNextReviewDate";
import {useUser} from "@stackframe/stack";
import {useRouter} from "next/navigation";

interface InteractiveBoxProps {
  correct?: boolean;
  isOver: boolean;
  currentInterval: number;
  easeFactor: number;
  lastReviewDate: Date;
  boardId: number;
}

function InteractiveBox({
  correct,
  isOver,
  currentInterval,
  easeFactor,
  lastReviewDate,
  boardId,
}: InteractiveBoxProps) {
  const theme = useTheme();

  const user = useUser();

  const router = useRouter();

  const handleReviewDifficulty = async (difficulty: Difficulty) => {
    const {newEaseFactor, nextInterval, nextReviewDate} = getNextReviewInfo({
      currentInterval,
      easeFactor,
      lastReviewDate,
      difficulty,
    });

    const response = await fetch("/api/updateReviewDate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        nextInterval,
        newEaseFactor,
        nextReviewDate,
        boardId,
        ownerId: user?.id,
      }),
    });

    if (response.ok) {
      router.push("/list");
    }
  };

  const correctMoveMessages = [
    "Nice! That's the right idea.",
    "Perfect — you've been studying!",
    "You nailed it!",
    "That's the correct move. Keep it up!",
    "Excellent — just like the masters!",
    "Right on target.",
    "Yes! You're reading the board well.",
    "Great instinct. That’s exactly it.",
    "Well played.",
    "Flawless execution.",
  ];

  const incorrectMoveMessages = [
    "Not quite — try again.",
    "That's not it. Keep thinking.",
    "Close, but not the move we're looking for.",
    "Oops — take another look.",
    "Nope, that doesn’t align with the plan.",
    "That move doesn't work here.",
    "Try a different idea.",
    "Hmm, not what the position calls for.",
    "You're off track — think about the goal.",
    "Wrong move — but don't give up!",
  ];

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (correct === undefined) {
      setMessage(null);
      return;
    }
    const messages = correct ? correctMoveMessages : incorrectMoveMessages;
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, [correct]);

  if (correct === undefined)
    return (
      <div
        className="w-[360px] rounded-2xl p-6 flex items-center justify-center"
        style={{
          backgroundColor: "#1e1e1e",
          border: "1px solid rgba(255,255,255,0.08)",
          minHeight: 120,
        }}>
        <Typography
          variant="body2"
          sx={{color: "rgba(255,255,255,0.3)", textAlign: "center"}}>
          Make your move...
        </Typography>
      </div>
    );

  const borderColor = correct
    ? theme.palette.success.main
    : theme.palette.error.main;

  const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

  return (
    <div
      className="w-[360px] rounded-2xl p-6 flex items-center gap-4 shadow-lg flex-col"
      style={{
        backgroundColor: "#1e1e1e",
        border: `1px solid ${borderColor}40`,
        boxShadow: `0 4px 24px ${borderColor}15`,
        transition: "all 0.3s ease",
      }}>
      <div
        className="rounded-full p-2 flex items-center justify-center"
        style={{backgroundColor: `${borderColor}18`}}>
        {correct ? (
          <CheckCircleIcon fontSize="large" sx={{color: borderColor}} />
        ) : (
          <ErrorOutlineIcon fontSize="large" sx={{color: borderColor}} />
        )}
      </div>
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{textAlign: "center", lineHeight: 1.5}}>
        {isOver ? "How difficult was it to recall this opening?" : message}
      </Typography>
      {isOver && (
        <div className="flex flex-row gap-3 w-full">
          {difficulties.map((difficulty: Difficulty) => (
            <Button
              key={`difficultybutton: ${difficulty}`}
              variant={difficulty === "Medium" ? "contained" : "outlined"}
              fullWidth
              onClick={() => handleReviewDifficulty(difficulty)}
              sx={{
                py: 1,
                ...(difficulty !== "Medium" && {
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.8)",
                  "&:hover": {
                    borderColor: "primary.main",
                    backgroundColor: "rgba(156,33,51,0.1)",
                  },
                }),
              }}>
              {difficulty}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

export default InteractiveBox;
