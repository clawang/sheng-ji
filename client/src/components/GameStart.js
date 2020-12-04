import React, { useState, useEffect } from 'react';

function GameStart(props) {

	const [state, setState] = useState(0);
	const [socket, setSocket] = useState(props.socket);

	const showInstructions = () => {
		setState(3);
	}

	if(state === 1) {
		return <CreateGame setState={() => setState(0)} socket={socket} setRoom={props.setRoom} code={props.code} />;
	} else if(state === 2) {
		return <JoinGame setState={() => setState(0)} socket={socket} setRoom={props.setRoom} code={props.code} />;
	} else if(state === 3) {
		return <Instructions close={() => setState(0)} />;
	} else {
		return (
			<div className="start-page">
				<div className="game-start">
					<h1>Sheng Ji</h1>
					<div className="create-game">
						<h2>Host</h2>
						<button onClick={() => setState(1)}>Create a Game</button>
					</div>
					<div className="join-game">
						<h2>Guest</h2>
						<button onClick={() => setState(2)}>Join a Game</button>
					</div>
					<button id="instructions-btn" onClick={showInstructions}>How to Play</button>
				</div>
			</div>
		);
	}
};

function CreateGame(props) {

	const [socket, setSocket] = useState(props.socket);
	const [message, setMessage] = useState('');
	const [settings, setSettings] = useState({
		rank: 2
	});

	const changeRank = (evt) => {
		setSettings({...settings, rank: evt.target.value});
	}

	const createGame = (evt) => {
		evt.preventDefault();
		if(settings.rank >= 2 && settings.rank <= 14) {
			socket.emit('create game', settings, (res) => {
				props.code.current = res;
				props.setRoom(0);
			});
		} else {
			setMessage('The trump rank must be between 2 and 14.');
		}
	}

	return (
		<div className="start-page">
			<div className="game-start">
				<h1>Sheng Ji</h1>
				<div className="create-game">
					<h2>Settings</h2>
					<form id="edit-settings">
		              <label>Trump Rank</label><br/>
		               <input id="setTrumpValue" name="setTrumpValue" autoComplete="off" defaultValue="2" min="2" max="14" type="number" onChange={changeRank}/><br/>
		              <button onClick={createGame}>Create Game</button>
		            </form>
		            <p id="login-error" className="error-message">{message}</p>
		            <p><a href="#" onClick={props.setState}>← BACK</a></p>
	            </div>
			</div>
		</div>
	);
}

function JoinGame(props) {

	const [socket, setSocket] = useState(props.socket);
	const [message, setMessage] = useState('');
	const [id, setID] = useState('');

	const changeID = (evt) => {
		setID(evt.target.value);
	}

	const joinGame = (evt) => {
		evt.preventDefault();
		socket.emit('join game', id, (res) => {
			if(res === 'success') {
				props.code.current = id;
				props.setRoom(0);
			} else {
				setMessage('No game with that code found.');
			}
		});
	}

	return (
		<div className="start-page">
			<div className="game-start">
				<h1>Sheng Ji</h1>
				<div className="create-game">
					<h2>Game Code</h2>
					<form id="edit-settings">
		              <input name="gameID" autoComplete="off" type="text" onChange={changeID}/><br/>
		              <button onClick={joinGame}>Join Game</button>
		              <p id="login-error" className="error-message">{message}</p>
		            </form>
		            <p><a href="#" onClick={props.setState}>← BACK</a></p>
	            </div>
			</div>
		</div>
	);
}

