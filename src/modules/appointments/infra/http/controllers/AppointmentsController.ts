import {Request, Response} from 'express';
import { parseISO } from 'date-fns';
import {container} from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import Appointment from '../../typeorm/entities/Appointment';

export default class AppointmentsController{

  public async show(request:Request, response:Response):Promise<Response>{

    const appointments:Appointment[] = [];

    return response.json({appointments:appointments});
  }


  public async create(request:Request, response:Response):Promise<Response>{
    try {

      // para rotas authenticated
      const user_id = request.user.id;

      const { provider_id, date } = request.body;

      // parseISO = parse date to 'Date' (javascript) format.
      const parsedDate = parseISO(date); // transform data

      const createAppointment = container.resolve(CreateAppointmentService);

      const appointment = await createAppointment.execute({
        provider_id: provider_id,
        user_id: user_id,
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
