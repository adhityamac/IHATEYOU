'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Cpu, Users, Crown, ChevronRight } from 'lucide-react';

// --- Chess Logic Types & Constants ---

type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface Piece {
    id: string; // Unique ID for Framer Motion tracking
    type: PieceType;
    color: PieceColor;
    hasMoved: boolean;
}

interface Position {
    row: number;
    col: number;
}

interface Move {
    from: Position;
    to: Position;
    piece: Piece;
    captured?: Piece;
}

const PIECE_SYMBOLS: Record<PieceType, React.ReactNode> = {
    p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚"
};

// --- Helper Functions ---

function createInitialBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const backRow: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];

    let idCounter = 0;
    const getId = () => `piece-${idCounter++}-${Date.now()}`;

    for (let i = 0; i < 8; i++) {
        board[0][i] = { id: getId(), type: backRow[i], color: "b", hasMoved: false };
        board[1][i] = { id: getId(), type: "p", color: "b", hasMoved: false };
        board[6][i] = { id: getId(), type: "p", color: "w", hasMoved: false };
        board[7][i] = { id: getId(), type: backRow[i], color: "w", hasMoved: false };
    }
    return board;
}

function isValidPosition(pos: Position): boolean {
    return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
}

function getLegalMovesWithoutCheckValidation(
    board: (Piece | null)[][],
    from: Position,
    piece: Piece,
    includeCastling = true
): Position[] {
    if (!piece) return [];
    const moves: Position[] = [];
    const { type, color } = piece;
    const direction = color === "w" ? -1 : 1;

    const addMove = (to: Position) => {
        if (!isValidPosition(to)) return false;
        const target = board[to.row][to.col];
        if (target && target.color === color) return false;
        moves.push(to);
        return !target;
    };

    const addDirectionalMoves = (directions: number[][], maxSteps = 8) => {
        for (const [dr, dc] of directions) {
            for (let step = 1; step <= maxSteps; step++) {
                const to = { row: from.row + dr * step, col: from.col + dc * step };
                if (!addMove(to)) break;
            }
        }
    };

    switch (type) {
        case "p":
            const startRow = color === "w" ? 6 : 1;
            const forwardOne = { row: from.row + direction, col: from.col };
            if (isValidPosition(forwardOne) && !board[forwardOne.row][forwardOne.col]) {
                moves.push(forwardOne);
                if (from.row === startRow) {
                    const forwardTwo = { row: from.row + direction * 2, col: from.col };
                    if (!board[forwardTwo.row][forwardTwo.col]) {
                        moves.push(forwardTwo);
                    }
                }
            }
            for (const dc of [-1, 1]) {
                const capture = { row: from.row + direction, col: from.col + dc };
                if (isValidPosition(capture)) {
                    const target = board[capture.row][capture.col];
                    if (target && target.color !== color) {
                        moves.push(capture);
                    }
                }
            }
            break;
        case "n":
            const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
            for (const [dr, dc] of knightMoves) {
                addMove({ row: from.row + dr, col: from.col + dc });
            }
            break;
        case "b":
            addDirectionalMoves([[-1, -1], [-1, 1], [1, -1], [1, 1]]);
            break;
        case "r":
            addDirectionalMoves([[-1, 0], [1, 0], [0, -1], [0, 1]]);
            break;
        case "q":
            addDirectionalMoves([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]);
            break;
        case "k":
            addDirectionalMoves([[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]], 1);
            if (includeCastling && !piece.hasMoved) {
                // Castling Logic
                // Kingside
                const kingsideRook = board[from.row][7];
                if (kingsideRook && kingsideRook.type === "r" && kingsideRook.color === piece.color && !kingsideRook.hasMoved) {
                    if (!board[from.row][5] && !board[from.row][6]) {
                        // Simplified check: assume squares attacked check handled elsewhere or ignored in this basic ver
                        moves.push({ row: from.row, col: 6 });
                    }
                }
                // Queenside
                const queensideRook = board[from.row][0];
                if (queensideRook && queensideRook.type === "r" && queensideRook.color === piece.color && !queensideRook.hasMoved) {
                    if (!board[from.row][1] && !board[from.row][2] && !board[from.row][3]) {
                        moves.push({ row: from.row, col: 2 });
                    }
                }
            }
            break;
    }
    return moves;
}

