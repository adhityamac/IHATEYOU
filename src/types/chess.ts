export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
    type: PieceType;
    color: PieceColor;
}

export type Board = (Piece | null)[][];

export interface Move {
    from: string; // e.g., 'e2'
    to: string;   // e.g., 'e4'
    promotion?: PieceType;
    captured?: PieceType;
    san?: string; // Standard Algebraic Notation
}

export interface GameState {
    fen: string;
    turn: PieceColor;
    isCheck: boolean;
    isCheckmate: boolean;
    isDraw: boolean;
    isStalemate: boolean;
    winner?: PieceColor;
    history: string[]; // LAN or SAN history
    capturedPieces: {
        w: PieceType[];
        b: PieceType[];
    };
}
