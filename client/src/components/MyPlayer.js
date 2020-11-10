import React, { useState, useEffect, useReducer, useRef } from 'react';
import Card from './Card';
import CardInactive from './CardInactive';
import {getCard} from '../createDeck';
import {TweenMax} from 'gsap';
import {useReducerWithPromise} from './useStateWithPromise';

function MyPlayer(props) {
    const [cards, setCards] = useReducerWithPromise(reducer, []);
    const [socket, setSocket] = useState(props.socket);
    const [playCards, setPlayCards] = useState([]);
    const [winner, setWinner] = useState(false);
    const playDetails = useRef({
        currentSuit: '',
        switching: false,
        playerId: -1,
        turn: false,
        plays: 0
    });
    const element = useRef(null);
    const playHand = useRef(null);

    //console.log(playCards);
    //console.log(playDetails);

    useEffect(() => {
    	socket.on('my hand', function(data) {
	        playDetails.current = {...playDetails.current, playerId: data.playerId};
	        let temp = [];
	    	let positions = calculateCardPosition(data.hand.length);
	    	data.hand.forEach((cd, i) => {
				temp.push({obj: cd, dom: {}, position: positions[i], checked: false});
			});
	    	setCards({type: 'replace', items: temp});
		          //console.log(myDetails.playerId);
      	});
        socket.on('swap cards', function(data) {
        	playDetails.current = {...playDetails.current, switching: true, turn: true, playerId: data};
        	props.sendMessage("Select 6 cards to discard.");
        });
        socket.on('next turn', function(data) {
        	if(data.turn === playDetails.current.playerId) {
        		playDetails.current = {...playDetails.current, turn: true, currentSuit: data.suit, plays: data.plays};
        		props.sendMessage("It's your turn!");
        	} else {
        		props.sendMessage("It's " + data.usrnm + "'s turn!");
        	}
        })
        socket.on('win round', function(win) {
        	if(win === playDetails.current.playerId) {
				setWinner(true);
			}
        });
        socket.on('new round', function(started) {
        	console.log(started);
        	if(started !== playDetails.current.playerId) {
        		setPlayCards(playCards => []);
        		setWinner(false);
        	}
        });
    }, []);

    useEffect(() => {
    	if(cards.length > 0) {
    		repositionCards();
    	}
    }, [cards.join(",")]);

    const calculateCardPosition = () => {
    	if(element.current) {
    		let n = cards.length;
	    	let width = n * 40 + 40;
	    	let total = element.current.clientWidth;
	    	let start = (total - width) / 2;
	    	let positions = [];
	    	for(let i = 0; i < n; i++) {
	    		positions.push(start + 40*i);
	    	}
	    	return positions;
	    	//console.log(cardPosition);
	    }
    }

    const checkCard = (i) => {
    	let temp = cards[i];
    	temp.checked = !temp.checked;
    	setCards({type: 'update', index: i, item: temp});
    }

    const getRef = (ref, i) => {
    	let temp = cards[i];
    	temp.dom = ref;
    	setCards({type: 'update', index: i, item: temp});
    }

    const confirmPlay = (evt) => {
        evt.preventDefault();
        let result = cards.filter(cd => cd.checked);
        result = result.map(cd => cd.obj);
        if(!playDetails.current.switching) {
            if(result.length > 1) {
                props.sendMessage("You can only play one card!");
            } else if(result.length < 1) {
                props.sendMessage("You didn't select a card!");
            } else {
                const suit = result[0].adjSuit;
                if(suit === playDetails.current.currentSuit || cards.findIndex(cd => cd.obj.adjSuit === playDetails.current.currentSuit) < 0) { //can only play card if it follows rules
                    setPlayCards(playCards => []);
        			setWinner(false);
                    let c = cards.findIndex(cd => cd.obj.index === result[0].index);
                    let card = animateCard(c);
                    setTimeout(function(){ 
                    	setCards({type: 'remove', index: c})
                		setPlayCards(playCards => playCards.concat(card));
                		playDetails.current = {...playDetails.current, turn: false};
                		socket.emit('submit hand', {cards: result.map(cd => cd.index), id: playDetails.current.playerId});
                    }, 1000);
                } else {
                    props.sendMessage("You can't play that card!");
                }
            }
        } else {
            if(result.length > 6) {
                props.sendMessage("You can only pick 6 cards!");
            } else if(result.length < 6) {
                props.sendMessage("You didn't select 6 cards!");
            } else {
                props.sendMessage("");
                let indices = [];
                result.forEach(r => {
                	let c = cards.findIndex(cd => cd.obj.index === r.index);
                	animateCard(c);
                	indices.push(c);
                })
                setTimeout(function(){ 
                	setCards({type: 'filter', indices: indices});
                }, 1000);
                socket.emit('submit swap cards', {cards: result.map(cd => cd.index), id: playDetails.current.playerId});
                playDetails.current = {...playDetails.current, switching: false};
            }
        }
    }

    const animateCard = (c) => {
        let obj = cards[c];
        obj.checked = false;
        setCards({type: 'update', index: c, item: obj});
        let xPos = element.current.clientWidth/2 - 31- cards[c].position;
        let yPos = (playHand.current.clientHeight + 30) * -1;
        let card = cards[c].obj;
        TweenMax.to(obj.dom.current, 1, {x: xPos, y: yPos, width: '60px', height: '80px', borderRadius: '5px'});
        return card;
    }

    //onsole.log(cards);

    const repositionCards = () => {
    	let positions = calculateCardPosition(cards);
    	if(!arraysEqual(positions, cards)) {
	    	cards.forEach((cd, i) => {
	    		let xOff = positions[i] - cd.position;
	    		let temp = cd;
	    		temp.position = positions[i];
	    		setCards({type: 'update', index: i, item: temp});
	    	});
	    }
    }

    return (
        <div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
            <div className="play" ref={playHand}>
                <div className="play-hand">
	                <h2>My last play</h2>
	                <div className="play-hand-cards">
	                	{playCards.map(c => <CardInactive cd={c} key={c.index} win={winner}/>)}
	                </div>
                </div>
            </div>
            <div className="my-player">
                <div className="hand">
                <form id="hand-form" action="">
                    <div className="hand-cards" ref={element}>
                        {cards.map((c, i) => <Card cd={c.obj} checked={c.checked} key={c.obj.index} left={c.position} getRef={(ref) => getRef(ref, i)} handleChange={() => checkCard(i)} />)}
                    </div>
                    <button id="hand-submit" disabled={!playDetails.current.turn} onClick={confirmPlay}>Confirm Play</button>
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
        case 'replace':
        	return action.items;
    	case 'update':
    		return [
                ...state.slice(0, action.index),
                action.item,
                ...state.slice(action.index + 1)
            ];
        case 'filter':
        	return state.filter((ele, i) => !action.indices.includes(i));
        case 'clear':
        	return [];
        // default:
        //     throw new Error();
    }
}

function arraysEqual(arr, cards) {
  	for(let i = 0; i < cards.length; i++) {
  		if(arr[i] !== cards.position) {
  			return false;
  		}
  	}
  	return true;
}

export default MyPlayer;