import { Module, DynamicModule, Global } from '@nestjs/common';
import { ScannerModule } from '@quickts/nestjs-scanner';
import { CONFIGURATION_OPTIONS } from '../constants';
import { ConfigurationAsyncOptions, ConfigurationOptions } from '../interfaces';
import { ConfigurationHostedService } from './configuration-hosted.service';

@Global()
@Module({})
export class ConfigurationModule {
  public static register(options: ConfigurationOptions): DynamicModule {
    return {
      module: ConfigurationModule,
      providers: [
        {
          provide: CONFIGURATION_OPTIONS,
          useValue: options,
        },
        ConfigurationHostedService,
      ],
      imports: [ScannerModule.forRoot(true)],
      exports: [ConfigurationHostedService],
    };
  }

  public static registerAsync(options: ConfigurationAsyncOptions): DynamicModule {
    return {
      module: ConfigurationModule,
      providers: [
        {
          provide: CONFIGURATION_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        ConfigurationHostedService,
      ],
      imports: [ScannerModule.forRoot(true), ...(options.imports || [])],
      exports: [ConfigurationHostedService],
    };
  }
}
