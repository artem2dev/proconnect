import { io } from 'socket.io-client';
import { config } from './config/app.config';

const URL = config.API_SOCKET;

const socket = io(URL, { autoConnect: false, transports: ['websocket'] });

export default socket;
