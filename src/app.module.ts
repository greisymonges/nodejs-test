import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist';

import { UserModule } from './modules/user/user.module';
import { FileModule } from './modules/file/file.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './modules/email/email.module';
import { AwsS3Module } from './modules/aws-s3/aws-s3.module';

@Module({
  imports: [UserModule, FileModule, ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, EmailModule, AwsS3Module],
  controllers: [],
  providers: [],
})
export class AppModule {

  static port: number;

  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('PORT');
  }
}
