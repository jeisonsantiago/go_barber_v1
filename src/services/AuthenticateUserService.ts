import User from '../models/User';
import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppErrors';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthenticateUserService {
    public async execute({ email, password }: Request): Promise<Response> {

        const userRepository = getRepository(User);

        const user = await userRepository.findOne({
            where: { email:email },
        })

        if (!user) {
            throw new AppError('Incorrect email/password combination.',401);
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination',401);
        }

        const {secret,expiresIn} = authConfig.jwt;

        // user experience WEB desktop
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn: expiresIn,
        }); // only use user name or id;

        // user authenticated
        return {
            user,
            token,
        }

    }
}

export default AuthenticateUserService;