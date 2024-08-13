import { Injectable, Logger } from '@nestjs/common';
import {
  BuildingTypeResponse,
  CreateBuildingTypeRequest,
  toBuildingTypeResponse,
} from '../models/building-type.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingType } from './entities/building-type.entity';

/**
 * A service class for managing building types.
 * @class BuildingTypeService
 */
@Injectable()
export class BuildingTypeService {
  /**
   * Creates an instance of BuildingTypeService.
   * @constructor
   * @param {Repository<BuildingType>} buildingTypeRepository - The repository for building types.
   */
  constructor(
    @InjectRepository(BuildingType)
    private readonly buildingTypeRepository: Repository<BuildingType>,
  ) {}

  /**
   * A logger for the class.
   * @property {Logger} logger
   */
  private readonly logger: Logger = new Logger(BuildingTypeService.name);

  /**
   * Seeds the building types.
   * @method seeds
   * @param {BuildingType[]} buildingTypeSeeds - The building types to seed.
   * @returns {Promise<BuildingTypeResponse[]>} The seeded building types.
   */
  async seeds(
    buildingTypeSeeds: BuildingType[],
  ): Promise<BuildingTypeResponse[]> {
    this.logger.debug(
      `BuildingTypeService.seeds(\n${JSON.stringify(buildingTypeSeeds)}\n)`,
    );
    const savedBuildingTypes =
      await this.buildingTypeRepository.save(buildingTypeSeeds);
    return savedBuildingTypes.map(toBuildingTypeResponse);
  }

  /**
   * Creates a building type.
   * @method create
   * @param {CreateBuildingTypeRequest} requestBody - The request body for creating a building type.
   * @returns {Promise<BuildingTypeResponse>} The created building type.
   */
  async create(
    requestBody: CreateBuildingTypeRequest,
  ): Promise<BuildingTypeResponse> {
    this.logger.debug(
      `BuildingTypeService.create(\n${JSON.stringify(requestBody)}\n)`,
    );
    const buildingType = new BuildingType();
    buildingType.name = requestBody.name;
    const savedBuildingType =
      await this.buildingTypeRepository.save(buildingType);
    return toBuildingTypeResponse(savedBuildingType);
  }

  /**
   * Gets all building types.
   * @method getAll
   * @returns {Promise<BuildingTypeResponse[]>} The building types.
   */
  async getAll(): Promise<BuildingTypeResponse[]> {
    this.logger.debug(`BuildingTypeService.findAll()`);
    const buildingTypes = await this.buildingTypeRepository.find();
    return buildingTypes.map(toBuildingTypeResponse);
  }

  /**
   * Gets a building type by its ID.
   * @method getOneById
   * @param {number} id - The ID of the building type.
   * @returns {Promise<BuildingTypeResponse | null>} The building type or null if not found.
   */
  async getOneById(id: number): Promise<BuildingTypeResponse | null> {
    this.logger.debug(`BuildingTypeService.getOneById(${id})`);
    const buildingType = await this.buildingTypeRepository.findOneBy({ id });
    if (!buildingType) return null;
    return toBuildingTypeResponse(buildingType);
  }

  /**
   * Gets a building type by its name.
   * @method getOneByName
   * @param {string} name - The name of the building type.
   * @returns {Promise<BuildingTypeResponse | null>} The building type or null if not found.
   */
  async getOneByName(name: string): Promise<BuildingTypeResponse | null> {
    this.logger.debug(`BuildingTypeService.getOneByName(${name})`);
    const buildingType = await this.buildingTypeRepository.findOneBy({ name });
    if (!buildingType) return null;
    return toBuildingTypeResponse(buildingType);
  }

  /**
   * Deletes a building type by its ID.
   * @method deleteOneById
   * @param {number} id - The ID of the building type to delete.
   * @returns {Promise<BuildingTypeResponse | null>} The deleted building type or null if not found.
   */
  async deleteOneById(id: number): Promise<BuildingTypeResponse | null> {
    this.logger.debug(`BuildingTypeService.deleteOneById(${id})`);
    const deletedBuildingType = await this.buildingTypeRepository.delete(id);
    if (deletedBuildingType.affected === 0) return null;
    return toBuildingTypeResponse(deletedBuildingType.raw);
  }
}
