import { GameConfig } from "./extraTypes";


/* If the option is undefined, returns it from config. */
export function setOption(config: GameConfig, option: number|boolean|"all"|undefined, optionName: keyof GameConfig){
    if (option==undefined) return config[optionName];
    else return option;
}


/*
Returns cardsToDeal and numberOfDecks options.
Checks to see if total cards drawn exceeds the total deck size; if so, overrides the specified options.
Checks other numberOfDecks, if given one doesn't specify a cardsToDeal in the config.
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
    //then loop through other numberOfDecks to find existing cardsToDeal for the given playersSize, and use that.     
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

