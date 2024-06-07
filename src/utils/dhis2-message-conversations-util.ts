import { AppUtil } from '.';

export class Dhis2MessageConversationsUtil {
  private _url: string;
  private _headers: { 'Content-Type': string; Authorization: string };

  constructor(username: string, password: string, baseUrl: string) {
    this._url = baseUrl;
    this._headers = AppUtil.getHttpAuthorizationHeader(username, password);
  }

  //TODO smaple url messageConversations?filter=messageType:eq:SYSTEM&filter=lastMessage:gt:2024-06-05&fields=subject,displayName,lastMessage,messages[text]
}
