import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ScannerService } from '@quickts/nestjs-scanner';
import { NacosConfigClient } from 'nacos';
import { defaultJsonParser } from '../../common/util';
import { MSVC_CONFIGURATION_CLIENT_METADATA, MSVC_CONFIGURATION_METADATA, CONFIGURATION_OPTIONS } from '../constants';
import { ConfigurationOptions } from '../interfaces';
import { Logger } from '../../logger/logger';

/**
 * 配置管理托管后台服务
 */
@Injectable()
export class ConfigurationHostedService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private readonly client: NacosConfigClient;
  private readonly listeners = new Array<{ dataId: string; group: string; listener: (content: string) => Promise<void> }>();

  constructor(
    private readonly scannerService: ScannerService,
    @Inject(CONFIGURATION_OPTIONS)
    private readonly options: ConfigurationOptions,
  ) {
    this.logger = new Logger(ConfigurationHostedService.name, options.log || 'info');
    this.client = new NacosConfigClient(options);
  }

  public async onModuleInit(): Promise<void> {
    this.logger.log('Initializing configuration...');

    await this.scannerService.scanProviderPropertyMetadates(MSVC_CONFIGURATION_METADATA, async (instance, propertyKey) => {
      const dataId = this.options.dataId || 'someapp';
      const group = this.options.group || 'DEFAULT_GROUP';
      const parser = this.options.parser || defaultJsonParser;

      this.listeners.push({
        dataId: dataId,
        group: group,
        listener: async (content: string) => {
          this.logger.log(`Configuration update! group: ${group} dataId: ${dataId}`);
          this.logger.debug(content);

          try {
            const config = parser(content);
            instance[propertyKey] = config;

            if (instance['onConfigUpdate']) {
              await instance['onConfigUpdate'](config, dataId, group);
            }
          } catch (err) {
            this.logger.error('Parser config error.');
            this.logger.error(err);
          }
        },
      });
    });

    for (const { dataId, group, listener } of this.listeners) {
      this.client.subscribe({ dataId, group }, listener);
      this.logger.log(`Subscribed Config! group: ${group} dataId: ${dataId}`);
    }

    await this.scannerService.scanProviderPropertyMetadates(MSVC_CONFIGURATION_CLIENT_METADATA, async (instance, propertyKey) => {
      instance[propertyKey] = this.client;
    });
  }

  public async onModuleDestroy(): Promise<void> {
    for (const { dataId, group, listener } of this.listeners) {
      this.client.unSubscribe({ dataId, group }, listener);
    }

    this.listeners.length = 0;

    if (this.client) {
      this.client.close();
    }
  }
}
