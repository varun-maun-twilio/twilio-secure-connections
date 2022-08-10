import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecureAuthModule } from './secure-auth/secure-auth.module';

@Module({
  imports: [SecureAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
