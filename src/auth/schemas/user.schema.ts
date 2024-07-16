import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

@Schema({
    timestamps: true
})
export class User {
    @Prop()
    firstName: string

    @Prop()
    lastName: string

    @Prop()
    username: string

    @Prop()
    password: string

    @Prop()
    email: string

    @Prop()
    image: string

    @Prop()
    dob: string

    @Prop()
    address: string

    @Prop()
    phone: string

    @Prop()
    model: string

    @Prop()
    brand: string
}

export const UserSchema = SchemaFactory.createForClass(User)
