import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppErrors';

interface TokenPayload{
    iat:number;
    exp:number;
    sub:string;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT token is missing',401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const {sub} = decoded as TokenPayload; // "casting"

        // add type to library
        request.user = {
            id:sub
        }


        //console.log(decoded);
        return next();
    } catch (error) {
        throw new AppError('Invalid JWT token',401);
    }
}
