import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogService } from './blog.service';
import { Post } from './blog.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Post)
export class BlogResolver {
  constructor(private service: BlogService) {}

  @Query(() => [Post])
  posts() {
    return this.service.findAll();
  }

  @Query(() => Post)
  postById(@Args('id', { type: () => Int }) id: number) {
    return this.service.findOne(id);
  }

  @Query(() => Post)
  postBySlug(@Args('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  createPost(@Args('input') input: CreatePostInput) {
    return this.service.create(input);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  updatePost(@Args('input') input: UpdatePostInput) {
    return this.service.update(input.id, input as any);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deletePost(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}
