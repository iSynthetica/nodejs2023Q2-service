import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackController } from './modules/track/track.controller';
import { ArtistController } from './modules/artist/artist.controller';
import { AlbumController } from './modules/album/album.controller';
import { FavoriteController } from './modules/favorite/favorite.controller';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [
    AppController,
    TrackController,
    ArtistController,
    AlbumController,
    FavoriteController,
  ],
  providers: [AppService, UserService],
})
export class AppModule {}
