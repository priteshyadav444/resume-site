import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PortfolioService } from './portfolio.service';
import { PortfolioItem } from './portfolio.entity';
import { CreatePortfolioInput } from './dto/create-portfolio.input';
import { UpdatePortfolioInput } from './dto/update-portfolio.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => PortfolioItem)
export class PortfolioResolver {
  constructor(private service: PortfolioService) {}

  @Query(() => [PortfolioItem])
  portfolioItems() {
    return this.service.findAll();
  }

  @Query(() => [PortfolioItem])
  featuredPortfolio() {
    return this.service.findFeatured();
  }

  @Query(() => PortfolioItem)
  portfolioBySlug(@Args('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Mutation(() => PortfolioItem)
  @UseGuards(GqlAuthGuard)
  createPortfolioItem(@Args('input') input: CreatePortfolioInput) {
    return this.service.create(input);
  }

  @Mutation(() => PortfolioItem)
  @UseGuards(GqlAuthGuard)
  updatePortfolioItem(@Args('input') input: UpdatePortfolioInput) {
    return this.service.update(input.id, input as any);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deletePortfolioItem(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}
