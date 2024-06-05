import { appSourceConfig } from '../configs';
import {
  Dhis2DataValueUtil,
  Dhis2ValidationRuleUtil,
  LogsUtil
} from '../utils';

export class ValidationRuleProcess {
  private _dhis2DataValueUtil: Dhis2DataValueUtil;
  private _dhis2ValidationRuleUtil: Dhis2ValidationRuleUtil;

  constructor() {
    this._dhis2ValidationRuleUtil = new Dhis2ValidationRuleUtil(
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
      console.log('here');
      // run predictors
      /// get ou for validations
      //for each ou trigger and count notifications
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'AppProcess'
      );
    }
  }
}
