import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import CustomError from './classes/CustomError';
import {ErrorResponse} from './types/MessageTypes';
import {Species, UserWithoutPassword} from './types/DBTypes';
import fetchData from './lib/fetchData';
import {ImageFromWikipedia} from './types/ImageFromWikipedia';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  // console.log(err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const imageFromWikipedia = async (
  req: Request<{}, {}, Omit<Species, 'species_id'>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const name = req.body.species_name;
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${name}&pithumbsize=640&formatversion=2`;
    const imageData = await fetchData<ImageFromWikipedia>(url);
    const thumbnail = imageData.query.pages[0].thumbnail.source;
    req.body.image = thumbnail;
    next();
  } catch (error) {
    next(new CustomError('Error fetching image from Wikipedia', 500));
  }
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(new CustomError('No auth header provided', 401));
      return;
    }
    // we are using a bearer token
    const token = authHeader.split(' ')[1];

    if (!token) {
      next(new CustomError('No token provided', 401));
      return;
    }

    if (!process.env.JWT_SECRET) {
      next(new CustomError('JWT secret not set', 500));
      return;
    }

    const tokenContent = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as UserWithoutPassword;
    // optionally check if the user is still in the database

    res.locals.user = tokenContent;

    next();
  } catch (error) {
    next(new CustomError('Not authorized', 401));
  }
};

export {
  notFound,
  errorHandler,
  imageFromWikipedia,
  authenticate,
};
