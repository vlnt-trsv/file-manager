import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { RenameNodeDto } from './dto/rename-node.dto';
import { MoveNodeDto } from './dto/move-node.dto';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  findRoot() {
    return this.nodesService.findRoot();
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.nodesService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nodesService.findOne(id);
  }

  @Get(':id/children')
  findChildren(@Param('id') id: string) {
    return this.nodesService.findChildren(id);
  }

  @Get(':id/tree')
  findTree(@Param('id') id: string) {
    return this.nodesService.findTree(id);
  }

  @Post()
  create(@Body() dto: CreateNodeDto) {
    return this.nodesService.create(dto);
  }

  @Patch(':id/rename')
  rename(@Param('id') id: string, @Body() dto: RenameNodeDto) {
    return this.nodesService.rename(id, dto);
  }

  @Patch(':id/move')
  move(@Param('id') id: string, @Body() dto: MoveNodeDto) {
    return this.nodesService.move(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nodesService.remove(id);
  }
}
