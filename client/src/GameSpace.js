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
  const [discardVisible, setDiscard] = useState(false);
  const playerId = useRef(null);
  //let playerId;

  useEffect(() => {
      socket.on('set playerId', function(id) {
        playerId.current = id;
      });
      socket.on('my hand', function(data) {
        setStarted(true);
      });
      socket.on('next turn', function(data) {
        if(data.turn === playerId.current) {
            setMessage({body: "It's your turn!",  color: 'green'});
          } else {
            setMessage({body: "It's " + data.usrnm + "'s turn!", color: ''});
          }
      });
      socket.on('flip discard', function() {
        revealDiscard();
      });
      socket.on('reveal discard', function() {
        revealDiscard();
      });
      socket.on('end game', function(data) {
        setMessage({body: data.msg, subtitle: data.subtitle, color: ''});
        setStarted(false);
      });
  }, []);

  const startGame = (evt) => {
    evt.preventDefault();
    setMessage({body: 'Waiting...', color: ''});
    setStarted(true);
    socket.emit('start game', {});
  }

  const revealDiscard = () => {
    setDiscard(true);
    setTimeout(function() {
      setDiscard(false);
    }, 7000);
  }

  return (
    <div className="game-space">
      {props.popUp ? 
        <div id="pop-up">
          <p id="pop-up-close"><a href="#" onClick={props.togglePop}>X</a></p>
          <div id="pop-up-inner">
            <h1>Game History</h1>
            <h3 className="yellow">The team that was the Declarer each round is in yellow.</h3><br/>
            {props.history.length > 0 ?
              <table>
                <tr>
                  <th>Round</th>
                  <th>{props.history[0].teams[0].usernames[0] + ' & ' + props.history[0].teams[0].usernames[1]}</th>
                  <th>{props.history[0].teams[1].usernames[0] + ' & ' + props.history[0].teams[1].usernames[1]}</th>
                  <th>Starter</th>
                  <th>Trump Suit</th>
                  <th>Points</th>
                  <th>Winner</th>
                </tr>
                {props.history.map(game => {
                  return (<tr>
                    <td>{game.roundIndex}</td>
                    <td className={game.declarer === 0 ? 'winner' : ''}>{game.teams[0].score}</td>
                    <td className={game.declarer === 1 ? 'winner' : ''}>{game.teams[1].score}</td>
                    <td>{game.starter}</td>
                    <td>{game.trumpSuit}</td>
                    <td>{game.points}</td>
                    <td>{game.teams[game.winner].usernames[0] + ' & ' + game.teams[game.winner].usernames[1]}</td>
                  </tr>);
                })}
                </table>
                :
                <p>No games yet.</p>
              }
          </div>
        </div>
        :
        ''
      }
      <Discard socket={socket} visible={discardVisible} />
      <div id="overlay"></div>
      <div id="header">
        <p className={"center-msg " + message.color}>{message.body}</p>
        <h4 className={message.color}>{message.subtitle}</h4>
      </div>
      {playerId.current !== null ? <Player id="3" socket={socket} main={playerId.current} /> : ''}
      {playerId.current !== null ? <Player id="4" socket={socket} main={playerId.current} /> : ''}
      <div className="center">
        <input type="text" value={props.code.current} id="code-box" disabled />
        {!started && props.userType.current === 'player' ?
          <button id="start-game" onClick={startGame}>{playerId.current !== null ? 'Start Next Round' : 'Start Game'}</button>
          :
          ''
        }
      </div>
      {playerId.current !== null ? <Player id="2" socket={socket} main={playerId.current}/> : ''}
      {props.userType.current === 'player' ? <MyPlayer socket={socket} playerId={playerId.current} sendMessage={setMessage} /> : <Player id="1" socket={socket} main={playerId.current} />}
    </div>
  );
}

export default GameSpace;