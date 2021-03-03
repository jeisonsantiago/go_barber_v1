import IStorageProvider from "../models/IStorageProver";

import IStorageProver from '../models/IStorageProver';
import fs from 'fs';
import path from 'path';
import aws, {S3} from 'aws-sdk';
import uploadConfig from '@config/upload';
import mime from 'mime';
import AppError from "@shared/errors/AppErrors";

class S3StorageProvider implements IStorageProvider {
  private client:S3;

  constructor(){
    this.client = new aws.S3({
      region:'us-east-2',
    });
  }

  public async saveFile(file: string): Promise<string> {

    const originalPath = path.resolve(uploadConfig.tmpFolder,file);

    // for images in the S3 Amazon, can't have utf-8 encoding
    const fileContent = await fs.promises.readFile(originalPath);

    const mimeType = mime.getType(originalPath);
    if(!mimeType){
      throw new AppError('File not found');
    }

    try {
      await this.client.putObject({
        Bucket:uploadConfig.config.aws.bucket,
        Key: file,
        ACL:'public-read',
        Body: fileContent,
        ContentType: mimeType,
        // ContentDisposition: `inline; filename=${file}`,
      }).promise(); // put promise so you can wait for the termination

      await fs.promises.unlink(originalPath);
    } catch (error) {
      console.log(error);
    }

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket:uploadConfig.config.aws.bucket,
      Key:file,
    }).promise();
  }
}

export default S3StorageProvider;
