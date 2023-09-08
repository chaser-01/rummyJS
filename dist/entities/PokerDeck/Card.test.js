import { Card } from "./Card";
import { suits, numbers } from "./suitsNumbers";
describe('Card', () => {
    test('should instantiate', () => {
        const card = new Card("Hearts", "Ten");
        expect(card.suit).toBe("Hearts");
        expect(card.number).toBe("Ten");
    });
    test('should not instantiate if "Joker" was used only for suit/number, not both', () => {
        expect(() => new Card("Joker", "Ace")).toThrow();
    });
    test('should have a number-only value', () => {
        let card = new Card("Hearts", "Ten");
        expect(card.cardNumberValue()).toBe(10);
    });
    test('should have a relative value, prioritizing suit THEN number', () => {
        let card = new Card("Hearts", "Ace");
        expect(card.cardValueSuitFirst()).toBe(101);
    });
    test('should compare by suit THEN number correctly', () => {
        let suitsKeys = Object.keys(suits);
        let numberKeys = Object.keys(numbers);
        //decreasing number but increasing suits
        let cardArr = [
            new Card("Joker", "Joker"),
            new Card("Hearts", "King"),
            new Card("Diamonds", "Ten"),
            new Card("Clubs", "Nine"),
            new Card("Spades", "Eight")
        ];
        for (let i = 1; i < cardArr.length; i++) {
            expect(cardArr[i].cardValueSuitFirst() > cardArr[i - 1].cardValueSuitFirst()).toBeTruthy();
        }
    });
    test('should have a relative value, prioritizing number THEN suit', () => {
        let card = new Card("Hearts", "Ace");
        expect(card.cardValueNumberFirst()).toBe(101);
    });
    test('should compare by number THEN suit correctly', () => {
        //decreasing suits but increasing number
        let cardArr = [
            new Card("Joker", "Joker"),
            new Card("Spades", "Ace"),
            new Card("Clubs", "Two"),
            new Card("Diamonds", "Three"),
            new Card("Hearts", "Four")
        ];
        for (let i = 1; i < cardArr.length; i++) {
            expect(cardArr[i].cardValueNumberFirst() > cardArr[i - 1].cardValueNumberFirst()).toBeTruthy();
        }
    });
    test('should have a correct string representation', () => {
        let card = new Card("Hearts", "Two");
        expect(`${card}`).toEqual('♥2');
    });
});
