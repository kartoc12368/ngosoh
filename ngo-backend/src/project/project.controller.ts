import { Body, Controller, Get, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProjectService } from './project.service';
import { diskStorage } from 'multer';
import* as path from 'path';
import {v4 as uuidv4} from "uuid";
import { FilesInterceptor } from '@nestjs/platform-express';
import { Project } from './entities/project.entity';
import { ProjectRepository } from './repo/project.repository';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';

export const storage =   {  storage:diskStorage({
  destination:"./uploads/projectImages",
  filename:(req,file,cb)=>{
    const filename:string = path.parse(file.originalname).name.replace(/\s/g, "") + uuidv4();
    const extension:string = path.parse(file.originalname).ext;

    cb(null, `${filename}${extension}`)
  } 
})
}

@ApiTags("Project")
@ApiSecurity("JWT-auth")
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService,
    private readonly projectRepository:ProjectRepository) {}

  @UseInterceptors(FilesInterceptor("file",20,storage))
  @UseGuards( new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  @Post("createProject")
  async createProject(@UploadedFiles() files,@Body() bodyData){
    let project:Project = new Project();
    const body = JSON.parse(bodyData.data)
    project.project_name = body.project_name;
    project.project_description = body.project_description;
    const response = [];
    try { 
      files.forEach(file => {
        response.push(file.filename);
      });
    
    } catch (error) {
      return true;
    }
project.project_images = response
const newN =await this.projectRepository.save(project)
  }

  @UseGuards( new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  @Get("/get")
  getProjectByName(@Body() body){
    return this.projectService.getProjectByName(body.project_name)
  }

}
