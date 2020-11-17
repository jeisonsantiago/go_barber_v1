import User from '../models/User';
import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

// services awayls have only one method, and are
// responsible for only one thing (unica responsabilidade)
// services don't have access to request, response
// services holds the (business rules) from the application

/**
 * DEPENDENCY INVERSION (SOLID)
 */

/**
* Business rules:
* no replicated email or name
* cript pasword
*/

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {

    public async execute({ name, email, password }: Request): Promise<User> {

        const userRepository = getRepository(User);

        const emailAlreadExists = await userRepository.findOne({
            where: { email },
        })

        if (emailAlreadExists) {
            throw Error('Email address already used.');
        }

        const hashedPassword = await hash(password,8);

        const user = userRepository.create({
            name,
            email,
            password:hashedPassword,
        });

        await userRepository.save(user);

        return user;
    }
}

export default CreateUserService;