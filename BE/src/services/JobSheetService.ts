import { JobSheetRepository } from "../repositories/JobSheetRepository";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";
import { AppDataSource } from "../config/data-source";
import { Spares } from "../entities/Spares";
import { SalesPerson } from "../entities/SalesPerson";
import { Vendor } from "../entities/Vendor";
import { Complaint } from "../entities/Complaint";

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
      completedFromDate,
      completedToDate,
      sortField,
      sortOrder,
      page,
      limit,
      hasSpares,
      spareStatus,
    } = query;

    const qb = this.repo
      .createQueryBuilder("job")
      .leftJoinAndSelect("job.client", "client")
      .leftJoinAndSelect("job.brand", "brand")
      .leftJoinAndSelect("job.complaints", "complaint")
      .leftJoinAndSelect("job.tray", "tray")
      .leftJoinAndSelect("job.assignedTo", "assignedTo")
      .leftJoinAndSelect("job.receivedBy", "receivedBy")
      .leftJoinAndSelect("job.spares", "spares")
      .leftJoinAndSelect("spares.salesPerson", "salesPerson")
      .leftJoinAndSelect("spares.vendor", "vendor");

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
    if (hasSpares === true || hasSpares === "true") {
      qb.andWhere("spares.id IS NOT NULL");
    }
    if (spareStatus) {
      qb.andWhere("spares.status = :spareStatus", { spareStatus });
    }
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

    if (completedFromDate && completedToDate) {
      qb.andWhere(`job."completedOn" BETWEEN :cfrom AND :cto`, {
        cfrom: `${completedFromDate} 00:00:00`,
        cto: `${completedToDate} 23:59:59`,
      });
    } else if (completedFromDate) {
      qb.andWhere(`job."completedOn" >= :cfrom`, {
        cfrom: `${completedFromDate} 00:00:00`,
      });
    } else if (completedToDate) {
      qb.andWhere(`job."completedOn" <= :cto`, {
        cto: `${completedToDate} 23:59:59`,
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
    const job = await this.repo
      .createQueryBuilder("job")
      .leftJoinAndSelect("job.client", "client")
      .leftJoinAndSelect("job.brand", "brand")
      .leftJoinAndSelect("job.complaints", "complaint")
      .leftJoinAndSelect("job.tray", "tray")
      .leftJoinAndSelect("job.assignedTo", "assignedTo")
      .leftJoinAndSelect("job.receivedBy", "receivedBy")
      .leftJoinAndSelect("job.spares", "spares")
      .leftJoinAndSelect("spares.salesPerson", "salesPerson")
      .leftJoinAndSelect("spares.vendor", "vendor")
      .where("job.id = :id", { id })
      .getOne();
    
    if (!job) {
      throw new AppError(`Job sheet with id ${id} not found`, 404);
    }
    return job;
  }

  async createJob(data: any) {
    const { complaints, ...jobSheetData } = data;

    let complaintEntities: Complaint[] | undefined;
    if (Array.isArray(complaints) && complaints.length > 0) {
      const complaintRepo = AppDataSource.getRepository(Complaint);
      complaintEntities = await complaintRepo.findByIds(complaints as number[]);
    }

    const job = this.repo.create({
      ...jobSheetData,
      complaints: complaintEntities,
    });
    const saved = await this.repo.save(job) as any;
    logger.info("Job sheet created", { jobId: saved?.id });
    return saved;
  }

  async updateJob(id: number, data: any) {
    const existingJob = await this.getJobById(id); // Throws if not found
    
    // Handle spares and complaints separately if provided
    const { spares, complaints, ...jobSheetData } = data;

    const previousStatus = existingJob.status;
    const newStatus = jobSheetData.status ?? previousStatus;
    const isCompletedLike = (status?: string) =>
      status === "Completed" ||
      status === "Delivered" ||
      status === "Not Repairable" ||
      status === "Repair Declined" ||
      status === "Not Repairable - Delivered" ||
      status === "Repair Declined - Delivered" ||
      status === "Paid";

    if (!isCompletedLike(previousStatus) && isCompletedLike(newStatus)) {
      (jobSheetData as any).completedOn = new Date();
    }
    
    const sparesRepository = AppDataSource.getRepository(Spares);
    let sparesEntity: Spares | null = null;

    const complaintRepository = AppDataSource.getRepository(Complaint);
    let complaintEntities: Complaint[] | undefined;
    
    // Process spares if provided
    if (spares !== undefined) {
      if (spares === null) {
        // Remove spares by setting to null
        sparesEntity = null;
      } else if (spares && typeof spares === 'object') {
        // Fetch relation entities
        const salesPersonRepository = AppDataSource.getRepository(SalesPerson);
        const vendorRepository = AppDataSource.getRepository(Vendor);
        
        const salesPerson = spares.salesPerson 
          ? await salesPersonRepository.findOneBy({ id: typeof spares.salesPerson === 'number' ? spares.salesPerson : spares.salesPerson.id })
          : null;
        
        if (!salesPerson && spares.salesPerson) {
          throw new AppError(`SalesPerson with id ${spares.salesPerson} not found`, 404);
        }
        
        const vendor = spares.vendor 
          ? await vendorRepository.findOneBy({ id: typeof spares.vendor === 'number' ? spares.vendor : spares.vendor.id })
          : null;
        
        // Create or update spares
        if (existingJob.spares?.id) {
          // Update existing spares
          const existingSpares = await sparesRepository.findOneBy({ id: existingJob.spares.id });
          if (!existingSpares) {
            throw new AppError(`Spares with id ${existingJob.spares.id} not found`, 404);
          }
          
          existingSpares.product = spares.product;
          existingSpares.description = spares.description;
          existingSpares.amount = spares.amount || null;
          existingSpares.billNumber = spares.billNumber || null;
          existingSpares.status = spares.status || "Requested";
          existingSpares.salesPerson = salesPerson as any;
          existingSpares.vendor = vendor as any;
          
          sparesEntity = await sparesRepository.save(existingSpares);
        } else {
          // Create new spares
          const newSpares = sparesRepository.create({
            product: spares.product,
            description: spares.description,
            amount: spares.amount || null,
            billNumber: spares.billNumber || null,
            status: spares.status || "Requested",
            salesPerson: salesPerson as any,
            vendor: vendor as any,
          });
          sparesEntity = await sparesRepository.save(newSpares);
        }
      }
    }

    // Process complaints if provided (array of ids)
    if (complaints !== undefined) {
      if (Array.isArray(complaints) && complaints.length > 0) {
        complaintEntities = await complaintRepository.findByIds(complaints as number[]);
      } else {
        complaintEntities = [];
      }
    }

    // If spares was processed, add it to jobSheetData
    if (spares !== undefined) {
      jobSheetData.spares = sparesEntity;
    }

    // If complaints were processed, add them to jobSheetData
    if (complaints !== undefined) {
      jobSheetData.complaints = complaintEntities;
    }
    
    // Update job sheet - use save() to handle relations properly
    const jobSheet = await this.repo.findOneBy({ id });
    if (!jobSheet) {
      throw new AppError(`Job sheet with id ${id} not found`, 404);
    }
    
    // Merge the update data
    Object.assign(jobSheet, jobSheetData);
    
    const updated = await this.repo.save(jobSheet);
    
    // Fetch with all relations
    const updatedWithRelations = await this.getJobById(id);
    logger.info("Job sheet updated", { jobId: id });
    return updatedWithRelations;
  }

  async deleteJob(id: number) {
    await this.getJobById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Job sheet deleted", { jobId: id });
  }
}
