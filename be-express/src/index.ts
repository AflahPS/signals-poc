import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import config from './config/config';
import logger from './modules/utils/logger/logger';
import { Post } from './modules/post';
import { IPostDoc } from './modules/post/post.interfaces';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

mongoose.connect(config.mongoose.url).then(() => {
  logger.info('Connected to MongoDB');

  server.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('joinStation', (stationId: string) => {
    socket.join(stationId);
    logger.info(`Socket ${socket.id} joined station: ${stationId}`);
  });

  socket.on('leaveStation', (stationId: string) => {
    socket.leave(stationId);
    logger.info(`Socket ${socket.id} left station: ${stationId}`);
  });

  // Handle client disconnection
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Use Mongoose Change Streams to detect changes in the Post collection
Post.watch().on('change', async (change: { operationType: string; documentKey: IPostDoc }) => {
  const { operationType, documentKey } = change;
  const doc = await Post.findById(documentKey?._id).populate('lastChangeBy');

  if (['insert', 'update', 'delete'].includes(operationType)) {
    const stationId = doc?.station?.toString() as string;
    const payload = {
      operationType: doc?.isDeleted ? 'delete': operationType,
      post: doc,
    };
    io.to(stationId).emit('postUpdated', payload);
  }
});

// Graceful shutdown
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
