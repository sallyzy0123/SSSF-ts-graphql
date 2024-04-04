require('dotenv').config();
import express, {Request, Response} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {notFound, errorHandler} from './middlewares';
import {MessageResponse} from './types/MessageTypes';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import typeDefs from './api/schemas/index';
import resolvers from './api/resolvers/index';

const app = express();

(async () => {
  try {
    app.use(
      helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: false,
      }),
    );
    app.use(cors());

    app.get('/', (_req: Request, res: Response<MessageResponse>) => {
      res.send({message: 'Server is running'});
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

    app.use('/graphql', cors(), express.json(), expressMiddleware(server));

    app.use(notFound);
    app.use(errorHandler);
  } catch (error) {
    console.error((error as Error).message);
  }
})();

export default app;
