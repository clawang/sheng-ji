let suits = ['spades', 'hearts', 'clubs', 'diamonds'];
let valName = ['-1', '0', '1', '2', '3', '4' , '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
let display = ['-1', '0', '1', '2', '3', '4' , '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suitSrc = ['/spades.png', '/hearts.png', '/clubs.png', '/diamonds.png'];
const suitValues = {
  spades: 0,
  hearts: 1,
  clubs: 2,
  diamonds: 3,
  trump: 4
};

function createDeck() {
    const deck = [];
    let index = 1;
    for(let suit = 0; suit < 4; suit++) {
      for(let number = 2; number < 15; number++) {
        let pts = 0;
        if(number === 5) {
          pts = 5;
        } else if(number === 10 || number === 13) {
          pts = 10;
        }
        deck.push({name: valName[number] + ' of ' + suits[suit], suit: suits[suit], value: number, display: display[number], points: pts, index: index, img: suitSrc[suit], adjustedValue: number, adjSuit: suit});
        index++;
      }
    }
    deck.push({name: 'small joker', suit: 'trump', value: 80, display: 'JOKER', points: 0, index: index, img: '', adjustedValue: 100, adjSuit: 'trump'});
    index++;
    deck.push({name: 'big joker', suit: 'trump', value: 81, display: 'JOKER', points: 0, index: index, img: '', adjustedValue: 101, adjSuit: 'trump'});
    return deck;
}

function getCard(index) {
  let deck = createDeck();
  return deck.find(cd => cd.index === index);
}

function adjustValues(deck, trumpValue, trumpSuit) {
  let arr = deck.slice();
  for(let i = 0; i < arr.length; i++) {
    const card = arr[i];
    if(card.obj.value === trumpValue && card.obj.suit === trumpSuit) {
      card.obj.adjSuit = 'trump';
      card.obj.adjustedValue = 70;
    } else if(card.obj.value === trumpValue) {
      card.obj.adjSuit = 'trump';
      card.obj.adjustedValue = 60;
    } else if(card.obj.suit === trumpSuit) {
      card.obj.adjSuit = 'trump';
      card.obj.adjustedValue = card.obj.value + 40;
    } else {
      card.obj.adjSuit = card.obj.suit;
      card.obj.adjustedValue = card.obj.value;
    }
  } 
  return arr;
}

function sortFunction(a, b) {
  if(a.obj.adjSuit !== b.obj.adjSuit) {
    return suitValues[a.obj.adjSuit] - suitValues[b.obj.adjSuit];
  } else {
    return a.obj.adjustedValue - b.obj.adjustedValue;
  }
}

export {createDeck, getCard, sortFunction, adjustValues}