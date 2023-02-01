import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ 
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService], 
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES')
          },
        }
      }
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema}
    ])
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy
  ],
  exports: [
    JwtStrategy, 
    PassportModule
  ]
})
export class AuthModule {}
