import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User } from "./schemas/user.schema"
import { Model } from "mongoose"
import * as bcrypt from "bcryptjs"
import { JwtService } from "@nestjs/jwt"
import { SignInDto } from "./dto/signIn.dto"

export interface FindAllResponse {
    total: number
    page: number
    page_size: number
    users: User[]
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async signIn(signInDto: SignInDto): Promise<{ token: string }> {
        const { username, password } = signInDto

        const user = await this.userModel.findOne({ username })

        if (!user) {
            throw new UnauthorizedException("Invalid usernames or passwords")
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if (!isPasswordMatched) {
            throw new UnauthorizedException("Invalid usernames or passwords")
        }

        const token = this.jwtService.sign({ id: user._id })

        return { token }
    }
}
