"use client";
import React, {useEffect} from "react";
import {
  Button,
  ButtonBase,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import {useQuery} from "react-query";
import ExplorerBar from "./ExplorerBar";
import {Chess} from "chess.js";
import {ChevronLeft, SwapVert, SwapVerticalCircle} from "@mui/icons-material";

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
  const {data, isLoading, refetch} = useQuery({
    queryKey: ["lichessExplorer", ratings],
    queryFn: async () => {
      const params = new URLSearchParams({
        fen: fen,
        speeds: "rapid,blitz,classical",
        ratings: ratings,
      });

      const res = await fetch(`https://explorer.lichess.ovh/lichess?${params}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  const filteredMoves = React.useMemo(() => {
    if (!data?.moves) return [];

    if (coverage === "Basic") {
      return data.moves.slice(0, 3); // top 3 moves
    }

    if (coverage === "Solid") {
      return data.moves.slice(0, 5); // top 5 moves
    }

    return data.moves; // Strong = all moves
  }, [data, coverage]);

  useEffect(() => {
    refetch();
  }, [fen]);

  if (!data) return <div className="ml-4 rounded-md flex-1 mr-4"></div>;

  return (
    <div
      className="ml-4 rounded-md flex-1 mr-4 p-4"
      style={{
        backgroundColor: "#262626",
      }}>
      <div className=" text-center mt-2">
        <Typography
          variant="h6"
          style={{
            fontWeight: "bold",
          }}>
          {data.opening?.name ? data.opening.name : "Opening Explorer"}
        </Typography>
      </div>
      {filteredMoves.map((move: any, index: number) => {
        return (
          <div
            key={`${move} - ${index}`}
            className="flex ml-4 mt-2 justify-between"
            onClick={() => {
              onClickMove(move.san);
            }}>
            <div>
              <Typography>{move.san}</Typography>
            </div>
            <div className="ml-8">
              <Typography>{move.white + move.black + move.draws}</Typography>
            </div>
            <ExplorerBar
              white={move.white}
              black={move.black}
              draw={move.draws}
            />
          </div>
        );
      })}
      <div className="ml-4 mt-2">
        <IconButton
          onClick={onUndo}
          sx={{
            marginRight: "8px",
            borderRadius: "8px",
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}>
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={onChangeOrientation}
          sx={{
            borderRadius: "8px",
            backgroundColor: "primary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}>
          <SwapVert />
        </IconButton>
      </div>
    </div>
  );
}

export default OpeningExplorer;
