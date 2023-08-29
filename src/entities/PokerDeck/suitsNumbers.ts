/** Describes possible poker suits and their relative values. */
export enum suits {
    Joker=0,
    Hearts,
    Diamonds,
    Clubs,
    Spades
  };

/** Describes possible poker numbers and their relative values. */
export enum numbers {
    Joker=0,
    Ace,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King
  }

/** Describes typical string representation for each suit. */
export enum suitsText {
                Hearts ='♥',
                Diamonds = '♦',
                Clubs = '♣',
                Spades = '♠'
            }

/** 
 * Returns the value of a given suit and number. 
 * @param suit - A suit within the `suits` enum, or 'Joker'.
 * @param number - A number within the `numbers` enum, or 'Joker'.
*/
export function suitNumberValue(suit: keyof typeof suits, number: keyof typeof numbers): [number, number]{
    let suitValue, numberValue;
    
    for (const val in suits) if (suits[val]==suit) suitValue = val;
    for (const val in numbers) if (numbers[val]==number) numberValue = val;
    return [parseInt(suitValue), parseInt(numberValue)];
}