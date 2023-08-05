import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './modules/user/user.controller';
import { TrackController } from './modules/track/track.controller';
import { ArtistController } from './modules/artist/artist.controller';
import { AlbumController } from './modules/album/album.controller';
import { FavoriteController } from './modules/favorite/favorite.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    TrackController,
    ArtistController,
    AlbumController,
    FavoriteController,
  ],
  providers: [AppService],
})
export class AppModule {}
