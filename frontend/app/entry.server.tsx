import { startServer } from '@tanstack/start/server';
import { createRouter } from './router.js';
import './global.css';

export default startServer({
  createRouter,
});
