import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

// Colors and styling based on requirements
const COLORS = {
  accent: "#ff5722", // X color
  primary: "#1976d2", // O color
  secondary: "#757575", // move history/side elements
  border: "#ececec",
  bg: "#fff"
};

export const meta: MetaFunction = () => [
  { title: "Tic Tac Toe – Sleek Player vs Player Game" },
  { name: "description", content: "A modern, minimalistic Tic Tac Toe web game with move history and player vs player mode." },
];

type Player = "X" | "O";
type Square = Player | null;

function calculateWinner(squares: Square[]): Player | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diags
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}

function isDraw(squares: Square[]): boolean {
  return squares.every(sq => sq !== null) && !calculateWinner(squares);
}

// PUBLIC_INTERFACE
export default function Index() {
  const [history, setHistory] = useState<Square[][]>([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  const currentSquares = history[stepNumber];
  const winner = calculateWinner(currentSquares);
  const draw = isDraw(currentSquares);
  const currentPlayer: Player = xIsNext ? "X" : "O";

  // PUBLIC_INTERFACE
  function handleClick(i: number) {
    if (winner || draw || currentSquares[i]) return;
    const nextSquares = currentSquares.slice();
    nextSquares[i] = currentPlayer;
    const newHistory = history.slice(0, stepNumber + 1).concat([nextSquares]);
    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function jumpTo(step: number) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  function renderSquare(i: number) {
    const value = currentSquares[i];
    let color = "";
    if (value === "X") color = COLORS.accent;
    if (value === "O") color = COLORS.primary;
    return (
      <button
        key={i}
        className="w-20 h-20 md:w-24 md:h-24 rounded-lg border text-3xl md:text-4xl flex items-center justify-center transition-all focus:outline-none"
        style={{
          background: COLORS.bg,
          borderColor: COLORS.border,
          color,
          fontWeight: "600",
          boxShadow: "0 2px 6px rgba(0,0,0,.06)"
        }}
        data-testid={`ttt-square-${i}`}
        onClick={() => handleClick(i)}
        aria-label={`Tic Tac Toe cell ${i + 1} (${value || "empty"})`}
      >
        {value}
      </button>
    );
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-white px-3"
      style={{ fontFamily: "Inter, sans-serif", background: COLORS.bg }}
      data-testid="ttt-main"
    >
      <section className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col md:flex-row max-w-4xl w-full py-10 px-5 md:px-16 gap-10">
        {/* Left - game board and controls */}
        <div className="flex flex-col items-center flex-1">
          {/* Game status bar */}
          <div
            className="mb-6 w-full text-center text-lg md:text-xl font-medium tracking-tight"
            style={{ color: COLORS.secondary, minHeight: "2.2rem" }}
            data-testid="ttt-status"
          >
            {winner ? (
              <span>
                <span style={{ color: winner === "X" ? COLORS.accent : COLORS.primary, fontWeight: 700 }}>
                  Player {winner}
                </span>{" "}
                wins! 🎉
              </span>
            ) : draw ? (
              <span>It's a draw.</span>
            ) : (
              <span>
                Next turn:{" "}
                <span style={{ color: xIsNext ? COLORS.accent : COLORS.primary, fontWeight: 700 }}>
                  Player {currentPlayer}
                </span>
              </span>
            )}
          </div>
          {/* Game board */}
          <div
            className="grid grid-cols-3 gap-3 md:gap-4 mx-auto mb-7"
            style={{
              width: "min(100vw, 330px)",
              maxWidth: "330px"
            }}
            data-testid="ttt-board"
          >
            {Array.from({ length: 9 }).map((_, i) => renderSquare(i))}
          </div>
          <button
            onClick={restartGame}
            className="w-full max-w-xs py-2 px-6 mt-2 rounded-lg border border-gray-200 font-semibold uppercase tracking-wider transition 
            bg-white hover:bg-gray-100 active:bg-gray-200 shadow-sm"
            style={{ color: COLORS.primary, borderColor: COLORS.primary }}
            data-testid="ttt-restart"
            aria-label="Restart the game"
          >
            Restart Game
          </button>
        </div>
        {/* Right - move history */}
        <aside
          className="w-full md:w-60 flex flex-col border-t border-b border-gray-100 md:border-l md:border-t-0 md:border-b-0 md:pl-10"
          style={{ minWidth: "180px", color: COLORS.secondary }}
        >
          <h2 className="font-semibold mb-2 text-base text-gray-700" style={{ letterSpacing: ".04em" }}>
            Move History
          </h2>
          <ol className="overflow-y-auto flex-grow space-y-2 max-h-72 pr-1" data-testid="ttt-history-list">
            {history.map((squares, move) => {
              let desc;
              if (move === 0) desc = "Game start";
              else {
                // Find latest move
                const prev = history[move - 1];
                const changedIdx = squares.findIndex((sq, i) => prev[i] !== sq);
                const player = prev[changedIdx] ? prev[changedIdx] : squares[changedIdx];
                desc = `#${move}: Player ${squares[changedIdx]} to Row ${Math.floor(changedIdx / 3) + 1}, Col ${(changedIdx % 3) + 1}`;
              }
              return (
                <li key={move}>
                  <button
                    className={`rounded px-2 py-1 w-full text-left 
                      ${move === stepNumber
                        ? "bg-blue-50 border border-blue-200 font-semibold"
                        : "hover:bg-gray-50"
                      } transition`}
                    style={{
                      color:
                        move === stepNumber
                          ? COLORS.primary
                          : COLORS.secondary,
                      fontWeight: move === stepNumber ? 600 : 400
                    }}
                    onClick={() => jumpTo(move)}
                    data-testid={`ttt-history-item-${move}`}
                  >
                    {desc}
                  </button>
                </li>
              );
            }).reverse()}
          </ol>
        </aside>
      </section>
    </main>
  );
}
