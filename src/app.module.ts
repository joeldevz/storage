// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from './infrastructure/database/database.module';
import { FileService } from './core/services/file.service';
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';
import { GetFileUseCase } from './application/use-cases/get-file.use-case';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from './infrastructure/auth/roles.guard';
import { FileController } from './interfaces/controllers/file.controller';
import { S3Storage } from './infrastructure/storage/s3.storage';
import { CONFIG } from './config';
import { JwtService } from './infrastructure/auth/jwt.service';
import { config } from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
config();
console.log(CONFIG);
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    DatabaseModule,
    JwtModule.register({
      secret: CONFIG.jwt.secret,
      signOptions: { expiresIn: '60m' },
    }),
    PassportModule,
  ],
  controllers: [FileController, AppController],
  providers: [
    FileService,
    UploadFileUseCase,
    GetFileUseCase,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    S3Storage,
    JwtService,
    AppService,
  ],
})
export class AppModule {}
