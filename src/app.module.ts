import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data"

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true
        }),
        NestjsFormDataModule.config({ storage: MemoryStoredFile }),
        MongooseModule.forRoot(process.env.DB_URI)
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
