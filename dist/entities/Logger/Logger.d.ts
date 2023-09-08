import { Game } from '../Game/Game';
type argList = {
    [argName: string]: string | number | string[] | number[];
};
type LogObject = {
    functionName: string;
    playerId: string | number;
    args: argList;
    notes: string;
};
type Log = {
    [index: number]: LogObject[];
};
/**  Used for logging a game's actions and warnings/errors. */
export declare class Logger {
    game: Game;
    actionLog: Log;
    warningLog: Log;
    /** Creates a Logger. */
    constructor(game: Game);
    /** If the game's current round doesn't exist in actionLog/warningLog, create it */
    logNewRound(): void;
    /** Logs a game warning/error. */
    logWarning(functionName: string, playerId?: string, args?: argList, notes?: string): void;
    /** Logs a game action. */
    logGameAction(functionName: string, playerId?: string, args?: argList, notes?: string): void;
    writeOut(): void;
}
export {};
