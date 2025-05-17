"use client";
import React, { useMemo } from "react";
import { Button, Typography, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface InteractiveBoxProps {
  correct?: boolean;
  isOver: boolean;
}

function InteractiveBox({ correct, isOver }: InteractiveBoxProps) {
  const theme = useTheme();

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

  const message = useMemo(() => {
    if (correct === undefined) return null;
    const messages = correct ? correctMoveMessages : incorrectMoveMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  }, [correct]);

  if (correct === undefined) return null;

  const bgColor = correct
    ? theme.palette.success.main
    : theme.palette.error.main;

  const borderColor = correct
    ? theme.palette.text.primary
    : theme.palette.error.main;

  return (
    <div
      className="w-[300px]  rounded-2xl p-4 flex items-center gap-3 shadow-lg"
      style={{
        backgroundColor: "#262626",
        border: `2px solid ${borderColor}`,
        transition: "background-color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {correct ? (
        <CheckCircleIcon fontSize="large" />
      ) : (
        <ErrorOutlineIcon fontSize="large" />
      )}
      <Typography variant="h6" fontWeight="bold">
        {isOver ? "Nice! How Dificult was it to recall this opening?" : message}
      </Typography>
      {isOver && (
        <div className="flex flex-1 flex-row">
          <Button>Very Difficult</Button>
          <Button>Hard</Button>
          <Button>Medium</Button>
          <Button>Easy</Button>
        </div>
      )}
    </div>
  );
}

export default InteractiveBox;
