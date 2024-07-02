// src/core/services/file.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../domain/entities/file.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async uploadFile(file: File): Promise<File> {
    return this.fileRepository.save(file);
  }

  async getFile(path: string): Promise<File | null> {
    return this.fileRepository.findOne({ where: { path } });
  }
}
