import { json, Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';


// index(list), show(list one), create, update, delete

export default class ProfileController {

  public async show(request:Request, response:Response):Promise<Response>{
    try{
      const user_id = request.user.id;

      const showProfile = container.resolve(ShowProfileService);

      const user = await showProfile.execute({user_id:user_id});

      return response .json({
        name: user?.name,
        email: user?.email,
        image_avatar: user?.image_avatar,
        created_at: user?.created_at,
        updated_at: user?.updated_at,
      });
    } catch (error) {
      return response
        .status(400)
        .json({ error: error.message });
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const user_id = request.user.id;
      const { name, email, password, old_password } = request.body;

      const updateProfile = container.resolve(UpdateProfileService);

      const user = await updateProfile.execute({
        user_id:user_id,
        name:name,
        email:email,
        password:password,
        old_password:old_password,
      });

      return response.json({ user: user });
    } catch (error) {
      return response
        .status(400)
        .json({ error: error.message });
    }
  }

}