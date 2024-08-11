import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateProblemTypeRequest,
  ProblemTypeResponse,
  toProblemTypeResponse,
} from '../models/problem-type.model';
import { ProblemType } from './entities/problem-type.entity';

@Injectable()
export class ProblemTypeService {
  constructor(
    @InjectRepository(ProblemType)
    private readonly problemTypesRepository: Repository<ProblemType>,
  ) {}
  private readonly logger: Logger = new Logger(ProblemTypeService.name);
  async create(
    requestBody: CreateProblemTypeRequest,
  ): Promise<ProblemTypeResponse> {
    this.logger.debug(
      `ProblemTypeService.create(\n${JSON.stringify(requestBody)}\n)`,
    );
    const problemType = new ProblemType();
    problemType.name = requestBody.name;
    problemType.description = requestBody.description;
    const savedProblemType =
      await this.problemTypesRepository.save(problemType);
    return toProblemTypeResponse(savedProblemType);
  }

  async getAll(): Promise<ProblemTypeResponse[] | null> {
    this.logger.debug(`ProblemTypeService.getAll()`);
    // get all problem types
    const problemTypes = await this.problemTypesRepository.find();
    // if (problemTypes.length === 0) return null;
    return problemTypes.map(toProblemTypeResponse);
  }

  async getOneById(id: number): Promise<ProblemTypeResponse | null> {
    this.logger.debug(`ProblemTypeService.getOneById(${id})`);
    const problemType = await this.problemTypesRepository.findOneBy({
      id,
    });
    if (!problemType) return null;

    return toProblemTypeResponse(problemType);
  }

  async getOneByName(name: string): Promise<ProblemTypeResponse | null> {
    this.logger.debug(`ProblemTypeService.getOneByName(${name})`);
    const problemType = await this.problemTypesRepository.findOneBy({
      name,
    });
    if (!problemType) return null;

    return toProblemTypeResponse(problemType);
  }

  /**
   * Deletes a problem type by its ID.
   *
   * @param id - The unique identifier of the problem type to delete.
   * @returns A promise that resolves to the deleted problem type, or null if no problem type was found with the given ID.
   *          The returned object is transformed into a ProblemTypeResponse using the `toProblemTypeResponse` function.
   * @throws Will throw an error if the deletion operation fails.
   */
  async deleteById(id: number): Promise<ProblemTypeResponse | null> {
    this.logger.debug(`ProblemTypeService.deleteById(${id})`);
    const problemType = await this.problemTypesRepository.delete({ id });
    if (problemType.affected === 0) return null;
    console.log(problemType.affected);
    return toProblemTypeResponse(problemType.raw);
  }
}
