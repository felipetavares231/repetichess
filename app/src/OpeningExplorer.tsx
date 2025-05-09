import React, { useEffect } from "react";
import { Button, ButtonBase, Typography, useTheme } from "@mui/material";
import { useQuery } from "react-query";
import ExplorerBar from "./ExplorerBar";
import { Chess } from "chess.js";

interface OpeningExplorerProps {
  fen: string;
  ratings: string;
  onClickMove: (move: "string") => void;
  onUndo: () => void;
}

function OpeningExplorer({
  fen,
  ratings,
  onClickMove,
  onUndo,
}: OpeningExplorerProps) {
  const theme = useTheme();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["lichessExplorer"],
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

  useEffect(() => {
    console.log("FEN RECEIVED BY OPENING EXPLORER: ", fen);
    console.log(data);
  }, [data]);

  useEffect(() => {
    refetch();
  }, [fen]);

  if (!data) return <></>;

  return (
    <div
      className="ml-4 rounded-md flex-1 mr-4"
      style={{
        backgroundColor: "#262626",
      }}
    >
      <div className=" text-center mt-2">
        <Typography
          variant="h6"
          style={{
            fontWeight: "bold",
          }}
        >
          {data.opening?.name ? data.opening.name : "Opening Explorer"}
        </Typography>
      </div>
      {data.moves.map((move: any) => {
        return (
          <div
            className="flex ml-4 mt-2 justify-between"
            onClick={() => {
              onClickMove(move.san);
            }}
          >
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
      <Button onClick={onUndo}>BACK</Button>
    </div>
  );
}

export default OpeningExplorer;
