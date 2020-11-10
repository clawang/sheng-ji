const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const assets = require('./assets');
const Game = require('./game');
const bodyParser = require('body-parser');
require('./db');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Play = mongoose.model('Play');
const GameSchema = mongoose.model('Game');

const fullDeck = [];
const plays = [];
// const connections = [];
const startCount = [];
let gameIndex = 1;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false
};
app.use(session(sessionOptions));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

function endGame(game) {
	game.gameOver(io);

	// new GameSchema({
	// 	roundIndex: gameIndex,
	// 	rounds: plays,
	// 	teams: game.teams,
	// 	points: game.points,
	// 	trumpSuit: game.trumpSuit,
	// 	trumpValue: game.trumpValue,
	// 	winner: game.winner,
	// 	declarer: game.declarers,
	// 	starter: game.players[game.playerIds[game.starter]].username
	// }).save(function(err){
	// 	if(err) {
	// 		console.log(err);
	// 	}
	// });

	// for(let i = 0; i < 2; i++) {
	// 	const usr = game.players[game.playerIds[game.teams[game.winner].members[i]]];
	// 	User.findOne({username: usr.username}, function(err, doc) {
	// 		if (err) {console.log(err);}
	// 		if(doc !== null) {
	// 			doc.points += game.ranks;
	// 			doc.save();
	// 		}
	// 	});
	// }
}

function gamesToTable(data) {
	if(data.length <= 0) {
		return 'No games yet!';
	}
	const teamNames = [];
	teamNames[0] = data[0].teams[0].usernames[0] + ' & ' + data[0].teams[0].usernames[1];
	teamNames[1] = data[0].teams[1].usernames[0] + ' & ' + data[0].teams[1].usernames[1];
	let html = '<h1>Game History</h1><h3 class="yellow">The team that was the Declarer each round is in yellow.</h3><br/><table><tr><th>Round</th><th>' + teamNames[0] + '</th><th>' + teamNames[1] + '</th><th>Starter</th><th>Trump Suit</th><th>Points</th><th>Winner</th></tr>';
	data.forEach(function(ele) {
		const classes = [];
		classes[ele.declarer] = 'winner';
		html += '<tr>';
		html += '<td>' + ele.roundIndex + '</td>';
		html += '<td class="' + classes[0] + '"">' + ele.teams[0].score + '</td>';
		html += '<td class="' + classes[1] + '"">' + ele.teams[1].score + '</td>';
		html += '<td>' + ele.starter + '</td>';
		html += '<td>' + ele.trumpSuit + '</td>';
		html += '<td>' + ele.points + '</td>';
		html += '<td>' + teamNames[ele.winner] + '</td>';
		html += '</tr>';
	});
	html += '</table>';
	return html;
}

