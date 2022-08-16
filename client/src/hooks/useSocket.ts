import io from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

const SERVER_URL: string = process.env.REACT_APP_SERVER_URL as string;
const socket = io(SERVER_URL);

const useSocket = () => {
  return socket;
};

export default useSocket;
