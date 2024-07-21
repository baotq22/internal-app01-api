import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common"
import { SignInDto } from "./dto/signIn.dto"
import { AuthService, FindAllResponse } from "./auth.service"
import { Query as ExpressQuery } from "express-serve-static-core"
import { RegisterDto } from "./dto/register.dto"
import { Response } from "express"
import { responseError, responseSuccess } from "utils/responseHandle"
import * as path from "path"

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Get("/get-all")
    async getAllUsers(@Query() query: ExpressQuery, @Res() res: Response): Promise<Response<FindAllResponse>> {
        try {
            const data = await this.authService.findAll(query)
            return responseSuccess(res, data, 200, "Successfully")
        } catch (error) {
            return responseError(res, 500, "err", "Failed", true)
        }
    }

    @Get("/signin")
    signin(@Body() signInDto: SignInDto): Promise<{ token: string }> {
        return this.authService.signIn(signInDto)
    }

    @Post("/register")
    register(@Body() registerDto: RegisterDto): Promise<{ token: string }> {
        return this.authService.register(registerDto)
    }

    @Get("img/:imageName")
    serveImage(@Param("imageName") imageName: string, @Res() res: Response): void {
        const imagePath = path.join(process.cwd(), "public/uploads/images/", imageName)
        res.sendFile(imagePath)
    }
}
