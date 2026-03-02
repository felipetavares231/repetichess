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
  Button,
  Icon,
  IconButton,
  Input,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {Done} from "@mui/icons-material";
import {useRouter, useSearchParams} from "next/navigation";
import {useQuery} from "react-query";

type Ratings = "0,1000,2500" | "1200,1400,1600,2500" | "1800,2000,2200,2500";

function LearnOpening() {
  const [fen, setFen] = useState<string | undefined>();

  const [chess, setChess] = useState(new Chess());

  const [dests, setDests] = useState(new Map<string, string[]>());

  const [orientation, setOrientation] = useState<"white" | "black">("white");

  const [isSaving, setIsSaving] = useState(false);

  const [boardName, setBoardName] = useState("");

  const [ratings, setRatings] = useState<Ratings>("0,1000,2500");

  const user = useUser();

  const router = useRouter();

  const {data: preferences, isLoading} = useQuery({
    queryKey: ["preferences", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const params = new URLSearchParams();
      params.set("ownerId", user.id);

      const response = await fetch(`/api/getPreferences?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to get preferences");
      }

      const json = await response.json();
      return json.preferences;
    },
    enabled: !!user,
  });

  const searchParams = useSearchParams();
  const board = searchParams.get("board");

  const {data: boardData, isLoading: isLoadingBoard} = useQuery({
    queryKey: ["getBoard", user?.id, board],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!user) return null;

      const params = new URLSearchParams();
      params.set("ownerId", user.id);
      params.set("boardId", board || "");

      const response = await fetch(`/api/getBoard?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch board");
      }

      const json = await response.json();
      return json.result;
    },
    enabled: !!user && !!board,
  });

  const handleSaveBoard = async () => {
    if (!user) {
      return;
    }

    await fetch("/api/createBoard", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        ownerId: user.id,
        board: chess.history(),
        name: boardName,
        orientation: orientation,
        boardId: board,
      }),
    });
    router.push("/list");
  };

  useEffect(() => {
    if (!boardData?.board || boardData.board.length === 0) return;

    const tempChess = new Chess();

    let i = 0;

    const playMoves = () => {
      if (i < boardData.board.length) {
        const move = boardData.board[i];
        const result = tempChess.move(move);
        if (result) {
          updateDests(tempChess, dests, setDests);
        } else {
          console.warn(`Invalid move at index ${i}:`, move);
        }
        i++;
        setTimeout(playMoves, 50);
      } else {
        setFen(tempChess.fen());
        updateDests(tempChess, dests, setDests);
        setChess(tempChess); // ✅ update chess instance state
      }
    };

    playMoves();

    return () => {
      tempChess.reset(); // cleanup
    };
  }, [boardData]);

  useEffect(() => {
    if (!preferences) return;
    if (preferences.rating == "Beginner") {
      setRatings("0,1000,2500");
    } else if (preferences.rating == "Intermediate") {
      setRatings("1200,1400,1600,2500");
    } else {
      setRatings("1800,2000,2200,2500");
    }
  }, [preferences]);

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full">
        <NavBar />
      </div>
      <div className="flex flex-1 justify-center items-start gap-4 px-4 w-full max-w-[1600px]">
        <div className="flex items-start gap-3 pt-1">
          <div className="flex flex-col gap-2">
            <IconButton
              onClick={() => setIsSaving(true)}
              sx={{
                borderRadius: "10px",
                backgroundColor: "primary.main",
                color: "white",
                width: 42,
                height: 42,
                "&:hover": {
                  backgroundColor: "primary.light",
                  transform: "scale(1.05)",
                },
              }}>
              <Done />
            </IconButton>
          </div>
          <Board
            orientation={orientation}
            onChange={(fen) => setFen(fen)}
            chess={chess}
            dests={dests}
            setDests={setDests}
          />
        </div>
        <div className="w-[500px] shrink-0">
          {fen !== undefined && (
            <OpeningExplorer
              coverage={preferences?.coverage || "Strong"}
              onChangeOrientation={() => {
                setOrientation((prev) => (prev == "white" ? "black" : "white"));
              }}
              onUndo={() => {
                chess.undo();
                setFen(chess.fen());
                updateDests(chess, dests, setDests);
              }}
              fen={fen}
              ratings={ratings}
              onClickMove={(move) => {
                chess.move(move);
                setFen(chess.fen());
                updateDests(chess, dests, setDests);
              }}
            />
          )}
        </div>
      </div>
      <Modal
        open={isSaving}
        onClose={() => setIsSaving(false)}
        closeAfterTransition>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 420,
            bgcolor: "background.paper",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            p: 4,
            borderRadius: 3,
            flexDirection: "column",
            display: "flex",
            gap: 2,
          }}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            Save Opening
          </Typography>
          <TextField
            onChange={(e) => setBoardName(e.target.value)}
            variant="outlined"
            label="Name e.g.: Queen's Gambit, Caro-Kann"
            fullWidth
          />
          <Button variant="contained" size="large" onClick={handleSaveBoard}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default LearnOpening;
