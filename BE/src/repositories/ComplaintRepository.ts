import { AppDataSource } from "../config/data-source";
import { Complaint } from "../entities/Complaint";

export const ComplaintRepository = AppDataSource.getRepository(Complaint).extend({
  async createComplaint(dto: Complaint) {
    const complaint = this.create(dto);
    return await this.save(complaint);
  },

  async findAll() {
    return await this.find();
  },
});
