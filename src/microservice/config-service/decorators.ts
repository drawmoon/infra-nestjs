import { MSVC_CONFIGURATION_METADATA, MSVC_CONFIGURATION_CLIENT_METADATA } from '../constants';

export function Config(): any {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.set(target, propertyKey, null);
    Reflect.defineMetadata(MSVC_CONFIGURATION_METADATA, true, target, propertyKey);
  };
}

export function ConfigClient(): any {
  return (target: any, propertyKey: string | symbol) => {
    Reflect.set(target, propertyKey, null);
    Reflect.defineMetadata(MSVC_CONFIGURATION_CLIENT_METADATA, true, target, propertyKey);
  };
}
