import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { config } from 'aws-sdk';
import { S3 } from 'aws-sdk';

import { v4 as uuid } from 'uuid';


@Injectable()
export class AwsS3Service {

    constructor(
        private readonly configService: ConfigService,
    ){
        config.update({
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
            region: configService.get('AWS_REGION'),
        });
    }



    async uploadFile(dataBuffer: Buffer, filename: string) {
        const s3 = new S3();
        try{
            let uploadResult = await s3.upload({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Body: dataBuffer,
                Key: `${uuid()}-${filename}`
              }).promise();
            return uploadResult;
        }catch (e){
            console.log(e);
        }
    }

    async getFile(awsId: string) {
        const s3 = new S3();
        try{
            const stream = await s3.getObject({
                Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
                Key: awsId
            }).createReadStream();

            return stream;

        }catch (e){
            console.log(e);
        }
    }
    
}
