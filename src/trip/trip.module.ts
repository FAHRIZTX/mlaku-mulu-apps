import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { Trip } from './trip.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tourist } from 'src/tourist/tourist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Tourist])],
  providers: [TripService],
  controllers: [TripController],
  exports: [TypeOrmModule, TripService],
})
export class TripModule {}
