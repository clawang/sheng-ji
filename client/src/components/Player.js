import react from 'react';
import Card from './Card';

function Player(props) {
    return (
        <div className={"player-" + props.id}>
            <h2>{props.name}</h2>
            <div id={"player-" +props.id+"-cards"}>
                {props.cards.map(c=> <Card cd={c} checkbox={false} />)}
            </div>
        </div>
    );
}

export default Player;