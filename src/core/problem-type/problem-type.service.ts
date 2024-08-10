import { Injectable, Logger } from '@nestjs/common';
import {
  CreateProblemTypeRequest,
  ProblemTypeResponse,
  toProblemTypeResponse,
  UpdateProblemTypeRequest,
} from '../models/problem-type.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findAll() {
    return `This action returns all problemType`;
  }

  getOneById(id: number) {
    return `This action returns a #${id} problemType`;
  }

  async getOneByName(name: string): Promise<ProblemTypeResponse | null> {
    this.logger.debug(`ProblemTypeService.getOneByName(${name})`);
    const problemType = await this.problemTypesRepository.findOneBy({
      name,
    });
    if (!problemType) return null;

    return toProblemTypeResponse(problemType);
  }

  update(id: number, requestBody: UpdateProblemTypeRequest) {
    return `This action updates a #${id} problemType`;
  }

  remove(id: number) {
    return `This action removes a #${id} problemType`;
  }
}
