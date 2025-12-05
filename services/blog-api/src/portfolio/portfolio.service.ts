import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioItem } from './portfolio.entity';
import { CreatePortfolioInput } from './dto/create-portfolio.input';
import { UpdatePortfolioInput } from './dto/update-portfolio.input';

@Injectable()
export class PortfolioService {
  constructor(@InjectRepository(PortfolioItem) private repo: Repository<PortfolioItem>) {}

  async create(input: CreatePortfolioInput): Promise<PortfolioItem> {
    const item = this.repo.create({ ...input, images: input.images || [] });
    return this.repo.save(item);
  }

  async findAll(): Promise<PortfolioItem[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findFeatured(): Promise<PortfolioItem[]> {
    return this.repo.find({ where: { featured: true }, order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<PortfolioItem> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Portfolio item not found');
    return item;
  }

  async findBySlug(slug: string): Promise<PortfolioItem> {
    const item = await this.repo.findOne({ where: { slug } });
    if (!item) throw new NotFoundException('Portfolio item not found');
    return item;
  }

  async update(id: number, input: UpdatePortfolioInput): Promise<PortfolioItem> {
    const item = await this.findOne(id);
    Object.assign(item, input);
    return this.repo.save(item);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return res.affected > 0;
  }
}
