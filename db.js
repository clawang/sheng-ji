const mongoose = require('mongoose');

const User = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	points: {type: Number}
});

const Play = new mongoose.Schema({
	username: {type: String, required: true},
	round: {type: Number, required: true},
	cards: {type: Array, required: true}
});

const Game = new mongoose.Schema({
	roundIndex: {type: Number, required: true},
	rounds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Round' }],
	teams: {type: Array, required: true},
	points: {type: Number, required: true},
	trumpSuit: {type: String, required: true},
	trumpValue: {type: String, required: true},
	winner: {type: Number, required: true},
	declarer: {type: Number, required: true},
	starter: {type: String, required: true}
}, {
	_id: true
});

mongoose.model('User', User);
mongoose.model('Play', Play);
mongoose.model('Game', Game, 'games');

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

mongoose.connect(process.env.MONGODB_URI || dbconf);