import { HttpService, Injectable } from '@nestjs/common';
import { Config } from 'infra-nestjs';
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
    const profile = await this.httpService.get('/api/4.0/Profile', {baseURL: 'http://rootContext:metadata'})
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
      profile: profile,
    };
  }
}
