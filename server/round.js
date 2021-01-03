const helper = require('./assets');

class Round {
  //who started, what suit is biggest, who won
  constructor(playerId, trumpSuit, trumpValue) {
    this.started = playerId;
    this.trumpSuit = trumpSuit;
    this.trumpValue = trumpValue;
    this.played = 0;
    this.cards = []; //an array of all cards played this round
    this.points = 0;
    this.suit = null;
  }

  setSuit(suit, count, play, pairs) {
    this.suit = suit;
    this.count = count;
    this.play = play;
    this.pairs = pairs;
  }

  addCard(cd, id) {
    let value;
    let suitCheck = cd.filter(p => p.adjSuit !== cd[0].adjSuit);
    let arr = helper.findPairs(cd);
    if(this.play === 'single') {
      value = cd[0].adjustedValue;
    } else if(this.play === 'pair') {
      if(arr[0].length > 0) {
        value = cd[0].adjustedValue;
      } else {
        value = 0;
      }
    } else if(this.play === 'tractor') {
      if(arr[1].length > 0 || suitCheck.length > 0) {
        value = 0;
      } else {
        for(let i = 1; i < arr[0].length; i++) {
          if(arr[0][i][0].adjustedValue - arr[0][i - 1][0].adjustedValue !== 1) {
            value = 1;
          }
        }
        if(value !== 1) {
          value = arr[0].reduce((acc, cur) => Math.max(acc, cur[0].adjustedValue), 0);
        }
      }
    } else if(this.play === 'top') {
      if(suitCheck.length > 0) {
        value = 0;
      } else if(this.played === 0) {
        value = cd.reduce((acc, cur) => Math.max(acc, cur.adjustedValue), 0); 
      } else if(cd[0].adjSuit === this.trumpSuit && arr[0].length === this.pairs) {
        if(this.pairs > 0) {
          value = arr[0].reduce((acc, cur) => Math.max(acc, cur[0].adjustedValue), 0); 
        } else {
          value = cd.reduce((acc, cur) => Math.max(acc, cur.adjustedValue), 0); 
        }
      } else {
        value = 1;
      }
    }
    if(cd[0].adjSuit === this.suit && suitCheck.length === 0) {
      value += 20;
    } 
    this.cards.push({cards: cd, id: id, value: value});
    this.played++;
    this.points += cd.reduce((acc, cur) => acc + cur.points, 0);
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