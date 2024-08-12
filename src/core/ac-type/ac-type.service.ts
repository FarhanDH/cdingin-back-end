import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AcTypeResponse,
  CreateAcTypeRequest,
  toAcTypeResponse,
} from '../models/ac-type.model';
import { AcType } from './entities/ac-type.entity';

@Injectable()
export class AcTypeService {
  constructor(
    @InjectRepository(AcType)
    private readonly acTypeRepository: Repository<AcType>,
  ) {}
  private readonly logger: Logger = new Logger(AcTypeService.name);
  async create(
    createAcTypeRequest: CreateAcTypeRequest,
  ): Promise<AcTypeResponse> {
    this.logger.debug(
      `AcTypeService.create(${JSON.stringify(createAcTypeRequest)})`,
    );
    const acType = new AcType();
    acType.name = createAcTypeRequest.name;
    acType.description = createAcTypeRequest.description;

    // save to db
    const savedAcType = await this.acTypeRepository.save(acType);
    return toAcTypeResponse(savedAcType);
  }

  async getOneByName(name: string): Promise<AcType | null> {
    this.logger.debug(`AcTypeService.getOneByName(${name})`);
    return await this.acTypeRepository.findOneBy({ name });
  }
  async getAll(): Promise<AcTypeResponse[]> {
    this.logger.debug(`AcTypeService.getAll()`);
    const acTypes = await this.acTypeRepository.find();
    return acTypes.map(toAcTypeResponse);
  }

  async getOneById(id: number): Promise<AcTypeResponse | null> {
    this.logger.debug(`AcTypeService.getOneById(${id})`);
    const acType = await this.acTypeRepository.findOneBy({ id });
    if (!acType) return null;
    return toAcTypeResponse(acType);
  }

  async deleteOneById(id: number): Promise<AcTypeResponse | null> {
    this.logger.debug(`AcTypeService.deleteOneById(${id})`);
    const deletedAcType = await this.acTypeRepository.delete(id);
    console.log(deletedAcType);
    if (deletedAcType.affected === 0) return null;
    return toAcTypeResponse(deletedAcType.raw);
  }
}
