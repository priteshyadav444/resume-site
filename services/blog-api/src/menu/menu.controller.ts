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
import { MenuService } from './menu.service';
import { CreateMenuInput } from './dto/create-menu.input';
import { UpdateMenuInput } from './dto/update-menu.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMenuInput: CreateMenuInput) {
    return this.menuService.create(createMenuInput);
  }

  @Get()
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuInput: UpdateMenuInput,
  ) {
    return this.menuService.update(id, updateMenuInput);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(id);
  }
}

