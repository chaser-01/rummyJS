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

readline.close();
return [players, options];
}


//game
async function main(){
    let players, options;
    [players, options] = await getOptions();
    let playerIds = Array.from(Array(players), (_, index) => index+1);
    let game = new Game(playerIds, options);

    game.nextRound();
    console.log(game.getGameInfoForPlayer().currentPlayer.hand);
}


//execute
main();
  
  
  
  
  
  
  