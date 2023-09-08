//Enums for poker suits and numbers (and their relative values), and string representations
/** Describes possible poker suits and their relative values. */
export var suits;
(function (suits) {
    suits[suits["Joker"] = 0] = "Joker";
    suits[suits["Hearts"] = 1] = "Hearts";
    suits[suits["Diamonds"] = 2] = "Diamonds";
    suits[suits["Clubs"] = 3] = "Clubs";
    suits[suits["Spades"] = 4] = "Spades";
})(suits || (suits = {}));
;
/** Describes possible poker numbers and their relative values. */
export var numbers;
(function (numbers) {
    numbers[numbers["Joker"] = 0] = "Joker";
    numbers[numbers["Ace"] = 1] = "Ace";
    numbers[numbers["Two"] = 2] = "Two";
    numbers[numbers["Three"] = 3] = "Three";
    numbers[numbers["Four"] = 4] = "Four";
    numbers[numbers["Five"] = 5] = "Five";
    numbers[numbers["Six"] = 6] = "Six";
    numbers[numbers["Seven"] = 7] = "Seven";
    numbers[numbers["Eight"] = 8] = "Eight";
    numbers[numbers["Nine"] = 9] = "Nine";
    numbers[numbers["Ten"] = 10] = "Ten";
    numbers[numbers["Jack"] = 11] = "Jack";
    numbers[numbers["Queen"] = 12] = "Queen";
    numbers[numbers["King"] = 13] = "King";
})(numbers || (numbers = {}));
/** Describes typical string representation for each suit. */
export var suitsText;
(function (suitsText) {
    suitsText["Joker"] = "";
    suitsText["Hearts"] = "\u2665";
    suitsText["Diamonds"] = "\u2666";
    suitsText["Clubs"] = "\u2663";
    suitsText["Spades"] = "\u2660";
})(suitsText || (suitsText = {}));
/** Describes possible poker numbers and their relative values. */
export var numbersText;
(function (numbersText) {
    numbersText["Joker"] = "Joker";
    numbersText["Ace"] = "A";
    numbersText[numbersText["Two"] = 2] = "Two";
    numbersText[numbersText["Three"] = 3] = "Three";
    numbersText[numbersText["Four"] = 4] = "Four";
    numbersText[numbersText["Five"] = 5] = "Five";
    numbersText[numbersText["Six"] = 6] = "Six";
    numbersText[numbersText["Seven"] = 7] = "Seven";
    numbersText[numbersText["Eight"] = 8] = "Eight";
    numbersText[numbersText["Nine"] = 9] = "Nine";
    numbersText[numbersText["Ten"] = 10] = "Ten";
    numbersText["Jack"] = "J";
    numbersText["Queen"] = "Q";
    numbersText["King"] = "K";
})(numbersText || (numbersText = {}));
