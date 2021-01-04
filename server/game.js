const Round = require('./round');
const helper = require('./assets');

const suits = ['spades', 'hearts', 'clubs', 'diamonds'];

class Game {

  constructor(code) {
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
    this.deckCount = null;
    this.fullDeck = [];
    this.deck = [];
    this.rounds = [];
    this.trumpSuit = null;
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
    this.skipped = {
      skips: 0,
      done: 0
    };
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
    if(this.gameState === 'playing') {
      //newSocket.emit('resetup player', {hand: newSocket.hand, turn: newSocket.isTurn});
      newSocket.emit('my hand', {hand: newSocket.hand, playerId: newSocket.number, prevPlayed: newSocket.prevPlayed, dealing: false, trumpSuit: this.trumpSuit, rank: this.trumpValue, decks: this.deckCount});
      newSocket.emit('set playerId', newSocket.number);
      newSocket.emit('set trump', this.trumpSuit);
      newSocket.emit('setup game', {trumpSuit: this.trumpSuit, trumpValue: this.trumpValue, points: this.points, deck: this.fullDeck, teams: this.teams, declarers: this.declarers, users: this.users});
      if(this.left.length <= 0) {
        this.gameState = 'playing';
        if(this.currentRound) {
          io.to(this.code).emit('next turn', {usrnm: this.players[this.playerIds[this.turn]].username, turn: this.turn, plays: this.currentRound.played, roundIndex: this.roundIndex, suit: this.currentRound.suit});
        }
        // this.players[this.playerIds[this.turn]].emit('your turn', {plays: this.currentRound.played});
      } else {
        io.to(this.code).emit('pause game', this.left);
      }
    } else if(this.gameState === 'waiting') {
      const msg = this.players[this.playerIds[this.teams[this.winner].members[0]]].username + ' and ' + this.players[this.playerIds[this.teams[this.winner].members[1]]].username + ' won!';
      const subtitle = 'Their score increases by ' + this.ranks;
      let finish = false;
      if(this.teams[this.winner].newScore > 14) {
        finish = true;
      }
      newSocket.emit('set playerId', newSocket.number);
      newSocket.emit('end game', {
        msg: msg,
        subtitle: subtitle,
        winner: this.winner,
        ranks: this.ranks,
        finish: finish
      });
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
    io.to(this.code).emit('user joined', {
      username: socket.username,
      id: socket.id,
      users: this.users,
      players: this.activeUsers
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
    this.deckCount = set.decks;
    this.fullDeck = helper.createDeck(this.deckCount);
    this.fullDeck = this.fullDeck.sort(() => Math.random() - 0.5);
    this.trumpValue = parseInt(set.rank);
    this.teams[0].newScore = this.trumpValue;
    this.teams[1].newScore = this.trumpValue;
    this.set = true;
  }

  setupPlayers() {
    if(this.playerIds.length <= 0) {
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
        }
      }, this);
    } else {
      this.playerIds.forEach((id) => this.startUser(this.players[id]), this);
    }
  }

  startUser(socket) {
    let extra = (this.fullDeck.length % 4) * -0.5 + 2;
    let cardCount = Math.floor(this.fullDeck.length / 4) - extra;
    socket.hand = this.deck.splice(0, cardCount);
    socket.prevPlayed = [];
  }

  removeUser(socket, io) {
    this.connections.splice(this.connections.findIndex(ele => ele.username === socket.username), 1);
    if(this.gameState === 'unstarted') {
        this.users.splice(this.users.indexOf(socket.username), 1);
        if(socket.type === 'player') {
          this.activeUsers--;
          if(socket.team) {
            this.teams[socket.team].usernames.splice(this.teams[socket.team].usernames.indexOf(socket.username), 1);
          }
        }
    } else if(this.players[socket.id] !== undefined) {
      this.players[socket.id].left = true;
      this.left.push(socket.username);
      return this.gameState;
    }
  }

