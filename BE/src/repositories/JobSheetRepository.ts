import { AppDataSource } from "../config/data-source";
import { JobSheet } from "../entities/JobSheet";
import { Between } from "typeorm";

interface JobQuery {
  search?: string;
  status?: string;
  client?: number;
  assignedTo?: number;
  fromDate?: string;
  toDate?: string;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export const JobSheetRepository = AppDataSource.getRepository(JobSheet).extend({
  async createJobSheet(dto: Partial<JobSheet>) {
    const job = this.create(dto);
    return await this.save(job);
  },

  async findAll(query: JobQuery) {
    const {
      search,
      status,
      assignedTo,
      client,
      fromDate,
      toDate,
      sortField = "job.createdOn",
      sortOrder = "DESC",
      page = 1,
      limit = 10,
    } = query;

    const qb = this.createQueryBuilder("job")
      .leftJoinAndSelect("job.client", "client")
      .leftJoinAndSelect("job.brand", "brand")
      .leftJoinAndSelect("job.complaint", "complaint")
      .leftJoinAndSelect("job.tray", "tray")
      .leftJoinAndSelect("job.assignedTo", "assignedTo")
      .leftJoinAndSelect("job.receivedBy", "receivedBy");

    if (search) {
      qb.andWhere(
        `(client.name ILIKE :search
          OR job.serviceType ILIKE :search
          OR brand.brandName ILIKE :search
          OR job.model ILIKE :search
          OR job.serialNumber ILIKE :search
          OR job.problemsIdentified ILIKE :search
          OR job.receivedFrom ILIKE :search
          OR assignedTo.name ILIKE :search
          OR receivedBy.name ILIKE :search
          OR job.description ILIKE :search)`,
        { search: `%${search}%` }
      );
    }

    if (status) qb.andWhere("job.status = :status", { status });
    if (client) qb.andWhere("client.id = :client", { client });
    if (assignedTo) qb.andWhere("assignedTo.id = :assignedTo", { assignedTo });

    if (fromDate && toDate) {
      qb.andWhere("job.createdOn BETWEEN :fromDate AND :toDate", {
        fromDate,
        toDate,
      });
    } else if (fromDate) {
      qb.andWhere("job.createdOn >= :fromDate", { fromDate });
    } else if (toDate) {
      qb.andWhere("job.createdOn <= :toDate", { toDate });
    }

    const skip = (page - 1) * limit;

    qb.orderBy(sortField, sortOrder);

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async updateJob(id: number, data: Partial<JobSheet>) {
    await this.update(id, data);
    return await this.findOne({
      where: { id },
      relations: [
        "client",
        "brand",
        "complaint",
        "tray",
        "assignedTo",
        "receivedBy",
      ],
    });
  },

  async deleteJob(id: number) {
    return await this.delete(id);
  },
});
