import { getInput } from "./auxiliary/getInput.js";
import { printGameInfo } from "./auxiliary/printGameInfo.js";


/**
 * Lets player choose between sorting by suit or number
 * @param {Game} game 
 */
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


/**
 * Let player choose some cards in their hand to make a meld
 * @param {Game} game 
 */
async function createMeld(game){
    let cardIndex=0;
    let indexArray = [];
    while (cardIndex!=-1){
        cardIndex = await getInput('Input index of the card you wish to add to the meld (-1 to stop): ', input => {
            input = parseInt(input);
            if (isNaN(input)){
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


/**
 * Lets player choose a hand card and a meld to add it to.
 * @param {Game} game 
 * @returns 
 */
async function addToMeld(game){
    let gameInfo = game.getGameInfoForPlayer();
    if (!gameInfo.tableMelds){
        console.log('No melds at the moment.');
        return;
    }

    console.log(`Table melds:${Object.keys(gameInfo.tableMelds).map(player => `\n${player}: ${gameInfo.tableMelds[player].map(meld => `[${meld}]`)}`)}`);

    let cardIndex=-1;
    while (cardIndex==-1){
        cardIndex = await getInput('Choose your card to add to a meld: ', input => {
            input = parseInt(input);
            if (isNaN(input) || !gameInfo.currentPlayer.hand[input] || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }     
            return input;
        });
    }
    console.log(`Chosen card: ${gameInfo.currentPlayer.hand[cardIndex]}`);

    let meldOwnerIndex=-1;
    while (meldOwnerIndex==-1){
        meldOwnerIndex = await getInput('Choose the target player: ', input => {
            input = parseInt(input);
            if (isNaN(input) || !gameInfo.tableMelds[input] || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        });
    }
    console.log(`Chosen player: ${meldOwnerIndex}`);

    let meldIndex=-1;
    while (meldIndex==-1){
        meldIndex = await getInput('Choose the target meld: ', input => {
            input = parseInt(input);
            if (isNaN(input) || !gameInfo.tableMelds[meldOwnerIndex][input] || input<0){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        })
    }
    console.log(`Chosen meld: ${gameInfo.tableMelds[meldOwnerIndex][meldIndex]}`);
    
    if (game.addToMeld(cardIndex, meldOwnerIndex, meldIndex)){
        console.log('Successfully added!');
        printGameInfo(game);
    }  
    else{
        console.log('Invalid addition to a meld.');
    }
}


/**
 * Lets player replace a chosen card in a chosen meld, with a chosen card in their hand
 * @param {Game} game 
 * @returns 
 */
async function replaceMeldCard(game){
    let gameInfo = game.getGameInfoForPlayer();
    if (!gameInfo.tableMelds){
        console.log('No melds at the moment.');
        return;
    }

    console.log(`Table melds:${Object.keys(gameInfo.tableMelds).map(player => `\n${player}: ${gameInfo.tableMelds[player].map(meld => `[${meld}]`)}`)}`);

    let cardIndex=-1;
    while (cardIndex==-1){
        cardIndex = await getInput('Choose your card to add to a meld: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input<0 || !gameInfo.currentPlayer.hand[input]){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        });
    }
    console.log(`Chosen card: ${gameInfo.currentPlayer.hand[cardIndex]}`);

    let meldOwnerIndex=-1;
    while (meldOwnerIndex==-1){
        meldOwnerIndex = await getInput('Choose the target player: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input<0 || !gameInfo.tableMelds[input]){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        });
    }
    console.log(`Chosen player: ${meldOwnerIndex}`);

    let meldIndex=-1;
    while (meldIndex==-1){
        meldIndex = await getInput('Choose the target meld: ', input => {
            input = parseInt(input);
            if (isNaN(input) || input<0 || !gameInfo.tableMelds[meldOwnerIndex][input]){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        })
    }
    console.log(`Chosen meld: ${gameInfo.tableMelds[meldOwnerIndex][meldIndex]}`);

    let replacedCardIndex=-1;
    while (replacedCardIndex==-1){
        replacedCardIndex = await getInput(`Input index of the target card in the meld: `, input => {
            input = parseInt(input);
            if (isNaN(input) || input<0 || !gameInfo.tableMelds[meldOwnerIndex][meldIndex].cards[input] ){
                console.log('Invalid index. Try again.');
                return -1;
            }
            return input;
        })
    }
    console.log(`Chosen card: ${gameInfo.tableMelds[meldOwnerIndex][meldIndex].cards[replacedCardIndex]}`);

    if (game.replaceMeldCard(cardIndex, meldOwnerIndex, meldIndex, replacedCardIndex)){
        console.log('Successfully replaced!');
        printGameInfo(game);
    }  
    else{
        console.log('Invalid replacement.');
    }
}


/**
 * Lets player choose a card to discard and end their turn
 * @param {Game} game 
 */
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
        console.log('Ending turn...');
    }
    else console.log('Error occurred. Please try again.');
}


/**
 * Lets a player quit the game
 * @param {Game} game 
 */
async function quitPlayer(game){
    game.quitPlayer();
}

export { sortPlayerHand, createMeld, addToMeld, replaceMeldCard, endTurn, quitPlayer };