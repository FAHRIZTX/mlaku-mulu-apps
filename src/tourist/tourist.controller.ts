import { BadRequestException, Controller, NotFoundException, Query, Res } from '@nestjs/common';
import { 
    Body,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { TouristService } from './tourist.service';
import { Tourist } from './tourist.entity';
import { UUID } from 'crypto';
import { Trip } from 'src/trip/trip.entity';
import { Public } from 'src/auth/decorators/public.decorator';
import { RestApiResponse } from 'src/utils/restapi';

@Controller('tourist')
export class TouristController {
  constructor(private service: TouristService) {}

  @Get()
  async getAll(): Promise<RestApiResponse<Tourist[]>> {
    return RestApiResponse.success(
      'Tourists retrieved successfully',
      await this.service.getAll(),
    );
  }

  @Post()
  async create(@Body() data: Partial<Tourist>): Promise<RestApiResponse<Tourist>> {
    if (!data.email || !data.name) {
      throw new BadRequestException('Email and Name is required');
    }

    const existingTourist = await this.service.findOneByEmail(data.email);
    if (existingTourist) {
      throw new BadRequestException('Email already exists');
    }

    return RestApiResponse.success(
      'Tourist created successfully',
      await this.service.create(data),
    );
  }

  @Put(':id')
  async update(@Param('id') id: UUID, @Body() data: Partial<Tourist>): Promise<RestApiResponse<Tourist|null>> {
    if (!data.email && !data.name) {
      return RestApiResponse.error('Email or Name is required');
    }

    const existingTourist = await this.service.findOneByID(id);
    if (!existingTourist) {
      throw new NotFoundException('Tourist not found');
    }

    if (data.email) {
      const emailExists = await this.service.findOneByEmail(data.email);
      if (emailExists && emailExists.id !== id) {
        throw new BadRequestException('Email already exists');
      }
    }
    return RestApiResponse.success(
      'Tourist updated successfully',
      await this.service.update(id, data),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: UUID): Promise<RestApiResponse<string>> {
    const existingTourist = await this.service.findOneByID(id);
    if (!existingTourist) {
      throw new NotFoundException('Tourist not found');
    }

    this.service.remove(id)
    return RestApiResponse.success('Tourist deleted successfully');
  }

  @Public()
  @Get('/trips')
  async getTrips(@Query() data: { email: string }): Promise<RestApiResponse<Trip[]>> {
    const { email } = data;
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const tourist = await this.service.findOneByEmail(email);
    if (!tourist) {
      throw new NotFoundException('Tourist not found');
    }

    return RestApiResponse.success(
      'Trips retrieved successfully',
      tourist.trips,
    );
  }
}
