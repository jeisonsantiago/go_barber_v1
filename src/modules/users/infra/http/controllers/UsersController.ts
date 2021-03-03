import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUserService from '@modules/users/services/CreateUserService';

// index(list), show(list one), create, update, delete

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {

      const { name, email, password } = request.body;

      const createUserService = container.resolve(CreateUserService);

      const user = await createUserService.execute({
        name,
        email,
        password,
      });

      return response.json(classToClass(user));
    } catch (error) {
      return response
        .status(400)
        .json({ error: error.message });
    }
  }
}
