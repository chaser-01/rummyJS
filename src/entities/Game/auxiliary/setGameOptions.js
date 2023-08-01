/*
Functions here are used for setting/verifying config options.
Most work like so:
    -Accepts a config object and the intended option
    -If option wasn't specified, set it to the config default
    -If the config doesn't specify any value/a useable value for that option, set it to a hardcoded value
    -Return the option

Some functions, eg setCardsToDealAndNumberOfDecks, may have additional logic to ensure the specified options are feasible etc.
*/


//Returns useWildcard option.
export function setWildcardOption(config, useJoker){
    let setUseJoker;
    if (useJoker===undefined){
        if (config.useJoker!==false || config.useJoker!==true) setUseJoker = true;
        else setUseJoker = config.useJoker;
    }
    else setUseJoker = useJoker;
    return setUseJoker;
}

//Returns useJoker option.
export function setJokerOption(config, useWildcard){
    let setUseWildcard;
    if (useWildcard===undefined){
        if (config.useWildcard!==false || config.useWildcard!==true) setUseWildcard = true;
        else setUseWildcard = config.useWildcard;
    }
    else setUseWildcard = useWildcard;
    return setUseWildcard;
}

//Returns cardsToDrawDiscardPile option.
export function setCardsToDrawDiscardPile(config, cardsToDrawDiscardPile){
    let setCardsToDrawDiscardPile;
    if (cardsToDrawDiscardPile===undefined){
        if (!config.cardsToDrawDiscardPile) setCardsToDrawDiscardPile = 1;
        else setCardsToDrawDiscardPile = config.useWildcard;
    }
    else setCardsToDrawDiscardPile = cardsToDrawDiscardPile;
    return setCardsToDrawDiscardPile;
}


/*
Returns cardsToDeal and numberOfDecks options.
Checks to see if total cards drawn exceeds the total deck size; if so, overrides the specified options.
Checks other numberOfDecks, if given one doesn't specify a cardsToDeal in the config.
*/
export function setCardsToDealAndNumberOfDecks(config, playersSize, cardsToDeal, numberOfDecks){
    let setCardsToDeal, setNumberOfDecks;

    //if specified values are valid, return them
    if (cardsToDeal!==0 && playersSize*cardsToDeal < numberOfDecks*52){
        return [cardsToDeal, numberOfDecks];
    }

    //if cardsToDeal not specified, or no cardsToDeal found for the given numberOfDecks/given numberOfDecks and playersSize,
    //then loop through other numberOfDecks to find existing cardsToDeal for the given playersSize, and use that.                                                                  
    let cardsToDealRules = config.cardsToDeal.decks;
    if (numberOfDecks===undefined || !cardsToDealRules[numberOfDecks] || !cardsToDealRules[numberOfDecks].players[playersSize]){
        for (const deckNo in cardsToDealRules){
            let cardsToDeal = cardsToDealRules[deckNo].players[playersSize];
            if (cardsToDeal){
                setCardsToDeal = cardsToDeal;
                setNumberOfDecks = deckNo;
                break;
            }
        }

        //if no cardsToDeal found at all for playersSize, throw error
        if (!setCardsToDeal || !setNumberOfDecks){
            throw new Error('No amount of cards can be dealt for the amount of players given.');
        }
    }

    //if cardsToDeal exists for given numberOfDecks and playersSize, return it
    else{
        setCardsToDeal = cardsToDealRules[numberOfDecks].players[playersSize];
        setNumberOfDecks = numberOfDecks;
    }
    return [setCardsToDeal, setNumberOfDecks];
}

