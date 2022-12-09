import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LimitOnUpdateNotSupportedError, Repository } from 'typeorm';
import { PaginationQueryDto } from './dto';
import { File } from './entities';

@Injectable()
export class FileService {

    constructor(@InjectRepository(File) private readonly fileRepository: Repository<File>){
        
    }

    async get({ limit, offset }: PaginationQueryDto): Promise<File[]> {
        return await this.fileRepository.find({
            relations: ['user'],
            skip: offset,
            take: limit,
        });
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

}
