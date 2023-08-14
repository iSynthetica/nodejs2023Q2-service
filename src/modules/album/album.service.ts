import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistService } from '../artist/artist.service';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from './entity/album.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  @Inject(ArtistService)
  private readonly artistService: ArtistService;

  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  async getAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find();
  }

  async get(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) this.notFound();

    return album;
  }

  async create(data: CreateAlbumDto): Promise<AlbumEntity> {
    if (data.artistId) await this.artistService.get(data.artistId);
    const newAlbum = this.albumRepository.create({ ...data });
    return await this.albumRepository.save(newAlbum);
  }

  async update(id: string, data: UpdateAlbumDto): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) this.notFound();

    const updatedAlbum: Partial<AlbumEntity> = {};
    if (data.name) updatedAlbum.name = data.name;
    if (data.year) updatedAlbum.year = data.year;
    if (data.artistId !== undefined) updatedAlbum.artistId = data.artistId;

    await this.albumRepository.update(id, updatedAlbum);
    return await this.albumRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) this.notFound();
    await this.albumRepository.delete(id);
    return true;
  }

  private notFound() {
    throw new NotFoundException('Album not found');
  }
}
