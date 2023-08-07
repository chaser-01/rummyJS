/**
 * Used for logging a game's actions and warnings/errors.
 */
export class Logger{

    /**
     * Creates a Logger.
     * @constructor
     * @modifies {actionLog}
     * @modifies {warningLog}
     * @param {Game} game 
     */
    constructor(game){
        this.game = game;
        this.actionLog = {};
        this.warningLog = {};
    }


    /**
     * If the game's current round doesn't exist in actionLog/warningLog, create it
     * @modifies {actionLog}
     * @modifies {warningLog}
     */
    logNewRound(){
        if (!this.actionLog[this.game.currentRound]) this.actionLog[this.game.currentRound] = [];
        if (!this.warningLog[this.game.currentRound]) this.warningLog[this.game.currentRound] = [];
    }


    /**
     * Logs any error/warning occurring in the game.
     * @modifies {warningLog}
     * @param {string} functionName - Function that represents the action
     * @param {string} playerId - Optional ID of the player who called (defaults to the game)
     * @param {Object} args - Object containing arguments of the function
     * @param {string} notes - Optional notes for this log
     */
    logWarning(functionName, playerId='GAME', args=undefined, notes=''){
        let logObject = {};

        logObject.functionName = functionName;
        logObject.playerId = playerId;
        logObject.args = args;
        if (notes) logObject.notes = notes;

        this.warningLog[this.game.currentRound].push(logObject);
    }


    /**
     * Logs any action taken in the game.
     * @modifies {actionLog}
     * @param {string} functionName - Function that represents the action
     * @param {string} playerId - Optional ID of the player who called (defaults to the game)
     * @param {Object} args - Object containing arguments of the function
     * @param {string} notes - Optional notes for this log
     */
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