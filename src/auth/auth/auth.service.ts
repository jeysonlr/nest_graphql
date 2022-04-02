import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { subscribe } from 'graphql';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthInput, AuthType } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
    ) {}

  async validateUser(data: AuthInput): Promise<AuthType> {
    const user = await this.userService.findUserByEmail(data.email);

    const validPasssword = compareSync(data.password, user.password);

    if(!validPasssword) {
      throw new UnauthorizedException('Incorrect password')
    }

    const token = await this.jwtToken(user);

    return {
      user,
      token
    }
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = { username: user.firstName, sub: user.userId };
    return this.jwtService.signAsync(payload);
  }
}