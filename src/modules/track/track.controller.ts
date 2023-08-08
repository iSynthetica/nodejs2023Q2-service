import { Controller, Get } from '@nestjs/common';

@Controller('track')
export class TrackController {
  @Get()
  async getAll(): Promise<string> {
    return 'Get all tracks';
  }
}
