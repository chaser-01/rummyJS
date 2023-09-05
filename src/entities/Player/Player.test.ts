import { Player } from "./Player";
import { Game } from "../Game/Game";
import { Card } from "../PokerDeck/Card";
import { Meld } from "../Meld/Meld";

//mock the Game class since its required arg in Player ctor
jest.mock("../Game/Game");

//helper function to create a player
function returnTestPlayer(id: string) {
    let mockGame = new Game([]);
    return new Player(mockGame, id);
}

//tests
describe('Player', () => {
    test('should initialize', () => {
        let player = returnTestPlayer('1');
        expect(player.id).toEqual('1');
    })
    

    describe('hand', () => {
        test('should be able to add card(s) to their hand', () => {
            let player = returnTestPlayer('1');
            expect(player.hand).toEqual([]);
    
            let card = new Card("Clubs", "Ace")
            player.addToHand(card);
            expect(player.hand).toEqual([card]);
    
            let cards = [new Card("Clubs", "Three"), new Card("Clubs", "Two")];
            player.addToHand(cards);
            expect(player.hand).toEqual([card, ...cards]);
        })
    
        describe('drawing from hand', () => {
            test('should be successful given valid array of indexes', () => {
                let player = returnTestPlayer('1');
                let cards = [
                    new Card("Hearts", "Ace"),
                    new Card("Hearts", "Two"),
                    new Card("Hearts", "Three")
                ]
                player.addToHand([...cards]);
                player.drawFromHand([0, 1]);
                expect(player.hand).toEqual([cards[2]]);
            })
    
            test('should return the drawn card(s)', () => {
                let player = returnTestPlayer('1');
                let cards = [
                    new Card("Hearts", "Ace"),
                    new Card("Hearts", "Two"),
                    new Card("Hearts", "Three")
                ]
                player.addToHand([...cards]);
                expect(player.drawFromHand([0, 1])).toEqual([cards[0], cards[1]]);
                expect(player.hand).toEqual([cards[2]]);
            })
    
            test('should not draw a card when the index is invalid (greater than hand size/less than 0)', () => {
                let player = returnTestPlayer('1');
                let cards = [
                    new Card("Hearts", "Ace"),
                    new Card("Hearts", "Two"),
                    new Card("Hearts", "Three")
                ]
                player.addToHand([...cards]);
                expect(player.drawFromHand([-1, -2, 1])).toEqual([cards[1]]);
                expect(player.hand).toEqual([cards[0], cards[2]])
            })
        })
    })
    

    describe('melds', () => {
        test('should be able to add a meld', () => {
            let player = returnTestPlayer('1');
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three")
            ]
            let meld = new Meld(cards);
            player.addMeld(meld);
            expect(player.melds).toEqual([meld]);
        })

        describe('addition to meld without specific index', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three")
            ]

            test('should be successful if the addition is valid', () => {
                let player = returnTestPlayer('1');
                let meld = new Meld([...cards]);
                player.addMeld(meld);
                let card = new Card("Hearts", "Four");
                expect(player.addCardToMeld(card, 0)).toEqual(true);
                expect(player.melds[0].cards).toEqual([...cards, card]);
            })
            
            test('should not be successful if the addition is invalid', () => {
                let player = returnTestPlayer('1');
                let meld = new Meld([...cards]);
                player.addMeld(meld);
                let card = new Card("Hearts", "Five");
                expect(player.addCardToMeld(card, 0)).toEqual(false);
                expect(player.melds[0].cards).toEqual(cards);
            })
        })


        describe('addition to meld with specific index', () => {
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three")
            ]

            test('should be successful if the addition is valid', () => {
                let player = returnTestPlayer('1');
                let meld = new Meld([...cards]);
                player.addMeld(meld);
                let card = new Card("Hearts", "Four");
                expect(player.addCardToMeldSpecific(card, 0, 3)).toEqual(true);
                expect(player.melds[0].cards).toEqual([...cards, card]);
            })
            
            test('should not be successful if the addition is invalid', () => {
                let player = returnTestPlayer('1');
                let meld = new Meld([...cards]);
                player.addMeld(meld);
                let card = new Card("Hearts", "Five");
                expect(player.addCardToMeldSpecific(card, 0, 3)).toEqual(false);
                expect(player.melds[0].cards).toEqual(cards);
            })
        })


        test('should be able to reset melds and hand', () => {
            let player = returnTestPlayer('1');
            let cards = [
                new Card("Hearts", "Ace"),
                new Card("Hearts", "Two"),
                new Card("Hearts", "Three")
            ]
            let meld = new Meld(cards);
            let card = new Card("Hearts", "Four");
            player.addMeld(meld);
            player.addToHand(card);

            expect(player.hand).toEqual([card]);
            expect(player.melds[0].cards).toEqual(cards);

            player.resetCards();
            
            expect(player.hand).toEqual([]);
            expect(player.melds).toEqual([]);
        })
    })
    
})