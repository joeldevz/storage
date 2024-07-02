import {
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  Req,
  NotFoundException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../../infrastructure/auth/roles.decorator';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case';
import { GetFileUseCase } from '../../application/use-cases/get-file.use-case';
import { Response } from 'express';
import { S3Storage } from '../../infrastructure/storage/s3.storage';
import { CreateFileDto } from '../dtos/create-file.dto';
import { v4 as uuid } from 'uuid';
import { formatPath } from '../../utils/formatPath';
import { JwtService } from '../../infrastructure/auth/jwt.service';
@Controller('files')
export class FileController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly getFileUseCase: GetFileUseCase,
    private readonly s3Storage: S3Storage,
    private readonly jwtService: JwtService, // Inyecta el servicio JWT personalizado
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'student', 'CS')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto,
    @Req() req: any,
  ) {
    const formattedPath = formatPath(createFileDto.path);
    const filePath = `${formattedPath}/${file.originalname}`;
    const newFile = {
      filename: file.originalname,
      path: filePath,
      role: req.user?.roles[0] || 'CS', // Assuming the user has only one role
      uploader: req.user?.username || 'CS', // Assuming the user has only one role
      uploadedAt: new Date(),
    };

    const filesave = await this.uploadFileUseCase.execute(
      {
        ...newFile,
        id: uuid(),
      },
      file,
    );
    const _uuid = req?.user?.uuid; // Asegúrate de tener estos valores disponibles
    const role = req?.user?.roles[0];
    const issuedAt = new Date(); // Usa el objeto de fecha actual o el que necesites
    const jwt = await this.jwtService.sign(_uuid, role, issuedAt);

    return { file: filesave, token: jwt };
  }

  @Get('*')
  async getFile(@Param() params, @Res() res: Response) {
    const filePath = params[0];
    console.log(filePath);
    const file = await this.getFileUseCase.execute(filePath);
    console.log(file);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    const fileBuffer = await this.s3Storage.getFileBuffer(file.path);
    const fileExtension = filePath.split('.').pop();
    let contentType = 'application/octet-stream'; // Tipo de contenido por defecto

    switch (fileExtension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      // Agregar más casos según sea necesario
    }

    res.setHeader('Content-Type', contentType);
    res.send(fileBuffer);
  }
}
