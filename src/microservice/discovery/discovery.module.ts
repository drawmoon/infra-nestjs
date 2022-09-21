import { Module, DynamicModule, Global, HttpModule } from '@nestjs/common';
import { DISCOVERY_OPTIONS } from '../constants';
import { DiscoveryAsyncOptions, DiscoveryOptions } from '../interfaces';
import { DiscoveryService } from './discovery.service';

@Global()
@Module({
  imports: [
    // 需要设置 `HttpService` 的拦截器，所以这里引用 `HttpModule`
    HttpModule
  ],
})
export class DiscoveryModule {
  public static register(options: DiscoveryOptions): DynamicModule {
    return {
      module: DiscoveryModule,
      providers: [
        {
          provide: DISCOVERY_OPTIONS,
          useValue: options,
        },
        DiscoveryService,
      ],
      imports: [],
      exports: [DiscoveryService],
    };
  }

  public static registerAsync(options: DiscoveryAsyncOptions): DynamicModule {
    return {
      module: DiscoveryModule,
      providers: [
        {
          provide: DISCOVERY_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        DiscoveryService,
      ],
      imports: options.imports,
      exports: [DiscoveryService],
    };
  }
}
