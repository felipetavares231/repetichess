"use client";
import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import NavBar from "../src/NavBar";
import Board from "../src/Board";
import OpeningExplorer from "../src/OpeningExplorer";
import { updateDests } from "../utils/updateDests";
import { useUser } from "@stackframe/stack";
import { Box, Icon, IconButton } from "@mui/material";
import { Done } from "@mui/icons-material";

function LearnOpening() {
  const [fen, setFen] = useState<string | undefined>();

  const [chess] = useState(new Chess());

  const [dests, setDests] = useState(new Map<string, string[]>());

  const user = useUser();

  const handleSaveBoard = async () => {
    if (!user) {
      console.log("no user");
      return;
    }

    await fetch("/api/createBoard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: user.id,
        board: chess.history(),
      }),
    });
  };

  useEffect(() => {
    console.log(chess.history());
  }, [fen]);

  return (
    <div>
      <NavBar />
      <div className="flex flex-1 justify-center">
        <div className="flex-1"></div>
        <div className="flex flex-1">
          <div>
            <IconButton
              onClick={handleSaveBoard}
              sx={{
                borderRadius: "8px",
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <Done />
            </IconButton>
          </div>
          <div className="ml-4">
            <Board
              onChange={(fen) => setFen(fen)}
              chess={chess}
              dests={dests}
              setDests={setDests}
            />
          </div>
        </div>
        {fen !== undefined && (
          <OpeningExplorer
            onUndo={() => {
              chess.undo();
              setFen(chess.fen());
              updateDests(chess, dests, setDests);
            }}
            fen={fen}
            ratings="1600,1800,2000"
            onClickMove={(move) => {
              chess.move(move);
              setFen(chess.fen());
              updateDests(chess, dests, setDests);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default LearnOpening;
