import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioInput } from './dto/create-portfolio.input';
import { UpdatePortfolioInput } from './dto/update-portfolio.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPortfolioInput: CreatePortfolioInput) {
    return this.portfolioService.create(createPortfolioInput);
  }

  @Get()
  findAll() {
    return this.portfolioService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.portfolioService.findFeatured();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.findOne(id);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.portfolioService.findBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePortfolioInput: UpdatePortfolioInput,
  ) {
    return this.portfolioService.update(id, updatePortfolioInput);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.remove(id);
  }
}

