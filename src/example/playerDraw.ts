import { getInput } from "./auxiliary/getInput";
import { Game } from "../entities/Game/Game";

/** Lets player choose to draw from deck or discard pile. */
export async function playerDraw(game: Game){
    let gameInfo = game.getGameInfoForPlayer();
    let option = -1;
    while (option == -1){
        option = await getInput(`
        Player ${gameInfo.currentPlayer.id} turn to draw. Your hand: ${gameInfo.currentPlayer.hand.map(card => ` ${card}`)}

        Draw:
            1. ${game.cardsToDraw} cards from deck
            2. ${game.cardsToDrawDiscardPile} cards from discard pile (Top card: ${gameInfo.topDiscardCard})
    `, x => {
        let input = parseInt(x);
        if (isNaN(input) || (input!=1 && input!=2)){
            console.log('Invalid input. Try again.');
            return -1;
        }

        if (input===1){
            game.drawFromDeck();
            let curPlayerHand = game.getGameInfoForPlayer().currentPlayer.hand;
            console.log(`Drew: ${curPlayerHand.slice(curPlayerHand.length-game.cardsToDraw, curPlayerHand.length-1)}`);
        }
        
        else if (input===2){
            if (!game.drawFromDiscardPile()){
                console.log('Insufficient cards in discard pile; drawing from deck.');
                game.drawFromDeck();
            }
            else console.log('Drew from discard pile.');
        }
        return 1;   
    })
    }
    
    
}