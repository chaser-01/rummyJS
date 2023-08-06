import { Game } from "../entities/Game/Game.js";
import { getOptions } from "./auxiliary/getOptions.js";
import { playerTurn } from "./playerTurn.js";
import { playerDraw } from "./playerDraw.js";



async function main(){
    //get options and create game
    let players, options;
    [players, options] = await getOptions();
    let playerIds = Array.from(Array(players), (_, index) => index+1);
    let game = new Game(playerIds, options);

    console.log(`
    -----
    Game configuration: 
        useWildcard: ${game.useWildcard}
        useJoker: ${game.useJoker}
        cardsToDraw:  ${game.cardsToDraw}
        cardsToDrawDiscardPile: ${game.cardsToDrawDiscardPile}
        cardsToDeal: ${game.cardsToDeal}
        numberOfDecks: ${game.numberOfDecks}
    -----
    `)
    
    game.nextRound();

    //main game loop
    while (game.gameStatus !== game.GameStatus.END_GAME){
        while (game.gameStatus !== game.GameStatus.ROUND_ENDED){
            await playerTurn(game);
            game.nextPlayer();
            await playerDraw(game);
        }
        console.log('Round has ended! Score: ');
        game.nextRound();
        }
    console.log('Game has ended. Thanks for playing!');
}


//execute
main();
  
  
  
  
  
  
  