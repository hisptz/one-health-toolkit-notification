import { flattenDeep } from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import { Dhis2MessageConversation } from '../models';

export class Dhis2MessageConversationsUtil {
  private _url: string;
  private _headers: { 'Content-Type': string; Authorization: string };

  constructor(username: string, password: string, baseUrl: string) {
    this._url = baseUrl;
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
  }

  async getMessageConversations(
    startDate: string,
    endDate: string
  ): Promise<Dhis2MessageConversation[]> {
    let messageConversations: Dhis2MessageConversation[] = [];
    try {
      await new LogsUtil().addLogs(
        'info',
        `Discovering message conversations from ${startDate} to ${endDate}`,
        'Dhis2MessageConversationsUtil'
      );
      const filter = `filter=messageType:eq:SYSTEM&filter=lastMessage:gt:${startDate}`;
      const fields = `fields=subject,displayName,lastMessage,messages[text]`;
      const response: any = await HttpUtil.getHttp(
        this._headers,
        `${this._url}/api/messageConversations?${filter}&${fields}&paging=false`
      );
      messageConversations =
        response.messageConversations ?? messageConversations;
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Dhis2MessageConversationsUtil'
      );
    }
    return flattenDeep(messageConversations);
  }
}