function isSquareUnderAttack(board: (Piece | null)[][], pos: Position, byColor: PieceColor): boolean {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === byColor) {
                const moves = getLegalMovesWithoutCheckValidation(board, { row, col }, piece, false);
                if (moves.some(move => move.row === pos.row && move.col === pos.col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function findKing(board: (Piece | null)[][], color: PieceColor): Position | null {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.type === "k" && piece.color === color) {
                return { row, col };
            }
        }
    }
    return null;
}

function isInCheck(board: (Piece | null)[][], color: PieceColor): boolean {
    const kingPos = findKing(board, color);
    if (!kingPos) return false;
    const opponentColor = color === "w" ? "b" : "w";
    return isSquareUnderAttack(board, kingPos, opponentColor);
}

function wouldBeInCheck(board: (Piece | null)[][], move: Move, color: PieceColor): boolean {
    const newBoard = makeMove(board, move);
    return isInCheck(newBoard, color);
}

function getLegalMoves(board: (Piece | null)[][], from: Position, piece: Piece): Position[] {
    const pseudoLegalMoves = getLegalMovesWithoutCheckValidation(board, from, piece);
    return pseudoLegalMoves.filter(to => {
        const move = { from, to, piece, captured: board[to.row][to.col] || undefined };
        return !wouldBeInCheck(board, move, piece.color);
    });
}

function getAllLegalMoves(board: (Piece | null)[][], color: PieceColor): Move[] {
    const moves: Move[] = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece && piece.color === color) {
                const from = { row, col };
                const legalMoves = getLegalMoves(board, from, piece);
                for (const to of legalMoves) {
                    moves.push({ from, to, piece, captured: board[to.row][to.col] || undefined });
                }
            }
        }
    }
    return moves;
}

const PIECE_VALUES: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 1000 };
function evaluateBoard(board: (Piece | null)[][], color: PieceColor): number {
    let score = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece) {
                const val = PIECE_VALUES[piece.type];
                score += piece.color === color ? val : -val;
            }
        }
    }
    return score;
}

function makeMove(board: (Piece | null)[][], move: Move): (Piece | null)[][] {
    const newBoard = board.map(row => [...row]);
    const sourcePiece = newBoard[move.from.row][move.from.col];
    if (sourcePiece) {
        const movedPiece = { ...sourcePiece, hasMoved: true };
        newBoard[move.to.row][move.to.col] = movedPiece;
        newBoard[move.from.row][move.from.col] = null;

        // Castling
        if (movedPiece.type === "k" && Math.abs(move.to.col - move.from.col) === 2) {
            if (move.to.col === 6) { // Kingside
                const rook = newBoard[move.from.row][7];
                if (rook) {
                    newBoard[move.from.row][5] = { ...rook, hasMoved: true };
                    newBoard[move.from.row][7] = null;
                }
            } else if (move.to.col === 2) { // Queenside
                const rook = newBoard[move.from.row][0];
                if (rook) {
                    newBoard[move.from.row][3] = { ...rook, hasMoved: true };
                    newBoard[move.from.row][0] = null;
                }
            }
        }
        // Promotion
        if (movedPiece.type === "p") {
            const promotionRow = movedPiece.color === "w" ? 0 : 7;
            if (move.to.row === promotionRow) {
                newBoard[move.to.row][move.to.col] = { ...movedPiece, type: "q" }; // Auto-queen, keep ID
            }
        }
    }
    return newBoard;
}

function getBestMove(board: (Piece | null)[][], color: PieceColor): Move | null {
    const moves = getAllLegalMoves(board, color);
    if (!moves.length) return null;
    return moves[Math.floor(Math.random() * moves.length)];
}


// --- Component ---

interface ChessGameProps {
    onBack: () => void;
}

