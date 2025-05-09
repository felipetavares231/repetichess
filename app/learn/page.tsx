import React, { useEffect, useState } from "react";
import { Chess } from "chess.js";
import NavBar from "../src/NavBar";
import Board from "../src/Board";
import OpeningExplorer from "../src/OpeningExplorer";
import { updateDests } from "../utils/updateDests";

function LearnOpening() {
  const [fen, setFen] = useState<string | undefined>();

  const [chess] = useState(new Chess());

  const [dests, setDests] = useState(new Map<string, string[]>());

  useEffect(() => {
    console.log(chess.history());
  }, [fen]);

  return (
    <div>
      <NavBar />
      <div className="flex flex-1 justify-center">
        <div className="flex-1"></div>
        <div className="flex flex-1">
          <Board
            onChange={(fen) => setFen(fen)}
            chess={chess}
            dests={dests}
            setDests={setDests}
          />
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
