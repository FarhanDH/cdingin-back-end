import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { BuildingTypeService } from './building-type.service';
import {
  BuildingTypeResponse,
  CreateBuildingTypeRequest,
} from '../models/building-type.model';
import { Response } from '../models/api-response.model';
import { buildingTypesSeeds } from './seeds/building-type.seed';

@Controller('building-type')
export class BuildingTypeController {
  constructor(private readonly buildingTypeService: BuildingTypeService) {}
  private readonly logger: Logger = new Logger(BuildingTypeController.name);

  @Post('seeds')
  async seeds(): Promise<Response<BuildingTypeResponse[]>> {
    this.logger.debug(`BuildingTypeController.seeds()`);
    const result = await this.buildingTypeService.seeds(buildingTypesSeeds);
    return {
      message: 'Building types seeded successfully',
      data: result,
    };
  }

  @Post()
  async create(
    @Body() requestBody: CreateBuildingTypeRequest,
  ): Promise<Response<BuildingTypeResponse>> {
    this.logger.debug(
      `BuildingTypeController.create(\n${JSON.stringify(requestBody)}\n)`,
    );
    // check if building type already exist by name
    const isBuildingTypeAlreadyExistByName =
      await this.buildingTypeService.getOneByName(requestBody.name);
    if (isBuildingTypeAlreadyExistByName) {
      this.logger.error(`Building type already exist`);
      throw new HttpException('Building type already exist', 409);
    }
    const result = await this.buildingTypeService.create(requestBody);
    return {
      message: 'Building type created successfully',
      data: result,
    };
  }

  @Get()
  async getAll(): Promise<Response<BuildingTypeResponse[]>> {
    this.logger.debug(`BuildingTypeController.getAll()`);
    const buildingTypes = await this.buildingTypeService.getAll();
    return {
      message: 'Building types retrieved successfully',
      data: buildingTypes ?? [],
    };
  }

  @Get(':id')
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<BuildingTypeResponse>> {
    this.logger.debug(`BuildingTypeController.getOneById(${id})`);
    const buildingType = await this.buildingTypeService.getOneById(id);

    if (!buildingType) {
      this.logger.error(`Building type not found`);
      throw new HttpException('Building type not found', 404);
    }

    return {
      message: 'Building type retrieved successfully',
      data: buildingType,
    };
  }

  @Delete(':id')
  async deleteOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<BuildingTypeResponse>> {
    this.logger.debug(`BuildingTypeController.deleteOneById(${id})`);
    const result = await this.buildingTypeService.deleteOneById(id);
    if (!result) {
      this.logger.error(`Building type not found`);
      throw new HttpException('Building type not found', 404);
    }
    return {
      message: 'Building type deleted successfully',
    };
  }
}
