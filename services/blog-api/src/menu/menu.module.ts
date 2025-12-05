import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './menu.entity';
import { MenuService } from './menu.service';
import { MenuResolver } from './menu.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem])],
  providers: [MenuService, MenuResolver],
  exports: [MenuService]
})
export class MenuModule {}
