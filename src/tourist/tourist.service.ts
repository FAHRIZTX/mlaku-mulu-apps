import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tourist } from './tourist.entity';
import { UUID } from 'crypto';

@Injectable()
export class TouristService {
  constructor(@InjectRepository(Tourist) private repo: Repository<Tourist>) {}

  getAll() {
    return this.repo.find();
  }

  findOneByID(id: UUID) {
    return this.repo.findOne({ where: { id }, relations: ['trips'] });
  }

  findOneByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['trips'] });
  }

  async create(data: Partial<Tourist>) {
    const tourist = this.repo.create(data);
    return this.repo.save(tourist);
  }

  async update(id: UUID, data: Partial<Tourist>) {
    await this.repo.update(id, data);
    return this.findOneByID(id);
  }

  async remove(id: UUID) {
    await this.repo.delete(id);
  }
}

