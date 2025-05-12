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
import { useQuery } from "react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

function PracticeOpening() {
  const [fen, setFen] = useState<string | undefined>();

  const [chess] = useState(new Chess());

  const [dests, setDests] = useState(new Map<string, string[]>());

  const user = useUser();

  const searchParams = useSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ["getBoard", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const board = searchParams.get("board");

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

  useEffect(() => {
    console.log(chess.history());
  }, [fen]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <NavBar />
      <div className="flex flex-1 justify-center">
        <div className="flex flex-1"></div>
        <div className="ml-4">
          <Board
            onChange={(fen) => setFen(fen)}
            chess={chess}
            dests={dests}
            setDests={setDests}
          />
        </div>
        <div className="flex flex-1"></div>
      </div>
    </div>
  );
}

export default PracticeOpening;
