// src/infrastructure/database/database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../../core/domain/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
