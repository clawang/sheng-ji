const Round = require('./round');

class Game {

  constructor(fullDeck) {
    this.users = [];
    this.teams = [];
    this.teams[0] = [0, 2];
    this.teams[1] = [1, 3];
    this.players = [];
    this.playerIds = [];
    this.fullDeck = fullDeck.sort(() => Math.random() - 0.5);
    this.deck = fullDeck.slice();
    this.rounds = [];
    this.trumpSuit = 'spades';
    this.trumpValue = 2;
    this.turn = 0;
    this.currentRound;
    this.roundIndex = 0;
    this.points = 0;
    this.activeUsers = 0;
  }

  sortFunction(a, b) {
    if(a.suit !== b.suit) {
      return suitValues[a.suit] - suitValues[b.suit];
    } else {
      return a.value - b.value;
    }
  }

  adjustValues(deck, trumpValue, trumpSuit) {
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

  partitionCards(deck, values) {
    const play = [];
    for(let i = 0; i < values.length; i++) {
      let temp = this.deck.splice(this.deck.findIndex(element => element.index === parseInt(values[i])), 1);
      play.push(temp[0]);
    }
    return play;
  }

  addUser(socket, io, usrnm) {
    this.players[socket.id] = socket;
    this.players[socket.id].username = usrnm;
    this.players[socket.id].index = this.activeUsers;
    this.players[socket.id].rounds = [];
    this.users.push(usrnm);
    this.players[socket.id].hand = this.deck.splice(0, 13);
    this.players[socket.id].hand.sort(this.sortFunction);
    this.playerIds.push(socket.id);
    this.players[socket.id].number = this.playerIds.length - 1;
    this.activeUsers++;
    if(this.players[socket.id].number === this.turn) {
       this.players[socket.id].isTurn = true;
    } else {
       this.players[socket.id].isTurn = false;
    }
    this.broadcastAddUser(this.players[socket.id], io);
  }

  broadcastAddUser(socket, io) {
    socket.emit('setup player', {hand: socket.hand, turn: socket.isTurn, id: socket.number});
    io.emit('user joined', {
      username: socket.username,
      id: socket.id,
      users: this.users,
    });
  }

  startGame(io) {
    this.adjustValues(this.fullDeck, this.trumpValue, this.trumpSuit);
    io.emit('setup game', {trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, deck: this.fullDeck, users: this.users});
    for(let i = 0; i < this.playerIds.length; i++) {
      this.players[this.playerIds[i]].hand.sort(this.sortFunction);
      this.players[this.playerIds[i]].emit('my recent play', {hand: this.players[this.playerIds[i]].hand, cards: []});
    }
    this.players[this.playerIds[this.turn]].emit('your turn', {});
    this.currentRound = new Round(this.turn, this.trumpSuit, this.trumpValue);
  }

  submitHand(socket, io, cards) {
    const cd = this.partitionCards(this.players[socket.id].hand, cards);
    if(this.currentRound.played < 1) {
      this.currentRound.setSuit(cd[0].suit);
    } 
    this.players[socket.id].rounds.push({index: this.roundIndex, cards: cd});
    io.emit('hand played', {
      cards: cd,
      username: socket.username,
      id: socket.number
    });
    this.currentRound.addCard(cd, this.players[socket.id].number);
    if(this.teams[1].includes(this.players[socket.id].number)) {
      cd.forEach(element => this.currentRound.points += element.points);
    }
    this.turn = (this.turn + 1) % 4;
    this.players[socket.id].emit('my recent play', {hand: this.players[socket.id].hand, cards: cd}); //updates recent play
    if(this.currentRound.played < 4) {
      this.players[this.playerIds[this.turn]].emit('your turn', {suit: this.currentRound.suit, plays: this.currentRound.played}); //signifies to next player that it's their turn
    } else {
      const winner = this.currentRound.getWinner();
      if(this.teams[1].includes(winner)) {
        this.points += this.currentRound.points;
      }
      this.rounds.push(this.currentRound);
      if(this.players[socket.id].hand.length <= 0) {
        this.gameOver(io);
      } else {
        this.currentRound = new Round(winner, trumpSuit, trumpValue);
        this.roundIndex++;
        this.turn = winner;
        this.players[this.playerIds[this.turn]].emit('your turn', {plays: this.currentRound.played});
        io.emit('new round', points);
        io.emit('game message', this.players[this.playerIds[this.turn]].username + ' won the round!');
      }
    }
  }

  addRound(round) {
    this.rounds.push(round);
  }

  update(pts, turn, round) {
    this.points = pts;
    this.turn = turn;
    this.addRound(round);
  }

  updatePlayers(id, hand) {
    let currentId = (id+1) % 4;
    for(let i = 0; i < 3; i++) {
      currentId - id;
      this.players[this.playerIds[currentId]].emit('update players', {'number': 9})
      currentId = (currentId + 1) % 4;
    }
  }

  gameOver(io) {
    let msg;
    let ranks;
    if(points <= 0) {
      msg = players[playerIds[teams[0][0]]].username + ' and ' + players[playerIds[teams[0][1]]].username + ' won! Their score increases by 3.';
      this.winner = 1;
      ranks = 3;
    } else if(points > 0 && points < 40) {
      msg = players[playerIds[teams[0][0]]].username + ' and ' + players[playerIds[teams[0][1]]].username + ' won! Their score increases by 2.';
      this.winner = 1;
      ranks = 2;
    } else if(points >= 40 && points < 80) {
      msg = players[playerIds[teams[0][0]]].username + ' and ' + players[playerIds[teams[0][1]]].username + ' won! Their score increases by 1.';
      this.winner = 1;
      ranks = 1;
    } else if(points >= 80 && points < 120) {
      msg = players[playerIds[teams[1][0]]].username + ' and ' + players[playerIds[teams[1][1]]].username + ' won! Their score increases by 1.';
      this.winner = 2;
      ranks = 1;
    } else if(points >= 120 && points < 160) {
      msg = players[playerIds[teams[1][0]]].username + ' and ' + players[playerIds[teams[1][1]]].username + ' won! Their score increases by 2.';
      this.winner = 2; 
      ranks = 2;
    } else if(points >= 160 && points < 200) {
      msg = players[playerIds[teams[1][0]]].username + ' and ' + players[playerIds[teams[1][1]]].username + ' won! Their score increases by 3.';
      this.winner = 2; 
      ranks = 3;
    } else {
      msg = players[playerIds[teams[1][0]]].username + ' and ' + players[playerIds[teams[1][1]]].username + ' won! Their score increases by 4.';
      this.winner = 2; 
      ranks = 4;
    }
    io.emit('end game', {
      msg: msg,
      winner: this.winner,
      ranks: ranks
    });
  }
}

const suitValues = {
  spades: 0,
  hearts: 1,
  clubs: 2,
  diamonds: 3,
  trump: 4
}

module.exports = Game;