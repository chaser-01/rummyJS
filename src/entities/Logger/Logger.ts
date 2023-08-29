import { Game } from '../Game/Game';

type LogObject = {
    functionName: string,
    playerId: string|number,
    args: any,
    notes: string|undefined
}

type Log = {
    [index: number]: LogObject[]
}


/**  Used for logging a game's actions and warnings/errors. */
export class Logger{
    /// Properties ///


    game: Game;
    actionLog: Log;
    warningLog: Log;


    /// Methods ///


    /**
     * Creates a Logger.
     * @constructor
     */
    constructor(game){
        this.game = game;
        this.actionLog = {};
        this.warningLog = {};
    }


    /** If the game's current round doesn't exist in actionLog/warningLog, create it */
    logNewRound(){
        if (!this.actionLog[this.game.currentRound]) this.actionLog[this.game.currentRound] = [];
        if (!this.warningLog[this.game.currentRound]) this.warningLog[this.game.currentRound] = [];
    }


    /** Logs a game warning/error. */
    logWarning(functionName, playerId='GAME', args=undefined, notes=undefined){
        let logObject: LogObject = {functionName, playerId, args, notes};
        this.warningLog[this.game.currentRound].push(logObject);
    }


    /** Logs a game action. */
    logGameAction(functionName, playerId='GAME', args=undefined, notes=undefined){
        let logObject = {};

        logObject.functionName = functionName;
        logObject.playerId = playerId;
        if (args) logObject.args = args;
        if (notes) logObject.notes = notes;

        this.actionLog[this.game.currentRound].push(logObject);
    }   

    
    //TO DO: eventually write out the logs to a file in a nice way?
    writeOut(){
        
    }
}