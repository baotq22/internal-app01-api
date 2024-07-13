import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { MulterModule } from "@nestjs/platform-express"
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data"

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true
        }),
        MulterModule.register({
            dest: "./uploads"
        }),
        NestjsFormDataModule.config({ storage: MemoryStoredFile }),
        MongooseModule.forRoot(process.env.DB_URI),
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
