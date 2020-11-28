import react, {useEffect, useState, useRef} from 'react';

function Chat(props) {

  const [socket, setSocket] = useState(props.socket);
  const [message, setMessage] = useState('');
  const [chatContent, setChat] = useState([]);
  const [teams, setTeams] = useState([]);
  const container = useRef(null);
  const chats = useRef(null);

  useEffect(() => {
    socket.on('chat message', function(msg){
      addChat(msg.username, msg.body, '');
    });
    socket.on('setup game', function(tr) {
      let tm = tr.teams;
      tm[0].declarers = (tr.declarers === 0);
      tm[1].declarers = (tr.declarers === 1);
      setTeams(tm);
    });
    socket.on('user joined', function(data) {
      addChat(data.username, data.username + ' has joined the game.', 'connection-msg');
    });
    socket.on('user left', function(data) {
      addChat(data.username, data.username + ' has left the game.', 'disconnection-msg');
    });
  }, []);

  const handleChange = (evt) => {
    setMessage(evt.target.value);
  }

  const submitChat = (e) => {
    let msg = message;
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', {body: msg, username: props.username});
    setMessage('');
  }

  const addChat = (username, msg, style) => {
    let str;
    if(style.length === 0) {
      str = username + ": " + msg;
    } else {
      str = msg;
    }
    let chat = {body: str, username: username, style: style};
    setChat(chatContent => chatContent.concat(chat));
    if(chats.current && container.current) {
      let height = chats.current.clientHeight;
      container.current.scrollTop = height;
    }
  }

  return (
    <aside id="chat">
      <div id="current-users">
        <div id="all-users">
          {teams.length > 0 ? 
            teams.map((team, i) => {
              return (
                <div key={i}>
                  <h2>{(team.declarers ? "Declarers" : "Opponents") + " – " + team.score}</h2>
                  <li>{team.usernames[0]}</li>
                  <li>{team.usernames[1]}</li>
                </div>
              );
            })
            :
            ''
          }
        </div>
      </div>
      <div id="chat-container">
        <div id="messages-container" ref={container}>
          <ul id="messages" ref={chats}>
            {chatContent.length > 0 ? chatContent.map((c, i) => <li className={'chat-msg ' + c.style} key={i}>{c.body}</li>) : ''}
          </ul>
        </div>
        <form id="chatbox" action="">
          <input id="m" autoComplete="off" value={message} onChange={handleChange} /><button onClick={submitChat}>Send</button>
        </form>
      </div>
    </aside>
  );
}

export default Chat;