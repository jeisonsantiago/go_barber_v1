import User from '../models/User';
import { getRepository } from 'typeorm';
import path from 'path';
import uploadConfig from '../config/upload';
import fs from 'fs';
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
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {

    public async execute({ user_id, avatarFilename }: Request): Promise<User> {

        const userRepository = getRepository(User);

        const user = await userRepository.findOne(user_id);

        if(!user){
            throw new Error('Only authenticated users can change avatar.');
        }

        if(user.image_avatar){
            // delete former avatar
            const userAvatarFilePath = path.join(uploadConfig.directory,user.image_avatar);

            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if(userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath);
            }
        }


        // change contents directly in the instance
        // then you can save to DB right after:
        user.image_avatar = avatarFilename;
        await userRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;