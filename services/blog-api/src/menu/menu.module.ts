import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './menu.entity';
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';
import { MenuController } from './menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  providers: [MenuService, MenuResolver],
  controllers: [MenuController],
  exports: [MenuService]
})
export class MenuModule {}