export default function ChessGame({ onBack }: ChessGameProps) {
    const [board, setBoard] = useState(createInitialBoard);
    const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
    const [currentTurn, setCurrentTurn] = useState<PieceColor>("w");
    const [gameStatus, setGameStatus] = useState("Your Command");
    const [isThinking, setIsThinking] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameMode, setGameMode] = useState<'ai' | 'pvp'>('ai');
    const [selection, setSelection] = useState<'menu' | 'game'>('menu');
    const [capturedWhite, setCapturedWhite] = useState<PieceType[]>([]);
    const [capturedBlack, setCapturedBlack] = useState<PieceType[]>([]);

    const playerColor = "w";
    const aiColor = "b";

    const legalMoves = useMemo(() => {
        if (!selectedSquare) return [];
        const piece = board[selectedSquare.row][selectedSquare.col];
        if (!piece) return [];
        return getLegalMoves(board, selectedSquare, piece);
    }, [board, selectedSquare]);

    const handleSquareClick = useCallback((row: number, col: number) => {
        if (gameOver) return;
        if (gameMode === 'ai' && isThinking && currentTurn === aiColor) return;
        if (gameMode === 'ai' && currentTurn !== playerColor && !selectedSquare) return; // Prevent selecting AI pieces if no selection

        const clickedPiece = board[row][col];

        // 1. Move
        if (selectedSquare) {
            const isLegalMove = legalMoves.some(m => m.row === row && m.col === col);

            // If clicking same piece, deselect
            if (row === selectedSquare.row && col === selectedSquare.col) {
                setSelectedSquare(null);
                return;
            }

            // If clicking another own piece, select that instead (unless in middle of move logic?) 
            // Standard chess UI allows changing selection
            if (clickedPiece && clickedPiece.color === currentTurn) {
                setSelectedSquare({ row, col });
                return;
            }

            if (isLegalMove) {
                const move: Move = {
                    from: selectedSquare,
                    to: { row, col },
                    piece: board[selectedSquare.row][selectedSquare.col]!,
                    captured: clickedPiece || undefined
                };

                const newBoard = makeMove(board, move);
                setBoard(newBoard);
                setSelectedSquare(null);

                // Track captures
                if (clickedPiece) {
                    if (clickedPiece.color === 'w') setCapturedWhite(prev => [...prev, clickedPiece.type]);
                    else setCapturedBlack(prev => [...prev, clickedPiece.type]);
                }

                const nextTurn = currentTurn === 'w' ? 'b' : 'w';
                setCurrentTurn(nextTurn);

                if (gameMode === 'ai') {
                    setGameStatus("Neural Net Calculating...");
                    setIsThinking(true);
                } else {
                    setGameStatus(nextTurn === 'w' ? "White Sector Active" : "Black Sector Active");
                }
                return;
            } else {
                // Illegal move attempted, if empty square, just deselect
                if (!clickedPiece) setSelectedSquare(null);
            }
        }

        // 2. Select
        if (clickedPiece && clickedPiece.color === currentTurn) {
            setSelectedSquare({ row, col });
        }
    }, [board, selectedSquare, legalMoves, currentTurn, gameMode, isThinking, gameOver]);

    // AI Effect
    useEffect(() => {
        if (gameMode === 'ai' && currentTurn === aiColor && !gameOver) {
            const timer = setTimeout(() => {
                const aiMove = getBestMove(board, aiColor);
                if (aiMove) {
                    const newBoard = makeMove(board, aiMove);
                    setBoard(newBoard);
                    if (aiMove.captured) {
                        // AI captured player's piece (White)
                        setCapturedWhite(prev => [...prev, aiMove.captured!.type]);
                    }
                    setCurrentTurn(playerColor);
                    setGameStatus("Your Command");
                    setIsThinking(false);
                } else {
                    setGameOver(true);
                    setGameStatus("Stalemate / Checkmate");
                }
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [currentTurn, gameMode, board, gameOver]);

    // --- Visual Helpers ---

    const getSquareColor = (r: number, c: number) => {
        const isDark = (r + c) % 2 === 1;
        return isDark ? 'bg-slate-900/80' : 'bg-slate-800/40';
    };

    if (selection === 'menu') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] -z-10" />

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
                    <div className="mx-auto mb-6 w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)] border border-indigo-500/30">
                        <Crown size={40} className="text-indigo-400" />
                    </div>
                    <h1 className="text-5xl font-black text-white italic tracking-tighter mb-2">QUANTUM CHESS</h1>
                    <p className="text-indigo-200/60 font-mono tracking-widest text-xs uppercase">Advanced Neural Interface</p>
                </motion.div>

                <div className="grid gap-4 w-full max-w-xs">
                    <button
                        onClick={() => { setGameMode('ai'); setSelection('game'); }}
                        className="group relative p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 rounded-2xl transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform"><Cpu size={24} /></div>
                            <div className="text-left">
                                <div className="text-white font-bold text-lg">Vs Neural Net</div>
                                <div className="text-white/40 text-xs">Single Player</div>
                            </div>
                        </div>
                        <ChevronRight className="text-white/20 group-hover:text-white" />
                    </button>

                    <button
                        onClick={() => { setGameMode('pvp'); setSelection('game'); }}
                        className="group relative p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-fuchsia-500/50 rounded-2xl transition-all flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-fuchsia-500/20 rounded-xl text-fuchsia-400 group-hover:scale-110 transition-transform"><Users size={24} /></div>
                            <div className="text-left">
                                <div className="text-white font-bold text-lg">PVP Sector</div>
                                <div className="text-white/40 text-xs">Local Multiplayer</div>
                            </div>
                        </div>
                        <ChevronRight className="text-white/20 group-hover:text-white" />
                    </button>
                </div>

                <button onClick={onBack} className="mt-12 text-white/30 hover:text-white text-sm flex items-center gap-2 transition-colors">
                    <ArrowLeft size={14} /> EXIT SIMULATION
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center bg-[#050505] relative p-4 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="w-full max-w-[420px] mb-6 flex justify-between items-center z-10">
                <button onClick={() => setSelection('menu')} className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                    <ArrowLeft size={20} />
                </button>
                <div className="text-center">
                    <div className="text-[10px] font-mono text-indigo-400 mb-1 tracking-[0.2em] uppercase opacity-70">Status</div>
                    <div className="text-white font-black text-xl tracking-tight">{gameStatus}</div>
                </div>
                <button onClick={() => { setBoard(createInitialBoard()); setCurrentTurn('w'); setGameOver(false); }} className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Board Container */}
            <div className="w-full max-w-[420px] aspect-square relative rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(79,70,229,0.15)] border border-white/10 z-10">
                {/* Grid Renders */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {board.map((rowArr, rowIndex) => (
                        rowArr.map((_, colIndex) => {
                            const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                            const isMoveTarget = legalMoves.some(m => m.row === rowIndex && m.col === colIndex);
                            return (
                                <div
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                                    className={`relative ${getSquareColor(rowIndex, colIndex)} transition-colors backdrop-blur-md`}
                                >
                                    {/* Selection Highlight */}
                                    {isSelected && (
                                        <motion.div layoutId="selection" className="absolute inset-0 border-[3px] border-indigo-400 shadow-[inset_0_0_20px_rgba(129,140,248,0.5)] z-0" />
                                    )}

                                    {/* Move Indicator */}
                                    {isMoveTarget && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                                            {board[rowIndex][colIndex] ? (
                                                <div className="absolute inset-1 border-[4px] border-rose-500/60 rounded-xl" /> // Capture Target
                                            ) : (
                                                <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" /> // Move Target
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ))}
                </div>

                {/* Pieces Layer */}
                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none">
                    {board.map((rowArr, rowIndex) => (
                        rowArr.map((piece, colIndex) => (
                            <div key={`p-cell-${rowIndex}-${colIndex}`} className="flex items-center justify-center w-full h-full">
                                <AnimatePresence mode='popLayout'>
                                    {piece && (
                                        <motion.div
                                            layoutId={piece.id}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                            className="relative z-30 cursor-pointer pointer-events-auto w-full h-full flex items-center justify-center"
                                            onClick={(e) => { e.stopPropagation(); handleSquareClick(rowIndex, colIndex); }}
                                        >
                                            <span
                                                className={`text-[2.5rem] md:text-[3rem] select-none filter drop-shadow-lg leading-none
                                                    ${piece.color === 'w' ? 'text-cyan-200 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'text-fuchsia-400 drop-shadow-[0_0_15px_rgba(232,121,249,0.6)]'}
                                                `}
                                                style={{ textShadow: piece.color === 'w' ? '0 0 20px rgba(34,211,238,0.5)' : '0 0 20px rgba(232,121,249,0.5)' }}
                                            >
                                                {PIECE_SYMBOLS[piece.type]}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    ))}
                </div>
            </div>

            {/* Captured Pieces Display */}
            <div className="w-full max-w-[420px] mt-6 grid grid-cols-2 gap-4 z-10">
                <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">White Captured</div>
                    <div className="flex flex-wrap gap-1 min-h-[24px]">
                        {capturedBlack.map((p, i) => (
                            <span key={i} className="text-fuchsia-400/50 text-xl leading-none">{PIECE_SYMBOLS[p]}</span>
                        ))}
                    </div>
                </div>
                <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/5 flex flex-col gap-2">
                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Black Captured</div>
                    <div className="flex flex-wrap gap-1 min-h-[24px]">
                        {capturedWhite.map((p, i) => (
                            <span key={i} className="text-cyan-300/50 text-xl leading-none">{PIECE_SYMBOLS[p]}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
