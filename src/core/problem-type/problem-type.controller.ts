import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Response } from '../models/api-response.model';
import {
  CreateProblemTypeRequest,
  ProblemTypeResponse,
} from '../models/problem-type.model';
import { ProblemTypeService } from './problem-type.service';
import { problemTypesSeeds } from './seeds/problem-type.seed';
@Controller('problem-type')
export class ProblemTypeController {
  constructor(private readonly problemTypeService: ProblemTypeService) {}
  private readonly logger: Logger = new Logger(ProblemTypeController.name);

  @Post()
  async create(
    @Body() requestBody: CreateProblemTypeRequest,
  ): Promise<Response<ProblemTypeResponse>> {
    this.logger.debug(
      `ProblemTypeController.create(\n${JSON.stringify(requestBody)}\n)`,
    );
    // let result;
    // try {
    // check if problem type is already exist by name
    const isProblemTypeExistByName = await this.problemTypeService.getOneByName(
      requestBody.name,
    );
    if (isProblemTypeExistByName) {
      this.logger.error(`Problem type name already exist`);
      throw new HttpException(
        { errors: 'Problem type name already exist' },
        409,
      );
    }

    const result = await this.problemTypeService.create(requestBody);
    // } catch (error) {
    //   console.log(error);
    //   this.logger.error(
    //     `ProblemTypeController.create(${JSON.stringify(requestBody)}): ${error.message}`,
    //   );
    //   throw new HttpException({ errors: error.response.errors }, error.status);
    // }
    return {
      message: 'Problem type created successfully',
      data: result,
    };
  }

  @Post('seeds')
  async seeds(): Promise<Response<ProblemTypeResponse[]>> {
    this.logger.debug(`ProblemTypeController.seeds()`);
    const result = await this.problemTypeService.seeds(problemTypesSeeds);
    return {
      message: 'Problem types seeded successfully',
      data: result,
    };
  }

  @Get()
  async getAll(): Promise<Response<ProblemTypeResponse[]>> {
    this.logger.debug(`ProblemTypeController.getAll()`);
    const results = await this.problemTypeService.getAll();
    this.logger.log(`ProblemTypeController.getAll(): success`);
    return {
      message: 'Problem types retrieved successfully',
      data: results ?? [],
    };
  }

  @Get(':id')
  async getOneById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<ProblemTypeResponse>> {
    this.logger.debug(`ProblemTypeController.getOneById(${id})`);
    const result = await this.problemTypeService.getOneById(id);
    if (!result) {
      this.logger.error(`ProblemTypeController.getOneById(${id}): not found`);
      throw new HttpException({ errors: 'Problem type not found' }, 404);
    }

    this.logger.log(`ProblemTypeController.getOneById(${id}): success`);
    return {
      message: 'Problem type retrieved successfully',
      data: result,
    };
  }

  @Delete(':id')
  async deleteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<ProblemTypeResponse>> {
    this.logger.debug(`ProblemTypeController.deleteById(${id})`);
    const result = await this.problemTypeService.deleteById(id);
    if (!result) {
      this.logger.error(`ProblemTypeController.deleteById(${id}): not found`);
      throw new HttpException({ errors: 'Problem type not found' }, 404);
    }
    this.logger.log(`ProblemTypeController.deleteById(${id}): success`);
    return {
      message: `Problem type  with id ${id} deleted successfully`,
    };
  }
}
