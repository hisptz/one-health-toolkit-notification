import { ValidationRuleProcess } from '.';
import { LogsUtil } from '../utils';

export class AppProcess {
  private _validationRuleProcess: ValidationRuleProcess;

  constructor() {
    this._validationRuleProcess = new ValidationRuleProcess();
  }

  async startProcess() {
    try {
      await this._validationRuleProcess.startValidationRuleNotificationTriggerProcess();
      //TODO handling for notification counts from email sent
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'App Process'
      );
    }
  }
}
