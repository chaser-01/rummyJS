import { Game } from "../entities/Game/Game.js";
import { getOptions } from "./auxiliary/getOptions.js";
import { playerTurn } from "./playerTurn.js";



async function main(){
    //get options and create game
    let players, options;
    [players, options] = await getOptions();
    let playerIds = Array.from(Array(players), (_, index) => index+1);

    let game = new Game(playerIds, options);
    game.nextRound();

    //main game loop
    while (game.gameStatus !== game.GameStatus.END_GAME){
        while (game.gameStatus !== game.GameStatus.ROUND_ENDED){
            while (game.gameStatus == game.GameStatus.PLAYER_TURN){
                await playerTurn(game);
            }
            game.nextPlayer();
        }
        game.nextRound();
    }
}


//execute
main();
  
  
  
  
  
  
  