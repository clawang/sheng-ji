import React, { useState, useEffect } from 'react';
import './styles/main.scss';
import {createDeck} from './createDeck';
import Card from './components/Card';
import Chat from './Chat';
import GameSpace from './GameSpace';
import StartPage from './StartPage';
import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:8888/';
const socket = socketIOClient(ENDPOINT);

function App() {

  const [deck, setDeck] = useState([]);
  const [login, setLogin] = useState({
    username: '',
    loggedIn: false
  });

  const initialize = () => {
    return createDeck();
  }

  useEffect(() => {
    setDeck(initialize());
  }, [setDeck]);

  const changeUsername = (evt) => {
    setLogin({username: evt.target.value, loggedIn: login.loggedIn});
  }

  const loginSubmit = (evt) => {
    evt.preventDefault();
    setLogin({username: login.username, loggedIn: true});
    console.log(login.username);
    socket.emit('add user', login.username);
  }

  return (
    <div className="App">
      {login.loggedIn ? '' : <StartPage username={login.username} handleChange={changeUsername} handleClick={loginSubmit} />}
      <div id="chat-page">
        <div className="sidebar">
          <div className="legend">
            <div>
              <h2>Trump Suit</h2>
              <p id="trump-suit"></p>
            </div>
            <div>
              <h2>Trump Rank</h2>
              <p id="trump-rank">2</p>
            </div>
            <div>
              <h2>Points</h2>
              <p id="points">0</p>
            </div>
            <div>
              <h2>Game<br/>History</h2>
              <p><a id="game-history" href="#">View</a></p>
            </div>
          </div>
          <div id="my-player-stats">
              <h3 id="my-username">{login.username}</h3>
              <p>My Score: <span id="my-score"></span></p>
              <p><a href="#" id="help-link" style={{'font-size':'10px'}}>Help</a></p>
            </div>
          </div>
        {deck.length > 0 ? <GameSpace deck={deck} socket={socket} /> : '' }
        <Chat socket={socket} username={login.username} />
      </div>
    </div>
  );
}

export default App;
