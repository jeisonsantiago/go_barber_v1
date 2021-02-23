
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

// index(list), show(list one), create, update, delete

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    try {

      const { provider_id } = request.params;
      const { year, month, day } = request.body;

      const listProviderDayAvailabilityService = container.resolve(ListProviderDayAvailabilityService);

      const availability = await listProviderDayAvailabilityService.execute({
        provider_id,
        day,
        month,
        year
      });

      return response.json({ providerMonth: availability });
    } catch (error) {
      return response
        .status(400)
        .json({ error: error.message });
    }
  }

}
