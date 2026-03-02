"use client";
import React, {useEffect, useRef, useState} from "react";
import {
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import {useQuery} from "react-query";
import ExplorerBar from "./ExplorerBar";
import {ChevronLeft, SwapVert} from "@mui/icons-material";

let lastRequestTime = 0;
const MIN_GAP_MS = 1500;

async function throttledLichessFetch(url: string): Promise<Response> {
  const now = Date.now();
  const wait = MIN_GAP_MS - (now - lastRequestTime);
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait));
  }
  lastRequestTime = Date.now();
  return fetch(url);
}

interface OpeningExplorerProps {
  fen: string;
  ratings: string;
  onClickMove: (move: "string") => void;
  onUndo: () => void;
  onChangeOrientation: () => void;
  coverage: "Basic" | "Solid" | "Strong";
}

function OpeningExplorer({
  fen,
  ratings,
  onClickMove,
  onUndo,
  onChangeOrientation,
  coverage,
}: OpeningExplorerProps) {
  const theme = useTheme();

  const {data, isLoading} = useQuery({
    queryKey: ["lichessExplorer", fen, ratings],
    queryFn: async () => {
      const params = new URLSearchParams({
        fen: fen,
        speeds: "rapid,blitz,classical",
        ratings: ratings,
      });

      const res = await throttledLichessFetch(
        `https://explorer.lichess.ovh/lichess?${params}`,
      );
      if (res.status === 429) {
        throw new Error("rate_limited");
      }
      if (!res.ok) {
        return {moves: [], opening: null};
      }
      return res.json();
    },
    keepPreviousData: true,
    retry: (failureCount, error: any) =>
      error?.message === "rate_limited" && failureCount < 4,
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 10000),
  });

  const filteredMoves = React.useMemo(() => {
    if (!data?.moves) return [];

    if (coverage === "Basic") {
      return data.moves.slice(0, 3);
    }

    if (coverage === "Solid") {
      return data.moves.slice(0, 5);
    }

    return data.moves;
  }, [data, coverage]);

  if (!data) return <div className="rounded-xl flex-1"></div>;

  return (
    <div
      className="rounded-xl flex-1 p-5"
      style={{
        backgroundColor: "#1e1e1e",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}>
      <div className="text-center mb-4">
        <Typography variant="h6" fontWeight="bold">
          {data.opening?.name || "Opening Explorer"}
        </Typography>
        {data.opening?.name && (
          <Typography
            variant="caption"
            sx={{color: "rgba(255,255,255,0.4)"}}>
            Click a move to play it
          </Typography>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {filteredMoves.map((move: any, index: number) => (
          <div
            key={`${move.san}-${index}`}
            className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150"
            style={{backgroundColor: "rgba(255,255,255,0.03)"}}
            onClick={() => onClickMove(move.san)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)")
            }>
            <Typography
              sx={{
                fontWeight: 700,
                fontFamily: "monospace",
                fontSize: "0.95rem",
                minWidth: 48,
              }}>
              {move.san}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255,255,255,0.4)",
                minWidth: 60,
                textAlign: "right",
                mr: 2,
              }}>
              {(move.white + move.black + move.draws).toLocaleString()}
            </Typography>
            <ExplorerBar
              white={move.white}
              black={move.black}
              draw={move.draws}
            />
          </div>
        ))}
      </div>
      <div
        className="flex items-center gap-2 mt-4 pt-3"
        style={{borderTop: "1px solid rgba(255,255,255,0.08)"}}>
        <IconButton
          onClick={onUndo}
          size="small"
          sx={{
            borderRadius: "8px",
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            "&:hover": {
              backgroundColor: "primary.main",
              borderColor: "primary.main",
            },
          }}>
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={onChangeOrientation}
          size="small"
          sx={{
            borderRadius: "8px",
            backgroundColor: "rgba(255,255,255,0.06)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            "&:hover": {
              backgroundColor: "primary.main",
              borderColor: "primary.main",
            },
          }}>
          <SwapVert />
        </IconButton>
      </div>
    </div>
  );
}

export default OpeningExplorer;
