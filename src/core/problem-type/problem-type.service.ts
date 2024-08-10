import { Injectable } from '@nestjs/common';
import {
  CreateProblemTypeRequest,
  UpdateProblemTypeRequest,
} from '../models/problem-type.model';

@Injectable()
export class ProblemTypeService {
  create(requestBody: CreateProblemTypeRequest) {
    return 'This action adds a new problemType';
  }

  findAll() {
    return `This action returns all problemType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} problemType`;
  }

  update(id: number, requestBody: UpdateProblemTypeRequest) {
    return `This action updates a #${id} problemType`;
  }

  remove(id: number) {
    return `This action removes a #${id} problemType`;
  }
}
