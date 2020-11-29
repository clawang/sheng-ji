const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const assets = require('./assets');
const Game = require('./game');
const bodyParser = require('body-parser');

const fullDeck = [];
// const plays = [];

const rooms = [];
/* code, sockets, game, startcount */

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sessionOptions = { 
	secret: 'secret for signing session id', 
	saveUninitialized: false, 
	resave: false
};
app.use(session(sessionOptions));

app.get('/', function(req, res){
	res.sendFile(__dirname + './index.html');
});

// function endGame(game) {
// 	game.gameOver(io);

// 	// new GameSchema({
// 	// 	roundIndex: gameIndex,
// 	// 	rounds: plays,
// 	// 	teams: game.teams,
// 	// 	points: game.points,
// 	// 	trumpSuit: game.trumpSuit,
// 	// 	trumpValue: game.trumpValue,
// 	// 	winner: game.winner,
// 	// 	declarer: game.declarers,
// 	// 	starter: game.players[game.playerIds[game.starter]].username
// 	// }).save(function(err){
// 	// 	if(err) {
// 	// 		console.log(err);
// 	// 	}
// 	// });

// 	// for(let i = 0; i < 2; i++) {
// 	// 	const usr = game.players[game.playerIds[game.teams[game.winner].members[i]]];
// 	// 	User.findOne({username: usr.username}, function(err, doc) {
// 	// 		if (err) {console.log(err);}
// 	// 		if(doc !== null) {
// 	// 			doc.points += game.ranks;
// 	// 			doc.save();
// 	// 		}
// 	// 	});
// 	// }
// }

// function gamesToTable(data) {
// 	if(data.length <= 0) {
// 		return 'No games yet!';
// 	}
// 	const teamNames = [];
// 	teamNames[0] = data[0].teams[0].usernames[0] + ' & ' + data[0].teams[0].usernames[1];
// 	teamNames[1] = data[0].teams[1].usernames[0] + ' & ' + data[0].teams[1].usernames[1];
// 	let html = '<h1>Game History</h1><h3 class="yellow">The team that was the Declarer each round is in yellow.</h3><br/><table><tr><th>Round</th><th>' + teamNames[0] + '</th><th>' + teamNames[1] + '</th><th>Starter</th><th>Trump Suit</th><th>Points</th><th>Winner</th></tr>';
// 	data.forEach(function(ele) {
// 		const classes = [];
// 		classes[ele.declarer] = 'winner';
// 		html += '<tr>';
// 		html += '<td>' + ele.roundIndex + '</td>';
// 		html += '<td class="' + classes[0] + '"">' + ele.teams[0].score + '</td>';
// 		html += '<td class="' + classes[1] + '"">' + ele.teams[1].score + '</td>';
// 		html += '<td>' + ele.starter + '</td>';
// 		html += '<td>' + ele.trumpSuit + '</td>';
// 		html += '<td>' + ele.points + '</td>';
// 		html += '<td>' + teamNames[ele.winner] + '</td>';
// 		html += '</tr>';
// 	});
// 	html += '</table>';
// 	return html;
// }

function generateCode() {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for ( var i = 0; i < 6; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 26));
   	}
   	if(rooms.findIndex(room => room.code === result) >= 0) {
   		return generateCode();
   	} else {
   		return result;
   	}
}

function handleDisconnect(game, room, socket) {
	if(!game || !room) {
		socket.emit('disconnected', {});
		return false;
	} else {
		return true;
	}
}

function startServer(fullDeck) {

	const port = process.env.PORT || 8888;

	http.listen(port, function(){
		console.log('listening on *:8888');
	});

	//const game = new Game(fullDeck);

	io.on('connection', function(socket){
		//console.log('a user connected ' + socket.id);

		let game;
		let room;

		socket.on('create game', function(settings, fn) {
			let code = generateCode();
			room = {code: code, sockets: [], game: new Game(fullDeck, code), startCount: []};
			room.sockets.push(socket.id);
			rooms.push(room);
			game = room.game;
			game.editSettings(settings);
			socket.join(code);
			fn(code);
		});

		socket.on('join game', function(code, fn) {
			let index = rooms.findIndex(rm => rm.code === code);
			if(index < 0) {
				fn('error');
			} else {
				room = rooms[index];
				game = room.game;
				room.sockets.push(socket.id);
				socket.join(code);
				fn('success');
			}
		});

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
			const status = game.checkUsers(username, socket, io);
			if(status < 2) {
				let a = game.connections.findIndex(val => val.username === username);
				if(a >= 0) {
					fn('That username is already taken!');
				} else {
					game.addUser(socket, io, username, 0);
					fn('success');
					console.log(username);
				}
			} else {
				fn('return');
				game.playerIds.forEach(function(ele) {
			        if(game.players[ele].username === username && game.players[ele].left) {
			          game.returnUser(socket, game.players[ele], io);
			      	}	
			  	});
			}
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
					socket.emit('set playerId', -1);
					fn('spectator');
					io.to(room.code).emit('user joined', {
				      username: socket.username,
				      id: socket.id,
				      users: game.users,
				    });
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
			if(!room.startCount.includes(socket.id)) {
				room.startCount.push(socket.id);
			}
			if(room.startCount.length >= 4) {
				room.startCount.splice(0, room.startCount.length);
				if(game.roundIndex > 0) {
					game.restartGame(io);
				} else {
					game.startGame(io);
				}
			} 
		});
		socket.on('chat message', function(msg) {
			if(msg.body !== '' && handleDisconnect(game, room, socket)) {
				io.to(room.code).emit('chat message', {
					body: msg.body,
					username: msg.username
				});
			}
		});
		socket.on('get game history', function(data, fn) {
			if(handleDisconnect(game, room, socket)) {
				let games = [];
				fn(game.history);
			}
			// GameSchema.find({}, function(err, data) {
			// 	games = data;
			// 	const msg = gamesToTable(games);
			// 	game.players[socket.id].emit('display games', msg);
			// });

		});
		socket.on('submit swap cards', function(result) {
			if(handleDisconnect(game, room, socket)) {
				game.swapCards(socket, io, result);
			}
		});
		socket.on('submit hand', function(result) {
			if(handleDisconnect(game, room, socket)) {
				game.submitHand(socket, io, result.cards, result.id);
				if(game.checkGameOver(result.id)) {
					for(let i = 0; i < 4; i++) {
						game.players[game.playerIds[i]].hand = [];
					}
					game.revealDiscard(io);
					game.gameOver(io);
					game.updateScores();
				}
			}
		});
		socket.on('restart game', function() {
			if(handleDisconnect(game, room, socket)) {
				if(!room.startCount.includes(socket.id)) {
					room.startCount.push(socket.id);
				}
				if(room.startCount.length >= 4) {
					gameIndex++;
					room.startCount.splice(0, room.startCount.length);
				}
			}
		});
		socket.on('disconnect', function() {
			if(socket.username !== undefined && handleDisconnect(game, room, socket)) {
				const state = game.removeUser(socket);
				socket.to(room.code).emit('user left', {
					username: socket.username,
					users: game.users,
					state: state
				});
				const startPlace = room.startCount.findIndex(ele => ele === socket.id);
				if(startPlace >= 0) {
					room.startCount.splice(startPlace, 1);
				}
			}
		});
	});
}

const dataPath = path.join(__dirname, 'data.json');
assets.loadData(dataPath, fullDeck, startServer);