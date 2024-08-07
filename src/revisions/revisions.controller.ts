import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { RevisionsService } from './revisions.service';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';

@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant ID',
})
@Controller('revisions')
export class RevisionsController {
  constructor(private readonly revisionsService: RevisionsService) {}

  @Post()
  create(@Body() createRevisionDto: CreateRevisionDto) {
    return this.revisionsService.create(createRevisionDto);
  }

  @Get()
  findAll() {
    return this.revisionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.revisionsService.findOne(+id);
  }

  @Get('project/:projectId')
  findAllForProject(@Param('projectId') projectId: string) {
    return this.revisionsService.findAllForProject(+projectId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRevisionDto: UpdateRevisionDto,
  ) {
    return this.revisionsService.update(+id, updateRevisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.revisionsService.remove(+id);
  }
}
