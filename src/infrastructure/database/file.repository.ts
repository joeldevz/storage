// src/infrastructure/database/file.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../../core/domain/entities/file.entity';
import { FileRepository } from '../../core/domain/repositories/file-repository.interface';

@Injectable()
export class TypeORMFileRepository implements FileRepository {
  constructor(
    @InjectRepository(File)
    private readonly repository: Repository<File>,
  ) {}

  async save(file: File): Promise<File> {
    return this.repository.save(file);
  }

  async findByPath(path: string): Promise<File | null> {
    return this.repository.findOne({ where: { path } });
  }
}
