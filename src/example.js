import { Game } from "./entities/Game/Game.js";
import { createInterface } from "readline";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});
  
function getInput(prompt, validationCallback) {
    return new Promise((resolve) => {
      function ask() {
        readline.question(prompt, (input) => {
          input = input.trim();
          const validatedInput = validationCallback(input);
          resolve(validatedInput);
        });
      }
      ask();
    });
  }
  

//gets options for the game
async function getOptions() {
const options = {};

let players = await getInput("Enter the number of players (2-7, default: 2): ", (input) => {
    const numPlayers = parseInt(input);
    return (!isNaN(numPlayers) && numPlayers >= 2 && numPlayers <= 7) ? numPlayers : 2;
});

options.useWildcard = await getInput("Use wildcards? (Y/N, default: N): ", (input) => {
    const lowerCaseInput = input.toLowerCase();
    return (lowerCaseInput === 'y') ? true : (lowerCaseInput === 'n') ? false : undefined;
});

options.useJoker = await getInput("Use jokers? (Y/N, default: N): ", (input) => {
    const lowerCaseInput = input.toLowerCase();
    return (lowerCaseInput === 'y') ? true : (lowerCaseInput === 'n') ? false : undefined;
});

// Set only one of useJoker or useWildcard to true if both are attempted to be set as true
if (options.useJoker && options.useWildcard) {
    options.useWildcard = false;
    console.log("useJoker and useWildcard cannot both be set to true. Setting useWildcard to false.");
}

options.cardsToDrawDiscardPile = await getInput("Enter the number of cards to draw from the discard pile (integer, default: undefined): ", (input) => {
    const numCards = parseInt(input);
    return (!isNaN(numCards) && Number.isInteger(numCards)) ? numCards : undefined;
});

options.cardsToDraw = await getInput("Enter the number of cards to draw (integer, default: undefined): ", (input) => {
    const numCards = parseInt(input);
    return (!isNaN(numCards) && Number.isInteger(numCards)) ? numCards : undefined;
});

return [players, options];
}


//game
async function main(){
    let players, options;
    [players, options] = await getOptions();
    let playerIds = Array.from(Array(players), (_, index) => index+1);
    let game = new Game(playerIds, options);
    game.nextRound();

    while (game.gameStatus !== game.GameStatus.END_GAME){
        let gameInfo = game.getGameInfoForPlayer();
        let playerHand = `Player ${gameInfo.currentPlayer.id}'s hand: `;
        game.getGameInfoForPlayer().currentPlayer.hand.forEach(card => playerHand = playerHand+card+' ');
        console.log(playerHand+'\n');

        while (game.gameStatus == game.GameStatus.PLAYER_TURN){
            let playerOption = await getInput(`
                Your next action:
                    1: Sort hand
                    2: Create a meld
                    3: Add to an existing meld
                    4: Replace an existing meld's card
                    5: End turn

                    Input: `,
                input => {
                if (isNaN(input) || input<1 || input>5) {
                    console.log('Invalid input; please try again.');
                    return -1;
                }   
                return input;
            });

            switch(playerOption){
                //Sort player hand
                case 1:
                    await getInput(`
                        Sort by: 
                        1: Suit
                        2: Number
                        Input: `, 
                        input => {
                        if (isNaN(input) || input!==1 || input!==2) {
                            console.log('Invalid input; please try again.');
                            return;
                        }
                        if (input===1) game.sortHandBySuit();
                        if (input===2) game.sortHandByNumber();
                        console.log('Sorted.');
                        return;
                    });
                    break;
                

                //Create a meld
                case 2:
                    let cardIndex;
                    let indexArray = [];
                    while (cardIndex!=-1){
                        cardIndex = await getInput('Input index of the card you wish to add to the meld (-1 to stop): ', input => {
                            if (isNaN(input)){
                                console.log('Invalid input; please try again.');
                                return;
                            }
                            else{
                                if (cardIndex>gameInfo.currentPlayer.hand.length){
                                    console.log('Input is larger than hand size!!');
                                    return;
                                }
                                if (indexArray.find(element => element===input)){
                                    console.log('Input already in current meld!!');
                                    return;
                                }
                                return input;
                            }
                        })
                        if (cardIndex!==-1) indexArray.push(cardIndex);
                    }

                    if (indexArray){
                        if (game.createMeld(indexArray)){
                            gameInfo = game.getGameInfoForPlayer();
                            let melds = '';
                            gameInfo.currentPlayer.melds.forEach(meld => melds+`${meld}\n`);
                            console.log(`Valid meld created! Your current melds: ${str}`);
                        }
                        else console.log(`Inputted cards don't form a valid meld.`);
                    }
                    break;
                

                //Add to an existing meld
                case 3:
                    cardIndex=0;
                    while (cardIndex!=-1){
                        cardIndex = await getInput('')
                    }
                    break;
                

                //Replace an existing meld's card
                case 4:
                    break;
                

                //End turn (must input a card to discard)
                case 5:
                    break;
                

                //Goes back to input
                default:
                    break;
            }

        }
    }
    
}


//execute
main();
  
  
  
  
  
  
  