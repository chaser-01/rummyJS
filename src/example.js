import { Game } from "./entities/Game/Game.js";

function yesNo(promptText){
    let answer = prompt(promptText);
    while (answer!='Y' || answer!='N') answer = prompt('Invalid; try again: ');
    if (answer == 'Y') return true;
    return false;
}

//

let players = prompt("How many players (2-7): ");
while (isNaN(players) || players<2 || players>7){
    players = prompt('Invalid; try again: ');
}
let playerIds = [];
for (let i=0; i<players; i++) playerIds.push(i);

let option = {};
let optionBool = yesNo("Custom options? (use wildcard/joker, no. of decks, cards to draw etc) (Y/N): ");
if (optionBool){
    option.useWildcard = yesNo("Use wildcard? (Y/N): ");
    option.useWildcard = yesNo("Use joker? (can't use alongside wildcard) (Y/N): ");

    option.cardsToDraw = prompt("Cards to draw per turn (<=0 means default): ");
    if (isNaN(option.cardsToDraw) || option.cardsToDraw<=0) option.cardsToDraw = undefined;

    option.cardsToDrawDiscardPile = prompt("Cards to draw from discard pile (<=0 means default): ");
    if (isNaN(option.cardsToDrawDiscardPile) || option.cardsToDrawDiscardPile<=0) option.cardsToDrawDiscardPile = undefined;
    
    option.numberOfDecks = prompt("Number of decks? (1 or 2): ");
    if (isNaN(option.numberOfDecks) || option.numberOfDecks!=1 || option.numberOfDecks!=2) option.numberOfDecks = 1;
}

console.log('Instantiating game...');
let game = new Game(playerIds, options);
game.nextRound();

