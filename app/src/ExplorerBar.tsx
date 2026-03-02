import React from "react";

interface ResultBarProps {
  white: number;
  black: number;
  draw: number;
}

const ExplorerBar: React.FC<ResultBarProps> = ({white, black, draw}) => {
  const total = white + black + draw;
  const whitePercent = total ? (white / total) * 100 : 0;
  const blackPercent = total ? (black / total) * 100 : 0;
  const drawPercent = total ? (draw / total) * 100 : 0;

  return (
    <div className="w-56 flex items-center">
      <div
        className="flex h-5 w-full rounded-md overflow-hidden"
        style={{fontSize: "0.7rem", fontWeight: 600}}>
        <div
          className="flex items-center justify-center text-black"
          style={{
            width: `${whitePercent}%`,
            backgroundColor: "#e8e8e8",
            transition: "width 0.3s ease",
          }}
          title={`White: ${whitePercent.toFixed(1)}%`}>
          {whitePercent >= 12 ? `${Math.round(whitePercent)}%` : ""}
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: `${drawPercent}%`,
            backgroundColor: "#888",
            color: "#fff",
            transition: "width 0.3s ease",
          }}
          title={`Draw: ${drawPercent.toFixed(1)}%`}>
          {drawPercent >= 12 ? `${Math.round(drawPercent)}%` : ""}
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: `${blackPercent}%`,
            backgroundColor: "#333",
            color: "#ccc",
            transition: "width 0.3s ease",
          }}
          title={`Black: ${blackPercent.toFixed(1)}%`}>
          {blackPercent >= 12 ? `${Math.round(blackPercent)}%` : ""}
        </div>
      </div>
    </div>
  );
};

export default ExplorerBar;
