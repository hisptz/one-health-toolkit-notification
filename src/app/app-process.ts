import { flattenDeep, map, uniq, filter } from 'lodash';
import { appSourceConfig } from '../configs';
import { Dhis2DataValue } from '../models';
import { Dhis2DataValueUtil, LogsUtil } from '../utils';

export class AppProcess {
  private _dhis2DataValueUtil: Dhis2DataValueUtil;

  constructor() {
    this._dhis2DataValueUtil = new Dhis2DataValueUtil(
      appSourceConfig.username,
      appSourceConfig.password,
      appSourceConfig.baseUrl
    );
  }

  async startValidationTriggerProcess() {
    try {
      await new LogsUtil().addLogs(
        'info',
        `Start of validation trigger process`,
        'App process'
      );
      //TODO handling this process
      console.log('handle this process');
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'AppProcess'
      );
    }
  }
}
