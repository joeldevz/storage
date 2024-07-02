import { Injectable } from '@nestjs/common';
import { FileService } from '../../core/services/file.service';
import { File } from '../../core/domain/entities/file.entity';

@Injectable()
export class GetFileUseCase {
  constructor(private readonly fileService: FileService) {}

  async execute(path: string): Promise<File | null> {
    return this.fileService.getFile(path);
  }
}
