import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config'

import { LimitOnUpdateNotSupportedError, Repository, EntityNotFoundError } from 'typeorm';
import { PaginationQueryDto, UploadFileDto, UpdateFileDto } from './dto';
import { File } from './entities';
import { AwsS3Service } from '../aws-s3/aws-s3.service';
import { Readable } from 'stream';


@Injectable()
export class FileService {

    constructor(
        @InjectRepository(File) private readonly fileRepository: Repository<File>,
        private readonly configService: ConfigService,
        private readonly awsS3Service: AwsS3Service,
    ){
        
    }

    async get({ limit, offset }: PaginationQueryDto): Promise<File[]> {
        return await this.fileRepository.find({
            relations: ['user'],
            skip: offset,
            take: limit,
        });
    }

    async updateFile(updateFileDto: UpdateFileDto): Promise<File> {
        const file: File = await this.fileRepository.findOne({
            where: { id: updateFileDto.id }
        });

        if (file === null) {
            throw new EntityNotFoundError(File, { id: updateFileDto.id });
        }

        file.name = updateFileDto.name;

        return await this.fileRepository.save(file);
    }

    async getByUser(userId: number, { limit, offset }: PaginationQueryDto): Promise<File[]> {
        return await this.fileRepository.find({
            where: {
                user: {
                    id: userId,
                }
            },
            relations: ['user'],
            skip: offset,
            take: limit,
        });
    }

    async uploadFile(userId: number, file: Buffer, { name }: UploadFileDto): Promise<File> {

        const uploadResult = await this.awsS3Service.uploadFile(file, name);

        const f: File = this.fileRepository.create({ 
            name: name,
            awsId: uploadResult.Key,
            url: uploadResult.Location,
            user: {
                id: userId
            }
        });

        return await this.fileRepository.save(f);
    }

    async dowloadFile(userId: number, fileId: number): Promise<Readable> {

        const fileInfo: File = await this.fileRepository.findOne({
            where: {
                id: fileId,
                user: {
                    id: userId,
                }
            }
        });

        const getFileResult = await this.awsS3Service.getFile(fileInfo.awsId);
        if (getFileResult) {
            return getFileResult;
        }
        throw new UnauthorizedException();
       
    }

    

}
