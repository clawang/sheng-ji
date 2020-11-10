import React, { useState, useEffect, useRef } from 'react';
import Player from './components/Player';
import MyPlayer from './components/MyPlayer';

function GameSpace(props) {
  const [started, setStarted] = useState(false);
  const [socket, setSocket] = useState(props.socket);
  const [message, setMessage] = useState('');
  const [settingsVisible, setSettings] = useState(true);
  const playerId = useRef(-1);
  //let playerId;

  useEffect(() => {
      socket.on('set playerId', function(id) {
        playerId.current = id;
      });
      socket.on('remove settings', function() {
          setSettings(false);
      });
  }, []);

  //console.log(myDetails);

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

  // let player2 = [3, 45];
  // let player3 = [22, 23];
  // let player4 = [33, 12]; 
  // let player = [13, 14, 15, 16, 17, 18, 1, 24, 25, 26, 34, 8, 20, 5, 9, 38, 40, 29];

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
      {playerId.current < 0 ? '' : <Player id="3" socket={socket} main={playerId.current} />}
      {playerId.current < 0 ? '' : <Player id="4" socket={socket} main={playerId.current} />}
      <div className="center">
        {started ?
          <button id="view-plays" disabled>View Past Plays</button>
          :
          <div>
          {settingsVisible ?
            <form id="edit-settings">
              <label>Trump Rank<br/>
                <input id="setTrumpValue" name="setTrumpValue" autoComplete="off" defaultValue="2" min="2" max="14" type="number"/><br/>
              </label>
              <label>Trump Suit<br/><div className="select">
                <select id="setTrumpSuit" name="setTrumpSuit">
                  <option value="spades">spades</option>
                  <option value="hearts">hearts</option>
                  <option value="clubs">clubs</option>
                  <option value="diamonds">diamonds</option>
                  <option value="random" defaultValue>random</option>
                </select>
                </div>
              </label>
            </form>
            :
            ''
          }
            <button id="start-game" onClick={startGame}>Start Game</button>
          </div>
      }
      </div>
      {playerId.current < 0 ? '' : <Player id="2" socket={socket} main={playerId.current}/>}
      <MyPlayer socket={socket} playerId={playerId.current} sendMessage={setMessage} />
    </div>
  );
}

export default GameSpace;