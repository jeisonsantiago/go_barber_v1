import {Request, Response} from 'express';
import { parseISO } from 'date-fns';
import {container} from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController{
  public async create(request:Request, response:Response):Promise<Response>{
    try {

      const { id, provider_id, date } = request.body;

      // parseISO = parse date to 'Date' (javascript) format.
      const parsedDate = parseISO(date); // transform data

      const createAppointment = container.resolve(CreateAppointmentService);

      const appointment = await createAppointment.execute({
        id: id,
        provider_id: provider_id,
        date: parsedDate,
      });

      return response.json({ appointment: appointment });

    } catch (error) {
      return response
        .status(400)
        .json({ error: error.message });
    }
  }
}