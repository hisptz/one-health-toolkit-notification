import { appSourceConfig } from '../configs';
import { Dhis2DataValueUtil, Dhis2ValidationUtil, LogsUtil } from '../utils';

export class ValidationRuleProcess {
  private _dhis2DataValueUtil: Dhis2DataValueUtil;
  private _dhis2ValidationUtil: Dhis2ValidationUtil;

  constructor() {
    this._dhis2ValidationUtil = new Dhis2ValidationUtil(
      appSourceConfig.username,
      appSourceConfig.password,
      appSourceConfig.baseUrl
    );
    this._dhis2DataValueUtil = new Dhis2DataValueUtil(
      appSourceConfig.username,
      appSourceConfig.password,
      appSourceConfig.baseUrl
    );
  }

  async startValidationRuleNotificationTriggerProcess() {
    try {
      await new LogsUtil().addLogs(
        'info',
        `Start of validation rule trigger process`,
        'App process'
      );
      //TODO handle logics
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'AppProcess'
      );
    }
  }
}
