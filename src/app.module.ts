import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BlogModule } from './features/blogs/blog.module';
import { TestingModule } from './features/testing/testing.module';
import { AuthUserModule } from './features/auth-users/auth-user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { appSettings } from './settings/app-settings';
import { MainConfigModule } from './settings/config.module';

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
