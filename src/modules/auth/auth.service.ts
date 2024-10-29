import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signup(dto: AuthDto) {
        //generate the pwd hash
        const hashedpwd = await argon.hash(dto.password);

        //save the new user
        const user = await this.prisma.user.create({
            data: {
                email:dto.email,
                password: hashedpwd
            },
            select: {
                id:true,
                email:true,
            }
        })
        return user;
    }

    signin(){
        return { msg:'hello'}
    }
}