  startGame(io) {
    this.teams.forEach(ele => ele.score = ele.newScore);
    this.gameState = 'playing';
    this.deck = this.fullDeck.slice();
    //console.log(this.deck);
    this.setupPlayers();
    io.to(this.code).emit('setup game', {trumpValue: this.trumpValue, teams: this.teams, declarers: this.declarers});
    this.turn = this.starter;
    for(let i = 0; i < this.playerIds.length; i++) {
      this.players[this.playerIds[i]].emit('my hand', {hand: this.players[this.playerIds[i]].hand, playerId: this.players[this.playerIds[i]].number, dealing: true, rank: this.trumpValue, decks: this.deckCount});
      this.players[this.playerIds[i]].emit('set playerId', this.players[this.playerIds[i]].number);
    }
  }

  setSuit(suit, type, id, io) {
    if(suit.length > 0) {
      this.trumpSuit = suit;
      helper.adjustValues(this.fullDeck, this.trumpValue, this.trumpSuit);
      if(this.trumpValue === 2) {
        this.starter = id;
        this.turn = id;
        this.declarers = id % 2;
        this.opponents = (this.declarers + 1) % 2;
        io.to(this.code).emit('setup game', {trumpValue: this.trumpValue, points: this.points, deck: this.fullDeck, teams: this.teams, declarers: this.declarers, users: this.users});
      }
      this.skipped.skips = 4;
    } else if(type === 'btn') {
      this.skipped.skips++;
    } else if(type === 'done') {
      this.skipped.done++;
    }
    if(suit.length > 0) {
      io.to(this.code).emit('trump set', {suit: suit, rank: this.trumpValue, username: this.players[this.playerIds[id]].username});
    }
    if(this.skipped.done >= 4 && this.skipped.skips >= 4) {
      this.finishDeal(io);
    }
  }

  finishDeal(io) {
    if(!this.trumpSuit) {
      let i = this.deck.findIndex(c => c.value === this.trumpValue);
      if(i < 0) {
        i = this.deck.reduce((acc, cur, ind, src) => src[acc].value < cur.value && cur.value < 100 ? ind : acc, 0);
      } 
      this.trumpSuit = this.deck[i].suit;
      io.to(this.code).emit('flip discard', {cards: this.deck, max: i, suit: this.trumpSuit});
      this.starter = 0;
      io.to(this.code).emit('trump set', {suit: this.trumpSuit, rank: this.trumpValue, username: ''});
    }
    helper.adjustValues(this.fullDeck, this.trumpValue, this.trumpSuit);
    this.players[this.playerIds[this.starter]].hand = this.players[this.playerIds[this.starter]].hand.concat(this.deck);
    this.players[this.playerIds[this.starter]].emit('swap cards', {id: this.starter, newCards: this.deck, suit: this.trumpSuit});
    this.players[this.playerIds[this.starter]].to(this.code).emit('sort cards', {starter: this.starter, suit: this.trumpSuit});
  }

  swapCards(socket, io, result) {
    const cd = helper.partitionCards(this.players[socket.id].hand, result.cards);
    this.discard = cd.slice();
    this.startNewRound(this.starter, io);
  }

