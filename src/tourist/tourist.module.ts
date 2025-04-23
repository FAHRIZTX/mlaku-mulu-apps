import { Module } from '@nestjs/common';
import { TouristService } from './tourist.service';
import { TouristController } from './tourist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tourist } from './tourist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tourist])],
  providers: [TouristService],
  controllers: [TouristController],
  exports: [TypeOrmModule, TouristService],
})
export class TouristModule {}
