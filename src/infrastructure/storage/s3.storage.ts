import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
@Injectable()
export class S3Storage {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3();
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: path,
      Body: file.buffer,
      ACL: 'private', // or 'public-read' depending on your requirements
    };

    return this.s3.upload(params).promise();
  }

  async getFileUrl(key: string): Promise<string> {
    const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key };
    return this.s3.getSignedUrlPromise('getObject', params);
  }

  async getFileBuffer(key: string): Promise<Buffer> {
    const params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key };
    const data = await this.s3.getObject(params).promise();
    return data.Body as Buffer;
  }
}
