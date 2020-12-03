import React, { useState, useEffect, useReducer, useRef } from 'react';
import Card from './Card';
import CardInactive from './CardInactive';
import {getCard} from '../createDeck';
import {TweenMax} from 'gsap';
import {sortFunction} from '../createDeck';
import {useReducerWithPromise} from './useStateWithPromise';

function MyPlayer(props) {
    const [socket, setSocket] = useState(props.socket);
    const [cards, setCards] = useReducerWithPromise(reducer, []);
    const [playCards, setPlayCards] = useState([]);
    const [cardHistory, setCardHistory] = useReducer(reducer, []);
    const [historyVisible, setHistory] = useState(false);
    const [mouseOver, setMouse] = useState(false);
    const [winner, setWinner] = useState(false);
    const [trumpSuit, setTrump] = useState(null);
    const playDetails = useRef({
        currentSuit: '',
        state: 0, //0 is normal play, 1 is dealing, 2 is switching
        playerId: -1,
        turn: false,
        plays: 0,
        rank: null
    });
    //const hand = useRef([]);
    const hand = useRef([]);
    const element = useRef(null);
    const playHand = useRef(null);
    const prevPlay = useRef(null);

    useEffect(() => {
    	socket.on('my hand', function(data) {
            console.log(data.hand);
	        playDetails.current = {...playDetails.current, playerId: data.playerId, rank: data.rank, turn: true};
	        let temp = [];
	    	let positions = calculateCardPosition(0);
	    	data.hand.forEach((cd, i) => {
				temp.push({obj: cd, dom: {}, position: positions[i], checked: false});
			});
            if(data.dealing) {
                playDetails.current = {...playDetails.current, state: 1, turn: true};
                props.sendMessage({body: "Play a card with the trump rank to set the trump suit."});
                hand.current = temp;
                displayCards(temp, 0);
            } else {
                setCards({type: 'replace', items: temp});
            }
            if(data.prevPlayed) {
                data.prevPlayed.forEach(prev => {
                    setCardHistory({type: 'add', item: {obj: prev, left: prevPlay.current.clientWidth / 2}});
                });
            }
      	});
        socket.on('trump set', function(data) {
            playDetails.current = {...playDetails.current, turn: false};
            if(data.username.length > 0) {
                props.sendMessage({body: data.username + ' set the trump suit to ' + data.suit});
            } else {
                props.sendMessage({body: 'The trump suit was set to ' + data.suit});
            }
        });
        socket.on('sort cards', function(data) {
            playDetails.current = {...playDetails.current, state: 0};
            setTrump(data.suit);
        });
        socket.on('next turn', function(data) {
        	if(data.turn === playDetails.current.playerId) {
        		playDetails.current = {...playDetails.current, turn: true, currentSuit: data.suit, plays: data.plays};
        	} 
        })
        socket.on('win round', function(win) {
        	if(win === playDetails.current.playerId) {
				setWinner(true);
			}
        });
        socket.on('new round', function(started) {
        	if(started !== playDetails.current.playerId) {
                //setCardHistory(cardHistory => cardHistory.concat(playCards));
        		setPlayCards(playCards => []);
        		setWinner(false);
        	}
        });
        socket.on('end game', function() {
            setCardHistory({type: 'clear'});
            setPlayCards([]);
            setCards({type: 'clear'});
        });

        // return () => {
        //     socket.removeAllListeners();
        // }
    }, []);

    console.log(cards);

    useEffect(() => {
        //console.log(cards);
    	if(cards.length > 0) {
    		repositionCards();
    	} 
        if(cards.length < 12 && hand.current.length > 0 && playDetails.current.state === 1) {
            console.log(cards);
            displayCards(hand.current, cards.length);
        }
        if(cards.length >= 12 && playDetails.current.state === 1) {
            socket.emit('finished deal');
        }
        if(cards.length > 12 && playDetails.current.state === 2) {
            props.sendMessage({body: "Select 6 cards to discard.", color: 'green'});
        }
        socket.on('swap cards', function(data) {
            playDetails.current = {...playDetails.current, state: 2, turn: true, playerId: data.id};
            let temp = [];
            data.newCards.forEach(c => {
                temp.push({obj: c, dom: {}, checked: false});
            });
            setCards({type: 'concat', items: temp});
            setTrump(data.suit);
        });

        return () => {
            socket.off('swap cards');
        }
    }, [cards.join(",")]);

    useEffect(() => {
        sortCards(trumpSuit);
    }, [trumpSuit]);

    const calculateCardPosition = (index) => {
        let positions = [];
        let start = 0;
        if(index === 0) {
    		let n = cards.length;
            let total = element.current ? element.current.clientWidth : 681;
            let tempInt = (total - 80)/(n-1);
            let interval = Math.min(tempInt, 80);
            if (total > n * 80) {
                start = (total - n * 80) / 2;
            }
            for(let i = 0; i < n; i++) {
                positions.push(start + interval*i);
            }
        } else {
            let n = cardHistory.length;
            let total = prevPlay.current ? prevPlay.current.clientWidth : 60;
            let tempInt = (total - 60)/(n-1);
            let interval = Math.min(tempInt, 70);
            if (total > n * 70) {
                start = (total - n * 70) / 2;
            }
            for(let i = 0; i < n; i++) {
                positions.push(start + interval*i + 35);
            }
        }
        
        return positions;
    }

    const checkCard = (i) => {
    	let temp = cards[i];
    	temp.checked = !temp.checked;
    	setCards({type: 'update', index: i, item: temp});
    }

    const getRef = (ref, i, type) => {
        if(type === 'active') {
            let temp = cards[i];
            temp.dom = ref;
    	    setCards({type: 'update', index: i, item: temp});
        } else {
            let temp = cardHistory[i];
            temp.dom = ref;
            setCardHistory({type: 'update', index: i, item: temp});
        }
    }

    const handleMouseEnter = (evt) => {
        if(!historyVisible) {
            setMouse(true);
        }
    }

    const handleMouseLeave = (evt) => {
        setMouse(false);
    }

    const confirmPlay = (evt) => {
        evt.preventDefault();
        let checked = cards.filter(cd => cd.checked);
        let result = checked.map(cd => cd.obj);
        if(playDetails.current.state === 2) {
            if(result.length > 6) {
                props.sendMessage({body: "You can only pick 6 cards!", color: 'red'});
            } else if(result.length < 6) {
                props.sendMessage({body: "You didn't select 6 cards!", color: 'red'});
            } else {
                props.sendMessage({body: "", color: ''});
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
                playDetails.current = {...playDetails.current, state: 0};
            }
        } else if(playDetails.current.state === 1) {
            if(result.length > 1) {
                props.sendMessage({body: "You can only choose one card!", color: 'red'});
            } else if(result.length < 1) {
                props.sendMessage({body: "You didn't choose a card!", color: 'red'});
            } else {
                const suit = result[0].suit;
                if(result[0].value === playDetails.current.rank) {
                    socket.emit('set suit', suit);
                    checked[0].checked = false;
                } else {
                    props.sendMessage({body: "That card isn't of the trump rank!", color: 'red'});
                }
            }
        } else if(playDetails.current.turn) {
            if(result.length > 1) {
                props.sendMessage({body: "You can only play one card!", color: 'red'});
            } else if(result.length < 1) {
                props.sendMessage({body: "You didn't select a card!", color: 'red'});
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
                        setCardHistory({type: 'add', item: {obj: card, left: prevPlay.current.clientWidth / 2}});
                		playDetails.current = {...playDetails.current, turn: false};
                		socket.emit('submit hand', {cards: result.map(cd => cd.index), id: playDetails.current.playerId});
                    }, 1000);
                } else {
                    props.sendMessage({body: "You can't play that card!", subtitle: 'You need to play ' + playDetails.current.currentSuit + '.', color: 'red'});
                }
            }
        }
    }
    
    const animateCard = (c) => {
        let obj = cards[c];
        obj.checked = false;
        setCards({type: 'update', index: c, item: obj});
        let xPos = element.current.clientWidth/2 - 31- cards[c].position;
        let yPos = (playHand.current.clientHeight + 13) * -1;
        let card = cards[c].obj;
        TweenMax.to(obj.dom.current, 1, {x: xPos, y: yPos, width: '60px', height: '80px', borderRadius: '5px'});
        return card;
    }

    const repositionCards = () => {
        console.log('repositioning');
    	let positions = calculateCardPosition(0);
        let temp = [...cards];
    	temp.forEach((cd, i) => {
    		cd.position = positions[i];
    	});
        setCards({type: 'replace', items: temp});
    }

    const revealHistory = (evt) => {
        if(!historyVisible) {
            setHistory(true);
            setMouse(false);
            setTimeout(function() {
                let positions = calculateCardPosition(1);
                cardHistory.forEach((cd, i) => {
                    let temp = cd;
                    temp.left = positions[i];
                    setCardHistory({type: 'update', index: i, item: temp});
                });
            }, 10);
        } else {
            cardHistory.forEach((cd, i) => {
                let temp = cd;
                temp.left = prevPlay.current.clientWidth / 2;
                setCardHistory({type: 'update', index: i, item: temp});
                //console.log(cardHistory);
            });
            setTimeout(function() {
                setHistory(false);
            }, 300);
        }
        //console.log(cardHistory);
    }

    const displayCards = (hand, index) => {
        setTimeout(function(){
            console.log('adding ' + index);
            setCards({type: 'add', item: hand[index]});
        }, 1000);
    }

    const skipSubmit = (evt) => {
        evt.preventDefault();
        socket.emit('set suit', '');
        playDetails.current = {...playDetails.current, turn: false};
    }

    const sortCards = (suit) => {
        console.log('sorting cards');
        let positions = calculateCardPosition(0);
        adjustValues(playDetails.current.rank, suit, positions);
        let temp = [...cards].sort(sortFunction);
        temp.forEach((t, ind) => {
            t.position = positions[ind];
        });
        setCards({type: 'replace', items: temp});
    }

    console.log(playDetails);

    const adjustValues = (trumpValue, trumpSuit, positions) => {
      for(let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if(card.obj.value === trumpValue && card.obj.suit === trumpSuit) {
          card.obj.adjSuit = 'trump';
          card.obj.adjustedValue = card.obj.value + 80;
        } else if(card.obj.value === trumpValue) {
          card.obj.adjSuit = 'trump';
          card.obj.adjustedValue = card.obj.value + 70;
        } else if(card.obj.suit === trumpSuit) {
          card.obj.adjSuit = 'trump';
          card.obj.adjustedValue = card.obj.value + 50;
        } else {
          card.obj.adjSuit = card.obj.suit;
          card.obj.adjustedValue = card.obj.value;
        }
        setCards({type: 'update', index: i, item: card});
      } 
    }

    return (
        <div style={{width: '100%', display: 'flex', flexWrap: 'wrap'}}>
            <div className="play" ref={playHand}>
                <div className="play-hand">
                    <p id="history-message" style={mouseOver && cardHistory.length > 1 ? {opacity: 1} : {opacity: 0}}>Click to see play history</p>
	                <div className="play-hand-cards" onClick={revealHistory} ref={prevPlay} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
	                	{historyVisible ? 
                            cardHistory.map((c, i) => <CardInactive cd={c.obj} key={c.obj.index + 100} win={false} id={1} left={c.left} />)
                            :
                            playCards.map(c => <CardInactive cd={c} key={c.index} win={winner} id={1} left={prevPlay.current.clientWidth / 2}/>)
                        }
	                </div>
                </div>
            </div>
            <div className="my-player">
                <div className="hand">
                    <form id="hand-form" action="">
                        <div className="hand-cards" ref={element}>
                            <div>
                                {cards.map((c, i) => <Card cd={c.obj} checked={c.checked} key={c.obj.index} left={c.position} getRef={(ref) => getRef(ref, i, 'active')} handleChange={() => checkCard(i)} />)}
                            </div>
                        </div>
                        <button id="hand-submit" disabled={!playDetails.current.turn && (playDetails.current.state === 0 || playDetails.current.state === 1)} onClick={confirmPlay}>Confirm Play</button>
                        {playDetails.current.state === 1 && playDetails.current.turn ? <button id="skip-submit" onClick={skipSubmit}>Skip</button> : ''}
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
        	return [...action.items];
    	case 'update':
    		return [
                ...state.slice(0, action.index),
                action.item,
                ...state.slice(action.index + 1)
            ];
        case 'filter':
        	return state.filter((ele, i) => !action.indices.includes(i));
        case 'concat':
            return [...state].concat(action.items);
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