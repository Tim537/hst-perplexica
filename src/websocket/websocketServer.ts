import { WebSocketServer } from 'ws';
import { handleConnection } from './connectionManager';
import http from 'http';
import { getPort } from '../config';
import logger from '../utils/logger';

/**
 * Initializes and starts the WebSocket server
 * @param server - HTTP server instance to attach the WebSocket server to
 */
export const initServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
) => {
  // Get configured port number
  const port = getPort();
  
  // Create new WebSocket server attached to HTTP server
  const wss = new WebSocketServer({ server });

  // Set up connection handler for new WebSocket connections
  wss.on('connection', handleConnection);

  // Log server start
  logger.info(`WebSocket server started on port ${port}`);
};
