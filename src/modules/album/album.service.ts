import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '../../interfaces/album.interface';
import { albumDb } from '../../database/album.data';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class AlbumService {
  private readonly albums: Album[];

  @Inject(ArtistService)
  private readonly artistService: ArtistService;

  constructor() {
    this.albums = albumDb;
  }

  async getAll(): Promise<Album[]> {
    return this.albums;
  }

  async get(id: string): Promise<Album> {
    const returnAlbum = this.albums.find((album) => album.id === id);
    if (!returnAlbum) this.notFound();

    return returnAlbum;
  }

  async create(data: CreateAlbumDto): Promise<Album> {
    const artistId = data.artistId;
    await this.artistService.get(artistId);

    const newAlbum: Album = {
      id: uuidv4(),
      ...data,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }

  async update(id: string, data: UpdateAlbumDto): Promise<Album> {
    const updatedAlbum = this.albums.find((album) => album.id === id);

    if (!updatedAlbum) this.notFound();

    if (data.name) updatedAlbum.name = data.name;
    if (data.year) updatedAlbum.year = data.year;

    return updatedAlbum;
  }

  async delete(id: string): Promise<boolean> {
    const albumIdx = this.albums.findIndex((album) => album.id === id);

    if (albumIdx === -1) this.notFound();

    this.albums.splice(albumIdx, 1);
    return true;
  }

  private notFound() {
    throw new NotFoundException('Album not found');
  }
}
