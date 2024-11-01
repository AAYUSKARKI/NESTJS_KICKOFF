import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtGuard } from "../auth/guard";
import { Request } from "express";
import { GetUser } from "../auth/decorator";
import { User } from "@prisma/client";
// Extend the Request interface to include the 'user' property.
interface RequestWithUser extends Request {
    user: {
        id: number;
        email: string;
    };
}

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    @Get('me')
    getMe(@GetUser('') user: string,@GetUser('email') email: string ) {
        console.log({email})
        return user;
    }
}
