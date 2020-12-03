import React, { useState, useEffect, useRef } from 'react';

function Card(props) {

	const thisCard = useRef(null);

	useEffect(() => {
		props.getRef(thisCard);
	}, [thisCard]);

    return (
        <label style={{left: props.left + 'px', zIndex: props.order}} ref={thisCard}>
            <input type="checkbox" name="card-picked" className="card-checkbox" value={props.cd.index} checked={props.checked} onChange={props.handleChange}/>
            <div className="card-container">
                <p className={"card-number" + (props.cd.value < 100 ? '' : ' joker') + (props.cd.value === 101 ? ' red' : '')}>{props.cd.display}</p>
                {props.cd.value < 100 ? <img className="card-suit" src={process.env.PUBLIC_URL + props.cd.img} /> : ''}
            </div>
        </label>
    );
}

export default Card;