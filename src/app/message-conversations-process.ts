import { appSourceConfig } from '../configs';
import { Dhis2MessageConversationsUtil, LogsUtil } from '../utils';

export class MessageConversationsProcess {
  private _dhis2MessageConversationsUtil: Dhis2MessageConversationsUtil;

  constructor() {
    this._dhis2MessageConversationsUtil = new Dhis2MessageConversationsUtil(
      appSourceConfig.username,
      appSourceConfig.password,
      appSourceConfig.baseUrl
    );
  }

  async startMessageonversationAnalysisProcess(
    startDate: string,
    endDate: string
  ) {
    try {
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Message Conversations Process'
      );
    }
  }
}
