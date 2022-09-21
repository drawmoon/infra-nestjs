import { Module, HttpModule } from '@nestjs/common';
import { ConfigurationModule, DiscoveryModule } from 'infra-nestjs/dist/microservice';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    ConfigurationModule.register({
      serverAddr: '127.0.0.1:8848',
      namespace: 'public',
      dataId: 'myapp.json',
      group: 'DEFAULT_GROUP',
      accessKey: 'nacos',
      secretKey: 'nacos',
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
