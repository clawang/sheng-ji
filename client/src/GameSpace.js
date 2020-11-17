import React, { useState, useEffect, useRef } from 'react';
import Player from './components/Player';
import MyPlayer from './components/MyPlayer';
import Discard from './components/Discard';

function GameSpace(props) {
  const [started, setStarted] = useState(false);
  const [socket, setSocket] = useState(props.socket);
  const [message, setMessage] = useState({
    body: '',
    subtitle: '',
    color: ''
  });
  const [settingsVisible, setSettingsVis] = useState(true);
  const [settings, setSettings] = useState({
    rank: 2,
    suit: null
  });
  const [discardVisible, setDiscard] = useState(false);
  const playerId = useRef(-1);
  //let playerId;

  useEffect(() => {
      socket.on('set playerId', function(id) {
        playerId.current = id;
      });
      socket.on('my hand', function(data) {
        setStarted(true);
      });
      socket.on('remove settings', function() {
        setSettingsVis(false);
      });
      socket.on('reveal discard', function() {
        setDiscard(true);
        setTimeout(function() {
          setDiscard(false);
        }, 7000);
      });
      socket.on('end game', function(data) {
        setMessage({body: data.msg, subtitle: data.subtitle, color: ''});
        setStarted(false);
        setSettingsVis(false);
      });
  }, []);

  // console.log(playerId);

  const startGame = (evt) => {
    evt.preventDefault();
    if(parseInt(settings.rank) > 14 || parseInt(settings.rank) < 2) {
      setMessage({body: "The trump rank must be between 2 and 14.", color: "red"});
    } else {
      setMessage({body: 'Waiting...', color: ''});
      setStarted(true);
      socket.emit('start game', {trumpValue: settings.rank, trumpSuit: settings.suit});
    }
  }

  const changeSuit = (evt) => {
    setSettings({...settings, suit: evt.target.value});
  }

  const changeRank = (evt) => {
    setSettings({...settings, rank: evt.target.value});
  }

  return (
    <div className="game-space">
      <Discard socket={socket} visible={discardVisible} />
      <div id="overlay"></div>
      <div id="header">
        <p className={"center-msg " + message.color}>{message.body}</p>
        <h4 className={message.color}>{message.subtitle}</h4>
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
                <input id="setTrumpValue" name="setTrumpValue" autoComplete="off" defaultValue="2" min="2" max="14" type="number" onChange={changeRank}/><br/>
              </label>
              <label>Trump Suit<br/><div className="select">
                <select id="setTrumpSuit" name="setTrumpSuit" onChange={changeSuit}>
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
            <button id="start-game" onClick={startGame}>{playerId.current < 0 ? 'Start Game' : 'Start Next Round'}</button>
          </div>
      }
      </div>
      {playerId.current < 0 ? '' : <Player id="2" socket={socket} main={playerId.current}/>}
      <MyPlayer socket={socket} playerId={playerId.current} sendMessage={setMessage} />
    </div>
  );
}

export default GameSpace;