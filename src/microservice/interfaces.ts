import { ModuleMetadata } from '@nestjs/common';
import { LoggerLevelOptions } from '../logger';

/**
 * 配置服务的配置选项
 */
export interface ConfigServiceOptions extends LoggerLevelOptions {
  endpoint?: string;
  serverPort?: number;
  namespace?: string;
  accessKey?: string;
  secretKey?: string;
  appName?: string;
  ssl?: boolean;
  refreshInterval?: number;
  clusterName?: string;
  requestTimeout?: number;
  defaultEncoding?: string;
  serverAddr?: string;
  nameServerAddr?: string;
  identityKey?: string;
  identityValue?: string;
  endpointQueryParams?: string;
  dataId?: string;
  group?: string;
  parser?: (data: string) => any;
}

/**
 * 配置服务的配置选项
 */
export interface ConfigServiceAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<ConfigServiceOptions> | ConfigServiceOptions;
  inject?: any[];
}

/**
 * 服务实例注册的配置选项
 */
export interface RegisterInstanceOptions {
  serviceName: string;
  groupName: string;
  ip?: string;
  port: number;
  weight?: number;
  ephemeral?: boolean;
  clusterName?: string;
}

/**
 * 服务发现的配置选项
 */
export interface DiscoveryOptions extends LoggerLevelOptions {
  serverList: string | string[];
  namespace: string;
  instance: RegisterInstanceOptions;
}

/**
 * 服务发现的配置选项
 */
export interface DiscoveryAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<DiscoveryOptions> | DiscoveryOptions;
  inject?: any[];
}

/**
 * 服务实例详细信息
 */
export interface ServiceInstance {
  instanceId: string;
  clusterName: string;
  serviceName: string;
  ip: string;
  port: number;
  weight: number;
  ephemeral: boolean;
  enabled: boolean;
  healthy: boolean;
  metadata: { [key: string]: string };
}
