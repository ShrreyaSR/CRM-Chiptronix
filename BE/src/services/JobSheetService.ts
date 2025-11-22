import { JobSheetRepository } from "../repositories/JobSheetRepository";

export class JobSheetService {
  async getAllJobs(query: any) {
    return await JobSheetRepository.findAll(query);
  }

  async createJob(data: any) {
    return await JobSheetRepository.createJobSheet(data);
  }

  async updateJob(id: number, data: any) {
    return await JobSheetRepository.updateJob(id, data);
  }

  async deleteJob(id: number) {
    return await JobSheetRepository.deleteJob(id);
  }
}
