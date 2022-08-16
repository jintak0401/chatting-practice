import io, { Socket } from 'socket.io-client';
const SERVER_URL: string = process.env.REACT_APP_SERVER_URL as string;

const useSocket = (namespace: string): Socket => {
  return io(`${SERVER_URL}/${namespace}`);
};

export default useSocket;
