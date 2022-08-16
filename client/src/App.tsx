import React, { FormEvent, ChangeEvent, useEffect, useState } from 'react';
import useSocket from './hooks/useSocket';
import { Socket } from 'socket.io-client';
import './App.css';

function App() {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageList, setMessageList] = useState<
    { name: string; message: string }[]
  >([]);
  const socket: Socket = useSocket();

  const sendMessage = ({ preventDefault }: FormEvent<HTMLFormElement>) => {
    preventDefault();
    socket.emit('send', {
      name,
      message,
    });
    setName('');
    setMessage('');
  };

  useEffect(() => {
    socket.on('receive', (message) => {
      setMessageList([...messageList, message]);
    });
  }, []);

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    target.name === 'name' ? setName(target.value) : setMessage(target.value);
  };

  return (
    <div className="App">
      <section className="chat_list">
        {messageList.map((item) => (
          <div className="messagelist">
            <p className="username">{item.name}</p>
            <p className="msg_text">{item.message}</p>
          </div>
        ))}
      </section>
      <form className="chat_con" onSubmit={(e) => sendMessage(e)}>
        <div className="chat_inputs">
          <input
            type="text"
            onChange={onChange}
            value={name}
            name="name"
            id="id"
            placeholder="아이디"
          />
          <input
            type="text"
            onChange={onChange}
            value={message}
            name="msg"
            id="msg"
            placeholder="메세지내용"
          />
        </div>
        <button className="chat_button" type="submit">
          보내기
        </button>
      </form>
    </div>
  );
}

export default App;
