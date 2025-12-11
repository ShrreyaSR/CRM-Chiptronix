import { AppDataSource } from "../config/data-source";
import { Tray } from "../entities/Tray";

export const TrayRepository = AppDataSource.getRepository(Tray).extend({});
