# infra-nestjs

[![NPM Version][npm-image]][npm-url]

Infrastructure lib of nestjs.

## Getting Started

Install infra-nestjs using npm:

```bash
npm install infra-nestjs
```

Or yarn:

```bash
yarn add infra-nestjs
```

### Microservice

#### Service Discovery

Registry service instance:

```javascript
@Module({
  imports: [
    DiscoveryModule.register({
      serverList: '127.0.0.1:8848',
      namespace: 'public',
      instance: {
        serviceName: 'myapp',
        groupName: 'DEFAULT_GROUP',
        port: 3000,
      },
    }),
  ],
})
export class AppModule { }
```

Using ConfigService:

```javascript
@Module({
  imports: [
    ConfigModule.forRoot(), // first we need to import the ConfigModule.
    DiscoveryModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        serverList: configService.get<string>('NACOS_SERVER', '127.0.0.1:8848'),
        namespace: configService.get<string>('NACOS_NAMESPACE', 'public'),
        instance: {
          serviceName: configService.get<string>('NACOS_APP_NAME', 'myapp'),
          groupName: configService.get<string>('NACOS_GROUP_NAME', 'DEFAULT_GROUP'),
          port: configService.get<number>('APP_PORT', 3000),
        },
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
export class AppModule { }
```

#### Config Service

Get config:

```javascript
@Module({
  imports: [
    ConfigurationModule.register({
      serverAddr: '127.0.0.1:8848',
      namespace: 'public',
      dataId: 'myapp.json',
      group: 'DEFAULT_GROUP',
      accessKey: 'nacos',
      secretKey: 'nacos',
    }),
  ],
})
export class AppModule { }
```

Using ConfigService:

```javascript
@Module({
  imports: [
    ConfigModule.forRoot(), // first we need to import the ConfigModule.
    ConfigurationModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        serverAddr: configService.get<string>('NACOS_CONFIG_SERVER', '127.0.0.1:8848'),
        namespace: configService.get<string>('NACOS_CONFIG_NAMESPACE', 'public'),
        dataId: configService.get<string>('NACOS_CONFIG_DATA_ID', 'myapp.json'),
        group: configService.get<string>('NACOS_CONFIG_GROUP', 'DEFAULT_GROUP'),
        accessKey: configService.get<string>('NACOS_CONFIG_USERNAME', 'nacos'),
        secretKey: configService.get<string>('NACOS_CONFIG_PASSWORD', 'nacos'),
      }),
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
export class AppModule { }
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/infra-nestjs.svg
[npm-url]: https://npmjs.org/package/infra-nestjs