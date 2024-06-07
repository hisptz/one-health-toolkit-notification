import { MessageConversationsProcess, ValidationRuleProcess } from '.';
import { DHIS2_VALIDATION_RULE_CONSTANT } from '../configs';
import { AppUtil, LogsUtil } from '../utils';

export class AppProcess {
  private _validationRuleProcess: ValidationRuleProcess;
  private _messageConversationsProcess: MessageConversationsProcess;

  constructor() {
    this._validationRuleProcess = new ValidationRuleProcess();
    this._messageConversationsProcess = new MessageConversationsProcess();
  }

  async startProcess() {
    try {
      const { startDate, endDate } = this._getStartAndEndDateForNotifications();
      await this._validationRuleProcess.startValidationRuleNotificationTriggerProcess(
        startDate,
        endDate
      );
      await this._messageConversationsProcess.startMessageonversationAnalysisProcess(
        startDate,
        endDate
      );
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
        new Date(endDate).setDate(
          new Date(endDate).getDate() -
            DHIS2_VALIDATION_RULE_CONSTANT.defaultNumberOfDays
        )
      )
    );
    return { startDate, endDate };
  }
}
