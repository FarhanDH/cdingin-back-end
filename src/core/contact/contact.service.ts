import { Injectable } from '@nestjs/common';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async getContactByEmail(email: string): Promise<Contact | null> {
    return await this.contactRepository.findOne({
      where: { email: email ? email : '' },
    });
  }

  async getContactByPhone(phone: string): Promise<Contact | null> {
    return await this.contactRepository.findOne({ where: { phone } });
  }
}
