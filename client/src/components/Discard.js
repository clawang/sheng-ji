import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import CardInactive from './CardInactive';

function Discard(props) {

    const [socket, setSocket] = useState(props.socket);
    const [cards, setCards] = useState([]);
    const [points, setPoints] = useState(0);
    const [adding, setAdding] = useState(false);
 
    useEffect(() => {
        socket.on('reveal discard', function(data) {
            setCards(data.discard);
            setPoints(data.addPoints);
            setAdding(data.adding);
        });
    });
    //console.log(cards);

    return (
        <div id="discard" style={props.visible ? {display: 'block'} : {display: 'none'}}>
            <h2>Discard Pile</h2>
            <div id="discard-cards">{cards.map(cd => <CardInactive cd={cd} key={cd.index} win={adding ? (cd.points > 0) : false}/>)}</div>
            <p id="discard-points">{adding ? 'The opponents gained ' + points + ' points.' : ''}</p>
        </div>
    );
}

export default Discard;