class Round {
  //who started, what suit is biggest, who won
  constructor(playerId, trumpSuit, trumpValue) {
    this.started = playerId;
    this.trumpSuit = trumpSuit;
    this.trumpValue = trumpValue;
    this.played = 0;
    this.cards = []; //an array of all cards played this round
    this.points = 0;
  }

  setSuit(suit) {
    this.suit = suit;
  }

  addCard(cd, id) {
    const card = cd[0];
    let value = card.value;
    if(card.suit === this.suit) {
      value += 20;
    } 
    this.cards.push({card: card, id: id, value: value});
    this.played++;
  }

  getWinner() { 
    let max = 0;
    let maxPlayer = -1;
    for(let i = 0; i < this.cards.length; i++) {
      if(this.cards[i].value > max) {
        max = this.cards[i].value;
        maxPlayer = this.cards[i].id;
      }    
    }
    this.winner = maxPlayer;
    return maxPlayer;
  }
}

module.exports = Round;