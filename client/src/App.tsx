import React, {
  FormEvent,
  ChangeEvent,
  useEffect,
  useState,
  useMemo,
} from 'react';
import useSocket from './hooks/useSocket';
import { Socket } from 'socket.io-client';
import './App.css';

function App() {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageList, setMessageList] = useState<
    { name?: string; msg: string }[]
  >([]);
  const socket: Socket = useMemo(() => useSocket('chatting'), []);

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === '') return;
    socket.emit('submit_chat', { name, msg: message });
    setMessage('');
  };

  useEffect(() => {
    const newUser = prompt('이름이 뭐니?') as string;
    setName(newUser);
    socket.emit('new_user', newUser);
    socket.on('new_chat', (msg) => {
      setMessageList((prevList) => [...prevList, msg]);
    });
  }, []);

  const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setMessage(target.value);
  };

  return (
    <div className="App">
      <section className="chat_list">
        {messageList.map((item, idx) => (
          <div key={`${item}${idx}`} className="messagelist">
            <p className="msg_text" data-me={item.name === name}>
              {item.name && item.name !== name
                ? `${item.name}: ${item.msg}`
                : `${item.msg}`}
            </p>
          </div>
        ))}
      </section>
      <form className="chat_con" onSubmit={sendMessage}>
        <div className="chat_inputs">
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
