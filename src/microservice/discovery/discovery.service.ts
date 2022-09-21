import { Injectable, Inject, OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown, HttpService } from '@nestjs/common';
import { Instance, NacosNamingClient } from 'nacos';
import { AxiosRequestConfig } from 'axios';
import { ServiceInstance, DiscoveryOptions } from '../interfaces';
import { DISCOVERY_OPTIONS } from '../constants';
import { getCurrentIPAdress } from '../../common/util';
import { Logger } from '../../logger/logger';

/**
 * 服务发现管理服务
 */
@Injectable()
export class DiscoveryService implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger: Logger;
  private readonly client: NacosNamingClient;

  constructor(
    @Inject(DISCOVERY_OPTIONS)
    private readonly options: DiscoveryOptions,
    private readonly httpService: HttpService,
  ) {
    const { log = 'info', serverList = '127.0.0.1', namespace = 'public' } = this.options;

    this.logger = new Logger(DiscoveryService.name, log);
    this.client = new NacosNamingClient({
      logger: new Logger('Nacos', log),
      serverList: serverList,
      namespace: namespace,
    });
  }

  /**
   * 根据服务名返回启用并且健康的实例 URI，格式示例：`127.0.0.1:3000`
   * @param serviceName
   * @param groupName
   * @param clusters
   * @returns
   */
  public async getServiceUri(serviceName: string, groupName?: string, clusters?: string): Promise<string> {
    const service = await this.getInstance(serviceName, groupName, clusters);

    return `${service.ip}:${service.port}`;
  }

  //#region private functions

  /**
   * 获取所有服务实例
   * @param serviceName
   * @param groupName
   * @param clusters
   * @param subscribe
   * @returns
   */
  private async getInstances(serviceName: string, groupName?: string, clusters?: string, subscribe?: boolean): Promise<ServiceInstance[]> {
    if (!groupName) groupName = 'DEFAULT_GROUP';
    if (!clusters) clusters = 'DEFAULT';
    if (subscribe === undefined) subscribe = true;

    // `NacosNamingClient.getAllInstances` return type is `string[]` ?
    const instances = await this.client.getAllInstances(serviceName, groupName, clusters, subscribe);

    return [...(instances as any)];
  }

  /**
   * 获取启用并且健康的服务实例
   * @param serviceName
   * @param groupName
   * @param clusters
   * @returns
   */
  private async getInstance(serviceName: string, groupName?: string, clusters?: string): Promise<ServiceInstance> {
    const instances = await this.getInstances(serviceName, groupName, clusters, true);

    let totalWeight = 0;
    for (const instance of instances) {
      totalWeight += instance.weight;
    }

    let pos = Math.random() * totalWeight;
    for (const instance of instances) {
      if (instance.weight) {
        pos -= instance.weight;
        if (pos <= 0) {
          return instance;
        }
      }
    }

    throw new Error(`Not found healthy service ${serviceName}!`);
  }

  /**
   * 服务实例注册
   * @returns
   */
  private register(): Promise<void> {
    const { instance } = this.options;
    const { serviceName = 'someapp', groupName = 'DEFAULT_GROUP' } = instance;

    if (!instance.ip) {
      instance.ip = getCurrentIPAdress();
    }

    this.logger.log(`Registe service instance: ${serviceName}`);

    return this.client.registerInstance(serviceName, instance as Instance, groupName);
  }

  /**
   * 服务实例注销
   * @returns
   */
  private deregister(): Promise<void> {
    const { instance } = this.options;
    const { serviceName = 'someapp', groupName = 'DEFAULT_GROUP' } = instance;

    if (!instance.ip) {
      instance.ip = getCurrentIPAdress();
    }

    return this.client.deregisterInstance(serviceName, instance as Instance, groupName);
  }

  //#endregion

  //#region hook

  public async onModuleInit(): Promise<void> {
    await this.client.ready();

    // 设置 `HttpService` 的拦截器，自动根据服务名转发到健康的服务实例
    this.httpService.axiosRef.interceptors.request.use(async (config: AxiosRequestConfig) => {
      if (!config.url) return config;

      const result = /(?<=:\/\/)[a-zA-Z\.:\-_0-9]+(?=\/|$)/.exec(config.url);
      if (result && result.length > 0) {
        const context = result[0];
        if (context.startsWith('rootContext:')) {
          const { groupName, clusterName } = this.options.instance;

          const serviceName = context.replace('rootContext:', '');
          const uri = await this.getServiceUri(serviceName, groupName, clusterName);
          config.url = config.url.replace(context, uri);
        }
      }

      return config;
    });
  }

  /**
   * 应用程序启动钩子，应用程序启动时执行服务注册
   */
  public async onApplicationBootstrap(): Promise<void> {
    await this.register();
  }

  /**
   * 应用程序关闭钩子，应用程序关闭时执行服务注销
   */
  public async onApplicationShutdown(): Promise<void> {
    await this.deregister();
  }

  //#endregion
}
