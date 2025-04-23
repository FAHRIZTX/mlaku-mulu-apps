import { BadRequestException, Controller, NotFoundException } from '@nestjs/common';
import { 
    Body,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { Trip } from './trip.entity';
import { UUID } from 'crypto';
import { TripRequestDto } from './trip.dto';
import { RestApiResponse } from 'src/utils/restapi';

@Controller('trip')
export class TripController {
  constructor(private service: TripService) {}

  @Get()
  async getAll(): Promise<RestApiResponse<Trip[]>> {
    return RestApiResponse.success(
      'Trips retrieved successfully',
      await this.service.getAll(),
    );
  }

  @Post()
  async create(@Body() data: TripRequestDto): Promise<RestApiResponse<Trip>> {
    if (!data.touristId || !data.tanggalMulaiPerjalanan || !data.tanggalBerakhirPerjalanan || !data.destinasiPerjalanan) {
      throw new BadRequestException('Tourist ID, Start Date, End Date, and Destination are required');
    }
    const existingTourist = await this.service.findOneByID(data.touristId);
    if (!existingTourist) {
      throw new NotFoundException('Tourist not found');
    }

    return RestApiResponse.success(
      'Trip created successfully',
      await this.service.create(data)
    );
  }

  @Put(':id')
  async update(@Param('id') id: UUID, @Body() data: Partial<Trip>): Promise<RestApiResponse<Trip|null>> {
    if (!data.tanggalMulaiPerjalanan && !data.tanggalBerakhirPerjalanan && !data.destinasiPerjalanan) {
      throw new BadRequestException('Start Date, End Date, or Destination is required');
    }
    const existingTrip = this.service.findOneByID(id);
    if (!existingTrip) {
      throw new NotFoundException('Trip not found');
    }

    return RestApiResponse.success(
      'Trip updated successfully',
      await this.service.update(id, data),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: UUID): Promise<RestApiResponse<string>> {
    const existingTrip = await this.service.findOneByID(id);
    if (!existingTrip) {
      throw new NotFoundException('Trip not found');
    }
    this.service.remove(id);
    return RestApiResponse.success(
      'Trip deleted successfully',
      `Trip with ID ${id} deleted successfully`,
    );
  }
}
