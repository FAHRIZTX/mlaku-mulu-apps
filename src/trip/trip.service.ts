import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Tourist } from '../tourist/tourist.entity';
import { Trip } from './trip.entity';
import { UUID } from 'crypto';
import { TripRequestDto } from './trip.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private repo: Repository<Trip>,
    @InjectRepository(Tourist) private touristRepo: Repository<Tourist>,
  ) {}

  getAll() {
      return this.repo.find({ relations: ['tourist'] });
  }

  findOneByID(id: UUID) {
    return this.repo.findOne({ where: { id }, relations: ['tourist'] });
  }

  async create(data: TripRequestDto) {
    const tourist: Partial<Tourist> | null = await this.touristRepo.findOneBy({ id: data.touristId });
    if (!tourist) {
      throw new BadRequestException('Tourist not found');
    }

    const dataFix = {
      tanggalMulaiPerjalanan: dayjs(data.tanggalMulaiPerjalanan).toISOString(),
      tanggalBerakhirPerjalanan: dayjs(data.tanggalBerakhirPerjalanan).toISOString(),
      destinasiPerjalanan: data.destinasiPerjalanan,
      tourist
    }

    const trip = this.repo.create(dataFix);
    return this.repo.save(trip);
  }

  async update(id: UUID, data: Partial<Trip>) {
    const trip = await this.repo.findOne({ where: { id }, relations: ['tourist'] });
    if (!trip) {
      throw new BadRequestException('Trip not found');
    }
    await this.repo.update(id, data);
    return this.findOneByID(id);
  }

  async remove(id: UUID) {
    return this.repo.delete(id);;
  }
}

