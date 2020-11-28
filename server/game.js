const Round = require('./round');

const suits = ['spades', 'hearts', 'clubs', 'diamonds'];

const suitValues = {
  spades: 0,
  hearts: 1,
  clubs: 2,
  diamonds: 3,
  trump: 4
};

class Game {

  constructor(fullDeck, code) {
    this.users = [];
    this.teams = [];
    this.teams[0]= { //declarers
      members: [0, 2],
      usernames: [],
      score: 2,
      newScore: 2
    };
    this.teams[1]= { //opponents
      members: [1, 3],
      usernames: [],
      score: 2,
      newScore: 2
    };
    this.players = [];
    this.playerIds = [];
    this.fullDeck = fullDeck.sort(() => Math.random() - 0.5);
    this.deck = fullDeck.slice();
    this.rounds = [];
    this.trumpSuit = 'spades';
    this.trumpValue = 2;
    this.turn = 0;
    this.roundIndex = 0;
    this.points = 0;
    this.activeUsers = 0;
    this.declarers = 0;
    this.opponents = 1;
    this.gameState = 'unstarted';
    this.connections = [];
    this.left = [];
    this.set = false;
    this.discard = [];
    this.gameIndex = 1;
    this.history = [];
    this.code = code;
  }

  getUsername(id) {
    if(this.playerIds[id] !== undefined) {
      return this.players[this.playerIds[id]].username;
    } else {
      return 'username';
    }
  }

  getRound() {
    return this.roundIndex;
  }

