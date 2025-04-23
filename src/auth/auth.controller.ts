import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { RegisterResponseDTO } from './dtos/register-response.dto';
import { Public } from './decorators/public.decorator';
import { LoginRequestDto } from './dtos/login-request.dto';
import { User } from 'src/users/users.entity';
import { RestApiResponse } from 'src/utils/restapi';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: LoginRequestDto): Promise<LoginResponseDTO | BadRequestException> {
    return this.authService.login(loginBody);
  }

  @Post('register')
  async register(
    @Body() registerBody: RegisterRequestDto,
  ): Promise<RegisterResponseDTO | BadRequestException> {
    return await this.authService.register(registerBody);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async user(@Headers() headers: Record<string, string>): Promise<RestApiResponse<Partial<User>>> {
    const token: string = headers['authorization'] ? headers['authorization']!.split(' ')[1] : '';
    const user: User = await this.authService.user(token);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return RestApiResponse.success(
      'User retrieved successfully',
      userWithoutPassword,
    );
  }
}
