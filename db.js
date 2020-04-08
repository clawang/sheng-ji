const mongoose = require('mongoose');

// my schema goes here!
const User = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true}
});

const Team = new mongoose.Schema({
	name: {type: String, required: true},
	users:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' }
});

const Round = new mongoose.Schema({
	game_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
	round_number: {type: Number, required: true},
	started: {type: Number, required: true},
	suit: {type: String, required: true},
	cards: {type: Array, required: true},
	points: {type: Number, required: true},
	winner: {type: Number, required: true} //id of the winner
});

const Game = new mongoose.Schema({
	rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Round' }],
	teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
	points: {type: Number, required: true},
	turn: {type: Number, required: true}, //id of the user whose turn it is
	round_index: {type: Number, required: true} //number of the round in progress
}, {
  	_id: true
});

mongoose.model('User', User);
mongoose.model('Team', Team);
mongoose.model('Round', Round);
mongoose.model('Game', Game);

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, '../config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/finalProject';
}

mongoose.connect(dbconf);