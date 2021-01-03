const fs = require('fs');

let suits = ['spades', 'hearts', 'clubs', 'diamonds'];
let valName = ['0', '1', '2', '3', '4' , '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
let display = ['0', '1', '2', '3', '4' , '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const suitSrc = {
  spades: '/spades.png',
  hearts: '/hearts.png',
  clubs: '/clubs.png',
  diamonds: '/diamonds.png'
};

const suitValues = {
  spades: 0,
  hearts: 1,
  clubs: 2,
  diamonds: 3,
  trump: 4
};

class Card {
  constructor(name, suit, value, display, points, index, key) {
    this.name = name;
    this.suit = suit;
    this.value = value;
    this.display = display;
    this.points = points;
    this.index = index;
    this.key = key;
    this.img = suitSrc[this.suit];
    this.adjustedValue = value;
    this.adjSuit = suit;
  }
}

function loadData(filePath, allData, cb, arg) {
  const arr = [];
  fs.readFile(filePath, (err, jsonData) => {
    if(!err) {
      const data = JSON.parse(jsonData);
      for(let i = 0; i < data.fullDeck.length; i++) {
        const card = data.fullDeck[i];
        arr.push(new Card(card.name, card.suit, card.value, card.display, card.points, i));
      }
      cb(arr, arg);
    } else {
      console.log('could not read', filePath);
      console.log(err);
    }
  });
}

function createDeck(n) {
    const deck = [];
    let key = 1;
    for(let i = 0; i < n; i++) {
      let index = 1;
      for(let suit = 0; suit < 4; suit++) {
        for(let number = 2; number < 15; number++) {
          let pts = 0;
          if(number === 5) {
            pts = 5;
          } else if(number === 10 || number === 13) {
            pts = 10;
          }
          deck.push(new Card(valName[number] + ' of ' + suits[suit], suits[suit], number, display[number], pts, index, key));
          key++;
          index++;
        }
      }
      deck.push(new Card('small joker', 'trump', 80, 'JOKER', 0, index, key));
      index++;
      key++;
      deck.push(new Card('big joker', 'trump', 81, 'JOKER', 0, index, key));
      key++;
    }
    return deck;
}

function sortFunction(a, b) {
  if(a.adjSuit !== b.adjSuit) {
    return suitValues[a.adjSuit] - suitValues[b.adjSuit];
  } else {
    return a.adjustedValue - b.adjustedValue;
  }
}

function adjustValues(deck, trumpValue, trumpSuit) {
  // let cards = [];
  for(let i = 0; i < deck.length; i++) {
    const card = deck[i];
    if(card.value === trumpValue && card.suit === trumpSuit) {
      card.adjSuit = 'trump';
      card.adjustedValue = 70;
    } else if(card.value === trumpValue) {
      card.adjSuit = 'trump';
      card.adjustedValue = 60;
    } else if(card.suit === trumpSuit) {
      card.adjSuit = 'trump';
      card.adjustedValue = card.value + 40;
    } else {
      card.adjSuit = card.suit;
      card.adjustedValue = card.value;
    }
  } 
}

function partitionCards(hand, values) {
  const play = [];
  for(let i = 0; i < values.length; i++) {
    let a = hand.findIndex(element => element.index === parseInt(values[i]));
    const temp = hand.splice(a, 1);
    play.push(temp[0]);
  }
  return play;
}

function splitCards(hand, play) {
  let result = hand.slice();
  play.forEach(p => {
    let i = result.findIndex(r => r.index === p.index);
    result.splice(i, 1);
  });
  return result;
}

function findPairs(hand) {
  let result = [];
  result[0] = [];
  result[1] = [];
  let cards = hand.slice();
  for(let i = 0; i < hand.length; i++) {
    let arr = cards.filter(a => a.index === hand[i].index);
    if(arr.length > 1) {
      if(result[0].findIndex(f => f[0].index === hand[i].index) < 0) {
        result[0].push(arr);
      }
    } else {
      result[1].push(arr[0]);
    }
  }
  return result;
}

module.exports = {
	Card: Card,
	loadData: loadData,
  createDeck: createDeck,
  sortFunction: sortFunction,
  adjustValues: adjustValues,
  partitionCards: partitionCards,
  splitCards: splitCards,
  findPairs: findPairs
};