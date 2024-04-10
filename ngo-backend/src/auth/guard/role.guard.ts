import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

export class RoleGuard implements CanActivate{

    private role: string;

    constructor(role: string){
        this.role = role;
    }

    canActivate(context: ExecutionContext):boolean{
        const ctx = context.switchToHttp();
        const request:any = ctx.getRequest<Request>();
        const user = request.user;
        if(user.role === this.role){
            return true;
        }
        return false;
    }
    
}