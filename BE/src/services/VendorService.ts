import { VendorRepository } from "../repositories/VendorRepository";
import { Vendor } from "../entities/Vendor";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class VendorService {
  private repo = VendorRepository;
  
  async getAllVendors(options: {
    search: string;
    sortField: string;
    sortOrder: "ASC" | "DESC";
  }) {
    const { search, sortField, sortOrder } = options;

    const query = this.repo.createQueryBuilder("vendor");

    if (search) {
      query.where("vendor.name ILIKE :search", { search: `%${search}%` });
    }

    query.orderBy(`vendor.${sortField}`, sortOrder);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async getVendorById(id: number): Promise<Vendor> {
    const vendor = await this.repo.findOneBy({ id });
    if (!vendor) {
      throw new AppError(`Vendor with id ${id} not found`, 404);
    }
    return vendor;
  }

  async createVendor(dto: Vendor) {
    const vendor = this.repo.create(dto);
    const saved = await this.repo.save(vendor);
    logger.info("Vendor created", { vendorId: saved.id });
    return saved;
  }

  async updateVendor(id: number, dto: Partial<Vendor>) {
    await this.getVendorById(id); // Throws if not found
    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    logger.info("Vendor updated", { vendorId: id });
    return updated!;
  }

  async deleteVendor(id: number) {
    await this.getVendorById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Vendor deleted", { vendorId: id });
  }
}
