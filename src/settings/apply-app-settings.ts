import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from 'src/base/utils/exception.filter';

// Prefix (http://site.com/api)
//const APP_PREFIX = '/api';

// For main.ts and e2e tests
export const applyAppSettings = (app: INestApplication) => {
  // Для внедрения зависимостей в validator constraint
  // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
  // когда DI не имеет необходимого класса.
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Set prefix
  //setAppPrefix(app);

  // Set pipes
  setAppPipes(app);

  // Set global exceptions filters
  setAppExceptionsFilters(app);
};

//const setAppPrefix = (app: INestApplication) => {
// Set prefix when front-end and back-end on one domain
// https://site.com - front-end
// https://site.com/api - backend-end
//app.setGlobalPrefix(APP_PREFIX);
//};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorsForResponse = [];
        errors.forEach((e) => {
          const constrainsKeys = Object.keys(e.constraints);
          constrainsKeys.forEach((key) => {
            errorsForResponse.push({
              message: e.constraints[key],
              field: e.property,
            });
          });
        });

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter());
};
