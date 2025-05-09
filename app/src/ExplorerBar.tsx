import React from "react";

interface ResultBarProps {
  white: number;
  black: number;
  draw: number;
}

const ExplorerBar: React.FC<ResultBarProps> = ({ white, black, draw }) => {
  const total = white + black + draw;
  const whitePercent = (white * 100) / total;
  const blackPercent = total ? (black / total) * 100 : 0;
  const drawPercent = total ? (draw / total) * 100 : 0;

  return (
    <div className="w-96 ml-4 mr-4">
      <div className="flex text-sm mb-1 justify-between"></div>
      <div className="flex h-6 w-full rounded overflow-hidden border border-gray-300">
        <div
          className="flex bg-white text-black justify-center"
          style={{ width: `${whitePercent}%` }}
          title={`White wins: ${whitePercent.toFixed(1)}%`}
        >
          {`${whitePercent.toFixed(1)}%`}
        </div>
        <div
          className="flex bg-gray-500 justify-center"
          style={{ width: `${drawPercent}%` }}
          title={`Draw: ${drawPercent.toFixed(1)}%`}
        >
          {drawPercent >= 10 ? `${drawPercent.toFixed(1)}%` : ""}
        </div>
        <div
          className="flex bg-black justify-center"
          style={{ width: `${blackPercent}%` }}
          title={`Black wins: ${blackPercent.toFixed(1)}%`}
        >
          {`${blackPercent.toFixed(1)}%`}
        </div>
      </div>
    </div>
  );
};

export default ExplorerBar;
