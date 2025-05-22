"use client";
import React, {useEffect, useState} from "react";
import {Chess} from "chess.js";
import NavBar from "../src/NavBar";
import Board from "../src/Board";
import OpeningExplorer from "../src/OpeningExplorer";
import {updateDests} from "../utils/updateDests";
import {useUser} from "@stackframe/stack";
import {Box, Button, Icon, IconButton} from "@mui/material";
import {Delete, Done, Edit} from "@mui/icons-material";
import {useQuery} from "react-query";
import {useRouter, useSearchParams} from "next/navigation";
import InteractiveBox from "../src/InteractiveBox";

function PracticeOpening() {
  const [fen, setFen] = useState<string | undefined>();

  const [chess, setChess] = useState(new Chess());

  const [dests, setDests] = useState(new Map<string, string[]>());

  const [moveCount, setMoveCount] = useState(0);

  const [correct, setCorrect] = useState<boolean | undefined>(undefined);

  const [isAutoMoving, setIsAutoMoving] = useState(true);

  const [isOver, setIsOver] = useState(false);

  const user = useUser();

  const router = useRouter();

  const searchParams = useSearchParams();

  const board = searchParams.get("board");

  const {data, isLoading} = useQuery({
    queryKey: ["getBoard", user?.id],
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
    enabled: !!user,
  });

  const handleDeleteBoard = async () => {
    const response = await fetch("/api/deleteBoard", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        ownerId: user?.id,
        boardId: board,
      }),
    });
    if (response.ok) {
      router.push("/list");
    }
  };

  const handleEditBoard = async () => {
    router.push(`/learn?board=${board}`);
  };

  useEffect(() => {
    if (!data || isAutoMoving) return;

    const history = chess.history();
    const myMove = history[history.length - 1];
    const intendedMove = data.board[moveCount + 1];
    const nextMove = data.board[moveCount + 2];
    const turn = chess.turn();

    if (turn !== data.orientation[0]) {
      if (myMove == intendedMove) {
        setCorrect(true);

        if (nextMove !== undefined) {
          chess.move(nextMove);
          updateDests(chess, dests, setDests);
          setMoveCount((prev) => prev + 2);
        } else {
          setIsOver(true);
        }
      } else {
        setCorrect(false);
        chess.undo();
        updateDests(chess, dests, setDests);
      }
    }

    console.log(chess.history());
  }, [fen]);

  const makeMovesSequentially = async (moves: string[]) => {
    for (let move of moves) {
      const result = chess.move(move);
      if (!result) {
        console.error("Invalid move:", move);
        break;
      }
      updateDests(chess, dests, setDests);
      await new Promise((resolve) => setTimeout(resolve, 300)); // delay between moves
    }
  };

  const autoMove = () => {
    if (!data) return;

    const max = data.board.length - 1;
    const min = 0;
    let rng = Math.floor(Math.random() * (max - min + 1) + min);

    if (
      (data.orientation == "white" && rng % 2 === 0) ||
      (data.orientation == "black" && rng % 2 !== 0)
    ) {
      rng--;
    }

    setMoveCount(rng);

    const openingSoFar = data.board.slice(0, rng + 1);
    makeMovesSequentially(openingSoFar).then(() => setIsAutoMoving(false));
  };

  useEffect(() => {
    console.log(data);
    autoMove();
  }, [data]);

  useEffect(() => {
    if (!data) return;
    if (chess.history().length == data.board.length) {
      setIsOver(true);
    }
  }, [chess.history()]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-1 w-[100%]">
        <NavBar />
      </div>
      <div className="flex justify-center items-center">
        <div className="flex flex-1"></div>
        <div className="ml-4 flex flex-row">
          <div className="mr-2 flex-col flex">
            <IconButton
              onClick={handleDeleteBoard}
              sx={{
                borderRadius: "8px",
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}>
              <Delete />
            </IconButton>
            <div className="mt-2"></div>
            <IconButton
              onClick={handleEditBoard}
              sx={{
                borderRadius: "8px",
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}>
              <Edit />
            </IconButton>
          </div>
          <Board
            orientation={data?.orientation}
            onChange={(fen) => setFen(fen)}
            chess={chess}
            dests={dests}
            setDests={setDests}
          />
          <div className="ml-4"></div>
          <InteractiveBox
            correct={correct}
            isOver={isOver}
            currentInterval={data?.currentInterval}
            easeFactor={parseFloat(data?.easeFactor)}
            lastReviewDate={data?.lastReviewDate}
            boardId={data?.id}
          />
          <div className="ml-4"></div>
        </div>
      </div>
    </div>
  );
}

export default PracticeOpening;
