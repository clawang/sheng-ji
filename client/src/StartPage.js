import React, { useState, useEffect } from 'react';
import GameStart from './components/GameStart';

function StartPage(props) {

    const [socket, setSocket] = useState(props.socket);
    const [message, setMessage] = useState('');
    const [state, setState] = useState(-1);
    const [username, setUsername] = useState('');
    const [teams, setTeams] = useState([{usernames: []}, {usernames: []}]);

    useEffect(() => {
        socket.on('set teams', function(tms) {
            setTeams(teams => tms);
        });
    }, []);

    const changeUsername = (evt) => {
        setUsername(evt.target.value);
    }

    const loginSubmit = (evt) => {
        evt.preventDefault();
        if(username !== '' && username.replace(/\s/g, '').length) {
            socket.emit('add user', username, (res) => {
                if(res === 'success') {
                    props.setUsername(username);
                    setState(1);
                    setMessage('');
                } else if(res === 'return') {
                    props.setUserType(0);
                    props.finished(username);
                } else {
                    setMessage(res);
                }
            });
        } else {
            setMessage('Please enter a valid username.');
        }
    }

    const playerSettings = (type) => {
        socket.emit('user type', type, (res) => {
            if(res === 'player') {
                setState(2);
                props.setUserType(0);
                setMessage('');
            } else if(res === 'spectator') {
                props.setUserType(1);
                props.finished(username);
            } else {
                setMessage(res);
            }
        });
    }

    const setTeam = (team) => {
        socket.emit('set team', team, (res) => {
            if(res === 'success') {
                props.finished(username);
            } else {
                setMessage(res);
            }
        });
    }

    if(state === -1) {
        return (
            <GameStart socket={socket} setRoom={setState} code={props.code} />
        );
    } else if(state === 0) {
        return (
            <div className="start-page">
                <div id="registration">
                    <h1>Sheng Ji</h1>
                    <h3 id="start-code">{props.code.current}</h3>
                    <form id="create-user">
                        <label>Username</label><br/>
                        <input id="username" name="username" autoComplete="off" type="text" value={username} onChange={changeUsername} />
                        <button onClick={loginSubmit}>Submit</button>
                    </form>
                    <p id="login-error" className="error-message">{message}</p>
                </div>
                    
            </div>
        );
    } else if(state === 1) {
        return (
            <div className="start-page">
                <div id="game-settings">
                    <div id="game-settings-player">
                        <h1>Sheng Ji</h1>
                        <h3 id="start-code">{props.code.current}</h3>
                        <h2>Would you like to join the game as a player or a spectator?</h2>
                        <button id='join-player' onClick={() => playerSettings('player')} >Player</button>
                        <button id='join-spectator' onClick={() => playerSettings('spectator')}>Spectator</button>
                        <p id="setting-error" className="error-message">{message}</p>
                    </div>
                </div>
            </div>
        );
    } else if(state === 2) {
        return (
            <div className="start-page">
                <div id="game-settings">
                    <div id="team">
                        <h1>Sheng Ji</h1>
                        <h3 id="start-code">{props.code.current}</h3>
                        <h2 id="team-header">Which team would you like to join?</h2>
                        <div id="team-container">
                            <div id="declarers" onClick={() => setTeam(0)}>
                                <h3>Declarers</h3>
                                <div><ul>{teams[0].usernames.length > 0 ? teams[0].usernames.map(nm => <li>{nm}</li>) : <li>No players yet</li>}</ul></div>
                            </div>
                            <div id="opponents" onClick={() => setTeam(1)}>
                                <h3>Opponents</h3>
                                <div><ul>{teams[1].usernames.length > 0 ? teams[1].usernames.map(nm => <li>{nm}</li>) : <li>No players yet</li>}</ul></div>
                            </div>
                        </div>
                        <p id="team-error" className="error-message">{message}</p>
                    </div>  
                </div>
            </div>
        );
    }
}

export default StartPage;