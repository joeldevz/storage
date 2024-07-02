import { Injectable } from '@nestjs/common';
import { FileService } from '../../core/services/file.service';
import { File } from '../../core/domain/entities/file.entity';
import { S3Storage } from '../../infrastructure/storage/s3.storage';

@Injectable()
export class UploadFileUseCase {
  constructor(
    private readonly fileService: FileService,
    private readonly s3Storage: S3Storage,
  ) {}

  async execute(file: File, fileBuffer: Express.Multer.File): Promise<File> {
    await this.s3Storage.uploadFile(fileBuffer, file.path);
    return this.fileService.uploadFile(file);
  }
}
