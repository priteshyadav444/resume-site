import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu.entity';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';

@Injectable()
export class MenuService {
  constructor(@InjectRepository(MenuItem) private repo: Repository<MenuItem>) {}

  async create(input: CreateMenuInput): Promise<MenuItem> {
    const item = this.repo.create({ ...input });
    return this.repo.save(item);
  }

  async findAll(): Promise<MenuItem[]> {
    return this.repo.find({ order: { order: 'ASC' } });
  }

  async findOne(id: number): Promise<MenuItem> {
    const it = await this.repo.findOne({ where: { id } });
    if (!it) throw new NotFoundException('Menu item not found');
    return it;
  }

  async update(id: number, input: UpdateMenuInput): Promise<MenuItem> {
    const it = await this.findOne(id);
    Object.assign(it, input);
    return this.repo.save(it);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return res.affected > 0;
  }
}
