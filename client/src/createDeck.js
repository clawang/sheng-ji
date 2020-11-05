let suits = ['spades', 'hearts', 'clubs', 'diamonds'];
let valName = ['-1', '0', '1', '2', '3', '4' , '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
let display = ['-1', '0', '1', '2', '3', '4' , '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suitSrc = ['/spades.png', '/hearts.png', '/clubs.png', '/diamonds.png'];

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
    deck.push({name: 'small joker', suit: 'trump', value: 100, display: 'JOKER', points: 0, index: index, img: '', adjustedValue: 100, adjSuit: 'trump'});
    index++;
    deck.push({name: 'big joker', suit: 'trump', value: 101, display: 'JOKER', points: 0, index: index, img: '', adjustedValue: 101, adjSuit: 'trump'});
    return deck;
}

function getCard(index) {
  let deck = createDeck();
  return deck.find(cd => cd.index === index);
}

export {createDeck, getCard}