import { ComplaintRepository } from "../repositories/ComplaintRepository";
import { Complaint } from "../entities/Complaint";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class ComplaintService {
  private repo = ComplaintRepository;
  async getAllComplaints(options: {
    search: string;
    sortField: string;
    sortOrder: "ASC" | "DESC";
  }) {
    const { search, sortField, sortOrder } = options;

    const query = this.repo.createQueryBuilder("complaint");

    if (search) {
      query.where("complaint.description ILIKE :search", { search: `%${search}%` });
    }

    query.orderBy(`complaint.${sortField}`, sortOrder);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async getComplaintById(id: number): Promise<Complaint> {
    const complaint = await this.repo.findOneBy({ id });
    if (!complaint) {
      throw new AppError(`Complaint with id ${id} not found`, 404);
    }
    return complaint;
  }

  async createComplaint(dto: Complaint) {
    const complaint = this.repo.create(dto);
    const saved = await this.repo.save(complaint);
    logger.info("Complaint created", { complaintId: saved.id });
    return saved;
  }

  async updateComplaint(id: number, dto: Partial<Complaint>) {
    await this.getComplaintById(id); // Throws if not found
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    logger.info("Complaint updated", { complaintId: id });
    return updated!;
  }

  async deleteComplaint(id: number) {
    await this.getComplaintById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Complaint deleted", { complaintId: id });
  }
}
