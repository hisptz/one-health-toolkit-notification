import { appSourceConfig } from '../configs';
import { Dhis2DataValue, Dhis2MessageConversation } from '../models';
import {
  AppUtil,
  Dhis2MessageConversationsUtil,
  LogsUtil,
  Dhis2DataValueUtil
} from '../utils';

export class MessageConversationsProcess {
  private _dhis2MessageConversationsUtil: Dhis2MessageConversationsUtil;
  private _dhis2DataValueUtil: Dhis2DataValueUtil;

  constructor() {
    this._dhis2DataValueUtil = new Dhis2DataValueUtil(
      appSourceConfig.username,
      appSourceConfig.password,
      appSourceConfig.baseUrl
    );
    this._dhis2MessageConversationsUtil = new Dhis2MessageConversationsUtil(
      appSourceConfig.username,
      appSourceConfig.password,
      appSourceConfig.baseUrl
    );
  }

  _getIsoWeekForNotification(startDate: string, endDate: string) {
    return AppUtil.getISOWeekFromDate(
      new Date(
        (new Date(startDate).getTime() + new Date(endDate).getTime()) / 2
      )
    );
  }

  async startMessageonversationAnalysisProcess(
    startDate: string,
    endDate: string
  ) {
    try {
      await new LogsUtil().addLogs(
        'info',
        `Start message conversation analysis process from ${startDate} to ${endDate}`,
        'Message Conversations Process'
      );
      const isoWeek = this._getIsoWeekForNotification(startDate, endDate);
      const messageConversations: Dhis2MessageConversation[] =
        await this._dhis2MessageConversationsUtil.getMessageConversations(
          startDate,
          endDate
        );
      const dhis2DataValues: Dhis2DataValue[] =
        await this._dhis2MessageConversationsUtil.getTransformedMessageConversationsToDataValues(
          messageConversations,
          isoWeek
        );
      const aggregatedDataValues: Dhis2DataValue[] =
        await this._dhis2DataValueUtil.getAggregatedDatavalues(dhis2DataValues);
      if (aggregatedDataValues.length > 0) {
        await this._dhis2DataValueUtil.syncDataValues(aggregatedDataValues);
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Message Conversations Process'
      );
    }
  }
}
