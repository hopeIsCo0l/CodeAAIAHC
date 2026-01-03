import { startClient } from '@tanstack/start';
import { createRouter } from './router.js';
import './global.css';

startClient({
  router: createRouter(),
});
