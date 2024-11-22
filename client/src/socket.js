import { io } from 'socket.io-client';
import { config } from './config/app.config';

const URL = config.API;

const socket = io(URL, { autoConnect: false });

export default socket;
