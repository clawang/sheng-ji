import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import CardInactive from './CardInactive';

function Discard(props) {

    const [socket, setSocket] = useState(props.socket);
    const [cards, setCards] = useState([]);
    const [message, setMessage] = useState('');
    const [winner, setWinner] = useState([]);
    const [adding, setAdding] = useState(false);
 
    useEffect(() => {
        socket.on('flip discard', function(data) {
            setCards(data.cards);
            let temp = [];
            for(let i = 0; i < data.cards.length; i++) {
                if(i === data.max) {temp.push(true)}
                else {temp.push(false)}
            }
            setWinner(temp);
            setMessage('The trump suit is set to ' + data.suit);
        });
        socket.on('reveal discard', function(data) {
            setCards(data.discard);
            let temp = [];
            data.discard.forEach(d => {
                if(d.points > 0) {temp.push(true)}
                else {temp.push(false)}
            });
            setWinner(temp);
            setAdding(data.adding);
            if(data.adding) {
                setMessage('The opponents gained ' + data.addPoints + ' points.');
            } else {
                setMessage('');
            }
        });
    });
    //console.log(cards);

    return (
        <div id="discard-wrapper" style={props.visible ? {display: 'flex'} : {display: 'none'}}>
            <div id="discard">
                <h2>Discard Pile</h2>
                <div id="discard-cards">
                    {cards.map((cd, i) => {
                        return (
                            <div className="card-inactive-wrapper">
                                <CardInactive cd={cd} key={cd.index} win={winner[i]}/>
                            </div>
                        );
                    })}
                </div>
                <p id="discard-points">{message}</p>
            </div>
        </div>
    );
}

export default Discard;