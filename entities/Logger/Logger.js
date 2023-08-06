export class Logger{
    constructor(game){
        this.game = game;
        this.actionLog = {};
        this.warningLog = {};
        this.currentRound;
    }


    //creates a new round in actionLog and warningLog, and sets currentRound as the input round
    logNewRound(roundNumber){
        this.actionLog[roundNumber] = [];
        this.warningLog[roundNumber] = [];
        this.currentRound = roundNumber;
    }


    //logs warnings/errors; if no playerId, assume it's a game action, so set playerId as 'GAME'
    logWarning(functionName, playerId='GAME', args=undefined, notes=''){
        let logObject = {};

        logObject.functionName = functionName;
        logObject.playerId = playerId;
        logObject.args = args;
        if (notes) logObject.notes = notes;

        this.warningLog[this.currentRound].push(logObject);
    }


    //logs actions occurring in the game; if no playerId, assume it's a game action, so set playerId as 'GAME'
    logGameAction(functionName, playerId='GAME', args=undefined, notes=undefined){
        let logObject = {};

        logObject.functionName = functionName;
        logObject.playerId = playerId;
        if (args) logObject.args = args;
        if (notes) logObject.notes = notes;

        this.actionLog[this.currentRound].push(logObject);
    }   

    
    //TO DO: eventually write out the logs to a file or something
    writeOut(){
        
    }
}