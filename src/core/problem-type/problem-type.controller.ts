import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpException,
} from '@nestjs/common';
import { ProblemTypeService } from './problem-type.service';
import {
  CreateProblemTypeRequest,
  ProblemTypeResponse,
  UpdateProblemTypeRequest,
} from '../models/problem-type.model';
import { Response } from '../models/api-response.model';
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
    let result;
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

    result = await this.problemTypeService.create(requestBody);
    // } catch (error) {
    //   this.logger.error(
    //     `ProblemTypeController.create(${JSON.stringify(requestBody)}): ${error.message}`,
    //   );
    //   throw new HttpException({ errors: error.message }, 500);
    // }
    return {
      message: 'Problem type created successfully',
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.problemTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemTypeService.getOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() requestBody: UpdateProblemTypeRequest,
  ) {
    return this.problemTypeService.update(+id, requestBody);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemTypeService.remove(+id);
  }
}
