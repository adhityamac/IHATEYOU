import { Chess } from 'chess.js';
import { GameState, Move, PieceColor } from '@/types/chess';

export class ChessEngine {
    private chess: Chess;

    constructor(fen?: string) {
        this.chess = new Chess(fen);
    }

    public getGameState(): GameState {
        // Calculate captured pieces
        const history = this.chess.history({ verbose: true });
        const capturedW: any[] = [];
        const capturedB: any[] = [];

        history.forEach(move => {
            if (move.captured) {
                if (move.color === 'b') {
                    capturedW.push(move.captured); // Black captured White piece
                } else {
                    capturedB.push(move.captured); // White captured Black piece
                }
            }
        });

        const turn = this.chess.turn(); // 'w' or 'b'
        const isCheckmate = this.chess.isCheckmate();
        const isDraw = this.chess.isDraw();

        let winner: PieceColor | undefined;
        if (isCheckmate) {
            winner = turn === 'w' ? 'b' : 'w';
        } else if (isDraw) {
            // winner remains undefined
        }

        return {
            fen: this.chess.fen(),
            turn: turn as PieceColor,
            isCheck: this.chess.isCheck(),
            isCheckmate: isCheckmate,
            isDraw: isDraw,
            isStalemate: this.chess.isStalemate(),
            winner: winner,
            history: this.chess.history(),
            capturedPieces: {
                w: capturedW,
                b: capturedB
            }
        };
    }

    // Attempt to make a move. Returns null if invalid, or new GameState if valid.
    public makeMove(from: string, to: string, promotion: string = 'q'): GameState | null {
        try {
            const move = this.chess.move({
                from,
                to,
                promotion
            });

            if (!move) return null; // Invalid move

            return this.getGameState();
        } catch (e) {
            return null; // Invalid move
        }
    }

    public isValidMove(from: string, to: string): boolean {
        // Quick check without modifying state (chess.js moves modify state, so we'd undo)
        // Better: Get valid moves from 'from'
        const moves = this.chess.moves({ square: from as any, verbose: true });
        return moves.some(m => m.to === to);
    }

    public getFen(): string {
        return this.chess.fen();
    }

    public reset(): void {
        this.chess.reset();
    }

    public load(fen: string): boolean {
        try {
            this.chess.load(fen);
            return true;
        } catch {
            return false;
        }
    }
}
