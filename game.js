const Round = require('./round');

const suits = ['spades', 'hearts', 'clubs', 'diamonds'];

class Game {

  constructor(fullDeck) {
    this.users = [];
    this.teams = [];
    this.teams[0]= {
      members: [],
      usernames: [],
      score: 2
    }
    this.teams[1]= {
      members: [],
      usernames: [],
      score: 2
    }
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
    this.declarers = 0;
    this.opponents = 1;
    this.gameState = 'unstarted';
    this.connections = [];
  }

  getUsername(id) {
    return this.players[this.playerIds[id]].username;
  }

  getRound() {
    return this.roundIndex;
  }

  cardsToRound(arr) {
    let result = [];
    for(let i = 0; i < arr.length; i++) {
      const cd = {};
      cd.cards = [];
      cd.cards[0] = this.fullDeck.find(element => element.index === parseInt(arr[i].cards[0]));
      cd.index = arr[i].round;
      result.push(cd);
    }
    return result;
  }

  sortFunction(a, b) {
    if(a.adjSuit !== b.adjSuit) {
      return suitValues[a.adjSuit] - suitValues[b.adjSuit];
    } else {
      return a.adjustedValue - b.adjustedValue;
    }
  }

  adjustValues(deck, trumpValue, trumpSuit) {
    // let cards = [];
    for(let i = 0; i < deck.length; i++) {
      const card = deck[i];
      if(card.value === trumpValue && card.suit === trumpSuit) {
        card.adjSuit = 'trump';
        card.adjustedValue = card.value + 80;
      } else if(card.value === trumpValue) {
        card.adjSuit = 'trump';
        card.adjustedValue = card.value + 70;
      } else if(card.suit === trumpSuit) {
        card.adjSuit = 'trump';
        card.adjustedValue = card.value + 50;
      } else {
        card.adjSuit = card.suit;
        card.adjustedValue = card.value;
      }
    } 
  }

  partitionCards(hand, values) {
    const play = [];
    for(let i = 0; i < values.length; i++) {
      let temp = hand.splice(hand.findIndex(element => element.index === parseInt(values[i])), 1);
      play.push(temp[0]);
    }
    return play;
  }

  checkUsers(usrnm, socket, io) {
    if(this.users.includes(usrnm)) {
      this.playerIds.forEach(function(ele) {
        if(this.players[ele].username === usrnm && this.players[ele].left) {
          this.returnUser(socket, this.players[ele], io);
          return 2;
        }
      }, this);
      return 1;
    } else {
      return 0;
    }
  }

  returnUser(newSocket, socket, io) {
    newSocket.username = socket.username;
    newSocket.index = socket.index;
    newSocket.points = socket.points;
    newSocket.left = false;
    newSocket.isTurn = socket.isTurn;
    newSocket.number = socket.number;
    newSocket.hand = socket.hand;
    newSocket.type = socket.type;
    this.players[newSocket.id] = newSocket;
    this.playerIds[newSocket.number] = newSocket.id;
    this.connections.push(newSocket);
    this.connections.splice(this.connections.findIndex(ele => ele.id === socket.id), 1);
    this.broadcastAddUser(newSocket, io, newSocket.points);
    if(this.gameState === 'paused') {
      newSocket.emit('resetup player', {hand: newSocket.hand, turn: newSocket.isTurn});
      io.emit('setup game', {trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, points: this.points, deck: this.fullDeck, teams: this.teams, declarers: this.declarers, users: this.users});
      io.emit('unpause game', {});
      this.players[this.playerIds[this.turn]].emit('your turn', {plays: this.currentRound.played});
      this.gameState = 'playing';
    } 
  }

  addUser(socket, io, usrnm, pts) {
    this.starter = 0;
    socket.username = usrnm;
    socket.points = pts;
    socket.left = false;
    this.users.push(usrnm);
    this.connections.push(socket);
    socket.emit('get user type', this.activeUsers);
  }

  setUserType(socket, io, type) {
    if(type === 'player') {
      socket.type = 'player';
      this.activeUsers++;
      console.log(this.activeUsers);
      this.broadcastAddUser(socket, io, socket.points);
    } else {
      socket.type = 'spectator';
      this.broadcastAddSpectator(socket, io);
    }
  }

  broadcastAddUser(socket, io, pts) {
    socket.emit('setup player', {id: socket.number, username: socket.username, points: pts});
    io.emit('user joined', {
      username: socket.username,
      id: socket.id,
      users: this.users,
    });
  }

  broadcastAddSpectator(socket, io) {
    socket.emit('spectate mode', {});
    io.emit('spectator joined', socket.username);
    if(this.gameState === 'playing') {
      socket.emit('setup game', {trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, points: this.points, deck: this.fullDeck, teams: this.teams, declarers: this.declarers, users: this.users});
    }
  }

  setupPlayers() {
    let i = 0;
    this.connections.forEach(function(ele) {
      if(ele.type === 'player') {
        let tm;
        if(i % 2 === 0) {
          tm = 0;
        } else {
          tm = 1;
        }
        this.teams[tm].members.push(ele.number);
        this.teams[tm].usernames.push(ele.username);
        this.playerIds.push(ele.id);
        this.players[ele.id] = ele;
        ele.number = this.playerIds.length - 1;
        if(ele.number === this.turn) {
           ele.isTurn = true;
        } else {
           ele.isTurn = false;
        }
        this.startUser(ele);
        ele.emit('setup player', {id: ele.number, username: ele.username, points: ele.points});
        i++;
      }
    }, this);
  }

