import { Card } from "./Card.js";

/**  Generic deck (an array with some generic deck functionality). */
export class Deck<T>{
    /// Properties ///


    /** The card stack. */
    private _stack: T[];


    /// Methods ///

    
    /** Creates a Deck. */
    constructor(cards: T[] = []){
        if (!Array.isArray(cards)) this._stack = [];
        else this._stack = cards;
        return this;
    }


    /** Returns the deck cards. */
    getCards(): T[]{
        return [...this._stack];
    }


    /** Returns the deck size. */
    remaining(): number{
        return this._stack.length;
    }


    /** Shuffles the deck (Fisher–Yates implementation adapted from http://bost.ocks.org/mike/shuffle/) */
    shuffle(){
        var remaining = this._stack.length;
        var tmp;
        var idx;
      
        // While there remain elements to shuffle…
        while ( remaining ) {
          // Pick a remaining element...
          idx = Math.floor( Math.random() * remaining-- );
      
          // And swap it with the current element.
          tmp = this._stack[ remaining ];
          this._stack[ remaining ] = this._stack[ idx ];
          this._stack[ idx ] = tmp;
        }
      }
    
    
    /** Draws specified amount of cards from top of the deck. */
    draw(count: number): T[]{
        if (!count) return [];
        let drawnCards = this._stack.splice(this._stack.length-count, count);
        return drawnCards;
    }


    /** Adds cards (or 1 card) to the top of the deck. */
    addToTop(cards: T[]){
        this._stack.push(...cards); 
    }
}