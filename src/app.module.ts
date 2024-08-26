import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './features/blogs/blog.module';
import { TestingModule } from './features/testing/testing.module';
import { AuthUserModule } from './features/auth-users/auth-user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { appSettings } from './settings/app-settings';
import { MainConfigModule } from './settings/config.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MainConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nodejs',
      password: 'nodejs',
      database: 'BlogPosts',
      autoLoadEntities: false,
      synchronize: false,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => {
        const dbName = appSettings.env.isTesting()
          ? appSettings.api.DB_NAME_TEST
          : appSettings.api.DB_NAME;

        return {
          uri: appSettings.api.MONGO_DB_ATLAS,
          dbName: dbName,
        };
      },
    }),
    BlogModule,
    AuthUserModule,
    TestingModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: appSettings.env.isTesting() ? 1000 : 5,
      },
    ]),
  ],
  controllers: [],
})
export class AppModule {}
