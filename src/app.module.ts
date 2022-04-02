import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DatabaseType } from 'typeorm';
import { AuthModule } from './auth/auth.module';
dotenv.config();

type PostgresType = 'postgres';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: './schema.gql',
      context: ({ req }) => ({ req }),
      debug: true,
      playground: true,
    }),
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
      type: process.env.POSTGRES_TYPE as DatabaseType & PostgresType,
      // host: process.env.HOST_DATABASE_APPLICATION, // PARA CONECTAR NO BANCO DO CONTAINER EXECUTANDO A APLICACAO FORA DO CONTAINER
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
