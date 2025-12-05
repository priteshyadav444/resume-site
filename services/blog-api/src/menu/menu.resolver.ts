import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MenuService } from './menu.service';
import { MenuItem } from './menu.entity';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => MenuItem)
export class MenuResolver {
  constructor(private service: MenuService) {}

  @Query(() => [MenuItem])
  menuItems() {
    return this.service.findAll();
  }

  @Mutation(() => MenuItem)
  @UseGuards(GqlAuthGuard)
  createMenuItem(@Args('input') input: CreateMenuInput) {
    return this.service.create(input);
  }

  @Mutation(() => MenuItem)
  @UseGuards(GqlAuthGuard)
  updateMenuItem(@Args('input') input: UpdateMenuInput) {
    return this.service.update(input.id, input as any);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  deleteMenuItem(@Args('id', { type: () => Int }) id: number) {
    return this.service.remove(id);
  }
}
