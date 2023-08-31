import { Deck } from "./Deck"

describe('Deck', () => {
    test('should instantiate', () => {
        let deck = new Deck([1, 2, 3]);
        expect(deck.getCards()).toEqual([1, 2, 3]);
    })

    test('should return size', () => {
        expect(new Deck([1,2,3]).remaining()).toBe(3);
        expect(new Deck([]).remaining()).toBe(0);
    })

    test('should shuffle', () => {
        let deck = new Deck([1,2,3,4,5,6,7,8,9,10]);
        deck.shuffle();
        expect(deck.getCards()).not.toEqual([1,2,3,4,5,6,7,8,9,10]);
        expect(deck.getCards().sort((a,b) => a-b)).toEqual([1,2,3,4,5,6,7,8,9,10]);
    })

    test('should draw, and return empty array if draw count exceeds deck size', () => {
        let deck = new Deck([1,2,3,4,5,6,7,8,9,10]);
        expect(deck.draw(5)).toStrictEqual([6,7,8,9,10]);
        expect(deck.draw(0)).toStrictEqual([]);
        expect(deck.draw(999)).toStrictEqual([1,2,3,4,5]);
    })

    test('to be appendable', () => {
        let deck = new Deck([1,2,3,4,5,6,7,8,9,10]);
        deck.addToTop([11]);
        expect(deck.getCards()).toStrictEqual([1,2,3,4,5,6,7,8,9,10,11]);
    })
}) 