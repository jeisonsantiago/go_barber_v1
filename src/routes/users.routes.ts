// ROUTES, recieve requisitions, call other file, return a response

import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

/**
 * Repository
 * Services
 */

usersRouter.post('/', async (request, response) => {

    try {
        
        const { name, email, password } = request.body;

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({
            name, 
            email,
            password,
        });

        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };

        return response.json({ user: userWithoutPassword });
    } catch (error) {
        return response
            .status(400)
            .json({ error: error.message });
    }
});

export default usersRouter;

