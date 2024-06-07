import { ValidationRuleProcess } from '.';
import { DHIS2_VALIDATION_RULE_CONSTANT } from '../configs';
import { AppUtil, LogsUtil } from '../utils';

export class AppProcess {
  private _validationRuleProcess: ValidationRuleProcess;

  constructor() {
    this._validationRuleProcess = new ValidationRuleProcess();
  }

  async startProcess() {
    try {
      const { startDate, endDate } = this._getStartAndEndDateForNotifications();
      await this._validationRuleProcess.startValidationRuleNotificationTriggerProcess(
        startDate,
        endDate
      );
      //TODO handling for notification counts from email sent
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'App Process'
      );
    }
  }

  _getStartAndEndDateForNotifications() {
    const endDate = AppUtil.getFormattedDate(new Date());
    const startDate = AppUtil.getFormattedDate(
      new Date(
        new Date().setDate(
          new Date().getDate() -
            DHIS2_VALIDATION_RULE_CONSTANT.defaultNumberOfDays
        )
      )
    );
    return { startDate, endDate };
  }
}
