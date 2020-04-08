const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const util = require('./util');
const Game = require('./game');
const bodyParser = require('body-parser');
require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// let activeUsers = 0;
// const users = [];
const fullDeck = [];
// let deck = [];

// const playerIds = [];
// const players = {};
// const team1ids = [0, 2];
// const team2ids = [1, 3];
// const team2 = {1: '', 3: ''};

// const trumpSuit = 'spades';
// const trumpValue = 2;

// let turn = 0;
// const rounds = [];
// let currentRound;
// let roundIndex = 0;
// let points = 0;

const connections = [];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false
};
app.use(session(sessionOptions));

app.use(function(req, res, next){
	next();
});

io.use(function(socket, next){
  	next();
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// app.get('/game', function(req, res){
// 	res.sendFile(__dirname + '/public/game.html');
// });

// app.post('/', function(req, res) {
// 	// let filterObj = {};
// 	// filterObj.username = req.body.username;
// 	User.countDocuments({username: req.body.username}, function(err, count) {
// 		if(count > 0) {
// 			console.log('A user with that username already exists!');
// 			res.redirect('/');
// 		} else {
// 			new User({
// 				username: req.body.username,
// 				password: req.body.password
// 			}).save(function(err){
// 				if(err) {
// 					console.log(err);
// 				}
// 				req.session.username = req.body.username;
// 				res.redirect('/game');
// 			});
// 		}
// 	});
// });

// function updatePlayers(id, hand) {
// 	let currentId = (id+1) % 4;
// 	for(let i = 0; i < 3; i++) {
// 		currentId - id;
// 		players[playerIds[currentId]].emit('update players', {'number': 9})
// 		currentId = (currentId + 1) % 4;
// 	}
// }

// function gameOver(io) {
// 	let msg;
// 	let winner;
// 	let ranks;
// 	if(points <= 0) {
// 		msg = players[playerIds[team1ids[0]]].username + ' and ' + players[playerIds[team1ids[1]]].username + ' won! Their score increases by 3.';
// 		winner = 1;
// 		ranks = 3;
// 	} else if(points > 0 && points < 40) {
// 		msg = players[playerIds[team1ids[0]]].username + ' and ' + players[playerIds[team1ids[1]]].username + ' won! Their score increases by 2.';
// 		winner = 1;
// 		ranks = 2;
// 	} else if(points >= 40 && points < 80) {
// 		msg = players[playerIds[team1ids[0]]].username + ' and ' + players[playerIds[team1ids[1]]].username + ' won! Their score increases by 1.';
// 		winner = 1;
// 		ranks = 1;
// 	} else if(points >= 80 && points < 120) {
// 		msg = players[playerIds[team2ids[0]]].username + ' and ' + players[playerIds[team2ids[1]]].username + ' won! Their score increases by 1.';
// 		winner = 2;
// 		ranks = 1;
// 	} else if(points >= 120 && points < 160) {
// 		msg = players[playerIds[team2ids[0]]].username + ' and ' + players[playerIds[team2ids[1]]].username + ' won! Their score increases by 2.';
// 		winner = 2;	
// 		ranks = 2;
// 	} else if(points >= 160 && points < 200) {
// 		msg = players[playerIds[team2ids[0]]].username + ' and ' + players[playerIds[team2ids[1]]].username + ' won! Their score increases by 3.';
// 		winner = 2;	
// 		ranks = 3;
// 	} else {
// 		msg = players[playerIds[team2ids[0]]].username + ' and ' + players[playerIds[team2ids[1]]].username + ' won! Their score increases by 4.';
// 		winner = 2;	
// 		ranks = 4;
// 	}
// 	io.emit('end game', {
// 		msg: msg,
// 		winner: winner,
// 		ranks: ranks
// 	});
// }

const dataPath = path.join(__dirname, 'data.json');
util.loadData(dataPath, fullDeck, startServer);

function startServer() {

	// fullDeck.sort(() => Math.random() - 0.5);
	// deck = fullDeck.slice();	

	http.listen(3000, function(){
		console.log('listening on *:3000');
	});

	const game = new Game(fullDeck);

	io.on('connection', function(socket){
		console.log('a user connected ' + socket.id);
		socket.on('add user', function(user){
			// console.log(user);
			// new User({
			// 	username: user.username,
			// 	password: user.password
			// }).save(function(err){
			// 	if(err) {
			// 		console.log(err);
			// 	}
			// 	res.redirect('/game');
			User.countDocuments({username: user.username}, function(err, count) {
				if(count > 0) {
					console.log('A user with that username already exists!');
					socket.emit('registration error');
				} else {
					new User({
						username: user.username,
						password: user.password
					}).save(function(err){
						if(err) {
							console.log(err);
						}
					});
					game.addUser(socket, io, user.username);
				}
			});
			
			// socket.emit('setup player', {hand: socket.hand, turn: socket.isTurn, id: socket.number});
			// console.log(socket);
			// io.emit('user joined', {
			// 	username: socket.username,
			// 	id: socket.id,
			// 	users: game.users,
			// });
			// });
		});
		socket.on('login', function(user){
			console.log(user.username);
			User.findOne({username: user.username}, function (err, userDoc) {
			  if (err) return handleError(err);
			  if (userDoc !== null) {
			  	if(userDoc.password === user.password) {
			  		game.addUser(socket, io, user.username);
			  	} else {
			  		socket.emit('login error', 'Your password was incorrect. Please try again.');
			  	}
			    // doc may be null if no document matched
			  } else {
			  		socket.emit('login error', 'No user with that username found.');
			  }
			});
		});
		// socket.on('add user', function(usrnm){
		// 	if(activeUsers < 4) {
		// 		// players[socket.id] = socket;
		// 		// players[socket.id].username = usrnm;
		// 		// players[socket.id].index = activeUsers;
		// 		// players[socket.id].rounds = [];
		// 		// users.push(usrnm);
		// 		// players[socket.id].hand = deck.splice(0, 13);
		// 		// players[socket.id].hand.sort(util.sortFunction);
		// 		// playerIds.push(socket.id);
		// 		// players[socket.id].number = playerIds.length - 1;
		// 		// activeUsers++;
		// 		// // players[socket.id].emit('join team', teams);
		// 		// let isTurn;
		// 		// if(players[socket.id].number === turn) {
		// 		// 	 isTurn = true;
		// 		// } else {
		// 		// 	 isTurn = false;
		// 		// }
		// 		socket.emit('setup player', {hand: socket.hand, turn: isTurn, id: players[socket.id].number});
		// 		io.emit('user joined', {
		// 			username: socket.username,
		// 			id: socket.id,
		// 			users: users,
		// 		});
		// 	} else {
		// 		io.emit('spectator joined', {
		// 			username: socket.username,
		// 			users: users,
		// 		});
		// 		socket.emit('spectate mode', '');
		// 	}
		// });
		socket.on('start game', function(){
			// util.adjustValues(fullDeck, trumpValue, trumpSuit);
			// io.emit('setup game', {trumpSuit: trumpSuit, trumpValue: trumpValue, deck: fullDeck, users: users});
			// for(let i = 0; i < playerIds.length; i++) {
			// 	players[playerIds[i]].hand.sort(util.sortFunction);
			// 	players[playerIds[i]].emit('my recent play', {hand: players[playerIds[i]].hand, cards: []});
			// }
			// players[playerIds[turn]].emit('your turn', {});
			// currentRound = new util.Round(turn, trumpSuit, trumpValue);
			game.startGame(io);
		});
		socket.on('chat message', function(msg){
			io.emit('chat message', {
				body: msg,
				username: socket.username
			});
		});
		socket.on('get plays', function(id){
			const plays = players[socket.id].rounds;
			players[socket.id].emit('display plays', plays);
		});
		socket.on('submit hand', function(cards) {
			game.submitHand(socket, io, cards);
			// const cd = util.partitionCards(players[socket.id].hand, cards);
			// if(currentRound.played < 1) {
			// 	currentRound.setSuit(cd[0].suit);
			// } 
			// players[socket.id].rounds.push({index: roundIndex, cards: cd});
			// io.emit('hand played', {
			// 	cards: cd,
			// 	username: socket.username,
			// 	id: socket.number
			// });
			// currentRound.addCard(cd, players[socket.id].number);
			// if(players[socket.id].number in team2) {
			// 	cd.forEach(element => currentRound.points += element.points);
			// }
			// turn = (turn + 1) % 4;
			// players[socket.id].emit('my recent play', {hand: players[socket.id].hand, cards: cd}); //updates recent play
			// if(currentRound.played < 4) {
			// 	players[playerIds[turn]].emit('your turn', {suit: currentRound.suit, plays: currentRound.played}); //signifies to next player that it's their turn
			// } else {
			// 	const winner = currentRound.getWinner();
			// 	if(winner in team2) {
			// 		points += currentRound.points;
			// 	}
			// 	rounds.push(currentRound);
			// 	if(players[socket.id].hand.length <= 0) {
			// 		gameOver(io);
			// 	} else {
			// 		currentRound = new util.Round(winner, trumpSuit, trumpValue);
			// 		roundIndex++;
			// 		turn = winner;
			// 		players[playerIds[turn]].emit('your turn', {plays: currentRound.played});
			// 		io.emit('new round', points);
			// 		io.emit('game message', players[playerIds[turn]].username + ' won the round!');
			// 	}
			// }
		});
		socket.on('disconnect', function() {
			game.users.splice(game.users.indexOf(socket.username), 1);
			socket.broadcast.emit('user left', {
				username: socket.username,
				users: game.users
			});
		// console.log(socket.username);
		});
	});
}