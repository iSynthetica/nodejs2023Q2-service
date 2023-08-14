import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from './entity/artist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  async getAll(): Promise<ArtistEntity[]> {
    return await this.artistRepository.find();
  }

  async get(id: string): Promise<ArtistEntity> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }

  async create(data: CreateArtistDto): Promise<ArtistEntity> {
    const newArtist = this.artistRepository.create({ ...data });
    return await this.artistRepository.save(newArtist);
  }

  async update(id: string, data: UpdateArtistDto): Promise<ArtistEntity> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');

    const updatedArtist: Partial<ArtistEntity> = {};
    if (data.name) updatedArtist.name = data.name;
    if (data.grammy !== undefined) updatedArtist.grammy = data.grammy;

    await this.artistRepository.update(id, updatedArtist);
    return await this.artistRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');
    await this.artistRepository.delete(id);
    return true;
  }
}
