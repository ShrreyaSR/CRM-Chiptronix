import { AppDataSource } from "../config/data-source";
import { Tray } from "../entities/Tray";

export const TrayRepository = AppDataSource.getRepository(Tray).extend({
  async createTray(dto: Tray) {
    const tray = this.create(dto);
    return await this.save(tray);
  },

  async findAll() {
    return await this.find();
  },
});
