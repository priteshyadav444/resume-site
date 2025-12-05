import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { PortfolioResolver } from './portfolio.resolver';
import { PortfolioItem } from './portfolio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioItem])],
  providers: [PortfolioService, PortfolioResolver],
  exports: [PortfolioService]
})
export class PortfolioModule {}
