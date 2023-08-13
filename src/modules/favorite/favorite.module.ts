import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  imports: [ArtistModule, AlbumModule, TrackModule],
  exports: [FavoriteService],
})
export class FavoriteModule {}
