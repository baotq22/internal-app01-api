import { InjectModel } from "@nestjs/mongoose"
import { User } from "./schemas/user.schema"
import mongoose, { Model } from "mongoose"
import { Query } from "express-serve-static-core"
import { JwtService } from "@nestjs/jwt"
import { Injectable } from "@nestjs/common"

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

    async findAll(query: Query): Promise<FindAllResponse> {
        // eslint-disable-next-line prefer-const
        let { search, sort_by, sort_order, page, page_size, number_user, compare_user } = query

        const sRegex = search
            ? {
                  username: {
                      $regex: query.search,
                      $options: "i"
                  }
              }
            : null
        const pageSize = Number(page_size) ? Number(page_size) : 8
        const pageNumber = Number(page) > 0 ? Number(page) : 1
        const skip = pageSize * (pageNumber - 1)
        const sortBy = String(sort_by ? sort_by : "asc")
        const sortOrder = sort_order === "asc" ? 1 : -1
        const numberUser = Number(number_user) > 0 ? Number(number_user) : 0
        const compareUser = String(compare_user) ? String(compare_user) : "$gt"

        const result = await this.userModel
            .aggregate([
                {
                    $match: {
                        deleted_at: null,
                        ...sRegex,
                        ...(numberUser && compareUser && { total: { [compareUser]: numberUser } })
                    }
                },
                { $sort: { [sortBy]: sortOrder } },
                {
                    $facet: {
                        users: [
                            { $skip: skip },
                            { $limit: pageSize },
                            {
                                $project: {
                                    _id: 1,
                                    email: 1,
                                    username: 1,
                                    fullname: 1,
                                    password: 1,
                                    image: { $concat: ["http://localhost:3001/api/auth/img/", "$image"] },
                                    imageMain: { $concat: ["http://localhost:3001/api/auth/img/", "$imageMain"] },
                                    description: 1,
                                    phone: 1,
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
            page: pageNumber,
            page_size: pageSize,
            users: result[0].users
        }
    }
}
