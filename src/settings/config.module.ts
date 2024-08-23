import { Global, Module } from '@nestjs/common';
import { appSettings, AppSettings } from './app-settings';

@Global()
@Module({
  providers: [
    {
      provide: AppSettings.name,
      useFactory: () => appSettings,
    },
  ],
  exports: [AppSettings.name],
})
export class MainConfigModule {}
