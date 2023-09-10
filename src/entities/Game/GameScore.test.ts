import { GameScore } from "./GameScore";
import { Game } from "./Game";
import { Player } from "../Player/Player";
import { Card } from "../PokerDeck/Card";
jest.mock('./Game');
jest.mock('../Player/Player');

///

//mock the game and 3 players (and their hands), for use in tests
/*
Note: i wanted to use spyOn + mockReturnValue for the getters, but 
getters/setters aren't mocked in automock for jest (this caused a small headache);
thus i used this kinda hacky approach instead
*/
let mockGame = new Game(['1', '2', '3']);

let player1 = new Player(mockGame, '1');
let player2 = new Player(mockGame, '2');
let player3 = new Player(mockGame, '3');

Object.defineProperty(player1, 'hand', {value: [new Card("Hearts", "Ace"), new Card("Diamonds", "Ace")]});
Object.defineProperty(player2, 'hand', {value: [new Card("Clubs", "Ace"), new Card("Spades", "Ace")]});
Object.defineProperty(player3, 'hand', {value: [new Card("Clubs", "Ten"), new Card("Spades", "Ten")]});

Object.defineProperty(mockGame, 'players', {value: [player1, player2, player3]}); //set the players in mockGame
Object.defineProperty(mockGame, 'currentRound', {value: 999}); //set currentRound to 999, to check that it is used during evaluation

///

describe('GameScore', () => {
    test('should initialize', () => {
        let score = new GameScore(mockGame);
        expect(score.game).toBe(mockGame);
        expect(score.scores).toEqual({});
    })

    test("should evaluate round scores of PLAYING players, using their hand's card values", () => {
        let score = new GameScore(mockGame);
        score.evaluateRoundScore();
        expect(score.scores).toEqual({
            //player 1 & 2 have same scores since they both have 2 aces; player 3 will have score 20 since 2 kings
            //round number will be whatever game.currentRound is
            999: [[player1, 2], [player2, 2], [player3, 20]] 
        })

    })
})
