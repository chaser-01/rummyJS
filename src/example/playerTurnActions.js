import { getInput } from "./auxiliary/getInput.js";
import { printGameInfo } from "./auxiliary/printGameInfo.js";


//sort the player's hand, either by suit or number
async function sortPlayerHand(game){
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
            console.log('Sorted.');
            printGameInfo(game);
    });
}


//specify some card indexes to create a meld out of the player's hand
async function createMeld(game){
    let cardIndex;
    let indexArray = [];
    while (cardIndex!=-1){
        cardIndex = await getInput('Input index of the card you wish to add to the meld (-1 to stop): ', input => {
            if (isNaN(parseInt(input))){
                console.log('Invalid input; please try again.');
                return;
            }
            else{
                if (cardIndex>game.getGameInfoForPlayer().currentPlayer.hand.length){
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
        if (cardIndex!=-1){
            console.log(`Chosen card: ${game.getGameInfoForPlayer().currentPlayer.hand[cardIndex]}`);
            indexArray.push(cardIndex);
        }
    }
    if (indexArray){
        if (game.createMeld(indexArray)){
            console.log('Valid meld created!');
            printGameInfo(game);
        }
        else console.log(`Inputted cards don't form a valid meld.`);
    }
}


//add a specified card to a specified meld
async function addToMeld(game){
    let gameInfo = game.getGameInfoForPlayer();
    if (!gameInfo.melds){
        console.log('No melds at the moment.');
        return;
    }

    console.log(`Table melds:${Object.keys(gameInfo.tableMelds).map(player => ` ${player}: ${gameInfo.tableMelds.player}`)}`);

    let cardIndex=-1;
    while (cardIndex==-1){
        cardIndex = await getInput('Choose your card to add to a meld: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input>gameInfo.currentPlayer.hand.length || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        });
    }

    let meldOwnerIndex=-1;
    while (meldOwnerIndex==-1){
        meldOwnerIndex = await getInput('Choose the target player: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input>Object.keys(gameInfo.tableMelds).length || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        });
    }

    let meldIndex=-1;
    while (meldIndex==-1){
        meldIndex = await getInput('Choose the target meld: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input>gameInfo.tableMelds[meldOwnerIndex].length || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        })
    }
    
    if (game.addToMeld(cardIndex, meldOwnerIndex, meldIndex)){
        console.log('Successfully added!');
        printGameInfo();
    }  
    else{
        console.log('Invalid addition to a meld.');
    }
}


//replace a card (should be joker) with a specified card in player's hand
async function replaceMeldCard(game){
    gameInfo = game.getGameInfoForPlayer();
    if (!gameInfo.melds){
        console.log('No melds at the moment.');
        return;
    }

    console.log(`Table melds:${Object.keys(gameInfo.tableMelds).map(player => ` ${player}: ${gameInfo.tableMelds.player}`)}`);

    let cardIndex=0;
    while (cardIndex==-1){
        cardIndex = await getInput('Choose your card to add to a meld: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input>gameInfo.currentPlayer.hand.length || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        });
    }

    let meldOwnerIndex=-1;
    while (meldOwnerIndex==-1){
        meldOwnerIndex = await getInput('Choose the target player: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input>Object.keys(gameInfo.tableMelds).length || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        });
    }

    let meldIndex=-1;
    while (meldIndex==-1){
        meldIndex = await getInput('Choose the target meld: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input>gameInfo.tableMelds[meldOwnerIndex].length || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        })
    }

    let replacedCardIndex=-1;
    while (replacedCardIndex==-1){
        replacedCardIndex = await getInput(`Input index of the target card in the meld: `, input => {
            input = parseInt(input);
            if (isNaN(input) || input.gameInfo.tableMelds[meldOwnerIndex][meldIndex].length || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        })
    }
    
    if (game.replaceMeldCard(cardIndex, meldOwnerIndex, meldIndex, replacedCardIndex)){
        console.log('Successfully added!');
        printGameInfo();
    }  
    else{
        console.log('Invalid addition to a meld.');
    }
}


//discard a specified card and end turn
async function endTurn(game){
    let cardIndex = -1;
    while (cardIndex==-1){
        cardIndex = await getInput('Enter index of card in your hand to discard: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input>game.getGameInfoForPlayer().currentPlayer.hand.length || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        })
    }
    if (game.endTurn(cardIndex)){
        console.log('Turn ended. Next player!');
    }
    else console.log('Error occurred. Please try again.');
}


//quits current player
async function quitPlayer(game){
    game.quitPlayer();
    return;
}

export { sortPlayerHand, createMeld, addToMeld, replaceMeldCard, endTurn, quitPlayer };