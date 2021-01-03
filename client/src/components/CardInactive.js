import React, { useState, useEffect, useRef } from 'react';
import {TweenMax} from 'gsap';

function CardInactive(props) {

	const thisCard = useRef(null);

	useEffect(() => {
		animateCard();
	}, [props.left]);

	const animateCard = () => {
		let width = props.width;
		let offset = (width - (props.total * 20 - 20)) / 2;
		if(props.id === '2') {
			TweenMax.fromTo(thisCard.current, 0.5, {opacity: 0, left: width - 30}, {opacity: 1, left: offset + props.index * 20});
		} else if(props.id === '3') {
			TweenMax.fromTo(thisCard.current, 0.5, {opacity: 0, top: -107}, {opacity: 1, top: 30, left: offset + props.index * 20});
		} else if(props.id === '4') {
			TweenMax.fromTo(thisCard.current, 0.5, {opacity: 0, left: 0}, {opacity: 1, left: offset + props.index * 20});
		} 
	}

    return (
        <div className={"card-container" + (props.win ? " winning" : "")} ref={thisCard} style={props.left ? {left: props.left + 'px'} : {}}>
            <p className={"card-number" + (props.cd.value < 80 ? '' : ' joker') + (props.cd.value === 81 ? ' red' : '')}>{props.cd.display}</p>
            {props.cd.value < 80 ? <img className="card-suit" src={process.env.PUBLIC_URL + props.cd.img} /> : ''}
        </div>
    );
}

export default CardInactive;