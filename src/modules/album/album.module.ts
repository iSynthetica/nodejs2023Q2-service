import { Module, forwardRef } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { ArtistModule } from '../artist/artist.module';
import { FavoriteModule } from '../favorite/favorite.module';

@Module({
  imports: [forwardRef(() => ArtistModule), forwardRef(() => FavoriteModule)],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
