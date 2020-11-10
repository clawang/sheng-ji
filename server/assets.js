const fs = require('fs');

const suitSrc = {
  spades: '/spades.png',
  hearts: '/hearts.png',
  clubs: '/clubs.png',
  diamonds: '/diamonds.png'
};

class Card {
  constructor(name, suit, value, display, points, index) {
    this.name = name;
    this.suit = suit;
    this.value = value;
    this.display = display;
    this.points = points;
    this.index = index;
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

module.exports = {
	Card: Card,
	loadData: loadData
};