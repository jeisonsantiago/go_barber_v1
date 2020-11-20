// ROUTES, recieve requisitions, call other file, return a response

import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated';


const usersRouter = Router();

const upload = multer(uploadConfig);

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

        // so we show everything but password
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


usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        // file info

        try {

            const updateUserAvatar = new UpdateUserAvatarService();

            const user = await updateUserAvatar.execute({
                user_id: request.user.id,
                avatarFilename: request.file.filename
            })

            console.log(request.file);

            // so we show everything but password
            const userWithoutPassword = {
                id: user.id,
                name: user.name,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at,
                image_avatar:user.image_avatar,
            };

            return response.json(userWithoutPassword);


        } catch (error) {
            return response.status(400).json({ error: error.message });
        }

    })

export default usersRouter;

