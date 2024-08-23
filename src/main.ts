import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-settings';
import { appSettings } from './settings/app-settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);
  
  app.enableCors();
  app.use(cookieParser());

  await app.listen(appSettings.api.PORT, () => {
    console.log('App starting listen port: ', appSettings.api.PORT);
    console.log('ENV: ', appSettings.env.getEnv());
  });
}
bootstrap();
