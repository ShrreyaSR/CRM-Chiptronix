import { TrayRepository } from "../repositories/TrayRepository";
import { Tray } from "../entities/Tray";

export class TrayService {
  private repo = TrayRepository;

  async getAllTrays(options: { sortField: string; sortOrder: string }) {
  const { sortField, sortOrder } = options;

  const query = this.repo.createQueryBuilder("tray");

  if (sortField === "trayNumber") {
    query.orderBy(
      `CAST(tray.trayNumber AS INTEGER)`,
      sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"
    );
  } else {
    query.orderBy(
      `tray.${sortField}`,
      sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC"
    );
  }
  
  const [data, total] = await query.getManyAndCount();
  return { data, total };
}

  async createTray(dto: Tray) {
    const existing = await this.repo.findOne({
      where: { trayNumber: dto.trayNumber },
    });
    if (existing) throw new Error("Tray number must be unique");
    return await this.repo.createTray(dto);
  }

  async deleteTray(id: number) {
    await this.repo.delete(id);
  }

  async updateTray(id: number, dto: Partial<Tray>) {
    await this.repo.update(id, dto);
    return await this.repo.findOneBy({ id });
  }

  async bulkUpload(totalCount: number) {
    const count = Number(totalCount);
    if (isNaN(count) || count <= 0) {
      throw new Error("Invalid totalCount");
    }

    const existingTrays = await this.repo.find();
    const currentCount = existingTrays.length;

    const newTrays: Tray[] = [];
    for (let i = currentCount + 1; i <= count; i++) {
      newTrays.push({
        trayNumber: i,
        status: "Free",
      } as Tray);
    }

    if (newTrays.length > 0) {
      await this.repo.save(newTrays);
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