  cardsToRound(arr) {
    const result = [];
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
      let a = hand.findIndex(element => element.index === parseInt(values[i]));
      const temp = hand.splice(a, 1);
      play.push(temp[0]);
    }
    return play;
  }

  checkUsers(usrnm, socket, io) {
    if(this.users.includes(usrnm)) {
      let flag = false;
      this.playerIds.forEach(function(ele) {
        if(this.players[ele].username === usrnm && this.players[ele].left) {
          // this.returnUser(socket, this.players[ele], io);
          flag = true;
        }
      }, this);
      if(flag) {
        return 2;
      } else {
        return 1;
      }
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
    newSocket.prevPlayed = socket.prevPlayed;
    this.players[newSocket.id] = newSocket;
    this.playerIds[newSocket.number] = newSocket.id;
    this.connections.push(newSocket);
    this.connections.splice(this.connections.findIndex(ele => ele.id === socket.id), 1);
    this.left.splice(this.left.findIndex(ele => ele === newSocket.username), 1);
    this.broadcastAddUser(newSocket, io, newSocket.points);
    if(this.gameState === 'paused') {
      //newSocket.emit('resetup player', {hand: newSocket.hand, turn: newSocket.isTurn});
      newSocket.emit('my hand', {hand: newSocket.hand, playerId: newSocket.number, prevPlayed: newSocket.prevPlayed});
      newSocket.emit('set playerId', newSocket.number);
      io.to(this.code).emit('setup game', {trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, points: this.points, deck: this.fullDeck, teams: this.teams, declarers: this.declarers, users: this.users});
      if(this.left.length <= 0) {
        io.to(this.code).emit('unpause game', {});
        this.gameState = 'playing';
        if(this.currentRound) {
          io.to(this.code).emit('next turn', {usrnm: this.players[this.playerIds[this.turn]].username, turn: this.turn, plays: this.currentRound.played, roundIndex: this.roundIndex});
        }
        // this.players[this.playerIds[this.turn]].emit('your turn', {plays: this.currentRound.played});
      } else {
        io.to(this.code).emit('pause game', this.left);
      }
    } 
  }

  addUser(socket, io, usrnm, pts) {
    this.starter = 0;
    socket.username = usrnm;
    socket.points = pts;
    socket.left = false;
    this.connections.push(socket);
    socket.emit('get user type', this.activeUsers);
  }

  setUserType(socket, io, type) {
    if(type === 'player') {
      socket.type = 'player';
      this.activeUsers++;
      socket.emit('join team', this.teams);      
    } else {
      socket.type = 'spectator';
      this.broadcastAddSpectator(socket, io);
    }
  }

  setTeam(socket, io, tm) {
    if(this.teams[tm].usernames.length > 0) {
      socket.number = tm + 2;
    } else {
      socket.number = tm;
    }
    socket.team = tm;
    this.teams[tm].usernames.push(socket.username);
    this.broadcastAddUser(socket, io, socket.points);
  }

  broadcastAddUser(socket, io, pts) {
    socket.emit('setup player', {id: socket.number, username: socket.username, points: pts});
    io.to(this.code).emit('user joined', {
      username: socket.username,
      id: socket.id,
      users: this.users,
    });
  }

  broadcastAddSpectator(socket, io) {
    socket.emit('spectate mode', {});
    io.to(this.code).emit('spectator joined', socket.username);
    if(this.gameState === 'playing') {
      socket.emit('setup game', {trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, points: this.points, deck: this.fullDeck, teams: this.teams, declarers: this.declarers, users: this.users});
    }
  }

  editSettings(set) {
    this.trumpValue = parseInt(set.rank);
    this.trumpSuit = set.suit ? String(set.suit) : 'random';
    this.teams[0].newScore = this.trumpValue;
    this.teams[1].newScore = this.trumpValue;
    this.set = true;
  }

  setupPlayers() {
    this.connections.forEach(function(ele) {
      if(ele.type === 'player') {
        this.playerIds[ele.number] = ele.id;
        this.users[ele.number] = ele.username;
        this.players[ele.id] = ele;
        if(ele.number === this.turn) {
           ele.isTurn = true;
        } else {
           ele.isTurn = false;
        }
        this.startUser(ele);
        ele.emit('setup player', {id: ele.number, username: ele.username, points: ele.points});
      }
    }, this);
  }

  startUser(socket) {
    if(socket.number === this.starter) {
      socket.hand = this.deck.splice(0, 18);
    } else {
      socket.hand = this.deck.splice(0, 12);
    }
    socket.prevPlayed = [];
    socket.hand.sort(this.sortFunction);
  }

  removeUser(socket) {
    this.connections.splice(this.connections.findIndex(ele => ele.username === socket.username), 1);
    if(this.gameState === 'unstarted') {
        this.users.splice(this.users.indexOf(socket.username), 1);
        this.activeUsers--;
    } else if(this.players[socket.id] !== undefined) {
      this.players[socket.id].left = true;
      this.left.push(socket.username);
      this.gameState = 'paused';
      return this.gameState;
    }
  }

  startGame(io) {
    this.teams.forEach(ele => ele.score = ele.newScore);
    this.gameState = 'playing';
    this.deck = this.fullDeck.slice();
    this.setupPlayers();
    if(this.trumpSuit === 'random') {
      this.trumpSuit = suits[Math.floor(Math.random() * 4)];
    }
    this.adjustValues(this.fullDeck, this.trumpValue, this.trumpSuit);
    io.to(this.code).emit('setup game', {trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, points: this.points, deck: this.fullDeck, teams: this.teams, declarers: this.declarers, users: this.users});
    this.turn = this.starter;
    for(let i = 0; i < this.playerIds.length; i++) {
      this.players[this.playerIds[i]].hand.sort(this.sortFunction);
      this.players[this.playerIds[i]].emit('my hand', {hand: this.players[this.playerIds[i]].hand, playerId: this.players[this.playerIds[i]].number});
      this.players[this.playerIds[i]].emit('set playerId', this.players[this.playerIds[i]].number);
    }
    this.players[this.playerIds[this.starter]].emit('swap cards', this.starter);
  }

  swapCards(socket, io, result) {
    const cd = this.partitionCards(this.players[socket.id].hand, result.cards);
    this.discard = cd.slice();
    // this.players[socket.id].emit('my recent play', {hand: this.players[socket.id].hand, cards: []});
    this.startNewRound(this.starter, io);
  }

  submitHand(socket, io, cards, id) {
    const sock = this.players[socket.id] ? this.players[socket.id] : this.players[this.playerIds[id]];
    if(!this.players[socket.id]) {
      this.playerIds[id] = socket.id;
      sock.id = socket.id;
    }
    const cd = this.partitionCards(sock.hand, cards);
    sock.prevPlayed.concat(cd);
    if(this.currentRound.played < 1) {
      this.currentRound.setSuit(cd[0].adjSuit);
      io.to(this.code).emit('new round', this.currentRound.started);
    } 
    io.to(this.code).emit('hand played', {
      cards: cd,
      username: socket.username,
      id: id,
      played: this.currentRound.played
    });
    this.currentRound.addCard(cd, sock.number);
    this.turn = (this.turn + 1) % 4;
    if(this.currentRound.played < 4) {
      io.to(this.code).emit('next turn', {usrnm: this.players[this.playerIds[this.turn]].username, turn: this.turn, plays: this.currentRound.played, roundIndex: this.roundIndex, suit: this.currentRound.suit});
    } else { //end of round
      this.endRound(socket, io); 
    }
  }

  endRound(socket, io) {
    const winner = this.currentRound.getWinner();
    this.turn = winner;
    let subtitle = '';
    if(this.teams[this.opponents].members.includes(winner)) { //add points to total if opponents won
      this.points += this.currentRound.points;
      subtitle += ' The opponents got ' + this.currentRound.points + ' points.';
    }
    this.rounds.push(this.currentRound);
    io.to(this.code).emit('win round', winner);
    io.to(this.code).emit('update points', this.points);
    //io.emit('game message', {user: this.players[this.playerIds[this.turn]].username, subtitle: subtitle, winner: winner});
    if(this.players[socket.id].hand.length > 0) { 
      this.startNewRound(winner, io); //set up next round if game not over
    }
  }

  startNewRound(winner, io) {
    this.currentRound = new Round(winner, this.trumpSuit, this.trumpValue);
    this.roundIndex++;
    io.to(this.code).emit('next turn', {usrnm: this.players[this.playerIds[this.turn]].username, turn: this.turn, plays: this.currentRound.played, roundIndex: this.roundIndex, suit: ''});
  }

  checkGameOver(id) {
    if(this.currentRound.played >= 3 && this.roundIndex >= 2) {
    //if(this.currentRound.played >= 4 && this.players[this.playerIds[id]].hand.length <= 0) {
      return true;
    } else {
      return false;
    }
  }

  revealDiscard(io) {
    let addPoints = 0;
    let opponents = false;
    if(this.teams[this.opponents].members.includes(this.currentRound.winner)) {
      this.discard.forEach(function(ele) {
        this.points += ele.points * 2;
        addPoints += ele.points * 2;
        opponents = true;
      }, this);
    }
    io.to(this.code).emit('reveal discard', {discard: this.discard, points: this.points, addPoints: addPoints, adding: opponents});
  }

  gameOver(io) {
    if(this.points < 40) {
      this.winner = this.declarers;
    } else {
      this.winner = this.opponents;
    }

    const winner1 = this.players[this.playerIds[this.teams[this.winner].members[0]]];
    const winner2 =this.players[this.playerIds[this.teams[this.winner].members[1]]];

    if(this.points <= 0) {
      this.ranks = 2;
    } else if(this.points > 0 && this.points < 80) {
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

    const msg = winner1.username + ' and ' + winner2.username + ' won!';
    const subtitle = 'Their score increases by ' + this.ranks;

    this.history.push({roundIndex: this.gameIndex, rounds: this.rounds, teams: JSON.parse(JSON.stringify(this.teams)), points: this.points, trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, winner: this.winner, declarer: this.declarers, starter: this.players[this.playerIds[this.starter]].username});
    this.gameIndex++;

    winner1.points += this.ranks;
    winner2.points += this.ranks;
    this.teams[this.winner].newScore += this.ranks;

    let finish = false;
    if(this.teams[this.winner].newScore > 14) {
      finish = true;
    }

    io.to(this.code).emit('end game', {
      msg: msg,
      subtitle: subtitle,
      winner: this.winner,
      ranks: this.ranks,
      finish: finish
    });
  }

  updateScores() {
    this.playerIds.forEach(function(id) {
      this.players[id].emit('update score', this.players[id].points);
    }, this);
  }

  restartGame(io) {
    if(this.declarers !== this.winner) { //change starter
      this.starter = (this.starter + 1) % 4;
    } else {
      this.starter = (this.starter + 2) % 4;
    }
    this.declarers = this.winner; //sets declarers from past winner
    this.opponents = (this.declarers + 1) % 2;
    this.turn = this.starter;
    this.trumpValue = this.teams[this.winner].newScore;
    this.trumpSuit = 'random';
    this.roundIndex = 0;
    this.points = 0;
    this.ranks = 0;
    this.fullDeck = this.fullDeck.sort(() => Math.random() - 0.5);
    this.startGame(io);
  }
}

module.exports = Game;