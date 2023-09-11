import { Logger, LogObject } from "./Logger";
import { Game } from "../Game/Game";
jest.mock('../Game/Game');


//just creates a game with currentRound 1
function initGame(){
    let game = new Game(['1', '2']);
    Object.defineProperty(game, "currentRound", {value: 1});
    return game;
}


describe('Logger', () =>{
    test('should initialize', () => {
        let game = initGame();
        let logger = new Logger(game);
        expect(logger.game).toBe(game);
    })

    test('should log a warning/error', () => {
        let logger = new Logger(initGame());
        let warning: LogObject = {
            functionName: 'testFn',
            playerId: '1',
            args: {arg1: 'arg1', arg2: 'arg2'},
            notes: 'test warning'
        };

        logger.logWarning(warning.functionName, warning.playerId, warning.args, warning.notes);
        expect(logger.warningLog[1][0]).toEqual(warning); 

        let warning2 = {...warning};
        warning2.playerId = undefined;
        logger.logWarning(warning2.functionName, warning2.playerId, warning2.args, warning2.notes);
        expect(logger.warningLog[1][1].playerId).toEqual('GAME'); //if no playerId provided, default to game
    })

    test('should log an action', () => {
        let logger = new Logger(initGame());
        let action: LogObject = {
            functionName: 'testFn',
            playerId: '1',
            args: {arg1: 'arg1', arg2: 'arg2'},
            notes: 'test warning'
        };

        logger.logWarning(action.functionName, action.playerId, action.args, action.notes);
        expect(logger.warningLog[1][0]).toEqual(action); 
    })
})
