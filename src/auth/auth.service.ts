import { Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User } from "./schemas/user.schema"
import { Model } from "mongoose"
import { Query } from "express-serve-static-core"
import * as bcrypt from "bcryptjs"
import { JwtService } from "@nestjs/jwt"
import { SignInDto } from "./dto/signIn.dto"
import { RegisterDto } from "./dto/register.dto"

export interface FindAllResponse {
    total: number
    users: User[]
}

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ) {}

    async findAll(query: Query): Promise<FindAllResponse> {
        const result = await this.userModel
            .aggregate([
                {
                    $facet: {
                        users: [
                            {
                                $project: {
                                    _id: 1,
                                    firstName: 1,
                                    lastName: 1,
                                    username: 1,
                                    password: 1,
                                    email: 1,
                                    image: { $concat: ["http://localhost:3001/api/auth/img/", "$image"] },
                                    dob: 1,
                                    address: 1,
                                    phone: 1,
                                    model: 1,
                                    brand: 1,
                                    createdAt: 1,
                                    updatedAt: 1
                                }
                            }
                        ],

                        total: [{ $count: "value" }]
                    }
                }
            ])
            .exec()

        const usersTotal = result[0].total.length > 0 ? result[0].total[0].value : 0

        return {
            total: usersTotal,
            users: result[0].users
        }
    }

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

    async register(registerDto: RegisterDto): Promise<{ token: string }> {
        const { firstName, lastName, username, password, email, dob, address, phone, model, brand } = registerDto

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userModel.create({
            firstName,
            lastName,
            username,
            password: hashedPassword,
            email,
            dob,
            address,
            phone,
            model,
            brand
        })

        const token = this.jwtService.sign({ id: user._id })

        return { token }
    }
}
