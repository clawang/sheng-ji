import React, { useState, useEffect, useReducer } from 'react';
import Card from './Card';
import {getCard} from '../createDeck';

function MyPlayer(props) {
    const [playDetails, setPlay] = useState({
        currentSuit: 'spades',
        switching: false
    });
    const [cards, setCards] = useState(props.cards);
    const [socket, setSocket] = useState(props.socket);
    const [checkedCards, setChecked] = useReducer(reducer, []);

    useEffect(() => {
        socket.on('my hand', function(obj) {
            //do stuff
        });
    }, []);

    const checkCard = (val) => {
        let i = checkedCards.findIndex(cd => cd === val);
        if(i < 0) {
            setChecked({type: 'add', item: val});
        } else {
            setChecked({type: 'remove', index: i});
        }
    }

    const confirmPlay = (evt) => {
        evt.preventDefault();
        const result = [];
        for(let i = 0; i < checkedCards.length; i++) {
            result[i] = getCard(checkedCards[i]);
        }
        if(!playDetails.switching) {
            if(result.length > 1) {
                props.sendMessage("You can only play one card!");
            } else if(result.length < 1) {
                props.sendMessage("You didn't select a card!");
            } else {
                const suit = result[0].suit;
                if(suit === playDetails.currentSuit || cards.findIndex(cd => cd.suit === playDetails.currentSuit) < 0) { //can only play card if it follows rules
                    console.log('play is valid');
                    // $('#hand-submit').prop('disabled', true);
                    // $('.hand-cards > label').css('cursor', 'not-allowed');
                    // clearMsg();
                   // socket.emit('submit hand', {cards: result, id: playerId});
                } else {
                    props.sendMessage("You can't play that card!");
                }
            }
        } 
        //else {
        //     if(result.length > 6) {
        //         printMsg("You can only pick 6 cards!", "", "red");
        //     } else if(result.length < 6) {
        //         printMsg("You didn't select 6 cards!", "", "red");
        //     } else {
        //         clearMsg();
        //         socket.emit('submit swap cards', {cards: result, id: playerId});
        //         switching = false;
        //     }
        // }
        //check valid input
    }

    return (
        <div style={{width: '100%'}}>
            <div className="play">
                <div className="play-hand">
                <h2>My last play</h2>
                <div class="play-hand-cards"></div>
                </div>
            </div>
            <div className="space-1"></div>
            <div className="my-player">
                <div className="hand">
                <form id="hand-form" action="">
                    <div className="hand-cards">
                        {cards.map((c, i) => <Card cd={c} checkbox={true} handleChange={checkCard} key={i} />)}
                    </div>
                    <button id="hand-submit" onClick={confirmPlay}>Confirm Play</button>
                </form>
                </div>
            </div>
        </div>
    );
}

function reducer(state, action) {
    switch (action.type) {
        case 'add':
            return [...state, action.item];
        case 'remove':
            return [
                ...state.slice(0, action.index),
                ...state.slice(action.index + 1)
            ];
        default:
            throw new Error();
    }
}

export default MyPlayer;