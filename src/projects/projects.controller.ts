import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiHeader } from '@nestjs/swagger';
import { AddProjectToClientDto } from './dto/add-project-to-client.dto';
import { Project } from './entities/project.entity';

@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant ID',
})
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
  @Put('add-to-client')
  addProjectToClient(
    @Body() addProjectToClientDto: AddProjectToClientDto,
  ): Promise<Project> {
    return this.projectsService.addProjectToClient(addProjectToClientDto);
  }
}
