import { Game } from "./entities/Game/Game.js";
import { createInterface } from "readline";

const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});
  

//generic fn for getting inputs
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


//print game info
function printGameInfo(game){
    let gameInfo = game.getGameInfoForPlayer();
    console.log('-----');
    console.log(`Joker: ${gameInfo.jokerNumber}`);
    console.log(`Deck size: ${gameInfo.deckSize}`);
    console.log(`Top discard pile card: ${gameInfo.topDiscardCard}`);
    console.log(`Current player (${gameInfo.currentPlayer.id}) hand:${gameInfo.currentPlayer.hand.map(card => ` ${card}`)}`);;
    console.log(`Table melds:${Object.keys(gameInfo.tableMelds).map(player => ` ${player}: ${gameInfo.tableMelds.player}`)}`);
    console.log('-----');
    return;
}


//main game fn
async function main(){
    //get options and create game
    let players, options;
    [players, options] = await getOptions();
    let playerIds = Array.from(Array(players), (_, index) => index+1);
    let game = new Game(playerIds, options);
    game.nextRound();

    //main game loop
    while (game.gameStatus !== game.GameStatus.END_GAME){
        printGameInfo(game);
        while (game.gameStatus == game.GameStatus.PLAYER_TURN){
            let playerOption;

            playerOption = await getInput(
                `Your next action:
                    0: Show game info
                    1: Sort hand
                    2: Create a meld
                    3: Add to an existing meld
                    4: Replace an existing meld's card
                    5: End turn

                    Input: `,
                input => {
                if (isNaN(parseInt(input)) || input<0 || input>5) {
                    console.log('Invalid input; please try again.');
                    return -1;
                }   
                return parseInt(input);
            });

            switch(playerOption){
                //show table info
                case 0:
                    printGameInfo(game);
                    break;


                //Sort player hand
                case 1:
                    await getInput(
                        `Sort by: 
                        1: Suit
                        2: Number
                        Input: `, 
                        input => {
                            input = parseInt(input);
                            if (isNaN(input) || (input!==1 && input!==2)) {
                                console.log('Invalid input; please try again.');
                                return;
                            }
                            if (input===1) game.sortHandBySuit();
                            if (input===2) game.sortHandByNumber();
                            console.log(`Sorted. Your hand: ${game.getGameInfoForPlayer().currentPlayer.hand.map(card=>` ${card}`)}`);
                            return;
                    });
                    break;
                

                //Create a meld
                case 2:
                    let cardIndex;
                    let indexArray = [];
                    while (cardIndex!=-1){
                        cardIndex = await getInput('Input index of the card you wish to add to the meld (-1 to stop): ', input => {
                            if (isNaN(parseInt(input))){
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
                            console.log('Valid meld created! Current game state: ');
                            printGameInfo(game);
                        }
                        else console.log(`Inputted cards don't form a valid meld.`);
                    }
                    break;
                

                //Add to an existing meld
                case 3:
                    let gameInfo = game.getGameInfoForPlayer();
                    if (!gameInfo.melds){
                        console.log('No melds at the moment.');
                        break;
                    }

                    console.log(`Table melds:${Object.keys(gameInfo.tableMelds).map(player => ` ${player}: ${gameInfo.tableMelds.player}`)}`);

                    cardIndex=0;
                    while (cardIndex!=-1){
                        cardIndex = await getInput('Choose your card to add to a meld: ', input => {
                            input = parseInt(input);
                            if (isNaN(input) || input>gameInfo.currentPlayer.hand.length || input<0){
                                console.log('Invalid index. Try again.');
                                return -1;
                            }
                            return input;
                        });
                    }

                    meldOwnerIndex=0;
                    while (meldOwnerIndex!=-1){
                        meldOwnerIndex = await getInput('Choose the target player: ', input => {
                            input = parseInt(input);
                            if (isNaN(input) || input>Object.keys(gameInfo.tableMelds).length || input<0){
                                console.log('Invalid index. Try again.');
                                return -1;
                            }
                            return input;
                        });
                    }

                    meldIndex=0;
                    while (meldIndex!=-1){
                        meldIndex = await getInput('Choose the target meld: ', input => {
                            input = parseInt(input);
                            if (isNaN(input) || input>gameInfo.tableMelds[meldOwnerIndex].length || input<0){
                                console.log('Invalid index. Try again.');
                                return -1;
                            }
                            return input;
                        })
                    
                    if (game.addToMeld(cardIndex, meldOwnerIndex, meldIndex)){
                        console.log('Successfully added! Current game state: ');
                        printGameInfo();
                    }  
                    else{
                        console.log('Invalid addition to a meld.');
                    }
                    break;
                

                //Replace an existing meld's card
                case 4:
                    gameInfo = game.getGameInfoForPlayer();
                    if (!gameInfo.melds){
                        console.log('No melds at the moment.');
                        break;
                    }

                    console.log(`Table melds:${Object.keys(gameInfo.tableMelds).map(player => ` ${player}: ${gameInfo.tableMelds.player}`)}`);

                    cardIndex=0;
                    while (cardIndex!=-1){
                        cardIndex = await getInput('Choose your card to add to a meld: ', input => {
                            input = parseInt(input);
                            if (isNaN(input) || input>gameInfo.currentPlayer.hand.length || input<0){
                                console.log('Invalid index. Try again.');
                                return -1;
                            }
                            return input;
                        });
                    }

                    meldOwnerIndex=0;
                    while (meldOwnerIndex!=-1){
                        meldOwnerIndex = await getInput('Choose the target player: ', input => {
                            input = parseInt(input);
                            if (isNaN(input) || input>Object.keys(gameInfo.tableMelds).length || input<0){
                                console.log('Invalid index. Try again.');
                                return -1;
                            }
                            return input;
                        });
                    }

                    meldIndex=0;
                    while (meldIndex!=-1){
                        meldIndex = await getInput('Choose the target meld: ', input => {
                            input = parseInt(input);
                            if (isNaN(input) || input>gameInfo.tableMelds[meldOwnerIndex].length || input<0){
                                console.log('Invalid index. Try again.');
                                return -1;
                            }
                            return input;
                        })
                    
                    if (game.addToMeld(cardIndex, meldOwnerIndex, meldIndex)){
                        console.log('Successfully added! Current game state: ');
                        printGameInfo();
                    }  
                    else{
                        console.log('Invalid addition to a meld.');
                    }
                    break;;
                

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
  
  
  
  
  
  
  