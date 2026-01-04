'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Cpu, Users, Crown, Flag, Settings } from 'lucide-react';

// --- Chess Logic Types & Constants (PRESERVED) ---

type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface Piece {
    id: string;
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

// --- Helper Functions (PRESERVED) ---

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


// --- New UI Component ---

interface ChessGameProps {
    onBack: () => void;
}

export default function ChessGame({ onBack }: ChessGameProps) {
    const [board, setBoard] = useState(createInitialBoard);
    const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
    const [currentTurn, setCurrentTurn] = useState<PieceColor>("w");
    const [isThinking, setIsThinking] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameMode, setGameMode] = useState<'ai' | 'pvp'>('ai');
    const [selection, setSelection] = useState<'menu' | 'game'>('menu');
    const [capturedWhite, setCapturedWhite] = useState<PieceType[]>([]);
    const [capturedBlack, setCapturedBlack] = useState<PieceType[]>([]);

    const playerColor = "w";
    const aiColor = "b";

    // --- Stats ---
    const [whiteTime, setWhiteTime] = useState(600); // 10 mins
    const [blackTime, setBlackTime] = useState(600);

    const legalMoves = useMemo(() => {
        if (!selectedSquare) return [];
        const piece = board[selectedSquare.row][selectedSquare.col];
        if (!piece) return [];
        return getLegalMoves(board, selectedSquare, piece);
    }, [board, selectedSquare]);

    // Timer Effect
    useEffect(() => {
        if (selection !== 'game' || gameOver) return;
        const timer = setInterval(() => {
            if (currentTurn === 'w') setWhiteTime(t => Math.max(0, t - 1));
            else setBlackTime(t => Math.max(0, t - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentTurn, selection, gameOver]);

    const handleSquareClick = useCallback((row: number, col: number) => {
        if (gameOver) return;
        if (gameMode === 'ai' && isThinking && currentTurn === aiColor) return;
        if (gameMode === 'ai' && currentTurn !== playerColor && !selectedSquare) return;

        const clickedPiece = board[row][col];

        // 1. Move
        if (selectedSquare) {
            const isLegalMove = legalMoves.some(m => m.row === row && m.col === col);

            if (row === selectedSquare.row && col === selectedSquare.col) {
                setSelectedSquare(null);
                return;
            }

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

                if (clickedPiece) {
                    if (clickedPiece.color === 'w') setCapturedWhite(prev => [...prev, clickedPiece.type]);
                    else setCapturedBlack(prev => [...prev, clickedPiece.type]);
                }

                const nextTurn = currentTurn === 'w' ? 'b' : 'w';
                setCurrentTurn(nextTurn);

                if (gameMode === 'ai') {
                    setGameStatus("Opponent thinking...");
                    setIsThinking(true);
                } else {
                    setGameStatus(nextTurn === 'w' ? "White's Turn" : "Black's Turn");
                }
                return;
            } else {
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
                        setCapturedWhite(prev => [...prev, aiMove.captured!.type]);
                    }
                    setCurrentTurn(playerColor);
                    setIsThinking(false);
                } else {
                    setGameOver(true);
                }
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [currentTurn, gameMode, board, gameOver]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // --- Themes ---
    // Using a "Duolingo style" vibrant palette
    const squareLight = 'bg-[#eeeed2]'; // Cream
    const squareDark = 'bg-[#769656]';  // Green
    const highlight = 'bg-[#baca44]';   // Yellow-Green

    if (selection === 'menu') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-stone-100 font-sans">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-12"
                >
                    <div className="mx-auto mb-6 w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_8px_0_rgba(0,0,0,0.1)] border-2 border-stone-100">
                        <Crown size={48} className="text-yellow-500 fill-yellow-500" />
                    </div>
                    <h1 className="text-4xl font-black text-stone-800 tracking-tight mb-2">CHESS ARENA</h1>
                    <p className="text-stone-400 font-medium font-mono uppercase tracking-widest text-xs">Select Game Mode</p>
                </motion.div>

                <div className="grid gap-4 w-full max-w-sm">
                    <button
                        onClick={() => { setGameMode('ai'); setSelection('game'); }}
                        className="group relative p-4 bg-white hover:bg-stone-50 border-2 border-b-4 border-stone-200 hover:border-blue-400 rounded-2xl transition-all active:border-b-2 active:translate-y-[2px] flex items-center gap-4 w-full"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500">
                            <Cpu size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <div className="text-stone-700 font-bold text-lg">Play vs Bot</div>
                            <div className="text-stone-400 text-xs font-bold uppercase">Single Player</div>
                        </div>
                    </button>

                    <button
                        onClick={() => { setGameMode('pvp'); setSelection('game'); }}
                        className="group relative p-4 bg-white hover:bg-stone-50 border-2 border-b-4 border-stone-200 hover:border-green-400 rounded-2xl transition-all active:border-b-2 active:translate-y-[2px] flex items-center gap-4 w-full"
                    >
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-500">
                            <Users size={24} />
                        </div>
                        <div className="text-left flex-1">
                            <div className="text-stone-700 font-bold text-lg">Pass & Play</div>
                            <div className="text-stone-400 text-xs font-bold uppercase">Multiplayer</div>
                        </div>
                    </button>
                </div>

                <button onClick={onBack} className="mt-12 text-stone-400 hover:text-stone-600 font-bold text-sm flex items-center gap-2 transition-colors uppercase tracking-widest">
                    <ArrowLeft size={16} /> Exit
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center bg-stone-100 p-4 md:p-8 overflow-hidden font-sans">

            <div className="w-full max-w-[480px] h-full flex flex-col gap-4">

                {/* Header Actions */}
                <div className="flex justify-between items-center px-2">
                    <button onClick={() => setSelection('menu')} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 rounded-xl transition-all">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="font-bold text-stone-400 text-xs tracking-widest uppercase">
                        {gameMode === 'ai' ? 'Bot Match' : 'PvP Match'}
                    </div>
                    <button onClick={() => alert("Settings unimplemented")} className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-200/50 rounded-xl transition-all">
                        <Settings size={24} />
                    </button>
                </div>

                {/* Opponent Card (Black) */}
                <div className={`
                    flex items-center gap-4 p-3 bg-white rounded-2xl border-2 border-b-4 
                    ${currentTurn === 'b' ? 'border-green-400 bg-green-50/50' : 'border-stone-200'}
                    transition-colors duration-300
                `}>
                    <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-white shadow-inner">
                        {gameMode === 'ai' ? <Cpu size={24} /> : <Users size={24} />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-black text-stone-800 text-lg">{gameMode === 'ai' ? 'Bot Opponent' : 'Player 2'}</span>
                            <div className="flex gap-1">
                                {capturedWhite.map((p, i) => (
                                    <span key={i} className="text-lg text-stone-800">{PIECE_SYMBOLS[p]}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`h-2 rounded-full flex-1 ${currentTurn === 'b' ? 'bg-green-400' : 'bg-stone-200'}`} />
                            <span className="font-mono font-bold text-stone-400">{formatTime(blackTime)}</span>
                        </div>
                    </div>
                </div>

                {/* BOARD */}
                <div className="flex-1 flex items-center justify-center my-2">
                    <div className="w-full aspect-square bg-[#302E2B] rounded-xl p-1 shadow-xl">
                        <div className="w-full h-full rounded-lg overflow-hidden grid grid-cols-8 grid-rows-8 relative">
                            {board.map((rowArr, rowIndex) => (
                                rowArr.map((_, colIndex) => {
                                    const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                                    const isMoveTarget = legalMoves.some(m => m.row === rowIndex && m.col === colIndex);
                                    const isDark = (rowIndex + colIndex) % 2 === 1;

                                    // Highlight logic
                                    let bgClass = isDark ? squareDark : squareLight;
                                    if (isSelected) bgClass = highlight; // Selected color
                                    // if (isLastMove) bgClass = ...

                                    return (
                                        <div
                                            key={`cell-${rowIndex}-${colIndex}`}
                                            onClick={() => handleSquareClick(rowIndex, colIndex)}
                                            className={`${bgClass} relative flex items-center justify-center select-none`}
                                        >
                                            {/* Coordinate Labels */}
                                            {colIndex === 0 && (
                                                <span className={`absolute top-0.5 left-0.5 text-[9px] font-bold ${isDark ? 'text-[#eeeed2]' : 'text-[#769656]'}`}>
                                                    {8 - rowIndex}
                                                </span>
                                            )}
                                            {rowIndex === 7 && (
                                                <span className={`absolute bottom-0 right-0.5 text-[9px] font-bold ${isDark ? 'text-[#eeeed2]' : 'text-[#769656]'}`}>
                                                    {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][colIndex]}
                                                </span>
                                            )}

                                            {/* Move Hints */}
                                            {isMoveTarget && (
                                                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                                                    {board[rowIndex][colIndex] ? (
                                                        <div className="w-full h-full border-[6px] border-black/10 rounded-full" />
                                                    ) : (
                                                        <div className="w-4 h-4 bg-black/10 rounded-full" />
                                                    )}
                                                </div>
                                            )}

                                            {/* Piece */}
                                            <div className="relative z-20 w-full h-full flex items-center justify-center">
                                                <AnimatePresence>
                                                    {board[rowIndex][colIndex] && (
                                                        <motion.div
                                                            layoutId={board[rowIndex][colIndex]!.id}
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                                            className="w-full h-full flex items-center justify-center cursor-pointer"
                                                        >
                                                            <span
                                                                className={`
                                                                    text-[2.8rem] leading-none mb-1 filter select-none
                                                                    ${board[rowIndex][colIndex]!.color === 'w'
                                                                        ? 'text-white drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)]'
                                                                        : 'text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]'
                                                                    }
                                                                `}
                                                            >
                                                                {PIECE_SYMBOLS[board[rowIndex][colIndex]!.type]}
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                    </div>
                </div>

                {/* Player Card (White) */}
                <div className={`
                    flex items-center gap-4 p-3 bg-white rounded-2xl border-2 border-b-4 
                    ${currentTurn === 'w' ? 'border-green-400 bg-green-50/50' : 'border-stone-200'}
                    transition-colors duration-300
                `}>
                    <div className="w-12 h-12 rounded-xl bg-white border-2 border-stone-100 flex items-center justify-center text-stone-800 shadow-sm relative overflow-hidden">
                        {/* Placeholder Avatar */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100" />
                        <span className="relative font-bold text-lg">YOU</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <span className="font-black text-stone-800 text-lg">Player 1</span>
                            <div className="flex gap-1">
                                {capturedBlack.map((p, i) => (
                                    <span key={i} className="text-lg text-stone-800">{PIECE_SYMBOLS[p]}</span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`h-2 rounded-full flex-1 ${currentTurn === 'w' ? 'bg-green-400' : 'bg-stone-200'}`} />
                            <span className="font-mono font-bold text-stone-400">{formatTime(whiteTime)}</span>
                        </div>
                    </div>
                </div>

                {/* Game Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={() => { setBoard(createInitialBoard()); setCurrentTurn('w'); setGameOver(false); }}
                        className="flex-1 p-3 bg-stone-200 hover:bg-stone-300 text-stone-600 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw size={16} /> New Game
                    </button>
                    <button
                        onClick={() => alert("Resign unimplemented")}
                        className="flex-1 p-3 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-colors"
                    >
                        <Flag size={16} /> Resign
                    </button>
                </div>

            </div>
        </div>
    );
}
