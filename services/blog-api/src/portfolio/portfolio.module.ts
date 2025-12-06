import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortfolioService } from './portfolio.service';
import { PortfolioResolver } from './portfolio.resolver';
import { PortfolioController } from './portfolio.controller';
import { PortfolioItem } from './portfolio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PortfolioItem])],
  providers: [PortfolioService, PortfolioResolver],
  controllers: [PortfolioController],
  exports: [PortfolioService]
})
export class PortfolioModule {}
