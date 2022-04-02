import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { AuthResolver, AuthService } from './auth';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    // JwtModule.registerAsync({
    //   useFactory: () => ({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: {
    //       expiresIn: '30s',
    //     },
    //   }),
    // }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // esse nao

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // useFactory: async (configService: ConfigService) => ({
      useFactory: async () => ({
        // secretOrPrivateKey: configService.get<string>('JWT_SECRET'),
        secretOrPrivateKey: process.env.JWT_SECRET,
        signOptions: {
          // expiresIn: configService.get<string|number>('JWT_EXPIRES'),
          expiresIn: process.env.JWT_EXPIRES,
        },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver, UsersService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
