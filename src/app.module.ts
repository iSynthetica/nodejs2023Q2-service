import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumController } from './modules/album/album.controller';
import { FavoriteController } from './modules/favorite/favorite.controller';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { TrackModule } from './modules/track/track.module';
import { ArtistModule } from './modules/artist/artist.module';

@Module({
  imports: [UserModule, TrackModule, ArtistModule],
  controllers: [AppController, AlbumController, FavoriteController],
  providers: [AppService, UserService],
})
export class AppModule {}
