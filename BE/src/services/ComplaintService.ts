import { ComplaintRepository } from "../repositories/ComplaintRepository";
import { Complaint } from "../entities/Complaint";

export class ComplaintService {
  private repo = ComplaintRepository;
  async getAllComplaints(options: {
    search: string;
    sortField: string;
    sortOrder: string;
  }) {
    const { search, sortField, sortOrder } = options;

    const query = this.repo
      .createQueryBuilder("complaint")
      .where("complaint.description ILIKE :search", { search: `%${search}%` })
      .orderBy(`complaint.${sortField}`, sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC");

    const [data, total] = await query.getManyAndCount();

    return { data, total};
  }

  async createComplaint(dto: Complaint) {
    return await this.repo.createComplaint(dto);
  }

  async updateComplaint(id: number, dto: Partial<Complaint>) {
    await this.repo.update(id, dto);
    return await this.repo.findOneBy({ id });
  }

  async deleteComplaint(id: number) {
    await this.repo.delete(id);
  }
}
