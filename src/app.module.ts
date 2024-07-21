import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { MemoryStoredFile, NestjsFormDataModule } from "nestjs-form-data"
import { AuthModule } from "./auth/auth.module"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { MulterModule } from "@nestjs/platform-express"

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env",
            isGlobal: true
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public/uploads/images"),
            serveRoot: "/images" // Endpoint để truy cập ảnh, có thể thay đổi theo ý muốn
        }),
        MulterModule.register({
            dest: "./uploads"
        }),
        NestjsFormDataModule.config({ storage: MemoryStoredFile }),
        MongooseModule.forRoot(process.env.DB_URI),
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
