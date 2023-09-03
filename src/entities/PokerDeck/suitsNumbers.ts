//Enums for poker suits and numbers (and their relative values), and string representations

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
                Joker='',
                Hearts ='♥',
                Diamonds = '♦',
                Clubs = '♣',
                Spades = '♠'
            }

/** Describes possible poker numbers and their relative values. */
export enum numbersText {
  Joker='Joker',
  Ace='A',
  Two=2,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack='J',
  Queen='Q',
  King='K'
}
