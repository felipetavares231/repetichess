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
import {
  Done,
  MoreVert,
  MoreVertOutlined,
  Report,
  Warning,
} from "@mui/icons-material";
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

  return (
    <div>
      <NavBar />
      <div className="px-6 pb-8">
        <div className="text-center mb-8">
          <Typography variant="h4" fontWeight="bold">
            Your Openings
          </Typography>
          <Typography
            variant="body2"
            sx={{color: "rgba(255,255,255,0.45)", mt: 0.5}}>
            {data?.length
              ? `${data.length} opening${data.length !== 1 ? "s" : ""} saved`
              : "No openings yet"}
          </Typography>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {data &&
            data.map((board: any) => {
              const chess = new Chess();
              board.board.forEach((move: string) => chess.move(move));
              const needsReview = isBefore(board.lastReviewDate, new Date());

              return (
                <div
                  key={`board ${board.id}`}
                  onClick={() => {
                    if (!user) return;
                    window.location.href = `/practice?board=${board.id}`;
                  }}
                  className="rounded-xl cursor-pointer transition-all duration-250 hover:scale-[1.03] relative group"
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    overflow: "hidden",
                  }}>
                  <div className="p-3">
                    <Chessground
                      key={`board ${board.id}`}
                      width={380}
                      height={380}
                      config={{
                        check: chess.inCheck(),
                        fen: chess.fen(),
                        viewOnly: true,
                        orientation: board.orientation,
                      }}
                    />
                  </div>
                  <div
                    className="absolute top-3 left-3 rounded-lg px-1.5 py-0.5 flex items-center gap-1"
                    style={{
                      backgroundColor: needsReview
                        ? "rgba(211,47,47,0.85)"
                        : "rgba(46,125,50,0.85)",
                      backdropFilter: "blur(4px)",
                    }}>
                    {needsReview ? (
                      <Tooltip title="Needs Reviewing">
                        <Report sx={{fontSize: 18}} />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title={`Reviewed: ${format(
                          board.lastReviewDate,
                          "MMM d, yyyy",
                        )}`}>
                        <Done sx={{fontSize: 18}} />
                      </Tooltip>
                    )}
                  </div>
                  <div
                    className="px-4 py-3 text-center"
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}>
                    <Typography variant="h6" fontWeight="bold">
                      {board.name}
                    </Typography>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default ListOpening;