function Instructions(props) {
	const close = () => {
		props.close();
	}

	return (
		<div id="instructions">
	        <p id="instructions-close" onClick={close}><a href="#">X</a></p>
	        <h1>Rules</h1>
	        
	        <h3>Players and Cards</h3>
	        <p>Sheng Ji is a game played by four players in fixed teams, with partners facing each other across the table. A standard international pack is used, with red and black jokers, making 54 cards in all. The point values of the cards are as follows:</p>
	        <table>
		        <tr>
			        <td>Each King</td>
			        <td>10 points</td> 
		        </tr>
		        <tr>
		        	<td>Each ten</td>
		        	<td>10 points</td> 
		        </tr>
		        <tr>
		        	<td>Each five </td>
		        	<td>5 points,</td> 
		        </tr>
		        <tr>
		        	<td>Other cards</td>
		        	<td>no value</td> 
		        </tr>
	        </table>
	        <h3>Ranking of Cards</h3>
	        <p>In each hand there are eighteen trumps: the two jokers, all the cards of a particular suit (the trump suit) and all the cards of a particular rank (the trump rank). The highest trump is the red Joker, second is the black Joker, and third is the card which belongs to both the trump suit and the trump rank. Next come the other three cards of the trump rank, which are equal in status. Finally there are the remaining cards of the trump suit which rank in downwards order A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2 (omitting the trump rank). The three remaining suits also rank from highest to lowest omitting the trump rank.</p>

	        <h3>Declarers and Opponents</h3>
	        <p>In each game one team is the Declarers, and the other are the Opponents. The Declarers are the winners of the previous game. Each team's score is expressed as a card rank from two (low) up to Ace (high). In each game the trump rank is the Declarers' current score. Both sides start at two and the winners are the first side whose score goes above Ace.</p>
	        <p>In each game, one of the Declarers is designated the starter. They will get to start the first round of the game. Additionally, before the game starts, the starter gets the 6 leftover cards after the cards have been dealed. They then get to choose 6 cards from their own hand to discard. No other players get to see these cards. These cards will become important after the game is finished.</p>


	        <h3>The Deal</h3>
			<p>Each player receives twelve cards, but there is no dealer as such. The trump suit is picked during the dealing.</p>

			<p>The trump rank for the hand is known in advance of the deal: for the first hand it must be two because both sides start with a score of two, and in subsequent hands it is the current score of the declarers. Any player who draws a card of the trump rank during the deal may place it face up on the table, and its suit then becomes trumps for the hand. If you draw a card of the trump rank you need not show it immediately you draw it; you may keep it and expose at at any time provided that no other card has yet been exposed, or you may prefer never to expose it if you do not want its suit as trumps. Consultation between partners is not allowed.</p>

			<p>After each player has drawn a hand of twelve cards there are six face-down cards left over. If no one has yet exposed a card, the starter turns these cards face up one at a time in order. Once the first of these cards is exposed it is too late for anyone to determine the trump suit by exposing one of their own cards. If a card of the trump rank is found among the last six cards, its suit becomes trumps and no further cards are turned up. If no card of the trump rank appears, the highest ranking of the six cards, excluding Jokers, determines the trump suit; among cards of equal rank the earliest exposed takes precedence.</p>

			<p>In the first hand whichever player exposes a two (or the starter in the unlikely event that no one does) becomes the leader, and the leader’s side become the declarers. In subsequent hands the leader is the same player as the starter. In either case the leader picks up the last six cards and adds them to his hand. Apart from any of these cards which may already have been exposed in order to choose trumps, the cards picked up are not shown to the other players. The leader then discards any six of his eighteen cards face down.</p>

	        <h3>The Play</h3>
	        <p>During the play, Jokers and cards of the trump rank all count as belonging to the trump suit, not to the suits marked on them. </p>

	        <p>Play is in counter-clockwise rotation. In the first round, the first person to play their cards is the starter; in each subsequent round, the first person to play is the winner of the previous round. Each of the other three players in turn must play a card in the same suit as the person who started, unless they have run out of cards of the suit, then they may play any cards in their hand. If playing the trump suit, among trumps of equal rank, the one which is played earliest beats the others. When playing different suits, the trump suit will beat the other suits. If everyone plays different non-trump suits, then the highest card in the suit the first person played wins.</p>

	        <p>The goal of the game is to win rounds containing points, that is kings, tens and fives. Whenever the Opponents win a round containing any point cards, they accumulate the amount of points in the cards. When the Declarers win a round, they do not accumulate points but prevent the Opponents from winning points.</p>

	        <h3>Scoring</h3>
	        <p>The result of the game depends on the number of card points won by the Opponents. This determines which side scores how many points, and who will be the Declarers for the next hand.</p>
	        <p>If the Opponents win the last round of the game, any point cards in the discard pile get added to the Opponents' points. Moreover, the value of each point card in the discard pile is doubled.</p>
	        <table>
		        <tr>
		        	<th>Points</th>
		        	<th>Score</th>
		        	<th>Declarers for next hand</th>
		        	<th>Starter for next hand</th>
		        </tr>
		        <tr>
		        	<td>0</td>
		        	<td>Declarers score 2</td>
		        	<td>No change</td>
		        	<td>Previous starter's partner</td>
		        </tr>
		        <tr>
		        	<td>5 to 35</td>
		        	<td>Declarers score 1</td>
		        	<td>No change</td>
		        	<td>Previous starter's partner</td>
		        </tr>
		        <tr>
		        	<td>40 to 75</td>
		        	<td>Opponents score 1</td>
		        	<td>Opponents become new declarers</td>
		        	<td>Player to previous starter's right</td>
		        </tr>
		        <tr>
		        	<td>80 to 95</td>
		        	<td>Opponents score 2</td> 
		        	<td>Opponents become new declarers</td>
		        	<td>Player to previous starter's right</td>
		        </tr>
		        <tr>
		        	<td>100 or more</td> 
		        	<td>Opponents score 3</td>
		        	<td>Opponents become new declarers</td>
		        	<td>Player to previous starter's right</td>
		        </tr>
	        </table>
    	</div>
	);
}

export {GameStart, Instructions};