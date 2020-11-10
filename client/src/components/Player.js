import React, { useState, useEffect, useRef } from 'react';
import CardInactive from './CardInactive';

function Player(props) {
	const [cards, setCards] = useState([]);
	const [username, setUsername] = useState('');
	const [socket, setSocket] = useState(props.socket);
	const [winner, setWinner] = useState(false);
	const playerId = useRef(-1);

	//console.log(cards);

	useEffect(() => {
		playerId.current =  (props.id - 1 + props.main) % 4;
		socket.on('hand played', function(data) {
			if(data.id === playerId.current) {
				setCards(data.cards);
				setUsername(data.username);
			}
		});
		socket.on('win round', function(win) {
			if(win === playerId.current) {
				setWinner(true);
			}
		});
		socket.on('new round', function() {
			setCards(cards => []);
			setWinner(false);
		});
	}, []);

	//console.log(details);

    return (
        <div className={"player-" + props.id}>
            <h2>{username}</h2>
            <div id={"player-" +props.id+"-cards"}>
                {cards.map(c => <CardInactive cd={c} key={c.index} win={winner}/>)}
            </div>
        </div>
    );
}

// const Player = React.memo(props => {
//   	console.log("Greeting Comp render");
//   	return <h1>Hi {props.name}!</h1>;
// });

export default Player;