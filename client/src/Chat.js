import react, {useEffect, useState} from 'react';

function Chat(props) {

  const [socket, setSocket] = useState(props.socket);
  const [message, setMessage] = useState('');
  const [chatContent, setChat] = useState([]);

  useEffect(() => {
    socket.on('chat message', function(msg){
      addChat(msg.username, msg.body);
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

  const addChat = (username, msg) => {
    let str = username + ": " + msg;
    setChat(chatContent => chatContent.concat(str));
  }

  return (
    <aside id="chat">
      <div id="current-users">
        <div id="all-users"></div>
      </div>
      <div id="chat-container">
        <div id="messages-container">
          <ul id="messages">
            {chatContent.length > 0 ? chatContent.map((c, i) => <li className='chat-msg' key={i}>{c}</li>) : ''}
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