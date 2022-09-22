import { Module, DynamicModule, Global } from '@nestjs/common';
import { ScannerModule } from '@quickts/nestjs-scanner';
import { CONFIGURATION_OPTIONS } from '../constants';
import { ConfigServiceAsyncOptions, ConfigServiceOptions } from '../interfaces';
import { ConfigServiceHostedService } from './config-service-hosted.service';

@Global()
@Module({})
export class ConfigServiceModule {
  public static register(options: ConfigServiceOptions): DynamicModule {
    return {
      module: ConfigServiceModule,
      providers: [
        {
          provide: CONFIGURATION_OPTIONS,
          useValue: options,
        },
        ConfigServiceHostedService,
      ],
      imports: [ScannerModule.forRoot(true)],
      exports: [ConfigServiceHostedService],
    };
  }

  public static registerAsync(options: ConfigServiceAsyncOptions): DynamicModule {
    return {
      module: ConfigServiceModule,
      providers: [
        {
          provide: CONFIGURATION_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        ConfigServiceHostedService,
      ],
      imports: [ScannerModule.forRoot(true), ...(options.imports || [])],
      exports: [ConfigServiceHostedService],
    };
  }
}
