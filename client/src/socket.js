import { io } from 'socket.io-client';
import { config } from './common/config';

const URL = config.API;

const socket = io(URL, { autoConnect: false });

export default socket;
