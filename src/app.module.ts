import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BookmarkModule } from './modules/bookmark/bookmark.module';

@Module({
  imports: [AuthModule, UserModule, BookmarkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
