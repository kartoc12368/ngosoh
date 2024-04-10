import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectRepository } from './repo/project.repository';

@Module({
  imports:[TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectService,ProjectRepository],
  exports:[ProjectService,ProjectRepository]
})
export class ProjectModule {}
