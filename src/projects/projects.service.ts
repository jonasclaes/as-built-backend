import { Injectable, Scope } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectTenantRepository } from '../tenancy/tenancy.decorators';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { AddProjectToClientDto } from './dto/add-project-to-client.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProjectsService {
  constructor(
    @InjectTenantRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectTenantRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  create(createProjectDto: CreateProjectDto) {
    return this.projectRepository.save(createProjectDto);
  }

  findAll() {
    return this.projectRepository.find();
  }

  findOne(id: number) {
    return this.projectRepository.findOneBy({ id });
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.projectRepository.update(id, updateProjectDto);
  }

  remove(id: number) {
    return this.projectRepository.delete(id);
  }

  async addProjectToClient(
    addProjectToClientDto: AddProjectToClientDto,
  ): Promise<Project> {
    const { clientId, projectId } = addProjectToClientDto;
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) {
      throw new Error('Client not found');
    }
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new Error('Project not found');
    }
    project.client = client;
    return this.projectRepository.save(project);
  }
}
