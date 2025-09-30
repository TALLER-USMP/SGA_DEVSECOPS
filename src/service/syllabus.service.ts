import { SyllabusRepository } from "../repositories/syllabus.repository";

export class SyllabusService {
  private syllabusRepo = new SyllabusRepository();

  async searchSyllabus(filtros: {
    nombre?: string;
    ciclo?: string;
    estado?: string;
  }) {
    const syllabus = await this.syllabusRepo.findByNameCycleStatus(filtros);
    if (!syllabus) throw new Error("Usuario no encontrado");
    return syllabus;
  }
}
