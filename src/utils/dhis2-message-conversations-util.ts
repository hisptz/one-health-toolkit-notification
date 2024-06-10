import {
  flattenDeep,
  split,
  join,
  filter,
  toLower,
  last,
  trim,
  first
} from 'lodash';
import { AppUtil, HttpUtil, LogsUtil } from '.';
import {
  Dhis2DataValue,
  Dhis2MessageConversation,
  Dhis2NotificationMapping
} from '../models';
import {
  DHIS2_NOTIFICATION_MAPPING_CONSTANT,
  DHIS2_MESSAGE_CONVERSATION_CONSTANT
} from '../configs';

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

  async getTransformedMessageConversationsToDataValues(
    messageConversations: Dhis2MessageConversation[],
    isoWeek: string
  ): Promise<Dhis2DataValue[]> {
    const dhis2DataValues: Dhis2DataValue[] = [];
    try {
      const notificationMappings: Dhis2NotificationMapping[] = filter(
        DHIS2_NOTIFICATION_MAPPING_CONSTANT,
        (config: Dhis2NotificationMapping) =>
          config.notificationSubjectPattern !== ''
      );
      for (const messageConversation of messageConversations) {
        const { messages, subject } = messageConversation;
        for (const message of messages) {
          const formttedText = join(split(message.text ?? '', '\n'), ' ');
          for (const notificationMapping of notificationMappings) {
            const { dataElement, diseasePattern, notificationSubjectPattern } =
              notificationMapping;
            if (
              toLower(subject).includes(toLower(notificationSubjectPattern)) &&
              toLower(formttedText).includes(toLower(diseasePattern))
            ) {
              const caseId: any =
                this._getCaseIdFromNotificationMessage(formttedText);
              const orgUnit = await this.getCaseOrganisationUnitByCaseId(
                caseId
              );
              dhis2DataValues.push({
                dataElement,
                period: isoWeek,
                orgUnit,
                value: 1
              });
            }
          }
        }
      }
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Dhis2MessageConversationsUtil'
      );
    }
    return flattenDeep(dhis2DataValues);
  }

  async getCaseOrganisationUnitByCaseId(caseId: string): Promise<string> {
    let orgUnit = '';
    try {
      const filter = `ouMode=ACCESSIBLE&program=${DHIS2_MESSAGE_CONVERSATION_CONSTANT.program}&attribute=${DHIS2_MESSAGE_CONVERSATION_CONSTANT.filterAttribute}:EQ:${caseId}&paging=false`;
      const fields = `fields=orgUnit`;
      const response: any = await HttpUtil.getHttp(
        this._headers,
        `${this._url}/api/tracker/trackedEntities?${filter}&${fields}`
      );
      orgUnit = response.instances[0]?.orgUnit ?? orgUnit;
    } catch (error: any) {
      await new LogsUtil().addLogs(
        'error',
        error.message || error,
        'Dhis2MessageConversationsUtil'
      );
    }
    return orgUnit;
  }

  private _getCaseIdFromNotificationMessage(formttedText: string) {
    return formttedText.includes(
      DHIS2_MESSAGE_CONVERSATION_CONSTANT.caseIdReference
    )
      ? first(
          split(
            trim(
              last(
                split(
                  formttedText,
                  DHIS2_MESSAGE_CONVERSATION_CONSTANT.caseIdReference
                )
              )
            ),
            ' '
          )
        )
      : '';
  }
}
