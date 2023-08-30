import { getInput } from "./getInput";
import { GameOptions } from "../../entities/Game/extraTypes";

//gets options for the game
export async function getOptions(): Promise<[string[], GameOptions]> {
    const options: GameOptions = {};
    
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