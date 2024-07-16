import { Body, Controller, Get } from "@nestjs/common"
import { SignInDto } from "./dto/signIn.dto"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Get("/signin")
    signin(@Body() signInDto: SignInDto): Promise<{ token: string }> {
        return this.authService.signIn(signInDto)
    }
}
