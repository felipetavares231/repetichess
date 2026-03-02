import {Button} from "@mui/material";
import Chessground from "@react-chess/chessground";
import {Chess, Move} from "chess.js";

// these styles must be imported somewhere
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import {useEffect, useRef, useState} from "react";
import React from "react";
import {updateDests} from "../utils/updateDests";

interface BoardProps {
  onChange: (fen: string) => void;
  chess: Chess;
  dests: Map<string, string[]>;
  setDests: React.Dispatch<React.SetStateAction<Map<string, string[]>>>;
  orientation?: "black" | "white";
}

function Board({onChange, chess, dests, setDests, orientation}: BoardProps) {
  const [size, setSize] = useState<number | null>(null);

  useEffect(() => {
    const computeSize = () =>
      Math.min(window.innerWidth, window.innerHeight) - 100;
    setSize(computeSize());

    const handleResize = () => setSize(computeSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    updateDests(chess, dests, setDests);
  }, []);

  useEffect(() => {
    onChange(chess.fen());
  }, [chess.fen()]);

  if (size === null) return null;

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        lineHeight: 0,
      }}>
      <Chessground
        width={size}
        height={size}
        config={{
          events: {
            move: (from, to) => {
              chess.move({from: from, to: to});
              updateDests(chess, dests, setDests);
            },
          },
          movable: {
            free: false,
            dests: dests as any,
          },
          check: chess.inCheck(),
          orientation: orientation,
          fen: chess.fen(),
        }}
      />
    </div>
  );
}

export default Board;
