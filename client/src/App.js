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
  const [gameDetails, setGame] = useState({
    trumpSuit: '',
    trumpRank: null,
    points: 0
  });

  console.log(gameDetails);

  const initialize = () => {
    return createDeck();
  }

  useEffect(() => {
    setDeck(initialize());
    socket.on('setup game', function(data) {
      setGame({trumpSuit: data.trumpSuit, trumpRank: data.trumpValue, points: data.points});
    });
    socket.on('update points', function(pts) {
      setGame(gameDetails => {return {...gameDetails, points: pts}});
    })
  }, [setDeck]);

  //console.log(gameDetails);

  const finishSetup = () => {
    setLogin({username: login.username, loggedIn: true});
  }

  const setUsername = (usr) => {
    setLogin({username: usr, loggedIn: login.loggedIn});
  }

  return (
    <div className="App">
      {login.loggedIn ? '' : <StartPage username={login.username} socket={socket} setUsername={setUsername} finished={finishSetup} />}
      <div id="chat-page">
        <div className="sidebar">
          <div className="legend">
            <div>
              <h2>Trump Suit</h2>
              <p id="trump-suit">{gameDetails.trumpSuit ? <img src={process.env.PUBLIC_URL + "/" + gameDetails.trumpSuit + ".png"} /> : ''} </p>
            </div>
            <div>
              <h2>Trump Rank</h2>
              <p id="trump-rank">{gameDetails.trumpRank ? gameDetails.trumpRank : ''}</p>
            </div>
            <div>
              <h2>Points</h2>
              <p id="points">{gameDetails.points}</p>
            </div>
            {/*<div>
              <h2>Game<br/>History</h2>
              <p><a id="game-history" href="#">View</a></p>
            </div>*/}
          </div>
          <div id="my-player-stats">
              <h3 id="my-username">{login.username}</h3>
              {/*<p>My Score: <span id="my-score"></span></p>*/}
              <p><a href="#" id="help-link" style={{fontSize:'10px'}}>Help</a></p>
            </div>
          </div>
        {deck.length > 0 ? <GameSpace deck={deck} socket={socket} /> : '' }
        <Chat socket={socket} username={login.username} />
      </div>
    </div>
  );
}

export default App;
