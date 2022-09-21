import assert = require('assert');
import { networkInterfaces } from 'os';
import * as stripJsonComments from 'strip-json-comments';

export function getCurrentIPAdress(): string {
  const networks = networkInterfaces();
  const [ip] = Object.values(networks)
    .flat()
    .filter((x) => x?.family === 'IPv4' && !x.internal)
    .map((x) => x?.address);

  assert.ok(ip, 'ip must not be null!');

  return ip;
}

export function defaultJsonParser(data: string): any {
  if (!data) return undefined;

  return JSON.parse(stripJsonComments(data), (key, value) => {
    // 处理日期格式字符串
    if (typeof value === 'string' && /^\d\d\d\d-\d\d-\d\dT|\s\d\d:\d\d:\d\d(\.\d\d\d)?Z?$/.test(value)) {
      return new Date(value);
    }

    return value;
  });
}
