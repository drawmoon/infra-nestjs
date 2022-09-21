import { HttpService, Injectable } from '@nestjs/common';
import { Config } from '../../../../src/microservice';
import { AppConfig } from './appconfig';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AppService {

  @Config()
  private appConfig: AppConfig;

  constructor(
    private readonly httpService: HttpService,
  ) { }

  async getHello() {
    const metadata = await this.httpService.get('http://rootContext:metadata/api/2.0/metadata/table-field/2/metadataCluster')
      .pipe(
        map((p) => p.data),
        catchError((err) => {
          return of(undefined);
        })
      )
      .toPromise();

    return {
      appname: this.appConfig.appName,
      version: this.appConfig.version,
      metadata: metadata,
    };
  }
}
