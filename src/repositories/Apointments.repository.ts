import Appointment from '../models/Appointment';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>{


    // return of a async functions will awayls be a Promise    
    public async findByDate(date: Date): Promise<Appointment|null> {

        const findAppointment = await this.findOne({
            where:{date:date},
        })
        
        return findAppointment || null;
    }
}

export default AppointmentsRepository;