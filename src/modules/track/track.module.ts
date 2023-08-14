import { Module, forwardRef } from '@nestjs/common';
import { TrackController } from './track.controller';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { TrackService } from './track.service';
import { FavoriteModule } from '../favorite/favorite.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './entity/track.entity';

@Module({
  imports: [
    ArtistModule,
    AlbumModule,
    forwardRef(() => FavoriteModule),
    TypeOrmModule.forFeature([TrackEntity]),
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