function startServer(fullDeck) {

	const port = process.env.PORT || 8888;

	http.listen(port, function(){
		console.log('listening on *:8888');
	});

	const game = new Game(fullDeck);

	io.on('connection', function(socket){
		//console.log('a user connected ' + socket.id);
		socket.on('add user', function(username, fn){
			// User.countDocuments({username: user.username}, function(err, count) {
			// 	if(count > 0) {
			// 		console.log('A user with that username already exists!');
			// 		socket.emit('registration error');
			// 	} else {
			// 		new User({
			// 			username: user.username,
			// 			password: user.password,
			// 			points: 0
			// 		}).save(function(err){
			// 			if(err) {
			// 				console.log(err);
			// 			}
			// 		});
			// 		game.addUser(socket, io, user.username, 0);
			// 	}
			// });
			let a = game.connections.findIndex(val => val.username === username);
			if(a >= 0) {
				fn('That username is already taken!');
			} else {
				game.addUser(socket, io, username, 0);
				fn('success');
				console.log(username);
			}
		});
		socket.on('login', function(user){
			// User.findOne({username: user.username}, function (err, userDoc) {
			// 	if (err) {console.log(err);}
			// 	if (userDoc !== null) {
			// 		if(userDoc.password === user.password) {
			// 			const status = game.checkUsers(user.username, socket, io);
			// 			if(status === 0) {
			// 				game.addUser(socket, io, user.username, userDoc.points);
			// 				if(game.set) {
			// 					io.emit('remove settings', {});
			// 				}
			// 			} else if(status === 1) {
			// 				socket.emit('login error', 'You are already logged in!');
			// 			} 
			// 		} else {
			// 			socket.emit('login error', 'Your password was incorrect. Please try again.');
			// 		}
			// 	} else {
			// 		socket.emit('login error', 'No user with that username found.');
			// 	}
			// });
		});

		socket.on('user type', function(type, fn) {
			if(game.activeUsers >= 4 && type === 'player') {
				fn('There are already 4 active players.');
			} else {
				game.setUserType(socket, io, type);
				if(type === 'player') {
					fn('player');
					socket.emit('set teams', game.teams);
				} else {
					fn('spectator');
				}
			}
		});

		socket.on('set team', function(tm, fn) {
			if(game.teams[tm].usernames.length < 2) {
				game.setTeam(socket, io, tm);
				fn('success');
			} else {
				fn('That team is already full!');
			}
		});

		socket.on('start game', function(settings) {
			if(!startCount.includes(socket.id)) {
				startCount.push(socket.id);
			}
			if(startCount.length >= 4) {
				startCount.splice(0, startCount.length);
				game.startGame(io);
			} else if(startCount.length === 1) {
				//game.editSettings(settings);
				io.emit('remove settings', {});
			}
		});
		socket.on('chat message', function(msg){
			if(msg.body !== '') {
				io.emit('chat message', {
					body: msg.body,
					username: msg.username
				});
			}
		});
		socket.on('get plays', function(id) {
			let plays = [];
			Play.find({username: game.getUsername(id)}, function(err, data) {
				plays = data;
				game.players[socket.id].emit('display plays', game.cardsToRound(plays));
			});
		});
		socket.on('get game history', function() {
			let games = [];
			GameSchema.find({}, function(err, data) {
				games = data;
				const msg = gamesToTable(games);
				game.players[socket.id].emit('display games', msg);
			});
		});
		socket.on('submit swap cards', function(result) {
			game.swapCards(socket, io, result);
		});
		socket.on('submit hand', function(result) {
			// const pl = new Play({
			// 	username: game.getUsername(result.id),
			// 	round: game.getRound(),
			// 	cards: result.cards
			// });
			// plays.push(pl);
			// pl.save(function(err){
			// 	if(err) {
			// 		console.log(err);
			// 	}
			// });
			game.submitHand(socket, io, result.cards);
			if(game.checkGameOver(result.id)) {
				for(let i = 0; i < 4; i++) {
					game.players[game.playerIds[i]].hand = [];
				}
				game.revealDiscard(io);
				endGame(game);
				game.updateScores();
			}
		});
		socket.on('restart game', function() {
			if(!startCount.includes(socket.id)) {
				startCount.push(socket.id);
			}
			if(startCount.length >= 4) {
				gameIndex++;
				startCount.splice(0, startCount.length);
				Play.deleteMany({}, function(err, result) {
					if(err) {console.log(err);}
					game.restartGame(io);
				});
			}
		});
		socket.on('disconnect', function() {
			if(socket.username !== undefined) {
				const state = game.removeUser(socket);
				socket.broadcast.emit('user left', {
					username: socket.username,
					users: game.users,
					state: state
				});
				const startPlace = startCount.findIndex(ele => ele === socket.id);
				if(startPlace >= 0) {
					startCount.splice(startPlace, 1);
				}
				if(state === 'paused') {
					io.emit('pause game', game.left);
				}
			}
		});
	});
}

const dataPath = path.join(__dirname, 'data.json');
assets.loadData(dataPath, fullDeck, startServer);