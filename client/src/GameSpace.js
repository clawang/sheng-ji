import React, { useState, useEffect, useRef } from 'react';
import Player from './components/Player';
import MyPlayer from './components/MyPlayer';
import Discard from './components/Discard';

function GameSpace(props) {
  const [started, setStarted] = useState(false);
  const [socket, setSocket] = useState(props.socket);
  const [message, setMessage] = useState({
    body: '',
    color: ''
  });
  const [settingsVisible, setSettings] = useState(true);
  const [discardVisible, setDiscard] = useState(false);
  const playerId = useRef(-1);
  //let playerId;

  useEffect(() => {
      socket.on('set playerId', function(id) {
        playerId.current = id;
      });
      socket.on('remove settings', function() {
        setSettings(false);
      });
      socket.on('reveal discard', function() {
        console.log('discard is revealed');
        setDiscard(true);
        setTimeout(function() {
          setDiscard(false);
        }, 7000);
      });
  }, []);

  //console.log(myDetails);

  const startGame = (evt) => {
    evt.preventDefault();
    // if(parseInt($('#setTrumpValue').val()) > 14 || parseInt($('#setTrumpValue').val()) < 2) {
    //   printMsg("The trump rank must be between 2 and 14.", "", "red");
    //} else {
      setMessage({body: 'Waiting...', color: ''});
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
      <Discard socket={socket} visible={discardVisible} />
      <div id="overlay"></div>
      <div id="header">
        <p className={"center-msg " + message.color}>{message.body}</p>
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