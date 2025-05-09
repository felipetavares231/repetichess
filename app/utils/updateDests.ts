import { Chess } from "chess.js";

export const updateDests = (chess: Chess, dests: Map<string, string[]>, setDests: React.Dispatch<React.SetStateAction<Map<string, string[]>>>) => {
    const newDests = new Map<string, string[]>();

    for (const move of chess.moves({ verbose: true })) {
      if (!newDests.has(move.from)) {
        newDests.set(move.from, []);
      }
      newDests.get(move.from)!.push(move.to);
    }

    setDests(newDests);
  };