  validatePlay(socket, play, id) {
    let cards = socket.hand;
    let suitCheck = play.filter(p => p.adjSuit !== play[0].adjSuit);
    if(this.currentRound.played < 1) { //leader
      if(suitCheck.length > 0) {
        return 'You need to play cards of the same suit';
      } else if(play.length > 1) { //more than one card
        let arr = helper.findPairs(play);
        //console.log(socket.username + "'s cards:")
        console.log(arr);
        if(arr[1].length <= 0) { //no singles
          if(arr[0].length > 1) { //tractor
            for(let i = 1; i < arr[0].length; i++) {
              if(arr[0][i][0].adjustedValue - arr[0][i - 1][0].adjustedValue !== 1) {
                return 'You need to play pairs in a row';
              }
            }
            this.currentRound.setSuit(play[0].adjSuit, play.length, 'tractor', arr[0].length);
            return 'success';
          } else { //pair play
            this.currentRound.setSuit(play[0].adjSuit, play.length, 'pair', arr[0].length);
            return 'success';
          }
        } else { //top play
          let minSing = arr[1].reduce((acc, cur) => Math.min(acc, cur.adjustedValue), 200);
          let minPair = arr[0].reduce((acc, cur) => Math.min(acc, cur[0].adjustedValue), 200);
          let playersHand = [];
          let temp = [];
          for(let i = 0; i < 4; i++) {
            if(id !== i) {
              let playerHand = helper.findPairs(this.players[this.playerIds[i]].hand);
              playersHand.concat(this.players[this.playerIds[i]].hand);
            } else {
              let leftover = helper.splitCards(cards, play);
              playersHand.concat(leftover);
            }
            let tempPair = helper.findPairs(temp);
            temp = tempPair[1].filter(h => h.adjSuit === play[0].adjSuit && h.adjustedValue > minSing);
            temp.concat(tempPair[0].filter(h => h.adjSuit === play[0].adjSuit && h.adjustedValue > minPair));
            if(temp.length > 0) { //invalid play
              return 'You need to play pairs or the highest cards left in a suit';
            }
          }
          this.currentRound.setSuit(play[0].adjSuit, play.length, 'top', arr[0].length);
          return 'success';
        }
      } else { //single play
        this.currentRound.setSuit(play[0].adjSuit, play.length, 'single', 0);
        return 'success';
      }
    } else { //not lead
      let leftover = helper.splitCards(cards, play);
      let arr = helper.findPairs(play);
      if(play.length !== this.currentRound.count) {
        return "You need to play " + this.currentRound.count + " card" + (this.currentRound.count > 1 ? "s" : "");
      } else if((play[0].adjSuit === this.currentRound.suit && suitCheck.length === 0) || leftover.findIndex(cd => cd.adjSuit === this.currentRound.suit) < 0) {
        let pairs = helper.findPairs(cards.filter(l => l.adjSuit === this.currentRound.suit));
        if(arr[0].length >= this.currentRound.pairs || (pairs[0].length < this.currentRound.pairs && pairs[0].length === arr[0].length)) {
          return 'success';
        } else {
          return "You need to play a pair if you have one";
        }
      } else {
        return "You need to play " + this.currentRound.suit;
      }
    }
  }

  submitHand(socket, io, cards, id) {
    const sock = this.players[socket.id] ? this.players[socket.id] : this.players[this.playerIds[id]];
    if(!this.players[socket.id]) {
      this.playerIds[id] = socket.id;
      sock.id = socket.id;
    }
    const cd = helper.partitionCards(sock.hand, cards);
    sock.prevPlayed.concat(cd);
    if(this.currentRound.played < 1) {
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
    //if(this.currentRound.played >= 3 && this.roundIndex >= 2) {
    if(this.currentRound.played >= 4 && this.players[this.playerIds[id]].hand.length <= 0) {
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
    this.gameState = 'waiting';

    this.ranks = Math.floor((this.points - (this.deckCount * 40))/40);
    if(this.ranks >= 0) {
      this.ranks += 1;
    } 

    if(this.ranks < 0) {
      this.winner = this.declarers;
    } else {
      this.winner = this.opponents;
    }

    this.ranks = Math.abs(this.ranks);

    const winner1 = this.players[this.playerIds[this.teams[this.winner].members[0]]];
    const winner2 = this.players[this.playerIds[this.teams[this.winner].members[1]]];

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
    this.trumpSuit = null;
    this.roundIndex = 0;
    this.points = 0;
    this.ranks = 0;
    this.fullDeck = this.fullDeck.sort(() => Math.random() - 0.5);
    this.gameState = 'playing';
    this.skipped.skips = 0;
    this.skipped.done = 0;
    this.startGame(io);
  }
}

module.exports = Game;