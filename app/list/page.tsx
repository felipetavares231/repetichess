"use client";
import React, {useEffect, useState} from "react";
import {Chess} from "chess.js";
import NavBar from "../src/NavBar";
import Board from "../src/Board";
import OpeningExplorer from "../src/OpeningExplorer";
import {updateDests} from "../utils/updateDests";
import {useUser} from "@stackframe/stack";
import {
  Box,
  Icon,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {Done, Report, Warning} from "@mui/icons-material";
import {useQuery} from "react-query";
import Chessground from "@react-chess/chessground";

// these styles must be imported somewhere
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import {useRouter} from "next/navigation";
import {format, isBefore} from "date-fns";

function ListOpening() {
  const user = useUser();

  const theme = useTheme();

  const router = useRouter();

  const {data, isLoading} = useQuery({
    queryKey: ["boards", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const params = new URLSearchParams();
      params.set("ownerId", user.id);

      const response = await fetch(`/api/getBoards?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }

      const json = await response.json();
      return json.result;
    },
    enabled: !!user,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <NavBar />
      <div className="flex flex-wrap justify-center ml-8">
        {data &&
          data.map((board: any) => {
            const chess = new Chess();
            board.board.map((move: string) => {
              chess.move(move);
            });

            return (
              <div
                key={`board ${board.id}`}
                onClick={() => {
                  if (!user) return;
                  router.push(`/practice?board=${board.id}`);
                }}
                className="p-2 rounded-md transition-transform duration-200 hover:scale-105 ml-4 mb-8 relative"
                style={{
                  backgroundColor: theme.palette.primary.main,
                }}>
                <Chessground
                  key={`board ${board.id}`}
                  width={450}
                  height={450}
                  config={{
                    check: chess.inCheck(),
                    fen: chess.fen(),
                    viewOnly: true,
                    orientation: board.orientation,
                  }}
                />
                <div
                  className="absolute top-0 left-0 rounded-md"
                  style={{
                    backgroundColor: theme.palette.primary.main,
                  }}>
                  {isBefore(board.lastReviewDate, new Date()) ? (
                    <Tooltip title="Needs Reviewing">
                      <Report />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={`Last Time Reviewed: ${format(
                        board.lastReviewDate,
                        "MM/dd/yyyy",
                      )}`}>
                      <Done />
                    </Tooltip>
                  )}
                </div>
                <div className="text-center">
                  <Typography variant="h5" style={{fontWeight: "bold"}}>
                    {board.name}
                  </Typography>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ListOpening;
