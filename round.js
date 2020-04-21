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
    let value = card.adjustedValue;
    if(card.adjSuit === this.suit) {
      value += 20;
    } 
    this.cards.push({card: card, id: id, value: value});
    this.played++;
    this.points += cd[0].points;
  }

  getWinner() { 
    let max = 0;
    let maxPlayer = -1;
    for(let i = 0; i < this.cards.length; i++) {
      console.log(this.cards[i].value);
      if(this.cards[i].value > max) {
        max = this.cards[i].value;
        maxPlayer = this.cards[i].id;
      }    
    }
    this.winner = maxPlayer;
    console.log(this.winner);
    return maxPlayer;
  }
}

module.exports = Round;