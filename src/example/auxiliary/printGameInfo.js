//print game info
export function printGameInfo(game){
    let gameInfo = game.getGameInfoForPlayer();
    console.log('-----');
    console.log(`Joker: ${gameInfo.jokerNumber}`);
    console.log(`Deck size: ${gameInfo.deckSize}`);
    console.log(`Top discard pile card: ${gameInfo.topDiscardCard}`);
    console.log(`Discard pile size: ${gameInfo.discardPileSize}`);
    console.log(`Current player (${gameInfo.currentPlayer.id}) hand:${gameInfo.currentPlayer.hand.map(card => ` ${card}`)} (${gameInfo.currentPlayer.hand.length} cards)`);;
    console.log(`Table melds:${Object.keys(gameInfo.tableMelds).map(player => ` ${player}: ${gameInfo.tableMelds[player]}`)}`);
    console.log('-----');
    return;
}
