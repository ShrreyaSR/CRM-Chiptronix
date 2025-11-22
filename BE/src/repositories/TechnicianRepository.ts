import { AppDataSource } from "../config/data-source";
import { Technician } from "../entities/Technician";


export const TechnicianRepository = AppDataSource.getRepository(Technician).extend({

  async createTechnician(dto: Technician) {
    const technician = this.create(dto);
    return await this.save(technician);
  },

  async findAll() {
    return await this.find();
  },

});