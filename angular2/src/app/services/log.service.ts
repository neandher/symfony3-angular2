import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

@Injectable()
export class LogService {

  writeLog(logMessage: Response | any) {

    let logMsg: string;

    if (logMessage instanceof Response) {
      const body = logMessage.json() || '';
      const err = body.error || JSON.stringify(body);
      logMsg = `${logMessage.status} - ${logMessage.statusText || ''} ${err}`;
    } else {
      logMsg = logMessage.message ? logMessage.message : logMessage.toString();
    }

    console.error(logMsg);
    return Observable.throw(logMsg);
  }

}
