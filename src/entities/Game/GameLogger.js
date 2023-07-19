export class GameLogger{
    constructor(game){
        this.game = game;
        this.gameLog = []; //an array of round objects that hold all game actions/warnings
    }

    logWarning(message){
        console.log(message);
        //TO DO: some way of adding this to the log
    }

    logGameAction(action){
        //TO DO: some way of adding action to log
    }
}