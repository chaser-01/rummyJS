import { getInput } from "./auxiliary/getInput";
import { printGameInfo } from "./auxiliary/printGameInfo";
import { sortPlayerHand, createMeld, addToMeld, replaceMeldCard, endTurn, quitPlayer } from "./playerTurnActions";
import { Game } from "../entities/Game/Game";

export async function playerTurn(game: Game){
    printGameInfo(game);
    
    while (game.gameStatus == game.GameStatus.PLAYER_TURN){
        let playerOption = await getInput(
            `Your next action:
                0: Show game info
                1: Sort hand
                2: Create a meld
                3: Add to an existing meld
                4: Replace an existing meld's card
                5: End turn
                6: Quit
    
                Input: `, x => {
            let input = parseInt(x);
            if (isNaN(input) || input<0 || input>5) {
                console.log('Invalid input; please try again.');
                return -1;
            }   
            return input;
        });
    
        switch(playerOption){
            //Show table info
            case 0:
                await printGameInfo(game);
                break;
    
            //Sort player hand
            case 1:
                await sortPlayerHand(game);
                break;
            
            //Create a meld
            case 2:
                await createMeld(game);
                break;
            
            //Add to an existing meld
            case 3:
                await addToMeld(game);
                break;
            
            //Replace an existing meld's card
            case 4:
                await replaceMeldCard(game);
                break;
            
            //End turn (must input a card to discard)
            case 5:
                await endTurn(game);
                break;

            //Quit current player (ends game if 1 other player is left)
            case 6:
                await quitPlayer(game);
                break;
            
            //Goes back to input
            default:
                break;
        }
    }
}