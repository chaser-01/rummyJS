import { GameConfig } from "./extraTypes";



/**
Returns default value from config for an option, if it's unspecified or invalid.
useJoker & useWildcard can only be undefined or valid.
cardsToDraw & cardsToDrawDiscardPile can be undefined or valid, OR invalid if they don't make sense. (For simplicity, invalid is defined as >52 or <0)
cardsToDeal & numberOfDecks is set separately in setCardsToDealAndNumberOfDecks.
*/
export function setOption(config: GameConfig, option: number|boolean|"all"|undefined, optionName: keyof GameConfig){
    if ((typeof option=="number" && (option>52 || option<0)) || option==undefined) return config[optionName];
    else return option;
}



/**
Returns cardsToDeal and numberOfDecks options.
If they aren't specified, sets to the appropriate value as specified in config.
Else, Checks to see if total cards drawn by all players exceeds deck size; if so, overrides the specified options with config default.
If there's no default cardsToDeal for given numberOfDecks, checks other config numberOfDecks for valid cardsToDeal, and overrides if valid one is found.
*/
export function setCardsToDealAndNumberOfDecks(
    config: GameConfig, 
    playersSize: number, 
    cardsToDeal: number|undefined, 
    numberOfDecks: number|undefined)
    {
    //if specified values are defined and can be used, use them
    if (numberOfDecks!==undefined && cardsToDeal!==undefined && cardsToDeal!==0 && playersSize*cardsToDeal < numberOfDecks*52){
        return [cardsToDeal, numberOfDecks];
    }

    //if cardsToDeal not specified, or no cardsToDeal found for the given numberOfDecks/given numberOfDecks and playersSize,
    //then loop through other numberOfDecks to find a default cardsToDeal for the given playersSize, and use that.     
    let setCardsToDeal: number|undefined = undefined;
    let setNumberOfDecks: number|undefined = undefined;                                                             
    let cardsToDealRules = config.cardsToDeal.decks;
    if (numberOfDecks===undefined || !cardsToDealRules[numberOfDecks] || !cardsToDealRules[numberOfDecks].players[playersSize]){
        for (const deckNo in cardsToDealRules){
            let cardsToDeal = cardsToDealRules[deckNo].players[playersSize];
            if (cardsToDeal){
                setCardsToDeal = cardsToDeal;
                setNumberOfDecks = parseInt(deckNo);
                break;
            }
        }

        //if no cardsToDeal found at all for playersSize (ie still undefined), throw error
        if (setCardsToDeal==undefined || setNumberOfDecks==undefined){
            throw new Error('No amount of cards can be dealt for the amount of players given.');
        }
    }

    //if some cardsToDeal exists for given numberOfDecks and playersSize, return it
    else{
        setCardsToDeal = cardsToDealRules[numberOfDecks].players[playersSize];
        setNumberOfDecks = numberOfDecks;
    }
    return [setCardsToDeal, setNumberOfDecks];
}

