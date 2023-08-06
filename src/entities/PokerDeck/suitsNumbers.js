export const suits = 
            {
                1: 'Hearts',
                2: 'Diamonds',
                3: 'Clubs',
                4: 'Spades'
            }

export const numbers =
            {
                1: 'Ace',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6',
                7: '7',
                8: '8',
                9: '9',
                10: '10',
                11: 'Jack',
                12: 'Queen',
                13: 'King'
            }

export const suitsText = 
            {
                'Hearts': '♥',
                'Diamonds': '♦',
                'Clubs': '♣',
                'Spades': '♠'
            }

export function suitNumberValue(suit, number){
    let suitValue, numberValue;
    
    for (const val in suits) if (suits[val]==suit) suitValue = val;
    for (const val in numbers) if (numbers[val]==number) numberValue = val;

    if (suit=='Joker' || number=='Joker'){
        suitValue = 0;
        numberValue = 0;
    }
    return [suitValue, numberValue];
}