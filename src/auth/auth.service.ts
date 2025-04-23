import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';
import { AccessToken } from './types/AccessToken';
import { UsersService } from 'src/users/users.service';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LoginRequestDto } from './dtos/login-request.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User | null = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }

    return user;
  }

  async login(user: LoginRequestDto): Promise<AccessToken> {
    if (!user || !user.email || !user.password) {
      throw new BadRequestException('Email and Password are required');
    }

    const validateUser = await this.validateUser(user.email, user.password);
    if (!validateUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { email: validateUser.email, id: validateUser.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async register(user: RegisterRequestDto): Promise<AccessToken> {
    if (!user || !user.name || !user.email || !user.password) {
      throw new BadRequestException('Name, Email, and Password are required');
    }

    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser: User = {id: randomUUID(), ...user, password: hashedPassword };
    await this.usersService.create(newUser);

    const loginUser: LoginRequestDto = {email: user.email, password: user.password}

    return this.login(loginUser);
  }

  async user(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token);
    if (!decoded) {
      throw new BadRequestException('Invalid token');
    }

    const user: User | null = await this.usersService.findOneById(
      decoded.id,
    );
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
