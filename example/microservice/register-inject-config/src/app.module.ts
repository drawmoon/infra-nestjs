import { Module, HttpModule } from '@nestjs/common';
import { ConfigurationModule, DiscoveryModule } from 'infra-nestjs/dist/microservice';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
