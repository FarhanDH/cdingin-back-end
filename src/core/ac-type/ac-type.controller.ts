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
import { AcTypeService } from './ac-type.service';
import { AcTypeResponse, CreateAcTypeRequest } from '../models/ac-type.model';
import { Response } from '../models/api-response.model';

@Controller('ac-type')
export class AcTypeController {
  constructor(private readonly acTypeService: AcTypeService) {}
  private logger: Logger = new Logger(AcTypeController.name);

  @Post()
  async create(
    @Body() requestBody: CreateAcTypeRequest,
  ): Promise<Response<AcTypeResponse>> {
    this.logger.debug(
      `AcTypeController.create(\n${JSON.stringify(requestBody)}\n)`,
    );
    // check if ac type exist by name
    if (await this.acTypeService.getOneByName(requestBody.name)) {
      this.logger.error(`AC type with name ${requestBody.name} already exist`);
      throw new HttpException({ errors: 'AC type already exist' }, 409);
    }
    const result = await this.acTypeService.create(requestBody);
    this.logger.log(
      `AcTypeController.create(${JSON.stringify(requestBody)}): success`,
    );
    return {
      message: 'AC type created successfully',
      data: result,
    };
  }

  @Get()
  async getAll(): Promise<Response<AcTypeResponse[]>> {
    this.logger.debug(`AcTypeController.getAll()`);
    const result = await this.acTypeService.getAll();
    return {
      message: 'AC types retrieved successfully',
      data: result ?? [],
    };
  }

  @Get(':id')
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<AcTypeResponse>> {
    this.logger.debug(`AcTypeController.getOneById(${id})`);
    const acType = await this.acTypeService.getOneById(id);
    if (!acType) {
      this.logger.error(`AC type with id ${id} not found`);
      throw new HttpException({ errors: 'AC type not found' }, 404);
    }
    return {
      message: 'AC type retrieved successfully',
      data: acType,
    };
  }

  @Delete(':id')
  async deleteOneById(@Param('id', ParseIntPipe) id: number) {
    this.logger.debug(`AcTypeController.deleteOneById(${id})`);
    const deletedAcType = await this.acTypeService.deleteOneById(id);
    if (!deletedAcType) {
      this.logger.error(`AC type with id ${id} not found`);
      throw new HttpException({ errors: 'AC type not found' }, 404);
    }
    this.logger.log(`AcTypeController.deleteOneById(${id}): success`);
    return {
      message: 'AC type deleted successfully',
    };
  }
}
