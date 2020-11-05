import React, { useState, useEffect } from 'react';
import Player from './components/Player';
import MyPlayer from './components/MyPlayer';

function GameSpace(props) {

  const [started, setStarted] = useState(false);
  const [socket, setSocket] = useState(props.socket);
  const [message, setMessage] = useState('');

  const startGame = (evt) => {
    evt.preventDefault();
    // if(parseInt($('#setTrumpValue').val()) > 14 || parseInt($('#setTrumpValue').val()) < 2) {
    //   printMsg("The trump rank must be between 2 and 14.", "", "red");
    //} else {
      setMessage('Waiting...');
      setStarted(true);
      socket.emit('start game', {});
    //}
  }

  let player2 = [3, 45];
  let player3 = [22, 23];
  let player4 = [33, 12]; 
  let player = [13, 14, 15, 16, 17, 18, 1];

  return (
    <div className="game-space">
      <div id="discard">
        <h2>Discard Pile</h2>
        <div id="discard-cards"></div>
        <p id="discard-points"></p>
      </div>
      <div id="overlay"></div>
      <div id="header">
        <p id="center-msg">{message}</p>
      </div>
      <div className="space-1"></div>
      <Player id="3" cards={[props.deck[player3[0]], props.deck[player3[1]]]} />
      <div className="space-1"></div>
      <Player id="4" cards={[props.deck[player4[0]], props.deck[player4[1]]]}/>
      <div className="center">
        {started ?
          <button id="view-plays" disabled>View Past Plays</button>
          :
          <div>
            <form id="edit-settings">
              <label>Trump Rank<br/>
                <input id="setTrumpValue" name="setTrumpValue" autocomplete="off" value="2" min="2" max="14" type="number"/><br/>
              </label>
              <label>Trump Suit<br/><div class="select">
                <select id="setTrumpSuit" name="setTrumpSuit">
                  <option value="spades">spades</option>
                  <option value="hearts">hearts</option>
                  <option value="clubs">clubs</option>
                  <option value="diamonds">diamonds</option>
                  <option value="random" selected>random</option>
                </select>
                </div>
              </label>
            </form>
            <button id="start-game" onClick={startGame}>Start Game</button>
          </div>
      }
      </div>
      <Player id="2" cards={[props.deck[player2[0]], props.deck[player2[1]]]}  />
      <div className="space-1"></div>
     <MyPlayer socket={socket} cards={player.map(p => props.deck[p])} sendMessage={setMessage} />
    </div>
  );
}

export default GameSpace;