import { Game } from "../entities/Game/Game";
import { getOptions } from "./auxiliary/getOptions";
import { playerTurn } from "./playerTurn";
import { playerDraw } from "./playerDraw";



async function main(){
    //get options and create game
    let [players, options] = await getOptions();
    let playerIds = Array.from(Array(players), (_, index) => `${index}`);
    let game = new Game(playerIds, options);

    console.log(`
    -----
    Game configuration: 
        Joker: ${game.jokerNumber}
        cardsToDraw:  ${game.cardsToDraw}
        cardsToDrawDiscardPile: ${game.cardsToDrawDiscardPile}
        cardsToDeal: ${game.cardsToDeal}
        numberOfDecks: ${game.numberOfDecks}
    -----
    `)
    
    game.nextRound();

    //main game loop
    while (game.gameStatus !== "END_GAME") {
        while (true) { // Infinite loop for player actions within a round
            if (game.gameStatus === "PLAYER_TURN") {
                await playerTurn(game);
                game.nextPlayer();
            } else if (game.gameStatus === "PLAYER_TO_DRAW") {
                await playerDraw(game);
            } else if (game.gameStatus === "PLAYER_TURN_ENDED") {
                // Possibly do something for the end of a player's turn
            } else if (game.gameStatus === "ROUND_ENDED" || game.gameStatus === "END_GAME") {
                break; // Break inner loop when round ends or game ends
            }
        }
    
        if (game.gameStatus === "ROUND_ENDED") {
            console.log('Round has ended! Score: ');
            game.nextRound();
        }
    }
}


//execute
main();
  
  
  
  
  
  
  