const fs = require('fs');

const suitSrc = {
  spades: '/img/spades.png',
  hearts: '/img/hearts.png',
  clubs: '/img/clubs.png',
  diamonds: '/img/diamonds.png'
}

class Card {
  constructor(name, suit, value, display, points, index) {
  	this.name = name;
    this.suit = suit;
    this.value = value;
    this.display = display;
    this.points = points;
    this.index = index;
    this.img = suitSrc[this.suit];
  }
}

// class Round {
//   //who started, what suit is biggest, who won
//   constructor(playerId, trumpSuit, trumpValue) {
//     this.started = playerId;
//     this.trumpSuit = trumpSuit;
//     this.trumpValue = trumpValue;
//     this.played = 0;
//     this.cards = []; //an array of all cards played this round
//     this.points = 0;
//   }

//   setSuit(suit) {
//     this.suit = suit;
//   }

//   addCard(cd, id) {
//     const card = cd[0];
//     let value = card.value;
//     if(card.suit === this.suit) {
//       value += 20;
//     } 
//     this.cards.push({card: card, id: id, value: value});
//     this.played++;
//   }

//   getWinner() { 
//     let max = 0;
//     let maxPlayer = -1;
//     for(let i = 0; i < this.cards.length; i++) {
//       if(this.cards[i].value > max) {
//         max = this.cards[i].value;
//         maxPlayer = this.cards[i].id;
//       }    
//     }
//     this.winner = maxPlayer;
//     return maxPlayer;
//   }
// }

class Team {
  constructor(ids, score) {
    this.ids = ids;
    this.score = score;
  }

}

const suitValues = {
	spades: 0,
	hearts: 1,
	clubs: 2,
	diamonds: 3,
	trump: 4
}

function loadData(filePath, allData, cb) {
  fs.readFile(filePath, (err, jsonData) => {
    if(!err) {
      const data = JSON.parse(jsonData);
      for(let i = 0; i < data.fullDeck.length; i++) {
      	const card = data.fullDeck[i];
        allData.push(new Card(card.name, card.suit, card.value, card.display, card.points, i));
      }
      cb();
    } else {
      console.log('could not read', filePath);
      console.log(err);
    }
  });
}

// function sortFunction(a, b) {
//   if(a.suit !== b.suit) {
//     return suitValues[a.suit] - suitValues[b.suit];
//   } else {
//     return a.value - b.value;
//   }
// }

function adjustValues(deck, trumpValue, trumpSuit) {
  // let cards = [];
	for(let i = 0; i < deck.length; i++) {
    const card = deck[i];
    if(card.value === trumpValue && card.suit === trumpSuit) {
      card.suit = 'trump';
      card.value += 80;
    } else if(card.value === trumpValue) {
      card.suit = 'trump';
      card.value += 70;
    } else if(card.suit === trumpSuit) {
      card.suit = 'trump';
      card.value += 50;
    }
	} 
}

function partitionCards(deck, values) {
	const play = [];
	for(let i = 0; i < values.length; i++) {
		let temp = deck.splice(deck.findIndex(element => element.index === parseInt(values[i])), 1);
		play.push(temp[0]);
	}
	return play;
}

module.exports = {
	Card: Card,
  Team: Team,
	loadData: loadData,
	adjustValues: adjustValues,
	partitionCards: partitionCards
}