  startUser(socket) {
    socket.hand = this.deck.splice(0, 13);
    socket.hand.sort(this.sortFunction);
  }

  removeUser(socket) {
    if(this.gameState === 'unstarted' || socket.type === 'spectator') {
      this.users.splice(this.users.indexOf(socket.username), 1);
      this.connections.splice(this.connections.findIndex(ele => ele.username === socket.username), 1);
      if(socket.type === 'player') {
        this.activeUsers--;
      }
    } else {
      if(this.players[socket.id] !== undefined) {
        this.players[socket.id].left = true;
        this.gameState = 'paused';
      }
      return this.gameState;
    }
  }

  startGame(io) {
    this.gameState = 'playing';
    this.deck = this.fullDeck.slice();
    this.setupPlayers();
    this.trumpSuit = suits[Math.floor(Math.random() * 4)];
    this.adjustValues(this.fullDeck, this.trumpValue, this.trumpSuit);
    io.emit('setup game', {trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, points: this.points, deck: this.fullDeck, teams: this.teams, declarers: this.declarers, users: this.users});
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
      this.currentRound.setSuit(cd[0].adjSuit);
    } 
    io.emit('hand played', {
      cards: cd,
      username: socket.username,
      id: socket.number,
      played: this.currentRound.played
    });
    this.currentRound.addCard(cd, this.players[socket.id].number);
    this.turn = (this.turn + 1) % 4;
    this.players[socket.id].emit('my recent play', {hand: this.players[socket.id].hand, cards: cd}); //updates recent play
    if(this.currentRound.played < 4) {
      this.players[this.playerIds[this.turn]].emit('your turn', {suit: this.currentRound.suit, plays: this.currentRound.played}); //signifies to next player that it's their turn
    } else { //end of round
      this.endRound(socket, io);
    }
  }

  endRound(socket, io) {
    const winner = this.currentRound.getWinner();
    this.turn = winner;
    let msg = this.players[this.playerIds[this.turn]].username + ' won the round!';
    if(this.teams[this.opponents].members.includes(winner)) { //add points to total if opponents won
      this.points += this.currentRound.points;
      msg += ' The opponents got ' + this.currentRound.points + ' points.';
    }
    this.rounds.push(this.currentRound);
    io.emit('new round', this.points);
    io.emit('game message', msg);
    if(this.players[socket.id].hand.length > 0) { 
      this.startNewRound(winner); //set up next round if game not over
    }
  }

  startNewRound(winner) {
      this.currentRound = new Round(winner, this.trumpSuit, this.trumpValue);
      this.roundIndex++;
      this.players[this.playerIds[this.turn]].emit('your turn', {plays: this.currentRound.played});
  }

  checkGameOver(id) {
    if(this.currentRound.played >= 4 && this.players[this.playerIds[id]].hand.length <= 0) {
      return true;
    } else {
      return false;
    }
  }

  gameOver(io) {
    let msg;
    
    if(this.points < 40) {
      this.winner = 0;
    } else {
      this.winner = 1;
    }

    const winner1 = this.players[this.playerIds[this.teams[this.winner].members[0]]];
    const winner2 =this.players[this.playerIds[this.teams[this.winner].members[1]]];

    if(this.points <= 0) {
      this.ranks = 2;
    } else if(this.points > 0 && this.points < 40) {
      this.ranks = 1;
    } else if(this.points >= 40 && this.points < 80) {
      this.ranks = 1;
    } else if(this.points >= 80 && this.points < 120) {
      this.ranks = 2;
    } else if(this.points >= 120 && this.points < 160) {
      this.ranks = 3;
    } else if(this.points >= 160 && this.points < 200) {
      this.ranks = 4;
    } else {
      this.ranks = 5;
    }

    msg = winner1.username + ' and ' + winner2.username + ' won! Their score increases by ' + this.ranks;

    winner1.points += this.ranks;
    winner2.points += this.ranks;
    this.teams[this.winner].score += this.ranks;

    io.emit('end game', {
      msg: msg,
      winner: this.winner,
      ranks: this.ranks
    });
  }

  updateScores() {
    this.playerIds.forEach(function(id) {
      this.players[id].emit('update score', this.players[id].points);
    }, this);
  }

  restartGame(io) {
    if(this.declarers !== this.winner) { //change starter
      this.starter += 1;
    } else {
      this.starter += 2;
    }
    this.declarers = this.winner; //sets declarers from past winner
    this.opponents = (this.declarers + 1) % 2;
    this.turn = this.starter;
    this.trumpValue = this.teams[this.winner].score;
    // this.trumpSuitIndex = (this.trumpSuitIndex + 1) % 4;
    // this.trumpSuit = suits[this.trumpSuitIndex];
    this.roundIndex = 0;
    this.points = 0;
    this.ranks = 0;
    this.fullDeck = this.fullDeck.sort(() => Math.random() - 0.5);
    // this.players.forEach(function(ele) {
    //   this.startUser(ele);
    // }, this);
    this.startGame(io);
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