import { Injectable } from '@nestjs/common';
import { CreateAcTypeDto } from './dto/create-ac-type.dto';
import { UpdateAcTypeDto } from './dto/update-ac-type.dto';

@Injectable()
export class AcTypeService {
  create(createAcTypeDto: CreateAcTypeDto) {
    return 'This action adds a new acType';
  }

  findAll() {
    return `This action returns all acType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} acType`;
  }

  update(id: number, updateAcTypeDto: UpdateAcTypeDto) {
    return `This action updates a #${id} acType`;
  }

  remove(id: number) {
    return `This action removes a #${id} acType`;
  }
}
