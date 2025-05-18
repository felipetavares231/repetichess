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
import {useRouter} from "next/navigation";

function LearnOpening() {
  const [fen, setFen] = useState<string | undefined>();

  const [chess] = useState(new Chess());

  const [dests, setDests] = useState(new Map<string, string[]>());

  const [orientation, setOrientation] = useState<"white" | "black">("white");

  const [isSaving, setIsSaving] = useState(false);

  const [boardName, setBoardName] = useState("");

  const user = useUser();

  const router = useRouter();

  const handleSaveBoard = async () => {
    if (!user) {
      console.log("no user");
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
      }),
    });
    router.push("/list");
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
              onClick={() => setIsSaving(true)}
              sx={{
                borderRadius: "8px",
                backgroundColor: "primary.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}>
              <Done />
            </IconButton>
          </div>
          <div className="ml-4">
            <Board
              orientation={orientation}
              onChange={(fen) => setFen(fen)}
              chess={chess}
              dests={dests}
              setDests={setDests}
            />
          </div>
        </div>
        <div className="w-[600px]">
          {fen !== undefined && (
            <OpeningExplorer
              onChangeOrientation={() => {
                setOrientation((prev) => (prev == "white" ? "black" : "white"));
              }}
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
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={isSaving}
          onClose={() => setIsSaving(false)}
          closeAfterTransition>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              borderRadius: 4,
              flexDirection: "column",
              display: "flex",
            }}>
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              fontWeight={"bold"}>
              Save Board
            </Typography>
            <Typography
              id="transition-modal-description"
              sx={{mt: 2}}></Typography>
            <TextField
              onChange={(e) => setBoardName(e.target.value)}
              sx={{
                marginBottom: 2,
              }}
              variant="outlined"
              label="Name e.g.: Queen's Gambit, Caro Kann"></TextField>
            <Button variant="contained" onClick={handleSaveBoard}>
              Save
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default LearnOpening;
