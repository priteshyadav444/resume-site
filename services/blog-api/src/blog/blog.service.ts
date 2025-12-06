import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './blog.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Injectable()
export class BlogService {
  constructor(@InjectRepository(Post) private repo: Repository<Post>) {}

  async create(input: CreatePostInput): Promise<Post> {
    const post = this.repo.create({ ...input, tags: input.tags || [] });
    return this.repo.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.repo.find({ order: { publishedAt: 'DESC', createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.repo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.repo.findOne({ where: { slug } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: number, input: UpdatePostInput): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, input);
    return this.repo.save(post);
  }

  async remove(id: number): Promise<boolean> {
    const res = await this.repo.delete(id);
    return (res.affected || 0) > 0;
  }
}
