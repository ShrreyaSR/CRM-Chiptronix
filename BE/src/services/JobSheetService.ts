import { JobSheetRepository } from "../repositories/JobSheetRepository";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class JobSheetService {
  private repo = JobSheetRepository;
  
  async getAllJobs(query: any) {
    const {
      search,
      status,
      assignedTo,
      client,
      fromDate,
      toDate,
      sortField,
      sortOrder,
      page,
      limit,
    } = query;

    const qb = this.repo
      .createQueryBuilder("job")
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
      OR brand.brand ILIKE :search
      OR brand.model ILIKE :search
      OR job.serialNumber ILIKE :search
      OR job.problemsIdentified ILIKE :search
      OR job.receivedFrom ILIKE :search
      OR assignedTo.name ILIKE :search
      OR receivedBy.name ILIKE :search
    )`,
    { search: `%${search}%` }
  );
}


    if (status) qb.andWhere("job.status = :status", { status });
    if (client) qb.andWhere("client.id = :client", { client });
    if (assignedTo) qb.andWhere("assignedTo.id = :assignedTo", { assignedTo });
    if (fromDate && toDate) {
      qb.andWhere(`job."createdOn" BETWEEN :from AND :to`, {
        from: `${fromDate} 00:00:00`,
        to: `${toDate} 23:59:59`,
      });
    } else if (fromDate) {
      qb.andWhere(`job."createdOn" >= :from`, {
        from: `${fromDate} 00:00:00`,
      });
    } else if (toDate) {
      qb.andWhere(`job."createdOn" <= :to`, {
        to: `${toDate} 23:59:59`,
      });
    }

    const skip = (page - 1) * limit;

    qb.orderBy(`job.${sortField}`, sortOrder);

    if (limit === -1) {
      const items = await qb.getMany();
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length,
        totalPages: 1,
      };
    }

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getJobById(id: number) {
    const job = await this.repo.findOneBy({ id });
    if (!job) {
      throw new AppError(`Job sheet with id ${id} not found`, 404);
    }
    return job;
  }

  async createJob(data: any) {
    const job = this.repo.create(data);
    const saved = await this.repo.save(job);
    logger.info("Job sheet created", { jobId: saved.id });
    return saved;
  }

  async updateJob(id: number, data: any) {
    await this.getJobById(id); // Throws if not found
    await this.repo.update(id, data);
    const updated = await this.repo.findOneBy({ id });
    logger.info("Job sheet updated", { jobId: id });
    return updated!;
  }

  async deleteJob(id: number) {
    await this.getJobById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Job sheet deleted", { jobId: id });
  }
}
