import React, { useState, useEffect, useRef } from 'react';
import CardInactive from './CardInactive';

function Player(props) {
	const [cards, setCards] = useState([]);
	const [username, setUsername] = useState('');
	const [socket, setSocket] = useState(props.socket);
	const [winner, setWinner] = useState(false);
	const playerId = useRef(-1);
	const thisBox = useRef(null);

	useEffect(() => {
		if(props.main < 0) {
			playerId.current = props.id - 1;
		} else {
			playerId.current =  (props.id - 1 + props.main) % 4;
		}
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
		socket.on('end game', function() {
			setCards(cards => []);
			setWinner(false);
			setUsername('');
		});
	}, []);

    return (
        <div className={"player-" + props.id} ref={thisBox}>
            <h2>{username}</h2>
            <div id={"player-" +props.id+"-cards"}>
                {cards.map((c, i) => <CardInactive cd={c} key={String(c.index).concat(":" + i)} index={i} win={winner} id={props.id} width={thisBox ? thisBox.current.clientWidth : 150} total={cards.length}/>)}
            </div>
        </div>
    );
}

export default Player;