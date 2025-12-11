import { TrayRepository } from "../repositories/TrayRepository";
import { Tray } from "../entities/Tray";
import { AppError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class TrayService {
  private repo = TrayRepository;

  async getAllTrays(options: { sortField: string; sortOrder: "ASC" | "DESC" }) {
    const { sortField, sortOrder } = options;

    const query = this.repo.createQueryBuilder("tray");
    
    // Cast trayNumber to integer for proper numeric sorting
    if (sortField === "trayNumber") {
      query.orderBy(`CAST(tray.trayNumber AS INTEGER)`, sortOrder);
    } else {
      query.orderBy(`tray.${sortField}`, sortOrder);
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async getTrayById(id: number): Promise<Tray> {
    const tray = await this.repo.findOneBy({ id });
    if (!tray) {
      throw new AppError(`Tray with id ${id} not found`, 404);
    }
    return tray;
  }

  async createTray(dto: Partial<Tray>): Promise<Tray> {
    // Check if tray number already exists
    if (dto.trayNumber !== undefined) {
      const existing = await this.repo.findOne({
        where: { trayNumber: dto.trayNumber as any },
      });
      if (existing) {
        throw new AppError(`Tray number ${dto.trayNumber} already exists`, 400);
      }
    }

    const tray = this.repo.create({
      ...dto,
      status: dto.status || "Free",
    } as Tray);
    
    const saved = await this.repo.save(tray);
    logger.info("Tray created", { trayId: saved.id, trayNumber: saved.trayNumber });
    return saved;
  }

  async updateTray(id: number, dto: Partial<Tray>): Promise<Tray> {
    const tray = await this.getTrayById(id);

    // Check if new tray number conflicts
    if (dto.trayNumber !== undefined && dto.trayNumber !== tray.trayNumber) {
      const existing = await this.repo.findOne({
        where: { trayNumber: dto.trayNumber as any },
      });
      if (existing) {
        throw new AppError(`Tray number ${dto.trayNumber} already exists`, 400);
      }
    }

    await this.repo.update(id, dto);
    const updated = await this.repo.findOneBy({ id });
    
    logger.info("Tray updated", { trayId: id });
    return updated!;
  }

  async deleteTray(id: number): Promise<void> {
    await this.getTrayById(id); // Throws if not found
    await this.repo.delete(id);
    logger.info("Tray deleted", { trayId: id });
  }

  async bulkUpload(totalCount: number) {
    const count = Number(totalCount);
    if (isNaN(count) || count <= 0) {
      throw new AppError("Invalid totalCount. Must be a positive number", 400);
    }

    const existingTrays = await this.repo.find();
    const currentCount = existingTrays.length;

    if (count <= currentCount) {
      throw new AppError(
        `Total count (${count}) must be greater than current count (${currentCount})`,
        400
      );
    }

    const newTrays: Tray[] = [];
    for (let i = currentCount + 1; i <= count; i++) {
      newTrays.push({
        trayNumber: i,
        status: "Free",
      } as Tray);
    }

    if (newTrays.length > 0) {
      await this.repo.save(newTrays);
      logger.info("Bulk trays created", { count: newTrays.length });
    }

    const finalCount = await this.repo.count();

    return {
      inserted: newTrays.length,
      previous: currentCount,
      total: finalCount,
      message: `✅ Added ${newTrays.length} new trays. Total trays now: ${finalCount}.`,
    };
  }
}
