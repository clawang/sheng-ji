import React, { useState, useEffect, useRef } from 'react';
import './styles/main.scss';
import Card from './components/Card';
import Chat from './Chat';
import GameSpace from './GameSpace';
import StartPage from './StartPage';
import {Instructions} from './components/GameStart';
import socketIOClient from 'socket.io-client';
import Div100vh from 'react-div-100vh';
const ENDPOINT = 'http://localhost:8888/';
const socket = socketIOClient(ENDPOINT);

function App() {

  const [popUp, setPopUp] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [help, setHelp] = useState(false);
  const [login, setLogin] = useState({
    username: '',
    loggedIn: false
  });
  const [gameDetails, setGame] = useState({
    trumpSuit: '',
    trumpRank: null,
    points: 0
  });
  const [portrait, setPortrait] = useState(false);
  const [chatOpen, setChat] = useState(false);
  const userType = useRef('');
  const code = useRef('');

  useEffect(() => {
    if(window.innerWidth < window.innerHeight) {
      setPortrait(true);
    }
    socket.on('setup game', function(data) {
      setGame({...gameDetails, trumpRank: data.trumpValue});
    });
    socket.on('trump set', function(data) {
      setGame({...gameDetails, trumpSuit: data.suit, trumpRank: data.rank});
    });
    socket.on('set trump', function(suit) {
      setGame({...gameDetails, trumpSuit: suit});
    });
    socket.on('update points', function(pts) {
      setGame(gameDetails => {return {...gameDetails, points: pts}});
    });
    socket.on('disconnected', function() {
      alert('You have disconnected from the server. Please refresh your page.');
    });
  }, []);

  const finishSetup = (usr) => {
    setLogin({username: usr, loggedIn: true});
  }

  const setUsername = (usr) => {
    setLogin({username: usr, loggedIn: login.loggedIn});
  }

  const setUserType = (number) => {
    if(number === 0) {
      userType.current = 'player';
    } else {
      userType.current = 'spectator';
    }
  }

  const togglePop = () => {
    setPopUp(false);
  }

  const getGameHistory = (evt) => {
    socket.emit('get game history', {}, (res) => {
      setGameHistory(res);
    });
    setPopUp(true);
  }

  return (
    <Div100vh>
      <div className="App">
        {login.loggedIn ? '' : <Div100vh><StartPage username={login.username} socket={socket} setUsername={setUsername} setUserType={setUserType} finished={finishSetup} code={code} /></Div100vh>}
        {help ? <Div100vh><Instructions close={() => setHelp(false)} /></Div100vh> : ''}
        <Div100vh>
          <div id="chat-page">
            <div className="sidebar">
              <div className="legend">
                <div>
                  <h2>Trump Suit</h2>
                  <p id="trump-suit">{gameDetails.trumpSuit ? <img src={process.env.PUBLIC_URL + "/" + gameDetails.trumpSuit + ".png"} /> : '?'} </p>
                </div>
                <div>
                  <h2>Trump Rank</h2>
                  <p id="trump-rank">{gameDetails.trumpRank ? gameDetails.trumpRank : ''}</p>
                </div>
                <div>
                  <h2>Points</h2>
                  <p id="points">{gameDetails.points}</p>
                </div>
                <div>
                  <h2>Game<br/>History</h2>
                  <p><a id="game-history" href="#" onClick={getGameHistory}>View</a></p>
                </div>
              </div>
              <div id="my-player-stats">
                  <h3 id="my-username">{login.username}</h3>
                  {/*<p>My Score: <span id="my-score"></span></p>*/}
                  <p><a href="#" id="help-link" style={{fontSize:'10px'}} onClick={() => setHelp(true)}>Help</a></p>
                </div>
              </div>
            <GameSpace socket={socket} popUp={popUp} togglePop={togglePop} history={gameHistory} userType={userType} code={code} />
            <ChatIcon handleClick={() => setChat(!chatOpen)} socket={socket} status={chatOpen}/>
            <Chat socket={socket} username={login.username} portrait={portrait} status={chatOpen}/>
          </div>
        </Div100vh>
      </div>
    </Div100vh>
  );
}

function ChatIcon(props) {

  const [socket, setSocket] = useState(props.socket);
  const [notif, setNotif] = useState(false);

  useEffect(() => {
    socket.on('chat message', function(msg){ 
      if(!props.status) {
        setNotif(true);
      } else {
        setNotif(false);
      }
    });
    if(props.status) {
      setNotif(false);
    }
  }, [props.status]);

  return (
    <div id="chat-icon" onClick={props.handleClick}>
      {notif ? <div id="chat-notif"></div> : ''}
      <img src={process.env.PUBLIC_URL + '/chaticon.png'} />
    </div>
  );
}

export default App;
