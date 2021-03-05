import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProfileService from '@modules/appointments/services/ListProvidersService';

// index(list), show(list one), create, update, delete

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    try {

      const user_id = request.user.id;

      const listProviders = container.resolve(ListProfileService);

      let providers = await listProviders.execute({
        user_id: user_id,
      });

      let filterProvider;
      if (providers) {
        filterProvider = providers.map(item => {
            return {
              name:item.name,
              email:item.email,
              created_at:item.created_at,
              updated_at:item.updated_at,
              image_avatar: item.image_avatar,
            }
        });
      }

      return response.json({ providers: filterProvider });
    } catch (error) {
      return response
        .status(400)
        .json({ error: error.message });
    }
  }

}
