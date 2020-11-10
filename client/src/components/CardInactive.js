import React from 'react';

function CardInactive(props) {
    return (
        <div className={"card-container" + (props.win ? " winning" : "")}>
            <p className={"card-number" + (props.cd.value < 100 ? '' : ' joker') + (props.cd.value === 101 ? ' red' : '')}>{props.cd.display}</p>
            {props.cd.value < 100 ? <img className="card-suit" src={process.env.PUBLIC_URL + props.cd.img} /> : ''}
        </div>
    );
}

export default CardInactive;