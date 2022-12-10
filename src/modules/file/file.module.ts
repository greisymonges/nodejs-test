import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

@Module({
    imports: [TypeOrmModule.forFeature([File])],
    controllers: [FileController],
    providers: [FileService, AwsS3Service],
})
export class FileModule {}
