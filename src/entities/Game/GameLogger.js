export class GameLogger{
    constructor(game){
        this.game = game;
        this.actionLog = {};
        this.warningLog = {};
    }

    logWarning(message){
        console.log(message);
        //TO DO: some way of adding this to the log
    }

    logGameAction(action){
        //TO DO: some way of adding action to log
    }

    writeOut(){
        //TO DO: low prio but eventually write out the logs somewhere
    }
}