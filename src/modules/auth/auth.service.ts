import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async signup(dto: AuthDto) {
       try {
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
       } catch (error) {
        if(error instanceof PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                throw new ForbiddenException('Credentials taken')
            }
        } 
        throw error
       }
    }

    async signin(dto: AuthDto){
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email
                }
            })

            if(!user){
                throw new ForbiddenException('Credentials incorrect')
            }

            const pwdMatches = await argon.verify(user.password, dto.password)

            if(!pwdMatches){
                throw new ForbiddenException('Credentials incorrect')
            }

            return this.signToken(user.id, user.email)
        } catch (error) {
            throw error
        }  
    }

    async signToken(userId: number, email: string): Promise<{access_token:string}> {

        const payload = {
            sub: userId,
            email
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET')
        })

        return {access_token: token}
    }
}