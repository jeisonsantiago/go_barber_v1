
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

// index(list), show(list one), create, update, delete

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      // get id from url: localhost:3333/appointments/:id/month-availability
      const {provider_id} = request.params;
      const {year, month} = request.body;

      const listProviderMonthAvailability = container.resolve(ListProviderMonthAvailabilityService);

      const availability = await listProviderMonthAvailability.execute({
        provider_id,
        month,
        year
      })

      return response.json({ providerMonth: availability });
    } catch (error) {
      return response
        .status(400)
        .json({ error: error.message });
    }
  }

}
