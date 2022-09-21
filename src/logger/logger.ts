import { Logger as NestLogger } from '@nestjs/common';
import { format } from 'util';

enum LoggerLevel {
  error = 0,
  warn = 1,
  info = 2,
  debug = 3,
}

export class Logger {
  private readonly logger: NestLogger;
  private readonly level: LoggerLevel;

  constructor(context: string, level?: string) {
    this.logger = new NestLogger(context);
    this.level = LoggerLevel[level || 'info'];
  }

  info(message: any, ...optionalParams: any[]): void {
    if (this.level < LoggerLevel.info) return;

    this.logger.log(format(message, ...optionalParams));
  }

  log(message: any, ...optionalParams: any[]): void {
    if (this.level < LoggerLevel.info) return;

    this.logger.log(format(message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]): void {
    if (this.level < LoggerLevel.warn) return;

    this.logger.warn(format(message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]): void {
    if (this.level < LoggerLevel.error) return;

    this.logger.error(format(message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]): void {
    if (this.level < LoggerLevel.debug) return;

    this.logger.debug(format(message, ...optionalParams));
  }

  Console: NodeJS.ConsoleConstructor;

  assert(): void {
    throw new Error('Method not implemented.');
  }

  clear(): void {
    throw new Error('Method not implemented.');
  }

  count(): void {
    throw new Error('Method not implemented.');
  }

  countReset(): void {
    throw new Error('Method not implemented.');
  }

  dir(): void {
    throw new Error('Method not implemented.');
  }

  dirxml(): void {
    throw new Error('Method not implemented.');
  }

  group(): void {
    throw new Error('Method not implemented.');
  }

  groupCollapsed(): void {
    throw new Error('Method not implemented.');
  }

  groupEnd(): void {
    throw new Error('Method not implemented.');
  }

  table(): void {
    throw new Error('Method not implemented.');
  }

  time(): void {
    throw new Error('Method not implemented.');
  }

  timeEnd(): void {
    throw new Error('Method not implemented.');
  }

  timeLog(): void {
    throw new Error('Method not implemented.');
  }

  timeStamp(): void {
    throw new Error('Method not implemented.');
  }

  trace(): void {
    throw new Error('Method not implemented.');
  }

  profile(): void {
    throw new Error('Method not implemented.');
  }

  profileEnd(): void {
    throw new Error('Method not implemented.');
  }
}
