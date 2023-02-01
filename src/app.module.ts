import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot('mongodb://localhost/ifquiz'), AuthModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})

export class AppModule {}
